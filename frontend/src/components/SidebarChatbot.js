import React, { useEffect, useMemo, useRef, useState } from 'react';

const SidebarChatbot = ({ onPrompt }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [input, setInput] = useState('');
  const [currentFilters, setCurrentFilters] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakEnabled, setSpeakEnabled] = useState(false);
  const [language, setLanguage] = useState('en'); // 'en' or 'hi'
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I'm your AI Fashion Stylist. Tell me what you want and I'll update the recommendations. Try: 'red striped shirt + blue jeans'.",
    },
  ]);

  // Update initial message when language changes
  useEffect(() => {
    const initialMessage = language === 'hi' 
      ? "नमस्ते! मैं आपका पर्सनल शॉपिंग असिस्टेंट हूं। आज आपके लिए क्या लेकर आऊं? 'women tops', 'partywear' या कुछ और?"
      : "Hello! I'm your personal shopping assistant. What can I bring for you today? Try 'women tops', 'partywear', or anything else!";
    
    setMessages([{
      role: 'assistant',
      content: initialMessage,
    }]);
  }, [language]);
  const recognitionRef = useRef(null);
  const listRef = useRef(null);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const voicesRef = useRef([]);

  // Setup Web Speech API (Speech Recognition) if available
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };
    recognition.onerror = () => {
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
      if (input.trim()) {
        handleSend({ preventDefault: () => {} }, input);
      }
    };
    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(() => transcript);
    };

    recognitionRef.current = recognition;
  }, [input, language]);

  // Setup Speech Synthesis voices
  useEffect(() => {
    const synth = synthRef.current;
    if (!synth) return;
    const loadVoices = () => {
      voicesRef.current = synth.getVoices();
    };
    loadVoices();
    if (typeof synth.onvoiceschanged !== 'undefined') {
      synth.onvoiceschanged = loadVoices;
    }
    return () => {
      if (synth && synth.speaking) synth.cancel();
    };
  }, []);

  const getPreferredVoice = (voices, lang) => {
    if (!voices || !voices.length) return null;
    const by = (fn) => voices.find(fn);
    
    if (lang === 'hi') {
      return (
        by((v) => v.lang && /^hi(-|_)/i.test(v.lang)) ||
        by((v) => v.name && /hindi/i.test(v.name)) ||
        voices[0]
      );
    }
    
    return (
      by((v) => v.name && /google uk english female/i.test(v.name)) ||
      by((v) => v.name && /zira|jenny|aria|neural|natural/i.test(v.name)) ||
      by((v) => v.name && /female/i.test(v.name) && /^en(-|_)/i.test(v.lang || '')) ||
      by((v) => v.lang && /^en-in/i.test(v.lang)) ||
      by((v) => v.lang && /^en(-|_)/i.test(v.lang)) ||
      voices[0]
    );
  };

  const speak = (text) => {
    const synth = synthRef.current;
    if (!synth || !text) return;
    const utter = new SpeechSynthesisUtterance(text);
    const voices = voicesRef.current || [];
    const preferred = getPreferredVoice(voices, language);
    if (preferred) utter.voice = preferred;
    utter.rate = 0.95; // slightly slower for warmth
    utter.pitch = 1.15; // a touch higher for a sweeter tone
    utter.volume = 1;
    utter.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    try {
      if (synth.speaking) synth.cancel();
      synth.speak(utter);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  const toggleMic = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      alert('Voice input is not supported in this browser.');
      return;
    }
    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
      } catch (e) {
        console.warn('Speech recognition start error:', e);
      }
    }
  };

  const toggleSpeak = () => {
    setSpeakEnabled((prev) => !prev);
  };

  const handleQuick = (text) => {
    setInput(text);
    handleSend({ preventDefault: () => {} }, text);
  };

  const parseUserInput = (input) => {
    const lowerInput = input.toLowerCase();
    let newFilters = { ...currentFilters };
    let searchQuery = input;
    let responseText = '';

    // Handle women tops
    if (lowerInput.includes('women tops') || lowerInput.includes('women top')) {
      newFilters.category = 'Women';
      searchQuery = 'women tops kurti blouse shirt';
      responseText = language === 'hi' 
        ? 'बिल्कुल! महिलाओं के बेहतरीन टॉप्स आपके लिए लेकर आया हूं। कुछ और देखना चाहेंगे?'
        : 'Absolutely! I\'ve got some amazing women\'s tops for you. Would you like to see anything else?';
    }
    // Handle price filters
    else if (lowerInput.includes('price less than') || lowerInput.includes('under') || lowerInput.includes('below')) {
      const priceMatch = lowerInput.match(/(?:less than|under|below)\s*(\d+)/);
      if (priceMatch) {
        const maxPrice = parseInt(priceMatch[1]);
        newFilters.priceRange = { max: maxPrice };
        searchQuery = `products under ${maxPrice}`;
        responseText = language === 'hi' 
          ? `वाह! ₹${maxPrice} के अंदर के बेस्ट डील्स लेकर आया हूं। बहुत अच्छी क्वालिटी मिलेगी!`
          : `Great choice! I\'ve found the best deals under ₹${maxPrice} for you. Excellent quality at amazing prices!`;
      }
    }
    // Handle partywear
    else if (lowerInput.includes('partywear') || lowerInput.includes('party wear') || lowerInput.includes('party')) {
      newFilters = {}; // Clear previous filters for partywear
      searchQuery = 'party festive wedding occasion dress lehenga saree';
      responseText = language === 'hi' 
        ? 'परफेक्ट! पार्टी के लिए शानदार कलेक्शन लेकर आया हूं। आप बिल्कुल स्टनिंग लगेंगी!'
        : 'Perfect! I\'ve brought you a stunning party collection. You\'ll look absolutely gorgeous!';
    }
    // Handle reset/clear
    else if (lowerInput.includes('reset') || lowerInput.includes('clear') || lowerInput.includes('show all')) {
      newFilters = {};
      searchQuery = 'all products';
      responseText = language === 'hi' 
        ? 'जी हां! सभी उत्पाद दिखा रहा हूं। कुछ खास चाहिए तो बताइए!'
        : 'Of course! Showing all our products. Let me know if you need something specific!';
    }
    // Default response
    else {
      responseText = language === 'hi' 
        ? `जी हां! "${input}" के लिए बेस्ट कलेक्शन लेकर आया हूं। कुछ और भी देखना चाहेंगे?`
        : `Absolutely! I\'ve got the best collection of "${input}" for you. Would you like to explore more options?`;
    }

    return { newFilters, searchQuery, responseText };
  };

  const handleSend = async (e, presetText) => {
    e.preventDefault();
    const value = typeof presetText === 'string' ? presetText : input;
    const trimmed = value.trim();
    if (!trimmed) return;

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setInput('');
    setIsTyping(true);

    // Parse user input and update filters
    const { newFilters, searchQuery, responseText } = parseUserInput(trimmed);
    setCurrentFilters(newFilters);

    // Trigger product search with filters
    try {
      if (typeof onPrompt === 'function') {
        // Create search request with filters
        const searchRequest = {
          query: searchQuery,
          ...newFilters
        };
        onPrompt(searchRequest);
      }
    } finally {
      // Simulate assistant response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: responseText,
          },
        ]);
        if (speakEnabled) {
          speak(responseText);
        }
        setIsTyping(false);
      }, 500);
    }
  };

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const containerClasses = useMemo(
    () =>
      `bg-gradient-to-b from-purple-50 to-pink-50 border border-purple-200 rounded-xl shadow-lg overflow-hidden flex flex-col ${
        isOpen ? '' : 'opacity-90'
      } h-[78vh]`,
    [isOpen]
  );

  return (
    <div className="sticky top-24">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">AI Fashion Stylist</p>
            <p className="text-[11px] text-purple-600">Virtual Salesman • Online</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="px-2 py-1 text-xs border border-gray-200 rounded-md hover:bg-gray-50"
        >
          {isOpen ? 'Hide' : 'Show'}
        </button>
      </div>

      <div className={containerClasses}>
        <div className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">Chat with AI Salesman</p>
              <p className="text-[11px] opacity-90 leading-tight">Describe your wishlist. I’ll update recommendations.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMic}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium inline-flex items-center gap-2 ${
                isListening ? 'bg-white text-purple-600' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              title={isListening ? 'Listening… click to stop' : 'Click to speak'}
            >
              <svg className={`w-4 h-4 ${isListening ? 'animate-pulse text-purple-600' : 'text-white'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a2 2 0 00-2 2v6a2 2 0 104 0V4a2 2 0 00-2-2z"></path>
                <path fillRule="evenodd" d="M5 10a5 5 0 0010 0h-1a4 4 0 11-8 0H5zm5 7a7 7 0 007-7h-1a6 6 0 11-12 0H3a7 7 0 007 7z" clipRule="evenodd"></path>
              </svg>
              {isListening ? 'Listening…' : 'Speak'}
            </button>
            <button
              onClick={() => setSpeakEnabled((prev) => !prev)}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium inline-flex items-center gap-2 ${
                speakEnabled ? 'bg-white text-purple-600' : 'bg.white/20 bg-white/20 text-white hover:bg-white/30'
              }`}
              title={speakEnabled ? 'Speak responses: ON' : 'Speak responses: OFF'}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l.894 2.76a1 1 0 00.95.69h2.908c.969 0 1.371 1.24.588 1.81l-2.353 1.71a1 1 0 00-.364 1.118l.894 2.76c.3.921-.755 1.688-1.54 1.118l-2.353-1.71a1 1 0 00-1.175 0l-2.353 1.71c-.784.57-1.838-.197-1.54-1.118l.894-2.76a1 1 0 00-.364-1.118L3.507 8.187c-.783-.57-.38-1.81.588-1.81h2.908a1 1 0 00.95-.69l.894-2.76z" />
              </svg>
              {speakEnabled ? 'Speak ON' : 'Speak OFF'}
            </button>
          </div>
        </div>

        <div className="px-3 pt-3 bg-transparent">
          {/* Language toggle */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Language:</span>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-xs rounded ${language === 'en' ? 'bg-purple-600 text-white' : 'bg-white/80 text-purple-600 border border-purple-200'}`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 text-xs rounded ${language === 'hi' ? 'bg-purple-600 text-white' : 'bg-white/80 text-purple-600 border border-purple-200'}`}
              >
                हिंदी
              </button>
            </div>
          </div>
          
          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-2">
            {(language === 'hi' ? [
              'women tops',
              'under 200',
              'partywear',
              'show all',
            ] : [
              'women tops',
              'under 200', 
              'partywear',
              'show all',
            ]).map((chip) => (
              <button
                key={chip}
                onClick={() => handleQuick(chip)}
                className="text-xs px-3 py-1.5 bg-white/80 backdrop-blur border border-purple-200 text-purple-700 rounded-full hover:bg-white"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-transparent">
          {messages.map((m, idx) => (
            m.role === 'assistant' ? (
              <div key={idx} className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white text-[10px] flex items-center justify-center mt-0.5">
                  AI
                </div>
                <div className="max-w-[85%] text-sm leading-relaxed rounded-lg px-3 py-2 shadow-sm bg-white/80 border border-purple-100 text-gray-800 rounded-tl-none">
                  {m.content}
                </div>
              </div>
            ) : (
              <div key={idx} className="flex items-start gap-2 justify-end">
                <div className="max-w-[85%] text-sm leading-relaxed rounded-lg px-3 py-2 shadow-sm bg-meesho-pink text-white rounded-tr-none">
                  {m.content}
                </div>
                <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 text-[10px] flex items-center justify-center mt-0.5">
                  You
                </div>
              </div>
            )
          ))}
          {isTyping && (
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white text-[10px] flex items-center justify-center mt-0.5 hidden"></div>
              <div className="bg-white/80 border border-purple-100 text-gray-600 rounded-tl-none rounded-lg px-3 py-2 text-sm inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:120ms]"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:240ms]"></span>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="border-t border-purple-100 p-2 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={language === 'hi' 
                ? "अपना लुक बताएं (जैसे, लाल धारीदार शर्ट + नीली जींस)"
                : "Describe your look (e.g., red striped shirt + blue jeans)"
              }
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-meesho-pink focus:border-meesho-pink bg-white"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm rounded-md hover:from-purple-600 hover:to-pink-700 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7-7l7 7-7 7"></path>
              </svg>
              Send
            </button>
          </div>
        </form>
      </div>

      <p className="mt-2 text-[11px] text-gray-600 hidden md:block">
        {language === 'hi' 
          ? "बोलें या टाइप करें। हर संदेश के बाद सुझाव अपडेट होते हैं।"
          : "Speak or type to add/refine items. Recommendations update after each prompt."
        }
      </p>
    </div>
  );
};

export default SidebarChatbot;
