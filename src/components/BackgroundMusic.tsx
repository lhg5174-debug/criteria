"use client";

import React, { useState, useRef, useEffect } from "react";

export default function BackgroundMusic() {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Attempt auto-play on mount (often blocked, but worth a try)
        if (audioRef.current) {
            audioRef.current.volume = 0.5;
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(() => setIsPlaying(false)); // Autoplay blocked
        }
    }, []);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <audio ref={audioRef} src="/carol.mp3" loop />

            <button
                onClick={togglePlay}
                className={`
            w-12 h-12 flex items-center justify-center rounded-full 
            backdrop-blur-md bg-white/10 border border-white/20 shadow-lg 
            text-2xl transition-all hover:scale-110 hover:bg-white/20
            ${!isPlaying ? "animate-pulse ring-2 ring-red-400" : ""}
        `}
                title={isPlaying ? "Pause Music" : "Play Music"}
            >
                {isPlaying ? "🔊" : "🔇"}
            </button>
        </div>
    );
}
