import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, RefreshCw } from "lucide-react";
import BotCard from "../components/BotCard.jsx";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

export default function AllBotsPage() {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { getToken } = useAuth();

  // Use environment variable for backend URL or fallback to localhost
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchBots = async () => {
      try {
        setLoading(true);
        setError("");
        const token = await getToken(); // get JWT token from Clerk
        
        console.log("Fetching bots from:", `${backendUrl}/get-all-bots`);
        
        const res = await axios.get(`${backendUrl}/get-all-bots`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        console.log("Received bots:", res.data);
        setBots(res.data);
      } catch (err) {
        console.error("Error fetching bots:", err);
        setError(`Failed to load bots: ${err.response?.data?.message || err.message || "Unknown error"}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBots();
  }, []);

  const handleRefresh = async () => {
    const fetchBots = async () => {
      try {
        setLoading(true);
        setError("");
        const token = await getToken();
        
        const res = await axios.get(`${backendUrl}/get-all-bots`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setBots(res.data);
      } catch (err) {
        console.error("Error fetching bots:", err);
        setError(`Failed to load bots: ${err.response?.data?.message || err.message || "Unknown error"}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBots();
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white mb-6">Your Bots</h1>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Your Bots</h1>
          <div className="flex gap-2">
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
              <Link to="/createbot">Create New Bot</Link>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl px-4 py-3 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
            <button 
              onClick={handleRefresh}
              className="mt-2 text-red-300 hover:text-white text-sm underline"
            >
              Try Again
            </button>
          </div>
        )}

        {bots.length === 0 && !error ? (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg">No bots found</p>
            <p className="text-gray-400 mt-2">
              Create your first bot to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.isArray(bots) &&
              bots.map((bot) => (
                <Link
                  key={bot.id}
                  to={`/chat/${bot.name}`} // 👈 dynamic route
                  className="block hover:scale-105 transition-transform"
                >
                  <BotCard bot={bot} />
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}