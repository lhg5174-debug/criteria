"use client";

import Calendar from "@/components/Calendar";
import Link from "next/link";

export default function CalendarPage() {

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-transparent font-sans">
            <main className="relative z-10 flex flex-col items-center justify-center px-4 w-full max-w-4xl gap-8">
                <h1 className="text-3xl font-bold text-white mb-4 animate-fade-in-up">
                    입시 일정
                </h1>
                <Calendar />

                <Link
                    href="/"
                    className="mt-8 text-zinc-400 hover:text-white transition-colors underline underline-offset-4"
                >
                    메인으로 돌아가기
                </Link>
            </main>
        </div>
    );
}
