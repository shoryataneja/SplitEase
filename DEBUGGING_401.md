# Production 401 Error Debugging Guide

## What I've Added

### Backend (authMiddleware.js)
- Detailed console logs showing:
  - Authorization header received
  - Token extraction status
  - Token verification result
  - User ID from decoded token
  - User found in database
  - Any errors during verification

### Frontend (api.js)
- Request interceptor logs:
  - Request URL
  - Token existence
  - Authorization header set
- Response interceptor:
  - Logs all errors
  - Auto-redirects to /login on 401
  - Clears localStorage on 401

### Frontend (Login.jsx)
- Logs token after login
- Verifies token is stored in localStorage
- Shows first 20 characters of token

## How to Debug

### Step 1: Check Render Logs
1. Go to Render Dashboard
2. Open your backend service
3. Click "Logs"
4. Look for `[AUTH]` prefixed messages
5. Check what the middleware is seeing

### Step 2: Check Browser Console
1. Open deployed site
2. Press F12 → Console
3. Login
4. Look for `[API]` prefixed messages
5. Check if token is being sent

### Step 3: Verify JWT_SECRET
**Most Common Issue!**

In Render:
1. Go to Environment tab
2. Check `JWT_SECRET` value
3. Make sure it matches your local `.env` file
4. If different, update it and redeploy

### Step 4: Check Token Storage
After login, in browser:
1. F12 → Application → Local Storage
2. Check if `token` key exists
3. Check if value looks like a JWT (3 parts separated by dots)

## Common Issues & Fixes

### Issue 1: JWT_SECRET Mismatch
**Symptom:** Token verification fails
**Fix:** Update JWT_SECRET in Render environment variables

### Issue 2: Token Not Stored
**Symptom:** No token in localStorage
**Fix:** Check login response, ensure backend returns token

### Issue 3: Token Not Sent
**Symptom:** Backend logs show "No token provided"
**Fix:** Check API interceptor is working

### Issue 4: CORS
**Symptom:** Request blocked before reaching backend
**Fix:** Add Vercel domain to CORS whitelist in backend

## Expected Console Output

### Successful Login:
```
[API] Making request to: /auth/login
[API] Token exists: false
Login response: { token: "...", userId: "..." }
Token stored successfully
Token value: eyJhbGciOiJIUzI1NiIs...
✓ Token exists
```

### Successful Protected Request:
```
[API] Making request to: /trips
[API] Token exists: true
[API] Authorization header set
[AUTH] Protect middleware called
[AUTH] Authorization header: Bearer eyJ...
[AUTH] Token extracted: Token exists
[AUTH] Verifying token with JWT_SECRET...
[AUTH] Token verified, user ID: 123abc
[AUTH] User authenticated: user@example.com
```

### Failed Auth (No Token):
```
[API] Making request to: /trips
[API] Token exists: false
[API] No token found in localStorage
[AUTH] No token provided
[API] Response error: 401 { message: "Not authorized, no token" }
```

### Failed Auth (Invalid Token):
```
[AUTH] Token verification failed: invalid signature
[API] Response error: 401 { message: "Not authorized, token failed" }
```

## Quick Fix Checklist

- [ ] JWT_SECRET in Render matches local
- [ ] Token is returned from login endpoint
- [ ] Token is stored in localStorage
- [ ] Authorization header is being sent
- [ ] CORS allows Vercel domain
- [ ] Backend is deployed with latest code
- [ ] Frontend is deployed with latest code
