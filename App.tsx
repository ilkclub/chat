import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Room } from './pages/Room';
import { Video, Zap } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50 font-sans selection:bg-primary-500 selection:text-white">
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.hash = '/'}>
          <div className="bg-primary-600 p-1.5 rounded-lg shadow-lg shadow-primary-600/20">
            <Video className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Flash<span className="text-primary-500">Meet</span></h1>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <div className="hidden md:flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>Instant Connection</span>
          </div>
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden">
        <HashRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/room/:roomId" element={<Room />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </main>
    </div>
  );
};

export default App;