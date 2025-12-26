"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function MemoPage() {
    const params = useParams();
    const date = params.date as string;
    const [memo, setMemo] = useState("");

    useEffect(() => {
        const savedMemo = localStorage.getItem(`memo_${date}`);
        if (savedMemo) {
            setMemo(savedMemo);
        }
    }, [date]);

    const handleSave = () => {
        localStorage.setItem(`memo_${date}`, memo);
        alert("메모가 저장되었습니다.");
    };

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-transparent font-sans">
            <main className="relative z-10 flex flex-col items-center justify-center px-4 w-full max-w-2xl gap-8">
                <h1 className="text-3xl font-bold text-white mb-4 animate-fade-in-up">
                    {date} 메모
                </h1>

                <div className="w-full backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] animate-fade-in-up">
                    <textarea
                        className="w-full h-64 bg-transparent text-white text-lg p-4 focus:outline-none placeholder-white/30 resize-none"
                        placeholder="오늘의 메모를 입력하세요..."
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                    />
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-colors"
                        >
                            저장하기
                        </button>
                    </div>
                </div>

                <Link
                    href="/calendar"
                    className="mt-4 text-zinc-400 hover:text-white transition-colors underline underline-offset-4"
                >
                    달력으로 돌아가기
                </Link>
            </main>
        </div>
    );
}
