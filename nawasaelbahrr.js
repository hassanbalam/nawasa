/* --- Consolidated Application Logic --- */
        let orbitTimer;
        let weatherFetched = false;
        let prayerFetched = false;

        // Toggle Orbit Menu (Now purely for manual/JS control if needed, hover is CSS-based)
        window.toggleOrbitMenu = function () {
            const menu = document.getElementById('floatingUtils');
            if (menu) menu.classList.toggle('active');
        };

        // Satellite Tooltips
        document.querySelectorAll('.satellite').forEach(btn => {
            btn.addEventListener('mouseenter', (e) => {
                const name = e.currentTarget.getAttribute('data-name');
                const desc = e.currentTarget.getAttribute('data-desc');
                const titleEl = document.getElementById('ot-title');
                const descEl = document.getElementById('ot-desc');
                const display = document.getElementById('orbit-tooltip-display');

                if (titleEl && descEl && display) {
                    titleEl.textContent = name;
                    descEl.textContent = desc;
                    display.classList.add('visible');
                }
            });

            btn.addEventListener('mouseleave', () => {
                const display = document.getElementById('orbit-tooltip-display');
                if (display) display.classList.remove('visible');
            });
        });

        // --- Modal Logic ---
        window.openTool = function (toolId) {
            const modal = document.getElementById('utilities-modal');
            const mainGrid = document.getElementById('main-tool-grid');
            const views = document.querySelectorAll('.tool-view');

            if (!modal) return;

            modal.classList.add('active');

            views.forEach(v => v.style.display = 'none');
            mainGrid.style.display = 'none';

            if (toolId && toolId !== 'grid') {
                const targetView = document.getElementById('tool-view-' + toolId);
                if (targetView) {
                    targetView.style.display = 'block';
                    initTool(toolId);
                } else {
                    mainGrid.style.display = 'grid';
                }
            } else {
                mainGrid.style.display = 'grid';
            }
        };

        window.closeModal = function () {
            const modal = document.getElementById('utilities-modal');
            if (modal) modal.classList.remove('active');
        };

        window.showMainGrid = function () {
            const mainGrid = document.getElementById('main-tool-grid');
            const views = document.querySelectorAll('.tool-view');
            views.forEach(v => v.style.display = 'none');
            if (mainGrid) {
                mainGrid.style.display = 'grid';
                mainGrid.style.animation = 'fadeInDown 0.4s ease';
            }
        };

        // --- Tool Inits ---
        function initTool(toolId) {
            if (toolId === 'date') updateTime();
            if (toolId === 'world') updateWorldClock();
            if (toolId === 'weather') getWeather();
            if (toolId === 'prayer') getPrayerTimes();
            if (toolId === 'hijri') displayCurrentHijriDate();
            if (toolId === 'calc') clearCalc();
            if (toolId === 'dict') {
                document.getElementById('dict-result').innerHTML = '<p style="color:var(--text-secondary); text-align:center;">نتائج البحث ستظهر هنا</p>';
                document.getElementById('dict-search-input').value = '';
            }
        }

        // 1. Date & Time
        function updateTime() {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('ar-EG');
            const dateStr = now.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

            const timeEl = document.getElementById('live-time');
            const dateEl = document.getElementById('live-date');
            if (timeEl) timeEl.textContent = timeStr;
            if (dateEl) dateEl.textContent = dateStr;

            if (document.getElementById('tool-view-date').style.display === 'block') {
                requestAnimationFrame(updateTime);
            }
        }

        // 2. World Clock
        function updateWorldClock() {
            const cities = {
                'cairo': 'Africa/Cairo',
                'mecca': 'Asia/Riyadh',
                'london': 'Europe/London',
                'ny': 'America/New_York',
                'tokyo': 'Asia/Tokyo',
                'dubai': 'Asia/Dubai'
            };

            for (let id in cities) {
                const el = document.getElementById('wc-' + id);
                if (el) {
                    const time = new Date().toLocaleTimeString('en-US', { timeZone: cities[id], hour: '2-digit', minute: '2-digit', hour12: false });
                    el.textContent = time;
                }
            }

            if (document.getElementById('tool-view-world').style.display === 'block') {
                setTimeout(updateWorldClock, 1000);
            }
        }

        // 3. Weather
        async function getWeather() {
            if (weatherFetched) return;
            const tempEl = document.getElementById('w-temp');
            const descEl = document.getElementById('w-desc');

            try {
                const lat = 30.04;
                const lon = 31.23;
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

                const res = await fetch(url);
                const data = await res.json();

                if (data.current_weather) {
                    tempEl.textContent = data.current_weather.temperature + "°C";
                    const code = data.current_weather.weathercode;
                    let desc = "مشمس";
                    if (code > 3) desc = "غائم";
                    if (code > 40) desc = "ضباب";
                    if (code > 50) desc = "ممطر";
                    if (code > 90) desc = "عاصف";

                    descEl.textContent = desc + " (القاهرة)";
                    weatherFetched = true;
                }
            } catch (e) {
                descEl.textContent = "حدث خطأ في جلب الطقس";
            }
        }

        // 4. Prayer Times
        async function getPrayerTimes() {
            if (prayerFetched) return;
            const list = document.getElementById('prayer-times-list');

            try {
                const res = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt&method=5');
                const data = await res.json();
                const timings = data.data.timings;

                let html = '';
                const prayers = {
                    "Fajr": "الفجر",
                    "Dhuhr": "الظهر",
                    "Asr": "العصر",
                    "Maghrib": "المغرب",
                    "Isha": "العشاء"
                };

                for (let key in prayers) {
                    html += `
                    <div class="prayer-time-row">
                        <span>${prayers[key]}</span>
                        <span style="font-weight:bold; color:var(--primary);">${timings[key]}</span>
                    </div>`;
                }
                list.innerHTML = html;
                prayerFetched = true;
            } catch (e) {
                list.innerHTML = "فشل التحميل";
            }
        }

        // 5. Hijri Calendar & Converter
        window.convertDate = function (toHijri) {
            const input = document.getElementById('date-convert-input').value;
            const resEl = document.getElementById('convert-result');
            if (!input) {
                resEl.innerHTML = '<span style="color:var(--text-secondary);">يرجى اختيار تاريخ</span>';
                return;
            }

            const date = new Date(input);
            if (isNaN(date.getTime())) {
                resEl.innerHTML = '<span style="color:var(--danger);">تاريخ غير صحيح</span>';
                return;
            }

            if (toHijri) {
                const hijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    numberingSystem: 'arab'
                }).format(date);
                resEl.innerHTML = `<i class="ri-calendar-check-fill" style="color:var(--primary);"></i> التاريخ الهجري: <b style="color:var(--primary)">${hijri}</b>`;
            } else {
                const gregorian = date.toLocaleDateString('ar-EG', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                resEl.innerHTML = `<i class="ri-calendar-line" style="color:var(--accent);"></i> التاريخ الميلادي: <b style="color:var(--accent)">${gregorian}</b>`;
            }
        };

        // Set today's date in the input
        window.setTodayDate = function () {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const dateInput = document.getElementById('date-convert-input');
            if (dateInput) {
                dateInput.value = `${year}-${month}-${day}`;
                convertDate(true); // Auto convert to show result
            }
        };

        // Display current Hijri date
        window.displayCurrentHijriDate = function () {
            const today = new Date();
            const hijriDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                numberingSystem: 'arab'
            }).format(today);

            const hijriEl = document.getElementById('current-hijri-date');
            if (hijriEl) {
                hijriEl.textContent = hijriDate;
            }
        };

        // Zodiac
        window.calcZodiac = function () {
            const day = parseInt(document.getElementById('z-day').value);
            const month = parseInt(document.getElementById('z-month').value);
            const nameEl = document.getElementById('z-sign-name');
            const traitsEl = document.getElementById('z-sign-traits');

            if (!day || !month) {
                nameEl.textContent = "يرجى إدخال التاريخ";
                traitsEl.textContent = "";
                return;
            }

            const zodiacs = [
                { name: "الجدي", start: [1, 1], end: [1, 19], traits: "عملي، حكيم، طموح، منضبط، صبور، حذر." },
                { name: "الدلو", start: [1, 20], end: [2, 18], traits: "ودود، إنساني، صادق، وفي، مبتكر، مستقل." },
                { name: "الحوت", start: [2, 19], end: [3, 20], traits: "خيالي، حساس، عطوف، طيب القلب، غير أناني." },
                { name: "الحمل", start: [3, 21], end: [4, 19], traits: "مقدام، نشيط، شجاع، متحمس، واثق بنفسه." },
                { name: "الثور", start: [4, 20], end: [5, 20], traits: "يعتمد عليه، صبور، موسيقي، عملي." },
                { name: "الجوزاء", start: [5, 21], end: [6, 20], traits: "فضولي، قابل للتكيف، قادر على تبادل الأفكار." },
                { name: "السرطان", start: [6, 21], end: [7, 22], traits: "عاطفي، محب، حدسي، خيالي، حذر." },
                { name: "الأسد", start: [7, 23], end: [8, 22], traits: "كريم، دافئ، مبدع، متحمس، واسع الأفق." },
                { name: "العذراء", start: [8, 23], end: [9, 22], traits: "متواضع، خجول، دقيق، يعتمد عليه، عملي." },
                { name: "الميزان", start: [9, 23], end: [10, 22], traits: "دبلوماسي، رومانسي، ساحر، سهل الإنقياد." },
                { name: "العقرب", start: [10, 23], end: [11, 21], traits: "عاطفي، قوي الإرادة، حدسي، جذاب." },
                { name: "القوس", start: [11, 22], end: [12, 21], traits: "متفائل، محب للحرية، مرح، صادق." },
                { name: "الجدي", start: [12, 22], end: [12, 31], traits: "عملي، حكيم، طموح، منضبط، صبور." }
            ];

            let sign = null;
            for (let z of zodiacs) {
                if (
                    (month === z.start[0] && day >= z.start[1]) ||
                    (month === z.end[0] && day <= z.end[1])
                ) {
                    sign = z;
                    break;
                }
            }

            if (sign) {
                nameEl.textContent = "برج: " + sign.name;
                traitsEl.textContent = "صفاته: " + sign.traits;
            } else {
                nameEl.textContent = "تاريخ غير صحيح";
            }
        };

        // 6. Luck Today
        window.getLuckNow = function () {
            const msgs = [
                "يوم ممتاز للبدء في مشاريع جديدة.",
                "عليك الحذر من المصاريف الزائدة اليوم.",
                "فرصة رائعة للقاء أصدقاء قدامى.",
                "النجاح حليفك في العمل اليوم.",
                "خذ قسطاً من الراحة، أنت بحاجة إليها.",
                "أخبار سارة في الطريق إليك.",
                "تجنب الانفعال وحافظ على هدوئك.",
                "الحظ يبتسم لك في الأمور العاطفية."
            ];
            const loading = document.getElementById('luck-loading');
            const content = document.getElementById('luck-content');

            loading.style.display = 'block';
            content.style.display = 'none';

            setTimeout(() => {
                loading.style.display = 'none';
                content.style.display = 'block';
                const rand = Math.floor(Math.random() * msgs.length);
                content.innerHTML = `<h3 style='color:var(--primary); marginBottom:10px'>${msgs[rand]}</h3>`;
            }, 1000);
        }

        // 7. Scientific Calculator
        let calcVal = "";
        window.appCalc = function (char) {
            if (char === 'sin(' || char === 'cos(' || char === 'tan(' || char === 'log(' || char === 'sqrt(') {
                calcVal += "Math." + char;
            } else if (char === 'pow(') {
                calcVal += "**";
            } else {
                calcVal += char;
            }

            let displayVal = calcVal.replace(/Math./g, "").replace(/\*\*/g, "^");
            document.getElementById('calc-display').value = displayVal;
        };
        window.execCalc = function () {
            try {
                let res = eval(calcVal).toString();
                document.getElementById('calc-display').value = res;
                calcVal = res;
            } catch (e) {
                document.getElementById('calc-display').value = "Error";
                calcVal = "";
            }
        };
        window.clearCalc = function () {
            calcVal = "";
            document.getElementById('calc-display').value = "";
        };

        // 8. Health Enhanced
        window.switchHealthTab = function (tab) {
            document.querySelectorAll('.health-tabs .tool-btn').forEach(b => b.classList.remove('active-tab'));
            document.getElementById('ht-' + tab).classList.add('active-tab');

            document.getElementById('h-sec-bmi').style.display = 'none';
            document.getElementById('h-sec-preg').style.display = 'none';
            document.getElementById('h-sec-period').style.display = 'none';

            document.getElementById('h-sec-' + tab).style.display = 'block';
        };

        window.calcBMI = function () {
            const w = parseFloat(document.getElementById('h-weight').value);
            const h = parseFloat(document.getElementById('h-height').value);
            const resEl = document.getElementById('bmi-result');

            if (!w || !h) {
                resEl.textContent = "أدخل البيانات";
                return;
            }

            const bmi = w / ((h / 100) * (h / 100));
            let status = "";
            if (bmi < 18.5) status = "نحافة";
            else if (bmi < 25) status = "وزن مثالي";
            else if (bmi < 30) status = "زيادة وزن";
            else status = "سمنة";

            resEl.innerHTML = `مؤشر كتلة الجسم: ${bmi.toFixed(1)} <br> الحالة: <span style="color:var(--primary)">${status}</span>`;
        };

        window.calcPregnancy = function () {
            const date = document.getElementById('preg-date').value;
            const resEl = document.getElementById('preg-result');
            if (!date) { resEl.textContent = "أدخلي التاريخ"; return; }

            const lmp = new Date(date);
            const dueDate = new Date(lmp);
            dueDate.setDate(lmp.getDate() + 280);

            resEl.innerHTML = `موعد الولادة المتوقع: <span style='color:var(--primary)'>${dueDate.toLocaleDateString('ar-EG')}</span>`;
        }

        window.calcPeriod = function () {
            const date = document.getElementById('period-date').value;
            const cycle = parseInt(document.getElementById('period-cycle').value) || 28;
            const resEl = document.getElementById('period-result');

            if (!date) { resEl.textContent = "أدخلي التاريخ"; return; }

            const last = new Date(date);
            const next = new Date(last);
            next.setDate(last.getDate() + cycle);
            const fertileStart = new Date(next);
            fertileStart.setDate(next.getDate() - 14 - 5);

            resEl.innerHTML = `الدورة القادمة: <span style='color:var(--primary)'>${next.toLocaleDateString('ar-EG')}</span><br>التبويض يبدأ تقريباً: ${fertileStart.toLocaleDateString('ar-EG')}`;
        }

        // 9. Dictionary Logic
        window.searchDictionary = async function () {
            const query = document.getElementById('dict-search-input').value.trim();
            const resEl = document.getElementById('dict-result');
            if (!query) return;

            resEl.innerHTML = '<p style="text-align:center;"><i class="fa-solid fa-spinner fa-spin"></i> جاري البحث...</p>';

            try {
                // Using free dictionary API
                const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`);
                const data = await response.json();

                if (Array.isArray(data)) {
                    let html = `<h4 style="color:var(--primary); margin-bottom:10px;">${data[0].word}</h4>`;
                    data[0].meanings.forEach(m => {
                        html += `<p><b>[${m.partOfSpeech}]</b> ${m.definitions[0].definition}</p>`;
                        if (m.definitions[0].example) {
                            html += `<p style="font-style:italic; font-size:0.85rem; color:var(--text-secondary);">Example: ${m.definitions[0].example}</p>`;
                        }
                    });
                    resEl.innerHTML = html;
                } else {
                    resEl.innerHTML = '<p style="text-align:center; color:var(--danger);">عذراً، لم يتم العثور على الكلمة (يدعم الإنجليزية حالياً).</p>';
                }
            } catch (e) {
                resEl.innerHTML = '<p style="text-align:center; color:var(--danger);">تعذر الاتصال بالقاموس.</p>';
            }
        };

        // Initialize display for hijri on load if needed
        document.addEventListener('DOMContentLoaded', () => {
            if (typeof displayCurrentHijriDate === 'function') displayCurrentHijriDate();
        });

        /* --- Elite Professional 3D Ads --- */
        const adData = [
            {
                img: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiTUwkH3GjQ1-IuB5PYGxcALeGFqWdwgqfWEwvxqHxcBbgKxx6V45bpxiKYQe-QgV_jP1OGoo9_au1RXu_eJ0cgz5ciUvNNjBffEkhefpdY3ocaiFzOtKYhh36ZA_-zzne0PNPvbhHCYl9BkCGDIsJWZ8G1omuckiW9pRBYDJAcQyIBk8qqXUqg2PB3z6M/s1600/Untitled.png',
                title: 'مشد البنطلون بكبش',
                desc: 'يشد البطن ويضبط القوام بشكل احترافي وأنيق.',
                link: 'https://www.facebook.com/SlimingCorset.eg',
                icon: 'ri-t-shirt-air-line'
            },
            {
                img: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEitCBFIpEREQUbrCiqlbuQfcMYfUsbh5EiaiWbmdkfb1bqgUJlvaQ4DjTjtXgfdqavUGsMII5Hbj9WJGVUxqw30QUwWE91OnIWml-Xelu86m842ui3rUn2_qS-Dc98IqfdAOQ-pRznTnSM6-JRZzTDLDPwQ8nH39KaMwWiab4ZLQFNCJa0b4cNMsAsGNiMT/s1600/428518484_385413271097688_8975573111447866434_n.jpg',
                title: 'قوام مثالي متناسق',
                desc: 'تصميم مبتكر يمنحك القوام الذي تحلمين به.',
                link: 'https://www.facebook.com/SlimingCorset.eg',
                icon: 'ri-magic-line'
            },
            {
                img: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi5GxvQnGkN0XSApRIZ2UIMgrj6PRFbfbclQmM9VI8TJWJi7vY1zf0XESb-9lgxZRWKk0SST4YvHTQet8b8Q-N_kFPAQ8nODOx3FHuOdaOhr1W8afN0r775PN_GhN6-Rlx2gJqPVN2ZodzPzn3SgwQla0rci10g4heoBEs99NUtytjqc-4YYRbfZSby0_Q/s1600/241621226_6010565925684767_575147.jpg',
                title: 'مشد الشورت الساحر',
                desc: 'بكبش أمامي وفتحة تهوية لراحة تدوم طوال اليوم.',
                link: 'https://www.facebook.com/SlimingCorset.eg',
                icon: 'ri-windy-line'
            },
            {
                img: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjdT2WwdFRFCGHKDdL9gzhUmrHUoJYcmvKJfv8lAqJHOsSjVv1TP1gzQmUCkS5DWULZYTOzbjs88JM7pWm5V0w6NXpH34PMD0w4YqqKMdaGRRiCTsiVYDO4pzhPwf6t76oVn0JrSLFbyuSobrh3wAzJx5IsOAW8fKFvyMWfmW3rrLVW080jLtVBR6M9ZHcC/s1600/406579250_328392290133120_948543427712471834_n.jpg',
                title: 'أناقة لا مثيل لها',
                desc: 'احصل على المظهر المثالي الذي تستحقه مع مجموعتنا.',
                link: 'https://www.facebook.com/SlimingCorset.eg',
                icon: 'ri-vip-diamond-line'
            },
            {
                img: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhZIKjhC4fbDQUxCz_QE6pShqySByldgX8qTOzk4WDvWdLUNCFb1IYXVILcs2u9HULw5p8b0JscG6BXFXISRTJadjhMYHD0i_iF-nb9KY8xYf7o-nLfJ9YiWafIzQ6agsML683SnLLFZd77UOIBqHDJCyUVnW98a9-igD0spKWH8Q-7h3RXRvYY3dPkJig/s1600/524386621_1258100932527799_620507836735161442_n.jpg',
                title: 'الجودة والتميز',
                desc: 'نحن نضمن لك أفضل الخامات وأدق التفاصيل.',
                link: 'https://www.facebook.com/SlimingCorset.eg',
                icon: 'ri-shield-star-line'
            },
            {
                img: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj1dPPCW4Gwo5G_riXug3PBjxz6HmPVbbNzDRthXbftgLoLOfnAatxLsCMwVJLEx73QeMM7Ee9NrMNgMxOMcTarTBlnc-hz97PzHzLKia05kNMcgMqJ4P9m9D_rj9cnGsirEIu7NIbTOXdQ-Ub9zdygztt2uotwCcyaZwT7d58fOUWjbIRtDukxnZuTXw/s1600/293847845_373555021570843_111223332151484409_n.jpg',
                title: 'تغيير شامل',
                desc: 'مشد البنطلون الأسود الأنيق - تصميم عصري.',
                link: 'https://www.facebook.com/SlimingCorset.eg',
                icon: 'ri-star-smile-line'
            },
            {
                img: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjj3djLTBr1FnemuOsRBKWvneznf6rphBXnTmQPmLrDpvYPr5d_BudSHF6TioKmzxCjH3vr0NmP054pBJ3yAAX4-Priif3sNJV-hU0uWFVTBlw4V3Q_hE-L8ySqofN_DhFyFxwKkmRR_fwoo7OjeBq4hUWzXOv2tjTYH9VQvRI-c2f7fHLCNgGTGDbsRNs/s1600/530814646_1443252683674096_4213277333422278049_n.jpg',
                title: 'ثقة بلا حدود',
                desc: 'مشد الأكمام الطويلة - تصميم مبتكر للأناقة.',
                link: 'https://www.facebook.com/SlimingCorset.eg',
                icon: 'ri-heart-pulse-line'
            },
            {
                img: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj1Lg9IcbS_eias63DToACoof3gd42ye8Du7rTJomrAaqbRBQr4DLyp9GWb7ZZ6IUrZC6H-4OSYkw07mVonbeBsP4Thw6N8L6gYJLveovRt5o3IUUkuDzdUzfDHGDMt-mb6XoDO4onyXg1HUGfeXixQBoFRR2p4HgFz6iYnzvKSCE-Urhwb-e1bS-cs/s1600/%D9%85%D8%B4%D8%AF%20%D8%A7%D9%84%D8%B4%D9%88%D8%B1%D8%AA%20%D8%A8%D9%83%D8%A8%D8%B4%D8%A9%20%D9%88%D9%81%D8%AA%D8%AD%D8%A9%20%D8%AA%D9%87%D9%88%D9%8A%D8%A9.jpg',
                title: 'عروض خاصة',
                desc: 'تشكيلة متنوعة من المشدات الاحترافية.',
                link: 'https://www.facebook.com/SlimingCorset.eg',
                icon: 'ri-gift-line'
            }
        ];

        let currAdIdx = 0;

        function initAdsSlideshow() {
            const slider = document.getElementById('cinematic-slider');
            if (!slider) return;
            slider.innerHTML = '';

            adData.forEach((ad, i) => {
                const slide = document.createElement('div');
                slide.className = 'ad-slide';
                slide.setAttribute('data-index', i);

                slide.onclick = (e) => handleSlideClick(i, ad.link, e);

                slide.innerHTML = `
                    <div class="scale-wrapper">
                        <img src="${ad.img}" alt="${ad.title}">
                        
                        <!-- 3D Overlay -->
                        <div class="ad-overlay-info">
                            <i class="${ad.icon} sl-icon"></i>
                            <h4 style="font-size: 1.2rem; margin-bottom: 5px;">${ad.title}</h4>
                            <p style="font-size: 0.9rem; opacity: 0.9;">${ad.desc}</p>
                        </div>

                        <!-- WhatsApp Action -->
                        <a href="https://wa.me/201094044300" target="_blank" class="whatsapp-act" title="تواصل عبر واتساب">
                            <i class="ri-whatsapp-line"></i>
                        </a>
                    </div>
                `;
                slider.appendChild(slide);
            });

            // Nav Buttons
            const btnPrev = document.getElementById('ads-prev');
            const btnNext = document.getElementById('ads-next');
            if (btnPrev) {
                btnPrev.onclick = () => {
                    currAdIdx--;
                    updateAdsCarousel();
                };
            }
            if (btnNext) {
                btnNext.onclick = () => {
                    currAdIdx++;
                    updateAdsCarousel();
                };
            }

            // Auto-Play Feature
            let adAutoInterval = setInterval(() => {
                currAdIdx++;
                updateAdsCarousel();
            }, 5000); // Swap every 5 seconds

            // Pause on hover
            const sliderWrapper = document.querySelector('.cinematic-slider-wrapper-art');
            if (sliderWrapper) {
                sliderWrapper.onmouseenter = () => clearInterval(adAutoInterval);
                sliderWrapper.onmouseleave = () => {
                    adAutoInterval = setInterval(() => {
                        currAdIdx++;
                        updateAdsCarousel();
                    }, 5000);
                };
            }

            updateAdsCarousel();
        }

        function handleSlideClick(index, link, e) {
            const total = adData.length;
            let dist = Math.abs(index - currAdIdx);
            if (dist > total / 2) dist = total - dist;

            if (dist === 0) {
                if (!e.target.closest('.whatsapp-act')) {
                    window.open(link, '_blank');
                }
            } else {
                currAdIdx = index;
                updateAdsCarousel();
            }
        }

        function updateAdsCarousel() {
            const slides = document.querySelectorAll('.ad-slide');
            const total = slides.length;
            if (total === 0) return;

            const radius = 300;
            const angleStep = (2 * Math.PI) / total;

            while (currAdIdx < 0) currAdIdx += total;
            currAdIdx = currAdIdx % total;

            slides.forEach((slide, i) => {
                let diff = i - currAdIdx;
                if (diff > total / 2) diff -= total;
                if (diff < -total / 2) diff += total;

                const theta = diff * angleStep;

                const x = Math.sin(theta) * (radius * 1.5);
                const z = (Math.cos(theta) * radius) - radius;
                const rotateY = theta * (180 / Math.PI);

                let scale = 0.8;
                let opacity = 0.5;
                let zIndex = 10;
                let filter = 'brightness(0.5) blur(3px) grayscale(0.8)';
                let pointerEvents = 'auto';

                if (Math.abs(diff) < 0.1) {
                    zIndex = 100;
                    scale = 1.1;
                    filter = 'brightness(1) blur(0px) grayscale(0)';
                    opacity = 1;
                    slide.classList.add('active');
                    pointerEvents = 'auto';
                } else {
                    slide.classList.remove('active');
                }

                if (Math.abs(diff) > 0.1 && Math.abs(diff) < 1.5) {
                    zIndex = 50;
                    opacity = 0.85;
                    scale = 0.9;
                    filter = 'brightness(0.7) blur(1px) grayscale(0.2)';
                }

                if (Math.abs(theta) > Math.PI / 1.8) {
                    opacity = 0;
                    pointerEvents = 'none';
                }

                slide.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${rotateY}deg) scale(${scale})`;
                slide.style.zIndex = zIndex;
                slide.style.opacity = opacity;
                slide.style.filter = filter;
                slide.style.pointerEvents = pointerEvents;
            });
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            initAdsSlideshow();
            toggleOrbitMenu();
            document.querySelectorAll('.sat-wrapper').forEach(w => {
                w.classList.add('is-orbiting');
            });

            // --- Snap Preview Implementation ---
            initSnapPreview();
        });

        function initSnapPreview() {
            // Create preview element
            const snapPreview = document.createElement('div');
            snapPreview.className = 'snap-preview';
            snapPreview.innerHTML = `
                <div class="snap-preview-img-container">
                    <img src="" alt="Preview" class="snap-preview-img">
                    <div class="snap-preview-overlay"></div>
                </div>
                <div class="snap-preview-info">
                    <span class="snap-preview-title">جاري التحميل...</span>
                    <span class="snap-preview-url"><i class="fa-solid fa-link"></i> <span></span></span>
                </div>
            `;
            document.body.appendChild(snapPreview);

            const blogLinks = document.querySelectorAll('.blogs-section .article-title a');

            blogLinks.forEach(link => {
                link.addEventListener('mouseenter', (e) => {
                    const url = link.href;
                    const title = link.textContent;
                    // Using WordPress mshots for free website screenshots
                    const screenshotUrl = `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=400`;

                    const img = snapPreview.querySelector('.snap-preview-img');
                    img.src = screenshotUrl;

                    snapPreview.querySelector('.snap-preview-title').textContent = title;
                    snapPreview.querySelector('.snap-preview-url span').textContent = url.split('://')[1] || url;

                    snapPreview.classList.add('active');
                    updatePreviewPosition(e, snapPreview);
                });

                link.addEventListener('mousemove', (e) => {
                    updatePreviewPosition(e, snapPreview);
                });

                link.addEventListener('mouseleave', () => {
                    snapPreview.classList.remove('active');
                });
            });
        }

        function updatePreviewPosition(e, el) {
            const offset = 25;
            let x = e.clientX + offset;
            let y = e.clientY + offset;

            const width = 320;
            const height = 240;

            // Boundary check
            if (x + width > window.innerWidth) x = e.clientX - width - offset;
            if (y + height > window.innerHeight) y = e.clientY - height - offset;

            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
        }
