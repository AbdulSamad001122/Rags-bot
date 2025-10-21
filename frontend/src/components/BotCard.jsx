import { Bot, Calendar } from "lucide-react";

export default function BotCard({ bot }) {

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  console.log(bot);

  return (
    <>
      <div className="bg-gray-800 rounded-2xl border border-gray-600 p-6 hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                {bot.name}
              </h3>
              <p className="text-xs text-gray-300">
                ID: {bot.id.slice(0, 8)}...
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-200 text-sm">
          <Calendar className="w-4 h-4" />
          <span>
            {formatDate(bot.createdAt)} at {formatTime(bot.createdAt)}
          </span>
        </div>
      </div>
    </>
  );
}