import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, ShieldCheck, Globe2, ArrowRight } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  const createRoom = () => {
    const roomId = uuidv4();
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12 text-center">
      
      {/* Hero Section */}
      <div className="max-w-3xl w-full space-y-8 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
          </span>
          P2P Secure Video Chat
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
          Connect Instantly. <br /> No Logins.
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Start a video call in seconds. Just click a button, share the link, and you're live. 
          Peer-to-peer technology ensures your conversation stays between you.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <button
            onClick={createRoom}
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-primary-600 hover:bg-primary-500 rounded-full transition-all duration-200 shadow-xl shadow-primary-600/20 hover:shadow-primary-600/40 hover:-translate-y-0.5"
          >
            Start New Meeting
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl w-full px-4">
        {[
          {
            icon: <Video className="w-6 h-6 text-blue-400" />,
            title: "HD Video & Audio",
            desc: "Crystal clear quality powered by WebRTC."
          },
          {
            icon: <ShieldCheck className="w-6 h-6 text-green-400" />,
            title: "No Data Stored",
            desc: "Direct connection. No servers record your video."
          },
          {
            icon: <Globe2 className="w-6 h-6 text-purple-400" />,
            title: "Universal Access",
            desc: "Works on any device with a modern browser."
          }
        ].map((feature, i) => (
          <div key={i} className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors text-left">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-4">
              {feature.icon}
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">{feature.title}</h3>
            <p className="text-slate-400 text-sm">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};