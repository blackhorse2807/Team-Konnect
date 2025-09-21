import React, { useState, useRef, useEffect } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  
  const searchRef = useRef(null);
  const promptRef = useRef(null);

  const exampleSuggestions = [
    "Navratri clothes under 3000",
    "Sarees under 500",
    "Men's t-shirts under 300",
    "Kids dresses for party",
    "Home decor items",
    "Kitchen storage containers",
    "Jewelry sets for wedding",
    "Women ethnic wear",
    "Casual jeans for men"
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (promptRef.current && !promptRef.current.contains(event.target)) {
        setShowPrompt(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setQuery(input);
    if (input.length > 0) {
      const filtered = exampleSuggestions.filter(
        suggestion => suggestion.toLowerCase().includes(input.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };
  
  const handlePromptSubmit = (e) => {
    e.preventDefault();
    if (promptInput.trim()) {
      window.location.href = `/ai-results?q=${encodeURIComponent(promptInput)}`;
      setShowPrompt(false);
      setPromptInput('');
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto" ref={searchRef}>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full">
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  onFocus={() => query && setShowSuggestions(true)}
                  placeholder="Try 'Navratri clothes under 3000' or 'Men's t-shirts under 300'"
                  className="w-full pl-12 pr-4 py-3 border border-meesho-border rounded-md focus:outline-none focus:ring-1 focus:ring-meesho-pink focus:border-meesho-pink shadow-sm text-meesho-darkgray"
                />
              </div>
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-meesho-border rounded-md shadow-lg">
                  <ul>
                    {suggestions.map((suggestion, index) => (
                      <li 
                        key={index}
                        className="px-4 py-2 hover:bg-meesho-lightpink cursor-pointer text-meesho-darkgray text-sm border-b border-meesho-border last:border-b-0"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                          </svg>
                          {suggestion}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </form>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-meesho-pink text-white font-medium rounded-md hover:bg-opacity-90 transition-colors whitespace-nowrap"
            >
              Search
            </button>
            <button
              onClick={() => setShowPrompt(prev => !prev)}
              className="px-4 py-3 border border-meesho-pink text-meesho-pink font-medium rounded-md hover:bg-meesho-lightpink transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <span className="hidden md:inline">AI Prompt</span>
            </button>
          </div>
        </div>

        {showPrompt && (
          <div 
            ref={promptRef}
            className="mt-4 bg-white border border-purple-200 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">AI Fashion Stylist</h3>
                <p className="text-xs text-purple-600 font-medium">Your Personal Shopping Assistant</p>
              </div>
              <button 
                onClick={() => setShowPrompt(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-semibold text-purple-700">🤖 AI Salesman:</span> Tell me what you're looking for, and I'll create the perfect outfit combination for you!
              </p>
              <div className="text-xs text-gray-600 space-y-1">
                <p>• "Red shirt with stripes + blue jeans" → See complete outfit on mannequin</p>
                <p>• "Wedding saree under ₹3000" → Get styled recommendations</p>
                <p>• "Casual office wear for women" → Complete professional looks</p>
              </div>
            </div>

            <form onSubmit={handlePromptSubmit}>
              <textarea
                className="w-full p-4 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
                placeholder="Try: 'Show me a red shirt with stripes and matching blue jeans for a casual look' or 'I need ethnic wear for a festival, budget ₹2000'"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                rows={3}
              ></textarea>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center text-xs text-gray-500">
                  <svg className="w-4 h-4 mr-1 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                  AI will show products on virtual mannequins
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowPrompt(false)}
                    className="px-4 py-2 text-gray-600 text-sm hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 font-medium flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                    Style Me
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
        
        <div className="mt-4">
          <div className="text-sm font-medium text-gray-500 mb-2">Popular searches:</div>
          <div className="flex flex-wrap gap-2">
            {['Sarees under 500', 'Kurtis', 'Western wear', 'Home decor', 'Men\'s t-shirts', 'Kids wear'].map((tag, index) => (
              <button 
                key={index}
                onClick={() => handleSuggestionClick(tag)}
                className="text-sm px-3 py-1.5 bg-meesho-lightpink text-meesho-pink rounded-full hover:bg-opacity-80 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
