const s = `
# Interfaces

## Login

**URL**：<http://localhost:3000/api/chi2025/login>

**method**：POST

**body**：

\`\`\`json
{
  "username": "string",
  "password": "string"
}
\`\`\`

**response**:

success:
\`\`\`json
{
  "status": 200,
  "code": 0,
  "message": "Login success"
}
\`\`\`

fail:
\`\`\`json
{
  "status": 200,
  "code": 401,
  "message": "Login failed"
}
\`\`\`
`

export default s
