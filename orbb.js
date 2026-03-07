 /* --- Orbit Persistence Logic --- */
        let orbitTimer;
        function startOrbiting() {
            clearTimeout(orbitTimer);
            document.querySelectorAll('.sat-wrapper').forEach(w => {
                w.classList.add('orbit-active');
                w.classList.add('is-orbiting');
            });
        }
        function stopOrbiting() {
            // Keep orbiting for a designated time (one cycle ~20s, but 8s feels responsive enough for 'persistence')
            orbitTimer = setTimeout(() => {
                document.querySelectorAll('.sat-wrapper').forEach(w => {
                    w.classList.remove('orbit-active');
                    // We keep is-orbiting so it doesn't snap if it were visible
                });
            }, 8000);
        }

        /* --- Calculator Logic --- */
        let calcVal = "";
        let displayVal = "";

        function calcInput(val) {
            const display = document.getElementById('calc-display');

            if (display.innerText === "0" || display.innerText === "Error") {
                display.innerText = "";
                displayVal = "";
                calcVal = "";
            }

            if (['sin', 'cos', 'tan', 'sqrt', 'log'].includes(val)) {
                let mathFn = val === 'log' ? 'Math.log10' : `Math.${val}`;
                calcVal += mathFn + "(";
                displayVal += val + "(";
            } else if (val === 'pow') {
                calcVal += "**";
                displayVal += "^";
            } else {
                calcVal += val;
                displayVal += val;
            }

            display.innerText = displayVal || "0";
        }

        function calcClear() {
            calcVal = "";
            displayVal = "";
            document.getElementById('calc-display').innerText = "0";
        }

        function calcEqual() {
            try {
                // Auto-close brackets
                let openBrackets = (calcVal.match(/\(/g) || []).length;
                let closeBrackets = (calcVal.match(/\)/g) || []).length;
                for (let i = 0; i < openBrackets - closeBrackets; i++) {
                    calcVal += ")";
                    displayVal += ")";
                }

                if (!calcVal) return;

                let result = eval(calcVal);
                // Limit decimals for clean view
                if (result.toString().includes('.') && result.toString().split('.')[1].length > 8) {
                    result = parseFloat(result.toFixed(8));
                }

                document.getElementById('calc-display').innerText = result;
                calcVal = result.toString();
                displayVal = result.toString();
            } catch (e) {
                document.getElementById('calc-display').innerText = "Error";
                calcVal = "";
                displayVal = "";
            }
        }

        /* --- Women's Health Logic --- */
        function calculateHealth() {
            const lmpStr = document.getElementById('lmp-date').value;
            const cycle = parseInt(document.getElementById('cycle-length').value) || 28;

            if (!lmpStr) {
                alert("الرجاء اختيار تاريخ");
                return;
            }

            const lmp = new Date(lmpStr);

            // Due Date: LMP + 280 days (40 weeks)
            const dueDate = new Date(lmp);
            dueDate.setDate(dueDate.getDate() + 280);

            // Next Period: LMP + Cycle
            const nextPeriod = new Date(lmp);
            nextPeriod.setDate(nextPeriod.getDate() + cycle);

            // Formatting
            const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };

            document.getElementById('due-date').innerText = dueDate.toLocaleDateString('ar-EG', options);
            document.getElementById('next-period').innerText = nextPeriod.toLocaleDateString('ar-EG', options);

            const resBox = document.getElementById('health-result');
            resBox.style.display = 'block';
            resBox.animate([
                { opacity: 0, transform: 'translateY(10px)' },
                { opacity: 1, transform: 'translateY(0)' }
            ], { duration: 500 });
        }

        // Data - The Links provided
        // Data - Full List
        const linksData = [
            { title: "حسن بلم", url: "https://hasanbalam.blogspot.com/", icon: "ri-user-star-fill", titleIcon: "ri-star-s-fill", desc: "مدونة شخصية تهتم بالثقافة والأدب والتقنية" },
            { title: "أدب وشعر", url: "https://nawasa-elbahr.yoo7.com/f28-montada", icon: "ri-quill-pen-fill", titleIcon: "ri-edit-2-fill", desc: "واحة تجمع المبدعين في مجالات الأدب والشعر العربي" },
            { title: "سوناتا", url: "https://nawasa-elbahr.yoo7.com/f67-montada", icon: "ri-music-2-fill", titleIcon: "ri-speed-mini-fill", desc: "استمتع بأرقى الألحان وعالم الفنون الموسيقية المتنوعة" },
            { title: "هوانم نوسا", url: "https://hawanim0.blogspot.com.eg/", icon: "ri-women-fill", titleIcon: "ri-hearts-fill", desc: "ركن خاص بكل ما يهم المرأة العصرية من جمال وموضة" },
            { title: "سوق عفاريت نوسا", url: "http://3afareet-shop.blogspot.com.eg/", icon: "ri-ghost-fill", titleIcon: "ri-shopping-cart-2-fill", desc: "متجر فريد للمنتجات النادرة والتحف والمقتنيات المميزة" },
            { title: "نوسا سى فى", url: "https://nawasa-elbahr.yoo7.com/h6-page", icon: "ri-id-card-fill", titleIcon: "ri-briefcase-4-fill", desc: "خدمات احترافية لكتابة السير الذاتية والبحث عن الفرص" },
            { title: "الاقتصاد و الأعمال", url: "http://nawasajobs.blogspot.com", icon: "ri-money-dollar-box-fill", titleIcon: "ri-line-chart-fill", desc: "متابعة دقيقة لأسواق المال والأعمال والفرص الاستثمارية" },
            { title: "المكتبة", url: "http://nawasa-book.blogspot.com/", icon: "ri-book-3-fill", titleIcon: "ri-leaf-fill", desc: "آلاف الكتب والروايات بصيغ رقمية متنوعة للقراءة والتحميل" },
            { title: "عفاريت سينما", url: "http://3aafareet.blogspot.com", icon: "ri-clapperboard-fill", titleIcon: "ri-film-fill", desc: "أحدث الأفلام والمسلسلات والعروض السينمائية الحصرية" },
            { title: "الرياضة و الهوايات", url: "https://nawasa-elbahr.yoo7.com/f15-montada", icon: "ri-trophy-fill", titleIcon: "ri-run-fill", desc: "كل ما يخص الرياضة المصرية والعالمية ونتائج المباريات" },
            { title: "كومبيوتر وبرمجة", url: "https://nawasa-elbahr.yoo7.com/c10-category", icon: "ri-cpu-fill", titleIcon: "ri-code-s-slash-fill", desc: "دروس وشروحات في البرمجة وهندسة الحاسوب والتقنية" },
            { title: "ألعاب الفيديو", url: "https://nawasa-games.blogspot.com/", icon: "ri-gamepad-fill", titleIcon: "ri-poker-hearts-fill", desc: "عالم الألعاب التفاعلية وأحدث إصدارات أجهزة الكونسول" },
            { title: "السينما و التلفزة", url: "https://nawasa-elbahr.yoo7.com/f2-montada", icon: "ri-tv-2-fill", titleIcon: "ri-slideshow-3-fill", desc: "متابعة البرامج التلفزيونية والشبكات الترفيهية الفضائية" },
            { title: "سيارات", url: "https://nawasa-elbahr.yoo7.com/f59-montada", icon: "ri-roadster-fill", titleIcon: "ri-steering-2-fill", desc: "مواصفات وأسعار السيارات وأحدث تقنيات المحركات العالمية" },
            { title: "الصيانة المنزلية", url: "https://nawasa-elbahr.yoo7.com/f68-montada", icon: "ri-settings-5-fill", titleIcon: "ri-tools-fill", desc: "حلول تقنية ونصائح عملية لصيانة وإصلاح أعطال المنزل" }
        ];

        /* --- Links Population --- */
        function populateSlider() {
            const track = document.getElementById('slider-track');
            if (!track) return;
            track.innerHTML = '';

            linksData.forEach((link) => {
                const card = document.createElement('a');
                card.href = link.url;
                card.target = "_blank";
                card.className = 'slide-card';
                card.innerHTML = `
                    <div class="slide-icon"><i class="${link.icon}"></i></div>
                    <div class="slide-title">
                        <i class="${link.titleIcon}"></i>
                        <span>${link.title}</span>
                    </div>
                    <div class="slide-desc">${link.desc}</div>
                `;

                card.addEventListener('mouseenter', () => showTooltip(link));
                card.addEventListener('mouseleave', hideTooltip);
                card.addEventListener('mousemove', moveTooltip);

                track.appendChild(card);
            });
        }

        /* --- Slider Navigation controls --- */
        function initSliderControls() {
            const container = document.getElementById('links-slider');
            const leftBtn = document.getElementById('slide-left');
            const rightBtn = document.getElementById('slide-right');

            if (!leftBtn || !rightBtn || !container) return;

            leftBtn.addEventListener('click', () => {
                container.scrollBy({ left: -300, behavior: 'smooth' });
            });

            rightBtn.addEventListener('click', () => {
                container.scrollBy({ left: 300, behavior: 'smooth' });
            });
        }

        function populateGrid() {
            const grid = document.getElementById('grid-content');
            if (!grid) return;
            grid.innerHTML = '';

            linksData.forEach((link, index) => {
                const card = document.createElement('div');
                card.className = 'grid-card';
                card.style.opacity = '0';
                card.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.05}s`;

                card.innerHTML = `
                    <div class="card-inner">
                        <div class="card-front">
                            <div class="card-icon"><i class="${link.icon}"></i></div>
                            <div class="card-title">
                                <i class="${link.titleIcon}"></i>
                                <span>${link.title}</span>
                            </div>
                        </div>
                        <div class="card-back">
                            <p class="card-desc">${link.desc}</p>
                            <a href="${link.url}" target="_blank" class="visit-btn">دخول الموقع <i class="ri-external-link-line"></i></a>
                        </div>
                    </div>
                `;

                grid.appendChild(card);
            });
        }

        /* --- Tooltip Logic --- */
        const tooltip = document.getElementById('link-tooltip');
        const ttTitle = document.getElementById('tooltip-title');
        const ttDesc = document.getElementById('tooltip-desc');

        function showTooltip(data) {
            ttTitle.innerText = data.title;
            ttDesc.innerText = data.desc;
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'scale(1)';
        }

        function hideTooltip() {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'scale(0.8)';
        }

        function moveTooltip(e) {
            // Offset from mouse
            const x = e.clientX + 15;
            const y = e.clientY + 15;
            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y}px`;
        }

        document.addEventListener('DOMContentLoaded', () => {
            // Existing Data
            populateSlider();
            populateGrid();
            initSliderControls(); // New
            initTheme();
            initModal();
            initUtilities();
            initForumFeed();
            initCustomCursor();
            initAdsSlideshow(); // Added
        });

        /* --- Custom Cursor Logic --- */
        function initCustomCursor() {
            const cursorDot = document.createElement('div');
            const cursorOutline = document.createElement('div');
            cursorDot.className = 'cursor-dot';
            cursorOutline.className = 'cursor-outline';
            document.body.appendChild(cursorDot);
            document.body.appendChild(cursorOutline);

            window.addEventListener('mousemove', (e) => {
                const posX = e.clientX;
                const posY = e.clientY;

                // Dot follows instantly
                cursorDot.style.left = `${posX}px`;
                cursorDot.style.top = `${posY}px`;

                // Outline follows with slight delay (animation in CSS or via JS animate)
                // Using animate for smooth trailing
                cursorOutline.animate({
                    left: `${posX}px`,
                    top: `${posY}px`
                }, { duration: 500, fill: "forwards" });
            });

            // Add magnetic/hover effects
            const InteractiveElements = document.querySelectorAll('a, button, input, .planet, .sun-logo');
            InteractiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursorOutline.style.width = '60px'; // Expand
                    cursorOutline.style.height = '60px';
                    cursorOutline.style.backgroundColor = 'rgba(14, 165, 233, 0.1)';
                });
                el.addEventListener('mouseleave', () => {
                    cursorOutline.style.width = '40px'; // Reset
                    cursorOutline.style.height = '40px';
                    cursorOutline.style.backgroundColor = 'transparent';
                });
            });
        }

        /* --- Weather Logic --- */
        async function getWeather() {
            const city = document.getElementById('city-input').value;
            const resBox = document.getElementById('weather-result');
            const iconBox = document.getElementById('weather-icon');
            const tempBox = document.getElementById('temp-display');
            const condBox = document.getElementById('condition-display');

            if (!city) return;

            // 1. Geocoding
            try {
                const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=ar&format=json`);
                const geoData = await geoRes.json();

                if (!geoData.results) {
                    alert('لم يتم العثور على المدينة');
                    return;
                }

                const { latitude, longitude, name } = geoData.results[0];

                // 2. Weather Data
                const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`);
                const weatherData = await weatherRes.json();

                const temp = weatherData.current.temperature_2m;
                const code = weatherData.current.weather_code;

                // Simple WMO Code mapping
                let icon = 'ri-sun-line';
                let cond = 'مشمس';

                if (code > 0 && code <= 3) { icon = 'ri-sun-cloudy-line'; cond = 'غائم جزئياً'; }
                else if (code >= 45 && code <= 48) { icon = 'ri-mist-line'; cond = 'ضباب'; }
                else if (code >= 51 && code <= 67) { icon = 'ri-rainy-line'; cond = 'مطر'; }
                else if (code >= 71) { icon = 'ri-snowy-line'; cond = 'ثلوج'; }
                else if (code >= 95) { icon = 'ri-thunderstorms-line'; cond = 'عاصفة رعدية'; }

                iconBox.innerHTML = `<i class="${icon}" style="color:var(--primary);"></i>`;
                tempBox.innerText = `${temp}°C`;
                condBox.innerText = `${cond} (${name})`;
                resBox.style.display = 'block';

            } catch (e) {
                console.error(e);
                alert('حدث خطأ أثناء جلب الطقس');
            }
        }

        /* --- Zodiac Logic --- */
        // Populate Days
        const daySelect = document.getElementById('birth-day');
        for (let i = 1; i <= 31; i++) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.innerText = i;
            daySelect.appendChild(opt);
        }

        function calculateZodiac() {
            const day = parseInt(document.getElementById('birth-day').value);
            const month = parseInt(document.getElementById('birth-month').value);
            const nameBox = document.getElementById('zodiac-name');
            const traitBox = document.getElementById('zodiac-traits');
            const resBox = document.getElementById('zodiac-result');

            const zodiacs = [
                { name: "الجدي", start: [1, 1], end: [1, 19], traits: "عملي، طموح، منضبط، صبور، حذر، لكنه قد يكون متشائماً أحياناً." },
                { name: "الدلو", start: [1, 20], end: [2, 18], traits: "مبتكر، مستقل، إنساني، فكري، ودود، لكنه قد يكون متمردًا." },
                { name: "الحوت", start: [2, 19], end: [3, 20], traits: "خيال واسع، حساس، متعاطف، كريم، حدسي، لكنه قد يكون غامضاً." },
                { name: "الحمل", start: [3, 21], end: [4, 19], traits: "شجاع، واثق، متحمس، متفائل، صادق، لكنه قد يكون مندفعاً." },
                { name: "الثور", start: [4, 20], end: [5, 20], traits: "موثوق، صبور، عملي، مخلص، مسؤول، لكنه قد يكون عنيداً." },
                { name: "الجوزاء", start: [5, 21], end: [6, 20], traits: "لطيف، حنون، فضولي، قابل للتكيف، يتعلم بسرعة، لكنه قد يكون متردداً." },
                { name: "السرطان", start: [6, 21], end: [7, 22], traits: "عاطفي، بديهي، خيالي، مخلص، وتبرز لديه روح الحماية." },
                { name: "الأسد", start: [7, 23], end: [8, 22], traits: "قيادي، مبدع، واثق، كريم، دافئ القلب، لكنه قد يكون متغطرساً." },
                { name: "العذراء", start: [8, 23], end: [9, 22], traits: "مخلص، تحليلي، لطيف، مجتهد، عملي، لكنه قد يكون ناقداً." },
                { name: "الميزان", start: [9, 23], end: [10, 22], traits: "دبلوماسي، رشيق، منصف، اجتماعي، مثالي، لكنه قد يتردد في القرارات." },
                { name: "العقرب", start: [10, 23], end: [11, 21], traits: "شجاع، عاطفي، عنيد، صديق حقيقي، لكنه قد يكون غيوراً." },
                { name: "القوس", start: [11, 22], end: [12, 21], traits: "كريم، مثالي، روح الدعابة رائعة، يحب الحرية والسفر." },
                { name: "الجدي", start: [12, 22], end: [12, 31], traits: "عملي، طموح، منضبط، صبور، حذر، جاد جداً." }
            ];

            let sign = "";

            // Simple Date Check
            // We need to match logic correctly based on range
            for (let z of zodiacs) {
                // If month matches start month and day >= start day
                if (month === z.start[0] && day >= z.start[1]) {
                    sign = z;
                }
                // If month matches end month and day <= end day
                else if (month === z.end[0] && day <= z.end[1]) {
                    sign = z;
                }
            }

            // Fallback for Capricorn split (Dec/Jan) logic usually handles naturally if ordered, 
            // but loop overwrites. Let's start loop backwards or trust range logic.
            // Better Logic:
            const days = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 22, 22];
            const signs = ["الدلو", "الحوت", "الحمل", "الثور", "الجوزاء", "السرطان", "الأسد", "العذراء", "الميزان", "العقرب", "القوس", "الجدي"];
            let signName = month === 1 && day < 20 ? "الجدي" : (day < days[month - 1] ? signs[month - 2 < 0 ? 11 : month - 2] : signs[month - 1]);

            // Find traits
            const found = zodiacs.find(z => z.name === signName);

            nameBox.innerText = "برج " + signName;
            traitBox.innerText = found ? found.traits : "صفات مميزة...";
            resBox.style.display = 'block';
        }

        /* --- Links Population --- */
        function populateLinks() {
            const container = document.getElementById('links-container');
            if (!container) return;
            container.innerHTML = ''; // Clear existing

            linksData.forEach((link, index) => {
                const linkCard = document.createElement('a');
                linkCard.href = link.url;
                linkCard.target = "_blank";
                linkCard.rel = "noopener noreferrer";
                linkCard.className = 'link-card';
                // Stagger animation
                linkCard.style.animationDelay = `${index * 0.05}s`;

                linkCard.innerHTML = `
            <div class="card-icon">
                <i class="${link.icon}"></i>
            </div>
            <div class="card-title">${link.title}</div>
            <div class="card-domain">${new URL(link.url).hostname.replace('www.', '')}</div>
        `;
                container.appendChild(linkCard);
            });
        }

        /* --- Forum Feed Logic --- */
        async function initForumFeed() {
            const feedContainer = document.getElementById('feed-container');
            // Using rss2json to convert RSS XML to JSON
            // RSS URL: https://nawasa-elbahr.yoo7.com/rss
            const rssUrl = encodeURIComponent('https://nawasa-elbahr.yoo7.com/rss');
            const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;

            try {
                const response = await fetch(apiUrl);
                const data = await response.json();

                if (data.status === 'ok') {
                    feedContainer.innerHTML = ''; // Clear loader

                    // Limit to 5 items
                    const items = data.items.slice(0, 5);

                    items.forEach((item, index) => {
                        const date = new Date(item.pubDate).toLocaleDateString('ar-EG', {
                            year: 'numeric', month: 'short', day: 'numeric'
                        });

                        const feedItem = document.createElement('a');
                        feedItem.href = item.link;
                        feedItem.target = "_blank";
                        feedItem.className = 'feed-item';
                        feedItem.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`;
                        feedItem.style.opacity = '0'; // Start hidden for animation

                        feedItem.innerHTML = `
                    <div class="feed-icon"><i class="ri-article-line"></i></div>
                    <div class="feed-content">
                        <h4>${item.title}</h4>
                        <span class="feed-date"><i class="ri-calendar-line"></i> ${date}</span>
                    </div>
                `;

                        feedContainer.appendChild(feedItem);
                    });
                } else {
                    feedContainer.innerHTML = '<p style="text-align:center; color:var(--text-secondary)">عذراً، لا يمكن تحميل الأخبار حالياً.</p>';
                }
            } catch (e) {
                console.error("RSS Fetch Error", e);
                feedContainer.innerHTML = '<p style="text-align:center; color:var(--text-secondary)">خطأ في الاتصال.</p>';
            }
        }

        /* --- Theme Toggle --- */
        function initTheme() {
            const toggleBtns = document.querySelectorAll('#theme-toggle'); // Should handle multiple if exists
            // ... existing logic but adapted for multiple buttons if needed

            // Check saved
            const savedTheme = localStorage.getItem('theme') || 'dark';
            document.documentElement.setAttribute('data-theme', savedTheme);

            toggleBtns.forEach(btn => updateIcon(savedTheme, btn.querySelector('i')));

            toggleBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const current = document.documentElement.getAttribute('data-theme');
                    const newTheme = current === 'dark' ? 'light' : 'dark';

                    document.documentElement.setAttribute('data-theme', newTheme);
                    localStorage.setItem('theme', newTheme);

                    // Update all toggle buttons
                    toggleBtns.forEach(b => updateIcon(newTheme, b.querySelector('i')));
                });
            });
        }

        function updateIcon(theme, iconElement) {
            if (theme === 'dark') {
                iconElement.className = 'ri-moon-line';
            } else {
                iconElement.className = 'ri-sun-line';
            }
        }

        /* --- Modal Logic --- */
        function initModal() {
            const modal = document.getElementById('utilities-modal');
            const closeBtn = document.querySelector('.close-modal');

            // Select all triggers: the main button AND the floating sub-buttons
            const triggers = document.querySelectorAll('#utilities-btn-top, .util-trigger');

            triggers.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    // Prevent bubbling if button is inside wrapper etc.
                    e.stopPropagation();

                    const targetKey = btn.dataset.target;
                    modal.classList.add('active');

                    // Descriptions Data
                    const descriptions = {
                        'clock': { title: "التاريخ والوقت", text: "عرض دقيق للوقت الحالي مع التقويم الميلادي بالتفصيل." },
                        'prayer': { title: "مواقيت الصلاة", text: "مواقيت الصلاة اليومية حسب التوقيت المحلي لمدينتك." },
                        'dict': { title: "القاموس الشامل", text: "بحث سريع عن معاني الكلمات والمصطلحات في معجم المعاني." },
                        'hijri': { title: "التقويم الهجري", text: "عرض التاريخ الهجري وما يوافقه من التاريخ الميلادي." },
                        'health': { title: "حاسبة صحتي", text: "أداة متخصصة لحساب موعد الدورة الشهرية وفترة الحمل المتوقعة." },
                        'calc': { title: "الآلة الحاسبة", text: "آلة حاسبة علمية متطورة لإجراء العمليات الحسابية المعقدة." },
                        'weather': { title: "حالة الطقس", text: "توقعات مباشرة لدرجات الحرارة وحالة الطقس في مدينتك." },
                        'zodiac': { title: "عالم الأبراج", text: "اعرف برجك وصفات شخصيتك من خلال تاريخ ميلادك." }
                    };

                    const cards = document.querySelectorAll('.utility-card');
                    const descPanel = document.getElementById('tool-description');
                    const titleEl = document.getElementById('tool-title');
                    const infoEl = document.getElementById('tool-info');

                    // If Specific Target (Focused View)
                    if (targetKey) {
                        // Show Description Panel
                        if (descriptions[targetKey]) {
                            titleEl.innerText = descriptions[targetKey].title;
                            infoEl.innerText = descriptions[targetKey].text;
                            descPanel.style.display = 'block';
                        } else {
                            descPanel.style.display = 'none';
                        }

                        // Filter Cards
                        cards.forEach(card => {
                            // Check if card has the class corresponding to targetKey
                            let isMatch = false;
                            if (targetKey === 'clock' && card.classList.contains('clock-card')) isMatch = true;
                            if (targetKey === 'prayer' && card.classList.contains('prayer-card')) isMatch = true;
                            if (targetKey === 'dict' && card.classList.contains('dictionary-card')) isMatch = true;
                            if (targetKey === 'hijri' && card.classList.contains('calendar-card')) isMatch = true;
                            if (targetKey === 'health' && card.classList.contains('health-card')) isMatch = true;
                            if (targetKey === 'calc' && card.classList.contains('calc-card') && !card.classList.contains('health-card') && !card.classList.contains('zodiac-card')) isMatch = true;
                            if (targetKey === 'weather' && card.classList.contains('weather-card')) isMatch = true;
                            if (targetKey === 'zodiac' && card.classList.contains('zodiac-card')) isMatch = true;

                            if (isMatch) {
                                card.style.display = 'block';
                                card.style.gridColumn = '1 / -1'; // Full width focus
                                card.animate([{ transform: 'scale(0.9)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 300 });
                            } else {
                                card.style.display = 'none';
                            }
                        });

                        // Ensure Grid layout adapts (One item centered)
                        const grid = document.querySelector('.utility-grid');
                        grid.style.gridTemplateColumns = '1fr';
                        grid.style.maxWidth = '500px';
                        grid.style.margin = '0 auto';

                    } else {
                        // General Open (No specific target) - Show All
                        resetModalView();
                    }
                });
            });

            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });

            // Close on Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    modal.classList.remove('active');
                }
            });
        }

        function resetModalView() {
            const grid = document.querySelector('.utility-grid');
            const cards = document.querySelectorAll('.utility-card');
            const descPanel = document.getElementById('tool-description');

            if (descPanel) descPanel.style.display = 'none';

            grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
            grid.style.maxWidth = 'none';
            grid.style.margin = '0';

            cards.forEach(card => {
                card.style.display = 'block';
                card.style.gridColumn = 'auto';
            });
        }

        /* --- Utilities (Clock, Prayers, Hijri) --- */
        function initUtilities() {
            updateClock();
            setInterval(updateClock, 1000);

            updateHijriDate();
            fetchPrayerTimes();
        }

        function updateClock() {
            const now = new Date();
            const timeEl = document.getElementById('clock');
            const dateEl = document.getElementById('date');

            // Time
            timeEl.textContent = now.toLocaleTimeString('ar-EG', { hour12: false });

            // Date
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateEl.textContent = now.toLocaleDateString('ar-EG', options);
        }

        function updateHijriDate() {
            const now = new Date();
            const hijriEl = document.getElementById('hijri-date');

            // Using Intl.DateTimeFormat for Hijri
            const hijriDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).format(now);

            hijriEl.textContent = hijriDate;
        }

        async function fetchPrayerTimes() {
            const container = document.getElementById('prayer-times');

            // Using Aladhan API for Cairo as logic default, intended to be precise
            // Can be enhanced to use Geolocation API if needed
            const apiURL = 'https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt&method=5'; // Method 5 is Egyptian General Authority

            try {
                const response = await fetch(apiURL);
                const data = await response.json();

                if (data.code === 200) {
                    const timings = data.data.timings;
                    const prayers = [
                        { name: 'الفجر', time: timings.Fajr },
                        { name: 'الشروق', time: timings.Sunrise },
                        { name: 'الظهر', time: timings.Dhuhr },
                        { name: 'العصر', time: timings.Asr },
                        { name: 'المغرب', time: timings.Maghrib },
                        { name: 'العشاء', time: timings.Isha }
                    ];

                    let html = '';

                    // Simple logic to highlight next prayer could go here, for now just list
                    prayers.forEach(p => {
                        html += `
                    <div class="prayer-time-row">
                        <span>${p.name}</span>
                        <span>${formatTime12(p.time)}</span>
                    </div>
                `;
                    });

                    container.innerHTML = html;
                } else {
                    container.innerHTML = '<p>تعذر تحميل المواقيت</p>';
                }
            } catch (e) {
                console.error("Prayer fetch error", e);
                container.innerHTML = '<p>خطأ في الاتصال</p>';
            }
        }

        // Convert 24h string (HH:mm) to 12h
        function formatTime12(timeStr) {
            let [hours, minutes] = timeStr.split(':');
            hours = parseInt(hours);
            const ampm = hours >= 12 ? 'م' : 'ص';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            return `${hours}:${minutes} ${ampm}`;
        }

        // Sticky Header scroll effect & Back to Top
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.solar-header');
            const backToTop = document.getElementById('backToTop');

            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Back to Top Logic
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        document.getElementById('backToTop').addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        /* --- Elite Professional 3D Ads --- */
        const adData = [
            {
                img: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiTUwkH3GjQ1-IuB5PYGxcALeGFqWdwgqfWEwvxqHxcBbgKxx6V45bpxiKYQe-QgV_jP1OGoo9_au1RXu_eJ0cgz5ciUvNNjBffEkhefpdY3ocaiFzOtKYhh36ZA_-zzne0PNPvbhHCYl9BkCGDIsJWZ8G1omuckiW9pRBYDJAcQyIBk8qqXUqg2PB3z6M/s1600/Untitled.png',
                title: 'مشد البنطلون بكبش',
                desc: 'مشد البنطلون بيشد البطن ويضبط القوام بشكل احترافي وأنيق للاستعمال اليومي الشاق.',
                link: 'https://www.facebook.com/SlimingCorset.eg',
                icon: 'ri-t-shirt-air-line'
            },
            {
                img: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEitCBFIpEREQUbrCiqlbuQfcMYfUsbh5EiaiWbmdkfb1bqgUJlvaQ4DjTjtXgfdqavUGsMII5Hbj9WJGVUxqw30QUwWE91OnIWml-Xelu86m842ui3rUn2_qS-Dc98IqfdAOQ-pRznTnSM6-JRZzTDLDPwQ8nH39KaMwWiab4ZLQFNCJa0b4cNMsAsGNiMT/s1600/428518484_385413271097688_8975573111447866434_n.jpg',
                title: 'قوام مثالي متناسق',
                desc: 'تصميم مبتكر يمنحك القوام الذي تحلمين به مع ضمان أقصى راحة في الحركة والجلوس.',
                link: 'https://www.facebook.com/SlimingCorset.eg',
                icon: 'ri-magic-line'
            },
            {
                img: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi5GxvQnGkN0XSApRIZ2UIMgrj6PRFbfbclQmM9VI8TJWJi7vY1zf0XESb-9lgxZRWKk0SST4YvHTQet8b8Q-N_kFPAQ8nODOx3FHuOdaOhr1W8afN0r775PN_GhN6-Rlx2gJqPVN2ZodzPzn3SgwQla0rci10g4heoBEs99NUtytjqc-4YYRbfZSby0_Q/s1600/241621226_6010565925684767_575147.jpg',
                title: 'مشد الشورت الساحر',
                desc: 'بكبش أمامي وفتحة تهوية لراحة تدوم طوال اليوم تحت مختلف أنواع الملابس الراقية.',
                link: 'https://www.facebook.com/SlimingCorset.eg',
                icon: 'ri-windy-line'
            },
            {
                img: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjdT2WwdFRFCGHKDdL9gzhUmrHUoJYcmvKJfv8lAqJHOsSjVv1TP1gzQmUCkS5DWULZYTOzbjs88JM7pWm5V0w6NXpH34PMD0w4YqqKMdaGRRiCTsiVYDO4pzhPwf6t76oVn0JrSLFbyuSobrh3wAzJx5IsOAW8fKFvyMWfmW3rrLVW080jLtVBR6M9ZHcC/s1600/406579250_328392290133120_948543427712471834_n.jpg',
                title: 'أناقة لا مثيل لها',
                desc: 'احصل على المظهر المثالي الذي تستحقه مع مجموعتنا الفاخرة المصممة خصيصاً لك.',
                link: 'https://www.facebook.com/SlimingCorset.eg',
                icon: 'ri-vip-diamond-line'
            },
            {
                img: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhZIKjhC4fbDQUxCz_QE6pShqySByldgX8qTOzk4WDvWdLUNCFb1IYXVILcs2u9HULw5p8b0JscG6BXFXISRTJadjhMYHD0i_iF-nb9KY8xYf7o-nLfJ9YiWafIzQ6agsML683SnLLFZd77UOIBqHDJCyUVnW98a9-igD0spKWH8Q-7h3RXRvYY3dPkJig/s1600/524386621_1258100932527799_620507836735161442_n.jpg',
                title: 'الجودة والتميز',
                desc: 'نحن نضمن لك أفضل الخامات وأدق التفاصيل في كل قطعة نوفرها لتناسب ذوقك الرفيع.',
                link: 'https://www.facebook.com/SlimingCorset.eg',
                icon: 'ri-shield-star-line'
            },
            {
                img: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj1dPPCW4Gwo5G_riXug3PBjxz6HmPVbbNzDRthXbftgLoLOfnAatxLsCMwVJLEx73QeMM7Ee9NrMNgMxOMcTarTBlnc-hz97PzHzLKia05kNMcgMqJ4P9m9D_rj9cnGsirEIu7NIbTOXdQ-Ub9zdygztt2uotwCcyaZwT7d58fOUWjbIRtDukxnZuTXw/s1600/293847845_373555021570843_111223332151484409_n.jpg',
                title: 'استمري في التغيير من شكلك',
                desc: 'مشد البنطلون الأسود الأنيق - تصميم عصري يمنحك الثقة والراحة في كل لحظة.',
                link: 'https://www.facebook.com/SlimingCorset.eg',
                icon: 'ri-star-smile-line'
            },
            {
                img: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjj3djLTBr1FnemuOsRBKWvneznf6rphBXnTmQPmLrDpvYPr5d_BudSHF6TioKmzxCjH3vr0NmP054pBJ3yAAX4-Priif3sNJV-hU0uWFVTBlw4V3Q_hE-L8ySqofN_DhFyFxwKkmRR_fwoo7OjeBq4hUWzXOv2tjTYH9VQvRI-c2f7fHLCNgGTGDbsRNs/s1600/530814646_1443252683674096_4213277333422278049_n.jpg',
                title: 'ثقة ملهاش حدود',
                desc: 'مشد الأكمام الطويلة - تصميم مبتكر يجمع بين الأناقة والفعالية لقوام مثالي.',
                link: 'https://www.facebook.com/SlimingCorset.eg',
                icon: 'ri-heart-pulse-line'
            },
            {
                img: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj1Lg9IcbS_eias63DToACoof3gd42ye8Du7rTJomrAaqbRBQr4DLyp9GWb7ZZ6IUrZC6H-4OSYkw07mVonbeBsP4Thw6N8L6gYJLveovRt5o3IUUkuDzdUzfDHGDMt-mb6XoDO4onyXg1HUGfeXixQBoFRR2p4HgFz6iYnzvKSCE-Urhwb-e1bS-cs/s1600/%D9%85%D8%B4%D8%AF%20%D8%A7%D9%84%D8%B4%D9%88%D8%B1%D8%AA%20%D8%A8%D9%83%D8%A8%D8%B4%D8%A9%20%D9%88%D9%81%D8%AA%D8%AD%D8%A9%20%D8%AA%D9%87%D9%88%D9%8A%D8%A9.jpg',
                title: 'عروض Sliming Corset',
                desc: 'تشكيلة متنوعة من المشدات الاحترافية - اختاري ما يناسبك من بين أفضل التصاميم.',
                link: 'https://www.facebook.com/SlimingCorset.eg',
                icon: 'ri-gift-line'
            }
        ];

        let currentAdIndex = 0;

        function initAdsSlideshow() {
            const slider = document.getElementById('cinematic-slider');
            if (!slider) {
                console.error('Slider element not found!');
                return;
            }

            console.log('Initializing slideshow with', adData.length, 'ads');
            slider.innerHTML = '';

            // RTL-Appropriate Navigation Icons (Reversed)
            const prevBtn = document.getElementById('ads-prev');
            const nextBtn = document.getElementById('ads-next');

            // Swapped: left arrow for previous, right arrow for next
            prevBtn.innerHTML = '<i class="ri-arrow-left-circle-fill"></i><div class="nav-ping"></div>';
            nextBtn.innerHTML = '<i class="ri-arrow-right-circle-fill"></i><div class="nav-ping"></div>';

            const triggerPing = (btn) => {
                btn.classList.remove('clicked');
                void btn.offsetWidth; // Force reflow
                btn.classList.add('clicked');
                setTimeout(() => btn.classList.remove('clicked'), 600);
            };

            adData.forEach((ad, index) => {
                const slide = document.createElement('div');
                slide.className = 'ad-slide';
                slide.innerHTML = `
                    <div class="scale-wrapper">
                        <!-- Satellite WhatsApp HUD - Simplified -->
                        <div class="ad-contact-hud">
                            <div class="hud-top-info">
                                <i class="ri-whatsapp-line wa-mini-icon"></i>
                                <h3>01094044300</h3>
                            </div>
                        </div>

                        <div class="ad-mobile-frame">
                            <div class="ad-image-container">
                                <img src="${ad.img}" alt="${ad.title}">
                                
                                <!-- Internal 3D Description Window -->
                                <div class="ad-desc-window">
                                    <div style="font-size: 1.2rem; margin-bottom: 5px; color: var(--primary);">
                                        <i class="${ad.icon}"></i>
                                    </div>
                                    <h4>${ad.title}</h4>
                                    <p>${ad.desc}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                // Internal Slide Interaction (Parallax & Blade Trigger)
                slide.addEventListener('mouseenter', () => {
                    if (slide.classList.contains('active')) {
                        const img = slide.querySelector('img');
                        gsap.to(img, { scale: 1.1, duration: 0.8, ease: "power2.out" });
                    }
                });

                slide.addEventListener('mouseleave', () => {
                    const img = slide.querySelector('img');
                    gsap.to(img, { scale: 1, duration: 0.8, ease: "power2.out" });
                });

                slide.onclick = () => {
                    window.open(ad.link, '_blank');
                };

                slider.appendChild(slide);

                // Position ads in a 3D circle
                const totalAds = adData.length;
                const anglePerAd = 360 / totalAds; // 45 degrees for 8 ads
                const radius = 450; // Extreme compact radius
                const angle = anglePerAd * index;

                // Apply circular positioning
                slide.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
            });

            nextBtn.onclick = () => { triggerPing(nextBtn); moveAd(-1); }; // Reversed direction
            prevBtn.onclick = () => { triggerPing(prevBtn); moveAd(1); }; // Reversed direction

            updateAdDisplay();
        }

        function moveAd(step) {
            currentAdIndex += step;
            updateAdDisplay();
        }

        function updateAdDisplay() {
            const slider = document.getElementById('cinematic-slider');
            if (!slider) return;

            const totalAds = adData.length;
            const anglePerAd = 360 / totalAds;
            const targetRotation = currentAdIndex * -anglePerAd; // Rotate appropriately

            gsap.to(slider, {
                rotationY: targetRotation,
                duration: 1.5,
                ease: "expo.out"
            });

            // Update Active Class
            const slides = document.querySelectorAll('.ad-slide');
            slides.forEach((slide, i) => {
                const normalizedIndex = (currentAdIndex % totalAds + totalAds) % totalAds;
                const isActive = i === normalizedIndex;

                if (isActive) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });
        }

        const wrapper = document.querySelector('.cinematic-slider-wrapper-art');
        let autoPlayInterval;

        function startAutoPlay() {
            autoPlayInterval = setInterval(() => {
                moveAd(1);
            }, 4000);
        }

        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }

        if (wrapper) {
            startAutoPlay();
            wrapper.addEventListener('mouseenter', stopAutoPlay);
            wrapper.addEventListener('mouseleave', () => {
                startAutoPlay();
                // Reset Global Tilt
                const slider = document.getElementById('cinematic-slider');
                if (slider) {
                    gsap.to(slider, {
                        rotationX: 0,
                        rotationY: currentAdIndex * -(360 / adData.length),
                        skewX: 0,
                        duration: 1.2,
                        ease: "power2.out"
                    });
                }
            });

            // HYPER-CREATIVE GLOBAL 3D INTERACTION
            wrapper.addEventListener('mousemove', (e) => {
                const width = wrapper.offsetWidth;
                const height = wrapper.offsetHeight;
                const rect = wrapper.getBoundingClientRect();

                const xPos = ((e.clientX - rect.left) / width) - 0.5;
                const yPos = ((e.clientY - rect.top) / height) - 0.5;

                const slider = document.getElementById('cinematic-slider');
                if (slider) {
                    const anglePerAd = 360 / adData.length;

                    // Tilt the entire cylinder cylinder
                    gsap.to(slider, {
                        rotationX: yPos * -25, // Tilt up/down
                        rotationY: (currentAdIndex * -anglePerAd) + (xPos * 35), // React to horizontal move
                        skewX: xPos * 5, // Subtle organic distortion
                        duration: 0.8,
                        ease: "power2.out"
                    });
                }
            });
        }
