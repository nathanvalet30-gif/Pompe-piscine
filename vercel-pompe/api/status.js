const { getStatus } = require("../lib/tuya");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const { TUYA_CLIENT_ID, TUYA_CLIENT_SECRET, TUYA_DEVICE_ID } = process.env;
    const status = await getStatus(TUYA_CLIENT_ID, TUYA_CLIENT_SECRET, TUYA_DEVICE_ID);
    res.json({ success: true, ...status });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};
