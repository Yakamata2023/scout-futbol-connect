import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  id: number;
}

interface BallpitBackgroundProps {
  count?: number;
  colors?: string[];
}

export const BallpitBackground: React.FC<BallpitBackgroundProps> = ({ 
  count = 50, 
  colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'] 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const clickEffectRef = useRef<Array<{ x: number; y: number; strength: number; decay: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initBalls = () => {
      ballsRef.current = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 20 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        id: i
      }));
    };

    const updateBalls = () => {
      const gravity = 0.1;
      const friction = 0.99;
      const bounce = 0.8;

      ballsRef.current.forEach(ball => {
        // Apply gravity
        ball.vy += gravity;
        
        // Apply friction
        ball.vx *= friction;
        ball.vy *= friction;

        // Enhanced mouse interaction - flowing effect
        const dx = mouseRef.current.x - ball.x;
        const dy = mouseRef.current.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150;
          // Create flowing effect - attract when far, repel when close
          if (distance > 50) {
            ball.vx += (dx / distance) * force * 0.3;
            ball.vy += (dy / distance) * force * 0.3;
          } else {
            ball.vx -= (dx / distance) * force * 0.8;
            ball.vy -= (dy / distance) * force * 0.8;
          }
        }

        // Process click effects
        clickEffectRef.current.forEach((effect, index) => {
          const clickDx = effect.x - ball.x;
          const clickDy = effect.y - ball.y;
          const clickDistance = Math.sqrt(clickDx * clickDx + clickDy * clickDy);
          
          if (clickDistance < 200) {
            const clickForce = (200 - clickDistance) / 200 * effect.strength;
            ball.vx -= (clickDx / clickDistance) * clickForce * 2;
            ball.vy -= (clickDy / clickDistance) * clickForce * 2;
          }
          
          effect.strength *= effect.decay;
          if (effect.strength < 0.1) {
            clickEffectRef.current.splice(index, 1);
          }
        });

        // Update position
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Wall collisions
        if (ball.x + ball.radius > canvas.width) {
          ball.x = canvas.width - ball.radius;
          ball.vx *= -bounce;
        }
        if (ball.x - ball.radius < 0) {
          ball.x = ball.radius;
          ball.vx *= -bounce;
        }
        if (ball.y + ball.radius > canvas.height) {
          ball.y = canvas.height - ball.radius;
          ball.vy *= -bounce;
        }
        if (ball.y - ball.radius < 0) {
          ball.y = ball.radius;
          ball.vy *= -bounce;
        }
      });

      // Ball collisions
      for (let i = 0; i < ballsRef.current.length; i++) {
        for (let j = i + 1; j < ballsRef.current.length; j++) {
          const ball1 = ballsRef.current[i];
          const ball2 = ballsRef.current[j];
          
          const dx = ball2.x - ball1.x;
          const dy = ball2.y - ball1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < ball1.radius + ball2.radius) {
            const angle = Math.atan2(dy, dx);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);
            
            // Separate balls
            const overlap = ball1.radius + ball2.radius - distance;
            ball1.x -= overlap * 0.5 * cos;
            ball1.y -= overlap * 0.5 * sin;
            ball2.x += overlap * 0.5 * cos;
            ball2.y += overlap * 0.5 * sin;
            
            // Exchange velocities
            const vx1 = ball1.vx * cos + ball1.vy * sin;
            const vy1 = ball1.vy * cos - ball1.vx * sin;
            const vx2 = ball2.vx * cos + ball2.vy * sin;
            const vy2 = ball2.vy * cos - ball2.vx * sin;
            
            ball1.vx = vx2 * cos - vy1 * sin;
            ball1.vy = vy1 * cos + vx2 * sin;
            ball2.vx = vx1 * cos - vy2 * sin;
            ball2.vy = vy2 * cos + vx1 * sin;
          }
        }
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ballsRef.current.forEach(ball => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        
        // Create gradient for 3D effect
        const gradient = ctx.createRadialGradient(
          ball.x - ball.radius * 0.3,
          ball.y - ball.radius * 0.3,
          0,
          ball.x,
          ball.y,
          ball.radius
        );
        gradient.addColorStop(0, ball.color);
        gradient.addColorStop(1, ball.color + '80');
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Add shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.fill();
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      });
    };

    const animate = () => {
      updateBalls();
      render();
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      
      // Add multiple click effects for more bouncing
      for (let i = 0; i < 3; i++) {
        clickEffectRef.current.push({
          x: clickX + (Math.random() - 0.5) * 50,
          y: clickY + (Math.random() - 0.5) * 50,
          strength: 15 + Math.random() * 10,
          decay: 0.95
        });
      }
    };

    const handleResize = () => {
      resizeCanvas();
      initBalls();
    };

    resizeCanvas();
    initBalls();
    animate();

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, [count, colors]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 opacity-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.1 }}
      transition={{ duration: 2 }}
    />
  );
};