# CORS Setup Guide for SmartSlot Backend

## Problem
The frontend application is unable to connect to the backend API due to CORS (Cross-Origin Resource Sharing) policy restrictions.

## Error Message
```
Failed to load available dates: TypeError: Failed to fetch
```

## Solution

### For Express.js Backend

1. **Install CORS package:**
   ```bash
   npm install cors
   ```

2. **Add CORS middleware to your Express server:**
   ```javascript
   const express = require('express');
   const cors = require('cors');
   const app = express();

   // Enable CORS for all routes
   app.use(cors({
     origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177'], // Frontend URLs
     credentials: true,
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
   }));

   // Your existing routes...
   app.get('/api/admin/dates/timings', (req, res) => {
     // Your route handler
   });

   app.listen(5000, () => {
     console.log('Server running on http://localhost:5000');
   });
   ```

### Alternative: Quick CORS Setup

If you want to allow all origins during development:

```javascript
app.use(cors()); // This allows all origins
```

### For Other Backend Frameworks

**Node.js (without Express):**
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Your API logic here
});
```

## Testing

After setting up CORS:

1. Restart your backend server
2. Refresh the frontend application
3. You should see "✅ Successfully loaded data from API" in the browser console
4. The warning banner should disappear

## Fallback

If CORS setup is not possible immediately, the frontend application will automatically fall back to mock data and display a warning banner. This ensures the application remains functional for development and testing.

## Production Considerations

For production, make sure to:
- Only allow specific origins (not '*')
- Use HTTPS
- Validate and sanitize all inputs
- Implement proper authentication if needed

## Support

If you continue to experience issues:
1. Check the browser's Network tab for failed requests
2. Verify the backend server is running on http://localhost:5000
3. Ensure the API endpoint `/api/admin/dates/timings` is accessible
4. Check browser console for additional error messages