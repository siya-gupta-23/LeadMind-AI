const Lead = require("../models/Lead");

// CREATE
const createLead = async (req, res) => {
  try {
    const { name, email, phone, company, source, value, status } = req.body;

    // Basic validation
    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    // Duplicate email check
    const existing = await Lead.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "A lead with this email already exists",
      });
    }

    const validStatuses = ["new", "contacted", "interested", "negotiation", "won", "lost"];

    const lead = await Lead.create({
      name,
      email,
      phone,
      company,
      source,
      value: Number(value) || 0,
      status: validStatuses.includes(status) ? status : "new",
      assignedTo: req.user.role === "sales_executive" ? req.user.userId : null,
    });

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      lead,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to create lead",
      error: error.message,
    });
  }
};

// Get all leads OR filter/search/sort/paginate
const getLeads = async (req, res) => {
  try {
    const { status, search, sort, order, page, limit } = req.query;

    const currentPage = Number(page) || 1;
    const currentLimit = Number(limit) || 10;

    const validStatuses = [
      "new",
      "contacted",
      "interested",
      "negotiation",
      "won",
      "lost",
    ];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const filter = {};

    if (status) {
      filter.status = status;
    }

    // Sales executives only see their own leads; admins see everything
    if (req.user.role === "sales_executive") {
      filter.assignedTo = req.user.userId;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    // Sorting — default to newest first
    const sortOption = sort
      ? { [sort]: order === "asc" ? 1 : -1 }
      : { createdAt: -1 };

    const skip = (currentPage - 1) * currentLimit;

    const leads = await Lead.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(currentLimit);

    const total = await Lead.countDocuments(filter);
    const totalPages = Math.ceil(total / currentLimit);

    res.status(200).json({
      success: true,
      total,
      page: currentPage,
      limit: currentLimit,
      totalPages,
      leads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ONE
const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      lead,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE
const updateLead = async (req, res, next) => {
  try {
    const { name, email, phone, company, source, value, status } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (phone !== undefined) updates.phone = phone;
    if (company !== undefined) updates.company = company;
    if (source !== undefined) updates.source = source;
    if (value !== undefined) updates.value = value;
    if (status !== undefined) updates.status = status;

    const lead = await Lead.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      lead,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

// DELETE
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete lead",
      error: error.message,
    });
  }
};

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
};