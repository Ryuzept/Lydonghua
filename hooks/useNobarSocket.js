import { io } from "socket.io-client";
import { useEffect, useRef } from "react";

export function useNobarSocket(token, isHost, videoRef) {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:3000/nobar", {
      auth: { token },
    });

    socketRef.current.on("video_sync", (data) => {
      if (!videoRef.current) return;

      if (data.type === "play") {
        videoRef.current.currentTime = data.currentTime;
        videoRef.current.play();
      }

      if (data.type === "pause") {
        videoRef.current.pause();
      }

      if (data.type === "seek") {
        videoRef.current.currentTime = data.currentTime;
      }
    });

    return () => socketRef.current.disconnect();
  }, []);

  const sendVideoEvent = (type) => {
    if (!isHost) return;

    socketRef.current.emit("video_event", {
      type,
      currentTime: videoRef.current.currentTime,
    });
  };

  return {
    socket: socketRef.current,
    sendVideoEvent,
  };
}
