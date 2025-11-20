import React from 'react';
import { Mic, MicOff, Video, VideoOff, MonitorUp, PhoneOff, Copy, Check } from 'lucide-react';

interface ControlBarProps {
  audioEnabled: boolean;
  videoEnabled: boolean;
  screenSharing: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onEndCall: () => void;
  roomId: string;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  audioEnabled,
  videoEnabled,
  screenSharing,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onEndCall,
  roomId
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = () => {
    // Use window.location.href to get the exact current URL including hash and protocol
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy link:', err);
      });
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 shadow-2xl z-50 max-w-[95vw]">
      
      <button
        onClick={onToggleAudio}
        className={`p-3 rounded-xl transition-all duration-200 ${
          audioEnabled 
            ? 'bg-slate-800 hover:bg-slate-700 text-white ring-1 ring-white/10' 
            : 'bg-red-500/10 text-red-500 ring-1 ring-red-500/50 hover:bg-red-500/20'
        }`}
        title={audioEnabled ? "Mute" : "Unmute"}
      >
        {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
      </button>

      <button
        onClick={onToggleVideo}
        className={`p-3 rounded-xl transition-all duration-200 ${
          videoEnabled 
            ? 'bg-slate-800 hover:bg-slate-700 text-white ring-1 ring-white/10' 
            : 'bg-red-500/10 text-red-500 ring-1 ring-red-500/50 hover:bg-red-500/20'
        }`}
        title={videoEnabled ? "Turn off camera" : "Turn on camera"}
      >
        {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
      </button>

      <button
        onClick={onToggleScreenShare}
        className={`p-3 rounded-xl transition-all duration-200 ${
          screenSharing 
            ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-600/25' 
            : 'bg-slate-800 hover:bg-slate-700 text-white ring-1 ring-white/10'
        }`}
        title="Share Screen"
      >
        <MonitorUp className="w-5 h-5" />
      </button>

      <div className="w-px h-8 bg-slate-700 mx-1" />

      <button
        onClick={handleCopyLink}
        className="hidden sm:flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all ring-1 ring-white/10"
        title="Copy Invite Link"
      >
        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        <span className="text-sm font-medium">{copied ? "Copied" : "Invite"}</span>
      </button>

      <button
        onClick={onEndCall}
        className="p-3 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25 transition-all"
        title="End Call"
      >
        <PhoneOff className="w-5 h-5 fill-current" />
      </button>
    </div>
  );
};