import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import confetti from 'canvas-confetti';
import {
  Ship,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  Compass,
  ArrowRight,
  Anchor,
  Users,
  DollarSign,
  Activity,
  CheckCircle2,
  Sliders,
  RotateCcw,
  Waves
} from 'lucide-react';

export default function App() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const waveIntervalRef = useRef<any>(null);

  // Physics state
  const [activePhysicsMode, setActivePhysicsMode] = useState<'zero-g' | 'wave'>('zero-g');
  const [coinCount, setCoinCount] = useState(0);

  // Unit Economics Calculator State
  const [b2cUsers, setB2cUsers] = useState(300);
  const [b2bClients, setB2bClients] = useState(15);
  const [calculatorPreset, setCalculatorPreset] = useState<'mvp' | 'growth' | 'leader'>('mvp');

  // MRR & ARR calculations
  const b2cMonthly = b2cUsers * 5;
  const b2bMonthly = b2bClients * 60;
  const mrr = b2cMonthly + b2bMonthly;
  const arr = mrr * 12;
  const netProfit = Math.round(arr * 0.85); // 85% margin
  const b2cShare = Math.round((b2cMonthly / (mrr || 1)) * 100);

  // Preset handlers
  const applyPreset = (preset: 'mvp' | 'growth' | 'leader') => {
    setCalculatorPreset(preset);
    if (preset === 'mvp') {
      setB2cUsers(300);
      setB2bClients(15);
    } else if (preset === 'growth') {
      setB2cUsers(1500);
      setB2bClients(50);
    } else {
      setB2cUsers(4200);
      setB2bClients(120);
    }
  };

  // Setup Matter.js
  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const Runner = Matter.Runner;
    const Bodies = Matter.Bodies;
    const Composite = Matter.Composite;
    const Events = Matter.Events;
    const Mouse = Matter.Mouse;
    const MouseConstraint = Matter.MouseConstraint;

    const engine = Engine.create();
    engine.world.gravity.y = 0.04;
    engineRef.current = engine;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const render = Render.create({
      element: container,
      engine: engine,
      options: {
        width: width,
        height: height,
        background: 'transparent',
        wireframes: false,
      },
    });
    renderRef.current = render;

    // Boundary walls
    const wallOptions = { isStatic: true, render: { fillStyle: 'transparent' } };
    const ground = Bodies.rectangle(width / 2, height + 60, width * 2, 120, wallOptions);
    const ceiling = Bodies.rectangle(width / 2, -60, width * 2, 120, wallOptions);
    const leftWall = Bodies.rectangle(-60, height / 2, 120, height * 2, wallOptions);
    const rightWall = Bodies.rectangle(width + 60, height / 2, 120, height * 2, wallOptions);

    Composite.add(engine.world, [ground, ceiling, leftWall, rightWall]);

    // Tags list
    const tags = [
      'AI', 'B2B', 'SaaS', 'IoT', '$', 'FLEET', 'API', 'PROFIT', 'PORT',
      'RADAR', 'VESSEL', 'LOGISTICS', 'ROI', 'AUTONOMOUS', 'ROUTE'
    ];

    const colors = [
      'rgba(56, 189, 248, 0.40)', // Sea Neon
      'rgba(245, 245, 247, 0.60)', // Silver White
      'rgba(148, 163, 184, 0.45)', // Steel Gray
      'rgba(52, 211, 153, 0.40)',  // Emerald Green
      'rgba(96, 165, 250, 0.35)',  // Deep Sky Blue
    ];

    // Helper to generate bodies
    const createBodies = (count: number, isCoin = false) => {
      const items: Matter.Body[] = [];
      for (let i = 0; i < count; i++) {
        const x = Math.random() * (width - 120) + 60;
        const y = isCoin ? 80 : Math.random() * (height * 0.7);
        const size = isCoin ? 42 : Math.random() * 38 + 26;
        const color = isCoin
          ? 'rgba(251, 191, 36, 0.90)'
          : colors[Math.floor(Math.random() * colors.length)];

        const shapeOptions: Matter.IChamferableBodyDefinition = {
          render: {
            fillStyle: color,
            strokeStyle: isCoin ? '#fef08a' : 'rgba(255, 255, 255, 0.35)',
            lineWidth: isCoin ? 2.5 : 1,
          },
          restitution: isCoin ? 0.96 : 0.92,
          frictionAir: 0.007,
          label: isCoin ? '$' : (i < tags.length ? tags[i] : (tags[Math.floor(Math.random() * tags.length)])),
          chamfer: { radius: 8 },
        };

        let body: Matter.Body;
        if (isCoin || i % 3 === 0) {
          body = Bodies.circle(x, y, size / 2, shapeOptions);
        } else if (i % 3 === 1) {
          body = Bodies.rectangle(x, y, size, size, shapeOptions);
        } else {
          body = Bodies.polygon(x, y, 6, size / 1.7, shapeOptions);
        }

        Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.08);
        Matter.Body.setVelocity(body, {
          x: (Math.random() - 0.5) * 6,
          y: (Math.random() - 0.5) * 6,
        });

        items.push(body);
      }
      return items;
    };

    // Spawn 35 initial bodies
    const initialShapes = createBodies(35);
    Composite.add(engine.world, initialShapes);

    // Canvas text rendering event for labels
    Events.on(render, 'afterRender', () => {
      const ctx = render.context;
      const bodies = Composite.allBodies(engine.world);

      ctx.save();
      ctx.font = '700 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      bodies.forEach((body) => {
        if (body.label && body.label.length <= 12 && !body.isStatic) {
          ctx.save();
          ctx.translate(body.position.x, body.position.y);
          ctx.rotate(body.angle);

          if (body.label === '$') {
            ctx.fillStyle = '#1e1b4b';
            ctx.font = '900 16px "JetBrains Mono", sans-serif';
            ctx.fillText('$', 0, 1);
          } else {
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.shadowBlur = 4;
            ctx.fillText(body.label, 0, 0);
          }
          ctx.restore();
        }
      });
      ctx.restore();
    });

    // Mouse control WITHOUT wheel hijacking!
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    // Remove wheel event listeners so scrolling down works naturally
    try {
      mouse.element.removeEventListener('mousewheel', (mouse as any).mousewheel);
      mouse.element.removeEventListener('DOMMouseScroll', (mouse as any).mousewheel);
      mouse.element.removeEventListener('wheel', (mouse as any).mousewheel);
    } catch {
      // Ignore if not present
    }

    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    Render.run(render);
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // Handle resize
    const handleResize = () => {
      if (!container || !render.canvas) return;
      width = container.clientWidth;
      height = container.clientHeight;
      render.canvas.width = width;
      render.canvas.height = height;

      Matter.Body.setPosition(ground, { x: width / 2, y: height + 60 });
      Matter.Body.setPosition(rightWall, { x: width + 60, y: height / 2 });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
      Render.stop(render);
      Runner.stop(runner);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, []);

  // Physics mode switcher: Zero-G
  const handleSetZeroG = () => {
    if (waveIntervalRef.current) {
      clearInterval(waveIntervalRef.current);
      waveIntervalRef.current = null;
    }
    setActivePhysicsMode('zero-g');
    if (engineRef.current) {
      engineRef.current.world.gravity.x = 0;
      engineRef.current.world.gravity.y = 0.04;
    }
  };

  // Physics mode switcher: Sea Wave (sinusoidal gravity)
  const handleSetWave = () => {
    if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
    setActivePhysicsMode('wave');

    let angle = 0;
    waveIntervalRef.current = setInterval(() => {
      if (engineRef.current) {
        angle += 0.08;
        engineRef.current.world.gravity.x = Math.sin(angle) * 0.45;
        engineRef.current.world.gravity.y = Math.cos(angle) * 0.25 + 0.1;
      }
    }, 50);
  };

  // Impulse blast (scatter objects)
  const handleBlast = () => {
    if (!engineRef.current) return;
    const bodies = Matter.Composite.allBodies(engineRef.current.world);
    bodies.forEach((body) => {
      if (!body.isStatic) {
        Matter.Body.setVelocity(body, {
          x: (Math.random() - 0.5) * 24,
          y: (Math.random() - 0.5) * 24,
        });
        Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.2);
      }
    });
  };

  // Spawn Coins ($)
  const handleSpawnCoins = () => {
    if (!engineRef.current || !renderRef.current) return;
    const width = renderRef.current.options.width || 800;

    const newCoins: Matter.Body[] = [];
    for (let i = 0; i < 6; i++) {
      const x = Math.random() * (width - 140) + 70;
      const coin = Matter.Bodies.circle(x, 60, 20, {
        render: {
          fillStyle: 'rgba(251, 191, 36, 0.95)',
          strokeStyle: '#fef08a',
          lineWidth: 2.5,
        },
        restitution: 0.95,
        frictionAir: 0.006,
        label: '$',
      });
      Matter.Body.setVelocity(coin, {
        x: (Math.random() - 0.5) * 10,
        y: Math.random() * 4 + 2,
      });
      newCoins.push(coin);
    }
    Matter.Composite.add(engineRef.current.world, newCoins);
    setCoinCount((prev) => prev + 6);

    // Subtle celebratory confetti
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.2 },
      colors: ['#fbbf24', '#f59e0b', '#38bdf8', '#34d399'],
    });
  };

  // Reset objects
  const handleResetWorld = () => {
    if (!engineRef.current || !renderRef.current) return;
    const bodies = Matter.Composite.allBodies(engineRef.current.world);
    bodies.forEach((body) => {
      if (!body.isStatic) {
        Matter.Composite.remove(engineRef.current!.world, body);
      }
    });
    setCoinCount(0);
    // recreate 30 fresh bodies
    const width = renderRef.current.options.width || 800;
    const height = renderRef.current.options.height || 600;
    const tags = ['AI', 'B2B', 'SaaS', 'IoT', '$', 'FLEET', 'API', 'PORT'];
    const colors = ['rgba(56, 189, 248, 0.4)', 'rgba(245, 245, 247, 0.6)', 'rgba(52, 211, 153, 0.4)'];
    const fresh: Matter.Body[] = [];
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * (width - 100) + 50;
      const y = Math.random() * height * 0.7;
      const size = Math.random() * 34 + 24;
      const b = Matter.Bodies.circle(x, y, size / 2, {
        render: {
          fillStyle: colors[i % colors.length],
          strokeStyle: 'rgba(255,255,255,0.3)',
          lineWidth: 1,
        },
        restitution: 0.9,
        frictionAir: 0.008,
        label: tags[i % tags.length],
      });
      fresh.push(b);
    }
    Matter.Composite.add(engineRef.current.world, fresh);
    handleSetZeroG();
  };

  // Setup Spotlight and IntersectionObserver
  useEffect(() => {
    // Spotlight glow calculation
    const handleMouseMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll<HTMLElement>('.card');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // IntersectionObserver for .reveal elements
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => {
      revealObserver.observe(el);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      revealObserver.disconnect();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-[#f5f5f7] overflow-x-hidden">
      {/* 1. Header Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#121216]/80 backdrop-blur-xl border-b border-white/10 transition-all">
        <div className="w-[92%] max-w-[1240px] mx-auto py-3.5 flex justify-between items-center">
          <a href="#hero" className="flex items-center gap-3 group text-xl font-bold tracking-tight text-white">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#38bdf8] to-[#0284c7] flex items-center justify-center text-black font-extrabold shadow-[0_0_15px_rgba(56,189,248,0.4)]">
              <Ship className="w-4 h-4 text-white" />
            </div>
            <span>
              Startup<span className="text-[#38bdf8]">X</span>
            </span>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#34d399]/15 text-[#34d399] border border-[#34d399]/40 tracking-wider font-semibold">
              LIVE DEMO
            </span>
          </a>

          <ul className="hidden md:flex items-center gap-8 text-[14px] text-[#a1a1a6] font-medium">
            <li>
              <a href="#hero" className="hover:text-white transition-colors">
                Главная
              </a>
            </li>
            <li>
              <a href="#features" className="hover:text-white transition-colors">
                О продукте
              </a>
            </li>
            <li>
              <a href="#monetization" className="hover:text-white transition-colors">
                Бизнес-модель
              </a>
            </li>
            <li>
              <a href="#calculator" className="hover:text-white transition-colors flex items-center gap-1.5 text-[#38bdf8]">
                <TrendingUp className="w-3.5 h-3.5" />
                Калькулятор ROI
              </a>
            </li>
            <li>
              <a href="#team" className="hover:text-white transition-colors">
                Команда
              </a>
            </li>
          </ul>

          <div className="flex items-center gap-3">
            <a
              href="#calculator"
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all hover:scale-105"
            >
              Расчет выручки
            </a>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section with Matter.js Canvas */}
      <header id="hero" className="relative h-screen min-h-[720px] flex items-center justify-center bg-[radial-gradient(circle_at_50%_25%,#0c1a2e_0%,#000000_75%)] overflow-hidden">
        {/* Matter.js Canvas Container */}
        <div id="canvas-container" ref={canvasRef} className="absolute inset-0 z-0 select-none" />

        {/* Hero Interactive UI Overlay */}
        <div className="relative z-10 text-center max-w-[860px] px-6 pointer-events-none mt-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#38bdf8]/15 border border-[#38bdf8]/40 text-[#38bdf8] text-xs font-semibold tracking-wide uppercase mb-6 shadow-[0_0_20px_rgba(56,189,248,0.2)] animate-pulse">
            <Anchor className="w-3.5 h-3.5 text-[#38bdf8]" />
            Морской Техно-Хакатон 2026
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-5 leading-[1.08] bg-gradient-to-br from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Инновации без границ
          </h1>

          <p className="text-lg md:text-xl text-slate-300/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Автоматизируем процессы, снижаем издержки флота и создаем масштабируемую бизнес-модель. Хватайте фигуры мышкой или переключайте режимы физики ниже!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pointer-events-auto mb-8">
            <a
              href="#calculator"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#38bdf8] to-[#0284c7] text-white font-semibold text-base shadow-[0_8px_30px_rgba(56,189,248,0.35)] hover:shadow-[0_12px_40px_rgba(56,189,248,0.55)] hover:-translate-y-0.5 transition-all"
            >
              <DollarSign className="w-4 h-4" />
              Посчитать прибыль
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>

            <a
              href="#features"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-base border border-white/20 backdrop-blur-md transition-all hover:border-white/40"
            >
              <Compass className="w-4 h-4 text-[#38bdf8]" />
              Как это работает
            </a>
          </div>

          {/* Physics Control Dock for Jury */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 p-2 rounded-full bg-[#121622]/90 backdrop-blur-xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] pointer-events-auto">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest pl-3 pr-2 hidden sm:inline">
              Физика:
            </span>

            <button
              onClick={handleSetZeroG}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activePhysicsMode === 'zero-g'
                  ? 'bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/50 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Невесомость
            </button>

            <button
              onClick={handleSetWave}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activePhysicsMode === 'wave'
                  ? 'bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/50 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Waves className="w-3.5 h-3.5 text-[#38bdf8]" />
              Морская качка
            </button>

            <button
              onClick={handleBlast}
              className="px-4 py-2 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-all flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 text-rose-400" />
              Импульс
            </button>

            <button
              onClick={handleSpawnCoins}
              className="px-4 py-2 rounded-full text-xs font-bold bg-[#fbbf24]/20 text-[#fbbf24] hover:bg-[#fbbf24]/30 border border-[#fbbf24]/40 shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all flex items-center gap-1.5"
            >
              <DollarSign className="w-3.5 h-3.5" />
              + Монеты ($)
              {coinCount > 0 && <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#fbbf24] text-black text-[10px] font-black">{coinCount}</span>}
            </button>

            <button
              onClick={handleResetWorld}
              title="Перезапустить симуляцию"
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 3. Features Section (with connected .reveal and .step-card with 8rem watermark numbers) */}
      <section id="features" className="py-28 relative border-t border-white/5 reveal">
        <div className="w-[90%] max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              О нашем продукте
            </h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              От реальной проблемы индустрии к готовому техническому решению
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="card step-card reveal-item">
              <div className="step-number">01</div>
              <div className="card-tag">Боль рынка</div>
              <h3>Проблема</h3>
              <p>
                Учет, снабжение и контроль в морской отрасли до сих пор ведутся вручную через десятки таблиц и мессенджеров, что приводит к простоям и потере денег.
              </p>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-rose-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                Потери судовладельцев: до $18,000 / рейс
              </div>
            </div>

            {/* Card 2 */}
            <div className="card step-card reveal-item">
              <div className="step-number">02</div>
              <div className="card-tag">Продукт</div>
              <h3>Решение</h3>
              <p>
                Единая платформа с мгновенным доступом: автоматические уведомления, прозрачная аналитика и удобный интерфейс без сложного внедрения.
              </p>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#34d399] font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Внедрение за 1 день без остановки рейса
              </div>
            </div>

            {/* Card 3 */}
            <div className="card step-card reveal-item">
              <div className="step-number">03</div>
              <div className="card-tag">Архитектура</div>
              <h3>Технологии</h3>
              <p>
                Быстрый асинхронный бэкенд, мобильная адаптивность, работа при слабом интернете на рейде и защита данных корпоративного уровня.
              </p>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#38bdf8] font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                Offline-First PWA + TLS 1.3 шифрование
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Monetization & Interactive Unit Economics Calculator */}
      <section id="monetization" className="py-28 bg-[#0a0e17] relative border-t border-white/5 reveal">
        <div className="w-[90%] max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              Бизнес-модель и Монетизация
            </h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              Три потока выручки с высокой маржинальностью
            </p>
          </div>

          {/* Three revenue streams cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="card step-card reveal-item">
              <div className="step-number">$1</div>
              <div className="card-tag">Захват рынка (CAC -&gt; $0)</div>
              <h3>Freemium</h3>
              <p>
                Базовый функционал бесплатен для курсантов и рядовых специалистов — это обеспечивает вирусный органический рост базы без затрат на рекламу.
              </p>
              <div className="mt-6 inline-block px-3 py-1 rounded-full bg-white/5 text-[12px] font-mono text-slate-300">
                0 руб. на рекламу
              </div>
            </div>

            <div className="card step-card reveal-item">
              <div className="step-number">$2</div>
              <div className="card-tag">Регулярный доход (MRR)</div>
              <h3>Подписка (B2C / B2B)</h3>
              <p>
                Премиум-автоматизация, ИИ-аналитика и командные доступы по подписке от $5/мес для физлиц и от $49/мес для компаний.
              </p>
              <div className="mt-6 inline-block px-3 py-1 rounded-full bg-[#38bdf8]/15 text-[12px] font-mono text-[#38bdf8]">
                LTV / CAC &gt; 5.2x
              </div>
            </div>

            <div className="card step-card reveal-item">
              <div className="step-number">$3</div>
              <div className="card-tag">Крупные чеки (Enterprise)</div>
              <h3>White-label и Комиссия</h3>
              <p>
                Лицензирование платформы под брендом судоходных компаний, крюингов и учебных центров + партнерская комиссия за целевые заявки.
              </p>
              <div className="mt-6 inline-block px-3 py-1 rounded-full bg-[#fbbf24]/15 text-[12px] font-mono text-[#fbbf24]">
                Чеки от $5,000 / год
              </div>
            </div>
          </div>

          {/* Interactive Unit Economics / ROI Calculator Card */}
          <div id="calculator" className="card reveal-item border-[#38bdf8]/30 shadow-[0_0_50px_rgba(56,189,248,0.1)]">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10">
              <div>
                <span className="card-tag flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  Интерактивный расчет Unit-экономики
                </span>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white">
                  Калькулятор дохода стартапа
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#34d399]/15 text-[#34d399] border border-[#34d399]/40 font-mono">
                  Маржинальность ~85%
                </span>
              </div>
            </div>

            {/* Quick preset selector buttons for Jury */}
            <div className="flex flex-wrap items-center gap-2 mb-8 bg-black/40 p-2 rounded-xl border border-white/5">
              <span className="text-xs text-slate-400 font-medium px-2">Сценарии жюри:</span>
              <button
                onClick={() => applyPreset('mvp')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  calculatorPreset === 'mvp'
                    ? 'bg-[#38bdf8] text-black shadow-md'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                MVP (Старт)
              </button>
              <button
                onClick={() => applyPreset('growth')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  calculatorPreset === 'growth'
                    ? 'bg-[#38bdf8] text-black shadow-md'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                Масштабирование (1-й год)
              </button>
              <button
                onClick={() => applyPreset('leader')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  calculatorPreset === 'leader'
                    ? 'bg-[#38bdf8] text-black shadow-md'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                Лидер рынка (Scale-Up)
              </button>
            </div>

            {/* Calculator Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Sliders */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#38bdf8]" />
                      Активных пользователей (B2C по $5/мес):
                    </span>
                    <strong className="text-lg font-bold text-[#38bdf8] font-mono">
                      {b2cUsers.toLocaleString('ru-RU')} чел.
                    </strong>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="5000"
                    step="50"
                    value={b2cUsers}
                    onChange={(e) => {
                      setB2cUsers(Number(e.target.value));
                      setCalculatorPreset('mvp');
                    }}
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                    <span>50 чел. ($250/м)</span>
                    <span>5,000 чел. ($25,000/м)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Ship className="w-4 h-4 text-[#34d399]" />
                      Корпоративных судов / клиентов (B2B по $60/мес):
                    </span>
                    <strong className="text-lg font-bold text-[#34d399] font-mono">
                      {b2bClients} комп.
                    </strong>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="150"
                    step="1"
                    value={b2bClients}
                    onChange={(e) => {
                      setB2bClients(Number(e.target.value));
                      setCalculatorPreset('mvp');
                    }}
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                    <span>1 комп. ($60/м)</span>
                    <span>150 комп. ($9,000/м)</span>
                  </div>
                </div>

                {/* Revenue structure visualization */}
                <div className="pt-2">
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-mono">
                    <span>Структура выручки:</span>
                    <span>
                      B2C: {b2cShare}% | B2B: {100 - b2cShare}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden flex border border-white/10">
                    <div
                      className="bg-[#38bdf8] h-full transition-all duration-300"
                      style={{ width: `${b2cShare}%` }}
                    />
                    <div
                      className="bg-[#34d399] h-full transition-all duration-300"
                      style={{ width: `${100 - b2cShare}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Results Column */}
              <div className="lg:col-span-5 bg-black/50 p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <span className="text-sm text-slate-400">Выручка в месяц (MRR)</span>
                  <span className="text-2xl font-extrabold text-white font-mono">
                    ${mrr.toLocaleString('en-US')}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <span className="text-sm text-slate-400">Годовой оборот (ARR)</span>
                  <span className="text-3xl font-extrabold text-[#38bdf8] font-mono">
                    ${arr.toLocaleString('en-US')}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <div>
                    <span className="text-sm text-slate-300 font-semibold block">Чистая прибыль / год</span>
                    <span className="text-xs text-slate-500">После серверов и налогов (85%)</span>
                  </div>
                  <span className="text-2xl font-extrabold text-[#34d399] font-mono">
                    ${netProfit.toLocaleString('en-US')}
                  </span>
                </div>

                <div className="pt-3">
                  <a
                    href="#team"
                    className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors border border-white/10"
                  >
                    Инвестировать в проект
                    <ArrowRight className="w-3.5 h-3.5 text-[#38bdf8]" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Team Section */}
      <section id="team" className="py-28 relative border-t border-white/5 reveal">
        <div className="w-[90%] max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              Наша Команда
            </h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              Создаем рабочий продукт от идеи до релиза
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="team-member reveal-item p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#38bdf8]/30 transition-all">
              <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] border-2 border-[#38bdf8]/40 flex items-center justify-center text-2xl font-black text-white mb-5 shadow-[0_0_25px_rgba(56,189,248,0.2)] hover:scale-105 transition-transform">
                PM
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Захар Бураковский</h3>
              <p className="text-sm text-[#38bdf8] font-semibold mb-3">Product Manager & Pitch</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                CustDev с капитанами, формирование Unit-экономики и упаковка презентации продукта для хакатона.
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="team-member reveal-item p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#38bdf8]/30 transition-all">
              <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-[#0f172a] to-[#0369a1] border-2 border-[#38bdf8]/40 flex items-center justify-center text-2xl font-black text-white mb-5 shadow-[0_0_25px_rgba(56,189,248,0.2)] hover:scale-105 transition-transform">
                DEV
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Lead Developer</h3>
              <p className="text-sm text-[#34d399] font-semibold mb-3">Full-Stack & Физический Движок</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Matter.js антигравитация, оптимизация рендеринга канваса, скролл-анимации и архитектура без сбоев.
              </p>
            </div>

            {/* Team Member 3 */}
            <div className="team-member reveal-item p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#38bdf8]/30 transition-all">
              <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-[#0f172a] to-[#115e59] border-2 border-[#38bdf8]/40 flex items-center justify-center text-2xl font-black text-white mb-5 shadow-[0_0_25px_rgba(56,189,248,0.2)] hover:scale-105 transition-transform">
                UX
              </div>
              <h3 className="text-xl font-bold text-white mb-1">UI/UX Designer</h3>
              <p className="text-sm text-[#fbbf24] font-semibold mb-3">Дизайн-Система & Интерактив</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Spotlight Glow эффекты, адаптивная сетка под любые девайсы и эстетика топовых deep-tech стартапов.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer (with 2026 copyright updated) */}
      <footer className="py-10 bg-[#07090e] border-t border-white/10 text-center text-slate-500 text-sm">
        <div className="w-[90%] max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-white">
            <span>Startup<span className="text-[#38bdf8]">X</span></span>
            <span className="text-xs text-slate-500 font-normal">| Морской Техно-Хакатон</span>
          </div>

          <p className="text-xs text-slate-400">
            &copy; 2026 StartupX. Разработано специально для хакатона. Все права защищены.
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="text-[#34d399] font-mono">v2.6.0 Stable</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
