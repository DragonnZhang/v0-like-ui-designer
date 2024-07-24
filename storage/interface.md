# Interfaces

## Login

**URL**：<http://localhost:3000/api/chi2025/login>

**method**：POST

**body**：

```json
{
  "username": "string",
  "password": "string"
}
```

**response**:

```json
success:
{
  "code": 0,
  "message": "Login success"
}
fail:
{
  "code": 401,
  "message": "Login failed"
}
```
