import React from 'react';
import { MessageCircle, Loader2 } from 'lucide-react';

const ChatLoader = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center z-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      {/* Main Loader Content */}
      <div className="relative flex flex-col items-center justify-center space-y-8">
        {/* Animated Chat Icon */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 blur-xl opacity-20 animate-pulse"></div>
          <div className="relative bg-white rounded-full p-6 shadow-2xl border border-gray-100">
            <MessageCircle className="w-16 h-16 text-blue-500 animate-bounce" />
          </div>
          
          {/* Floating Dots Animation */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
          <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-2 -left-4 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        </div>
        
        {/* Loading Text with Spinner */}
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          <div className="text-xl font-semibold text-gray-700">
            Loading your chat
          </div>
        </div>
        
        {/* Animated Dots */}
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
        </div>
        
        {/* Loading Messages */}
        <div className="text-center space-y-2 max-w-sm">
          <p className="text-gray-500 text-sm animate-fade-in">
            Connecting to chat servers...
          </p>
          <p className="text-xs text-gray-400">
            This may take a few moments
          </p>
        </div>
      </div>
      
      {/* Bottom Branding/Version */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Chat v1.0</span>
        </div>
      </div>
      
      <style jsx='true'>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 2s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
};

export default ChatLoader;