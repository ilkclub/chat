import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Peer, { MediaConnection } from 'peerjs';
import { VideoFrame } from '../components/VideoFrame';
import { ControlBar } from '../components/ControlBar';
import { CallStatus } from '../types';
import { Loader2, AlertCircle, Copy, Check, Users, Share2 } from 'lucide-react';

export const Room: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<CallStatus>(CallStatus.CONNECTING);
  
  // Stream State
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  
  // Feature State
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Refs for persistence
  const peerRef = useRef<Peer | null>(null);
  const callRef = useRef<MediaConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null); 

  useEffect(() => {
    if (!roomId) {
      navigate('/');
      return;
    }

    const initializePeer = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setLocalStream(stream);
        localStreamRef.current = stream;

        const peer = new Peer(roomId, {
          debug: 2
        });

        peer.on('open', (id) => {
          console.log('My peer ID is: ' + id);
          setStatus(CallStatus.WAITING);
        });

        peer.on('error', (err: any) => {
            if (err.type === 'unavailable-id') {
                console.log('Room ID taken, entering as Guest...');
                const guestPeer = new Peer();
                
                guestPeer.on('open', (guestId) => {
                    setStatus(CallStatus.CONNECTING);
                    
                    if (localStreamRef.current) {
                        const call = guestPeer.call(roomId, localStreamRef.current);
                        callRef.current = call;
                        
                        call.on('stream', (remoteStream) => {
                            setRemoteStream(remoteStream);
                            setStatus(CallStatus.CONNECTED);
                        });

                        call.on('close', () => {
                            onEndCall();
                        });
                    }
                });

                guestPeer.on('call', (incomingCall) => {
                    console.log('Guest received call back');
                    incomingCall.answer(localStreamRef.current || undefined);
                    incomingCall.on('stream', (stream) => {
                         setRemoteStream(stream);
                         setStatus(CallStatus.CONNECTED);
                    });
                });

                peerRef.current = guestPeer;
            } else {
                console.error(err);
                setStatus(CallStatus.ERROR);
            }
        });

        peer.on('call', (incomingCall) => {
          console.log('Receiving call from ' + incomingCall.peer);
          setStatus(CallStatus.CONNECTING);
          
          incomingCall.answer(localStreamRef.current || undefined);
          callRef.current = incomingCall;

          incomingCall.on('stream', (stream) => {
            setRemoteStream(stream);
            setStatus(CallStatus.CONNECTED);
          });

          incomingCall.on('close', () => {
             setRemoteStream(null);
             setStatus(CallStatus.WAITING);
          });
        });

        peerRef.current = peer;

      } catch (err) {
        console.error("Failed to get local stream", err);
        setStatus(CallStatus.ERROR);
      }
    };

    initializePeer();

    return () => {
      localStreamRef.current?.getTracks().forEach(track => track.stop());
      callRef.current?.close();
      peerRef.current?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, navigate]);

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      stopScreenShare();
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];

        if (callRef.current && peerRef.current) {
          const sender = callRef.current.peerConnection.getSenders().find((s) => s.track?.kind === 'video');
          if (sender) {
            sender.replaceTrack(screenTrack);
          }
        }

        const newStream = new MediaStream([screenTrack, ...localStream!.getAudioTracks()]);
        setLocalStream(newStream);
        setIsScreenSharing(true);

        screenTrack.onended = () => {
          stopScreenShare();
        };

      } catch (err) {
        console.error("Failed to get display media", err);
      }
    }
  };

  const stopScreenShare = async () => {
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const videoTrack = cameraStream.getVideoTracks()[0];
      
      if (callRef.current) {
        const sender = callRef.current.peerConnection.getSenders().find((s) => s.track?.kind === 'video');
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      }

      const audioTrack = cameraStream.getAudioTracks()[0];
      audioTrack.enabled = isAudioEnabled;
      
      if (!isVideoEnabled) {
        videoTrack.enabled = false;
      }

      setLocalStream(cameraStream);
      localStreamRef.current = cameraStream;
      setIsScreenSharing(false);

    } catch (err) {
      console.error("Failed to revert to camera", err);
    }
  };

  const onEndCall = () => {
    peerRef.current?.destroy();
    navigate('/');
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="h-full w-full flex flex-col p-4 sm:p-6 gap-6 relative">
      
      {/* Status Overlay for WAITING */}
      {status === CallStatus.WAITING && !remoteStream && (
         <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6 animate-fade-in-up">
              <div className="w-16 h-16 bg-primary-600/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Share2 className="w-8 h-8 text-primary-500" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Waiting for others</h2>
                <p className="text-slate-400">Share the link below to invite someone to this video call.</p>
              </div>

              <div className="bg-slate-800/50 p-1 rounded-xl flex items-center border border-slate-700">
                <div className="flex-1 px-3 text-sm text-slate-400 truncate font-mono">
                  {window.location.href}
                </div>
                <button 
                  onClick={copyInviteLink}
                  className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {isCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Listening for incoming connection...</span>
              </div>
            </div>
         </div>
      )}
      
      {/* Error Toast */}
      {status === CallStatus.ERROR && (
         <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500/90 text-white px-6 py-3 rounded-full flex items-center gap-2 backdrop-blur-md shadow-lg">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Connection Error. Please refresh page.</span>
         </div>
      )}

      {/* Connecting Toast */}
      {status === CallStatus.CONNECTING && (
         <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-blue-500/90 text-white px-6 py-3 rounded-full flex items-center gap-2 backdrop-blur-md shadow-lg animate-pulse">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="font-medium">Establishing secure connection...</span>
         </div>
      )}

      {/* Video Grid */}
      <div className={`flex-1 grid gap-6 transition-all duration-500 ${remoteStream ? 'grid-rows-2 md:grid-rows-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        
        {/* Local Stream */}
        <div className={`relative transition-all duration-500 overflow-hidden rounded-2xl ${!remoteStream ? 'max-w-4xl mx-auto w-full aspect-video' : 'w-full h-full'}`}>
           <VideoFrame 
             stream={localStream} 
             muted={true} 
             isLocal={true} 
             label={status === CallStatus.WAITING ? "You (Host)" : "You"}
             isScreenShare={isScreenSharing}
             audioEnabled={isAudioEnabled}
           />
        </div>

        {/* Remote Stream */}
        {remoteStream && (
          <div className="w-full h-full animate-fade-in">
             <VideoFrame 
                stream={remoteStream} 
                isLocal={false} 
                label="Peer" 
             />
          </div>
        )}
      </div>

      <ControlBar
        audioEnabled={isAudioEnabled}
        videoEnabled={isVideoEnabled}
        screenSharing={isScreenSharing}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onToggleScreenShare={toggleScreenShare}
        onEndCall={onEndCall}
        roomId={roomId || ''}
      />
    </div>
  );
};