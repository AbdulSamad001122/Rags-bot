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

### GET /health

Health check endpoint.

**Response:**

- Success: `{ "status": "healthy", "service": "text-extractor" }`

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

### Render Deployment

The service is configured for deployment to Render using a [render.yaml](file:///d:/Abdul%20Samad/Code%20Work/Projects/Rags-bot/render.yaml) file located in the project root directory.

For Render deployment, the service is configured to use the PORT environment variable provided by Render.

#### Troubleshooting Render Deployments

If you encounter issues with dependency installation:

1. Make sure you're using a version of PyMuPDF that has precompiled wheels (like 1.24.10)
2. The build script includes optimizations to speed up dependency installation
3. Check the build logs for any error messages during the pip install process
4. Ensure the build command in render.yaml is correct: `chmod +x build.sh && ./build.sh`
5. Verify the start command runs from the correct directory using the rootDir property

The service now includes a health check endpoint at `/` or `/health` to verify it's running correctly.