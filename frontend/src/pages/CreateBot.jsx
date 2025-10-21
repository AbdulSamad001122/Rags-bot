import { useState } from "react";
import { Send, Upload, X, FileText } from "lucide-react";
import axios from "axios";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";

export default function CreateBot() {
  const [botName, setBotName] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { getToken } = useAuth();

  // Use environment variables for API URLs
  const pythonServiceUrl =
    import.meta.env.VITE_PYTHON_SERVICE_URL || "http://localhost:5001";
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setError("");
    } else {
      setError("Please select a valid PDF file");
      setPdfFile(null);
    }
  };

  const removeFile = () => {
    setPdfFile(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!botName.trim()) {
      setError("Please enter a bot name");
      return;
    }

    if (!pdfFile) {
      setError("Please select a PDF file");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Step 1: Send file to Python text extraction service
      const pythonFormData = new FormData();
      pythonFormData.append("pdf", pdfFile);

      console.log("Sending file to Python service...");
      const extractionResponse = await axios.post(
        `${pythonServiceUrl}/extract-text`,
        pythonFormData
      );

      console.log("Python service response:", extractionResponse.data);

      if (extractionResponse.data.error) {
        throw new Error(extractionResponse.data.error);
      }

      const extractedText = extractionResponse.data.extracted_text;

      // Check if we actually got text
      if (!extractedText) {
        throw new Error("No text extracted from PDF");
      }

      console.log("Extracted text length:", extractedText.length);
      console.log("First 200 characters:", extractedText.substring(0, 200));

      // Step 2: Send extracted text and bot name to your backend
      const token = await getToken(); // get JWT token from Clerk

      console.log("Sending extracted text to backend...");
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

      setSuccess("Bot created successfully!");
      setBotName("");
      setPdfFile(null);
      console.log("Backend response:", backendResponse.data);
    } catch (err) {
      console.error("Error details:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create bot. Please try again."
      );
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 shadow-2xl p-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Create Your Bot
              </h1>
              <p className="text-gray-400 mb-8">
                Enter bot name and upload a PDF document
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Bot Name Input */}
                <div>
                  <label
                    htmlFor="botName"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Bot Name
                  </label>
                  <input
                    type="text"
                    id="botName"
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    placeholder="Enter bot name"
                    className="w-full bg-gray-900/50 text-white placeholder-gray-500 rounded-xl border border-gray-700 px-4 py-3 outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* PDF Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Upload PDF Document
                  </label>

                  {!pdfFile ? (
                    <label className="flex flex-col items-center justify-center w-full h-40 bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-700 hover:border-blue-500 cursor-pointer transition-colors">
                      <Upload className="w-12 h-12 text-gray-500 mb-2" />
                      <span className="text-gray-400 text-sm">
                        Click to upload PDF
                      </span>
                      <span className="text-gray-600 text-xs mt-1">
                        PDF files only
                      </span>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="flex items-center justify-between bg-gray-900/50 rounded-xl border border-gray-700 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-blue-500" />
                        <div>
                          <p className="text-white text-sm font-medium">
                            {pdfFile.name}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 rounded-xl px-4 py-3">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="bg-green-500/10 border border-green-500/50 rounded-xl px-4 py-3">
                    <p className="text-green-400 text-sm">{success}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !botName.trim() || !pdfFile}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Bot...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Create Bot
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
