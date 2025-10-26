// H3 Aspis - AI Analyzer
// Gemini Nano prompts and analysis logic

/**
 * Create analysis prompt for Gemini Nano based on data and user tier
 * @param {Object} data - Address data (type, balance, txCount, etc.)
 * @param {string} tier - User tier ('free' or 'paid')
 * @param {boolean} sanctionsHit - Whether address is in sanctions list
 * @returns {string} Formatted prompt
 */
export function createAnalysisPrompt(data, tier = 'free', sanctionsHit = false) {
  const { address, type, balance, txCount, contractData, goPlusData, sanctionsData } = data;
  
  // Base prompt structure
  let prompt = `You are a Web3 security analyst. Analyze this ${type} address and provide a risk assessment.\n\n`;
  
  // Add address info
  prompt += `Address: ${address}\n`;
  prompt += `Type: ${type === 'contract' ? 'Smart Contract' : 'Wallet (EOA)'}\n`;
  
  if (balance) {
    prompt += `Balance: ${balance} ETH\n`;
  }
  
  if (txCount !== undefined) {
    prompt += `Transaction Count: ${txCount}\n`;
  }
  
  // Add sanctions check result
  if (sanctionsHit && sanctionsData) {
    prompt += `\n⚠️ SANCTIONS LIST MATCH:\n`;
    prompt += `- Entity: ${sanctionsData.label || 'Unknown'}\n`;
    prompt += `- Source: ${sanctionsData.source || 'Unknown'}\n`;
    if (sanctionsData.reason) {
      prompt += `- Reason: ${sanctionsData.reason}\n`;
    }
  }
  
  // Contract-specific data
  if (type === 'contract' && contractData) {
    prompt += `\nContract Information:\n`;
    
    if (contractData.isVerified) {
      prompt += `- Verification: ✓ Verified\n`;
      if (contractData.contractName) {
        prompt += `- Name: ${contractData.contractName}\n`;
      }
    } else {
      prompt += `- Verification: ✗ Not Verified (HIGH RISK)\n`;
    }
    
    // Add source code snippet for analysis (if available and tier allows)
    if (tier === 'paid' && contractData.sourceCode && contractData.sourceCode.length > 0) {
      const snippet = contractData.sourceCode.substring(0, 2000); // Limit to 2000 chars
      prompt += `\nSource Code Snippet:\n\`\`\`solidity\n${snippet}\n\`\`\`\n`;
    }
  }
  
  // GoPlus Security Data (if available)
  if (goPlusData && goPlusData.details) {
    prompt += `\n## GoPlus Security Analysis:\n`;
    prompt += `- Risk Score: ${goPlusData.riskScore}/100\n`;
    prompt += `- Status: ${goPlusData.status}\n`;
    
    if (goPlusData.details.isHoneypot) {
      prompt += `- ⚠️ HONEYPOT DETECTED\n`;
    }
    
    if (goPlusData.details.tokenName) {
      prompt += `- Token: ${goPlusData.details.tokenName} (${goPlusData.details.tokenSymbol})\n`;
    }
    
    if (goPlusData.flags && goPlusData.flags.length > 0) {
      prompt += `- Flags: ${goPlusData.flags.join(', ')}\n`;
    }
    
    if (goPlusData.details.taxes) {
      prompt += `- Tax: Buy ${goPlusData.details.taxes.buy}%, Sell ${goPlusData.details.taxes.sell}%\n`;
    }
    
    prompt += `- Holders: ${goPlusData.details.holders.total}\n`;
  }
  
  // Tier-specific analysis instructions
  if (tier === 'paid') {
    prompt += `\n## Deep Analysis Required:\n`;
    prompt += `- Check for common vulnerabilities (reentrancy, overflow, etc.)\n`;
    prompt += `- Analyze unusual patterns in transaction history\n`;
    prompt += `- Assess honeypot indicators\n`;
    prompt += `- Check ownership concentration\n`;
    prompt += `- Verify against known scam patterns\n`;
  } else {
    prompt += `\n## Basic Analysis:\n`;
    prompt += `- Determine if address appears safe or suspicious\n`;
    prompt += `- Note any obvious red flags\n`;
    prompt += `- Provide general risk level\n`;
  }
  
  // Output format instructions
  prompt += `\n## Required Output Format (JSON only):\n`;
  prompt += `{\n`;
  prompt += `  "status": "green" | "yellow" | "red" | "blue",\n`;
  prompt += `  "risk_level": "safe" | "low" | "medium" | "high" | "critical",\n`;
  prompt += `  "summary": "Brief one-line summary",\n`;
  prompt += `  "reason": "Detailed explanation of the risk assessment",\n`;
  prompt += `  "flags": ["flag1", "flag2"],\n`;
  prompt += `  "confidence": 0.0 to 1.0\n`;
  prompt += `}\n\n`;
  
  prompt += `Status meanings:\n`;
  prompt += `- green: Safe/verified contract or legitimate wallet\n`;
  prompt += `- blue: Informational (known contract, exchange, etc.)\n`;
  prompt += `- yellow: Suspicious/warning signs detected\n`;
  prompt += `- red: Dangerous/malicious activity confirmed\n\n`;
  
  prompt += `Respond with ONLY the JSON object, no additional text.`;
  
  return prompt;
}

