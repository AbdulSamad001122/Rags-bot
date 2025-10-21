# Deployment Checklist

## Pre-deployment Tasks

### 1. Code Preparation

- [ ] Ensure all code is committed and pushed to repositories
- [ ] Update version numbers in package.json files
- [ ] Remove any sensitive information from code
- [ ] Verify all environment variables are properly configured

### 2. Testing

- [ ] Test the complete workflow locally
- [ ] Verify PDF upload and text extraction
- [ ] Test bot creation and chat functionality
- [ ] Check responsive design on different devices

### 3. Security

- [ ] Rotate any exposed API keys
- [ ] Verify CORS configurations
- [ ] Check authentication flows
- [ ] Ensure proper error handling

## Deployment Steps

### Frontend (Vercel)

- [ ] Create GitHub repository for frontend
- [ ] Connect Vercel to repository
- [ ] Configure build settings:
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Install Command: `npm install`
- [ ] Add environment variables:
  - `VITE_CLERK_PUBLISHABLE_KEY`
  - `VITE_BACKEND_URL`
  - `VITE_PYTHON_SERVICE_URL`
- [ ] Deploy and verify

### Backend (Railway)

- [ ] Create GitHub repository for backend
- [ ] Connect Railway to repository
- [ ] Configure environment variables:
  - `QDRANT_URL`
  - `QDRANT_API_KEY`
  - `GOOGLE_API_KEY`
  - `COHERE_API_KEY`
  - `GROQ_API_KEY`
  - `CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `DATABASE_URL`
- [ ] Deploy and verify

### Text Extractor Service (Railway)

- [ ] Create GitHub repository for Python service
- [ ] Connect Railway to repository
- [ ] Configure build settings for Python
- [ ] Set PORT environment variable
- [ ] Deploy and verify

## Post-deployment Verification

### Integration Testing

- [ ] Test PDF upload from deployed frontend
- [ ] Verify text extraction service is working
- [ ] Confirm bot creation process
- [ ] Test chat functionality with created bots

### Monitoring

- [ ] Set up logging for all services
- [ ] Configure error tracking
- [ ] Set up uptime monitoring
- [ ] Configure performance monitoring

### DNS and Custom Domains

- [ ] Configure custom domains if needed
- [ ] Set up SSL certificates
- [ ] Update CORS configurations with new domains
- [ ] Test all integrations with custom domains

## Rollback Plan

### If Issues Occur

- [ ] Document the issue with screenshots/logs
- [ ] Revert to previous working version
- [ ] Notify team members
- [ ] Create issue ticket for bug fixing

### Emergency Rollback

- [ ] Vercel: Redeploy previous working deployment
- [ ] Railway: Rollback to previous working release
- [ ] Update DNS if custom domains were changed

## Maintenance Schedule

### Regular Tasks

- [ ] Monitor API usage and costs
- [ ] Update dependencies monthly
- [ ] Review logs for errors
- [ ] Backup important data

### Quarterly Reviews

- [ ] Performance optimization
- [ ] Security audit
- [ ] Update documentation
- [ ] Review and update deployment process
