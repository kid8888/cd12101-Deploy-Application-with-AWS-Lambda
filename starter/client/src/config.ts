const apiId = 'b1yikvwoq5'; // Your API Gateway ID
const region = 'us-east-1'; // Your AWS region

export const apiEndpoint = `https://${apiId}.execute-api.${region}.amazonaws.com/dev`;

export const authConfig = {
  domain: 'dev-2xo0ymz2yc3zekoc.us.auth0.com', // Your Auth0 domain
  clientId: 'your-client-id',              // Your Auth0 client ID
  callbackUrl: 'http://localhost:3000/callback' // Callback URL for local dev
};