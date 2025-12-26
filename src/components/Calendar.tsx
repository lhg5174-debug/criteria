"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Calendar() {
    const [date, setDate] = useState<Date | null>(null);
    const [viewDate, setViewDate] = useState<Date | null>(null);
    const [memos, setMemos] = useState<{ [key: string]: string }>({});
    const [hoveredDate, setHoveredDate] = useState<string | null>(null);

    useEffect(() => {
        const now = new Date();
        setDate(now);
        setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));

        // Load memos
        const loadedMemos: { [key: string]: string } = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("memo_")) {
                const dateKey = key.replace("memo_", "");
                loadedMemos[dateKey] = localStorage.getItem(key) || "";
            }
        }
        setMemos(loadedMemos);
    }, []);

    if (!date || !viewDate) return null; // Prevent hydration mismatch

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const today = date.getDate();
    const isCurrentMonth =
        date.getFullYear() === year && date.getMonth() === month;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

    const monthNames = [
        "1월",
        "2월",
        "3월",
        "4월",
        "5월",
        "6월",
        "7월",
        "8월",
        "9월",
        "10월",
        "11월",
        "12월",
    ];

    const handlePrevMonth = () => {
        setViewDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        const nextDate = new Date(year, month + 1, 1);
        // Limit to Dec 2026
        if (nextDate.getFullYear() > 2026 || (nextDate.getFullYear() === 2026 && nextDate.getMonth() > 11)) {
            return;
        }
        setViewDate(nextDate);
    };

    const canGoNext = !(year === 2026 && month === 11);

    return (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] w-full max-w-sm mx-auto mt-12 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={handlePrevMonth}
                    className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                >
                    &lt;
                </button>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                    {year}년 {monthNames[month]}
                </h2>
                <button
                    onClick={handleNextMonth}
                    disabled={!canGoNext}
                    className={`p-2 rounded-full text-white transition-colors ${canGoNext ? "hover:bg-white/10" : "opacity-30 cursor-not-allowed"
                        }`}
                >
                    &gt;
                </button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center mb-2">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <div
                        key={i}
                        className={`text-sm font-medium ${i === 0 ? "text-red-400" : "text-zinc-400"
                            }`}
                    >
                        {d}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
                {blanks.map((_, i) => (
                    <div key={`blank-${i}`} />
                ))}
                {days.map((d) => {
                    const isToday = isCurrentMonth && d === today;
                    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                    const hasMemo = memos[dateString];
                    const isHovered = hoveredDate === dateString;

                    return (
                        <div key={d} className="relative group">
                            <Link
                                href={`/calendar/${dateString}`}
                                className={`
                                    h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium transition-all cursor-pointer relative
                                    ${isToday
                                        ? "bg-white text-black font-bold shadow-lg scale-110"
                                        : "text-zinc-200 hover:bg-white/10"
                                    }
                                    ${hasMemo ? "ring-1 ring-white/50" : ""}
                                `}
                                onMouseEnter={() => setHoveredDate(dateString)}
                                onMouseLeave={() => setHoveredDate(null)}
                            >
                                {d}
                                {hasMemo && (
                                    <div className="absolute bottom-1 w-1 h-1 bg-red-400 rounded-full"></div>
                                )}
                            </Link>

                            {/* Tooltip */}
                            {hasMemo && isHovered && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-zinc-900/90 text-white text-xs rounded-lg shadow-xl backdrop-blur-sm border border-white/10 z-50 pointer-events-none animate-fade-in-up">
                                    <p className="line-clamp-3 text-left">{hasMemo}</p>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900/90"></div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
