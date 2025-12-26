"use client";

import Image from "next/image";
import Link from "next/link";
import Fireworks from "@/components/Fireworks";
import Guestbook from "@/components/Guestbook";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-start pt-40 overflow-hidden bg-transparent font-sans">
      <Fireworks />



      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full max-w-4xl gap-8">
        <h1 className="text-[50px] leading-[1.1] sm:text-8xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#ffd700] to-[#fbfb8c] animate-fade-in-up drop-shadow-[0_0_25px_rgba(255,215,0,0.3)] font-serif italic">
          Minhyeong<br />
          <span className="text-4xl sm:text-6xl text-white not-italic font-light tracking-widest mt-4 block">
            Félicitations
          </span>
        </h1>

        <Link
          href="/calendar"
          className="inline-flex items-center justify-center px-8 py-3 text-lg font-light tracking-widest text-white border border-white/30 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 hover:border-white/50 transition-all duration-300 animate-fade-in-up font-serif group"
          style={{ animationDelay: "0.2s" }}
        >
          <span className="mr-2 group-hover:-translate-y-1 transition-transform duration-300">📅</span>
          CALENDRIER
        </Link>

        <Guestbook />
      </main>
    </div>
  );
}
