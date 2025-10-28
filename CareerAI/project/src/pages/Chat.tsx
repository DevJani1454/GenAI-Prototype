import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  message: string;
  role: 'user' | 'assistant';
  created_at: string;
}

export function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChatHistory();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  async function fetchChatHistory() {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;
      if (data) setMessages(data);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    try {
      await supabase.from('chat_history').insert({
        user_id: user.id,
        message: userMessage,
        role: 'user',
      });

      const aiResponse = `Thank you for your message: "${userMessage}". This is a placeholder response. In production, this would connect to a GenAI service to provide personalized career guidance based on your profile, goals, and context.`;

      await supabase.from('chat_history').insert({
        user_id: user.id,
        message: aiResponse,
        role: 'assistant',
      });

      fetchChatHistory();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <Bot className="h-8 w-8 text-blue-600" />
          <span>Career Navigator AI</span>
        </h1>
        <p className="text-gray-600 mt-1">Get personalized career guidance powered by AI</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Bot className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Start a Conversation</h3>
            <p className="text-gray-600">Ask me anything about your career path, skills, or goals</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
            </div>
            <div
              className={`flex-1 px-4 py-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.message}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {new Date(msg.created_at).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <Bot className="h-5 w-5 text-gray-700" />
            </div>
            <div className="px-4 py-3 bg-gray-100 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-6 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your career path, skills, or goals..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-6 w-6" />
          </button>
        </div>
      </form>
    </div>
  );
}
