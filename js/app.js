// ==========================================================================
// StartupX — Maritime Enterprise Platform (Interactive Master Script)
// Modules: Dashboard Tabs, Micro-Parallax, Spotlight Border, ROI Calculator,
//          Fixed SVG Chart, FAQ Accordion, Live Pilot Modal, Scroll Reveal.
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    // --------------------------------------------------------------------------
    // 1. Dashboard Segmented Tabs (Hero Section)
    // --------------------------------------------------------------------------
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const activePanel = document.getElementById(`panel-${targetTab}`);
            if (activePanel) {
                activePanel.classList.add('active');
            }
        });
    });

    // --------------------------------------------------------------------------
    // 2. Gentle Micro-Parallax for Hero Dashboard (60 FPS via rAF)
    // --------------------------------------------------------------------------
    const heroDashboard = document.getElementById('hero-dashboard');
    let isTicking = false;

    window.addEventListener('scroll', () => {
        if (!isTicking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset || document.documentElement.scrollTop;
                if (scrolled < 950 && heroDashboard) {
                    const translateY = Math.min(scrolled * 0.065, 30);
                    heroDashboard.style.transform = `translateY(${translateY.toFixed(2)}px)`;
                }
                isTicking = false;
            });
            isTicking = true;
        }
    }, { passive: true });

    // --------------------------------------------------------------------------
    // 3. Card Spotlight Border & Surface Highlight
    // --------------------------------------------------------------------------
    const spotlightCards = document.querySelectorAll('.card, .team-role-card, .pricing-card, .timeline-step');

    window.addEventListener('mousemove', (e) => {
        spotlightCards.forEach((card) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // --------------------------------------------------------------------------
    // 4. Unit Economics (ROI) Calculator
    // --------------------------------------------------------------------------
    const rangeB2C = document.getElementById('range-b2c');
    const rangeB2B = document.getElementById('range-b2b');
    const valB2C = document.getElementById('val-b2c');
    const valB2B = document.getElementById('val-b2b');

    const outMRR = document.getElementById('out-mrr');
    const outARR = document.getElementById('out-arr');
    const outProfit = document.getElementById('out-profit');

    const barB2C = document.getElementById('bar-b2c');
    const barB2B = document.getElementById('bar-b2b');
    const pctB2C = document.getElementById('pct-b2c');
    const pctB2B = document.getElementById('pct-b2b');

    const presetBtns = document.querySelectorAll('.preset-btn');

    // --------------------------------------------------------------------------
    // 5. Fixed Aspect Ratio SVG Chart (ViewBox 0 0 800 220)
    // --------------------------------------------------------------------------
    const chartLine = document.getElementById('chart-line');
    const chartArea = document.getElementById('chart-area');
    const chartPoints = document.querySelectorAll('.chart-point');
    const chartTooltip = document.getElementById('chart-tooltip');
    const svgChartContainer = document.querySelector('.svg-chart-container');

    const chartX = [100, 300, 500, 700];

    function updateChartPath(arr) {
        if (!chartLine || !chartArea) return;

        const maxScaleARR = 408000;
        const ratio = Math.min(Math.max(arr / maxScaleARR, 0.12), 1.0);

        const qValues = [
            Math.round(arr * 0.15),
            Math.round(arr * 0.38),
            Math.round(arr * 0.68),
            arr
        ];

        // Dynamic Y coordinate formulation
        const y1 = 175 - (ratio * 15);
        const y2 = 168 - (ratio * 50);
        const y3 = 156 - (ratio * 88);
        const y4 = 175 - (ratio * 138);

        const yCoords = [y1, y2, y3, y4];

        const pathLine = `M ${chartX[0]} ${y1.toFixed(1)} L ${chartX[1]} ${y2.toFixed(1)} L ${chartX[2]} ${y3.toFixed(1)} L ${chartX[3]} ${y4.toFixed(1)}`;
        const pathArea = `M ${chartX[0]} ${y1.toFixed(1)} L ${chartX[1]} ${y2.toFixed(1)} L ${chartX[2]} ${y3.toFixed(1)} L ${chartX[3]} ${y4.toFixed(1)} L ${chartX[3]} 180 L ${chartX[0]} 180 Z`;

        chartLine.setAttribute('d', pathLine);
        chartArea.setAttribute('d', pathArea);

        chartPoints.forEach((point, index) => {
            point.setAttribute('cx', chartX[index]);
            point.setAttribute('cy', yCoords[index].toFixed(1));
            point.setAttribute('data-val', `$${qValues[index].toLocaleString('en-US')}`);
        });
    }

    // Chart Point Tooltips
    chartPoints.forEach((point) => {
        point.addEventListener('mouseenter', () => {
            if (!chartTooltip || !svgChartContainer) return;
            const quarter = point.getAttribute('data-quarter');
            const value = point.getAttribute('data-val');
            chartTooltip.textContent = `${quarter}: ${value}`;

            const cx = parseFloat(point.getAttribute('cx'));
            const cy = parseFloat(point.getAttribute('cy'));

            const leftPercent = (cx / 800) * 100;
            const topPercent = (cy / 220) * 100;

            chartTooltip.style.left = `${leftPercent}%`;
            chartTooltip.style.top = `${topPercent}%`;
            chartTooltip.classList.add('visible');
        });

        point.addEventListener('mouseleave', () => {
            if (chartTooltip) chartTooltip.classList.remove('visible');
        });
    });

    // Metric Calculations
    function calculateUnitEconomics() {
        if (!rangeB2C || !rangeB2B) return;

        const b2cCount = parseInt(rangeB2C.value, 10) || 0;
        const b2bCount = parseInt(rangeB2B.value, 10) || 0;

        const b2cMonthly = b2cCount * 5;
        const b2bMonthly = b2bCount * 60;
        const mrr = b2cMonthly + b2bMonthly;
        const arr = mrr * 12;
        const netProfit = Math.round(arr * 0.85);

        if (valB2C) valB2C.textContent = `${b2cCount.toLocaleString('ru-RU')} чел.`;
        if (valB2B) valB2B.textContent = `${b2bCount} судов`;

        if (outMRR) outMRR.textContent = `$${mrr.toLocaleString('en-US')}`;
        if (outARR) outARR.textContent = `$${arr.toLocaleString('en-US')}`;
        if (outProfit) outProfit.textContent = `$${netProfit.toLocaleString('en-US')}`;

        const b2cShare = mrr > 0 ? Math.round((b2cMonthly / mrr) * 100) : 50;
        const b2bShare = 100 - b2cShare;

        if (barB2C) barB2C.style.width = `${b2cShare}%`;
        if (barB2B) barB2B.style.width = `${b2bShare}%`;
        if (pctB2C) pctB2C.textContent = `B2C: ${b2cShare}%`;
        if (pctB2B) pctB2B.textContent = `B2B: ${b2bShare}%`;

        updateChartPath(arr);
    }

    if (rangeB2C && rangeB2B) {
        rangeB2C.addEventListener('input', () => {
            calculateUnitEconomics();
            presetBtns.forEach(btn => btn.classList.remove('active'));
        });

        rangeB2B.addEventListener('input', () => {
            calculateUnitEconomics();
            presetBtns.forEach(btn => btn.classList.remove('active'));
        });

        calculateUnitEconomics();
    }

    presetBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            presetBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const preset = btn.getAttribute('data-preset');
            if (preset === 'mvp') {
                rangeB2C.value = 400;
                rangeB2B.value = 18;
            } else if (preset === 'growth') {
                rangeB2C.value = 2200;
                rangeB2B.value = 65;
            } else if (preset === 'leader') {
                rangeB2C.value = 4800;
                rangeB2B.value = 140;
            }
            calculateUnitEconomics();
        });
    });

    // --------------------------------------------------------------------------
    // 6. SVG Chart Draw-in Animation on Scroll
    // --------------------------------------------------------------------------
    const chartWrapper = document.getElementById('chart-wrapper');
    if (chartWrapper && chartLine) {
        const pathLength = 850;
        chartLine.style.strokeDasharray = `${pathLength}`;
        chartLine.style.strokeDashoffset = `${pathLength}`;

        const chartObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    chartLine.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        chartObserver.observe(chartWrapper);
    }

    // --------------------------------------------------------------------------
    // 7. Interactive FAQ Accordion
    // --------------------------------------------------------------------------
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach((item) => {
        const questionBtn = item.querySelector('.faq-question-btn');
        if (questionBtn) {
            questionBtn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close other items for a clean accordion effect
                faqItems.forEach(i => i.classList.remove('active'));

                // Toggle selected item
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // --------------------------------------------------------------------------
    // 8. Live Pilot Request Modal Popup
    // --------------------------------------------------------------------------
    const pilotModal = document.getElementById('pilot-modal');
    const openModalBtns = document.querySelectorAll('[data-open-modal="pilot"]');
    const closeModalBtns = document.querySelectorAll('[data-close-modal]');
    const pilotForm = document.getElementById('pilot-form');
    const pilotSuccess = document.getElementById('pilot-success');
    const confirmationCode = document.getElementById('confirmation-code');

    function openModal() {
        if (!pilotModal) return;
        pilotModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!pilotModal) return;
        pilotModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    openModalBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    closeModalBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal();
        });
    });

    if (pilotModal) {
        pilotModal.addEventListener('click', (e) => {
            if (e.target === pilotModal) {
                closeModal();
            }
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && pilotModal && pilotModal.classList.contains('open')) {
            closeModal();
        }
    });

    if (pilotForm) {
        pilotForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const randomCode = Math.floor(1000 + Math.random() * 9000);
            if (confirmationCode) {
                confirmationCode.textContent = `#PLT-2026-${randomCode}`;
            }
            pilotForm.style.display = 'none';
            if (pilotSuccess) {
                pilotSuccess.classList.add('active');
            }
        });
    }

    // --------------------------------------------------------------------------
    // 9. Smooth Anchor Navigation
    // --------------------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --------------------------------------------------------------------------
    // 10. Intersection Observer for Scroll Animations (.reveal -> .active)
    // --------------------------------------------------------------------------
    const revealOptions = {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal').forEach((element) => {
        revealObserver.observe(element);
    });
});
