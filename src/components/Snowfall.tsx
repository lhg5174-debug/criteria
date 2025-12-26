"use client";

import React, { useEffect, useState } from "react";

export default function Snowfall() {
    const [snowflakes, setSnowflakes] = useState<
        { id: number; left: string; animationDelay: string; fontSize: string }[]
    >([]);

    useEffect(() => {
        const flakes = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            fontSize: `${Math.random() * 13 + 13}px`,
        }));
        setSnowflakes(flakes);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0">
            {snowflakes.map((flake) => (
                <div
                    key={flake.id}
                    className="snowflake"
                    style={{
                        left: flake.left,
                        animationDelay: flake.animationDelay,
                        fontSize: flake.fontSize,
                    }}
                >
                    ❄
                </div>
            ))}
        </div>
    );
}
