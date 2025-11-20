export interface PeerState {
  myId: string;
  remoteId: string | null;
  connected: boolean;
  isInitiator: boolean;
}

export interface MediaState {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  error: string | null;
}

export enum CallStatus {
  IDLE = 'IDLE',
  WAITING = 'WAITING', // Generated link, waiting for someone to join
  CONNECTING = 'CONNECTING', // Signaling happening
  CONNECTED = 'CONNECTED', // P2P established
  ENDED = 'ENDED',
  ERROR = 'ERROR'
}