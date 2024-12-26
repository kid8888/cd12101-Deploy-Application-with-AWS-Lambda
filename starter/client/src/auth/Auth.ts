import auth0 from 'auth0-js';

const auth0Client = new auth0.WebAuth({
  domain: 'dev-2xo0ymz2yc3zekoc.us.auth0.com',
  clientID: 'UQz2SltzRYftmz8KA69xPYRqyV9N8MAZ',
  redirectUri: 'http://localhost:3000/callback',
  responseType: 'token id_token',
  scope: 'openid email profile'
});

export default auth0Client;
