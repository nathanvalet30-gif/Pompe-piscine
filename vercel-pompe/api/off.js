const { sendCommand } = require("../lib/tuya");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const { TUYA_CLIENT_ID, TUYA_CLIENT_SECRET, TUYA_DEVICE_ID } = process.env;
    await sendCommand(TUYA_CLIENT_ID, TUYA_CLIENT_SECRET, TUYA_DEVICE_ID, [
      { code: "switch_1", value: false },
    ]);
    res.json({ success: true, message: "Pompe éteinte ⛔" });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};
