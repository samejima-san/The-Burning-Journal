// tokenrefresh.js
require('dotenv').config();

async function getToken() {
  const fetch = (await import('node-fetch')).default;

  const res = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "client_credentials"
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });

  const data = await res.json();
  console.log("Access Token:", data.access_token);
}

getToken();
