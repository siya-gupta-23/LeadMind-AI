const Lead = require("../models/Lead");

const {
  analyzeLeadWithAI,
  generateFollowUpWithAI,
} = require("../services/aiService");

//  ANALYZE LEAD
const analyzeLead = async (req, res) => {
  try {
    const { leadId } = req.params;

    // 1. Lead find karo
    const lead = await Lead.findById(leadId);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    // 2. Get The analysis from AI service
    const analysis = await analyzeLeadWithAI(lead);

    // 3.  Save the result in MongoDB
    lead.aiScore = analysis.score;
    lead.aiPriority = analysis.priority;
    lead.aiReason = analysis.reason;
    lead.aiNextBestAction = analysis.nextBestAction;

    await lead.save();

    // 4. Response
    res.status(200).json({
      success: true,
      message: "Lead analyzed successfully",
      leadId: lead._id,
      analysis,
    });
  } catch (error) {
    console.error("AI CONTROLLER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to analyze lead",
      error: error.message,
    });
  }
};

// GENERATE FOLLOW-UP

const generateFollowUp = async (req, res) => {
  try {
    // 1. URL se leadId lena
    const { leadId } = req.params;

    // 2. Database se lead find karna
    const lead = await Lead.findById(leadId);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    // 3. Send the lead to the AI service 
    const followUp = await generateFollowUpWithAI(lead);

    // 4. Response
    res.status(200).json({
      success: true,
      message: "Follow-up generated successfully",
      leadId: lead._id,
      followUp,
    });
  } catch (error) {
    console.error("GENERATE FOLLOW-UP ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate follow-up",
      error: error.message,
    });
  }
};

module.exports = {
  analyzeLead,
  generateFollowUp,
};