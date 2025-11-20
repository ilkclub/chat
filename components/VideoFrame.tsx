import React, { useEffect, useRef } from 'react';
import { MicOff, User, MonitorUp } from 'lucide-react';

interface VideoFrameProps {
  stream: MediaStream | null;
  muted?: boolean;
  isLocal?: boolean;
  label: string;
  isScreenShare?: boolean;
  audioEnabled?: boolean;
}

export const VideoFrame: React.FC<VideoFrameProps> = ({ 
  stream, 
  muted = false, 
  isLocal = false, 
  label,
  isScreenShare = false,
  audioEnabled = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl ring-1 ring-white/5 group">
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={muted} // Local video should always be muted to avoid feedback
          className={`w-full h-full object-cover transition-transform duration-300 ${isLocal && !isScreenShare ? 'scale-x-[-1]' : ''}`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-slate-800/50 animate-pulse">
          <div className="flex flex-col items-center gap-4 text-slate-500">
            <div className="p-4 rounded-full bg-slate-700/50">
              <User className="w-12 h-12" />
            </div>
            <span className="text-sm font-medium">Waiting for video...</span>
          </div>
        </div>
      )}

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Labels and Icons */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
          <span className="text-xs font-semibold text-white tracking-wide truncate max-w-[150px]">
            {label} {isLocal ? '(You)' : ''}
          </span>
          {isScreenShare && <MonitorUp className="w-3 h-3 text-blue-400" />}
        </div>

        {!audioEnabled && (
          <div className="bg-red-500/90 backdrop-blur-md p-1.5 rounded-lg shadow-lg">
            <MicOff className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};