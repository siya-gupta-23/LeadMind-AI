const User = require("../models/User");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/emailService");

// ADMIN INVITES EMPLOYEE 

const inviteEmployee = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({
        success: false,
        message: "Email and role are required",
      });
    }

    const allowedRoles = ["sales_executive"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be sales_executive",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "This email is already invited or registered",
      });
    }

    // Placeholder password - user will set their own real password during signup
    const placeholderPassword = crypto.randomBytes(20).toString("hex");

    const invitedUser = await User.create({
      name: "Pending Invite",
      email,
      password: placeholderPassword,
      role,
      isInvited: true,
      isEmailVerified: false,
    });

    await sendEmail(
      email,
      "You've Been Invited to LeadMind",
      `You have been invited to join LeadMind as a ${role}. Please sign up using this email address at our signup page to complete your account setup.`,
    );

    res.status(201).json({
      success: true,
      message: "Employee invited successfully",
      user: {
        id: invitedUser._id,
        email: invitedUser.email,
        role: invitedUser.role,
      },
    });
  } catch (error) {
    console.log("INVITE EMPLOYEE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// SIGNUP (ONLY FOR INVITED EMAILS)

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(403).json({
        success: false,
        message: "You have not been invited. Please contact your admin.",
      });
    }

    if (!existingUser.isInvited) {
      return res.status(403).json({
        success: false,
        message: "You have not been invited. Please contact your admin.",
      });
    }

    if (existingUser.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "This account is already set up. Please login.",
      });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    existingUser.name = name;
    existingUser.password = password; // pre-save hook will re-hash this
    existingUser.otp = otp;
    existingUser.otpExpiresAt = otpExpiresAt;

    await existingUser.save();

    await sendEmail(
      email,
      "LeadMind Email Verification OTP",
      `Your LeadMind verification OTP is ${otp}. This OTP will expire in 10 minutes.`,
    );

    res.status(201).json({
      success: true,
      message: "Signup successful. Please verify your email with the OTP.",
    });
  } catch (error) {
    console.log("SIGNUP ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// VERIFY OTP

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.log("VERIFY OTP ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// RESEND OTP 

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;

    await user.save();

    await sendEmail(
      email,
      "LeadMind New Verification OTP",
      `Your new LeadMind verification OTP is ${otp}. This OTP will expire in 10 minutes.`,
    );

    res.status(200).json({
      success: true,
      message: "New OTP sent successfully",
    });
  } catch (error) {
    console.log("RESEND OTP ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// LOGIN

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Contact your admin.",
      });
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// DEACTIVATE / ACTIVATE EMPLOYEE 
 

const deactivateEmployee = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Cannot deactivate an admin",
      });
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Employee deactivated successfully",
    });
  } catch (error) {
    console.log("DEACTIVATE EMPLOYEE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const activateEmployee = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isActive = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Employee activated successfully",
    });
  } catch (error) {
    console.log("ACTIVATE EMPLOYEE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
//GET ALL EMPLOYEES WITH LEAD COUNTS 

const getEmployees = async (req, res) => {
  try {
    const Lead = require("../models/Lead");

    const employees = await User.find({ role: "sales_executive" }).select(
      "name email isActive isEmailVerified createdAt"
    );

    const employeesWithCounts = await Promise.all(
      employees.map(async (emp) => {
        const totalLeads = await Lead.countDocuments({ assignedTo: emp._id });
        const wonLeads = await Lead.countDocuments({ assignedTo: emp._id, status: "won" });

        return {
          _id: emp._id,
          name: emp.name,
          email: emp.email,
          isActive: emp.isActive,
          isEmailVerified: emp.isEmailVerified,
          createdAt: emp.createdAt,
          totalLeads,
          wonLeads,
        };
      })
    );

    const unassignedCount = await Lead.countDocuments({ assignedTo: null });

    res.status(200).json({
      success: true,
      employees: employeesWithCounts,
      unassignedCount,
    });
  } catch (error) {
    console.log("GET EMPLOYEES ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  signup,
  verifyOtp,
  login,
  resendOtp,
  inviteEmployee,
  deactivateEmployee,
  activateEmployee,
  getEmployees,
};