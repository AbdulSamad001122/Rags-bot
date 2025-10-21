# Deployment Guide for RAGs Bot Application

This guide explains how to deploy your RAGs Bot application, which consists of three main components:

1. Frontend (React/Vite application)
2. Backend (Node.js/Express API)
3. Text Extractor Service (Python/Flask service)

## Deployment Architecture Options

### Option 1: Vercel + Railway (Recommended)

- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Railway
- **Text Extractor Service**: Deploy to Railway

### Option 2: All on Vercel

- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Vercel (as Serverless Functions)
- **Text Extractor Service**: Convert to Node.js or deploy separately

### Option 3: All on Railway

- **Frontend**: Build and deploy static files to Railway
- **Backend**: Deploy to Railway
- **Text Extractor Service**: Deploy to Railway

## Recommended Approach: Vercel + Railway

This approach provides the best balance of ease of use, performance, and cost-effectiveness.

### 1. Frontend Deployment (Vercel)

#### Prerequisites:

- GitHub/GitLab/Bitbucket repository
- Vercel account

#### Steps:

1. Push your frontend code to a Git repository
2. Connect Vercel to your repository
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. Add environment variables in Vercel dashboard:
   - `VITE_CLERK_PUBLISHABLE_KEY` (from your Clerk dashboard)

#### Vercel Configuration:

Create a `vercel.json` file in your frontend directory:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### 2. Backend Deployment (Railway)

#### Prerequisites:

- GitHub/GitLab/Bitbucket repository
- Railway account
- Updated environment variables

#### Steps:

1. Push your backend code to a Git repository
2. Connect Railway to your repository
3. Configure environment variables in Railway dashboard:
   - `QDRANT_URL`
   - `QDRANT_API_KEY`
   - `GOOGLE_API_KEY`
   - `COHERE_API_KEY`
   - `GROQ_API_KEY`
   - `CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `DATABASE_URL` (if using PostgreSQL)
   - `PORT` (Railway will set this automatically)

#### Update CORS Configuration:

In your backend [server.js](file://d:\Abdul%20Samad\Projects\Rags-bot\backend\server.js), update the CORS configuration to allow your Vercel domain:

```javascript
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-vercel-app.vercel.app", // Add your Vercel domain
      "https://your-custom-domain.com", // Add any custom domains
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
```

### 3. Text Extractor Service Deployment (Railway)

#### Prerequisites:

- Separate Git repository for the Python service (or subdirectory deployment)
- Railway account

#### Steps:

1. Push your text extractor service to a Git repository
2. Connect Railway to your repository
3. Configure Railway to use Python buildpack
4. Set port to 8000 (or let Railway auto-detect)
5. Update CORS in your Python service to allow your Vercel domain:

```python
CORS(app, origins=[
    "http://localhost:5173",
    "https://your-vercel-app.vercel.app", # Add your Vercel domain
    "https://your-custom-domain.com"      # Add any custom domains
])
```

#### Update Frontend API URLs:

In your frontend code, update the API URLs to point to your deployed services:

In [CreateBot.jsx](file://d:\Abdul%20Samad\Projects\Rags-bot\frontend\src\pages\CreateBot.jsx):

```javascript
// Replace localhost URLs with your deployed service URLs
const pythonServiceUrl = "https://your-python-service.railway.app"; // Railway URL
const backendUrl = "https://your-backend-service.railway.app"; // Railway URL

// In handleSubmit function:
const extractionResponse = await axios.post(
  `${pythonServiceUrl}/extract-text`,
  pythonFormData
);

const backendResponse = await axios.post(
  `${backendUrl}/create-rag/process-text`,
  {
    userNamespace: botName,
    extractedText: extractedText,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }
);
```

## Alternative: All Services on Vercel

If you prefer to keep everything on Vercel:

### Backend on Vercel:

1. Convert your Express app to use Vercel Serverless Functions
2. Create API routes in the `api` directory
3. Deploy as a Serverless Function

### Text Extractor Service on Vercel:

1. Convert Python service to Node.js using pdfjs-dist
2. Or deploy Python service separately (e.g., Railway, Heroku)

## Environment Variables Summary

### Frontend (.env.local in Vercel):

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### Backend (Railway Environment Variables):

```
QDRANT_URL=https://your-qdrant-url
QDRANT_API_KEY=your-qdrant-api-key
GOOGLE_API_KEY=your-google-api-key
COHERE_API_KEY=your-cohere-api-key
GROQ_API_KEY=your-groq-api-key
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
DATABASE_URL=your-database-url
PORT=8080
```

### Text Extractor Service (Railway Environment Variables):

```
PORT=8000
```

## Deployment Steps Summary

1. **Prepare Repositories**:

   - Create separate repositories for each service or use a monorepo approach

2. **Configure Environment Variables**:

   - Set up all required environment variables in each platform

3. **Update API URLs**:

   - Replace localhost URLs with deployed service URLs

4. **Deploy Services**:

   - Frontend to Vercel
   - Backend to Railway
   - Text Extractor Service to Railway

5. **Test Integration**:
   - Verify all services can communicate with each other
   - Test the complete workflow from PDF upload to chat

## Cost Considerations

- **Vercel**: Free tier available with limitations
- **Railway**: Free tier with $5 credit for new users
- **Qdrant**: Cloud option with free tier
- **Clerk**: Free tier for authentication
- **Cohere/Google/Groq**: API usage-based pricing

## Monitoring and Maintenance

- Set up logging for all services
- Monitor API usage and costs
- Regularly update dependencies
- Set up health checks for all services

This deployment strategy provides a scalable, maintainable solution for your RAGs Bot application.
