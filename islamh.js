        // GLOBAL VARIABLES
        let scene, camera, renderer, cssRenderer, controls;
        let kaabaGroup;
        let carouselGroup;
        let isAutoRotating = true;
        let carouselAngle = 0;
        let targetRotation = 0;
        // Radius will be dynamic
        let carouselRadius = 850;

        // HELPER FUNCTIONS (Modals & Tools)
        const azkarList = [
            "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ (100 مرة)",
            "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ (100 مرة)",
            "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ (100 مرة)",
            "سُبْحَانَ اللَّهِ الْعَظِيمِ وَبِحَمْدِهِ",
            "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
            "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
            "سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ",
            "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
            "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ",
            "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
            "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا"
        ];

        window.showRandomDhikr = function () {
            const text = azkarList[Math.floor(Math.random() * azkarList.length)];
            const el = document.getElementById('dhikr-text');
            if (el) {
                el.style.opacity = '0';
                setTimeout(() => {
                    el.innerText = text;
                    el.style.opacity = '1';
                }, 300);
            }
        };

        window.create3DIFrame = function (url, title = 'تصفح') {
            const modal = document.getElementById('iframe-modal');
            const iframe = document.getElementById('generic-iframe');
            const titleEl = document.getElementById('iframe-title');
            if (modal && iframe) {
                iframe.src = url;
                if (titleEl) titleEl.textContent = title;
                openModal('iframe-modal');
            } else {
                window.open(url, '_blank');
            }
        };

        window.calculateFullZakat = function () {
            // Get inputs
            const cash = parseFloat(document.getElementById('z-cash').value) || 0;
            const goldWeight = parseFloat(document.getElementById('z-gold').value) || 0;
            const goldPrice = parseFloat(document.getElementById('p-gold').value) || 0;
            const silverWeight = parseFloat(document.getElementById('z-silver').value) || 0;
            const silverPrice = parseFloat(document.getElementById('p-silver').value) || 0;
            const trade = parseFloat(document.getElementById('z-trade').value) || 0;
            const debt = parseFloat(document.getElementById('z-debt').value) || 0;

            // Total Wealth
            const totalWealth = cash + (goldWeight * goldPrice) + (silverWeight * silverPrice) + trade - debt;

            // Nisab (Threshold) - Based on 85g of Gold
            const nisab = 85 * goldPrice;

            // Display Logic
            const resultBox = document.getElementById('zakat-full-result');
            const resTotal = document.getElementById('res-total');
            const resNisab = document.getElementById('res-nisab');
            const resStatus = document.getElementById('res-status');
            const resValue = document.getElementById('res-value');

            if (resultBox) {
                resultBox.style.display = 'block';
                resTotal.innerText = totalWealth.toLocaleString() + ' ';
                resNisab.innerText = nisab.toLocaleString() + ' ';

                if (totalWealth >= nisab) {
                    // PASS
                    const zakatAmount = totalWealth * 0.025;
                    resStatus.innerText = "تجب عليك الزكاة";
                    resStatus.style.color = "#69f0ae";
                    resStatus.style.borderColor = "#69f0ae";
                    resValue.innerText = zakatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    resValue.parentElement.style.display = 'block';
                } else {
                    // FAIL
                    resStatus.innerText = "لا تجب عليك الزكاة (لم تبلغ النصاب)";
                    resStatus.style.color = "#ff6b35";
                    resStatus.style.borderColor = "#ff6b35";
                    resValue.innerText = "0";
                    resValue.parentElement.style.display = 'none';
                }
            }
        };

        window.resetZakat = function () {
            const els = ['z-cash', 'z-gold', 'z-silver', 'z-trade', 'z-debt'];
            els.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
            const res = document.getElementById('zakat-full-result');
            if (res) res.style.display = 'none';
        };

        window.calculateMawarith = function () {
            const estate = parseFloat(document.getElementById('m-estate').value) || 0;
            const debt = parseFloat(document.getElementById('m-debt').value) || 0;
            let net = estate - debt;
            if (net < 0) net = 0;

            const hasHusband = document.getElementById('m-husband').checked;
            const hasWife = document.getElementById('m-wife').checked;
            const hasFather = document.getElementById('m-father').checked;
            const hasMother = document.getElementById('m-mother').checked;
            const sons = parseInt(document.getElementById('m-sons').value) || 0;
            const daughters = parseInt(document.getElementById('m-daughters').value) || 0;
            const hasChildren = (sons + daughters) > 0;

            let results = [];
            let remaining = net;

            // 1. Fixed Shares (Ashab al-Furud)

            // Spouse
            if (hasHusband) {
                let share = hasChildren ? (remaining * 0.25) : (remaining * 0.5);
                results.push({ name: "الزوج", value: share, fraction: hasChildren ? "1/4" : "1/2" });
                remaining -= share;
            } else if (hasWife) {
                let share = hasChildren ? (remaining * 0.125) : (remaining * 0.25);
                results.push({ name: "الزوجة", value: share, fraction: hasChildren ? "1/8" : "1/4" });
                remaining -= share;
            }

            // Mother
            if (hasMother) {
                let share = hasChildren ? (net * (1 / 6)) : (net * (1 / 3));
                results.push({ name: "الأم", value: share, fraction: hasChildren ? "1/6" : "1/3" });
                remaining -= share;
            }

            // Father
            if (hasFather) {
                let share = hasChildren && sons > 0 ? (net * (1 / 6)) : 0; // If sons, Father gets fixed 1/6
                if (share > 0) {
                    results.push({ name: "الأب", value: share, fraction: "1/6" });
                    remaining -= share;
                }
            }

            if (remaining < 0) remaining = 0;

            // 2. Residuaries (Asaba)
            if (hasChildren) {
                // If children exist, they take the rest. If Father exists and no sons, Father is also Asaba.
                let totalParts = (sons * 2) + daughters;
                if (hasFather && sons == 0) totalParts += 0; // Father takes rest after others if no sons

                if (totalParts > 0) {
                    let partValue = remaining / totalParts;
                    if (sons > 0) results.push({ name: "لكل ابن", value: partValue * 2, fraction: "للذكر مثل حظ الأنثيين" });
                    if (daughters > 0) results.push({ name: "لكل ابنة", value: partValue, fraction: "للذكر مثل حظ الأنثيين" });
                    remaining = 0;
                }
            }

            // If No Children, Father takes the rest
            if (!hasChildren && hasFather) {
                results.push({ name: "الأب (باقي التركة)", value: remaining, fraction: "تعصيباً" });
                remaining = 0;
            }

            // Display
            document.getElementById('mawarith-result').style.display = 'block';
            document.getElementById('m-net').innerText = net.toLocaleString();
            const list = document.getElementById('heirs-list');
            list.innerHTML = '';
            results.forEach(res => {
                list.innerHTML += `<div style="display:flex; justify-content:space-between; border-bottom:1px solid #333;">
                    <span>${res.name} (${res.fraction})</span>
                    <span style="color:#69f0ae;">${res.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>`;
            });
            if (remaining > 0.01) {
                list.innerHTML += `<div style="display:flex; justify-content:space-between; color:#aaa;">
                    <span>فائض (يرد للورثة حسب المذهب)</span>
                    <span>${remaining.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>`;
            }
        };

        window.resetMawarith = function () {
            document.getElementById('m-estate').value = '';
            document.getElementById('m-debt').value = '';
            document.getElementById('m-sons').value = '0';
            document.getElementById('m-daughters').value = '0';
            document.getElementById('m-father').checked = false;
            document.getElementById('m-mother').checked = false;
            document.getElementById('mawarith-result').style.display = 'none';
        };


        window.updateDate = function () {
            const date = new Date();

            // Fixed Hijri Date Formatting (Islamic Umm al-Qura)
            const hijriOptions = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                calendar: 'islamic-umalqura',
                numberingSystem: 'latn'
            };
            const hijriFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-latn', hijriOptions);
            const hijri = hijriFormatter.format(date);

            // Gregorian Date Formatting
            const gregOptions = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            const gregFormatter = new Intl.DateTimeFormat('ar-EG', gregOptions);
            const gregorian = gregFormatter.format(date);

            const hEl = document.getElementById('hijri-date');
            const gEl = document.getElementById('gregorian-date');

            if (hEl) hEl.textContent = hijri + " هـ";
            if (gEl) gEl.textContent = gregorian + " م";
        };

        window.switchCalTab = function (tabId) {
            document.querySelectorAll('.cal-tab-content').forEach(c => c.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.getElementById('cal-' + tabId).classList.add('active');
            event.currentTarget.classList.add('active');
        };

        window.convertGtoH = function () {
            const gVal = document.getElementById('g-input').value;
            if (!gVal) return;
            const date = new Date(gVal);
            const options = { year: 'numeric', month: 'long', day: 'numeric', calendar: 'islamic' };
            const hijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', options).format(date);
            document.getElementById('h-result').innerText = hijri;
        };

        window.convertHtoG = function () {
            const d = parseInt(document.getElementById('h-day').value);
            const m = parseInt(document.getElementById('h-month').value);
            const y = parseInt(document.getElementById('h-year').value);
            if (!d || !m || !y) return;

            // Simplified Hijri to Julian to Gregorian
            const jd = Math.floor((11 * y + 3) / 30) + 354 * y + 30 * m - Math.floor((m - 1) / 2) + d + 1948440 - 385;
            let l = jd + 68569;
            let n = Math.floor((4 * l) / 146097);
            l = l - Math.floor((146097 * n + 3) / 4);
            let i = Math.floor((4000 * (l + 1)) / 1461001);
            l = l - Math.floor((1461 * i) / 4) + 31;
            let j = Math.floor((80 * l) / 2447);
            const day = l - Math.floor((2447 * j) / 80);
            l = Math.floor(j / 11);
            const month = j + 2 - 12 * l;
            const year = 100 * (n - 49) + i + l;

            const gDate = new Date(year, month - 1, day);
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            document.getElementById('g-result').innerText = new Intl.DateTimeFormat('ar-EG', options).format(gDate);
        };

        // Close modals on outside click
        window.onclick = function (event) {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = "none";
            }
        };

        // DATA - Forum topics from f73-montada (منتدى الصلاة على النبى) + f74-montada (محراب الأرواح) + Islamic topics
        const mainTopics = [
            { title: "صلوات الفاتح لما أغلق", icon: "fa-door-open", link: "https://nawasa-elbahr.yoo7.com/t13317-topic", desc: "اللهم صل على فاتح خزانة الذروة الكلية الربانية الإلهية القدسية" },
            { title: "كنوز الأسرار فى الصلاة على النبى المختار", icon: "fa-star-and-crescent", link: "https://nawasa-elbahr.yoo7.com/t13117-topic", desc: "كنوز وأسرار الصلاة على سيدنا محمد ﷺ" },
            { title: "خزينة صيغ الصلوات الصوفية", icon: "fa-gem", link: "https://nawasa-elbahr.yoo7.com/t13217-topic", desc: "صيغ الصلوات الصوفية على أشرف الخلائق الإنسانية والجانية" },
            { title: "القرآن الكريم", icon: "fa-quran", link: "https://nawasa-elbahr.yoo7.com/f1-montada", desc: "تلاوة وتفسير وتدبر آيات القرآن الكريم" },
            { title: "المنتدى الإسلامي", icon: "fa-mosque", link: "https://nawasa-elbahr.yoo7.com/f1-montada", desc: "المنتدى الإسلامي العام - أحاديث وفقه وعلوم شرعية" },
            { title: "منتدى الصلاة على النبي ﷺ", icon: "fa-hands-praying", link: "https://nawasa-elbahr.yoo7.com/f73-montada", desc: "الصلاة والسلام على خير الأنام سيدنا محمد ﷺ" },
            { title: "المنتدى العام", icon: "fa-comments", link: "https://nawasa-elbahr.yoo7.com/f11-montada", desc: "نقاشات عامة ومواضيع متنوعة لأعضاء المنتدى" },
            { title: "منتدى الإبداع", icon: "fa-lightbulb", link: "https://nawasa-elbahr.yoo7.com/f5-montada", desc: "إبداعات أدبية وشعرية ونثرية من أعضاء نوسا البحر" },
            { title: "المكتبة الشاملة", icon: "fa-book-open", link: "https://nawasa-elbahr.yoo7.com/f23-montada", desc: "تحميل الكتب والروايات والأعمال الأدبية" },
            { title: "مرتفعات سوناتا الكلام", icon: "fa-feather-pointed", link: "https://nawasa-elbahr.yoo7.com/f28-montada", desc: "شعر وقصائد ودواوين عربية وعالمية" },
            // محراب الأرواح - f74-montada
            { title: "إنجيل برنابا كامل النسخة الأصلية", icon: "fa-book-bible", link: "https://nawasa-elbahr.yoo7.com/t13529-topic", desc: "إنجيل برنابا كامل النسخة الأصلية قراءة مباشرة" },
            { title: "ولو ذقت من طعم المحبة ذرة", icon: "fa-heart", link: "https://nawasa-elbahr.yoo7.com/t13337-topic", desc: "ولو ذقت من طعم المحبة ذرة عذرت الذي أضحى قتيلا بحبنا" },
            { title: "أسألك بطاعة الأرواح الراجعة", icon: "fa-sun", link: "https://nawasa-elbahr.yoo7.com/t13321-topic", desc: "أسألك بطاعة الأرواح الراجعة إلى أجسادها وبطاعة الأجساد الملتئمة بعزتك" },
            { title: "ديوان شراب الوصل للإمام البرهانى", icon: "fa-wine-glass", link: "https://nawasa-elbahr.yoo7.com/t13146-topic", desc: "ديوان شراب الوصل للإمام فخر الدين السيد محمد عثمان عبده البرهانى" },
            { title: "صلوات محيى الدين ابن عربى", icon: "fa-pray", link: "https://nawasa-elbahr.yoo7.com/t13118-topic", desc: "صلوات محيى الدين ابن عربى - صلوات وأذكار روحانية" }
        ];

        // INIT FUNCTION
        function initMainScene() {
            const container = document.getElementById('webgl-container');
            const cssContainer = document.getElementById('css-container');

            // SCENE
            scene = new THREE.Scene();

            // CAMERA - positioned for optimal 3D tawaf view
            camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 6000);
            camera.position.set(0, 600, 1600);
            camera.lookAt(0, 120, 0); // Look at Kaaba center

            // WEBGL RENDERER (BG Stars & Kaaba)
            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.domElement.style.position = 'absolute';
            renderer.domElement.style.top = 0;
            renderer.domElement.style.zIndex = '0';
            container.appendChild(renderer.domElement);

            // CSS3D RENDERER (HTML Cards)
            cssRenderer = new THREE.CSS3DRenderer();
            cssRenderer.setSize(window.innerWidth, window.innerHeight);
            cssRenderer.domElement.style.position = 'absolute';
            cssRenderer.domElement.style.top = 0;
            cssRenderer.domElement.style.zIndex = '1';
            cssContainer.appendChild(cssRenderer.domElement);

            // CONTROLS
            controls = new THREE.OrbitControls(camera, cssRenderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.target.set(0, 120, 0); // Target the Kaaba center
            controls.maxPolarAngle = Math.PI / 2 - 0.05;
            controls.minPolarAngle = 0.3;
            controls.minDistance = 600;
            controls.maxDistance = 2500;

            // LIGHTS
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(ambientLight);
            const dirLight = new THREE.DirectionalLight(0xffd700, 0.8);
            dirLight.position.set(100, 300, 100);
            scene.add(dirLight);
            // Add a point light at the Kaaba for glow effect
            const kaabaGlow = new THREE.PointLight(0xffd700, 0.5, 1500);
            kaabaGlow.position.set(0, 200, 0);
            scene.add(kaabaGlow);

            // STARS
            createStars();

            // KAABA
            createKaaba();

            // CAROUSEL
            createCarousel();

            // EVENTS
            window.addEventListener('resize', onWindowResize);

            // Carousel Controls Listeners
            document.getElementById('btn-prev').addEventListener('click', () => rotateManual(1));
            document.getElementById('btn-next').addEventListener('click', () => rotateManual(-1));

            // Start Animation
            animate();

            // Loading Screen
            setTimeout(() => {
                const loader = document.getElementById('loading-screen');
                if (loader) loader.style.display = 'none';
            }, 1500);
        }

        // CREATE STARS
        function createStars() {
            const geom = new THREE.BufferGeometry();
            const counts = 2000;
            const pos = new Float32Array(counts * 3);
            for (let i = 0; i < counts * 3; i++) {
                pos[i] = (Math.random() - 0.5) * 4000;
            }
            geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 2 });
            const stars = new THREE.Points(geom, mat);
            scene.add(stars);
        }

        // CREATE KAABA
        function createKaaba() {
            kaabaGroup = new THREE.Group();

            // Cube
            const geometry = new THREE.BoxGeometry(200, 240, 200);
            const material = new THREE.MeshPhongMaterial({ color: 0x111111 });
            const cube = new THREE.Mesh(geometry, material);
            const edges = new THREE.LineSegments(
                new THREE.EdgesGeometry(geometry),
                new THREE.LineBasicMaterial({ color: 0xffd700 })
            );
            cube.add(edges);

            // Gold Band
            const bandGeo = new THREE.BoxGeometry(202, 40, 202);
            const bandMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
            const band = new THREE.Mesh(bandGeo, bandMat);
            band.position.y = 60;

            kaabaGroup.add(cube);
            kaabaGroup.add(band);
            kaabaGroup.position.y = 120; // Lift up

            // Floor Reflection
            const planeGeo = new THREE.PlaneGeometry(2000, 2000);
            const planeMat = new THREE.MeshBasicMaterial({
                color: 0x050a0c,
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide
            });
            const plane = new THREE.Mesh(planeGeo, planeMat);
            plane.rotation.x = Math.PI / 2;
            plane.position.y = 0;

            scene.add(kaabaGroup);
            scene.add(plane);
        }

        // CREATE CAROUSEL - 3D Tawaf (circumambulation) around the Kaaba
        function createCarousel() {
            carouselGroup = new THREE.Group();
            // The carousel group position is at origin (same as Kaaba base)
            // so the Kaaba is perfectly at the center of the carousel circle

            const totalCards = mainTopics.length;
            const angleStep = (Math.PI * 2) / totalCards;

            // Dynamic radius based on number of cards - ensure cards don't overlap
            carouselRadius = Math.max(600, totalCards * 55);

            mainTopics.forEach((topic, i) => {
                // DOM Element - Enhanced glassmorphism card
                const div = document.createElement('div');
                div.className = 'topic-card-3d';
                div.style.cssText = `
                    width: 280px;
                    height: 380px;
                    background: linear-gradient(145deg, rgba(10, 22, 40, 0.92), rgba(5, 15, 30, 0.95));
                    border: 2px solid rgba(255, 215, 0, 0.3);
                    border-radius: 25px;
                    box-shadow: 0 15px 40px rgba(0,0,0,0.5), 0 0 30px rgba(255,215,0,0.1), inset 0 0 60px rgba(255,215,0,0.02);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    color: #fff;
                    padding: 25px 20px;
                    cursor: pointer;
                    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                    position: relative;
                    overflow: hidden;
                    backdrop-filter: blur(10px);
                `;

                // Create glowing border effect
                const conicDeg = (i / totalCards) * 360;
                const glowBorder = document.createElement('div');
                glowBorder.style.cssText = `
                    position: absolute; top: -1px; left: -1px; right: -1px; bottom: -1px;
                    border-radius: 25px;
                    background: conic-gradient(from ${conicDeg}deg, transparent, rgba(255,215,0,0.3), transparent, rgba(255,215,0,0.1), transparent);
                    z-index: -1; opacity: 0; transition: opacity 0.5s;
                `;
                div.appendChild(glowBorder);

                // Card number badge
                const badge = document.createElement('div');
                badge.style.cssText = `
                    position: absolute; top: 12px; right: 12px;
                    width: 30px; height: 30px; border-radius: 50%;
                    background: rgba(255,215,0,0.15); border: 1px solid rgba(255,215,0,0.4);
                    display: flex; align-items: center; justify-content: center;
                    font-family: 'Amiri'; font-size: 13px; color: #ffd700;
                `;
                badge.textContent = (i + 1);
                div.appendChild(badge);

                // Main content
                const descText = topic.desc || 'اضغط للدخول';
                div.innerHTML += `
                    <div style="position:relative; margin-bottom:15px; perspective:800px;">
                        <div style="
                            width:80px; height:80px;
                            background: radial-gradient(circle, rgba(255,215,0,0.15), rgba(10,22,40,0.8));
                            border: 2px solid rgba(255,215,0,0.4);
                            border-radius: 50%;
                            display:flex; align-items:center; justify-content:center;
                            box-shadow: 0 0 30px rgba(255,215,0,0.2), inset 0 0 20px rgba(255,215,0,0.05);
                            transition: all 0.6s cubic-bezier(0.23,1,0.32,1);
                        " class="card-icon-wrap">
                            <i class="fas ${topic.icon}" style="font-size: 36px; color: #ffd700; filter: drop-shadow(0 0 12px rgba(255,215,0,0.5)); transition: all 0.5s;"></i>
                        </div>
                    </div>
                    <h3 style="font-family: 'Aref Ruqaa'; font-size: 19px; margin-bottom: 10px; color: #ffd700;
                        line-height: 1.5; text-shadow: 0 2px 10px rgba(255,215,0,0.3); transition: all 0.3s;
                        display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${topic.title}</h3>
                    <p style="font-family: 'Amiri'; font-size: 13px; color: rgba(255,255,255,0.6); line-height:1.6;
                        display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;
                        margin-bottom: 12px; transition: all 0.3s;">${descText}</p>
                    <div style="
                        display:inline-flex; align-items:center; gap:6px;
                        padding: 7px 18px;
                        border: 1px solid rgba(255,215,0,0.3);
                        border-radius: 20px;
                        color: #ffd700;
                        font-family: 'Amiri'; font-size: 12px;
                        transition: all 0.3s;
                    " class="card-read-btn">
                        <i class="fas fa-external-link-alt"></i> اقرأ المزيد
                    </div>
                `;

                // Bottom glow line
                const bottomGlow = document.createElement('div');
                bottomGlow.style.cssText = `
                    position: absolute; bottom: 0; left: 10%; right: 10%;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, rgba(255,215,0,0.5), transparent);
                    opacity: 0; transition: opacity 0.5s;
                `;
                div.appendChild(bottomGlow);

                div.addEventListener('click', () => window.open(topic.link, '_blank'));
                div.addEventListener('mouseenter', () => {
                    isAutoRotating = false;
                    div.style.borderColor = '#ffd700';
                    div.style.background = 'linear-gradient(145deg, rgba(15, 28, 50, 0.98), rgba(8, 18, 35, 0.99))';
                    div.style.boxShadow = '0 20px 60px rgba(0,0,0,0.6), 0 0 50px rgba(255,215,0,0.25), inset 0 0 80px rgba(255,215,0,0.03)';
                    glowBorder.style.opacity = '1';
                    bottomGlow.style.opacity = '1';
                    const iconWrap = div.querySelector('.card-icon-wrap');
                    if (iconWrap) {
                        iconWrap.style.transform = 'rotateY(180deg) scale(1.1)';
                        iconWrap.style.boxShadow = '0 0 40px rgba(255,215,0,0.4)';
                    }
                    const readBtn = div.querySelector('.card-read-btn');
                    if (readBtn) {
                        readBtn.style.background = 'rgba(255,215,0,0.15)';
                        readBtn.style.borderColor = '#ffd700';
                    }
                });
                div.addEventListener('mouseleave', () => {
                    isAutoRotating = true;
                    div.style.borderColor = 'rgba(255, 215, 0, 0.3)';
                    div.style.background = 'linear-gradient(145deg, rgba(10, 22, 40, 0.92), rgba(5, 15, 30, 0.95))';
                    div.style.boxShadow = '0 15px 40px rgba(0,0,0,0.5), 0 0 30px rgba(255,215,0,0.1), inset 0 0 60px rgba(255,215,0,0.02)';
                    glowBorder.style.opacity = '0';
                    bottomGlow.style.opacity = '0';
                    const iconWrap = div.querySelector('.card-icon-wrap');
                    if (iconWrap) {
                        iconWrap.style.transform = 'rotateY(0deg) scale(1)';
                        iconWrap.style.boxShadow = '0 0 30px rgba(255,215,0,0.2), inset 0 0 20px rgba(255,215,0,0.05)';
                    }
                    const readBtn = div.querySelector('.card-read-btn');
                    if (readBtn) {
                        readBtn.style.background = 'transparent';
                        readBtn.style.borderColor = 'rgba(255, 215, 0, 0.3)';
                    }
                });

                // CSS3D Object - position on the circle around the Kaaba
                const obj = new THREE.CSS3DObject(div);
                const angle = i * angleStep;
                // Position cards in a circle centered at origin (where the Kaaba is)
                // y=120 matches the Kaaba center height
                obj.position.set(
                    Math.sin(angle) * carouselRadius,
                    120,
                    Math.cos(angle) * carouselRadius
                );
                // Make each card face outward from the Kaaba center
                obj.lookAt(new THREE.Vector3(0, 120, 0));
                obj.rotateY(Math.PI); // Flip to face outward

                // Add slight vertical offset variation for visual interest
                obj.position.y += Math.sin(i * 0.8) * 15;

                carouselGroup.add(obj);
            });

            // Add a glowing ring on the floor to show the orbit path
            const ringGeo = new THREE.RingGeometry(carouselRadius - 8, carouselRadius + 8, 128);
            const ringMat = new THREE.MeshBasicMaterial({
                color: 0xffd700,
                transparent: true,
                opacity: 0.12,
                side: THREE.DoubleSide
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = -Math.PI / 2;
            ring.position.y = 1; // Just above the floor
            scene.add(ring);

            // Add a second thinner ring for glow effect
            const ringGeo2 = new THREE.RingGeometry(carouselRadius - 2, carouselRadius + 2, 128);
            const ringMat2 = new THREE.MeshBasicMaterial({
                color: 0xffd700,
                transparent: true,
                opacity: 0.25,
                side: THREE.DoubleSide
            });
            const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
            ring2.rotation.x = -Math.PI / 2;
            ring2.position.y = 2;
            scene.add(ring2);

            scene.add(carouselGroup);
        }

        // UPDATE CAROUSEL POSITIONS (Responsive)
        function updateCarouselPermissions() {
            if (!carouselGroup) return;

            const totalCards = carouselGroup.children.length;
            // Dynamic radius based on card count
            carouselRadius = Math.max(600, totalCards * 55);

            const angleStep = (Math.PI * 2) / totalCards;

            carouselGroup.children.forEach((obj, i) => {
                const angle = i * angleStep;
                // Position centered around Kaaba (origin), y=120 is Kaaba center height
                obj.position.set(
                    Math.sin(angle) * carouselRadius,
                    120 + Math.sin(i * 0.8) * 15,
                    Math.cos(angle) * carouselRadius
                );
                // Face outward from Kaaba center
                obj.lookAt(new THREE.Vector3(0, 120, 0));
                obj.rotateY(Math.PI);
            });
        }

        // ANIMATION LOOP
        function animate() {
            requestAnimationFrame(animate);

            if (isAutoRotating) {
                targetRotation += 0.0008; // Gentle tawaf rotation speed
            }

            // Smooth interpolation (Lerp)
            carouselGroup.rotation.y += (targetRotation - carouselGroup.rotation.y) * 0.04;
            carouselAngle = carouselGroup.rotation.y;

            // Subtle Kaaba bobbing animation
            if (kaabaGroup) {
                kaabaGroup.position.y = 120 + Math.sin(Date.now() * 0.001) * 3;
            }

            controls.update();
            renderer.render(scene, camera);
            cssRenderer.render(scene, camera);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            cssRenderer.setSize(window.innerWidth, window.innerHeight);

            // Update Carousel Layout
            updateCarouselPermissions();
        }

        // CAROUSEL CONTROLS
        window.rotateManual = function (dir) {
            isAutoRotating = false;
            targetRotation += dir * (Math.PI / 4);
            setTimeout(() => isAutoRotating = true, 5000);
        };

        // RSS FEED FETCHING
        async function fetchRSS() {
            const rssUrl = 'https://nawasa-elbahr.yoo7.com/rss';
            // Use allorigins as CORS proxy
            const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(rssUrl);
            const contentDiv = document.getElementById('rss-content');

            contentDiv.innerHTML = '<div style="text-align:center; color:#ffd700; margin-top: 50px;"><i class="fas fa-circle-notch fa-spin" style="font-size: 40px;"></i><p>جاري تحميل المواضيع...</p></div>';

            try {
                const response = await fetch(proxyUrl);
                if (!response.ok) throw new Error('Network response was not ok');

                const str = await response.text();
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(str, "text/xml");
                const items = xmlDoc.querySelectorAll("item");

                let html = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">';

                items.forEach(item => {
                    const title = item.querySelector("title")?.textContent || "بدون عنوان";
                    const link = item.querySelector("link")?.textContent || "#";
                    // description often contains HTML, let's strip or show brief
                    let desc = item.querySelector("description")?.textContent || "";
                    // Remove HTML tags for preview using regex or temp div
                    const tempDiv = document.createElement("div");
                    tempDiv.innerHTML = desc;
                    const textDesc = tempDiv.textContent.substring(0, 100) + '...';

                    html += `
                        <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 215, 0, 0.3); border-radius: 10px; padding: 15px; transition: all 0.3s; cursor: pointer;" 
                             onmouseover="this.style.background='rgba(255, 215, 0, 0.1)'" 
                             onmouseout="this.style.background='rgba(255, 255, 255, 0.05)'"
                             onclick="window.open('${link}', '_blank')">
                            <h3 style="font-family: 'Aref Ruqaa'; color: #ffd700; margin-bottom: 10px; font-size: 18px;">${title}</h3>
                            <p style="font-family: 'Amiri'; color: #ddd; font-size: 14px;">${textDesc}</p>
                            <span style="display: block; margin-top: 10px; color: #69f0ae; font-size: 12px;">اقرأ المزيد <i class="fas fa-arrow-left"></i></span>
                        </div>
                    `;
                });

                html += '</div>';
                contentDiv.innerHTML = html;

            } catch (error) {
                console.error("RSS Fetch Error:", error);
                contentDiv.innerHTML = `
                    <div style="text-align: center; margin-top: 50px;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 40px; color: #ff6b6b;"></i>
                        <p style="margin-top: 15px; color: #ff6b6b;">عذراً، تعذر تحميل الأخبار حالياً.<br>تأكد من اتصالك بالإنترنت.</p>
                        <button class="calc-btn" onclick="fetchRSS()" style="width: auto; padding: 10px 30px; margin-top: 20px;">إعادة المحاولة</button>
                    </div>
                `;
            }
        }


        // ==========================
        // TOOLS & MODALS LOGIC
        // ==========================

        window.openModal = function (id) {
            const m = document.getElementById(id);
            if (m) {
                if (m.classList.contains('radial-modal')) {
                    m.style.display = 'flex';
                } else {
                    m.style.display = 'block';
                }
                setTimeout(() => {
                    m.classList.add('show');
                    // Special behavior for specific modals
                    if (id === 'prayer-modal') fetchPrayerTimes();
                }, 10);
            }
        };

        // Prayer Times Fetcher
        async function fetchPrayerTimes() {
            const container = document.getElementById('prayer-times-container');
            const hijriDateBox = document.getElementById('prayer-date-hijri');
            if (!container) return;

            try {
                const response = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt&method=5'); // Method 5 = Egyptian General Authority of Survey
                const data = await response.json();

                if (data.code === 200) {
                    const timings = data.data.timings;
                    const hijri = data.data.date.hijri;

                    if (hijriDateBox) {
                        hijriDateBox.innerText = `${hijri.day} ${hijri.month.ar} ${hijri.year} هـ`;
                    }

                    const prayerNames = {
                        'Fajr': 'الفجر',
                        'Sunrise': 'الشروق',
                        'Dhuhr': 'الظهر',
                        'Asr': 'العصر',
                        'Maghrib': 'المغرب',
                        'Isha': 'العشاء'
                    };

                    let html = '';
                    const desiredPrayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

                    desiredPrayers.forEach(p => {
                        html += `
                            <div class="prayer-card">
                                <span class="prayer-name">${prayerNames[p]}</span>
                                <span class="prayer-time">${timings[p]}</span>
                            </div>
                        `;
                    });

                    container.innerHTML = html;
                } else {
                    throw new Error('API Error');
                }
            } catch (error) {
                console.error("Prayer Times Fetch Error:", error);
                container.innerHTML = '<div class="prayer-loading">عذراً، تعذر تحميل المواقيت. حاول مرة أخرى.</div>';
            }
        }

        window.closeModal = function (id) {
            const m = document.getElementById(id);
            if (m) {
                m.classList.remove('show');
                setTimeout(() => {
                    m.style.display = 'none';
                    if (id === 'iframe-modal' || id === 'radio-modal') {
                        // Stop audio/iframe if needed
                        const audio = m.querySelector('audio');
                        if (audio) audio.pause();
                        const iframe = m.querySelector('iframe');
                        if (iframe && id === 'iframe-modal') iframe.src = '';
                    }
                }, 300);
            }
        };

        // Initialize Tools Button
        const toolsBtn = document.getElementById('tools-btn');
        if (toolsBtn) {
            toolsBtn.addEventListener('click', () => {
                openModal('dashboard-modal');
            });
        }

        // Zakat Logic
        window.calculateZakat = function () {
            const cash = parseFloat(document.getElementById('zakat-cash').value) || 0;
            const gold = parseFloat(document.getElementById('zakat-gold').value) || 0;
            const goldPrice = 2800;
            const total = cash + (gold * goldPrice);
            const nisab = 85 * goldPrice;
            const res = document.getElementById('zakat-result');
            res.style.display = 'block';

            if (total >= nisab) {
                res.innerHTML = `زكاتك: ${(total * 0.025).toLocaleString()} جنيه`;
                res.style.color = '#00e676';
            } else {
                res.innerHTML = "لم يبلغ النصاب";
                res.style.color = '#ff9100';
            }
        };

        // Tasbih Logic
        let count = 0;
        window.incTasbih = function () {
            count++;
            document.getElementById('tasbih-counter').innerText = count;
        };
        window.resetTasbih = function () {
            count = 0;
            document.getElementById('tasbih-counter').innerText = 0;
        };


        // IFrame Helper
        window.create3DIFrame = function (url) {
            window.open(url, '_blank');
        };

        // SCROLL HANDLER FOR CAROUSEL CONTROLS
        window.addEventListener('scroll', () => {
            const controls = document.getElementById('carousel-controls');
            if (controls) {
                if (window.scrollY > 300) {
                    controls.style.opacity = '0';
                    controls.style.pointerEvents = 'none';
                } else {
                    controls.style.opacity = '1';
                    // Keep pointer-events: none for container, but children (buttons) are auto
                    // So we don't strictly need to toggle pointerEvents on container if children handle it,
                    // but setting opacity is good. We can set pointer-events: none to be safe.
                    // But wait, our CSS says #carousel-controls { pointer-events: none; } permanently.
                    // So we just toggle opacity.
                }
            }
        });

        // INITIALIZE APP
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initMainScene);
        } else {
            initMainScene();
        }
