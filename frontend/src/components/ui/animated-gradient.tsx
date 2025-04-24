"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function AnimatedGradient({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const gradientRef = useRef<CanvasGradient | null>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    
    if (!context) return;
    
    contextRef.current = context;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    
    let time = 0;
    let animationFrameId: number;
    
    const render = () => {
      if (!contextRef.current) return;
      
      time += 0.01;
      
      const width = canvas.width;
      const height = canvas.height;
      
      const gradient = contextRef.current.createLinearGradient(
        width * Math.sin(time * 0.3) * 0.5 + width * 0.5,
        height * Math.cos(time * 0.2) * 0.5 + height * 0.5,
        width * Math.cos(time * 0.1) * 0.5 + width * 0.5,
        height * Math.sin(time * 0.4) * 0.5 + height * 0.5
      );
      
      if (document.documentElement.classList.contains("dark")) {
        gradient.addColorStop(0, `hsla(263, 70%, 50%, ${0.3 + Math.sin(time) * 0.1})`);
        gradient.addColorStop(0.33, `hsla(191, 97%, 77%, ${0.3 + Math.cos(time) * 0.1})`);
        gradient.addColorStop(0.66, `hsla(221, 83%, 53%, ${0.3 + Math.sin(time) * 0.1})`);
        gradient.addColorStop(1, `hsla(316, 70%, 50%, ${0.3 + Math.cos(time) * 0.1})`);
      } else {
        gradient.addColorStop(0, `hsla(263, 70%, 50%, ${0.2 + Math.sin(time) * 0.05})`);
        gradient.addColorStop(0.33, `hsla(191, 97%, 77%, ${0.2 + Math.cos(time) * 0.05})`);
        gradient.addColorStop(0.66, `hsla(221, 83%, 53%, ${0.2 + Math.sin(time) * 0.05})`);
        gradient.addColorStop(1, `hsla(316, 70%, 50%, ${0.2 + Math.cos(time) * 0.05})`);
      }
      
      gradientRef.current = gradient;
      
      contextRef.current.clearRect(0, 0, width, height);
      contextRef.current.fillStyle = gradientRef.current;
      contextRef.current.fillRect(0, 0, width, height);
      
      animationFrameId = window.requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <motion.canvas
      ref={canvasRef}
      className={`absolute top-0 left-0 w-full h-full -z-10 opacity-70 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.7 }}
      transition={{ duration: 1 }}
    />
  );
}