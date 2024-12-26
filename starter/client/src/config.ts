const apiId = 'b1yikvwoq5' // 替换为你的 API Gateway ID
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev/todos`


export const authConfig = {
  domain: 'dev-2xo0ymz2yc3zekoc.us.auth0.com', // Auth0 域名
  clientId: 'UQz2SltzRYftmz8KA69xPYRqyV9N8MAZ', // Auth0 应用的客户端 ID
  audience: 'https://dev-2xo0ymz2yc3zekoc.us.auth0.com/api/v2/', // **Auth0 Management API 标识符**
  callbackUrl: 'http://localhost:3000/callback', // 回调 URL
}