/**
 * Parse and validate Nano AI response
 * @param {string} response - Raw response from Gemini Nano
 * @returns {Object} Parsed analysis result
 */
export function parseAIResponse(response) {
  try {
    // Try to extract JSON from response
    let jsonStr = response.trim();
    
    // Remove markdown code blocks if present
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```\n?$/g, '');
    }
    
    // Parse JSON
    const parsed = JSON.parse(jsonStr);
    
    // Validate required fields
    if (!parsed.status || !parsed.risk_level || !parsed.summary) {
      throw new Error('Missing required fields in AI response');
    }
    
    // Normalize status
    const validStatuses = ['green', 'yellow', 'red', 'blue'];
    if (!validStatuses.includes(parsed.status)) {
      console.warn('[H3 Aspis] Invalid status, defaulting to yellow:', parsed.status);
      parsed.status = 'yellow';
    }
    
    return {
      status: parsed.status,
      riskLevel: parsed.risk_level,
      summary: parsed.summary,
      reason: parsed.reason || parsed.summary,
      flags: parsed.flags || [],
      confidence: parsed.confidence || 0.7
    };
    
  } catch (error) {
    console.error('[H3 Aspis] Error parsing AI response:', error);
    console.error('Raw response:', response);
    
    // Return fallback analysis
    return {
      status: 'yellow',
      riskLevel: 'unknown',
      summary: 'Unable to analyze address',
      reason: 'AI analysis failed. Manual review recommended.',
      flags: ['analysis_error'],
      confidence: 0.0
    };
  }
}

/**
 * Apply tier-based gating to analysis results
 * @param {Object} result - Raw analysis result
 * @param {string} tier - User tier
 * @param {boolean} demoMode - If true, don't gate anything
 * @returns {Object} Gated result
 */
export function applyTierGating(result, tier = 'free', demoMode = true) {
  // In demo mode, show everything
  if (demoMode) {
    return {
      ...result,
      tooltip: result.summary,
      isGated: false
    };
  }
  
  // For paid users, show everything
  if (tier === 'paid') {
    return {
      ...result,
      tooltip: result.summary,
      isGated: false
    };
  }
  
  // For free users, gate red/high-risk results
  if (result.status === 'red' || result.riskLevel === 'high' || result.riskLevel === 'critical') {
    return {
      ...result,
      status: 'yellow', // Downgrade to yellow
      tooltip: '⚠️ Potentially dangerous address detected. Upgrade to H3 Aspis Pro for full security analysis.',
      isGated: true,
      summary: 'Security concerns detected - Upgrade for details',
      reason: 'This address has been flagged by our security system. Upgrade to H3 Aspis Pro to see the full analysis and protect yourself from potential threats.'
    };
  }
  
  // Green, blue, and yellow warnings are shown to everyone
  return {
    ...result,
    tooltip: result.summary,
    isGated: false
  };
}

/**
 * Create a fallback analysis when AI is unavailable
 * @param {string} address
 * @param {string} type
 * @param {boolean} sanctionsHit
 * @returns {Object}
 */
export function createFallbackAnalysis(address, type, sanctionsHit = false) {
  if (sanctionsHit) {
    return {
      status: 'red',
      riskLevel: 'critical',
      summary: '🚫 Address on sanctions list',
      reason: 'This address has been identified on a sanctions or malicious actors list.',
      flags: ['sanctions_list'],
      confidence: 1.0,
      tooltip: 'CRITICAL: This address is on a sanctions list. Avoid all interactions.'
    };
  }
  
  if (type === 'contract') {
    return {
      status: 'blue',
      riskLevel: 'unknown',
      summary: 'Smart contract detected',
      reason: 'This is a smart contract. Exercise caution and verify the contract before interacting.',
      flags: ['contract'],
      confidence: 0.5,
      tooltip: 'Smart Contract - Review before interacting'
    };
  }
  
  return {
    status: 'blue',
    riskLevel: 'unknown',
    summary: 'Wallet address detected',
    reason: 'Standard wallet address. No immediate risk indicators.',
    flags: ['wallet'],
    confidence: 0.5,
    tooltip: 'Wallet Address - Standard EOA'
  };
}

