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

## Deployment

This service can be deployed to platforms that support Python applications:

- Railway
- Heroku
- AWS Elastic Beanstalk
- Google Cloud Run
- Azure App Service

For Railway deployment, the service is configured to use the PORT environment variable provided by Railway.
