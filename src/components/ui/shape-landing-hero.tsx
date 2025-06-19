"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Circle } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";


function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    gradient = "from-white/[0.08]",
}: {
    className?: string;
    delay?: number;
    width?: number;
    height?: number;
    rotate?: number;
    gradient?: string;
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -150,
                rotate: rotate - 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: rotate,
            }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1.2 },
            }}
            className={cn("absolute", className)}
        >
            <motion.div
                animate={{
                    y: [0, 15, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                style={{
                    width,
                    height,
                }}
                className="relative"
            >
                <div
                    className={cn(
                        "absolute inset-0 rounded-full",
                        "bg-gradient-to-r to-transparent",
                        gradient,
                        "backdrop-blur-[2px] border-2 border-white/[0.15]",
                        "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
                        "after:absolute after:inset-0 after:rounded-full",
                        "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
                    )}
                />
            </motion.div>
        </motion.div>
    );
}

function HeroGeometric({
    badge = "FlowsyAI Revolution",
    title1 = "AI Automation",
    title2 = "Redefined",
}: {
    badge?: string;
    title1?: string;
    title2?: string;
}) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                delay: 0.5 + i * 0.2,
                ease: [0.25, 0.4, 0.25, 1],
            },
        }),
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950/20 to-purple-950/20">
            {/* Dynamic Background Gradient */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.08] via-purple-500/[0.05] to-cyan-500/[0.08] blur-3xl transition-all duration-1000"
                style={{
                    transform: `translate(${(mousePosition.x - 50) * 0.1}px, ${(mousePosition.y - 50) * 0.1}px)`,
                }}
            />

            {/* Animated Shapes with FlowsyAI Colors */}
            <div className="absolute inset-0 overflow-hidden">
                <ElegantShape
                    delay={0.3}
                    width={600}
                    height={140}
                    rotate={12}
                    gradient="from-blue-500/[0.2]"
                    className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
                />

                <ElegantShape
                    delay={0.5}
                    width={500}
                    height={120}
                    rotate={-15}
                    gradient="from-purple-500/[0.2]"
                    className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
                />

                <ElegantShape
                    delay={0.4}
                    width={300}
                    height={80}
                    rotate={-8}
                    gradient="from-cyan-500/[0.2]"
                    className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
                />

                <ElegantShape
                    delay={0.6}
                    width={200}
                    height={60}
                    rotate={20}
                    gradient="from-blue-400/[0.15]"
                    className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
                />

                <ElegantShape
                    delay={0.7}
                    width={150}
                    height={40}
                    rotate={-25}
                    gradient="from-purple-400/[0.15]"
                    className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <motion.div
                        custom={0}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20 backdrop-blur-sm mb-8 md:mb-12"
                    >
                        <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 animate-pulse" />
                        <span className="text-sm text-blue-200/80 tracking-wide font-medium">
                            {badge}
                        </span>
                    </motion.div>

                    {/* Main Title */}
                    <motion.div
                        custom={1}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-6 md:mb-8 tracking-tight leading-[1.1]">
                            <span className="block bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent mb-2">
                                {title1}
                            </span>
                            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                                {title2}
                            </span>
                        </h1>
                    </motion.div>

                    {/* Description */}
                    <motion.div
                        custom={2}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <p className="text-base sm:text-lg md:text-xl text-white/70 mb-12 leading-relaxed font-medium tracking-wide max-w-2xl mx-auto">
                            Crafting exceptional digital experiences through
                            innovative design and cutting-edge technology.
                        </p>
                    </motion.div>

                    {/* CTA Button */}
                    <motion.div
                        custom={3}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex justify-center"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-2xl shadow-blue-500/30 border border-blue-400/50 transition-all duration-300"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Join the Revolution
                                <motion.div
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    →
                                </motion.div>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </motion.button>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80 pointer-events-none" />
        </div>
    );
}

export { HeroGeometric }
