import React, { useEffect, useRef, useState } from 'react';
import './LivingWeatherBackground.css';

export default function LivingWeatherBackground({ condition = 'Clear', isDay = true, coord = { lat: 0, lon: 0 } }) {
  const canvasRef = useRef(null);
  const [lightningActive, setLightningActive] = useState(false);

  const cond = condition.toLowerCase();
  const isRain = cond.includes('rain') || cond.includes('drizzle');
  const isThunder = cond.includes('thunder');
  const isSnow = cond.includes('snow');
  const isClear = cond.includes('clear');
  const isClouds = cond.includes('cloud');
  const isMist = cond.includes('mist') || cond.includes('fog') || cond.includes('haze');

  // Canvas Particle System (Rain, Snow, Sunbeams, Stars)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Initialize particles
    let particles = [];
    const count = isRain ? 150 : isThunder ? 220 : isSnow ? 110 : isClear ? 45 : 30;

    for (let i = 0; i < count; i++) {
      particles.push(initParticle(cond, w, h));
    }

    let thunderTimer = 0;

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      // Random lightning flash trigger for thunderstorms
      if (isThunder) {
        thunderTimer++;
        if (thunderTimer > 160 + Math.random() * 200) {
          thunderTimer = 0;
          setLightningActive(true);
          setTimeout(() => setLightningActive(false), 240);
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (isRain || isThunder) {
          // Rain streak drawing
          ctx.beginPath();
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 3.5, p.y + p.len);
          ctx.stroke();

          p.x += p.vx;
          p.y += p.vy;

          if (p.y > h) {
            p.y = -p.len;
            p.x = Math.random() * w;
          }
          if (p.x > w) p.x = 0;
          if (p.x < 0) p.x = w;
        } else if (isSnow) {
          // Soft snowflake
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          p.angle += p.spin;
          p.x += Math.sin(p.angle) * p.drift;
          p.y += p.vy;

          if (p.y > h) {
            p.y = -5;
            p.x = Math.random() * w;
          }
          if (p.x > w) p.x = 0;
          if (p.x < 0) p.x = w;
        } else if (isClear) {
          // Radiant sun sparkles / warm golden motes
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 12;
          ctx.shadowColor = 'rgba(251, 191, 36, 0.8)';
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          p.x += p.vx;
          p.y += p.vy;
          p.alpha += p.dAlpha;
          if (p.alpha <= 0.1 || p.alpha >= 0.85) p.dAlpha *= -1;

          if (p.x < 0) p.x = w;
          if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h;
          if (p.y > h) p.y = 0;
        } else {
          // Floating soft vapor or dust
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          p.x += p.vx;
          p.y += p.vy;

          if (p.x > w + p.size) p.x = -p.size;
          if (p.y > h) p.y = -5;
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, [cond, isRain, isThunder, isSnow, isClear]);

  // Determine Sky Environment Style
  const skyThemeClass = isThunder
    ? 'sky-thunderstorm'
    : isRain
    ? 'sky-rain'
    : isSnow
    ? 'sky-snow'
    : isClouds
    ? 'sky-clouds'
    : isMist
    ? 'sky-mist'
    : isDay
    ? 'sky-clear-day'
    : 'sky-clear-night';

  return (
    <div className={`living-weather-background ${skyThemeClass} ${lightningActive ? 'lightning-flash' : ''}`}>
      {/* 1. Dynamic Full-Screen Sky & Atmospheric Backdrop */}
      <div className="sky-gradient-layer" />

      {/* 2. Clear Sky Sun / Stars Elements */}
      {isClear && isDay && (
        <div className="celestial-sun-system">
          <div className="solar-sun-disc" />
          <div className="solar-corona" />
          <div className="solar-flare flare-primary" />
          <div className="solar-flare flare-secondary" />
        </div>
      )}

      {isClear && !isDay && (
        <div className="night-starfield-system">
          <div className="lunar-moon-disc" />
          <div className="lunar-glow" />
        </div>
      )}

      {/* 3. Thunderstorm Lightning Bolt Overlay */}
      {isThunder && lightningActive && (
        <div className="lightning-bolt-container">
          <svg className="lightning-bolt-svg" viewBox="0 0 400 800" preserveAspectRatio="none">
            <polyline
              points="200,0 180,180 230,220 170,420 220,460 160,800"
              stroke="#ffffff"
              strokeWidth="4"
              fill="none"
              filter="drop-shadow(0 0 16px #c084fc)"
            />
            <polyline
              points="180,180 130,280"
              stroke="#e9d5ff"
              strokeWidth="2"
              fill="none"
            />
            <polyline
              points="170,420 120,530"
              stroke="#e9d5ff"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>
      )}

      {/* 4. Clouds & Mist Volumetric Silhouette Layers */}
      {(isClouds || isMist || isRain || isThunder) && (
        <div className="cloud-silhouettes-system">
          <div className="cloud-formation cloud-layer-1" />
          <div className="cloud-formation cloud-layer-2" />
          <div className="cloud-formation cloud-layer-3" />
        </div>
      )}

      {/* 5. Snow Frosting Vignette */}
      {isSnow && <div className="frost-glacier-border" />}

      {/* 6. Active Particle Simulation Canvas */}
      <canvas ref={canvasRef} className="living-weather-canvas" />

      {/* 7. Subtle Geospatial Latitude/Longitude Horizon Grid */}
      <div className="subtle-geo-horizon">
        <div className="horizon-line" />
      </div>
    </div>
  );
}

function initParticle(cond, w, h) {
  if (cond.includes('rain') || cond.includes('drizzle') || cond.includes('thunder')) {
    const isHeavy = cond.includes('thunder');
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: isHeavy ? -3 - Math.random() * 2 : -1.2 - Math.random() * 1.5,
      vy: isHeavy ? 22 + Math.random() * 12 : 14 + Math.random() * 8,
      size: isHeavy ? 2 + Math.random() * 1.2 : 1.2 + Math.random() * 0.8,
      len: isHeavy ? 35 + Math.random() * 25 : 20 + Math.random() * 16,
      color: isHeavy ? 'rgba(216, 235, 255, 0.85)' : 'rgba(186, 230, 253, 0.65)'
    };
  } else if (cond.includes('snow')) {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vy: 1.2 + Math.random() * 2.5,
      drift: 0.8 + Math.random() * 1.5,
      angle: Math.random() * Math.PI * 2,
      spin: 0.015 + Math.random() * 0.03,
      size: 2 + Math.random() * 4,
      color: `rgba(255, 255, 255, ${0.55 + Math.random() * 0.45})`
    };
  } else if (cond.includes('clear')) {
    const alpha = 0.25 + Math.random() * 0.55;
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.7,
      vy: -0.4 - Math.random() * 0.6,
      size: 1.8 + Math.random() * 3.2,
      alpha,
      dAlpha: 0.008 + Math.random() * 0.015,
      color: `rgba(253, 224, 71, ${alpha})`
    };
  } else {
    // Cloud mist particle
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: 0.3 + Math.random() * 0.6,
      vy: (Math.random() - 0.5) * 0.2,
      size: 3 + Math.random() * 6,
      color: `rgba(203, 213, 225, ${0.15 + Math.random() * 0.25})`
    };
  }
}
