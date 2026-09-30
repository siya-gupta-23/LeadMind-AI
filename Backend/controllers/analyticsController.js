const Lead = require("../models/Lead");
const mongoose = require("mongoose");

const getPipelineStats = async (req, res) => {
  try {
    const matchStage = {};
    if (req.user.role === "sales_executive") {
      matchStage.assignedTo = new mongoose.Types.ObjectId(req.user.userId);
    }

    const pipelineStats = await Lead.aggregate([
      { $match: matchStage },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.status(200).json({ success: true, pipelineStats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRevenue = async (req, res) => {
  try {
    const matchStage = { status: "won" };
    if (req.user.role === "sales_executive") {
      matchStage.assignedTo = new mongoose.Types.ObjectId(req.user.userId);
    }

    const revenue = await Lead.aggregate([
      { $match: matchStage },
      { $group: { _id: null, totalRevenue: { $sum: "$value" } } },
    ]);

    res.status(200).json({
      success: true,
      totalRevenue: revenue[0]?.totalRevenue || 0,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getConversionRate = async (req, res) => {
  try {
    const baseFilter = {};
    if (req.user.role === "sales_executive") {
      baseFilter.assignedTo = req.user.userId;
    }

    const totalLeads = await Lead.countDocuments(baseFilter);
    const wonLeads = await Lead.countDocuments({ ...baseFilter, status: "won" });

    const conversionRate = totalLeads ? (wonLeads / totalLeads) * 100 : 0;

    res.status(200).json({
      success: true,
      totalLeads,
      wonLeads,
      conversionRate,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDashboardAnalytics = async (req, res) => {
  try {
    const baseFilter = {};
    const matchStage = {};
    if (req.user.role === "sales_executive") {
      baseFilter.assignedTo = req.user.userId;
      matchStage.assignedTo = new mongoose.Types.ObjectId(req.user.userId);
    }

    const totalLeads = await Lead.countDocuments(baseFilter);
    const wonLeads = await Lead.countDocuments({ ...baseFilter, status: "won" });
    const conversionRate = totalLeads ? (wonLeads / totalLeads) * 100 : 0;

    const revenue = await Lead.aggregate([
      { $match: { ...matchStage, status: "won" } },
      { $group: { _id: null, totalRevenue: { $sum: "$value" } } },
    ]);

    const pipelineStats = await Lead.aggregate([
      { $match: matchStage },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      totalLeads,
      wonLeads,
      conversionRate,
      totalRevenue: revenue[0]?.totalRevenue || 0,
      pipelineStats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPipelineStats,
  getRevenue,
  getConversionRate,
  getDashboardAnalytics,
};