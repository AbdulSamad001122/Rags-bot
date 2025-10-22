# Text Extraction Service

This is a Python Flask service that extracts text from PDF files using PyMuPDF.

## Features

- Extracts text from PDF documents
- Handles file uploads securely
- Returns extracted text in JSON format
- CORS enabled for web applications

## Technologies Used

- Flask
- PyMuPDF (fitz)
- Flask-CORS

## Installation

1. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Service

```bash
python extractor.py
```

The service will start on port 5001 by default.

## API Endpoint

### POST /extract-text

Extracts text from a PDF file.

**Request:**

- Method: POST
- Content-Type: multipart/form-data
- Body: PDF file in the `pdf` field

**Response:**

- Success: `{ "extracted_text": "..." }`
- Error: `{ "error": "..." }`

## Environment Variables

- `PORT`: Port to run the service on (default: 5001)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS (default: http://localhost:5173)

Example:
```
ALLOWED_ORIGINS=http://localhost:5173,https://your-vercel-app.vercel.app,https://your-custom-domain.com
```

## Deployment

This service can be deployed to platforms that support Python applications:

- Railway
- Heroku
- AWS Elastic Beanstalk
- Google Cloud Run
- Azure App Service
- Render

For Railway deployment, the service is configured to use the PORT environment variable provided by Railway.

### Render Deployment Notes

The service includes a [build.sh](file:///d:/Abdul%20Samad/Code%20Work/Projects/Rags-bot/text-extractor-service/build.sh) script for Render deployment that installs system dependencies required by PyMuPDF. 

If you encounter build timeouts:
1. Make sure you're using a version of PyMuPDF that has precompiled wheels (like 1.24.10)
2. The build script includes optimizations to speed up dependency installation
3. Consider upgrading to Render's paid tiers for longer build times if needed