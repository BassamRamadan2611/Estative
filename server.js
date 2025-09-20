const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Configure Nodemailer (use Gmail with App Password)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bassamramadan964@gmail.com", // your Gmail
    pass: "nmun ekbd qgnh pdja",        // Gmail App Password
  },
});

// Route to handle form submissions
app.post("/submit-form", async (req, res) => {
  try {
    const formData = req.body.formData;

    if (!formData.from_name || !formData.from_email) {
      return res.status(400).json({ success: false, error: "Name and email are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.from_email)) {
      return res.status(400).json({ success: false, error: "Invalid email format" });
    }

    // Email body (HTML template)
  const emailBody = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #2b5876, #4e4376); padding: 20px; text-align: center; color: #fff;">
      <h2 style="margin: 0; font-size: 22px;">📩 New Expo Registration</h2>
    </div>

    <!-- Body -->
    <div style="padding: 20px; color: #333; line-height: 1.6;">
      <p><strong>Name:</strong> ${formData.from_name}</p>
      <p><strong>Email:</strong> <a href="mailto:${formData.from_email}" style="color:#2b5876; text-decoration:none;">${formData.from_email}</a></p>
      <p><strong>Phone:</strong> ${formData.from_phone || "Not provided"}</p>
      <p><strong>Company:</strong> ${formData.company_name || "Not provided"}</p>
      <p><strong>Designation:</strong> ${formData.designation || "Not provided"}</p>
      <p><strong>Category:</strong> <span style="background:#f1f3f6; padding:2px 6px; border-radius:4px;">${formData.category}</span></p>
      <p><strong>Message:</strong><br>
         <em style="display:block; background:#fafafa; border-left:4px solid #2b5876; padding:10px; margin-top:5px;">${formData.message}</em>
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f9f9f9; padding:12px 20px; font-size:12px; color:#777; text-align:center; border-top:1px solid #eee;">
      Submitted on <strong>${formData.timestamp}</strong> <br>
      via <em>Estative Crypto Property Expo 2025</em>
    </div>
  </div>
`;


    // Send email
    const mailOptions = {
      from: "Estative Expo <noreply@estativeexpo.com>",
      to: "bassamramadan964@gmail.com",
      subject: `New ${formData.category} Registration - ${formData.from_name}`,
      html: emailBody,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent:", info.messageId);

    res.json({
      success: true,
      message: "Registration email sent successfully",
      data: {
        name: formData.from_name,
        email: formData.from_email,
        category: formData.category,
      },
    });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send registration email. Please try again later.",
    });
  }
});

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
