"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface GuestbookEntry {
    id: string;
    name: string;
    message: string;
    date: string;
    created_at?: string;
}

export default function Guestbook() {
    const [entries, setEntries] = useState<GuestbookEntry[]>([]);
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        fetchEntries();

        const channel = supabase
            .channel('guestbook_channel')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'guestbook',
                },
                (payload: any) => {
                    const newEntry = payload.new as GuestbookEntry;
                    const formattedEntry = {
                        ...newEntry,
                        date: new Date(newEntry.created_at!).toLocaleDateString("ko-KR"),
                    };
                    setEntries((prev) => [formattedEntry, ...prev]);
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'guestbook',
                },
                (payload: any) => {
                    setEntries((prev) => prev.filter((entry) => entry.id !== payload.old.id));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchEntries = async () => {
        const { data, error } = await supabase
            .from('guestbook')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching guestbook:', error);
        } else if (data) {
            const formattedData = data.map((entry: any) => ({
                ...entry,
                date: new Date(entry.created_at).toLocaleDateString("ko-KR"),
            }));
            setEntries(formattedData);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("삭제하겠습니까?")) return;

        try {
            const response = await fetch('/api/guestbook/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Error deleting entry:', data.error);
                alert('삭제 실패했습니다.');
            } else {
                // Optimistic update
                setEntries((prev) => prev.filter((entry) => entry.id !== id));
            }
        } catch (error) {
            console.error('Delete request failed:', error);
            alert('삭제 요청 중 오류가 발생했습니다.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !message.trim()) return;

        const { error } = await supabase
            .from('guestbook')
            .insert([
                {
                    name: name.trim(),
                    message: message.trim(),
                },
            ]);

        if (error) {
            console.error('Error submitting entry:', error);
            alert('Failed to submit entry. Please try again.');
        } else {
            setName("");
            setMessage("");
        }
    };

    if (!isClient) return null;

    return (
        <div className="w-full max-w-md mt-12 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <h2 className="text-2xl font-serif italic text-white mb-6 text-center">Livre d'or</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
                <input
                    type="text"
                    placeholder="Votre Nom (이름)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/50 transition-colors"
                    maxLength={20}
                />
                <textarea
                    placeholder="Message (메시지)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/50 transition-colors resize-none h-24"
                    maxLength={100}
                />
                <button
                    type="submit"
                    disabled={!name.trim() || !message.trim()}
                    className="px-4 py-2 rounded-lg bg-white/20 text-white font-light hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Signer (등록하기)
                </button>
            </form>

            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {entries.length === 0 ? (
                    <p className="text-white/40 text-center font-light text-sm italic">
                        Soyez le premier à signer! (첫 번째로 남겨보세요!)
                    </p>
                ) : (
                    entries.map((entry) => (
                        <div key={entry.id} className="bg-white/5 p-3 rounded-lg border border-white/5 group relative">
                            <button
                                onClick={() => handleDelete(entry.id)}
                                className="absolute top-2 right-2 text-white/40 hover:text-white transition-colors opacity-0 group-hover:opacity-100 text-xs"
                                aria-label="삭제"
                            >
                                삭제
                            </button>
                            <div className="flex justify-between items-baseline mb-1 pr-6">
                                <span className="text-white font-medium text-sm">{entry.name}</span>
                                <span className="text-white/30 text-xs">{entry.date}</span>
                            </div>
                            <p className="text-white/80 text-sm font-light break-words">{entry.message}</p>
                        </div>
                    ))
                )}
            </div>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
        </div>
    );
}
