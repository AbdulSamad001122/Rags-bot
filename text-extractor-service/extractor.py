from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz  # PyMuPDF
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Configure CORS to allow multiple origins
allowed_origins = [
    "http://localhost:5173",
    "https://your-vercel-app.vercel.app",  # Vercel deployment (replace with your actual URL)
    "https://your-custom-domain.com"       # Add any custom domains
]

CORS(app, origins=allowed_origins)


# Temporary folder to save uploaded PDFs
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

@app.route("/extract-text", methods=["POST"])
def extract_text():
    # Check if a file was uploaded
    if "pdf" not in request.files:
        return jsonify({"error": "No PDF file uploaded"}), 400

    file = request.files["pdf"]

    if file.filename == "":
        return jsonify({"error": "Empty file name"}), 400

    # Secure filename and save
    print("Received file:", file.filename)
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)

    try:
        # Open PDF and extract text
        pdf_document = fitz.open(filepath)
        text = ""
        for page_number in range(pdf_document.page_count):
            page = pdf_document.load_page(page_number)
            text += page.get_text("text")
        pdf_document.close()

        # Optionally, delete file after processing
        os.remove(filepath)

        # Return extracted text
        print("Extracted text length:", len(text))
        return jsonify({"extracted_text": text.strip()})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5001)), debug=True)