const analyzeLeadWithAI = async (lead) => {
  try {
    const prompt = `
You are an AI sales assistant for a CRM system.

Analyze this lead:

Name: ${lead.name}
Email: ${lead.email}
Phone: ${lead.phone || "Not provided"}
Company: ${lead.company || "Not provided"}
Source: ${lead.source || "Not provided"}
Deal Value: ${lead.value || 0}
Current Status: ${lead.status}

Return ONLY valid JSON.
Do not use markdown.
Do not add any explanation outside the JSON.

Use exactly this format:

{
  "score": 0,
  "priority": "Low",
  "reason": "short explanation",
  "nextBestAction": "specific sales action"
}

Rules:
- score must be a number between 0 and 100
- priority must be exactly "Low", "Medium", or "High"
- reason should explain why the lead received this score
- nextBestAction should give one practical sales action
`;

    const response = await fetch(
      "http://127.0.0.1:11434/api/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3.2:3b",
          prompt,
          stream: false,
          format: "json",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();

    // AI response ko JSON mein convert karo
    const analysis = JSON.parse(data.response);

    
    // VALIDATION & NORMALIZATION


    // Convert the score to a number 
    const score = Number(analysis.score);

    // Score validate karo
    if (isNaN(score) || score < 0 || score > 100) {
      throw new Error("AI returned an invalid score");
    }

    //Normalize Priority
    const priority = String(analysis.priority || "")
      .trim()
      .toLowerCase();

    const priorityMap = {
      low: "Low",
      medium: "Medium",
      high: "High",
    };

    // validate Priority
    
    if (!priorityMap[priority]) {
      throw new Error("AI returned an invalid priority");
    }

    // Validate Reason
    if (!analysis.reason || typeof analysis.reason !== "string") {
      throw new Error("AI returned an invalid reason");
    }

    // Validate Next Best Action
    if (
      !analysis.nextBestAction ||
      typeof analysis.nextBestAction !== "string"
    ) {
      throw new Error("AI returned an invalid next best action");
    }

    // Clean final result
    return {
      score,
      priority: priorityMap[priority],
      reason: analysis.reason.trim(),
      nextBestAction: analysis.nextBestAction.trim(),
    };
  } catch (error) {
    console.error("AI SERVICE ERROR:", error);
    throw error;
  }
};
const generateFollowUpWithAI = async (lead) => {
  try {
    const prompt = `
You are an AI sales assistant for a CRM system.

Prepare a personalized follow-up for this lead.

Lead details:
Name: ${lead.name}
Email: ${lead.email}
Company: ${lead.company || "Not provided"}
Deal Value: ${lead.value || 0}
Current Status: ${lead.status}

Previous AI insights:
Score: ${lead.aiScore ?? "Not available"}
Priority: ${lead.aiPriority ?? "Not available"}
Reason: ${lead.aiReason ?? "Not available"}
Next Best Action: ${lead.aiNextBestAction ?? "Not available"}

Return ONLY valid JSON in exactly this format:

{
  "channel": "email",
  "subject": "short subject",
  "message": "personalized follow-up message",
  "recommendation": "short recommendation"
}

Rules:
- channel must be "email" or "message"
- Address the lead by name.
- Mention the company if available.
- Consider the current lead status.
- Use the previous AI insight to guide the follow-up.
- Do not mention AI, AI score, or internal CRM information.
- Keep the message professional, friendly and concise.
- Do not make unrealistic promises.
`;

    const response = await fetch(
      "http://127.0.0.1:11434/api/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3.2:3b",
          prompt,
          stream: false,
          format: "json",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();

    const followUp = JSON.parse(data.response);

    return followUp;
  } catch (error) {
    console.error("FOLLOW-UP AI ERROR:", error);
    throw error;
  }
};

module.exports = {
  analyzeLeadWithAI,
  generateFollowUpWithAI,
};