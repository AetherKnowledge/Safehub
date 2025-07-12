// signal-types.ts (custom simplified version)
export type RTCIceCandidateLite = {
  candidate: string;
  sdpMid: string | null;
  sdpMLineIndex: number | null;
  usernameFragment?: string;
};

export type RTCSessionDescriptionInitLite = {
  type: "offer" | "answer" | "pranswer" | "rollback";
  sdp?: string;
};

export type SignalData =
  | {
      type: "transceiverRequest";
      transceiverRequest: {
        kind: string;
        init?: object; // simplify for now
      };
    }
  | {
      type: "renegotiate";
      renegotiate: true;
    }
  | {
      type: "candidate";
      candidate: RTCIceCandidateLite;
    }
  | RTCSessionDescriptionInitLite;
