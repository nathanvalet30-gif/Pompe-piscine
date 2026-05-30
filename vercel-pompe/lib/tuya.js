const crypto = require("crypto");

const BASE_URL = "https://openapi.tuyaeu.com";

function sign(clientId, clientSecret, token = "") {
  const t = Date.now().toString();
  const str = token ? clientId + token + t : clientId + t;
  const sig = crypto.createHmac("sha256", clientSecret).update(str).digest("hex").toUpperCase();
  return { t, sig };
}

function headers(clientId, clientSecret, token = "") {
  const { t, sig } = sign(clientId, clientSecret, token);
  return {
    "client_id": clientId,
    "sign": sig,
    "sign_method": "HMAC-SHA256",
    "t": t,
    "access_token": token,
    "Content-Type": "application/json",
  };
}

async function getToken(clientId, clientSecret) {
  const res = await fetch(`${BASE_URL}/v1.0/token?grant_type=1`, {
    headers: headers(clientId, clientSecret),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.msg);
  return data.result.access_token;
}

async function sendCommand(clientId, clientSecret, deviceId, commands) {
  const token = await getToken(clientId, clientSecret);
  const res = await fetch(`${BASE_URL}/v1.0/devices/${deviceId}/commands`, {
    method: "POST",
    headers: headers(clientId, clientSecret, token),
    body: JSON.stringify({ commands }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.msg);
  return data;
}

async function getStatus(clientId, clientSecret, deviceId) {
  const token = await getToken(clientId, clientSecret);
  const res = await fetch(`${BASE_URL}/v1.0/devices/${deviceId}`, {
    headers: headers(clientId, clientSecret, token),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.msg);
  const sw = data.result.status?.find(s => s.code === "switch_1");
  return { online: data.result.online, on: sw?.value ?? false };
}

module.exports = { sendCommand, getStatus };
