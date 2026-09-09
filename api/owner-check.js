export default function handler(req, res) {
  try {
    const ownerId = String(req.query.id || "").trim();
    const secretOwnerId = String(process.env.AVA_OWNER_ID || "").trim();

    if (!secretOwnerId) {
      return res.status(500).json({
        success: false,
        error: "AVA_OWNER_ID is not configured"
      });
    }

    if (!ownerId) {
      return res.status(400).json({
        success: false,
        error: "Owner ID is required"
      });
    }

    if (ownerId !== secretOwnerId) {
      return res.status(401).json({
        success: false,
        allowed: false,
        error: "Invalid Owner ID"
      });
    }

    return res.status(200).json({
      success: true,
      allowed: true,
      role: "owner"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      allowed: false,
      error: "Server error"
    });
  }
}
