const http = require('http');
const url = require('url');
const querystring = require('querystring');
const crypto = require('crypto');

const client_id = '4e3a18e42bf0466c9c4040436a823ef8';
const client_secret = 'e43c5b378f7147a28ac98117e9e263ed';
const redirect_uri = 'http://127.0.0.1:8888/callback';

const generateRandomString = (length) => {
  return crypto.randomBytes(60).toString('hex').slice(0, length);
};

const state = generateRandomString(16);
const scope = 'user-read-currently-playing user-read-playback-state';

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url);
  const parsedQuery = querystring.parse(parsedUrl.query);

  if (parsedUrl.pathname === '/') {
    const authQuery = querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    });
    const authUrl = 'https://accounts.spotify.com/authorize?' + authQuery;
    console.log('\n======================================================');
    console.log('🔗 CLICK THIS LINK TO LOG INTO SPOTIFY:');
    console.log(authUrl);
    console.log('======================================================\n');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<h1>Check your console for the login link!</h1><a href="${authUrl}">Login to Spotify</a>`);
  } 
  else if (parsedUrl.pathname === '/callback') {
    const code = parsedQuery.code || null;
    
    if (!code) {
      res.end('<h1>Error: No code provided</h1>');
      return;
    }

    console.log('✅ Received Authorization Code. Fetching Refresh Token...');

    const authOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
      },
      body: querystring.stringify({
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      })
    };

    try {
      const tokenRes = await fetch('https://accounts.spotify.com/api/token', authOptions);
      const data = await tokenRes.json();
      
      if (data.refresh_token) {
        console.log('\n🎉 SUCCESS! Here is your Refresh Token:');
        console.log('------------------------------------------------------');
        console.log(data.refresh_token);
        console.log('------------------------------------------------------');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>SUCCESS! You can close this tab and return to the chat.</h1>');
        process.exit(0);
      } else {
        console.log('❌ Failed to get refresh token:', data);
        res.end('<h1>Failed to get refresh token. Check console.</h1>');
      }
    } catch (err) {
      console.log('❌ Error:', err);
      res.end('<h1>Error fetching token.</h1>');
    }
  }
});

server.listen(8888, () => {
  console.log('🚀 Local Server is running! Go to http://localhost:8888 in your browser.');
});
