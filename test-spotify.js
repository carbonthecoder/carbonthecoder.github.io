const SPOTIFY_CLIENT_ID = '4e3a18e42bf0466c9c4040436a823ef8';
const SPOTIFY_CLIENT_SECRET = 'e43c5b378f7147a28ac98117e9e263ed';
const SPOTIFY_REFRESH_TOKEN = 'AQCd8GKeVVS7e2qa6qqsITa82QnDvtfXZs3rvnPQOiZ9W3Uid-3bYmdnc1CBZ1fk80G2cmBmy3o94fBDMIfai8KIbs8nly9kGOtEud5H8vJ_Dnu6LDdHzwIbwOH8XRSpQVY';

async function test() {
  try {
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')
      },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: SPOTIFY_REFRESH_TOKEN })
    });
    const data = await res.json();
    console.log("Token Response:", data);
    
    if (data.access_token) {
      const res2 = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: { 'Authorization': 'Bearer ' + data.access_token }
      });
      console.log("Player Status:", res2.status);
      const d2 = await res2.text();
      console.log("Response Body:", d2);
    }
  } catch(e) {
    console.error("Error", e);
  }
}

test();
