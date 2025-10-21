# Integration Guide: Python Text Extraction Service

This guide explains how the new integration works between the frontend, Python text extraction service, and the backend.

## New Data Flow

1. **Frontend** - User uploads a PDF file
2. **Frontend** - File is sent directly to Python text extraction service
3. **Python Service** - Extracts text from PDF and returns it
4. **Frontend** - Sends extracted text to backend
5. **Backend** - Processes text and creates bot

## API Endpoints

### Python Text Extraction Service

- **URL**: `http://localhost:5001/extract-text`
- **Method**: POST
- **Body**: FormData with PDF file in `pdf` field
- **Response**: JSON with `extracted_text` field

### Backend Process Text Endpoint

- **URL**: `http://localhost:3000/create-rag/process-text`
- **Method**: POST
- **Body**: JSON with `userNamespace` and `extractedText` fields
- **Headers**: Requires Clerk authentication token
- **Response**: JSON with success message and bot data

## How It Works

### Frontend Changes

The CreateBot component now:

1. Sends the PDF file directly to the Python service
2. Waits for text extraction to complete
3. Sends the extracted text to the backend's new `/process-text` endpoint

### Backend Changes

1. Removed file upload and PDF processing capabilities
2. Added a new `/process-text` endpoint that accepts extracted text
3. Simplified the [IndexDoc](file://d:\Abdul%20Samad\Projects\Rags-bot\backend\services\prepare.js#L53-L85) function to work with text input only
4. Created a [createDocumentsFromText](file://d:\Abdul%20Samad\Projects\Rags-bot\backend\services\prepare.js#L24-L71) function to process extracted text

### Text Processing

The extracted text is processed by:

1. Splitting into logical sections (paragraphs)
2. Creating Document objects for each section
3. Using the existing chunking and vectorization pipeline

## Testing

To test the integration:

1. Ensure the Python service is running on port 5001
2. Upload a PDF through the frontend
3. Monitor the console for successful processing messages

## Benefits

- Clean separation between text extraction (Python) and text processing (Node.js)
- No file storage required in the backend
- More efficient processing pipeline
- Better error handling and user feedback
- Simplified backend code
