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
    // 1. SPA PAGE SWITCHER (Page 1: Concept & Model <-> Page 2: Online Menu)
    // ==========================================================================
    const pageMain = document.getElementById('page-main');
    const pageMenu = document.getElementById('page-menu');
    const btnPageMain = document.getElementById('btn-page-main');
    const btnPageMenu = document.getElementById('btn-page-menu');
    const headerCartToggle = document.getElementById('header-cart-toggle');

    function switchPage(target) {
        const isMenu = target === 'menu';

        if (pageMain && pageMenu) {
            if (isMenu) {
                pageMain.classList.remove('active');
                pageMenu.classList.add('active');
                if (btnPageMain) btnPageMain.classList.remove('active');
                if (btnPageMenu) btnPageMenu.classList.add('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                pageMenu.classList.remove('active');
                pageMain.classList.add('active');
                if (btnPageMenu) btnPageMenu.classList.remove('active');
                if (btnPageMain) btnPageMain.classList.add('active');
            }
        }

        // Sync mobile drawer link active states
        document.querySelectorAll('[data-page-link], [data-target-page]').forEach(el => {
            const page = el.getAttribute('data-page-link') || el.getAttribute('data-target-page');
            if (page === target) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
    }

    if (btnPageMain) {
        btnPageMain.addEventListener('click', () => switchPage('main'));
    }
    if (btnPageMenu) {
        btnPageMenu.addEventListener('click', () => switchPage('menu'));
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
    const DB_STORAGE_KEY = 'chrome_bean_db_v1';

    const INITIAL_CAFEDB = {
        subscribers: [
            {
                id: 'PASS-UA-8419',
                name: 'Олександр Коваленко',
                phone: '+380 (67) 482-19-04',
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
                phone: '+380 (50) 319-84-12',
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
                phone: '+380 (93) 741-09-55',
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
                phone: '+380 (67) 500-11-22',
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
                phone: '+380 (98) 234-56-78',
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
                phone: '+380 (50) 612-34-56',
                guests: '2 гостя',
                zone: 'Головний зал (Loft Steel)',
                dateTime: '16.10.2026, 19:30',
                comment: 'Біля панорамного вікна',
                status: 'Підтверджено'
            },
            {
                id: 'BOOK-UA-4822',
                name: 'Ірина Соловей',
                phone: '+380 (63) 890-12-34',
                guests: '4 гостя',
                zone: 'Винний лаунж & Бар',
                dateTime: '16.10.2026, 20:00',
                comment: 'День народження, потрібен десерт зі свічкою',
                status: 'Підтверджено'
            }
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
        });
    }

    // Deduct 1 cup button on active subscriber card
    if (btnDeductCup) {
        btnDeductCup.addEventListener('click', () => {
            const sub = getActiveSubscriber();
            if (!sub) return;

            if (sub.cupsLeft > 0) {
                sub.cupsLeft -= 1;
                saveCafeDB();
                updateActivePassDisplay();
                renderDbRecords();
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

            const card = document.getElementById('active-pass-display');
            if (card) {
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

    // Initial render of DB and Pass card
    updateActivePassDisplay();
    renderDbRecords();

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
    const cartPassStatus = document.getElementById('cart-pass-status');
    const cartPassTitle = document.getElementById('cart-pass-title');
    const cartPassDesc = document.getElementById('cart-pass-desc');

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
        if (!cartPassStatus || !cartPassTitle || !cartPassDesc) return;

        if (sub && sub.cupsLeft > 0) {
            const discountPct = sub.tier === 'milk' ? 20 : 15;
            cartPassStatus.classList.add('pass-active');
            cartPassTitle.textContent = `Активний Coffee Pass: ${sub.name}`;
            cartPassDesc.textContent = `Знижка ${discountPct}% автоматично застосовується до кожного замовлення`;
        } else {
            cartPassStatus.classList.remove('pass-active');
            cartPassTitle.textContent = `Coffee Pass не активний`;
            cartPassDesc.textContent = `Оформіть або активуйте підписку для знижки 15–20%`;
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
            const customerPhone = phoneInput ? phoneInput.value.trim() : '+380...';
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
            const phone = phoneInput ? phoneInput.value.trim() : '+380...';
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
    // 10. SMOOTH ANCHOR NAVIGATION & SCROLL REVEAL
    // ==========================================================================
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                if (targetId.startsWith('#menu') || targetId === '#page-menu') {
                    switchPage('menu');
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
