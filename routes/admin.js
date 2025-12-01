import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import Admin from "../models/Admin.js";
import MembershipRequest from "../models/MembershipRequest.js";
import Member from "../models/Member.js";
import User from "../models/User.js"; // if you want to create login accounts for approved members

const router = express.Router();

// Helper middleware: requireAdmin (checks session)
function requireAdmin(req, res, next) {
  if (req.session && req.session.admin && req.session.admin.username) return next();
  return res.redirect("/admin/login");
}

// --- Admin login pages ---
router.get("/login", (req, res) => {
  if (req.session && req.session.admin) return res.redirect("/admin/requests");
  res.render("admin/login", { error: null });
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.render("admin/login", { error: "Invalid credentials" });

    const authSuccess = await admin.validatePassword(password);
    if (!authSuccess) return res.render("admin/login", { error: "Invalid credentials" });

    // successful login -> create admin session
    req.session.regenerate(err => {
      if (err) return res.status(500).send("Server error");
      req.session.admin = { id: admin._id.toString(), username: admin.username, name: admin.name };
      req.session.save(() => res.redirect("/admin/home")); //!! corrected redirect to /admin/home from /admin/requests  
    });
  } catch (err) {
    console.error("admin login error:", err);
    return res.render("admin/login", { error: "Server error" });
	
  }
});

router.get("/logout", requireAdmin, (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("eyecan.sid");
    res.redirect("/admin/login");
  });
});

// --- List pending membership requests ---
router.get("/requests", requireAdmin, async (req, res) => {
  const list = await MembershipRequest.find({ status: "pending" }).sort({ createdAt: -1 }).lean();
  res.render("admin/requests", { requests: list, admin: req.session.admin });
});

// --- View single request ---
router.get("/requests/:id", requireAdmin, async (req, res) => {
  const id = req.params.id;
  const doc = await MembershipRequest.findById(id).lean();
  if (!doc) return res.redirect("/admin/requests");
  res.render("admin/request-details", { reqDoc: doc, admin: req.session.admin });
});

// --- Approve a request (transaction) ---
router.post("/requests/:id/approve", requireAdmin, async (req, res) => {
  const id = req.params.id;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const reqDoc = await MembershipRequest.findById(id).session(session);
    if (!reqDoc) throw new Error("Request not found");

    // optionally check for duplicate email before approving
    const existingMember = await Member.findOne({ email: reqDoc.email }).session(session);
    if (existingMember) throw new Error("A member with this email already exists");

    // create User account for member (if email provided)
    let user = null;
    if (reqDoc.email && reqDoc.passwordHash) {
      user = await User.create([{
        userEmail: reqDoc.email,
        passwordHash: reqDoc.passwordHash,
        role: "Society Member" // add member id auto population 
      }], { session }).then(arr => arr[0]);
    }

    // create member
    const member = await Member.create([{
      name: reqDoc.name,
      email: reqDoc.email,
      phone: reqDoc.phone,
      qualification: reqDoc.qualification,
      designation: reqDoc.designation,
      institution: reqDoc.institution,
      address: reqDoc.address,
      category: reqDoc.category,
      paymentMode: reqDoc.paymentMode,
      source: reqDoc.source,
      user: user ? user._id : null,
      files: reqDoc.files
    }], { session }).then(arr => arr[0]);

    // delete request
    await MembershipRequest.deleteOne({ _id: id }).session(session);

    await session.commitTransaction();
    session.endSession();

    // optionally email member about approval here

    return res.redirect("/admin/requests");
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("approve error:", err);
    return res.status(400).send(err.message || "Error approving request");
  }
});

// --- Reject a request (set status or delete) ---
router.post("/requests/:id/reject", requireAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    await MembershipRequest.findByIdAndUpdate(id, { status: "rejected" });
    // optionally keep rejected docs for audit; or delete and remove files
    return res.redirect("/admin/requests");
  } catch (err) {
    console.error("reject error:", err);
    return res.status(500).send("Error");
  }
});

export default router;