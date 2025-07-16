import React, { createContext, useContext, useRef, useState } from "react";

const TranscriptContext = createContext(undefined);

const TranscriptProvider = ({ children }) => {
  const playerRef = useRef(null);
  const [videoDetails, setVideoDetails] = useState(null);
  const [selectedTranscript, setSelectedTranscript] = useState(null);

  return (
    <TranscriptContext.Provider
      value={{
        playerRef,
        videoDetails,
        setVideoDetails,
        selectedTranscript,
        setSelectedTranscript,
      }}
    >
      {children}
    </TranscriptContext.Provider>
  );
};

const UseTranscript = () => {
  const context = useContext(TranscriptContext);
  if (!context) {
    throw new Error("transcriptContext must be used within a TranscriptProvider");
  }
  return context;
};

export { TranscriptContext, TranscriptProvider, UseTranscript };
