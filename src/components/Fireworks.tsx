"use client";

import React, { useEffect, useRef } from "react";

export default function Fireworks() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const particles: Particle[] = [];
        const fireworks: Firework[] = [];

        class Firework {
            x: number;
            y: number;
            sx: number;
            sy: number;
            tx: number;
            ty: number;
            distanceToTarget: number;
            distanceTraveled: number;
            coordinates: [number, number][];
            angle: number;
            speed: number;
            acceleration: number;
            brightness: number;
            targetRadius: number;

            constructor(sx: number, sy: number, tx: number, ty: number) {
                this.x = sx;
                this.y = sy;
                this.sx = sx;
                this.sy = sy;
                this.tx = tx;
                this.ty = ty;
                this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
                this.distanceTraveled = 0;
                this.coordinates = [];
                this.coordinates.push([this.x, this.y]);
                this.angle = Math.atan2(ty - sy, tx - sx);
                this.speed = 2;
                this.acceleration = 1.05;
                this.brightness = Math.random() * 50 + 50;
                this.targetRadius = 1;
            }

            update(index: number) {
                this.coordinates.pop();
                this.coordinates.unshift([this.x, this.y]);

                if (this.targetRadius < 8) {
                    this.targetRadius += 0.3;
                } else {
                    this.targetRadius = 1;
                }

                this.speed *= this.acceleration;
                const vx = Math.cos(this.angle) * this.speed;
                const vy = Math.sin(this.angle) * this.speed;

                this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);

                if (this.distanceTraveled >= this.distanceToTarget) {
                    createParticles(this.tx, this.ty);
                    fireworks.splice(index, 1);
                } else {
                    this.x += vx;
                    this.y += vy;
                }
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
                ctx.lineTo(this.x, this.y);
                const colors = ['#0055A4', '#FFFFFF', '#EF4135'];
                ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
                ctx.stroke();
            }
        }

        class Particle {
            x: number;
            y: number;
            coordinates: [number, number][];
            angle: number;
            speed: number;
            friction: number;
            gravity: number;
            hue: number;
            brightness: number;
            alpha: number;
            decay: number;

            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
                this.coordinates = [];
                this.coordinates.push([this.x, this.y]);
                this.angle = Math.random() * Math.PI * 2;
                this.speed = Math.random() * 15 + 2;
                this.friction = 0.95;
                this.gravity = 1;
                this.hue = Math.random() * 360;
                this.brightness = Math.random() * 50 + 50;
                this.alpha = 1;
                this.decay = Math.random() * 0.02 + 0.01;
            }

            update(index: number) {
                this.coordinates.pop();
                this.coordinates.unshift([this.x, this.y]);
                this.speed *= this.friction;
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed + this.gravity;
                this.alpha -= this.decay;

                if (this.alpha <= this.decay) {
                    particles.splice(index, 1);
                }
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
                ctx.lineTo(this.x, this.y);
                ctx.lineWidth = Math.random() * 2 + 1;
                const colors = ['#0055A4', '#FFFFFF', '#EF4135'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                ctx.strokeStyle = color;
                ctx.stroke();
            }
        }

        function calculateDistance(x1: number, y1: number, x2: number, y2: number) {
            const xDistance = x2 - x1;
            const yDistance = y2 - y1;
            return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
        }

        function createParticles(x: number, y: number) {
            let particleCount = 100;
            while (particleCount--) {
                particles.push(new Particle(x, y));
            }
        }

        function loop() {
            if (!ctx) return;
            // Use composite operation to create trails
            ctx.globalCompositeOperation = "destination-out";
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.fillRect(0, 0, width, height);
            ctx.globalCompositeOperation = "lighter";

            let i = fireworks.length;
            while (i--) {
                fireworks[i].draw();
                fireworks[i].update(i);
            }

            let j = particles.length;
            while (j--) {
                particles[j].draw();
                particles[j].update(j);
            }

            // Randomly launch fireworks
            if (Math.random() < 0.05) {
                fireworks.push(new Firework(width / 2, height, Math.random() * width, Math.random() * height / 2));
            }

            requestAnimationFrame(loop);
        }

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener("resize", handleResize);
        loop();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />;
}
