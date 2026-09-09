export default async function handler(req, res) {
  try {
    const traderId = String(req.query.trader_id || "").trim();

    if (!traderId) {
      return res.status(400).json({
        success: false,
        error: "Trader ID is required"
      });
    }

    const partnerId = "824077";
    const token = process.env.POCKET_API_TOKEN;

    if (!token) {
      return res.status(500).json({
        success: false,
        error: "POCKET_API_TOKEN is not configured"
      });
    }

    const url =
      `https://pocketpartners.com/api/v1/user-info/${encodeURIComponent(traderId)}/${partnerId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        traderId,
        error: data?.message || "Pocket Partners API error"
      });
    }

    const balance = Number(data?.balance ?? 0);
    const campaignId = String(data?.campaign_id ?? "");
    const status = data?.status ?? null;

    const allowed =
      campaignId === "787509" &&
      balance >= 10;

    return res.status(200).json({
      success: true,
      allowed,
      traderId,
      balance,
      campaignId,
      status
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
}
