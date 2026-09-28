import React, { useEffect, useRef } from 'react';
import './WeatherAtmosphereEffect.css';

export default function WeatherAtmosphereEffect({ condition = 'Clear', isDay = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const cond = condition.toLowerCase();

    // 1. Initialize Particles depending on weather condition
    let particles = [];
    const count =
      cond.includes('rain') || cond.includes('drizzle')
        ? 120
        : cond.includes('snow')
        ? 90
        : cond.includes('thunder')
        ? 160
        : cond.includes('clear')
        ? 35
        : 45; // clouds/mist

    for (let i = 0; i < count; i++) {
      particles.push(createParticle(cond, width, height));
    }

    let lightningTimer = 0;
    let lightningFlash = 0;

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Handle Lightning Flash for Thunderstorms
      if (cond.includes('thunder')) {
        lightningTimer++;
        if (lightningTimer > 180 + Math.random() * 240) {
          lightningFlash = 0.75 + Math.random() * 0.25;
          lightningTimer = 0;
        }
        if (lightningFlash > 0) {
          ctx.fillStyle = `rgba(220, 210, 255, ${lightningFlash * 0.35})`;
          ctx.fillRect(0, 0, width, height);
          lightningFlash *= 0.88;
          if (lightningFlash < 0.02) lightningFlash = 0;
        }
      }

      // Render & Update Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (cond.includes('rain') || cond.includes('drizzle') || cond.includes('thunder')) {
          // Rain streak drawing
          ctx.beginPath();
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 3, p.y + p.length);
          ctx.stroke();

          // Movement
          p.x += p.vx;
          p.y += p.vy;

          if (p.y > height) {
            p.y = -p.length;
            p.x = Math.random() * width;
          }
          if (p.x > width) p.x = 0;
        } else if (cond.includes('snow')) {
          // Soft floating snowflake
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          p.angle += p.spin;
          p.x += Math.sin(p.angle) * p.drift;
          p.y += p.vy;

          if (p.y > height) {
            p.y = -5;
            p.x = Math.random() * width;
          }
          if (p.x > width) p.x = 0;
          if (p.x < 0) p.x = width;
        } else if (cond.includes('clear')) {
          // Floating solar sparkles / dust motes
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          p.x += p.vx;
          p.y += p.vy;
          p.alpha += p.dAlpha;
          if (p.alpha <= 0.1 || p.alpha >= 0.8) p.dAlpha *= -1;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        } else {
          // Clouds / Mist / Haze: soft drifting volumetric vapor circles
          ctx.beginPath();
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          gradient.addColorStop(0, p.color);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          p.x += p.vx;
          p.y += p.vy;

          if (p.x - p.size > width) p.x = -p.size;
          if (p.x + p.size < 0) p.x = width + p.size;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [condition]);

  const cond = condition.toLowerCase();
  const isRain = cond.includes('rain') || cond.includes('drizzle');
  const isThunder = cond.includes('thunder');
  const isSnow = cond.includes('snow');
  const isClear = cond.includes('clear');
  const isClouds = cond.includes('cloud');
  const isMist = cond.includes('mist') || cond.includes('fog') || cond.includes('haze');

  return (
    <div className={`weather-atmosphere-container condition-${cond.replace(/\s+/g, '-')}`}>
      {/* 1. Canvas particle layer (Rain drops, snow flakes, solar motes) */}
      <canvas ref={canvasRef} className="atmosphere-canvas" />

      {/* 2. Visual Weather Backdrop Overlays */}
      {isClear && (
        <div className="sunbeam-radiance-layer">
          <div className="sun-core-glow" />
          <div className="sun-flare flare-1" />
          <div className="sun-flare flare-2" />
        </div>
      )}

      {(isRain || isThunder) && (
        <div className="storm-vignette-layer">
          <div className="rain-cloud-darkness" />
          {isThunder && <div className="thunder-flicker-ambient" />}
        </div>
      )}

      {isSnow && (
        <div className="snow-frost-layer">
          <div className="frost-corner-vignette" />
        </div>
      )}

      {(isClouds || isMist) && (
        <div className="clouds-mist-layer">
          <div className="cloud-sheet sheet-1" />
          <div className="cloud-sheet sheet-2" />
        </div>
      )}
    </div>
  );
}

function createParticle(cond, width, height) {
  if (cond.includes('rain') || cond.includes('drizzle') || cond.includes('thunder')) {
    const isHeavy = cond.includes('thunder');
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: isHeavy ? -2.5 - Math.random() * 2 : -1 - Math.random() * 1.5,
      vy: isHeavy ? 18 + Math.random() * 12 : 12 + Math.random() * 8,
      size: isHeavy ? 1.5 + Math.random() * 1.2 : 1 + Math.random() * 0.8,
      length: isHeavy ? 26 + Math.random() * 18 : 16 + Math.random() * 14,
      color: isHeavy ? 'rgba(186, 230, 253, 0.75)' : 'rgba(147, 197, 253, 0.55)'
    };
  } else if (cond.includes('snow')) {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vy: 1 + Math.random() * 2.2,
      drift: 0.6 + Math.random() * 1.2,
      angle: Math.random() * Math.PI * 2,
      spin: 0.01 + Math.random() * 0.03,
      size: 1.8 + Math.random() * 3.5,
      color: `rgba(255, 255, 255, ${0.45 + Math.random() * 0.5})`
    };
  } else if (cond.includes('clear')) {
    const alpha = 0.2 + Math.random() * 0.5;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -0.4 - Math.random() * 0.6,
      size: 1.5 + Math.random() * 2.8,
      alpha,
      dAlpha: 0.008 + Math.random() * 0.012,
      color: `rgba(251, 191, 36, ${alpha})`
    };
  } else {
    // Cloud mist vapor puff
    return {
      x: Math.random() * width,
      y: Math.random() * height * 0.8,
      vx: 0.2 + Math.random() * 0.5,
      vy: (Math.random() - 0.5) * 0.15,
      size: 80 + Math.random() * 140,
      color: `rgba(148, 163, 184, ${0.05 + Math.random() * 0.08})`
    };
  }
}
