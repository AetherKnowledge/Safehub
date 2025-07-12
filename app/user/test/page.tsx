"use client";

import TimePicker from "@/app/components/Student/Appointments/Booking/TimePicker";
import { useCallback, useEffect } from "react";
import Peer from "simple-peer";

const Test = () => {
  useEffect(() => {
    // const peer1 = new Peer({
    //   initiator: true,
    //   trickle: false,
    // });
    // const peer2 = new Peer({
    //   initiator: false,
    //   trickle: false,
    // });

    // peer1.on("signal", (data) => {
    //   console.log("Peer 1 signal:", data);
    //   // Send this data to peer2 via your signaling server
    //   peer2.signal(data);
    // });

    // peer2.on("signal", (data) => {
    //   console.log("Peer 2 signal:", data);
    //   // Send this data to peer1 via your signaling server
    //   peer1.signal(data);
    // });

    // peer1.on("connect", () => {
    //   console.log("Peer 1 connected to Peer 2");
    //   peer1.send("Hello from Peer 1");
    // });

    // peer2.on("connect", () => {
    //   console.log("Peer 2 connected to Peer 1");
    //   peer2.send("Hello from Peer 2");
    // });

    // peer1.on("data", (data) => {
    //   console.log("Peer 1 received:", data.toString());
    // });

    // peer2.on("data", (data) => {
    //   console.log("Peer 2 received:", data.toString());
    // });

    const peer1 = createPeer("member1", true);
    const peer2 = createPeer("member2", false);

    peer1.on("signal", (data) => {
      console.log("Peer 1 signal:", data);
      // Send this data to peer2 via your signaling server
      peer2.signal(data);
    });

    peer2.on("signal", (data) => {
      console.log("Peer 2 signal:", data);
      // Send this data to peer1 via your signaling server
      peer1.signal(data);
    });
  }, []);

  const createPeer = useCallback((member: string, initiator: boolean) => {
    const iceServers: RTCIceServer[] = [
      {
        urls: ["turn:192.168.254.59:3478?transport=udp"],
        username: "testuser",
        credential: "testpass",
      },
    ];

    console.log("Creating peer for member:", member);
    const peer = new Peer({
      initiator,
      trickle: false,
    });

    peer.on("connect", () => {
      console.log("yo");
      peer.send("Hello from " + member);
    });

    peer.on("error", (error) => {
      console.error("Peer connection error:", error);
    });

    peer.on("close", () => {
      console.log("Peer connection closed.");
    });

    peer.on("data", (data) => {
      console.log(data);
    });

    //what the fuck the tutorial scammed me the shit below broke everything
    // const rtcPeerConnection: RTCPeerConnection = (peer as any)._pc;
    // rtcPeerConnection.onicecandidate = (event) => {
    //   if (
    //     rtcPeerConnection.iceConnectionState === "disconnected" ||
    //     rtcPeerConnection.iceConnectionState === "failed"
    //   ) {
    //     console.log("ICE connection failed");
    //   }
    // };

    return peer;
  }, []);

  return <TimePicker />;
};

export default Test;
