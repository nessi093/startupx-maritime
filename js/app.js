// ==========================================================================
// CHROME & BEAN — Modern Ukrainian Hospitality Concept (Kyiv 2026)
// Master Script: CafeDB (localStorage), Digital Pass Terminal & Cup Deduct,
//                Unit-Economics Calculator (UAH ₴) & Cubic Bezier SVG Chart,
//                SPA Page Switcher, Online Menu & Cart, Instant Table Booking.
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    // Helper: Format number as Ukrainian Hryvnia (₴) with space separators
    function formatUAH(num) {
        if (typeof num !== 'number' || isNaN(num)) return '0 ₴';
        return num.toLocaleString('uk-UA').replace(/\u00A0/g, ' ') + ' ₴';
    }

    // ==========================================================================
    // 1. SPA PAGE SWITCHER (4 Pages: Main, Blueprint, Menu, Demo)
    // ==========================================================================
    const pageMain = document.getElementById('page-main');
    const pageBlueprint = document.getElementById('page-blueprint');
    const pageMenu = document.getElementById('page-menu');
    const pageDemo = document.getElementById('page-demo');
    const btnPageMain = document.getElementById('btn-page-main');
    const btnPageBlueprint = document.getElementById('btn-page-blueprint');
    const btnPageMenu = document.getElementById('btn-page-menu');
    const btnPageDemo = document.getElementById('btn-page-demo');
    const headerCartToggle = document.getElementById('header-cart-toggle');

    function switchPage(target) {
        [pageMain, pageBlueprint, pageMenu, pageDemo].forEach(p => {
            if (p) p.classList.remove('active');
        });

        if (target === 'blueprint' && pageBlueprint) {
            pageBlueprint.classList.add('active');
            if (typeof initBlueprintModule === 'function') initBlueprintModule();
        } else if (target === 'menu' && pageMenu) {
            pageMenu.classList.add('active');
        } else if (target === 'demo' && pageDemo) {
            pageDemo.classList.add('active');
            if (typeof updateShiftTelemetry === 'function') updateShiftTelemetry();
            if (typeof renderFloorPlan === 'function') renderFloorPlan();
            if (typeof renderLiveKds === 'function') renderLiveKds();
            if (typeof renderScannerLogs === 'function') renderScannerLogs();
        } else if (pageMain) {
            pageMain.classList.add('active');
        }

        [btnPageMain, btnPageBlueprint, btnPageMenu, btnPageDemo].forEach(btn => {
            if (btn) {
                const page = btn.getAttribute('data-target-page');
                if (page === target) btn.classList.add('active');
                else btn.classList.remove('active');
            }
        });

        // Sync mobile drawer link active states
        document.querySelectorAll('[data-page-link], [data-target-page]').forEach(el => {
            const page = el.getAttribute('data-page-link') || el.getAttribute('data-target-page');
            if (page === target) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (btnPageMain) {
        btnPageMain.addEventListener('click', () => switchPage('main'));
    }
    if (btnPageBlueprint) {
        btnPageBlueprint.addEventListener('click', () => switchPage('blueprint'));
    }
    if (btnPageMenu) {
        btnPageMenu.addEventListener('click', () => switchPage('menu'));
    }
    if (btnPageDemo) {
        btnPageDemo.addEventListener('click', () => switchPage('demo'));
    }

    document.querySelectorAll('[data-target-page]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = btn.getAttribute('data-target-page');
            if (target) switchPage(target);
        });
    });

    document.querySelectorAll('[data-page-link]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.getAttribute('data-page-link');
            if (target) {
                switchPage(target);
            }
        });
    });

    if (headerCartToggle) {
        headerCartToggle.addEventListener('click', (e) => {
            e.preventDefault();
            switchPage('menu');
            const cartSidebar = document.getElementById('menu-cart-sidebar');
            if (cartSidebar) {
                cartSidebar.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // ==========================================================================
    // 2. MOBILE NAVIGATION BURGER MENU & GLASSMORPHISM DRAWER
    // ==========================================================================
    const burgerBtn = document.getElementById('burger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (burgerBtn && mobileMenu) {
        function openMobileMenu() {
            mobileMenu.classList.add('open');
            burgerBtn.classList.add('active');
            burgerBtn.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }

        function closeMobileMenu() {
            mobileMenu.classList.remove('open');
            burgerBtn.classList.remove('active');
            burgerBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        burgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (mobileMenu.classList.contains('open')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        mobileLinks.forEach((link) => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });

        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('open') &&
                !mobileMenu.contains(e.target) &&
                !burgerBtn.contains(e.target)) {
                closeMobileMenu();
            }
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                closeMobileMenu();
            }
        });
    }

    // ==========================================================================
    // 3. DASHBOARD SEGMENTED TABS (Kitchen / Bar / Hall)
    // ==========================================================================
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

    // ==========================================================================
    // 4. MICRO-PARALLAX & SPOTLIGHT HIGHLIGHTS
    // ==========================================================================
    const heroDashboard = document.getElementById('hero-dashboard');
    let isTicking = false;

    window.addEventListener('scroll', () => {
        if (window.innerWidth < 768) {
            if (heroDashboard) heroDashboard.style.transform = 'none';
            return;
        }
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

    const spotlightCards = document.querySelectorAll('.card, .pricing-card, .demo-card-box, .demo-db-box, .menu-dish-card');
    window.addEventListener('mousemove', (e) => {
        spotlightCards.forEach((card) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    }, { passive: true });

    // ==========================================================================
    // 5. RESTAURANT UNIT ECONOMICS CALCULATOR & SVG TREND CHART
    // ==========================================================================
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

    const chartLine = document.getElementById('chart-line');
    const chartArea = document.getElementById('chart-area');
    const chartPoints = document.querySelectorAll('.chart-point');
    const chartTooltip = document.getElementById('chart-tooltip');
    const svgChartContainer = document.querySelector('.svg-chart-container');

    const chartX = [100, 300, 500, 700];

    function updateChartCurve(arr) {
        if (!chartLine || !chartArea) return;

        // Realistic ARR range across slider bounds: min ~2.6M ₴ to max ~33.4M ₴
        const minARR = 2604000;
        const maxARR = 33420000;
        const norm = Math.min(Math.max((arr - minARR) / (maxARR - minARR), 0), 1);

        const qValues = [
            Math.round(arr * 0.15),
            Math.round(arr * 0.38),
            Math.round(arr * 0.68),
            arr
        ];

        // Guaranteed monotonic upward curve from y = 168 (in Q1) to y = 42..95 (in Q4)
        const y1 = 168;
        const y2 = 142 - (norm * 24);
        const y3 = 118 - (norm * 38);
        const y4 = 95 - (norm * 53);

        const yCoords = [y1, y2, y3, y4];

        // Smooth cubic Bezier interpolation across quarterly points
        const pathLine = `M ${chartX[0]} ${y1.toFixed(1)} C 200 ${y1.toFixed(1)}, 200 ${y2.toFixed(1)}, ${chartX[1]} ${y2.toFixed(1)} C 400 ${y2.toFixed(1)}, 400 ${y3.toFixed(1)}, ${chartX[2]} ${y3.toFixed(1)} C 600 ${y3.toFixed(1)}, 600 ${y4.toFixed(1)}, ${chartX[3]} ${y4.toFixed(1)}`;
        const pathArea = `${pathLine} L ${chartX[3]} 180 L ${chartX[0]} 180 Z`;

        chartLine.setAttribute('d', pathLine);
        chartArea.setAttribute('d', pathArea);

        chartPoints.forEach((point, index) => {
            point.setAttribute('cx', chartX[index].toString());
            point.setAttribute('cy', yCoords[index].toFixed(1));
            point.setAttribute('data-val', formatUAH(qValues[index]));
        });
    }

    if (chartPoints && chartTooltip && svgChartContainer) {
        chartPoints.forEach((point) => {
            point.addEventListener('mouseenter', () => {
                const quarter = point.getAttribute('data-quarter') || 'Квартал';
                const value = point.getAttribute('data-val') || '';
                chartTooltip.textContent = `${quarter}: ${value}`;

                const cx = parseFloat(point.getAttribute('cx') || '100');
                const cy = parseFloat(point.getAttribute('cy') || '100');

                const leftPercent = (cx / 800) * 100;
                const topPercent = (cy / 220) * 100;

                chartTooltip.style.left = `${leftPercent}%`;
                chartTooltip.style.top = `${topPercent}%`;
                chartTooltip.classList.add('visible');
            });

            point.addEventListener('mouseleave', () => {
                chartTooltip.classList.remove('visible');
            });
        });
    }

    function calculateUnitEconomics() {
        if (!rangeB2C || !rangeB2B) return;

        const dineInGuests = parseInt(rangeB2C.value, 10) || 160;
        const passSubscribers = parseInt(rangeB2B.value, 10) || 180;

        // Hospitality economics: avg 220 ₴ Dine-in check, 950 ₴/mo Coffee Pass
        const dailyDineIn = dineInGuests * 220;
        const monthlyDineIn = dailyDineIn * 30;
        const monthlyPass = passSubscribers * 950;
        const mrr = monthlyDineIn + monthlyPass;
        const arr = mrr * 12;
        const netProfit = Math.round(arr * 0.32); // 32% net margin

        if (valB2C) valB2C.textContent = `${dineInGuests} осіб`;
        if (valB2B) valB2B.textContent = `${passSubscribers} підписок`;

        if (outMRR) outMRR.textContent = formatUAH(mrr);
        if (outARR) outARR.textContent = formatUAH(arr);
        if (outProfit) outProfit.textContent = formatUAH(netProfit);

        const dineInShare = mrr > 0 ? Math.round((monthlyDineIn / mrr) * 100) : 86;
        const passShare = 100 - dineInShare;

        if (barB2C) barB2C.style.width = `${dineInShare}%`;
        if (barB2B) barB2B.style.width = `${passShare}%`;
        if (pctB2C) pctB2C.textContent = `Зал: ${dineInShare}%`;
        if (pctB2B) pctB2B.textContent = `Coffee Pass: ${passShare}%`;

        updateChartCurve(arr);
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
            if (preset === 'mvp' && rangeB2C && rangeB2B) {
                rangeB2C.value = '70';
                rangeB2B.value = '60';
            } else if (preset === 'growth' && rangeB2C && rangeB2B) {
                rangeB2C.value = '160';
                rangeB2B.value = '180';
            } else if (preset === 'leader' && rangeB2C && rangeB2B) {
                rangeB2C.value = '300';
                rangeB2B.value = '350';
            }
            calculateUnitEconomics();
        });
    });

    // ==========================================================================
    // 6. CAFEDB (LOCALSTORAGE DATABASE & DEMO STAND)
    // ==========================================================================
    const DB_STORAGE_KEY = 'chrome_bean_db_v3';

    const INITIAL_CAFEDB = {
        subscribers: [
            {
                id: 'PASS-UA-8419',
                name: 'Олександр Коваленко',
                phone: '+380 (96) 999-99-99',
                tier: 'smart',
                tierName: 'Smart Coffee Pass',
                price: 790,
                cupsTotal: 15,
                cupsLeft: 15,
                discount: '15% на всю кухню та десерти',
                date: '14.10.2026',
                status: 'Активний'
            },
            {
                id: 'PASS-UA-9201',
                name: 'Марія Бондаренко',
                phone: '+380 (96) 999-99-01',
                tier: 'milk',
                tierName: 'Milk & Barista Pro',
                price: 1190,
                cupsTotal: 20,
                cupsLeft: 12,
                discount: '20% на кухню та десерти',
                date: '12.10.2026',
                status: 'Активний'
            },
            {
                id: 'PASS-UA-4177',
                name: 'Дмитро Ткаченко',
                phone: '+380 (96) 999-99-02',
                tier: 'smart',
                tierName: 'Smart Coffee Pass',
                price: 790,
                cupsTotal: 15,
                cupsLeft: 8,
                discount: '15% на всю кухню та десерти',
                date: '10.10.2026',
                status: 'Активний'
            }
        ],
        orders: [
            {
                id: 'ORD-UA-1042',
                customer: 'Олена Грищенко',
                phone: '+380 (96) 999-99-99',
                items: 'Флет Уайт на вівсяному (95 ₴) + Авокадо-тост із лососем (260 ₴)',
                total: 355,
                payment: 'Monobank QR',
                time: '10:24',
                orderType: 'У залі (Стіл 4)',
                status: 'Видано'
            },
            {
                id: 'ORD-UA-1043',
                customer: 'Артем Василенко',
                phone: '+380 (96) 999-99-01',
                items: 'Фільтр-кава Ефіопія (75 ₴) + Круасан з матча-кремом (110 ₴)',
                total: 185,
                payment: 'Apple Pay',
                time: '11:05',
                orderType: 'З собою (To-Go)',
                status: 'Готується'
            }
        ],
        bookings: [
            {
                id: 'BOOK-UA-4821',
                name: 'Ярослав Кравчук',
                phone: '+380 (96) 999-99-99',
                guests: '2 гостя',
                zone: 'Головний зал (Loft Steel)',
                dateTime: '16.10.2026, 19:30',
                comment: 'Біля панорамного вікна',
                status: 'Підтверджено'
            },
            {
                id: 'BOOK-UA-4822',
                name: 'Ірина Соловей',
                phone: '+380 (96) 999-99-02',
                guests: '4 гостя',
                zone: 'Винний лаунж & Бар',
                dateTime: '16.10.2026, 20:00',
                comment: 'День народження, потрібен десерт зі свічкою',
                status: 'Підтверджено'
            }
        ],
        tables: [
            { id: 1, name: 'Стіл #1 Вікно', seats: 2, zone: 'Панорама', status: 'Вільний', bookedBy: null },
            { id: 2, name: 'Стіл #2 Вікно', seats: 4, zone: 'Панорама', status: 'Заброньовано', bookedBy: 'Ярослав К.' },
            { id: 3, name: 'Стіл #3 Коворкінг', seats: 2, zone: 'Коворкінг', status: 'Вільний', bookedBy: null },
            { id: 4, name: 'Стіл #4 Коворкінг', seats: 2, zone: 'Коворкінг', status: 'Вільний', bookedBy: null },
            { id: 5, name: 'Стіл #5 Лаунж', seats: 6, zone: 'Лаунж', status: 'Заброньовано', bookedBy: 'Ірина С.' },
            { id: 6, name: 'Стіл #6 Лаунж', seats: 4, zone: 'Лаунж', status: 'Вільний', bookedBy: null },
            { id: 7, name: 'Стіл #7 Тераса', seats: 2, zone: 'Тераса', status: 'Вільний', bookedBy: null },
            { id: 8, name: 'Стіл #8 Bar Counter', seats: 2, zone: 'Барна стійка', status: 'Вільний', bookedBy: null }
        ],
        scannerLogs: [
            { id: 'LOG-1', time: '11:15', name: 'Марія Бондаренко', action: 'Списано 1 чашку (Milk Pro)', cupsLeft: 12 },
            { id: 'LOG-2', time: '10:48', name: 'Олександр Коваленко', action: 'Списано 1 чашку (Smart Pass)', cupsLeft: 15 }
        ],
        activeSubscriberId: 'PASS-UA-8419'
    };

    let cafeDB = null;

    function loadCafeDB() {
        try {
            const raw = localStorage.getItem(DB_STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && Array.isArray(parsed.subscribers) && Array.isArray(parsed.orders) && Array.isArray(parsed.bookings)) {
                    cafeDB = parsed;
                    if (!Array.isArray(cafeDB.tables) || cafeDB.tables.length === 0) {
                        cafeDB.tables = JSON.parse(JSON.stringify(INITIAL_CAFEDB.tables));
                    }
                    if (!Array.isArray(cafeDB.scannerLogs)) {
                        cafeDB.scannerLogs = JSON.parse(JSON.stringify(INITIAL_CAFEDB.scannerLogs));
                    }
                    return;
                }
            }
        } catch (e) {
            console.error('CafeDB load error:', e);
        }
        cafeDB = JSON.parse(JSON.stringify(INITIAL_CAFEDB));
        saveCafeDB();
    }

    function saveCafeDB() {
        try {
            localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(cafeDB));
        } catch (e) {
            console.error('CafeDB save error:', e);
        }
    }

    loadCafeDB();

    // DOM Elements for DB Inspector
    const dbRecordsContainer = document.getElementById('db-records-container');
    const dbSearchInput = document.getElementById('db-search-input');
    const btnResetDb = document.getElementById('btn-reset-db');
    const dbTabBtns = document.querySelectorAll('.db-tab-btn');

    const dbCountSubscribers = document.getElementById('db-count-subscribers');
    const dbCountOrders = document.getElementById('db-count-orders');
    const dbCountBookings = document.getElementById('db-count-bookings');

    // DOM Elements for Digital Pass Card
    const passPlanName = document.getElementById('pass-plan-name');
    const passCardId = document.getElementById('pass-card-id');
    const passUserName = document.getElementById('pass-user-name');
    const passUserPhone = document.getElementById('pass-user-phone');
    const passCupsCount = document.getElementById('pass-cups-count');
    const passCupsBar = document.getElementById('pass-cups-bar');
    const passDiscountNote = document.getElementById('pass-discount-note');
    const btnDeductCup = document.getElementById('btn-deduct-cup');
    const subscriptionDemoForm = document.getElementById('subscription-demo-form');

    let currentDbTab = 'subscribers';
    let currentSearchQuery = '';

    function getActiveSubscriber() {
        if (!cafeDB || !cafeDB.subscribers.length) return null;
        const found = cafeDB.subscribers.find(s => s.id === cafeDB.activeSubscriberId);
        return found || cafeDB.subscribers[0];
    }

    function updateActivePassDisplay() {
        const sub = getActiveSubscriber();
        if (!sub) return;

        if (passPlanName) passPlanName.textContent = sub.tierName || 'Smart Coffee Pass';
        if (passCardId) passCardId.textContent = `#${sub.id}`;
        if (passUserName) passUserName.textContent = sub.name;
        if (passUserPhone) passUserPhone.textContent = sub.phone;

        const cupsTotal = sub.cupsTotal || 15;
        const cupsLeft = typeof sub.cupsLeft === 'number' ? sub.cupsLeft : cupsTotal;
        const pct = Math.max(0, Math.min(100, Math.round((cupsLeft / cupsTotal) * 100)));

        if (passCupsCount) passCupsCount.textContent = `${cupsLeft} із ${cupsTotal}`;
        if (passCupsBar) passCupsBar.style.width = `${pct}%`;
        if (passDiscountNote) passDiscountNote.textContent = `Включено: ${sub.discount || 'знижка на кухню'}`;

        if (btnDeductCup) {
            if (cupsLeft <= 0) {
                btnDeductCup.disabled = true;
                btnDeductCup.innerHTML = `<span>Усі чашки за підпискою списано (0)</span>`;
            } else {
                btnDeductCup.disabled = false;
                btnDeductCup.innerHTML = `
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path></svg>
                    <span>Тест каси: Списати 1 чашку (-1)</span>
                `;
            }
        }

        updateCartPassBanner(sub);
    }

    function updateBadgeCounters() {
        if (!cafeDB) return;
        if (dbCountSubscribers) dbCountSubscribers.textContent = cafeDB.subscribers.length.toString();
        if (dbCountOrders) dbCountOrders.textContent = cafeDB.orders.length.toString();
        if (dbCountBookings) dbCountBookings.textContent = cafeDB.bookings.length.toString();
    }

    function renderDbRecords() {
        if (!dbRecordsContainer || !cafeDB) return;

        updateBadgeCounters();
        const query = currentSearchQuery.toLowerCase().trim();

        let html = '';

        if (currentDbTab === 'subscribers') {
            const filtered = cafeDB.subscribers.filter(sub => {
                if (!query) return true;
                return (sub.name && sub.name.toLowerCase().includes(query)) ||
                       (sub.phone && sub.phone.includes(query)) ||
                       (sub.id && sub.id.toLowerCase().includes(query)) ||
                       (sub.tierName && sub.tierName.toLowerCase().includes(query));
            });

            if (filtered.length === 0) {
                html = `<div class="record-empty-state">Підписників за запитом «${query}» не знайдено.</div>`;
            } else {
                html = filtered.map(sub => {
                    const isActive = sub.id === cafeDB.activeSubscriberId;
                    const badgeClass = sub.cupsLeft > 0 ? 'badge-success' : 'badge-warning';
                    return `
                        <div class="db-record-card ${isActive ? 'active-record' : ''}">
                            <div class="record-header-row">
                                <span class="record-id">#${sub.id}</span>
                                <div style="display: flex; gap: 6px; align-items: center;">
                                    <span class="record-badge ${badgeClass}">${sub.cupsLeft}/${sub.cupsTotal} чашок</span>
                                    ${isActive ? '<span class="record-badge badge-active">&check; Активна картка</span>' : ''}
                                </div>
                            </div>
                            <div class="record-name">${sub.name}</div>
                            <div class="record-meta">
                                <span>&#128222; ${sub.phone}</span>
                                <span>&#9749; ${sub.tierName} (${formatUAH(sub.price)})</span>
                            </div>
                            <div class="record-meta">
                                <span>&#128393; Дата: ${sub.date}</span>
                                <span>&#127873; ${sub.discount}</span>
                            </div>
                            <div class="record-action-row">
                                ${!isActive ? `<button class="record-select-btn" data-activate-sub="${sub.id}">Вивести на цифрову карту &rarr;</button>` : '<span style="font-size:0.75rem; color:#a1a1aa;">Виведено на екран</span>'}
                            </div>
                        </div>
                    `;
                }).join('');
            }
        } else if (currentDbTab === 'orders') {
            const filtered = cafeDB.orders.filter(ord => {
                if (!query) return true;
                return (ord.customer && ord.customer.toLowerCase().includes(query)) ||
                       (ord.phone && ord.phone.includes(query)) ||
                       (ord.id && ord.id.toLowerCase().includes(query)) ||
                       (ord.items && ord.items.toLowerCase().includes(query));
            });

            if (filtered.length === 0) {
                html = `<div class="record-empty-state">Замовлень за запитом «${query}» не знайдено.</div>`;
            } else {
                html = filtered.map(ord => {
                    const badgeClass = ord.status === 'Видано' ? 'badge-success' : 'badge-warning';
                    return `
                        <div class="db-record-card">
                            <div class="record-header-row">
                                <span class="record-id">#${ord.id}</span>
                                <span class="record-badge ${badgeClass}">${ord.status}</span>
                            </div>
                            <div class="record-name">${ord.customer} (${ord.orderType || 'Онлайн'})</div>
                            <div class="record-meta">
                                <span>&#128222; ${ord.phone}</span>
                                <span>&#128337; Час: ${ord.time} &bull; ${ord.payment}</span>
                            </div>
                            <div style="font-size:0.84rem; color:#e4e4e7; margin-top: 0.2rem; line-height:1.4;">
                                <strong>Склад:</strong> ${ord.items}
                            </div>
                            <div class="record-action-row" style="justify-content: space-between;">
                                <span style="font-size: 0.82rem; color: #a1a1aa;">Чек сплачено</span>
                                <span style="font-size: 1rem; font-weight: 700; color: #ffffff;">${formatUAH(ord.total)}</span>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        } else if (currentDbTab === 'bookings') {
            const filtered = cafeDB.bookings.filter(b => {
                if (!query) return true;
                return (b.name && b.name.toLowerCase().includes(query)) ||
                       (b.phone && b.phone.includes(query)) ||
                       (b.id && b.id.toLowerCase().includes(query)) ||
                       (b.zone && b.zone.toLowerCase().includes(query));
            });

            if (filtered.length === 0) {
                html = `<div class="record-empty-state">Броней за запитом «${query}» не знайдено.</div>`;
            } else {
                html = filtered.map(b => {
                    return `
                        <div class="db-record-card">
                            <div class="record-header-row">
                                <span class="record-id">#${b.id}</span>
                                <span class="record-badge badge-success">${b.status || 'Підтверджено'}</span>
                            </div>
                            <div class="record-name">${b.name} (${b.guests})</div>
                            <div class="record-meta">
                                <span>&#128222; ${b.phone}</span>
                                <span>&#128197; ${b.dateTime}</span>
                            </div>
                            <div class="record-meta">
                                <span>&#128205; Зона: ${b.zone}</span>
                            </div>
                            ${b.comment ? `<div style="font-size:0.8rem; color:#a1a1aa; font-style:italic;">«${b.comment}»</div>` : ''}
                        </div>
                    `;
                }).join('');
            }
        }

        dbRecordsContainer.innerHTML = html;

        // Add event listeners to "Вивести на цифрову карту" buttons
        dbRecordsContainer.querySelectorAll('[data-activate-sub]').forEach(btn => {
            btn.addEventListener('click', () => {
                const subId = btn.getAttribute('data-activate-sub');
                if (subId && cafeDB) {
                    cafeDB.activeSubscriberId = subId;
                    saveCafeDB();
                    updateActivePassDisplay();
                    renderDbRecords();
                }
            });
        });
    }

    // Switch DB entity tabs
    dbTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            dbTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentDbTab = btn.getAttribute('data-db-tab') || 'subscribers';
            renderDbRecords();
        });
    });

    // DB live search input
    if (dbSearchInput) {
        dbSearchInput.addEventListener('input', (e) => {
            currentSearchQuery = e.target.value;
            renderDbRecords();
        });
    }

    // Reset DB to initial demo
    if (btnResetDb) {
        btnResetDb.addEventListener('click', () => {
            cafeDB = JSON.parse(JSON.stringify(INITIAL_CAFEDB));
            saveCafeDB();
            updateActivePassDisplay();
            renderDbRecords();
            renderFloorPlan();
            renderLiveKds();
            renderScannerLogs();
            updateShiftTelemetry();
        });
    }

    // Deduct 1 cup button on active subscriber card
    if (btnDeductCup) {
        btnDeductCup.addEventListener('click', () => {
            const sub = getActiveSubscriber();
            if (!sub) return;

            if (sub.cupsLeft > 0) {
                sub.cupsLeft -= 1;
                const now = new Date();
                const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
                if (!Array.isArray(cafeDB.scannerLogs)) cafeDB.scannerLogs = [];
                cafeDB.scannerLogs.unshift({
                    id: 'LOG-' + Date.now(),
                    time: timeStr,
                    name: sub.name,
                    action: `Списано 1 чашку (${sub.tierName})`,
                    cupsLeft: sub.cupsLeft
                });
                if (cafeDB.scannerLogs.length > 8) cafeDB.scannerLogs.pop();

                saveCafeDB();
                updateActivePassDisplay();
                renderDbRecords();
                renderScannerLogs();
                updateShiftTelemetry();
            }
        });
    }

    // Subscription registration form
    if (subscriptionDemoForm) {
        subscriptionDemoForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('sub-name');
            const phoneInput = document.getElementById('sub-phone');
            const tierSelect = document.getElementById('sub-tier');

            const name = nameInput ? nameInput.value.trim() : '';
            const phone = phoneInput ? phoneInput.value.trim() : '';
            const tier = tierSelect ? tierSelect.value : 'smart';

            if (!name || !phone) return;

            const isMilk = tier === 'milk';
            const randomCode = Math.floor(1000 + Math.random() * 9000);
            const newId = `PASS-UA-${randomCode}`;

            const newSubscriber = {
                id: newId,
                name: name,
                phone: phone,
                tier: tier,
                tierName: isMilk ? 'Milk & Barista Pro' : 'Smart Coffee Pass',
                price: isMilk ? 1190 : 790,
                cupsTotal: isMilk ? 20 : 15,
                cupsLeft: isMilk ? 20 : 15,
                discount: isMilk ? '20% на кухню та десерти' : '15% на всю кухню та десерти',
                date: new Date().toLocaleDateString('uk-UA'),
                status: 'Активний'
            };

            cafeDB.subscribers.unshift(newSubscriber);
            cafeDB.activeSubscriberId = newId;
            saveCafeDB();

            if (nameInput) nameInput.value = '';
            if (phoneInput) phoneInput.value = '';

            updateActivePassDisplay();
            currentDbTab = 'subscribers';
            dbTabBtns.forEach(b => {
                if (b.getAttribute('data-db-tab') === 'subscribers') b.classList.add('active');
                else b.classList.remove('active');
            });
            renderDbRecords();
            renderScannerLogs();
            updateShiftTelemetry();

            const card = document.getElementById('active-pass-display');
            if (card) {
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

    // ==========================================================================
    // LIVE SIMULATOR: TELEMETRY, 1-CLICK ORDER, FLOOR PLAN & KDS QUEUE
    // ==========================================================================

    function updateShiftTelemetry() {
        if (!cafeDB) return;

        // 1. Shift Revenue: sum of all orders + sum of subscribers
        const ordersSum = Array.isArray(cafeDB.orders) ? cafeDB.orders.reduce((sum, o) => sum + (o.total || 0), 0) : 0;
        const subsSum = Array.isArray(cafeDB.subscribers) ? cafeDB.subscribers.reduce((sum, s) => sum + (s.price || 0), 0) : 0;
        const totalRevenue = ordersSum + subsSum;
        const revEl = document.getElementById('live-shift-revenue');
        if (revEl) revEl.textContent = formatUAH(totalRevenue);

        // 2. Active passes with remaining cups
        const activePasses = Array.isArray(cafeDB.subscribers) ? cafeDB.subscribers.filter(s => s.cupsLeft > 0).length : 0;
        const passesEl = document.getElementById('live-shift-passes');
        if (passesEl) passesEl.textContent = activePasses.toString();

        // 3. Active KDS orders
        const kdsCount = Array.isArray(cafeDB.orders) ? cafeDB.orders.filter(o => o.status === 'Прийнято' || o.status === 'Готується').length : 0;
        const kdsEl = document.getElementById('live-shift-kds');
        if (kdsEl) kdsEl.textContent = kdsCount.toString();

        // 4. Free tables in hall
        const tables = Array.isArray(cafeDB.tables) ? cafeDB.tables : [];
        const freeCount = tables.filter(t => t.status === 'Вільний').length;
        const tablesEl = document.getElementById('live-shift-tables');
        if (tablesEl) tablesEl.textContent = `${freeCount} із ${tables.length || 8}`;
    }

    // 1-Click Fast Pre-order
    let selectedQuickTime = 'Через 5 хв';
    const quickTimeChips = document.querySelectorAll('#quick-order-time-selector .quick-chip');
    quickTimeChips.forEach(chip => {
        chip.addEventListener('click', () => {
            quickTimeChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            selectedQuickTime = chip.getAttribute('data-time-slot') || 'Через 5 хв';
        });
    });

    const quickItemBtns = document.querySelectorAll('[data-quick-item]');
    const quickOrderToast = document.getElementById('quick-order-toast');

    quickItemBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const itemName = btn.getAttribute('data-quick-item') || 'Кава Specialty';
            const rawPrice = parseInt(btn.getAttribute('data-quick-price') || '90', 10);
            const sub = getActiveSubscriber();
            const hasDiscount = sub && sub.cupsLeft > 0;
            const discountPct = hasDiscount ? (sub.tier === 'milk' ? 20 : 15) : 0;
            const finalPrice = discountPct > 0 ? Math.round(rawPrice * (1 - discountPct / 100)) : rawPrice;

            const randomNum = Math.floor(1000 + Math.random() * 9000);
            const orderId = `ORD-UA-${randomNum}`;
            const now = new Date();
            const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

            const newOrder = {
                id: orderId,
                customer: sub ? sub.name : 'Гість залу',
                phone: sub ? sub.phone : '+380 (96) 999-99-99',
                items: `${itemName} (${selectedQuickTime})`,
                total: finalPrice,
                payment: 'Monobank QR',
                time: timeStr,
                orderType: `Швидке замовлення (${selectedQuickTime})`,
                status: 'Прийнято'
            };

            cafeDB.orders.unshift(newOrder);
            saveCafeDB();
            renderLiveKds();
            renderDbRecords();
            updateShiftTelemetry();

            if (quickOrderToast) {
                quickOrderToast.style.display = 'flex';
                quickOrderToast.innerHTML = `
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>Замовлення #${orderId} надіслано на екран бариста (${formatUAH(finalPrice)}, ${selectedQuickTime})!</span>
                `;
                setTimeout(() => {
                    if (quickOrderToast) quickOrderToast.style.display = 'none';
                }, 3500);
            }
        });
    });

    // Floor Plan (8 tables)
    function renderFloorPlan() {
        const container = document.getElementById('floor-tables-container');
        if (!container || !cafeDB || !Array.isArray(cafeDB.tables)) return;

        container.innerHTML = cafeDB.tables.map(t => {
            const isBooked = t.status === 'Заброньовано';
            return `
                <div class="floor-table-card ${isBooked ? 'booked' : 'free'}" data-table-id="${t.id}" title="Клікніть для зміни статусу">
                    <div class="floor-table-top">
                        <span class="floor-table-num">${t.name}</span>
                        <span class="floor-table-status">${isBooked ? 'Заброньовано' : 'Вільний'}</span>
                    </div>
                    <div class="floor-table-zone">${t.zone} &bull; ${t.seats} місця</div>
                    <div class="floor-table-guest">${isBooked ? (t.bookedBy || 'Гість') : 'Вільний стіл &rarr;'}</div>
                </div>
            `;
        }).join('');

        container.querySelectorAll('[data-table-id]').forEach(card => {
            card.addEventListener('click', () => {
                const tid = parseInt(card.getAttribute('data-table-id') || '0', 10);
                const table = cafeDB.tables.find(t => t.id === tid);
                if (!table) return;

                const sub = getActiveSubscriber();
                if (table.status === 'Вільний') {
                    table.status = 'Заброньовано';
                    table.bookedBy = sub ? sub.name : 'Гість із симулятора';
                    const randomCode = Math.floor(1000 + Math.random() * 9000);
                    cafeDB.bookings.unshift({
                        id: `BOOK-UA-${randomCode}`,
                        name: table.bookedBy,
                        phone: sub ? sub.phone : '+380 (96) 999-99-99',
                        guests: `${table.seats} гостя`,
                        zone: `${table.name} (${table.zone})`,
                        dateTime: 'Зараз (Live)',
                        comment: 'Бронь з интерактивної мапи залу',
                        status: 'Підтверджено'
                    });
                } else {
                    table.status = 'Вільний';
                    table.bookedBy = null;
                }
                saveCafeDB();
                renderFloorPlan();
                renderDbRecords();
                updateShiftTelemetry();
            });
        });
    }

    // KDS Live Queue
    function renderLiveKds() {
        const container = document.getElementById('kds-orders-list');
        const countPill = document.getElementById('kds-active-count');
        if (!container || !cafeDB || !Array.isArray(cafeDB.orders)) return;

        const activeOrders = cafeDB.orders.filter(o => o.status !== 'Видано');
        if (countPill) {
            countPill.textContent = `${activeOrders.length} у роботі`;
        }

        if (cafeDB.orders.length === 0) {
            container.innerHTML = `<div class="record-empty-state">Черга KDS порожня. Зробіть швидке замовлення зліва!</div>`;
            return;
        }

        const displayOrders = cafeDB.orders.slice(0, 8);
        container.innerHTML = displayOrders.map(order => {
            let statusClass = 'status-accepted';
            let nextStatusText = 'Прийнято &rarr;';
            if (order.status === 'Готується') {
                statusClass = 'status-cooking';
                nextStatusText = 'Готується &rarr;';
            } else if (order.status === 'Видано') {
                statusClass = 'status-done';
                nextStatusText = 'Видано ✓';
            }

            const isDone = order.status === 'Видано';
            return `
                <div class="kds-order-card ${isDone ? 'ready' : ''}">
                    <div class="kds-card-head">
                        <span class="kds-card-id">#${order.id}</span>
                        <span class="kds-card-time">${order.time || '12:00'} &bull; ${order.orderType || 'Зал'}</span>
                    </div>
                    <div class="kds-card-items">${order.items}</div>
                    <div class="kds-card-footer">
                        <span class="kds-card-client">${order.customer} &bull; ${formatUAH(order.total)}</span>
                        <button type="button" class="kds-status-btn ${statusClass}" data-kds-btn-id="${order.id}">
                            <span>${nextStatusText}</span>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        container.querySelectorAll('[data-kds-btn-id]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const oid = btn.getAttribute('data-kds-btn-id');
                const ord = cafeDB.orders.find(o => o.id === oid);
                if (!ord) return;

                if (ord.status === 'Прийнято') {
                    ord.status = 'Готується';
                } else if (ord.status === 'Готується') {
                    ord.status = 'Видано';
                } else {
                    ord.status = 'Прийнято';
                }
                saveCafeDB();
                renderLiveKds();
                renderDbRecords();
                updateShiftTelemetry();
            });
        });
    }

    // Scanner Logs List
    function renderScannerLogs() {
        const container = document.getElementById('scanner-logs-list');
        if (!container || !cafeDB || !Array.isArray(cafeDB.scannerLogs)) return;

        if (cafeDB.scannerLogs.length === 0) {
            container.innerHTML = `<div style="font-size:0.76rem; color:#71717a; padding:6px 0;">Операцій сканування ще не зафіксовано.</div>`;
            return;
        }

        container.innerHTML = cafeDB.scannerLogs.slice(0, 4).map(log => `
            <div class="scanner-log-entry">
                <span class="scanner-log-time">${log.time}</span>
                <span class="scanner-log-desc"><strong>${log.name}</strong>: ${log.action}</span>
                <span class="scanner-log-badge">${log.cupsLeft} чашок</span>
            </div>
        `).join('');
    }

    // Initial render of DB and Pass card, Floor plan, KDS and Telemetry
    updateActivePassDisplay();
    renderDbRecords();
    renderFloorPlan();
    renderLiveKds();
    renderScannerLogs();
    updateShiftTelemetry();

    // ==========================================================================
    // 7. ONLINE MENU & SHOPPING CART
    // ==========================================================================
    const MENU_ITEMS = [
        // Coffee
        { id: 'm1', name: 'Еспресо Доппіо (Specialty 85+)', price: 65, category: 'coffee', weight: '40 мл', desc: 'Ефіопія Гуджі анаеробної обробки. Ноти стиглого бергамоту та чорного чаю.', tag: '100% Arabica' },
        { id: 'm2', name: 'Фільтр-кава Batch Brew', price: 75, category: 'coffee', weight: '250 мл', desc: 'Свіжий щоденний сорт дня від київських обсмажчиків. Чистий ягідний профіль.', tag: 'Day Choice' },
        { id: 'm3', name: 'Флет Уайт на вівсяному молоці', price: 95, category: 'coffee', weight: '180 мл', desc: 'Подвійний шот еспресо та ніжне шовковисте рослинне молоко без цукру.', tag: 'Best Seller' },
        { id: 'm4', name: 'Капучино з сухим пармезаном', price: 90, category: 'coffee', weight: '220 мл', desc: 'Фірмова авторська подача з легкою солонуватою сирною пудрою.', tag: 'Signature' },
        { id: 'm5', name: 'Лавандовий Раф на кокосі', price: 105, category: 'coffee', weight: '280 мл', desc: 'Кримська гірська лаванда, натуральні вершки та ніжний мус.', tag: 'Special' },
        { id: 'm6', name: 'Cold Brew 18 годин екстракції', price: 85, category: 'coffee', weight: '200 мл', desc: 'Холодна крапельна екстракція з кубиком прозорого крижаного моноліту.', tag: 'Ice Cold' },

        // Drinks
        { id: 'm7', name: 'Церемоніальна Матча Уджі', price: 115, category: 'drinks', weight: '220 мл', desc: 'Автентична японська матча найвищого ґрейду на мигдалевому молоці.', tag: 'Superfood' },
        { id: 'm8', name: 'Бамбл Апельсин-Грейпфрут', price: 110, category: 'drinks', weight: '300 мл', desc: 'Свіжовичавлений фреш цитрусових, карамельний шот еспресо та розмарин.', tag: 'Fresh' },
        { id: 'm9', name: 'Чай Саган Дайля з обліпихою', price: 90, category: 'drinks', weight: '450 мл', desc: 'Тонізуючий гірський збір, дика обліпиха та свіжий імбир.', tag: 'Vitamin' },
        { id: 'm10', name: 'Крафтова Комбуча Лайм-Хміль', price: 85, category: 'drinks', weight: '330 мл', desc: 'Жива ферментація, приємна ігриста кислотність і нуль доданого цукру.', tag: 'Probiotic' },

        // Breakfast
        { id: 'm11', name: 'Авокадо-тост із слабосолоним лососем', price: 260, category: 'breakfast', weight: '310 г', desc: 'Тартин на живій заквасці, гуакамоле, слабосолений лосось, яйце пашот, мікрогрін.', tag: 'Chef Choice' },
        { id: 'm12', name: 'Сирники з фермерської рикоти', price: 195, category: 'breakfast', weight: '260 г', desc: 'Ніжні сирники без пшеничного борошна, крем з білого шоколаду, ягідний кулі.', tag: 'Breakfast' },
        { id: 'm13', name: 'Яйця Бенедикт із хрустким беконом', price: 240, category: 'breakfast', weight: '330 г', desc: 'Бріош власної випічки, голландський соус із копченою паприкою, шпинат.', tag: 'Classic' },
        { id: 'm14', name: 'Шакшука з томатами та бринзою', price: 215, category: 'breakfast', weight: '350 г', desc: 'Стиглі пелаті, солодка паприка, зіра, запечені фермерські яйця та тепла піта.', tag: 'Warm & Spicy' },

        // Mains
        { id: 'm15', name: 'Боул з куркою су-від та кіноа', price: 245, category: 'mains', weight: '360 г', desc: 'Кіноа, ніжне філе курки су-від, боби едамаме, авокадо, кунжутний дресинг.', tag: 'Fit & Healthy' },
        { id: 'm16', name: 'Сендвіч із пастрамі та трюфельним соусом', price: 275, category: 'mains', weight: '320 г', desc: 'Витримана яловичина пастрамі, мариновані корнішони, швейцарський сир, чіабата.', tag: 'Hit' },
        { id: 'm17', name: 'Крем-суп з гарбуза та креветками', price: 230, category: 'mains', weight: '300 г', desc: 'Запечений мускатний гарбуз, тигрові креветки гриль, гарбузове насіння.', tag: 'Seasonal' },

        // Desserts
        { id: 'm18', name: 'Баскський спалений чизкейк Сан-Себастьян', price: 145, category: 'desserts', weight: '180 г', desc: 'Карамелізована скоринка, тануча текстура крем-чизу та соус з лісових ягід.', tag: 'Must Try' },
        { id: 'm19', name: 'Брауні на темному шоколаді 72% без цукру', price: 135, category: 'desserts', weight: '140 г', desc: 'Текстурний горіх пекан, бурбонська ваніль, натуральний підсолоджувач еритритол.', tag: 'Sugar Free' },
        { id: 'm20', name: 'Фісташковий тарт із малиновим конфі', price: 160, category: 'desserts', weight: '150 г', desc: 'Пісочне шабле, фісташковий ганаш, свіжа кислинка стиглої малини.', tag: 'Artisan' }
    ];

    let cart = []; // Array of { item, qty }

    const menuItemsGrid = document.getElementById('menu-items-grid');
    const menuFilterBtns = document.querySelectorAll('.menu-filter-btn');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartDiscountRow = document.getElementById('cart-discount-row');
    const cartDiscountVal = document.getElementById('cart-discount-val');
    const cartTotalFinal = document.getElementById('cart-total-final');
    const cartCounter = document.getElementById('cart-counter');
    const btnClearCart = document.getElementById('btn-clear-cart');
    const cartCheckoutForm = document.getElementById('cart-checkout-form');

    let currentMenuCategory = 'all';

    function renderMenuCatalog() {
        if (!menuItemsGrid) return;

        const filtered = MENU_ITEMS.filter(item => {
            if (currentMenuCategory === 'all') return true;
            return item.category === currentMenuCategory;
        });

        menuItemsGrid.innerHTML = filtered.map(item => `
            <div class="menu-dish-card">
                <div class="dish-header-row">
                    <h4>${item.name}</h4>
                    <span class="dish-price">${formatUAH(item.price)}</span>
                </div>
                <div class="dish-kbzu-row">
                    <span class="dish-specs-tag">${item.tag}</span>
                    <span class="dish-portion">${item.weight}</span>
                </div>
                <p class="dish-desc">${item.desc}</p>
                <div class="dish-card-footer">
                    <span style="font-size:0.76rem; color:#71717a;">Київ &bull; Свіжа подача</span>
                    <button class="btn-add-to-cart" data-add-cart="${item.id}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        <span>У кошик</span>
                    </button>
                </div>
            </div>
        `).join('');

        menuItemsGrid.querySelectorAll('[data-add-cart]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-add-cart');
                addToCart(id);
            });
        });
    }

    menuFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            menuFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMenuCategory = btn.getAttribute('data-category') || 'all';
            renderMenuCatalog();
        });
    });

    function addToCart(itemId) {
        const item = MENU_ITEMS.find(m => m.id === itemId);
        if (!item) return;

        const existing = cart.find(c => c.item.id === itemId);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ item: item, qty: 1 });
        }
        renderCart();
    }

    function updateCartPassBanner(sub) {
        const passStatus = document.getElementById('cart-pass-status');
        const passTitle = document.getElementById('cart-pass-title');
        const passDesc = document.getElementById('cart-pass-desc');
        if (!passStatus || !passTitle || !passDesc) return;

        if (sub && sub.cupsLeft > 0) {
            const discountPct = sub.tier === 'milk' ? 20 : 15;
            passStatus.classList.add('pass-active');
            passTitle.textContent = `Активний Coffee Pass: ${sub.name}`;
            passDesc.textContent = `Знижка ${discountPct}% автоматично застосовується до кожного замовлення`;
        } else {
            passStatus.classList.remove('pass-active');
            passTitle.textContent = `Coffee Pass не активний`;
            passDesc.textContent = `Оформіть або активуйте підписку для знижки 15–20%`;
        }
    }

    function renderCart() {
        if (!cartItemsList) return;

        const sub = getActiveSubscriber();
        const hasDiscount = sub && sub.cupsLeft > 0;
        const discountPct = hasDiscount ? (sub.tier === 'milk' ? 20 : 15) : 0;

        const totalCount = cart.reduce((sum, c) => sum + c.qty, 0);
        if (cartCounter) {
            cartCounter.textContent = totalCount.toString();
        }

        if (cart.length === 0) {
            cartItemsList.innerHTML = `<div class="cart-empty-message">Кошик порожній. Оберіть страви або напої з каталогу ліворуч.</div>`;
            if (cartSubtotal) cartSubtotal.textContent = '0 ₴';
            if (cartDiscountRow) cartDiscountRow.style.display = 'none';
            if (cartTotalFinal) cartTotalFinal.textContent = '0 ₴';
            return;
        }

        let subtotal = 0;
        cartItemsList.innerHTML = cart.map((c, index) => {
            const lineTotal = c.item.price * c.qty;
            subtotal += lineTotal;
            return `
                <div style="display:flex; justify-content:space-between; align-items:center; padding: 0.65rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
                    <div style="min-width:0; flex-grow:1; padding-right:0.5rem;">
                        <div style="font-size:0.86rem; font-weight:600; color:#ffffff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${c.item.name}</div>
                        <div style="font-size:0.75rem; color:#a1a1aa;">${formatUAH(c.item.price)} &times; ${c.qty}</div>
                    </div>
                    <div style="display:flex; align-items:center; gap:6px;">
                        <button class="cart-qty-btn" data-cart-minus="${index}" style="width:24px; height:24px; background:#1e1e24; border:1px solid rgba(255,255,255,0.15); color:#fff; border-radius:4px; cursor:pointer;">-</button>
                        <span style="font-size:0.82rem; font-weight:700; min-width:16px; text-align:center;">${c.qty}</span>
                        <button class="cart-qty-btn" data-cart-plus="${index}" style="width:24px; height:24px; background:#1e1e24; border:1px solid rgba(255,255,255,0.15); color:#fff; border-radius:4px; cursor:pointer;">+</button>
                        <span style="font-size:0.88rem; font-weight:700; color:#fff; min-width:60px; text-align:right;">${formatUAH(lineTotal)}</span>
                    </div>
                </div>
            `;
        }).join('');

        cartItemsList.querySelectorAll('[data-cart-minus]').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-cart-minus') || '0', 10);
                if (cart[idx].qty > 1) {
                    cart[idx].qty -= 1;
                } else {
                    cart.splice(idx, 1);
                }
                renderCart();
            });
        });

        cartItemsList.querySelectorAll('[data-cart-plus]').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-cart-plus') || '0', 10);
                cart[idx].qty += 1;
                renderCart();
            });
        });

        const discountVal = discountPct > 0 ? Math.round(subtotal * (discountPct / 100)) : 0;
        const finalTotal = subtotal - discountVal;

        if (cartSubtotal) cartSubtotal.textContent = formatUAH(subtotal);
        if (cartDiscountRow) {
            if (discountVal > 0) {
                cartDiscountRow.style.display = 'flex';
                if (cartDiscountVal) cartDiscountVal.textContent = `-${formatUAH(discountVal)}`;
            } else {
                cartDiscountRow.style.display = 'none';
            }
        }
        if (cartTotalFinal) cartTotalFinal.textContent = formatUAH(finalTotal);
    }

    if (btnClearCart) {
        btnClearCart.addEventListener('click', () => {
            cart = [];
            renderCart();
        });
    }

    // Toggle hall table field in cart
    const orderTypeRadios = document.querySelectorAll('input[name="orderType"]');
    const hallTableField = document.getElementById('hall-table-field');
    orderTypeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (hallTableField) {
                if (radio.value === 'togo') {
                    hallTableField.style.display = 'none';
                } else {
                    hallTableField.style.display = 'block';
                }
            }
        });
    });

    // Cart checkout form submission
    const orderSuccessModal = document.getElementById('order-success-modal');
    const orderConfirmationCode = document.getElementById('order-confirmation-code');

    if (cartCheckoutForm) {
        cartCheckoutForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (cart.length === 0) {
                alert('Будь ласка, оберіть хоча б одну страву або напій із меню');
                return;
            }

            const nameInput = document.getElementById('cart-name');
            const phoneInput = document.getElementById('cart-phone');
            const tableInput = document.getElementById('cart-table-num');
            const selectedType = document.querySelector('input[name="orderType"]:checked');

            const customerName = nameInput ? nameInput.value.trim() : 'Гість';
            const customerPhone = phoneInput ? phoneInput.value.trim() : '+380 (96) 999-99-99';
            const orderTypeVal = selectedType && selectedType.value === 'togo' ? 'З собою (To-Go)' : `У залі (${tableInput && tableInput.value ? tableInput.value.trim() : 'Стіл'})`;

            const sub = getActiveSubscriber();
            const hasDiscount = sub && sub.cupsLeft > 0;
            const discountPct = hasDiscount ? (sub.tier === 'milk' ? 20 : 15) : 0;

            const subtotal = cart.reduce((sum, c) => sum + (c.item.price * c.qty), 0);
            const discountVal = discountPct > 0 ? Math.round(subtotal * (discountPct / 100)) : 0;
            const finalTotal = subtotal - discountVal;

            const itemsSummary = cart.map(c => `${c.item.name} (${c.qty})`).join(' + ');
            const randomCode = Math.floor(1000 + Math.random() * 9000);
            const orderId = `ORD-UA-${randomCode}`;

            const now = new Date();
            const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

            const newOrder = {
                id: orderId,
                customer: customerName,
                phone: customerPhone,
                items: itemsSummary,
                total: finalTotal,
                payment: 'Monobank QR',
                time: timeStr,
                orderType: orderTypeVal,
                status: 'Готується'
            };

            cafeDB.orders.unshift(newOrder);
            saveCafeDB();
            renderDbRecords();
            renderLiveKds();
            updateShiftTelemetry();

            cart = [];
            renderCart();
            if (nameInput) nameInput.value = '';
            if (phoneInput) phoneInput.value = '';

            if (orderConfirmationCode) {
                orderConfirmationCode.textContent = `#${orderId}`;
            }

            if (orderSuccessModal) {
                orderSuccessModal.classList.add('open');
                orderSuccessModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    renderMenuCatalog();
    renderCart();

    // ==========================================================================
    // 8. TABLE BOOKING MODAL
    // ==========================================================================
    const bookingModal = document.getElementById('booking-modal');
    const openBookingBtns = document.querySelectorAll('[data-open-modal="booking"], [data-open-modal="pilot"]');
    const closeBookingBtns = document.querySelectorAll('[data-close-modal]');
    const bookingForm = document.getElementById('booking-form');
    const bookingSuccess = document.getElementById('booking-success');
    const bookingConfirmationCode = document.getElementById('booking-confirmation-code');

    function openModal() {
        if (mobileMenu && mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
            if (burgerBtn) {
                burgerBtn.classList.remove('active');
                burgerBtn.setAttribute('aria-expanded', 'false');
            }
        }
        if (bookingModal) {
            bookingModal.classList.add('open');
            bookingModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        if (bookingModal) {
            bookingModal.classList.remove('open');
            bookingModal.setAttribute('aria-hidden', 'true');
        }
        if (orderSuccessModal) {
            orderSuccessModal.classList.remove('open');
            orderSuccessModal.setAttribute('aria-hidden', 'true');
        }
        document.body.style.overflow = '';
    }

    openBookingBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    closeBookingBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal();
        });
    });

    [bookingModal, orderSuccessModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('book-name');
            const phoneInput = document.getElementById('book-phone');
            const dateInput = document.getElementById('book-date');
            const guestsSelect = document.getElementById('book-guests');
            const zoneSelect = document.getElementById('book-zone');
            const commentInput = document.getElementById('book-comment');

            const name = nameInput ? nameInput.value.trim() : 'Гість';
            const phone = phoneInput ? phoneInput.value.trim() : '+380 (96) 999-99-99';
            const dateVal = dateInput && dateInput.value ? dateInput.value.replace('T', ' ') : 'Сьогодні, 19:30';
            const guests = guestsSelect ? guestsSelect.value : '2 гостя';
            const zone = zoneSelect ? zoneSelect.value : 'Головний зал';
            const comment = commentInput ? commentInput.value.trim() : '';

            const randomCode = Math.floor(1000 + Math.random() * 9000);
            const bookingId = `BOOK-UA-${randomCode}`;

            const newBooking = {
                id: bookingId,
                name: name,
                phone: phone,
                guests: guests,
                zone: zone,
                dateTime: dateVal,
                comment: comment,
                status: 'Підтверджено'
            };

            cafeDB.bookings.unshift(newBooking);
            saveCafeDB();
            renderDbRecords();
            updateShiftTelemetry();

            if (bookingConfirmationCode) {
                bookingConfirmationCode.textContent = `#${bookingId}`;
            }

            bookingForm.style.display = 'none';
            if (bookingSuccess) {
                bookingSuccess.classList.add('active');
            }
        });
    }

    // Set default datetime to tomorrow 19:00 for booking date picker
    const bookDateInput = document.getElementById('book-date');
    if (bookDateInput && !bookDateInput.value) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(19, 0, 0, 0);
        const iso = tomorrow.toISOString().slice(0, 16);
        bookDateInput.value = iso;
    }

    // ==========================================================================
    // 9. INTERACTIVE FAQ ACCORDION
    // ==========================================================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach((item) => {
        const questionBtn = item.querySelector('.faq-question-btn');
        if (questionBtn) {
            questionBtn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(i => i.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // ==========================================================================
    // 10. BLUEPRINT (BLUE PLAN) INTERACTIVE ARCHITECTURAL MODULE
    // ==========================================================================
    const BLUEPRINT_ZONES = {
        a: {
            badge: 'ЗОНА A • ВХІД & ТОЧКА ВИДАЧІ',
            title: 'Вхідна група & Fast Track',
            cost: '160 000 ₴',
            area: '18 м²',
            seats: '6 місць очікування',
            desc: 'Експрес-вікно видачі замовлень To-Go за 3 хвилини та NFC-термінал самообслуговування, щоб ранковий потік не створював чергу в залі.',
            materials: [
                'Листова сталь AISI 304 Scotch-Brite (1.5 мм)',
                'Шліфований бетон M400 з гідрофобізацією',
                'Загартоване триплекс-скло 10 мм',
                'Матовий чорний алюмінієвий профіль'
            ],
            equipment: [
                'Сенсорний кіоск самозамовлення Fast Order 21.5"',
                'NFC / Apple Pay рідер безконтактної оплати',
                'Теплова завіса вхідної групи 6.0 кВт',
                'Дисплей електронної черги готових замовлень To-Go'
            ],
            lighting: 'Трекові світильники 4000K з вузьким кутом розсіювання 24° над лінією видачі (1200 люкс), контурна LED-лінія в плінтусі.'
        },
        b: {
            badge: 'ЗОНА B • СЕРЦЕ КАВ\'ЯРНІ',
            title: 'Острівна барна станція 360°',
            cost: '520 000 ₴',
            area: '24 м²',
            seats: '8 контактних місць',
            desc: 'Відкритий контактний бар із матової нержавіючої сталі AISI 304, кастомна кавомашина La Marzocco, вбудовані рінзери та скляна вітрина авторських десертів без цукру.',
            materials: [
                'Нержавіюча сталь AISI 304 (товщина 1.5 мм, Scotch-Brite)',
                'Цілісний стіл бариста з врізними рінзерами',
                'Тоноване скло Triplex 10 мм вітрини десертів',
                'Підніжки з чорненої сталі для барних стільців'
            ],
            equipment: [
                'Кавомашина La Marzocco Linea PB 2-group Custom Brushed',
                'Гріндери Mahlkönig E65S GbW + EK43S для фільтру',
                'Вбудовані швидкісні рінзери бокалів та пітчерів',
                'Вітрина холодна кондитерська +2...+6°C з LED підсвіткою'
            ],
            lighting: 'Спрямовані споти 3500K над робочою зоною бариста (1500 люкс), приховане нижнє підсвічування цоколю бару.'
        },
        c: {
            badge: 'ЗОНА C • SMART WORKSPACE',
            title: 'Smart Coworking біля панорамних вікон',
            cost: '280 000 ₴',
            area: '38 м²',
            seats: '24 місця для роботи',
            desc: 'Довгий комунальний стіл із бездротовими зарядками Qi2, Type-C 100W у кожному посадковому місці та ергономічні крісла біля панорамного фасадного скління.',
            materials: [
                'Масив мореного дуба під матовим масловоском',
                'Сталеві підстілля AISI 304 з кабель-менеджментом',
                'Акустичний перфорований алюміній стелі (NRC 0.85)',
                'Тоноване скло 10 мм у перегородках зони'
            ],
            equipment: [
                '12 вбудованих швидких зарядок Qi2 15W + Type-C 100W Power Delivery',
                'Точки доступу Wi-Fi 6 Ubiquiti UniFi U6-Pro (до 1 Гбіт/с)',
                'Ергономічні крісла з поперековою підтримкою (24 шт.)',
                'Шумопоглинальні перегородки між столами'
            ],
            lighting: 'Лінійні матові світильники розсіяного світла 3500K над комунальним столом (500 люкс) з антивідблисковим захистом.'
        },
        d: {
            badge: 'ЗОНА D • АЛЬТЕРНАТИВА & ЛАУНЖ',
            title: 'Lounge & Tasting Capsule',
            cost: '260 000 ₴',
            area: '32 м²',
            seats: '18 місць у лаунжі',
            desc: 'М\'яка низька посадка для дегустацій альтернативної кави (V60, Chemex, Aeropress), акустичні стінові панелі та приглушене тепле світло для вечірнього відпочинку.',
            materials: [
                'Акустичні стінові панелі з переробленого фетру',
                'Зносостійкий графітовий велюр диванів (100k циклів)',
                'Низькі столики зі шліфованого сланцю та сталі',
                'Масив термоясеня в обробці порталів'
            ],
            equipment: [
                'Каппінг-станція та столики для ручного заварювання (V60, Chemex, Aeropress)',
                'Чайники з термоконтролем Fellow Stagg EKG',
                'Преміальна акустика Genelec із зонованим керуванням',
                'Вбудовані столики з бездротовою підзарядкою смартфонів'
            ],
            lighting: 'Атмосферне вечірнє світло 2700K з можливістю димування до 10%, бра відбитого світла та свічкові акценти.'
        },
        e: {
            badge: 'ЗОНА E • ROASTING & BACK-OFFICE',
            title: 'Технічний блок & Roasting Lab',
            cost: '200 000 ₴',
            area: '33 м²',
            seats: '8 робочих/гостьових позицій',
            desc: 'Цех зберігання зеленого зерна з клімат-контролем (18-20°C, 60% вологість), ростер для мікролотів і санвузли для гостей із безконтактною автоматикою.',
            materials: [
                'Гігієнічна нержавіюча сталь AISI 304 для харчових зон',
                'Гідроізольований мікроцемент з антиковзким покриттям R11',
                'Акустичні двері зі звукоізоляцією 42 дБ',
                'Скляна герметична перегородка з оглядовим вікном'
            ],
            equipment: [
                'Ростер для мікролотів (профільне обсмажування зерна)',
                'Кліматична камера для зеленого зерна (18–20°C, 60% RH)',
                'Багатоступеневий зворотний осмос BWT bestmax PREMIUM',
                'Гостьові санвузли з безконтактними змішувачами та сушарками Dyson'
            ],
            lighting: 'Технічне нейтральне освітлення 4000K високої передачі кольору (CRI>95) для оцінки якості обсмажування кави.'
        }
    };

    const LIGHTING_CONFIG = {
        morning: {
            kelvin: '4000K (Нейтральний білий)',
            dimming: '100% яскравість (Бадьорий режим)',
            audio: '95 BPM (Deep Tech & Lo-Fi Focus)',
            focus: 'Зона A (Fast Track) & Зона B (Бар)'
        },
        day: {
            kelvin: '3500K (М\'який робочий фокус)',
            dimming: '80% яскравість (Компенсація сонця)',
            audio: '85 BPM (Warm Acoustic & Chill Hop)',
            focus: 'Зона C (Smart Coworking біля вікон)'
        },
        evening: {
            kelvin: '2700K (Теплий затишний Dim)',
            dimming: '40% яскравість (Вечірній релакс)',
            audio: '70 BPM (Slow Jazz, Ambient & Neo-Soul)',
            focus: 'Зона D (Lounge & Tasting Capsule)'
        }
    };

    let activeBlueprintZone = 'a';

    function setBlueprintZone(zoneKey) {
        if (!BLUEPRINT_ZONES[zoneKey]) return;
        activeBlueprintZone = zoneKey;
        const data = BLUEPRINT_ZONES[zoneKey];

        // Update tabs
        document.querySelectorAll('.bp-zone-btn').forEach(btn => {
            const z = btn.getAttribute('data-bp-zone');
            if (z === zoneKey) btn.classList.add('active');
            else btn.classList.remove('active');
        });

        // Update SVG zones
        document.querySelectorAll('.bp-svg-zone').forEach(group => {
            const z = group.getAttribute('data-bp-zone');
            if (z === zoneKey) group.classList.add('active-zone');
            else group.classList.remove('active-zone');
        });

        // Update Explication Card
        const badgeEl = document.getElementById('bp-spec-badge');
        const titleEl = document.getElementById('bp-spec-title');
        const costEl = document.getElementById('bp-spec-cost');
        const descEl = document.getElementById('bp-spec-desc');
        const areaEl = document.getElementById('bp-spec-area');
        const seatsEl = document.getElementById('bp-spec-seats');
        const matContainer = document.getElementById('bp-spec-materials');
        const eqContainer = document.getElementById('bp-spec-equipment');
        const lightEl = document.getElementById('bp-spec-lighting');

        if (badgeEl) badgeEl.textContent = data.badge;
        if (titleEl) titleEl.textContent = data.title;
        if (costEl) costEl.textContent = data.cost;
        if (descEl) descEl.textContent = data.desc;
        if (areaEl) areaEl.textContent = data.area;
        if (seatsEl) seatsEl.textContent = data.seats;
        if (lightEl) lightEl.textContent = data.lighting;

        if (matContainer) {
            matContainer.innerHTML = data.materials
                .map(m => `<span class="bp-spec-pill">${m}</span>`)
                .join('');
        }

        if (eqContainer) {
            eqContainer.innerHTML = data.equipment
                .map(item => `<li><span>&bull;</span> ${item}</li>`)
                .join('');
        }

        // Trigger smooth fade-in & scale-up animation on card update
        const specCard = document.getElementById('bp-zone-spec-card');
        if (specCard) {
            specCard.classList.remove('card-reanimated');
            void specCard.offsetWidth;
            specCard.classList.add('card-reanimated');
        }
    }

    function initBlueprintModule() {
        // Zone tab clicks
        document.querySelectorAll('.bp-zone-btn').forEach(btn => {
            btn.onclick = () => {
                const z = btn.getAttribute('data-bp-zone');
                if (z) setBlueprintZone(z);
            };
        });

        // SVG Zone clicks
        document.querySelectorAll('.bp-svg-zone').forEach(group => {
            group.onclick = () => {
                const z = group.getAttribute('data-bp-zone');
                if (z) setBlueprintZone(z);
            };
        });

        // Lighting simulator buttons
        const renderWrapper = document.getElementById('blueprint-render-wrapper');
        const kelvinEl = document.getElementById('bp-light-kelvin');
        const dimmingEl = document.getElementById('bp-light-dimming');
        const audioEl = document.getElementById('bp-light-audio');
        const focusEl = document.getElementById('bp-light-focus');

        document.querySelectorAll('.light-mode-btn').forEach(btn => {
            btn.onclick = () => {
                const mode = btn.getAttribute('data-light-mode');
                if (!mode || !LIGHTING_CONFIG[mode]) return;

                document.querySelectorAll('.light-mode-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                if (renderWrapper) {
                    renderWrapper.classList.remove('light-morning', 'light-day', 'light-evening');
                    renderWrapper.classList.add(`light-${mode}`);
                }

                const cfg = LIGHTING_CONFIG[mode];
                if (kelvinEl) kelvinEl.textContent = cfg.kelvin;
                if (dimmingEl) dimmingEl.textContent = cfg.dimming;
                if (audioEl) audioEl.textContent = cfg.audio;
                if (focusEl) focusEl.textContent = cfg.focus;
            };
        });

        // Finishes Interactive Calculator
        const sliderArea = document.getElementById('finishes-area-slider');
        const valArea = document.getElementById('finishes-area-val');
        const selectMat = document.getElementById('finishes-material-package');
        const selectLight = document.getElementById('finishes-light-package');
        const checkAcoustic = document.getElementById('finishes-acoustic-check');
        const totalSumEl = document.getElementById('finishes-total-price');
        const m2PriceEl = document.getElementById('finishes-m2-price');
        const weeksEl = document.getElementById('finishes-weeks-val');
        const shareEl = document.getElementById('finishes-capex-share');
        const statusEl = document.getElementById('finishes-budget-status');

        function recalculateFinishes() {
            if (!sliderArea) return;
            const area = parseInt(sliderArea.value, 10) || 145;
            if (valArea) valArea.textContent = `${area} м²`;

            const materialRate = selectMat ? parseInt(selectMat.value, 10) : 3300;
            const lightCost = selectLight ? parseInt(selectLight.value, 10) : 135000;
            const acousticCost = checkAcoustic && checkAcoustic.checked ? 115000 : 0;

            const materialCost = area * (materialRate * 0.48);
            const total = Math.round(materialCost + lightCost + acousticCost);
            const m2Price = Math.round(total / area);
            const weeks = (2.5 + (area / 145) * 3).toFixed(1);
            const share = ((total / 1420000) * 100).toFixed(1);

            if (totalSumEl) totalSumEl.textContent = `${total.toLocaleString('uk-UA')} ₴`;
            if (m2PriceEl) m2PriceEl.textContent = `${m2Price.toLocaleString('uk-UA')} ₴/м²`;
            if (weeksEl) weeksEl.textContent = `${weeks} тижнів`;
            if (shareEl) shareEl.textContent = `${share}%`;

            if (statusEl) {
                if (total <= 500000) {
                    statusEl.className = 'finishes-budget-badge budget-ok';
                    statusEl.innerHTML = '&check; В межах запланованого бюджету оздоблення (до 480 000 ₴)';
                } else {
                    statusEl.className = 'finishes-budget-badge budget-warn';
                    statusEl.innerHTML = '&bull; Преміальна комплектація оздоблення (понад 480 000 ₴)';
                }
            }
        }

        if (sliderArea) sliderArea.oninput = recalculateFinishes;
        if (selectMat) selectMat.onchange = recalculateFinishes;
        if (selectLight) selectLight.onchange = recalculateFinishes;
        if (checkAcoustic) checkAcoustic.onchange = recalculateFinishes;

        recalculateFinishes();
    }

    // Initialize Blueprint module if page exists
    if (pageBlueprint) {
        initBlueprintModule();
    }

    // ==========================================================================
    // 11. SMOOTH ANCHOR NAVIGATION & SCROLL REVEAL
    // ==========================================================================
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                if (targetId.startsWith('#blueprint') || targetId === '#page-blueprint') {
                    switchPage('blueprint');
                    return;
                }
                if (targetId.startsWith('#menu') || targetId === '#page-menu') {
                    switchPage('menu');
                    return;
                }
                if (targetId.startsWith('#demo') || targetId === '#page-demo') {
                    switchPage('demo');
                    return;
                }
                // Switch back to main page if navigating to a main section
                switchPage('main');
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

    // Check initial hash on load
    if (window.location.hash.startsWith('#blueprint') || window.location.hash === '#page-blueprint') {
        switchPage('blueprint');
    } else if (window.location.hash.startsWith('#menu') || window.location.hash === '#page-menu') {
        switchPage('menu');
    } else if (window.location.hash.startsWith('#demo') || window.location.hash === '#page-demo') {
        switchPage('demo');
    }

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
