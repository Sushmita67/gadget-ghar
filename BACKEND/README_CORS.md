# CORS Configuration Update

## What Changed

The CORS policy has been updated from allowing all origins (`*`) to only allowing specific frontend origins for better security.

### Allowed Origins
- `https://localhost:5173` (Vite dev server - HTTPS)
- `https://localhost:3000` (React dev server - HTTPS)
- `https://localhost:4173` (Vite preview - HTTPS)
- `https://localhost:4443` (Backend HTTPS)
- `http://localhost:5173` (Fallback HTTP)
- `http://localhost:3000` (Fallback HTTP)
- `http://localhost:4173` (Fallback HTTP)

### Environment Variables
You can add additional origins using the `ALLOWED_ORIGINS` environment variable:
```bash
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
```

## Testing CORS

### 1. Start the Backend Server
```bash
npm start
```

### 2. Test with Browser
Open `test-cors.html` in your browser to test CORS from the frontend perspective.

### 3. Test with Node.js
```bash
node test-cors.js
```

### 4. Test with Frontend
Start your frontend application and try to make API calls. They should work if the frontend is running on one of the allowed origins.

## Expected Behavior

✅ **Should Work:**
- Frontend running on `https://localhost:5173` (HTTPS)
- Frontend running on `https://localhost:3000` (HTTPS)
- API calls from the same origin (`https://localhost:4443`)

❌ **Should Be Blocked:**
- Requests from `http://localhost:8080`
- Requests from `https://malicious-site.com`
- Any other unauthorized origins

## Security Benefits

1. **Prevents unauthorized access** from other domains
2. **Reduces attack surface** by limiting allowed origins
3. **Protects against CSRF attacks** by restricting origins
4. **Complies with security best practices**

## Troubleshooting

If you encounter CORS errors:

1. **Check the console logs** - The server now logs CORS decisions
2. **Verify your frontend URL** - Make sure it's in the allowed origins list
3. **Add your domain** - Use the `ALLOWED_ORIGINS` environment variable
4. **Check for typos** - Ensure the origin URL is exactly correct

## Production Deployment

For production, update the `allowedOrigins` array to include your actual domain:

```javascript
const allowedOrigins = [
  'https://yourdomain.com',
  'https://www.yourdomain.com',
  'https://app.yourdomain.com'
];
``` 