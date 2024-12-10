import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Search, AlertTriangle, Loader2, ExternalLink } from "lucide-react";

const NewsApp = () => {
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const fetchData = async (query = 'latest soccer') => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=${query}&apiKey=d7f729f53c5040f7a1a2adbf86a857a8`
      );
      const validArticles = response.data.articles.filter(
        (article) =>
          article.title &&
          article.title !== "[Removed]" &&
          article.description &&
          article.description !== "[Removed]"
      );
      setArticles(validArticles);
    } catch (err) {
      setError("Failed to fetch news. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch default news on component mount
  useEffect(() => {
    fetchData(); // Fetches default "latest soccer" news
  }, []);

  // Fetch search-specific news
  useEffect(() => {
    if (searchQuery) {
      const timerId = setTimeout(() => fetchData(searchQuery), 500);
      return () => clearTimeout(timerId);
    }
  }, [searchQuery]);

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 flex justify-center">
          <div
            className="relative w-full max-w-2xl"
            onClick={handleContainerClick}
          >
            <div
              className={`flex items-center bg-white rounded-full shadow-lg border cursor-text transition-all duration-300 ease-in-out ${
                isFocused
                  ? "ring-4 ring-indigo-200 border-indigo-300 shadow-indigo-100"
                  : "border-gray-200 hover:border-indigo-200 hover:shadow-md"
              }`}
            >
              <div className="pl-6 text-gray-400 pointer-events-none">
                <Search
                  className={`transition-all duration-300 ${
                    isFocused ? "text-indigo-600" : "text-gray-400"
                  }`}
                />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="What news are you curious about today?"
                className="flex-grow py-4 pl-4 pr-6 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-lg font-light w-full"
              />
            </div>
            <div
              className={`absolute inset-0 rounded-full bg-indigo-500/10 blur-2xl opacity-0 transition-all duration-500 ${
                isFocused ? "opacity-100 scale-105" : "opacity-0"
              }`}
            />
          </div>
        </div>
        {loading && (
          <div className="flex justify-center items-center my-8">
            <Loader2 className="animate-spin text-indigo-500" size={48} />
            <span className="ml-3 text-gray-600">Searching for latest news...</span>
          </div>
        )}
        {error && (
          <div className="flex justify-center items-center my-8 text-red-500">
            <AlertTriangle className="mr-3" />
            <span>{error}</span>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.length > 0 ? (
            articles.map((article, index) => (
              <div
                key={article.url || index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
              >
                {article.urlToImage && (
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2 group-hover:text-indigo-700 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.description}
                  </p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-indigo-600 hover:text-indigo-800 font-semibold group/link"
                  >
                    Read More
                    <ExternalLink
                      className="ml-2 transform transition-transform group-hover/link:translate-x-1"
                      size={16}
                    />
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">
              {searchQuery
                ? "No articles found. Try different keywords."
                : "Search for news to get started"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsApp;
