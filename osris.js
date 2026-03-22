// إعدادات اللعبة 
        const TOTAL_PARTS = 14;
        let collectedParts = 0;
        let killCount = 0;
        let isWinning = false;
        let isShowingPart = false;
        let playerHealth = 100;
        let legR, legL; // أرجل إيزيس للتحريك
        let monstersEnabled = false; // المسوخ مخفية افتراضياً
        let currentWeapon = 'ankh'; // السلاح الحالي: ankh أو sword
        let snakeMonsters = [];
        let bodyPartModels = [];
        let activeCollection = null;
        let isUnderworld = false;
        let isModernTimes = false;
        let modernNusaGroup = new THREE.Group();
        let osirisStoryteller = null;
        let magicWordsInterval = null;
        let timePortals = [];
        const MODERN_OFFSET_X = 15000;
        const MODERN_OFFSET_Z = 15000;
        const soulTrailParticles = [];
        const ankhProjectiles = []; // قذائف مفتاح الحياة (الأشعة السحرية)

        let boss = { active: false, mesh: null, health: 100, maxHealth: 100, phase: 1, lastHit: 0 };

        // إعداد المشهد الأساسي
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87CEEB);
        scene.fog = new THREE.FogExp2(0x87CEEB, 0.002);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        let manualCamAngle = 0; // زاوية دوران الكاميرا يدوياً
        let manualCamY = 0;     // تعديل الارتفاع يدوياً

        window.rotateCameraManual = function (val) { manualCamAngle += val; };
        window.setCameraView = function (view) {
            if (view === 'top') { manualCamY = 150; manualCamAngle = Math.PI; }
            else { manualCamY = 0; manualCamAngle = 0; }
        };

        const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = false;
        document.body.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xdc8874, 0.8); scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffeedd, 1.2);
        dirLight.position.set(200, 400, 200); dirLight.castShadow = false;
        scene.add(dirLight);

        // --- مولد خريطة نوسا البحر الواقعية ---
        const mapCanvas = document.createElement('canvas');
        mapCanvas.width = 2048; mapCanvas.height = 2048;
        const mapCtx = mapCanvas.getContext('2d');

        function drawRealMap() {
            // 1. أراضي زراعية وحقول خضراء
            mapCtx.fillStyle = '#4CAF50'; mapCtx.fillRect(0, 0, 2048, 2048);

            for (let i = 0; i < 600; i++) {
                mapCtx.fillStyle = Math.random() > 0.5 ? '#388E3C' : '#8BC34A';
                mapCtx.beginPath();
                mapCtx.arc(Math.random() * 2048, Math.random() * 2048, Math.random() * 20 + 10, 0, Math.PI * 2);
                mapCtx.fill();
            }

            // 2. نهر النيل - محاذاة دقيقة مع الموقع العالمي (X = -150)
            // (-150 + 1250) * (2048/2500) = 901
            const nileX = 901;
            mapCtx.strokeStyle = '#1ca3ec'; mapCtx.lineWidth = 140;
            mapCtx.beginPath(); mapCtx.moveTo(nileX, 0); mapCtx.lineTo(nileX, 2048); mapCtx.stroke();

            // ضفتي النهر
            mapCtx.strokeStyle = '#5d4037'; mapCtx.lineWidth = 20;
            mapCtx.beginPath(); mapCtx.moveTo(nileX - 70, 0); mapCtx.lineTo(nileX - 70, 2048); mapCtx.stroke();
            mapCtx.beginPath(); mapCtx.moveTo(nileX + 70, 0); mapCtx.lineTo(nileX + 70, 2048); mapCtx.stroke();

            // 3. ممرات فرعونية
            mapCtx.fillStyle = '#b8a888';
            mapCtx.fillRect(1100, 0, 150, 2048);
            mapCtx.fillRect(0, 950, 2048, 150);

            // 4. كتابة النصوص
            mapCtx.fillStyle = '#FFD700'; mapCtx.font = 'bold 80px "Aref Ruqaa", serif'; mapCtx.textAlign = 'center';
            mapCtx.shadowColor = '#000'; mapCtx.shadowBlur = 10;
            mapCtx.fillText('نهر النيل (نوسا البحر)', nileX, 400);
            mapCtx.fillText('مدينة نوسا البحر', 1400, 1150);
            mapCtx.font = '900 60px "Font Awesome 6 Free", serif';
            mapCtx.fillText('\uf641 \uf06e \uf641', nileX, 600);
        }
        drawRealMap();

        // خامات اللعبة (Retro Style - Flat Shading)
        const retroMapTex = new THREE.CanvasTexture(mapCanvas);
        retroMapTex.magFilter = THREE.NearestFilter; // Pixelated blocky texture look

        // أرضية فرعونية زراعية إبداعية ثلاثية الأبعاد
        function createPharaonicFloor() {
            const c = document.createElement('canvas'); c.width = 1024; c.height = 1024;
            const ctx = c.getContext('2d');

            // 1. أراضي زراعية وحقول خضراء
            ctx.fillStyle = '#4CAF50'; ctx.fillRect(0, 0, 1024, 1024);
            // توزيع المحاصيل (نقاط خضراء داكنة وفاتحة)
            for (let i = 0; i < 1000; i++) {
                ctx.fillStyle = Math.random() > 0.5 ? '#388E3C' : '#8BC34A';
                ctx.beginPath();
                ctx.arc(Math.random() * 1024, Math.random() * 1024, Math.random() * 4 + 2, 0, Math.PI * 2);
                ctx.fill();
            }

            // 2. شبكة الترع والقنوات المائية التي تغذي الحقول
            ctx.strokeStyle = '#1ca3ec'; ctx.lineWidth = 12;
            for (let i = 128; i < 1024; i += 256) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 1024); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(1024, i); ctx.stroke();
            }

            // 3. ممرات فرعونية من الحجر الرملي تتقاطع مع الحقول
            ctx.fillStyle = '#b8a888';
            ctx.fillRect(380, 0, 264, 1024); // ممر رأسي
            ctx.fillRect(0, 380, 1024, 264); // ممر أفقي

            ctx.strokeStyle = '#8c7d61'; ctx.lineWidth = 6;
            ctx.strokeRect(380, 0, 264, 1024);
            ctx.strokeRect(0, 380, 1024, 264);

            // تقسيم الممرات الفروعنية المبلطة
            ctx.lineWidth = 3;
            for (let i = 0; i < 1024; i += 66) {
                ctx.beginPath(); ctx.moveTo(380, i); ctx.lineTo(644, i); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(i, 380); ctx.lineTo(i, 644); ctx.stroke();
            }

            // 4. كتابة "نوسا البحر" بشكل إبداعي عملاق على الأراضي الزراعية والممرات
            ctx.save();
            ctx.translate(512, 512);
            ctx.rotate(-Math.PI / 4); // دوران قطري إبداعي

            // ظل ذهبي متوهج ونقش عريض
            ctx.shadowColor = '#000'; ctx.shadowBlur = 15;
            ctx.fillStyle = '#FFD700';

            ctx.font = 'bold 100px "Aref Ruqaa", serif';
            ctx.textAlign = 'center';
            ctx.fillText('نوسا البحر', 0, -180);

            ctx.font = 'bold 80px "Aref Ruqaa", serif';
            ctx.fillText('عاصمة أوزوريس', 0, 240);

            ctx.font = '900 70px "Font Awesome 6 Free", "Segoe UI Symbol", serif';
            ctx.fillText('☥ ☥ ☥', 0, 40);
            ctx.restore();

            const tex = new THREE.CanvasTexture(c);
            tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(12, 12); // تكرار النمط 12 مرة لتكون الكلمات ضخمة وواضحة جداً أثناء اللعب (كل مربع سيكون حوالي 200 وحدة باللعبة)
            return new THREE.MeshPhongMaterial({ map: tex });
        }
        let groundMat;

        const retroStone = new THREE.MeshPhongMaterial({ color: 0xd4c4a8, flatShading: true });
        const retroDarkStone = new THREE.MeshPhongMaterial({ color: 0x5a5a5a, flatShading: true });
        const retroGold = new THREE.MeshPhongMaterial({ color: 0xFFD700, flatShading: true });
        const retroSkin = new THREE.MeshPhongMaterial({ color: 0xd2a679, flatShading: true });
        const retroCloth = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true });
        const retroHair = new THREE.MeshPhongMaterial({ color: 0x111111, flatShading: true });
        const retroBlue = new THREE.MeshPhongMaterial({ color: 0x1e90ff, flatShading: true, side: THREE.DoubleSide });

        const groundSize = 2500;
        let ground, river;

        // ضفتي النيل
        const bankMat = new THREE.MeshPhongMaterial({ color: 0x8B6914, flatShading: true });
        const bankR = new THREE.Mesh(new THREE.BoxGeometry(20, 3, groundSize), bankMat);
        bankR.position.set(-150 + 90, 1.5, 0); scene.add(bankR);
        const bankL = new THREE.Mesh(new THREE.BoxGeometry(20, 3, groundSize), bankMat);
        bankL.position.set(-150 - 90, 1.5, 0); scene.add(bankL);
        // زورق فرعوني (يظهر عند عبور النيل)
        const boatGroup = new THREE.Group();
        const boatHull = new THREE.Mesh(new THREE.BoxGeometry(6, 1.5, 14), new THREE.MeshPhongMaterial({ color: 0x8B4513 }));
        boatHull.position.y = 0.7; boatGroup.add(boatHull);
        const boatBow = new THREE.Mesh(new THREE.ConeGeometry(3, 5, 4), new THREE.MeshPhongMaterial({ color: 0x8B4513 }));
        boatBow.position.set(0, 1, 8); boatBow.rotation.x = Math.PI / 2; boatGroup.add(boatBow);
        const boatMast = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 12, 8), new THREE.MeshPhongMaterial({ color: 0xA0522D }));
        boatMast.position.set(0, 7, 0); boatGroup.add(boatMast);
        const boatSail = new THREE.Mesh(new THREE.BoxGeometry(6, 8, 0.2), new THREE.MeshPhongMaterial({ color: 0xFAF0E6, side: THREE.DoubleSide }));
        boatSail.position.set(0, 8, 0); boatGroup.add(boatSail);
        boatGroup.visible = false;
        scene.add(boatGroup);
        let isOnBoat = false;

        // --- خامة نقش عرش تانيس بالخط العربي الإبداعي ---
        const inscriptionCanvas = document.createElement('canvas');
        inscriptionCanvas.width = 512; inscriptionCanvas.height = 256;
        const iCtx = inscriptionCanvas.getContext('2d');
        iCtx.fillStyle = '#5a5a5a'; iCtx.fillRect(0, 0, 512, 256);
        iCtx.strokeStyle = '#333'; iCtx.lineWidth = 4;
        for (let i = 0; i < 10; i++) { iCtx.beginPath(); iCtx.moveTo(0, i * 25); iCtx.lineTo(512, i * 25); iCtx.stroke(); }
        iCtx.fillStyle = '#FFD700'; iCtx.font = 'bold 36px "Aref Ruqaa", "Noto Sans Egyptian Hieroglyphs"'; iCtx.textAlign = 'center';
        iCtx.shadowColor = '#000'; iCtx.shadowBlur = 4;
        iCtx.fillText('مدينة نوسا الفرعونية', 256, 100);
        iCtx.fillText('عاصمة المملكة المصرية', 256, 160);
        const inscriptionTex = new THREE.CanvasTexture(inscriptionCanvas);
        inscriptionTex.magFilter = THREE.NearestFilter;
        const inscriptionMat = new THREE.MeshPhongMaterial({ map: inscriptionTex, flatShading: true });

        const structuralSites = [];
        const colliders = []; // مصفوفة لتخزين الحواجز (المباني) لمنع مرور إيزيس خلالها

        // معابد نينتندو (Blocky Temples) مع تماثيل رمسيس/تانيس الضخمة
        function createBlockyTemple(x, z) {
            const g = new THREE.Group();
            // Pylons
            const pylonRight = new THREE.Mesh(new THREE.BoxGeometry(20, 40, 15), retroStone); pylonRight.position.set(25, 20, 0); g.add(pylonRight);
            const pylonLeft = new THREE.Mesh(new THREE.BoxGeometry(20, 40, 15), retroStone); pylonLeft.position.set(-25, 20, 0); g.add(pylonLeft);
            // Gate
            const gate = new THREE.Mesh(new THREE.BoxGeometry(30, 8, 10), retroStone); gate.position.set(0, 36, 0); g.add(gate);

            // تماثيل رمسيس العظيمة (تانيس ستايل)
            const statGeoBase = new THREE.BoxGeometry(14, 8, 16); // قاعدة أعرض
            const statGeoLegs = new THREE.BoxGeometry(10, 12, 12); // الركبتين والساقين
            const statGeoTorso = new THREE.CylinderGeometry(4, 5, 15, 6); // جذع مفصل
            const statGeoHead = new THREE.BoxGeometry(6, 8, 7); // وجه مخيف/مهيب

            for (let sx of [15, -15]) {
                const sG = new THREE.Group();
                // القاعدة المنقوشة بـ نوسا
                const mats = [retroDarkStone, retroDarkStone, retroDarkStone, retroDarkStone, inscriptionMat, retroDarkStone];
                const b = new THREE.Mesh(statGeoBase, mats); b.position.y = 4; sG.add(b);
                // الساقين
                const l = new THREE.Mesh(statGeoLegs, retroDarkStone); l.position.set(0, 14, 0); sG.add(l);
                // الجذع
                const t = new THREE.Mesh(statGeoTorso, retroDarkStone); t.position.set(0, 26, -2); sG.add(t);
                // الرأس واللحية الفرعونية
                const h = new THREE.Mesh(statGeoHead, retroGold); h.position.set(0, 36, -1); sG.add(h);
                const beard = new THREE.Mesh(new THREE.ConeGeometry(1, 4, 4), retroGold); beard.position.set(0, 31, 2); beard.rotation.x = Math.PI; sG.add(beard);
                // غطاء النمس الجانبي الأعرض
                const nemes = new THREE.Mesh(new THREE.BoxGeometry(10, 8, 4), retroBlue); nemes.position.set(0, 35, -2); sG.add(nemes);

                sG.position.set(sx, 0, 15); g.add(sG);
            }

            g.position.set(x, 0, z); scene.add(g);
            structuralSites.push(new THREE.Vector3(x, 5, z - 20));
            colliders.push({ x: x, z: z, r: 35 }); // حاجز اصطدام المعبد
        }

        for (let i = 0; i < 8; i++) {
            createBlockyTemple((Math.random() - 0.5) * 1800, (Math.random() - 0.5) * 1800);
        }

        // أهرامات Low Poly مع نقش "نوسا البحر"
        // إنشاء خامة نقش الأهرامات
        function createPyramidTexture() {
            const c = document.createElement('canvas'); c.width = 512; c.height = 512;
            const ctx = c.getContext('2d');
            ctx.fillStyle = '#d4c4a8'; ctx.fillRect(0, 0, 512, 512);
            // خطوط الطوب
            ctx.strokeStyle = '#b8a888'; ctx.lineWidth = 2;
            for (let y = 0; y < 512; y += 25) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke(); }
            // كتابة "نوسا البحر" بخط فرعوني
            ctx.fillStyle = '#FFD700'; ctx.font = 'bold 48px "Aref Ruqaa", serif'; ctx.textAlign = 'center';
            ctx.shadowColor = '#000'; ctx.shadowBlur = 6;
            ctx.fillText('نوسا البحر', 256, 200);
            ctx.fillText('☥ ☥ ☥', 256, 280);
            ctx.font = 'bold 32px "Aref Ruqaa", serif';
            ctx.fillText('عاصمة أوزوريس', 256, 350);
            // رموز فرعونية
            ctx.font = '900 40px "Font Awesome 6 Free", "Segoe UI Symbol", serif';
            ctx.fillText('☥  ☥', 256, 430);
            const tex = new THREE.CanvasTexture(c); tex.magFilter = THREE.NearestFilter;
            return new THREE.MeshPhongMaterial({ map: tex, flatShading: true });
        }
        const pyramidMat = createPyramidTexture();
        for (let i = 0; i < 6; i++) {
            const size = 100 + Math.random() * 100;
            const pyrk = new THREE.Mesh(new THREE.ConeGeometry(size, size * 1.5, 4), pyramidMat);
            pyrk.position.set((Math.random() - 0.5) * 2200, size * 0.75, (Math.random() - 0.5) * 2200);
            pyrk.rotation.y = Math.PI / 4; scene.add(pyrk);
            colliders.push({ x: pyrk.position.x, z: pyrk.position.z, r: size * 0.5 + 5 }); // حاجز الهرم
        }

        // === بيئة فرعونية إضافية ===
        // مسلات مصرية مع نقش "نوسا البحر"
        function createObeliskTexture() {
            const c = document.createElement('canvas'); c.width = 256; c.height = 1024;
            const ctx = c.getContext('2d');
            ctx.fillStyle = '#d4c4a8'; ctx.fillRect(0, 0, 256, 1024);
            // نقوش أفقية
            ctx.strokeStyle = '#b8a888'; ctx.lineWidth = 1;
            for (let y = 0; y < 1024; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(256, y); ctx.stroke(); }
            // كتابة عمودية
            ctx.fillStyle = '#FFD700'; ctx.font = 'bold 36px "Aref Ruqaa", serif';
            ctx.textAlign = 'center'; ctx.shadowColor = '#000'; ctx.shadowBlur = 4;
            ctx.save(); ctx.translate(128, 100);
            ctx.fillText('ن', 0, 0);
            ctx.fillText('و', 0, 60);
            ctx.fillText('س', 0, 120);
            ctx.fillText('ا', 0, 180);
            ctx.font = '900 36px "Font Awesome 6 Free", "Segoe UI Symbol", serif';
            ctx.fillText('☥', 0, 250);
            ctx.font = 'bold 36px "Aref Ruqaa", serif';
            ctx.fillText('ا', 0, 320);
            ctx.fillText('ل', 0, 380);
            ctx.fillText('ب', 0, 440);
            ctx.fillText('ح', 0, 500);
            ctx.fillText('ر', 0, 560);
            ctx.restore();
            // رموز هيروغليفية
            ctx.font = '900 28px "Font Awesome 6 Free", "Segoe UI Symbol", serif';
            ctx.fillText('☥ ', 128, 800);
            ctx.fillText('☀️ ', 128, 860);
            const tex = new THREE.CanvasTexture(c); tex.magFilter = THREE.NearestFilter;
            return new THREE.MeshPhongMaterial({ map: tex, flatShading: true });
        }
        const obeliskMat = createObeliskTexture();
        for (let i = 0; i < 10; i++) {
            const oG = new THREE.Group();
            const oBase = new THREE.Mesh(new THREE.BoxGeometry(8, 4, 8), retroDarkStone); oBase.position.y = 2; oG.add(oBase);
            const oBody = new THREE.Mesh(new THREE.BoxGeometry(4, 40, 4), obeliskMat); oBody.position.y = 24; oG.add(oBody);
            const oTip = new THREE.Mesh(new THREE.ConeGeometry(3, 6, 4), retroGold); oTip.position.y = 47; oTip.rotation.y = Math.PI / 4; oG.add(oTip);
            oG.position.set((Math.random() - 0.5) * 2000, 0, (Math.random() - 0.5) * 2000);
            scene.add(oG);
            colliders.push({ x: oG.position.x, z: oG.position.z, r: 8 }); // حاجز المسلة
        }
        // نخيل مصري
        for (let i = 0; i < 20; i++) {
            const pG = new THREE.Group();
            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.5, 25, 8), new THREE.MeshPhongMaterial({ color: 0x8B6914 }));
            trunk.position.y = 12.5; pG.add(trunk);
            for (let j = 0; j < 6; j++) {
                const leaf = new THREE.Mesh(new THREE.ConeGeometry(5, 12, 4), new THREE.MeshPhongMaterial({ color: 0x228B22 }));
                leaf.position.set(Math.cos(j * Math.PI / 3) * 4, 26, Math.sin(j * Math.PI / 3) * 4);
                leaf.rotation.z = Math.PI / 4; leaf.rotation.y = j * Math.PI / 3; pG.add(leaf);
            }
            pG.position.set((Math.random() - 0.5) * 2200, 0, (Math.random() - 0.5) * 2200);
            scene.add(pG);
        }
        // تماثيل أبو الهول الصغيرة
        for (let i = 0; i < 6; i++) {
            const sG = new THREE.Group();
            const sBody = new THREE.Mesh(new THREE.BoxGeometry(6, 5, 14), retroStone); sBody.position.y = 2.5; sG.add(sBody);
            const sHead = new THREE.Mesh(new THREE.SphereGeometry(3, 16, 16), retroGold); sHead.position.set(0, 6, 5); sG.add(sHead);
            const sNemes = new THREE.Mesh(new THREE.BoxGeometry(5, 4, 2), retroBlue); sNemes.position.set(0, 7, 4); sG.add(sNemes);
            sG.position.set((Math.random() - 0.5) * 1800, 0, (Math.random() - 0.5) * 1800);
            scene.add(sG);
            colliders.push({ x: sG.position.x, z: sG.position.z, r: 10 }); // حاجز تمثال أبو الهول
        }

        // بيوت فرعونية وكهوف للبيئة
        for (let i = 0; i < 12; i++) {
            const hg = new THREE.Group(); // بيت فرعوني
            const hs = 25 + Math.random() * 10;
            const body = new THREE.Mesh(new THREE.BoxGeometry(hs, hs * 0.8, hs), pyramidMat);
            body.position.y = hs * 0.4; hg.add(body);
            const door = new THREE.Mesh(new THREE.BoxGeometry(hs * 0.3, hs * 0.4, 1), new THREE.MeshPhongMaterial({ color: 0x331100 }));
            door.position.set(0, hs * 0.2, hs / 2); hg.add(door);
            hg.position.set((Math.random() - 0.5) * 2000, 0, (Math.random() - 0.5) * 2000);
            scene.add(hg);
            colliders.push({ x: hg.position.x, z: hg.position.z, r: hs * 0.6 }); // حاجز البيت
        }

        for (let i = 0; i < 8; i++) {
            const cg = new THREE.Group(); // كهف فرعوني
            const cs = 30 + Math.random() * 20;
            const body = new THREE.Mesh(new THREE.DodecahedronGeometry(cs, 0), retroDarkStone);
            body.position.y = cs * 0.4; cg.add(body);
            const hole = new THREE.Mesh(new THREE.SphereGeometry(cs * 0.4, 8, 8), new THREE.MeshBasicMaterial({ color: 0x000000 }));
            hole.position.set(0, cs * 0.2, cs * 0.8); cg.add(hole);
            cg.position.set((Math.random() - 0.5) * 2200, 0, (Math.random() - 0.5) * 2200);
            scene.add(cg);
            colliders.push({ x: cg.position.x, z: cg.position.z, r: cs * 0.8 }); // حاجز الكهف
        }

        // === وظيفة إنشاء مجسم إيزيس: كارتوني فرعوني متناسق ===
        function createIsisModel() {
            const group = new THREE.Group();
            const body = new THREE.Group();
            body.rotation.y = Math.PI;
            group.add(body);

            // خامة الفستان مع نقوش فرعونية ملكية
            function createDressTexture() {
                const c = document.createElement('canvas'); c.width = 512; c.height = 512;
                const ctx = c.getContext('2d');
                ctx.fillStyle = '#faf0e6'; ctx.fillRect(0, 0, 512, 512); // لون الكتان
                ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 4;
                // نقوش العنخ فقط
                ctx.font = '900 65px "Font Awesome 6 Free", "Segoe UI Symbol", serif'; ctx.fillStyle = 'rgba(212,175,55,0.7)';
                for (let i = 0; i < 25; i++) {
                    ctx.fillText('☥', Math.random() * 512, Math.random() * 512);
                }
                // خطوط ذهبية عند الأطراف
                ctx.fillStyle = '#FFD700'; ctx.fillRect(0, 0, 512, 20); ctx.fillRect(0, 492, 512, 20);
                const tex = new THREE.CanvasTexture(c); return new THREE.MeshPhongMaterial({ map: tex, side: THREE.DoubleSide });
            }

            // خامات كارتونية أكثر
            const cSkin = new THREE.MeshPhongMaterial({ color: 0xd4a574, flatShading: true });
            const cDress = createDressTexture();
            const cGold = new THREE.MeshPhongMaterial({ color: 0xffd700, shininess: 150, emissive: 0x443300 });
            const cBlue = new THREE.MeshPhongMaterial({ color: 0x1a4b8c });
            const cBlack = new THREE.MeshPhongMaterial({ color: 0x0a0a0a });
            const cWhite = new THREE.MeshPhongMaterial({ color: 0xffffff });
            const cRedCrown = new THREE.MeshPhongMaterial({ color: 0xff2200, flatShading: true });
            const cWhiteCrown = new THREE.MeshPhongMaterial({ color: 0xffffff });
            const cAnkhGlow = new THREE.MeshPhongMaterial({ color: 0xffd700, emissive: 0xffaa00, shininess: 200 });

            // الأقدام
            const footGeo = new THREE.BoxGeometry(1.0, 0.4, 1.6);
            body.add(new THREE.Mesh(footGeo, cGold).translateX(0.7).translateY(0.2));
            body.add(new THREE.Mesh(footGeo, cGold).translateX(-0.7).translateY(0.2));

            // الساقين
            const legGeo = new THREE.CylinderGeometry(0.55, 0.5, 4.5, 12);
            const lR = new THREE.Mesh(legGeo, cSkin); lR.position.set(0.7, 2.6, 0); body.add(lR);
            const lL = new THREE.Mesh(legGeo, cSkin); lL.position.set(-0.7, 2.6, 0); body.add(lL);

            // التنورة الفرعونية الطويلة
            const skirt = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 2.2, 5.5, 16), cDress);
            skirt.position.y = 4.5; body.add(skirt);
            const skirtBorder = new THREE.Mesh(new THREE.CylinderGeometry(2.25, 2.3, 0.3, 16), cGold);
            skirtBorder.position.y = 1.8; body.add(skirtBorder);
            const belt = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.8, 16), cGold);
            belt.position.y = 7.2; body.add(belt);

            // الجذع وقلادة النيل العظيمة (Nile Collar)
            const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.0, 3.5, 12), cSkin);
            torso.position.y = 9; body.add(torso);
            // القلادة مزينة بحبيبات زرقاء (أحجار النيل)
            const collarGroup = new THREE.Group(); collarGroup.position.y = 10.4; body.add(collarGroup);
            const collar = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.5, 0.3, 24), cGold); collarGroup.add(collar);
            for (let i = 0; i < 8; i++) {
                const gem = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), cBlue);
                gem.position.set(Math.cos(i * Math.PI / 4) * 1.8, 0, Math.sin(i * Math.PI / 4) * 1.8);
                collarGroup.add(gem);
            }

            // الهالة القدسية (Divine Halo)
            const haloGeo = new THREE.TorusGeometry(8, 0.2, 8, 50);
            const haloMat = new THREE.MeshBasicMaterial({ color: 0xFFD700, transparent: true, opacity: 0.3 });
            const halo = new THREE.Mesh(haloGeo, haloMat);
            halo.rotation.x = Math.PI / 2; halo.position.y = 10;
            group.add(halo); // مضافة للمجموعة الكبيرة لتتبع الحركة دائماً


            // الأذرع: تمسك السلاح بيد واحدة (اليمنى) بتناسق
            const armGeo = new THREE.CylinderGeometry(0.38, 0.32, 5, 12);
            const aR = new THREE.Mesh(armGeo, cSkin);
            aR.position.set(1.4, 9.2, 0);
            body.add(aR);

            const aL = new THREE.Mesh(armGeo, cSkin);
            aL.position.set(-1.4, 9.2, 0);
            body.add(aL);

            // إضافة كفوف ذهبية
            const handGeo = new THREE.SphereGeometry(0.45, 8, 8);
            const handR = new THREE.Mesh(handGeo, cGold);
            handR.position.set(0, -2.5, 0); aR.add(handR);
            const handL = new THREE.Mesh(handGeo, cGold);
            handL.position.set(0, -2.5, 0); aL.add(handL);

            // الرأس مع ملامح كارتونية فرعونية قوية
            const headG = new THREE.Group(); headG.position.y = 12;
            const headM = new THREE.Mesh(new THREE.SphereGeometry(2.0, 24, 24), cSkin); headG.add(headM);

            // عيون فرعونية كارتونية (كحل عريض ومميز)
            for (let s of [-1, 1]) {
                const eyeW = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 16), cWhite);
                eyeW.position.set(s * 0.85, 0.4, 1.7); headG.add(eyeW);
                const eyeP = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), cBlack);
                eyeP.position.set(s * 0.85, 0.4, 2.15); headG.add(eyeP);
                // كحل فرعوني عريض (Kohl)
                const kohl = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.15, 0.1), cBlack);
                kohl.position.set(s * 1.3, 0.35, 1.95); headG.add(kohl);
                // حواجب فرعونية بولد (Eyebrows)
                const brow = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.25, 0.1), cBlack);
                brow.position.set(s * 1.0, 1.2, 1.8); headG.add(brow);
            }

            const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.2, 0.2), new THREE.MeshPhongMaterial({ color: 0xee4433 }));
            mouth.position.set(0, -0.6, 1.9); headG.add(mouth);

            // غطاء النمس والتاج الملكي الكبير المزين بالرموز
            const nemes = new THREE.Mesh(new THREE.BoxGeometry(4.8, 1.8, 4.0), cBlue); nemes.position.y = 1.2; headG.add(nemes);

            // التاج الملكي المزدوج الضخم
            const crownGroup = new THREE.Group();
            const crownInner = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 1.5, 7, 12), cWhiteCrown);
            crownInner.position.set(0, 5, -0.3); crownGroup.add(crownInner);
            const crownOuter = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.5, 3.5, 16), cRedCrown);
            crownOuter.position.set(0, 3, -0.3); crownGroup.add(crownOuter);

            // إضافة رموز مفتاح الحياة فقط على التاج
            const faSymbols = ['☥', '☥', '☥'];
            for (let i = 0; i < 3; i++) {
                const sCanvas = document.createElement('canvas'); sCanvas.width = 64; sCanvas.height = 64;
                const sCtx = sCanvas.getContext('2d');
                sCtx.fillStyle = '#FFD700'; sCtx.font = '900 35px "Font Awesome 6 Free", "Segoe UI Symbol", serif'; sCtx.textAlign = 'center'; sCtx.textBaseline = 'middle';
                sCtx.fillText(faSymbols[i], 32, 32);
                const sTex = new THREE.CanvasTexture(sCanvas);
                const sMat = new THREE.MeshBasicMaterial({ map: sTex, transparent: true });
                const sMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.2), sMat);
                sMesh.position.set(0, 3.5 + i * 1.2, 1.3);
                crownGroup.add(sMesh);
            }

            const uraeus = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), cGold);
            uraeus.position.set(0, 1.2, 2.4); headG.add(uraeus);
            headG.add(crownGroup);

            body.add(headG);

            // سلاح العنخ
            const ankh = new THREE.Group();
            const ankhShaft = new THREE.Mesh(new THREE.BoxGeometry(0.5, 8, 0.5), cAnkhGlow);
            ankhShaft.position.y = 4; ankh.add(ankhShaft);
            const ankhArms = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.7, 0.7), cAnkhGlow);
            ankhArms.position.y = 7.5; ankh.add(ankhArms);
            for (let a = 0; a < 12; a++) {
                const angle = (a / 12) * Math.PI * 2;
                const rx = Math.cos(angle) * 1.5; const ry = Math.sin(angle) * 1.8;
                const loopPart = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), cAnkhGlow);
                loopPart.position.set(rx, 9.5 + ry, 0); ankh.add(loopPart);
            }
            ankh.scale.set(0.6, 0.6, 0.6);
            handR.add(ankh); // ربط السلاح باليد اليمنى
            ankh.position.set(0, -2, 0); ankh.rotation.x = Math.PI / 2;

            // سلاح السيف الفرعوني
            const swordModel = new THREE.Group();
            const blade = new THREE.Mesh(new THREE.BoxGeometry(1.2, 12, 0.4), cGold);
            blade.position.y = 6; swordModel.add(blade);
            const hilt = new THREE.Mesh(new THREE.BoxGeometry(3, 0.5, 1), cBlue);
            hilt.position.y = 0; swordModel.add(hilt);
            const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 3, 8), cBlack);
            handle.position.y = -1.5; swordModel.add(handle);
            swordModel.scale.set(0.6, 0.6, 0.6);
            swordModel.visible = false;
            handR.add(swordModel); // ربط السيف باليد اليمنى
            swordModel.position.set(0, -2, 0); swordModel.rotation.x = Math.PI / 2;

            return { group, legR: lR, legL: lL, armR: aR, armL: aL, ankhGroup: ankh, swordGroup: swordModel, isisBody: body, halo: halo };
        }

        let isisData, playerGroup, ankhGroup, swordGroup, isisBody, mainHalo;
        let isSwinging = false;
        let swingTimer = 0;

        window.switchWeapon = function (type) {
            currentWeapon = type;
            document.getElementById('ws-ankh').classList.toggle('active', type === 'ankh');
            document.getElementById('ws-sword').classList.toggle('active', type === 'sword');
            document.getElementById('current-weapon-icon').className = type === 'ankh' ? 'fa-solid fa-ankh' : 'fa-solid fa-khanda';

            if (ankhGroup) ankhGroup.visible = (type === 'ankh');
            if (swordGroup) swordGroup.visible = (type === 'sword');
        };

        // === مقتنيات: توابيت أوزوريس مرقمة ===
        const parts = [];
        const coffinGeo = new THREE.BoxGeometry(4, 1.5, 10);
        const bodyPartsData = [
            { name: 'الرأس', icon: 'fa-user-tie', desc: 'استرداد الحكمة الإلهية... العرش ينتظر صاحبه.' },
            { name: 'الصدر', icon: 'fa-shield-heart', desc: 'استعادة النبض المقدس... الشجاعة تعود لقلب نوسا.' },
            { name: 'القلب', icon: 'fa-heart-pulse', desc: 'جوهر التوازن الكوني... الحقيقة تُوزن بريشة ماعت.' },
            { name: 'الذراع اليمنى', icon: 'fa-hand-fist', desc: 'قوة البناء والحق... إيزيس تلم الجسد المقدد.' },
            { name: 'الذراع اليسرى', icon: 'fa-hand-back-fist', desc: 'سلطة العدل المطلق... حماية أرض النيل الخالدة.' },
            { name: 'البطن', icon: 'fa-bandage', desc: 'مركز الطاقة الحيوية... الحياة تدب في عروق أوزوريس.' },
            { name: 'الظهر', icon: 'fa-columns', desc: 'عمود الاستقرار (جد)... الثبات لنوسا وأهلها.' },
            { name: 'الساق اليمنى', icon: 'fa-walking', desc: 'خطى واثقة نحو النصر... عودة الملك لمملكته.' },
            { name: 'الساق اليسرى', icon: 'fa-person-walking-arrow-right', desc: 'مسير الحق لا ينقطع... الأرض ترحب بعودة ربها.' },
            { name: 'القدم اليمنى', icon: 'fa-shoe-prints', desc: 'لمسة مباركة للتراب... الخصوبة تعود للحقول.' },
            { name: 'القدم اليسرى', icon: 'fa-shoe-prints', desc: 'تثبيت الأركان... لا عدو يقف في وجه الحق.' },
            { name: 'العمود الفقري', icon: 'fa-bone', desc: 'رمز الدوام والبقاء... استقامة العدل في نوسا البحر.' },
            { name: 'الروح (با)', icon: 'fa-dove', desc: 'الرحيل والعودة... الروح الخالدة تتحرر من قيود الفناء.' },
            { name: 'القوة (كا)', icon: 'fa-sun', desc: 'الطاقة الحيوية المتوهجة... المجد الأبدي لأوزوريس وعروسه.' }
        ];

        // إنشاء روح أوزوريس السحرية المنقوشة (Spectral Soul) بشكل متناسق كروي
        function createSpectralSoul() {
            const group = new THREE.Group();

            // كرة روحية سحرية صغيرة (تصغير الحجم وجعلها متناسقة حقيقية)
            const soulGeo = new THREE.SphereGeometry(2.5, 32, 32);
            const soulMat = new THREE.MeshPhongMaterial({
                color: 0x00FFFF,
                emissive: 0x00FFFF,
                emissiveIntensity: 3,
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending
            });
            const core = new THREE.Mesh(soulGeo, soulMat);
            group.add(core);

            // هالة طاقة وشبحية حول الروح
            const glowGeo = new THREE.SphereGeometry(3.5, 32, 32);
            const glowMat = new THREE.MeshBasicMaterial({ color: 0x00FFFF, transparent: true, opacity: 0.15 });
            const glow = new THREE.Mesh(glowGeo, glowMat);
            group.add(glow);

            // ضوء سحري خافت (إزالة للتحسين)
            // const pLight = new THREE.PointLight(0x00FFFF, 2, 20);
            // group.add(pLight);

            return group;
        }

        // إنشاء الزعيم النهائي: نسخة عملاقة من الإله "ست"
        function createFinalBossSet() {
            const god = createEvilGod('set');
            god.scale.set(10, 10, 10); // حجم ضخم

            // إضافة ضوء مشع أحمر حوله
            const aura = new THREE.PointLight(0xFF0000, 10, 150);
            aura.position.y = 20;
            god.add(aura);

            // تزيين إضافي للزعيم (صاعقة فرعونية)
            const staffGeo = new THREE.CylinderGeometry(0.5, 0.5, 30);
            const staffMat = new THREE.MeshPhongMaterial({ color: 0xFFD700, emissive: 0xFF4500 });
            const staff = new THREE.Mesh(staffGeo, staffMat);
            staff.position.set(4, 15, 0); staff.rotation.z = -0.3;
            god.add(staff);

            return god;
        }

        // إنشاء التوابيت وأجزاء الجسم
        function createBodyPart(index) {
            const group = new THREE.Group();

            // التابوت الفرعوني (Sarcophagus)
            const coffinGeo = new THREE.BoxGeometry(10, 20, 10);
            const coffinMat = new THREE.MeshPhongMaterial({ color: 0x4a3721 });
            const coffin = new THREE.Mesh(coffinGeo, coffinMat);
            group.add(coffin);

            // إضافة روح أوزوريس الشفافة حول التابوت
            const soul = createSpectralSoul();
            soul.position.y = 15;
            group.add(soul);

            // الجزء المفقود (نموذج 3D)
            const data = bodyPartsData[index];
            const partModel = createDetailedPart(data.icon);
            partModel.position.y = 10;
            group.add(partModel);

            return { group, partModel, soul, active: true, offset: Math.random() * 10 };
        }
        const bodyPartNames = bodyPartsData.map(d => d.name);
        const collectedBodyParts = [];

        function createCoffinTexture(index) {
            const c = document.createElement('canvas'); c.width = 256; c.height = 128;
            const ctx = c.getContext('2d');
            ctx.fillStyle = '#8B7500'; ctx.fillRect(0, 0, 256, 128);
            ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 4; ctx.strokeRect(6, 6, 244, 116);
            ctx.fillStyle = '#FFD700'; ctx.font = 'bold 42px "Aref Ruqaa", serif'; ctx.textAlign = 'center';
            ctx.shadowColor = '#000'; ctx.shadowBlur = 4;
            ctx.fillText((index + 1).toString(), 128, 50);
            ctx.font = 'bold 22px "Aref Ruqaa", serif';
            ctx.fillText(bodyPartNames[index], 128, 90);
            ctx.font = '900 22px "Font Awesome 6 Free", "Segoe UI Symbol", serif';
            ctx.fillText('☥', 128, 118);
            const tex = new THREE.CanvasTexture(c); tex.magFilter = THREE.NearestFilter;
            return new THREE.MeshPhongMaterial({ map: tex, flatShading: true });
        }

        function createSymbolsField() {
            const group = new THREE.Group();
            const symbols = ['☥', '☀️', '⚖️', '𓂀'];
            for (let i = 0; i < 3; i++) {
                const sCanvas = document.createElement('canvas'); sCanvas.width = 64; sCanvas.height = 64;
                const sCtx = sCanvas.getContext('2d');
                sCtx.fillStyle = '#FFD700'; sCtx.font = 'bold 40px "Font Awesome 6 Free", serif'; sCtx.textAlign = 'center'; sCtx.textBaseline = 'middle';
                sCtx.fillText(symbols[i % symbols.length], 32, 32);
                const sTex = new THREE.CanvasTexture(sCanvas);
                const sMesh = new THREE.Mesh(new THREE.PlaneGeometry(3, 3), new THREE.MeshBasicMaterial({ map: sTex, transparent: true, opacity: 0.6, side: THREE.DoubleSide }));
                sMesh.position.set((Math.random() - 0.5) * 15, 5 + Math.random() * 10, (Math.random() - 0.5) * 15);
                group.add(sMesh);
            }
            return group;
        }

        function createGuardianStatue(name) {
            const g = new THREE.Group();

            // قماش أخضر مزين بتعاويذ ورموز فرعونية
            const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 512;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#0a3a1a'; ctx.fillRect(0, 0, 256, 512);

            // إضافة رموز وتعاويذ فرعونية على الثياب
            ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
            ctx.font = '25px "Font Awesome 6 Free", serif';
            const bgSymbols = ['☥', '𓂀', '𓋹', '𓏠', '𓊽', '𓇳', '☀️', '𓆃'];
            for(let i=0; i<40; i++) {
                ctx.fillText(bgSymbols[Math.floor(Math.random() * bgSymbols.length)], Math.random()*256, Math.random()*512);
            }

            ctx.fillStyle = '#FFD700'; ctx.font = 'bold 40px "Aref Ruqaa"'; ctx.textAlign = 'center';
            ctx.shadowColor = '#000'; ctx.shadowBlur = 10;
            ctx.fillText(name, 128, 150);
            ctx.font = 'bold 30px serif'; ctx.fillText('☥ أوزوريس ☥', 128, 250);
            const tex = new THREE.CanvasTexture(canvas);
            tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;

            const mStatue = new THREE.MeshPhongMaterial({ map: tex, color: 0x006400, transparent: true, opacity: 0.9, flatShading: true });
            const mGold = new THREE.MeshPhongMaterial({ color: 0xFFD700, emissive: 0x442200 });

            // جسد المومياء (أوزوريس الحارس)
            const body = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 3.5, 14, 8), mStatue);
            body.position.y = 7; g.add(body);

            const head = new THREE.Mesh(new THREE.SphereGeometry(2.3, 16, 16), mStatue);
            head.position.y = 15; g.add(head);

            const crown = new THREE.Mesh(new THREE.ConeGeometry(1.5, 6, 8), mGold);
            crown.position.y = 20; g.add(crown);

            // إضافة اسم الجزء ليظهر بشكل إبداعي ويدور حول الرأس والجسد
            const rotGroup = new THREE.Group();
            const textCanvas = document.createElement('canvas'); textCanvas.width = 512; textCanvas.height = 128;
            const tCtx = textCanvas.getContext('2d');
            tCtx.fillStyle = '#FFD700'; tCtx.font = 'bold 50px "Aref Ruqaa"'; tCtx.textAlign = 'center';
            tCtx.textBaseline = 'middle';
            tCtx.shadowColor = '#ff4500'; tCtx.shadowBlur = 20;
            tCtx.fillText(`𓂀 ${name} ☥`, 256, 64);
            const tTex = new THREE.CanvasTexture(textCanvas);
            const tMat = new THREE.MeshBasicMaterial({ map: tTex, transparent: true, opacity: 0.95, side: THREE.DoubleSide });
            
            for(let i=0; i<3; i++) {
                const tMesh = new THREE.Mesh(new THREE.PlaneGeometry(15, 3.5), tMat);
                tMesh.position.set(Math.cos(i*Math.PI*2/3)*7, 0, Math.sin(i*Math.PI*2/3)*7);
                tMesh.rotation.y = -(i*Math.PI*2/3) + Math.PI/2;
                rotGroup.add(tMesh);
            }
            rotGroup.position.y = 12; // يطوف حول الرأس والصدر
            g.add(rotGroup);
            g.userData.rotatingText = rotGroup;

            // إضافة "روح متوهجة" فوق التمثال (بدون ضوء إضافي للتحسين)
            const soul = createSpectralSoul();
            soul.position.y = 24;
            soul.scale.set(0.7, 0.7, 0.7);
            g.add(soul);

            g.scale.set(1.5, 1.5, 1.5);
            return g;
        }

        for (let i = 0; i < TOTAL_PARTS; i++) {
            const pGrp = new THREE.Group();

            // إضافة "روح وتمثال أوزوريس" كحارس أمام التابوت مع كتابة اسم العضو
            const guardian = createGuardianStatue(bodyPartNames[i]);
            guardian.position.set(15, 0, 15);
            pGrp.add(guardian);

            const coffinMat = createCoffinTexture(i);
            const coffin = new THREE.Mesh(coffinGeo, coffinMat);
            coffin.position.set(0, 2, 0); pGrp.add(coffin);
            const lid = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.0, 7), retroDarkStone);
            lid.position.set(0, 3, 0); pGrp.add(lid);

            // إضافة الجزء المفقود بشكل سحري فوق التابوت
            const partModel = createBodyPartModel(i);
            partModel.position.set(0, 8, 0);
            pGrp.add(partModel);

            // إضافة حقل رموز سحرية
            pGrp.add(createSymbolsField());

            pGrp.add(new THREE.PointLight(0x00ffff, 0.5, 30)); // ضوء سحري خفيف

            // سهم متوهج يشير للتابوت
            const arrowGroup = new THREE.Group();
            const arrowBody = new THREE.Mesh(new THREE.BoxGeometry(0.8, 4, 0.8), new THREE.MeshPhongMaterial({ color: 0xFFD700, emissive: 0xffaa00 }));
            arrowBody.position.y = 12; arrowGroup.add(arrowBody);
            const arrowHead = new THREE.Mesh(new THREE.ConeGeometry(2, 3, 6), new THREE.MeshPhongMaterial({ color: 0xFFD700, emissive: 0xffaa00 }));
            arrowHead.position.y = 9; arrowHead.rotation.x = Math.PI; arrowGroup.add(arrowHead);
            pGrp.add(arrowGroup);

            let pos = (i < structuralSites.length) ? structuralSites[i].clone() : new THREE.Vector3((Math.random() - 0.5) * 2000, 0, (Math.random() - 0.5) * 2000);
            pGrp.position.copy(pos); scene.add(pGrp);
            parts.push({ group: pGrp, guardian: guardian, active: true, offset: Math.random() * Math.PI * 2, arrow: arrowGroup, partModel: partModel });
        }
        document.getElementById('total').innerText = TOTAL_PARTS;

        // === أعداء كارتونية فرعونية مرعبة ===
        const enemies = [];
        const mDark = new THREE.MeshPhongMaterial({ color: 0x440066, emissive: 0x110022 });
        const mFlesh = new THREE.MeshPhongMaterial({ color: 0x661144, emissive: 0x220011 });
        const mEyeY = new THREE.MeshPhongMaterial({ color: 0xffff00 });
        const mEyeR = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        const mTeeth = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const mHornG = new THREE.MeshPhongMaterial({ color: 0xddaa00 });

        function createEvilGod(type) {
            const g = new THREE.Group();
            const darkMat = new THREE.MeshPhongMaterial({ color: 0x1a1a1a, shininess: 100 });
            const redMat = new THREE.MeshPhongMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2 });
            const skinMat = type === 'sobek' ? new THREE.MeshPhongMaterial({ color: 0x004400, shininess: 20 }) : darkMat;

            // الجسم الضخم المرعب - حجم متناسق ومهيب
            const body = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 6, 22, 10), skinMat);
            body.position.y = 11; g.add(body);

            // إضافة هالة رعب سوداء تحت القدمين
            const shadowGeo = new THREE.CircleGeometry(12, 32);
            const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.5 });
            const shadow = new THREE.Mesh(shadowGeo, shadowMat);
            shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.5; g.add(shadow);

            if (type === 'set') {
                // رأس الإله ست (ابن آوى الشيطاني)
                const head = new THREE.Group();
                const snout = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3, 8), darkMat);
                snout.position.set(0, 22, 4); head.add(snout);
                const skull = new THREE.Mesh(new THREE.SphereGeometry(4.5, 16, 16), darkMat);
                skull.position.set(0, 22, 0); head.add(skull);
                for (let s of [-1, 1]) {
                    const ear = new THREE.Mesh(new THREE.BoxGeometry(1, 10, 2.5), darkMat);
                    ear.position.set(s * 2.5, 27, 0); head.add(ear);
                }
                for (let s of [-1, 1]) {
                    const eye = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 8), redMat);
                    eye.position.set(s * 1.8, 23.5, 3.8); head.add(eye);
                }
                g.add(head);
            } else if (type === 'sobek') {
                // رأس الإله سوبيك (تمساح مرعب)
                const head = new THREE.Group();
                const upperJaw = new THREE.Mesh(new THREE.BoxGeometry(5, 2.5, 12), skinMat);
                upperJaw.position.set(0, 22, 6); head.add(upperJaw);
                const lowerJaw = new THREE.Mesh(new THREE.BoxGeometry(4.5, 2, 11), skinMat);
                lowerJaw.position.set(0, 20.2, 5.5); head.add(lowerJaw);
                for (let i = -3; i <= 3; i++) {
                    const t = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.8, 4), new THREE.MeshPhongMaterial({ color: 0xffffff }));
                    t.position.set(i * 1.0, 21.0, 10); head.add(t);
                }
                for (let s of [-1, 1]) {
                    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 8), new THREE.MeshBasicMaterial({ color: 0xFFD700 }));
                    eye.position.set(s * 2, 23, 2); head.add(eye);
                }
                g.add(head);
            }

            for (let s of [-1, 1]) {
                const arm = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 0.8, 15, 8), darkMat);
                arm.position.set(s * 8, 15, 0); arm.rotation.z = s * 0.6; g.add(arm);
            }

            // تم إزالة الضوء النقطي للتحسين
            // g.add(new THREE.PointLight(0xff0000, 3, 80));
            return g;
        }

        function createGiantCobra() {
            const group = new THREE.Group();
            const segmentCount = 20;
            const segments = [];
            // لون ثعبان حقيقي: بني مائل للذهبي مع بقع غامقة
            const skinMat = new THREE.MeshPhongMaterial({ color: 0x8b5a2b, shininess: 80, flatShading: false });
            const bellyMat = new THREE.MeshPhongMaterial({ color: 0xecd0a5 }); // لون البطن فاتح

            for (let i = 0; i < segmentCount; i++) {
                const size = i === 0 ? 5.5 : (5 - (i * 0.25));
                const seg = new THREE.Mesh(new THREE.SphereGeometry(size > 0.8 ? size : 0.8, 16, 16), i % 2 === 0 ? skinMat : bellyMat);
                seg.position.z = -i * 3.2;
                group.add(seg);
                segments.push(seg);
            }

            const head = segments[0];
            // قلنسوة الكوبرا الفرعونية (Uraeus) بتصميم ملكي حقيقي
            const hoodGeo = new THREE.BoxGeometry(16, 12, 1);
            const hoodMat = new THREE.MeshPhongMaterial({ color: 0x8b5a2b });
            const hood = new THREE.Mesh(hoodGeo, hoodMat);
            hood.position.z = -1.5; hood.rotation.x = 0.2;
            head.add(hood);

            // إضافة نقش "العين" على القلنسوة كما في الكوبرا الحقيقية
            const eyePatternGeo = new THREE.SphereGeometry(3, 16, 16);
            const eyePatternMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
            for (let s of [-1, 1]) {
                const p = new THREE.Mesh(eyePatternGeo, eyePatternMat);
                p.position.set(s * 5, 2, -1.2); p.scale.z = 0.1;
                hood.add(p);
            }

            // عيون متوهجة لإضفاء لمسة مرعبة
            for (let s of [-1, 1]) {
                const eye = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff0000, emissive: 0xff0000 }));
                eye.position.set(s * 2, 2, 3.5);
                head.add(eye);
            }

            // لسان مشقوق يتحرك
            const tongue = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 5), new THREE.MeshBasicMaterial({ color: 0xaa0000 }));
            tongue.position.set(0, -1, 4); head.add(tongue);

            group.add(new THREE.PointLight(0x8b5a2b, 2, 60));
            return { group, segments, originalY: 0 };
        }



        function createBodyPartModel(index) {
            const group = new THREE.Group();
            const colors = [0xFFD700, 0x1E90FF, 0xFF4500, 0x32CD32, 0x9400D3];
            const mat = new THREE.MeshPhongMaterial({
                color: colors[index % colors.length],
                emissive: colors[index % colors.length],
                emissiveIntensity: 0.6,
                transparent: true,
                opacity: 0.9,
                flatShading: true
            });

            // إضافة نقوش فرعونية مرسومة على الأسطح
            const c = document.createElement('canvas'); c.width = 128; c.height = 128;
            const ctx = c.getContext('2d');
            ctx.fillStyle = '#' + colors[index % colors.length].toString(16).padStart(6, '0');
            ctx.fillRect(0, 0, 128, 128); ctx.strokeStyle = '#fff'; ctx.lineWidth = 3;
            ctx.font = 'bold 60px "Font Awesome 6 Free"'; ctx.textAlign = 'center';
            ctx.strokeText('𓂀', 64, 80);
            const tex = new THREE.CanvasTexture(c);
            mat.map = tex;

            const core = new THREE.Mesh(new THREE.IcosahedronGeometry(2.5, 0), mat);
            group.add(core);

            const ring = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.3, 8, 30), mat);
            ring.rotation.x = Math.PI / 2;
            group.add(ring);

            // تم إزالة الضوء النقطي للتحسين
            // group.add(new THREE.PointLight(colors[index % colors.length], 1.5, 40));
            return group;
        }

        function createPalmTree() {
            const group = new THREE.Group();
            const trunkMat = new THREE.MeshPhongMaterial({ color: 0x5d4037, flatShading: true });
            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 20, 8), trunkMat);
            trunk.position.y = 10;
            group.add(trunk);

            const leafMat = new THREE.MeshPhongMaterial({ color: 0x2e7d32, side: THREE.DoubleSide });
            for (let i = 0; i < 8; i++) {
                const leaf = new THREE.Mesh(new THREE.ConeGeometry(2, 8, 4), leafMat);
                leaf.position.y = 20;
                leaf.rotation.z = Math.PI / 2.5;
                leaf.rotation.y = (i / 8) * Math.PI * 2;
                leaf.scale.set(1, 0.1, 1);
                group.add(leaf);
            }
            return group;
        }

        function createTomb() {
            const group = new THREE.Group();
            const stoneMat = new THREE.MeshPhongMaterial({ color: 0x8b7355 });

            const base = new THREE.Mesh(new THREE.BoxGeometry(15, 12, 10), stoneMat);
            base.position.y = 6; group.add(base);

            // نقوش ونصوص
            const c = document.createElement('canvas'); c.width = 512; c.height = 256;
            const ctx = c.getContext('2d');
            ctx.fillStyle = '#8b7355'; ctx.fillRect(0, 0, 512, 256);
            ctx.fillStyle = '#3e2723'; ctx.font = 'bold 40px "Aref Ruqaa"'; ctx.textAlign = 'center';
            ctx.fillText('نوسا البحر', 256, 100);
            ctx.font = '30px serif'; ctx.fillText('𓂀 ☥ ☀️ 𓂀', 256, 180);
            const tex = new THREE.CanvasTexture(c);
            const label = new THREE.Mesh(new THREE.PlaneGeometry(12, 6), new THREE.MeshBasicMaterial({ map: tex }));
            label.position.set(0, 6, 5.1);
            group.add(label);

            return group;
        }

        function createPapyrusSheet() {
            const c = document.createElement('canvas'); c.width = 256; c.height = 256;
            const ctx = c.getContext('2d');
            ctx.fillStyle = '#e3c4a8'; ctx.fillRect(0, 0, 256, 256);
            ctx.strokeStyle = '#8b4513'; ctx.lineWidth = 5; ctx.strokeRect(10, 10, 236, 236);
            ctx.fillStyle = '#5d4037'; ctx.font = 'bold 40px serif'; ctx.textAlign = 'center';
            ctx.fillText('☥', 128, 140);
            const tex = new THREE.CanvasTexture(c);
            const sheet = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide }));
            sheet.rotation.x = -Math.PI / 2;
            sheet.position.y = 0.1;
            return sheet;
        }

        // === جميع آلهة مصر القديمة بتصميم كارتوني واقعي مع وصف إبداعي ===
        const ALL_GODS = {
            anubis:   { name: 'أنوبيس', desc: 'إله الموتى وحارس المقابر', headColor: 0x1a1a1a, bodyColor: 0x2d2d2d, eyeColor: 0xff4400 },
            horus:    { name: 'حورس', desc: 'إله السماء والحماية', headColor: 0xc8a062, bodyColor: 0xe8d0a0, eyeColor: 0x00bfff },
            thoth:    { name: 'تحوت', desc: 'إله الحكمة والكتابة', headColor: 0xeeeeee, bodyColor: 0xd0d0d0, eyeColor: 0xffdd00 },
            sobek:    { name: 'سوبك', desc: 'إله النيل والتماسيح', headColor: 0x2e8b57, bodyColor: 0x228b22, eyeColor: 0xffaa00 },
            bastet:   { name: 'باستت', desc: 'إلهة القطط والأمومة', headColor: 0x555555, bodyColor: 0x8b7355, eyeColor: 0x00ff88 },
            sekhmet:  { name: 'سخمت', desc: 'إلهة الحرب والشفاء', headColor: 0xcc8833, bodyColor: 0xdd9944, eyeColor: 0xff2200 },
            ra:       { name: 'رع', desc: 'إله الشمس الأعظم', headColor: 0xff8800, bodyColor: 0xffd700, eyeColor: 0xffff00 },
            hathor:   { name: 'حتحور', desc: 'إلهة الحب والجمال', headColor: 0xd4a574, bodyColor: 0xfaf0e6, eyeColor: 0x4488ff },
            set:      { name: 'ست', desc: 'إله العواصف والفوضى', headColor: 0x8b0000, bodyColor: 0x660000, eyeColor: 0xff0000 },
            osiris:   { name: 'أوزوريس', desc: 'إله البعث والعالم الآخر', headColor: 0x2e7d32, bodyColor: 0x1b5e20, eyeColor: 0xffd700 },
            isis_god: { name: 'إيزيس', desc: 'إلهة السحر والحكمة', headColor: 0xd4a574, bodyColor: 0x1a4b8c, eyeColor: 0x00ffff },
            ptah:     { name: 'بتاح', desc: 'إله الصناعة والخلق', headColor: 0x00bcd4, bodyColor: 0x006064, eyeColor: 0xaaffcc },
            khnum:    { name: 'خنوم', desc: 'إله الخلق - الفخار', headColor: 0x8d6e63, bodyColor: 0x795548, eyeColor: 0xffcc00 },
            maat:     { name: 'ماعت', desc: 'إلهة العدالة والحقيقة', headColor: 0xfaf0e6, bodyColor: 0xffd700, eyeColor: 0x2196F3 }
        };
        const ALL_GOD_TYPES = Object.keys(ALL_GODS);

        function createGodStatue(type) {
            if (!ALL_GODS[type]) type = ALL_GOD_TYPES[Math.floor(Math.random() * ALL_GOD_TYPES.length)];
            const info = ALL_GODS[type];
            const g = new THREE.Group();
            const bodyMat = new THREE.MeshPhongMaterial({ color: info.bodyColor, shininess: 80, flatShading: true });
            const headMat = new THREE.MeshPhongMaterial({ color: info.headColor, shininess: 80, flatShading: true });
            const goldMat = new THREE.MeshPhongMaterial({ color: 0xFFD700, shininess: 150, emissive: 0x553300 });
            const eyeMat  = new THREE.MeshBasicMaterial({ color: info.eyeColor });

            // قاعدة حجرية
            const pedestal = new THREE.Mesh(new THREE.BoxGeometry(7, 2, 7), new THREE.MeshPhongMaterial({ color: 0x6b5b4b }));
            pedestal.position.y = 1; g.add(pedestal);

            // جسم كارتوني واقعي (أسمك وأكثر تفصيلاً)
            const torso = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 3.2, 12, 12), bodyMat);
            torso.position.y = 8; g.add(torso);
            // حزام ذهبي
            const belt = new THREE.Mesh(new THREE.CylinderGeometry(2.35, 2.35, 0.6, 16), goldMat);
            belt.position.y = 8; g.add(belt);
            // أذرع كارتونية
            const armGeo = new THREE.CylinderGeometry(0.6, 0.5, 6, 8);
            const armR = new THREE.Mesh(armGeo, bodyMat);
            armR.position.set(3, 10, 0); armR.rotation.z = 0.3; g.add(armR);
            const armL = new THREE.Mesh(armGeo, bodyMat);
            armL.position.set(-3, 10, 0); armL.rotation.z = -0.3; g.add(armL);
            // أرجل
            const legGeo = new THREE.CylinderGeometry(0.8, 0.7, 5, 8);
            const legR = new THREE.Mesh(legGeo, bodyMat);
            legR.position.set(1.2, 2, 0); g.add(legR);
            const legL = new THREE.Mesh(legGeo, bodyMat);
            legL.position.set(-1.2, 2, 0); g.add(legL);

            // رأس كروي كبير (كارتوني واقعي)
            const head = new THREE.Mesh(new THREE.SphereGeometry(2.5, 20, 20), headMat);
            head.position.y = 16; g.add(head);
            // عيون كارتونية عريضة
            for (let s of [-1, 1]) {
                const eyeW = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffffff }));
                eyeW.position.set(s * 1.0, 16.3, 2.1); g.add(eyeW);
                const eyeP = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 12), eyeMat);
                eyeP.position.set(s * 1.0, 16.3, 2.5); g.add(eyeP);
            }

            // سمات فريدة لكل إله
            if (type === 'anubis') {
                const earL = new THREE.Mesh(new THREE.ConeGeometry(0.6, 5, 6), headMat);
                earL.position.set(-1, 19, 0); g.add(earL);
                const earR = new THREE.Mesh(new THREE.ConeGeometry(0.6, 5, 6), headMat);
                earR.position.set(1, 19, 0); g.add(earR);
                const snout = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.0, 3.5), headMat);
                snout.position.set(0, 15.8, 3); g.add(snout);
            } else if (type === 'horus') {
                const beak = new THREE.Mesh(new THREE.ConeGeometry(0.6, 2.5, 6), goldMat);
                beak.position.set(0, 15.8, 3.5); beak.rotation.x = Math.PI / 2; g.add(beak);
                const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 1.5, 5, 8), new THREE.MeshPhongMaterial({ color: 0xff0000 }));
                crown.position.y = 19.5; g.add(crown);
            } else if (type === 'thoth') {
                const ibis = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.2, 5.5, 8), headMat);
                ibis.position.set(0, 15.5, 4); ibis.rotation.x = Math.PI / 2.3; g.add(ibis);
                const moonDisc = new THREE.Mesh(new THREE.SphereGeometry(2, 16, 16), new THREE.MeshBasicMaterial({ color: 0xbbddff, transparent: true, opacity: 0.6 }));
                moonDisc.position.y = 20; g.add(moonDisc);
            } else if (type === 'sobek') {
                const jaw = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.5, 5), headMat);
                jaw.position.set(0, 15.5, 3); g.add(jaw);
                for (let i = 0; i < 5; i++) {
                    const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.6, 4), new THREE.MeshBasicMaterial({ color: 0xffffff }));
                    tooth.position.set((i - 2) * 0.5, 14.8, 5); tooth.rotation.x = Math.PI; g.add(tooth);
                }
            } else if (type === 'bastet') {
                for (let s of [-1, 1]) {
                    const ear = new THREE.Mesh(new THREE.ConeGeometry(1, 2.5, 4), headMat);
                    ear.position.set(s * 1.5, 18.5, 0); g.add(ear);
                }
                const whiskers = new THREE.Mesh(new THREE.BoxGeometry(5, 0.1, 0.05), headMat);
                whiskers.position.set(0, 15.5, 2.5); g.add(whiskers);
            } else if (type === 'sekhmet') {
                for (let s of [-1, 1]) {
                    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.7, 1.5, 6), headMat);
                    ear.position.set(s * 1.8, 18, 0); g.add(ear);
                }
                const mane = new THREE.Mesh(new THREE.CylinderGeometry(3, 3.5, 2.5, 16), headMat);
                mane.position.y = 16; g.add(mane);
                const sunDisc = new THREE.Mesh(new THREE.SphereGeometry(1.5, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff4400 }));
                sunDisc.position.y = 20; g.add(sunDisc);
            } else if (type === 'ra') {
                const sunDisc = new THREE.Mesh(new THREE.SphereGeometry(3, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffbb00 }));
                sunDisc.position.y = 20.5; g.add(sunDisc);
                const sunLight = new THREE.PointLight(0xffaa00, 3, 50);
                sunLight.position.y = 20; g.add(sunLight);
                const cobra = new THREE.Mesh(new THREE.ConeGeometry(0.5, 4, 6), new THREE.MeshPhongMaterial({ color: 0xff0000 }));
                cobra.position.set(0, 19.5, 1.5); g.add(cobra);
            } else if (type === 'hathor') {
                for (let s of [-1, 1]) {
                    const horn = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.15, 5, 8), goldMat);
                    horn.position.set(s * 2, 19, 0); horn.rotation.z = s * 0.4; g.add(horn);
                }
                const sunDisc = new THREE.Mesh(new THREE.SphereGeometry(1.5, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff8800 }));
                sunDisc.position.y = 22; g.add(sunDisc);
            } else if (type === 'set') {
                const ear = new THREE.Mesh(new THREE.BoxGeometry(1.5, 5, 0.5), headMat);
                ear.position.set(0, 20, 0); ear.rotation.z = 0.2; g.add(ear);
                const snout = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 4), headMat);
                snout.position.set(0, 16.3, 3); g.add(snout);
            } else if (type === 'osiris') {
                const crown = new THREE.Mesh(new THREE.ConeGeometry(1.5, 7, 12), new THREE.MeshPhongMaterial({ color: 0xffffff }));
                crown.position.y = 21; g.add(crown);
                for (let s of [-1, 1]) {
                    const feather = new THREE.Mesh(new THREE.BoxGeometry(0.2, 5, 2), goldMat);
                    feather.position.set(s * 1.5, 22, 0); feather.rotation.z = s * 0.3; g.add(feather);
                }
            } else if (type === 'isis_god') {
                const throne = new THREE.Mesh(new THREE.BoxGeometry(2, 3, 1), goldMat);
                throne.position.y = 19.5; g.add(throne);
                const wings = new THREE.Mesh(new THREE.PlaneGeometry(12, 6), new THREE.MeshPhongMaterial({ color: 0x1a4b8c, side: THREE.DoubleSide, transparent: true, opacity: 0.7 }));
                wings.position.set(0, 10, -1); g.add(wings);
            } else if (type === 'ptah') {
                const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 18, 8), goldMat);
                staff.position.set(3.5, 7, 0); g.add(staff);
                const cap = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 4, 12), new THREE.MeshPhongMaterial({ color: 0x006064 }));
                cap.position.y = 19; g.add(cap);
            } else if (type === 'khnum') {
                for (let s of [-1, 1]) {
                    const horn = new THREE.Mesh(new THREE.TorusGeometry(2, 0.3, 8, 16, Math.PI), headMat);
                    horn.position.set(s * 1.5, 18.5, 0); horn.rotation.y = s * Math.PI / 2; g.add(horn);
                }
            } else if (type === 'maat') {
                const feather = new THREE.Mesh(new THREE.BoxGeometry(0.4, 7, 2), goldMat);
                feather.position.y = 22; g.add(feather);
                const headband = new THREE.Mesh(new THREE.CylinderGeometry(2.7, 2.7, 0.3, 16), goldMat);
                headband.position.y = 17.5; g.add(headband);
            }

            // قلادة ذهبية مشتركة لكل الآلهة
            const necklace = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.8, 0.4, 20), goldMat);
            necklace.position.y = 13; g.add(necklace);

            // لوحة وصف إبداعية تطفو أمام التمثال
            const descCanvas = document.createElement('canvas'); descCanvas.width = 512; descCanvas.height = 128;
            const dCtx = descCanvas.getContext('2d');
            dCtx.fillStyle = 'rgba(0,0,0,0.7)'; dCtx.fillRect(0, 0, 512, 128);
            dCtx.strokeStyle = '#FFD700'; dCtx.lineWidth = 4; dCtx.strokeRect(2, 2, 508, 124);
            dCtx.fillStyle = '#FFD700'; dCtx.font = 'bold 38px "Aref Ruqaa"'; dCtx.textAlign = 'center';
            dCtx.fillText(info.name, 256, 50);
            dCtx.fillStyle = '#ffffff'; dCtx.font = '24px "Aref Ruqaa"';
            dCtx.fillText(info.desc, 256, 100);
            const descTex = new THREE.CanvasTexture(descCanvas);
            const descMat = new THREE.MeshBasicMaterial({ map: descTex, transparent: true, opacity: 0.95, side: THREE.DoubleSide });
            const descMesh = new THREE.Mesh(new THREE.PlaneGeometry(12, 3), descMat);
            descMesh.position.set(0, 0, 5);
            g.add(descMesh);
            g.userData.descLabel = descMesh;

            // تم إزالة الضوء الملون للتحسين
            // const gLight = new THREE.PointLight(info.eyeColor, 2, 30);
            // gLight.position.y = 16; g.add(gLight);

            return g;
        }

        // إضافة العناصر لبيئة اللعب
        // أشجار وتماثيل فرعونية حول النيل (على الترتيب على طول الضفتين)
        for (let i = 0; i < 50; i++) {
            const palm = createPalmTree();
            const xPos = (i % 2 === 0) ? -245 : -55; // ضفتي النيل
            const zPos = (i * 40) - 1000;
            palm.position.set(xPos + (Math.random() - 0.5) * 10, 0, zPos);
            scene.add(palm);

            if (i % 3 === 0) {
                const statue = createGodStatue(ALL_GOD_TYPES[i % ALL_GOD_TYPES.length]);
                statue.position.set(xPos + (i % 2 === 0 ? -15 : 15), 0, zPos + 20);
                scene.add(statue);
            }
        }

        // مقابر فرعونية عشوائية
        for (let i = 0; i < 15; i++) {
            const tomb = createTomb();
            tomb.position.set((Math.random() - 0.5) * 2000, 0, (Math.random() - 0.5) * 2000);
            tomb.rotation.y = Math.random() * Math.PI * 2;
            scene.add(tomb);
            colliders.push({ x: tomb.position.x, z: tomb.position.z, r: 10 });
        }

        // === معبد آلهة مصر الكبير: جميع الآلهة في حلقة مقدسة ===
        {
            const templeX = 700, templeZ = -700;
            const templeRadius = 100;
            ALL_GOD_TYPES.forEach((godType, i) => {
                const angle = (i / ALL_GOD_TYPES.length) * Math.PI * 2;
                const god = createGodStatue(godType);
                god.scale.set(3, 3, 3);
                god.position.set(
                    templeX + Math.cos(angle) * templeRadius,
                    0,
                    templeZ + Math.sin(angle) * templeRadius
                );
                god.rotation.y = -angle + Math.PI / 2;
                scene.add(god);
            });
            // إضافة منصة حجرية دائرية للمعبد
            const templePlatform = new THREE.Mesh(
                new THREE.CylinderGeometry(templeRadius + 20, templeRadius + 25, 2, 32),
                new THREE.MeshPhongMaterial({ color: 0x5d4037, emissive: 0x221100 })
            );
            templePlatform.position.set(templeX, 0.5, templeZ);
            scene.add(templePlatform);
            const templeLight = new THREE.PointLight(0xFFD700, 3, 300);
            templeLight.position.set(templeX, 50, templeZ);
            scene.add(templeLight);
        }

        // أوراق بردي في الأرض
        for (let i = 0; i < 25; i++) {
            const papyrus = createPapyrusSheet();
            papyrus.position.set((Math.random() - 0.5) * 2000, 0, (Math.random() - 0.5) * 2000);
            scene.add(papyrus);
        }

        // --- هياكل عظمية فرعونية ومومياوات (كما طلب المستخدم) ---
        function createPharaonicSkeleton() {
            const g = new THREE.Group();
            const boneMat = new THREE.MeshPhongMaterial({ color: 0xddccaa, flatShading: true });
            
            const skull = new THREE.Mesh(new THREE.SphereGeometry(1.5, 8, 8), boneMat);
            skull.position.y = 8; g.add(skull);
            const ribcage = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.5, 4, 6), boneMat);
            ribcage.position.y = 5; g.add(ribcage);
            const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 3, 4), boneMat);
            spine.position.y = 2.5; g.add(spine);
            const armR = new THREE.Mesh(new THREE.BoxGeometry(0.6, 5, 0.6), boneMat);
            armR.position.set(2, 4, 0); armR.rotation.z = -Math.PI / 6; g.add(armR);
            const armL = new THREE.Mesh(new THREE.BoxGeometry(0.6, 5, 0.6), boneMat);
            armL.position.set(-2, 4, 0); armL.rotation.z = Math.PI / 6; g.add(armL);
            const legR = new THREE.Mesh(new THREE.BoxGeometry(0.8, 5, 0.8), boneMat);
            legR.position.set(1, -1, 0); g.add(legR);
            const legL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 5, 0.8), boneMat);
            legL.position.set(-1, -1, 0); g.add(legL);
            
            g.rotation.x = -Math.PI / 2; // ملقى على الأرض
            g.scale.set(0.6, 0.6, 0.6);
            return g;
        }

        function createRestingMummy() {
            const g = new THREE.Group();
            const bandageMat = new THREE.MeshPhongMaterial({ color: 0xc8bcac, flatShading: true });
            
            const body = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.0, 10, 8), bandageMat);
            body.position.y = 5; g.add(body);
            const head = new THREE.Mesh(new THREE.SphereGeometry(1.8, 8, 8), bandageMat);
            head.position.y = 11.5; g.add(head);
            const crossedArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 4, 8), bandageMat);
            crossedArmR.position.set(0, 7, 1.8); crossedArmR.rotation.x = Math.PI / 2; crossedArmR.rotation.y = Math.PI / 4; g.add(crossedArmR);
            const crossedArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 4, 8), bandageMat);
            crossedArmL.position.set(0, 7, 1.9); crossedArmL.rotation.x = Math.PI / 2; crossedArmL.rotation.y = -Math.PI / 4; g.add(crossedArmL);
            
            g.rotation.x = -Math.PI / 6; 
            g.position.y = 1.5;
            g.scale.set(0.8, 0.8, 0.8);
            return g;
        }

        // تقليل الهياكل العظمية للتحسين (من 40 إلى 15)
        for (let i = 0; i < 15; i++) {
            const skel = createPharaonicSkeleton();
            skel.position.set((Math.random() - 0.5) * 2000, 2, (Math.random() - 0.5) * 2000);
            skel.rotation.y = Math.random() * Math.PI * 2;
            scene.add(skel);
        }
        // تقليل المومياوات للتحسين (من 30 إلى 12)
        for (let i = 0; i < 12; i++) {
            const mummy = createRestingMummy();
            mummy.position.set((Math.random() - 0.5) * 2000, 0, (Math.random() - 0.5) * 2000);
            mummy.rotation.y = Math.random() * Math.PI * 2;
            scene.add(mummy);
            colliders.push({ x: mummy.position.x, z: mummy.position.z, r: 4 });
            // تم إزالة الضوء النقطي لكل مومياء للتحسين
        }

        // تهيئة وحوش آلهة الشر والثعابين بشكل متناسق بعيد عن الزحام
        function spawnMonstersStrategically() {
            // توزيع المسوخ بالقرب من المعابد والتماثيل والحدود
            const monsterPoints = [];

            // 1. إضافة نقاط حول المعابد
            colliders.forEach(c => {
                if (c.r > 20) { // الأماكن الكبيرة فقط
                    monsterPoints.push({ x: c.x + c.r + 30, z: c.z + 30 });
                    monsterPoints.push({ x: c.x - c.r - 30, z: c.z - 30 });
                }
            });

            // 2. توزيع الباقي بشكل عشوائي ولكن متباعد
            for (let i = 0; i < 30; i++) {
                const x = (Math.random() - 0.5) * 2000;
                const z = (Math.random() - 0.5) * 2000;
                // التأكد من البعد عن إيزيس (نقطة البداية 200, 0, 800)
                const distToStart = Math.sqrt((x - 200) ** 2 + (z - 800) ** 2);
                if (distToStart > 300) {
                    let tooClose = false;
                    for (let p of monsterPoints) {
                        if (Math.sqrt((x - p.x) ** 2 + (z - p.z) ** 2) < 250) { tooClose = true; break; }
                    }
                    if (!tooClose) monsterPoints.push({ x, z });
                }
            }

            monsterPoints.forEach((p, i) => {
                let monster;
                const type = i % 3 === 0 ? 'snake' : (i % 2 === 0 ? 'set' : 'sobek');

                if (type === 'snake') {
                    const snakeData = createGiantCobra();
                    monster = {
                        group: snakeData.group,
                        segments: snakeData.segments,
                        active: true,
                        speed: 35 + Math.random() * 15,
                        damage: 25,
                        type: 'snake',
                        phase: Math.random() * Math.PI * 2,
                        idleRange: 40 + Math.random() * 40,
                        origin: new THREE.Vector3(p.x, 0, p.z)
                    };
                } else {
                    const g = createEvilGod(type);
                    monster = {
                        group: g,
                        active: true,
                        speed: 25 + Math.random() * 15,
                        damage: 20,
                        type: 'evil_god',
                        idlePos: new THREE.Vector3(p.x, 0, p.z),
                        origin: new THREE.Vector3(p.x, 0, p.z),
                        state: 'idle', // idle, alert, chase
                    };
                }
                monster.group.position.set(p.x, 0, p.z);
                monster.group.visible = false;
                scene.add(monster.group);
                enemies.push(monster);
            });
        }
        spawnMonstersStrategically();

        // دالة فحص الاصطدام المحسنة
        function checkCollision(x, z, radius = 5) {
            if (isModernTimes) {
                // حدود خريطة نوسا الحديثة (بيئة واسعة للعب)
                const diffX = Math.abs(x - MODERN_OFFSET_X);
                const diffZ = Math.abs(z - MODERN_OFFSET_Z);
                if (diffX > 1400 || diffZ > 1400) return true;
                return false; 
            }

            // فحص حدود الخريطة
            const limit = 1200;
            if (x > limit || x < -limit || z > limit || z < -limit) return true;

            // فحص الحواجز (المباني، الأهرامات، إلخ)
            let colliding = false;
            for (let c of colliders) {
                const distSq = (x - c.x) ** 2 + (z - c.z) ** 2;
                if (distSq < (c.r + radius) ** 2) {
                    colliding = true;
                    break;
                }
            }
            return colliding;
        }

        const gates = [];
        function createPharaonicGate() {
            const group = new THREE.Group();
            const stoneMat = new THREE.MeshPhongMaterial({ color: 0x8B7355 });
            const goldMat = new THREE.MeshPhongMaterial({ color: 0xFFD700, emissive: 0x887700 });

            // برجا البوابة (Pylons)
            for (let s of [-1, 1]) {
                const pylon = new THREE.Mesh(new THREE.CylinderGeometry(15, 20, 80, 4), stoneMat);
                pylon.position.set(s * 35, 40, 0); pylon.rotation.y = Math.PI / 4;
                group.add(pylon);
                // تماثيل حارسة فوق الأبراج
                const guard = createGodStatue(s === -1 ? 'anubis' : 'horus');
                guard.scale.set(1.5, 1.5, 1.5);
                guard.position.set(s * 35, 80, 0);
                group.add(guard);
            }

            // البوابات السحرية (Doors)
            const doorGeo = new THREE.BoxGeometry(30, 60, 4);
            const doorL = new THREE.Mesh(doorGeo, stoneMat);
            doorL.position.set(-15, 30, 0); group.add(doorL);
            const doorR = new THREE.Mesh(doorGeo, stoneMat);
            doorR.position.set(15, 30, 0); group.add(doorR);

            // نقوش ذهبية على البوابات
            const eye = new THREE.Mesh(new THREE.TorusGeometry(5, 0.5, 8, 20), goldMat);
            eye.position.set(0, 45, 3); group.add(eye);

            return { group, doorL, doorR, isOpen: false, angle: 0 };
        }

        function createTimePortal() {
            const group = new THREE.Group();
            
            // البوابة الزمنية العملاقة
            const portalGeo = new THREE.CircleGeometry(40, 32);
            const portalMat = new THREE.MeshBasicMaterial({ color: 0x00BFFF, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
            const portal = new THREE.Mesh(portalGeo, portalMat);
            portal.position.y = 40;
            group.add(portal);

            // دوامات الزمن السحرية
            const swirlGeo = new THREE.TorusGeometry(35, 2, 16, 100);
            const swirlMat = new THREE.MeshBasicMaterial({ color: 0xFFD700 });
            const swirl = new THREE.Mesh(swirlGeo, swirlMat);
            swirl.position.y = 40;
            group.add(swirl);

            const swirlOuterGeo = new THREE.TorusGeometry(45, 1, 16, 100);
            const swirlOuterMat = new THREE.MeshBasicMaterial({ color: 0x00FFFF });
            const swirlOuter = new THREE.Mesh(swirlOuterGeo, swirlOuterMat);
            swirlOuter.position.y = 40;
            group.add(swirlOuter);

            // ضوء سحري جبار
            const light = new THREE.PointLight(0x00FFFF, 5, 200);
            light.position.y = 40;
            group.add(light);

            // تماثيل آلهة فرعونية عملاقة إضافية لحراسة البوابة الزمنية
            const god1 = createGodStatue('horus');
            god1.scale.set(6, 6, 6);
            god1.position.set(50, 0, 15);
            god1.rotation.y = Math.PI / 8;
            group.add(god1);

            const god2 = createGodStatue('anubis');
            god2.scale.set(6, 6, 6);
            god2.position.set(-50, 0, 15);
            god2.rotation.y = -Math.PI / 8;
            group.add(god2);

            return { group, portal, swirl, swirlOuter };
        }

        // 5. إضافة حدود فرعونية حجرية ضخمة (Walls) وآلهة وبوابات
        function addMapBoundaries() {
            const wallH = 150;
            const size = 2500;
            const wallThickness = 25;

            // خامة الحجر المنقوش بسحر فرعوني
            const c = document.createElement('canvas'); c.width = 1024; c.height = 1024;
            const ctx = c.getContext('2d');
            ctx.fillStyle = '#6d4c41'; ctx.fillRect(0, 0, 1024, 1024);
            ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 8;
            for (let i = 0; i < 1024; i += 256) ctx.strokeRect(i, 0, 256, 1024);
            ctx.fillStyle = '#FFD700'; ctx.font = 'bold 80px "Font Awesome 6 Free", serif'; ctx.textAlign = 'center';
            ctx.shadowColor = '#FF4500'; ctx.shadowBlur = 20;
            ctx.fillText('𓂀 ☥ ☀️ 𓂀', 512, 150);
            ctx.fillText('نوسا البحر - حدود أوزوريس', 512, 400);
            ctx.fillText('𓂀 ☥ ☀️ 𓂀', 512, 650);

            const wallTex = new THREE.CanvasTexture(c);
            wallTex.wrapS = wallTex.wrapT = THREE.RepeatWrapping;
            wallTex.repeat.set(12, 1);
            const wallMat = new THREE.MeshPhongMaterial({ map: wallTex, emissive: 0x331100, emissiveIntensity: 0.2 });

            const walls = new THREE.Group();
            const positions = [
                { pos: [0, wallH / 2, -size / 2], rot: 0 },
                { pos: [0, wallH / 2, size / 2], rot: 0 },
                { pos: [size / 2, wallH / 2, 0], rot: Math.PI / 2 },
                { pos: [-size / 2, wallH / 2, 0], rot: Math.PI / 2 }
            ];

            const halfWallSide = (size - 100) / 2;
            const shortWall = new THREE.BoxGeometry(halfWallSide, wallH, wallThickness);

            positions.forEach((p, idx) => {
                // نصف الجدار الأول
                const w1 = new THREE.Mesh(shortWall, wallMat);
                // نصف الجدار الثاني
                const w2 = new THREE.Mesh(shortWall, wallMat);

                const offset = halfWallSide / 2 + 40;
                if (p.rot === 0) {
                    w1.position.set(p.pos[0] - offset, wallH / 2, p.pos[2]);
                    w2.position.set(p.pos[0] + offset, wallH / 2, p.pos[2]);
                } else {
                    w1.position.set(p.pos[0], wallH / 2, p.pos[2] - offset);
                    w2.position.set(p.pos[0], wallH / 2, p.pos[2] + offset);
                    w1.rotation.y = w2.rotation.y = Math.PI / 2;
                }
                walls.add(w1); walls.add(w2);

                // تحديث حواجز الاصطدام (تحذير: قد تحتاج لتحديث colliders هنا لكننا نعتمد على checkCollision الأصلي)
                // حدود العالم ثابتة لذا checkCollision كافٍ

                // إضافة آلهة فوق السور (تقليل للتحسين)
                for (let i = -2; i <= 2; i++) {
                    if (i === 0) continue; // مكان البوابة
                    const god = createGodStatue(ALL_GOD_TYPES[Math.abs(i + idx * 3) % ALL_GOD_TYPES.length]);
                    god.scale.set(2, 2, 2);
                    const offset = i * 400;
                    if (p.rot === 0) god.position.set(offset, wallH, p.pos[2]);
                    else god.position.set(p.pos[0], wallH, offset);
                    god.rotation.y = p.rot + Math.PI / 2;
                    walls.add(god);
                }

                // إضافة بوابة فرعونية في منتصف كل جدار
                const gateData = createPharaonicGate();
                gateData.group.position.set(...p.pos);
                gateData.group.position.y = 0; // البوابة من الأرض
                gateData.group.rotation.y = p.rot;
                scene.add(gateData.group);
                gates.push(gateData);

                // إضافة بوابة زمنية واحدة فقط لكل جدار (تقليل للتحسين)
                const tpData = createTimePortal();
                if (p.rot === 0) {
                    tpData.group.position.set(p.pos[0] + 600, 0, p.pos[2]);
                } else {
                    tpData.group.position.set(p.pos[0], 0, p.pos[2] + 600);
                }
                tpData.group.rotation.y = p.rot;
                scene.add(tpData.group);
                timePortals.push(tpData);
            });

            scene.add(walls);
        }
        // تم تأجيل استدعاء addMapBoundaries إلى نهاية السكريبت

        // الضربة بالسيف (Melee Attack)
        function swingSword() {
            if (isWinning || isSwinging) return;
            isSwinging = true;
            swingTimer = 0.25;
            playSwingSound(currentWeapon);

            // إذا كان السلاح هو "مفتاح الحياة"، أطلق الأشعة السحرية والرموز
            if (currentWeapon === 'ankh') {
                createAnkhProjectile();
            }
        }

        function createAnkhProjectile() {
            const symbols = ['☥', '𓂀', '☀️', '⚖️', '𓁹', '𓆃', '𓋹'];
            const symbol = symbols[Math.floor(Math.random() * symbols.length)];

            const canvas = document.createElement('canvas'); canvas.width = 128; canvas.height = 128;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#00FFFF'; ctx.font = 'bold 80px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.shadowColor = '#00FFFF'; ctx.shadowBlur = 15;
            ctx.fillText(symbol, 64, 64);
            const tex = new THREE.CanvasTexture(canvas);

            const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.9, side: THREE.DoubleSide });
            const mesh = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), mat);

            // الموقع عند يد إيزيس
            const startPos = playerGroup.position.clone();
            startPos.y += 18;
            mesh.position.copy(startPos);

            // الاتجاه بناءً على وجه إيزيس
            // الزاوية الكلية = تدوير المجموعة + تدوير إيزيس الداخلي
            const angle = playerGroup.rotation.y + isisBody.rotation.y - Math.PI;
            const dir = new THREE.Vector3(Math.sin(angle), 0, Math.cos(angle)).normalize();

            mesh.rotation.y = angle;

            // ضوء سحري مشع للقذيفة
            const light = new THREE.PointLight(0x00FFFF, 3, 30);
            mesh.add(light);

            scene.add(mesh);
            ankhProjectiles.push({ mesh, dir, life: 2.5, speed: 180 });
        }

        // مدخلات الزر
        // مدخلات الزر والمحمول
        const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, " ": false };
        let spacePressed = false;

        document.addEventListener('keydown', e => {
            if (keys.hasOwnProperty(e.key) || e.key === " ") {
                if (e.key === " ") { keys[" "] = true; if (!spacePressed) { swingSword(); spacePressed = true; } }
                else keys[e.key] = true;
            }
        });
        document.addEventListener('keyup', e => {
            if (keys.hasOwnProperty(e.key) || e.key === " ") {
                if (e.key === " ") { keys[" "] = false; spacePressed = false; }
                else keys[e.key] = false;
            }
        });

        // ربط أزرار الشاشة بالماوس واللمس - تحريك إيزيس يمين الشاشة
        function bindMoveBtn(id, key) {
            const btn = document.getElementById(id);
            if (!btn) return;
            const start = (e) => {
                e.preventDefault();
                e.stopPropagation();
                keys[key] = true;
                initializeGame(); // التأكد من تفعيل الصوت والبيئة
                if (key === " ") swingSword();
            };
            const end = (e) => {
                e.preventDefault();
                e.stopPropagation();
                keys[key] = false;
            };
            btn.addEventListener('mousedown', start, { capture: true });
            btn.addEventListener('mouseup', end, { capture: true });
            btn.addEventListener('mouseleave', end, { capture: true });
            btn.addEventListener('touchstart', start, { passive: false, capture: true });
            btn.addEventListener('touchend', end, { passive: false, capture: true });
        }
        bindMoveBtn('btn-up', 'ArrowUp');
        bindMoveBtn('btn-down', 'ArrowDown');
        bindMoveBtn('btn-left', 'ArrowLeft');
        bindMoveBtn('btn-right', 'ArrowRight');
        bindMoveBtn('btn-swing', ' ');

        function refillHealth() {
            playerHealth = 100; updateHealthUI();
        }
        function updateHealthUI() {
            const el = document.getElementById('health-fill');
            el.style.width = playerHealth + '%';
            if (playerHealth < 30) el.style.background = 'linear-gradient(90deg, #ff0000, #ff8800)';
            else el.style.background = 'linear-gradient(90deg, #00ff00, #55ff55)';
        }

        let isNight = false;
        let starsGroup, orionBelt, meteors = [], sun, moon, isisNightLight;

        function initSky() {
            // شمس ساطعة
            const sunGeo = new THREE.SphereGeometry(15, 32, 32);
            const sunMat = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
            sun = new THREE.Mesh(sunGeo, sunMat);
            sun.position.set(200, 300, -800);
            scene.add(sun);

            // قمر منير
            const moonGeo = new THREE.SphereGeometry(10, 32, 32);
            const moonMat = new THREE.MeshBasicMaterial({ color: 0xecf0f1 });
            moon = new THREE.Mesh(moonGeo, moonMat);
            moon.position.set(-200, 300, -800);
            moon.visible = false;
            scene.add(moon);

            // نجوم (تحسين استخدام Points بدلاً من 500 كائن منفصل)
            starsGroup = new THREE.Group();
            
            const starsGeo = new THREE.BufferGeometry();
            const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 2.5 });
            const starsVertices = [];
            for (let i = 0; i < 500; i++) {
                starsVertices.push(
                    (Math.random() - 0.5) * 2000,
                    300 + Math.random() * 200,
                    (Math.random() - 0.5) * 2000
                );
            }
            starsGeo.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
            const starPoints = new THREE.Points(starsGeo, starsMat);
            starsGroup.add(starPoints);
            
            starsGroup.visible = false;
            scene.add(starsGroup);

            // حزام أوريون (ثلاث نجوم مصطفة)
            orionBelt = new THREE.Group();
            for (let i = 0; i < 3; i++) {
                const star = new THREE.Mesh(new THREE.SphereGeometry(1.5, 6, 6), new THREE.MeshBasicMaterial({ color: 0x88ccff }));
                star.position.set(i * 10, 0, 0);
                orionBelt.add(star);
            }
            orionBelt.position.set(100, 450, -600);
            orionBelt.rotation.z = Math.PI / 4;
            orionBelt.visible = false;
            scene.add(orionBelt);

            // ضوء إيزيس الليلي (PointLight)
            isisNightLight = new THREE.PointLight(0xffd700, 0, 60);
            scene.add(isisNightLight);
        }
        initSky();

        function createMeteor() {
            const m = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 10), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true }));
            m.position.set((Math.random() - 0.5) * 1000, 500, (Math.random() - 0.5) * 1000);
            m.velocity = new THREE.Vector3(2, -2, 2);
            m.visible = isNight;
            scene.add(m);
            meteors.push(m);
        }

        window.toggleNightMode = function () {
            isNight = !isNight;
            const btn = document.getElementById('toggle-night-btn');
            if (isNight) {
                btn.innerHTML = 'وضع النهار <i class="fa-solid fa-sun"></i>';
                btn.style.background = "#FFD700"; btn.style.color = "#000";
                scene.background = new THREE.Color(0x050b18);
                scene.fog.color = new THREE.Color(0x050b18);
                scene.fog.density = 0.003;
                sun.visible = false; moon.visible = true;
                starsGroup.visible = true; orionBelt.visible = true;
                ambientLight.intensity = 0.1;
                isisNightLight.intensity = 1.8;
            } else {
                btn.innerHTML = 'وضع الليل <i class="fa-solid fa-moon"></i>';
                btn.style.background = "#2c3e50"; btn.style.color = "#fff";
                scene.background = new THREE.Color(0x87CEEB);
                scene.fog.color = new THREE.Color(0x87CEEB);
                scene.fog.density = 0.002;
                sun.visible = true; moon.visible = false;
                starsGroup.visible = false; orionBelt.visible = false;
                ambientLight.intensity = 0.8;
                isisNightLight.intensity = 0;
            }
        };

        // تأثير سحر مرور إيزيس الطائرة كروح (محسّن)
        function createPassThroughMagicEffect(pos) {
            const p = new THREE.Mesh(
                new THREE.SphereGeometry(1.2, 6, 6),
                new THREE.MeshBasicMaterial({ color: 0x00FFFF, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending })
            );
            p.position.copy(pos);
            p.position.y += Math.random() * 15;
            p.position.x += (Math.random() - 0.5) * 8;
            p.position.z += (Math.random() - 0.5) * 8;
            scene.add(p);
            soulTrailParticles.push({ mesh: p, life: 1.0, vel: 10 + Math.random() * 10 });
        }

        let uiVisible = true;
        window.toggleUI = function () {
            uiVisible = !uiVisible;
            const btn = document.getElementById('ui-toggle-btn');
            const elementsToToggle = [
                document.getElementById('minimap-wrapper'),
                document.getElementById('camera-sidebar'),
                document.getElementById('movement-controls'),
                document.getElementById('isis-portrait-container')
            ];

            if (uiVisible) {
                btn.innerHTML = 'إخفاء الخريطة والأزرار <i class="fa-solid fa-map"></i>';
                elementsToToggle.forEach(el => el.classList.remove('ui-hide-element'));
            } else {
                btn.innerHTML = 'إظهار الخريطة والأزرار <i class="fa-solid fa-map"></i>';
                elementsToToggle.forEach(el => el.classList.add('ui-hide-element'));
            }
        };

        // تحكم الماوس الأيسر في الكاميرا
        let isLeftDown = false;
        let lastMouseX = 0, lastMouseY = 0;
        document.addEventListener('mousedown', e => {
            if (e.button === 0) {
                isLeftDown = true;
                lastMouseX = e.clientX;
                lastMouseY = e.clientY;
            }
        });
        document.addEventListener('mouseup', e => { if (e.button === 0) isLeftDown = false; });
        document.addEventListener('mousemove', e => {
            if (isLeftDown) {
                const deltaX = e.clientX - lastMouseX;
                const deltaY = e.clientY - lastMouseY;
                manualCamAngle += deltaX * 0.01;
                manualCamY = Math.max(-20, Math.min(200, manualCamY + deltaY * 0.5));
                lastMouseX = e.clientX;
                lastMouseY = e.clientY;
            }
        });

        // استعمال بكرة الماوس للتكبير والتصغير
        document.addEventListener('wheel', (e) => {
            // تجاهل الحدث إذا كان فوق الخريطة المصغرة
            if (e.target.id === 'minimap-canvas') return;

            if (e.deltaY > 0) {
                window.zoomGameCamera('out');
            } else {
                window.zoomGameCamera('in');
            }
        }, { passive: true });

        window.toggleMonsters = function () {
            monstersEnabled = !monstersEnabled;
            const btn = document.getElementById('toggle-monsters-btn');
            if (monstersEnabled) {
                btn.innerHTML = 'إخفاء المسوخ <i class="fa-solid fa-ghost"></i>';
                btn.style.background = "#8b0000";
                enemies.forEach(e => { if (e.active) e.group.visible = true; });
            } else {
                btn.innerHTML = 'إظهار المسوخ <i class="fa-solid fa-ghost"></i>';
                btn.style.background = "#006400";
                enemies.forEach(e => { e.group.visible = false; });
            }
        };

        // === الخريطة المصغرة التفاعلية التحريكية ===
        const minimapCanvasOverlay = document.getElementById('minimap-canvas');
        const mCtx = minimapCanvasOverlay.getContext('2d');

        let mapPanX = 0, mapPanY = 0;
        let isMapTracking = true;
        let mapZoomSize = 600; // حجم نافذة التكبير الافتراضي

        // تكبير وتصغير الخريطة بعجلة الماوس
        minimapCanvasOverlay.addEventListener('wheel', (e) => {
            e.preventDefault();
            // تصغير/تكبير بمقدار 100 بيكسل إحداثي مع كل عجلة
            if (e.deltaY > 0) mapZoomSize = Math.min(2048, mapZoomSize + 150); // Zoom out
            else mapZoomSize = Math.max(200, mapZoomSize - 150); // Zoom in

            isMapTracking = false; // فك التتبع عند التحكم اليدوي
            // تصحيح الحدود عند التكبير/التصغير
            if (mapPanX > 2048 - mapZoomSize) mapPanX = 2048 - mapZoomSize;
            if (mapPanY > 2048 - mapZoomSize) mapPanY = 2048 - mapZoomSize;
            updateMinimap();
        }, { passive: false });

        // نجعل الدالة متاحة عالمياً لتعمل مع أزرار HTML
        window.panMap = function (dx, dy) {
            isMapTracking = false;
            mapPanX += dx; mapPanY += dy;
            if (mapPanX < 0) mapPanX = 0; if (mapPanX > 2048 - mapZoomSize) mapPanX = 2048 - mapZoomSize;
            if (mapPanY < 0) mapPanY = 0; if (mapPanY > 2048 - mapZoomSize) mapPanY = 2048 - mapZoomSize;
            updateMinimap(); // تحديث فوري عند الضغط
        };
        window.resetMap = function () { isMapTracking = true; updateMinimap(); };

        // دوال تحكم شاشة البيئة (الكاميرا والملء الكامل)
        let mainCameraFov = 60;
        window.zoomGameCamera = function (direction) {
            if (direction === 'in') {
                mainCameraFov = Math.max(30, mainCameraFov - 5);
            } else {
                mainCameraFov = Math.min(100, mainCameraFov + 5);
            }
            camera.fov = mainCameraFov;
            camera.updateProjectionMatrix();
        };

        window.toggleFullScreen = function () {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    alert(`تعذر الدخول في وضع الشاشة الكاملة: ${err.message}`);
                });
            } else {
                document.exitFullscreen();
            }
        };

        // تأثير سحر مرور إيزيس الطائرة كروح
        function createPassThroughMagicEffect(pos) {
            const symbols = ['☥', '𓋹', '𓂀', 'سحر إيزيس', 'روح إيزيس'];
            const text = symbols[Math.floor(Math.random() * symbols.length)];
            const msg = document.createElement('div');
            
            msg.style.position = 'absolute';
            const vector = pos.clone();
            vector.y += 20;
            vector.project(camera);
            const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
            const y = (-(vector.y * 0.5) + 0.5) * window.innerHeight;
            
            msg.style.left = x + 'px';
            msg.style.top = y + 'px';
            msg.style.color = '#00FFFF';
            msg.style.fontWeight = 'bold';
            msg.style.fontSize = '32px';
            msg.style.fontFamily = '"Aref Ruqaa", "Noto Sans Egyptian Hieroglyphs", serif';
            msg.style.textShadow = '0 0 15px #00FFFF, 0 0 25px #FFD700';
            msg.style.pointerEvents = 'none';
            msg.style.transition = 'all 1.5s ease-out';
            msg.style.zIndex = '9999';
            msg.innerHTML = text;
            document.body.appendChild(msg);
            
            setTimeout(() => {
                msg.style.transform = 'translateY(-200px) scale(1.5)';
                msg.style.opacity = '0';
                setTimeout(() => {
                    if (document.body.contains(msg)) document.body.removeChild(msg);
                }, 1500);
            }, 50);

            // جسيمات روحية
            for(let i=0; i<3; i++) {
                const p = new THREE.Mesh(
                    new THREE.SphereGeometry(1.2, 8, 8),
                    new THREE.MeshBasicMaterial({ color: 0x00FFFF, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending })
                );
                p.position.copy(pos);
                p.position.y += Math.random() * 15;
                p.position.x += (Math.random() - 0.5) * 8;
                p.position.z += (Math.random() - 0.5) * 8;
                scene.add(p);
                
                let life = 1.0;
                const animateParticle = () => {
                    life -= 0.05;
                    p.position.y += 1.0;
                    p.scale.setScalar(life);
                    p.material.opacity = life;
                    if (life > 0) requestAnimationFrame(animateParticle);
                    else scene.remove(p);
                };
                animateParticle();
            }
        }

        let lastMinimapUpdate = 0;
        function updateMinimap() {
            // تحسين الأداء (منع هانج اللعبة) بتحديث الخريطة فقط مرات محددة بالثانية
            const now = Date.now();
            if (now - lastMinimapUpdate < 100) return; // تحسين: تحديث كل 100ms بدلاً من 50ms
            lastMinimapUpdate = now;

            // World to map scale
            const toMiniScale = 2048 / 2500;
            let isisMapX = (playerGroup.position.x + 1250) * toMiniScale;
            let isisMapY = (playerGroup.position.z + 1250) * toMiniScale;

            if (isMapTracking) {
                mapPanX = isisMapX - (mapZoomSize / 2);
                mapPanY = isisMapY - (mapZoomSize / 2);
                if (mapPanX < 0) mapPanX = 0; if (mapPanX > 2048 - mapZoomSize) mapPanX = 2048 - mapZoomSize;
                if (mapPanY < 0) mapPanY = 0; if (mapPanY > 2048 - mapZoomSize) mapPanY = 2048 - mapZoomSize;
            }

            mCtx.clearRect(0, 0, 250, 250);

            // رسم المنطقة المكبرة (mapZoomSize) على الكانفاس الحقيقي (250x250)
            mCtx.drawImage(mapCanvas, mapPanX, mapPanY, mapZoomSize, mapZoomSize, 0, 0, 250, 250);

            // رسم الكائنات بالنسبة للنافذة المكبرة الديناميكية
            const drawDot = (mx, my, color, radius) => {
                if (mx >= mapPanX && mx <= mapPanX + mapZoomSize && my >= mapPanY && my <= mapPanY + mapZoomSize) {
                    let cx = ((mx - mapPanX) / mapZoomSize) * 250;
                    let cy = ((my - mapPanY) / mapZoomSize) * 250;
                    mCtx.fillStyle = color; mCtx.beginPath(); mCtx.arc(cx, cy, radius, 0, Math.PI * 2); mCtx.fill(); mCtx.strokeStyle = '#000'; mCtx.stroke();
                }
            };

            // رسم التوابيت كعلامات ذهبية
            parts.forEach(p => { if (p.active) drawDot((p.group.position.x + 1250) * toMiniScale, (p.group.position.z + 1250) * toMiniScale, '#FFD700', 6); });

            // رسم إيزيس مع مؤشر الاتجاه
            if (isisMapX >= mapPanX && isisMapX <= mapPanX + mapZoomSize && isisMapY >= mapPanY && isisMapY <= mapPanY + mapZoomSize) {
                let ix = ((isisMapX - mapPanX) / mapZoomSize) * 250;
                let iy = ((isisMapY - mapPanY) / mapZoomSize) * 250;
                mCtx.fillStyle = '#fa4b4b';
                mCtx.beginPath(); mCtx.arc(ix, iy, 7, 0, Math.PI * 2); mCtx.fill();
                mCtx.save(); mCtx.translate(ix, iy); mCtx.rotate(-playerGroup.rotation.y);
                mCtx.fillStyle = '#fff'; mCtx.beginPath(); mCtx.moveTo(0, -12); mCtx.lineTo(-6, 0); mCtx.lineTo(6, 0); mCtx.fill();
                mCtx.restore();
            }
        }


        function initOsirisSouls() {
            const container = document.getElementById('soul-particles-container');
            container.innerHTML = '';
            for (let i = 0; i < 40; i++) {
                const soul = document.createElement('div');
                soul.className = 'osiris-soul-particle';
                soul.style.left = Math.random() * 100 + 'vw';
                soul.style.top = Math.random() * 100 + 'vh';
                soul.style.animationDelay = Math.random() * 5 + 's';
                soul.style.width = (5 + Math.random() * 15) + 'px';
                soul.style.height = soul.style.width;
                container.appendChild(soul);
            }
        }
        initOsirisSouls();

        // تهيئة إيزيس النهائية
        isisData = createIsisModel();
        playerGroup = isisData.group;
        ankhGroup = isisData.ankhGroup;
        swordGroup = isisData.swordGroup;
        isisBody = isisData.isisBody;
        mainHalo = isisData.halo;
        legR = isisData.legR;
        legL = isisData.legL;
        playerGroup.position.set(200, 0, 800);
        scene.add(playerGroup);

        const cameraOffset = new THREE.Vector3(20, 30, 50);
        const clock = new THREE.Clock();

        let targetSpeed = 0;
        let currentSpeed = 0;
        let targetRotSpeed = 0;
        let currentRotSpeed = 0;
        let lastOpacityState = 'solid'; // تحسين: تتبع آخر حالة شفافية لتجنب الحسابات المتكررة
        let portraitFrameCounter = 0; // تحسين: عداد لتقليل تحديث البورتريه

        function animate() {
            requestAnimationFrame(animate);
            const delta = Math.min(clock.getDelta(), 0.1);
            const time = clock.getElapsedTime();

            if (!isWinning) {
                // نظام الحركة رباعي الاتجاهات: أمام، خلف، يمين، يسار
                let moveX = 0;
                let moveZ = 0;
                if (keys.ArrowUp) moveZ = -1;
                else if (keys.ArrowDown) moveZ = 1;

                if (keys.ArrowLeft) moveX = -1;
                else if (keys.ArrowRight) moveX = 1;

                if (moveX !== 0 || moveZ !== 0) {
                    targetSpeed = 85;
                    currentSpeed += (targetSpeed - currentSpeed) * 8 * delta;

                    // تحديد اتجاه الحركة بناءً على الكاميرا والتدوير الحالي
                    const moveDir = new THREE.Vector3(moveX, 0, moveZ).normalize();

                    // حساب زاوية الوجه (Facing Direction) لتواجه إيزيس اتجاه حركتها
                    // Atan2(x, z) يعطي الزاوية الصحيحة، وبما أن الوجه الأصلي للموديل هو PI
                    const targetIsisRot = Math.atan2(moveX, moveZ);
                    isisBody.rotation.y = THREE.MathUtils.lerp(isisBody.rotation.y, targetIsisRot, 0.15);

                    // الحركة الفعلية في العالم بناءً على اتجاه الكاميرا الافتراضي
                    const worldDir = moveDir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), playerGroup.rotation.y);
                    const moveStep = worldDir.multiplyScalar(currentSpeed * delta);

                    const nx = playerGroup.position.x + moveStep.x;
                    const nz = playerGroup.position.z + moveStep.z;

                    // التحقق من الحواجز لمنع الاختراق أو العبور السحري للروح عند الاصطدام لليمين فقط
                    let isColliding = checkCollision(nx, nz, 12);
                    let canPassThrough = false;

                    // زر الحركة لليمين يحول ايزيس الى روح تخترق الحواجز عند ملاقاة الحواجز
                    if (keys.ArrowRight && isColliding) {
                        canPassThrough = true;
                    }

                    if (!isColliding || canPassThrough) {
                        playerGroup.position.x = nx;
                        playerGroup.position.z = nz;
                    }

                    // تحسين: تغيير الشفافية فقط عند تغير الحالة
                    const newOpacityState = canPassThrough ? 'ghost' : 'solid';
                    if (newOpacityState !== lastOpacityState) {
                        lastOpacityState = newOpacityState;
                        const targetOpacity = canPassThrough ? 0.4 : 1.0;
                        isisBody.traverse(child => {
                            if (child.material) {
                                child.material.transparent = true;
                                child.material.opacity = targetOpacity;
                            }
                        });
                    }

                    if (canPassThrough && Math.random() < 0.05) {
                        createPassThroughMagicEffect(playerGroup.position);
                    }

                    // أنيميشن المشي
                    const walkCycle = Math.sin(time * 18);
                    legR.rotation.x = walkCycle * 0.6;
                    legL.rotation.x = -walkCycle * 0.6;

                    if (Math.abs(walkCycle) > 0.95 && Math.random() < 0.2) playFootstepSound();
                } else {
                    currentSpeed += (0 - currentSpeed) * 8 * delta;
                    legR.rotation.x += (0 - legR.rotation.x) * 0.1;
                    legL.rotation.x += (0 - legL.rotation.x) * 0.1;
                    // تحسين: إعادة الشفافية فقط إذا كانت متغيرة
                    if (lastOpacityState !== 'solid') {
                        lastOpacityState = 'solid';
                        isisBody.traverse(child => {
                            if (child.material) {
                                child.material.transparent = true;
                                child.material.opacity = 1.0;
                            }
                        });
                    }
                }

                isisNightLight.position.set(playerGroup.position.x, playerGroup.position.y + 10, playerGroup.position.z);

                const px = playerGroup.position.x;
                if (px > -230 && px < -70) {
                    if (!isOnBoat) { isOnBoat = true; boatGroup.visible = true; }
                    boatGroup.position.copy(playerGroup.position);
                    boatGroup.position.y = 1;
                    boatGroup.rotation.y = playerGroup.rotation.y;
                } else {
                    if (isOnBoat) { isOnBoat = false; boatGroup.visible = false; }
                }

                if (isSwinging) {
                    swingTimer -= delta;
                    const rotationArm = isisData.armR;
                    rotationArm.rotation.x = -1.5 + Math.sin((0.25 - swingTimer) * 12) * 2;
                    if (swingTimer <= 0) {
                        isSwinging = false;
                        rotationArm.rotation.x = 0;
                    }
                }



                if (monstersEnabled) {
                    enemies.forEach(e => {
                        if (!e.active) return;
                        const distToPlayer = e.group.position.distanceTo(playerGroup.position);

                        // الذكاء الاصطناعي للمسوخ: لا تهاجم تلقائياً إلا إذا اقتربت جداً
                        if (distToPlayer < 400) {
                            if (Math.random() < 0.003) playMonsterMoan(); // أصوات عشوائية من بعيد

                            // المطاردة فقط عند القرب الشديد (150 وحدة)
                            if (distToPlayer < 180) {
                                e.state = 'chase';
                                const targetPos = playerGroup.position.clone();
                                e.group.lookAt(targetPos.x, e.group.position.y, targetPos.z);

                                let moveVel = e.speed * delta;
                                // فحص الجدران للمسوخ (لا يخترقون الحواجز)
                                const futureX = e.group.position.x + Math.sin(e.group.rotation.y) * moveVel;
                                const futureZ = e.group.position.z + Math.cos(e.group.rotation.y) * moveVel;

                                if (!checkCollision(futureX, futureZ, 8)) {
                                    e.group.translateZ(moveVel);
                                }

                                // حركة مرعبة (اهتزاز وتمايل)
                                e.group.position.y = 1 + Math.abs(Math.sin(time * 12)) * 3;
                            } else {
                                // وضعية الانتظار أو الدوران حول الموقع (Idle)
                                e.state = 'idle';
                                e.group.rotation.y += delta * 0.5; // دوران بطيء مخيف
                                e.group.position.y = 1 + Math.sin(time * 2) * 1.5;
                            }

                            if (e.type === 'snake') {
                                if (Math.random() < 0.01) playSnakeHiss();
                                // حركة ثعبانية متموجة ومرعبة جداً بتناسق
                                e.phase += delta * 5;
                                e.segments.forEach((seg, i) => {
                                    const wave = Math.sin(e.phase - i * 0.5);
                                    seg.position.x = wave * 6;
                                    seg.position.y = Math.cos(e.phase - i * 0.5) * 2 + 3;
                                    // دوران القطع لتتبع الانحناء
                                    seg.rotation.y = wave * 0.5;
                                });
                            }
                        } else {
                            // المسوخ بعيدة جداً: تبقى ساكنة
                            e.state = 'idle';
                            e.group.position.y = 1;
                        }

                        // التفاعل مع اللاعب (إصابة إيزيس)
                        if (distToPlayer < 18 && !isSwinging) {
                            if (playerHealth > 0) {
                                playerHealth = Math.max(0, playerHealth - e.damage * delta * 1.5);
                                updateHealthUI();
                                if (Math.random() < 0.1) playMonsterMoan();
                            }
                        }

                        // ضرب المسخ بالسيف
                        if (distToPlayer < 35 && isSwinging) {
                            const dirToEnemy = e.group.position.clone().sub(playerGroup.position).normalize();
                            const playerDir = new THREE.Vector3(0, 0, -1).applyEuler(playerGroup.rotation);
                            if (playerDir.angleTo(dirToEnemy) < Math.PI / 1.3) {
                                e.active = false;
                                createMagicBlast(e.group.position.clone());
                                playHitSound(); // صوت ضرب متناسق
                                scene.remove(e.group);
                                killCount++;
                                document.getElementById('kills').innerText = killCount;
                            }
                        }
                    });

                    // تحديث أشعة ورموز مفتاح الحياة (Ankh Rays)
                    for (let i = ankhProjectiles.length - 1; i >= 0; i--) {
                        const p = ankhProjectiles[i];
                        p.mesh.position.add(p.dir.clone().multiplyScalar(p.speed * delta));
                        p.mesh.rotation.z += delta * 10; // دوران رمزي
                        p.life -= delta;

                        // فحص اصطدام الأشعة بالأعداء
                        let hit = false;
                        enemies.forEach(e => {
                            if (e.active && p.mesh.position.distanceTo(e.group.position) < 25) {
                                hit = true;
                                e.active = false;
                                scene.remove(e.group);
                                createMagicBlast(e.group.position.clone());
                                playHitSound();
                                killCount++;
                                document.getElementById('kills').innerText = killCount;
                            }
                        });

                        if (hit || p.life <= 0) {
                            scene.remove(p.mesh);
                            ankhProjectiles.splice(i, 1);
                        }
                    }
                }

                let minDistToPart = 10000;
                parts.forEach((p, idx) => {
                    if (p.active) {
                        p.group.rotation.y += delta * 0.5;
                        if (p.arrow) p.arrow.position.y = Math.sin(time * 3 + p.offset) * 3 + 12;

                        // حركة سحرية للجزء المفقود فوق التابوت
                        if (p.partModel) {
                            p.partModel.position.y = 8 + Math.sin(time * 2 + p.offset) * 1.5;
                            p.partModel.rotation.y += delta * 2;
                        }

                        // تحريك الروح الشفافة (Spectral Soul)
                        if (p.soul) {
                            p.soul.material.opacity = 0.4 + Math.sin(time * 3 + p.offset) * 0.2;
                            p.soul.position.y = 15 + Math.sin(time * 1.5 + p.offset) * 2;
                            p.soul.scale.setScalar(1 + Math.sin(time * 2 + p.offset) * 0.1);
                        }

                        // دوران الاسم السحري الكبير حول رأس أوزوريس في التابوت
                        if (p.guardian && p.guardian.userData.rotatingText) {
                            p.guardian.userData.rotatingText.rotation.y -= delta * 1.5;
                            p.guardian.userData.rotatingText.position.y = 10 + Math.sin(time * 2.5 + p.offset) * 2.5; 
                        }

                        const distToPart = playerGroup.position.distanceTo(p.group.position);
                        if (distToPart < minDistToPart) minDistToPart = distToPart;

                        if (distToPart < 85) {
                            // حركة سحب سحرية ناعمة (جذب مغناطيسي فرعوني)
                            const attractionStrength = Math.max(20, 100 - distToPart);
                            const dirToPart = p.group.position.clone().sub(playerGroup.position).normalize();
                            playerGroup.position.add(dirToPart.multiplyScalar(attractionStrength * delta));

                            // هالة سحرية تظهر عند الجذب
                            mainHalo.material.opacity = 0.8;
                            mainHalo.scale.setScalar(1.5);

                            if (distToPart < 12) {
                                p.active = false;
                                showBodyPartUI(idx, p.group);
                            }
                        }
                    }
                });

                // معالجة البوابات والعبور للعالم الآخر
                gates.forEach(g => {
                    const dist = playerGroup.position.distanceTo(g.group.position);
                    if (dist < 120) {
                        if (!g.isOpen) {
                            g.isOpen = true;
                            playGateSound(); // تشغيل صوت فتح البوابة
                        }
                        // الانتقال للعالم الآخر أو الكهف السحري عند عبور البوابة
                        if (dist < 35) {
                            if (!isUnderworld) {
                                // اختيار عالم عشوائي: عالم الموتى أو الكهف السحري
                                if (Math.random() > 0.5) enterUnderworld();
                                else enterMagicalCave();
                            }
                        }
                    } else {
                        g.isOpen = false;
                    }

                    // تحريك أبواب البوابة
                    const targetAngle = g.isOpen ? Math.PI / 1.8 : 0;
                    g.angle = THREE.MathUtils.lerp(g.angle, targetAngle, 0.08);
                    g.doorL.rotation.y = g.angle;
                    g.doorR.rotation.y = -g.angle;

                    // أصوات غامضة عند الاقتراب من البوابات الفرعونية
                    if (dist < 200 && Math.random() < 0.01) playMysteriousWhisper();
                });

                // معالجة العبور للبوابات الزمنية لزمن جوجل ماب (الحاضر)
                timePortals.forEach(tp => {
                    const dist = playerGroup.position.distanceTo(tp.group.position);
                    tp.swirl.rotation.z += delta * 2;
                    tp.swirlOuter.rotation.z -= delta * 1.5;
                    tp.portal.material.opacity = 0.5 + Math.sin(time * 5) * 0.3;
                    
                    if (dist < 40 && !isModernTimes) {
                        enterModernNusa();
                    }
                });

                // معالجة حركة التابوت والروح الطائرة للسماء (مع أثر نجوم ذهبية)
                if (activeCollection) {
                    activeCollection.time += delta;
                    const t = activeCollection.time;

                    // التابوت والشكل يصغران ويختفيان
                    activeCollection.coffin.scale.setScalar(Math.max(0.01, 1 - t * 2));
                    activeCollection.coffin.position.y += 0.5 * delta * 60;

                    // الروح الشفافة تطير للسماء
                    if (activeCollection.soul) {
                        const soulPos = new THREE.Vector3();
                        activeCollection.soul.getWorldPosition(soulPos);

                        activeCollection.soul.position.y += 180 * delta;
                        activeCollection.soul.scale.setScalar(1 + t * 4);
                        activeCollection.soul.material.opacity = Math.max(0, 0.8 - t * 0.8);

                        // توليد نجوم ذهبية خلف الروح (أثر) - مخفف
                        if (t < 1.2 && Math.random() < 0.15) {
                            const starGeo = new THREE.SphereGeometry(0.8, 4, 4);
                            const starMat = new THREE.MeshBasicMaterial({ color: 0xFFD700, transparent: true });
                            const star = new THREE.Mesh(starGeo, starMat);
                            star.position.copy(soulPos);
                            star.position.x += (Math.random() - 0.5) * 8;
                            star.position.z += (Math.random() - 0.5) * 8;
                            scene.add(star);
                            soulTrailParticles.push({ mesh: star, life: 1.0, vel: (Math.random() * 20 + 10) });
                        }
                    }

                    updateConnector(activeCollection.pos);

                    if (t >= 1.5) {
                        scene.remove(activeCollection.coffin);
                        activeCollection = null;
                    }
                }

                // حركة أثر النجوم الذهبية
                for (let i = soulTrailParticles.length - 1; i >= 0; i--) {
                    const sp = soulTrailParticles[i];
                    sp.life -= delta * 1.5;
                    sp.mesh.position.y -= sp.vel * delta; // تساقط خفيف
                    sp.mesh.material.opacity = sp.life;
                    sp.mesh.scale.setScalar(sp.life);
                    if (sp.life <= 0) {
                        scene.remove(sp.mesh);
                        soulTrailParticles.splice(i, 1);
                    }
                }

                updateAmbientVolume(minDistToPart);


                updateMinimap();

                const camDist = 70 + Math.abs(currentSpeed) * 0.15;
                const camHeight = 40 + manualCamY;
                const camSideOffset = 0; // تم إلغاء الإزاحة الجانبية للتدوير القديم
                const idealOffset = new THREE.Vector3(camSideOffset, camHeight, camDist).applyAxisAngle(new THREE.Vector3(0, 1, 0), playerGroup.rotation.y + manualCamAngle);
                const idealPos = playerGroup.position.clone().add(idealOffset);

                if (isNight) {
                    if (Math.random() < 0.02) createMeteor();
                    meteors.forEach((m, idx) => {
                        m.position.add(m.velocity);
                        m.material.opacity -= 0.02;
                        if (m.material.opacity <= 0) {
                            scene.remove(m); meteors.splice(idx, 1);
                        }
                    });
                    starsGroup.rotation.y += delta * 0.01;
                    orionBelt.rotation.y += delta * 0.01;
                    moon.position.x = Math.sin(time * 0.1) * 300;
                    moon.position.z = Math.cos(time * 0.1) * 800;
                } else {
                    sun.position.x = Math.sin(time * 0.1) * 300;
                    sun.position.z = Math.cos(time * 0.1) * 800;
                }

                camera.position.lerp(idealPos, 0.08);
                const lookAtTarget = playerGroup.position.clone();
                lookAtTarget.y += 15;
                camera.lookAt(lookAtTarget);

                mainHalo.rotation.z += delta * 2;
                const haloIntensity = 0.3 + Math.abs(currentSpeed / 70) * 0.4;
                mainHalo.material.opacity = haloIntensity + Math.sin(time * 5) * 0.1;
                mainHalo.scale.setScalar(1 + Math.sin(time * 2) * 0.05);

                // تحسين: تحديث البورتريه كل 3 إطارات فقط
                portraitFrameCounter++;
                if (portraitFrameCounter % 3 === 0) updatePortrait(delta * 3);
            } else if (isWinning) {
                // تأثير اهتزاز السماء والكاميرا للمشهد النهائي
                if (skyShakeTime > 0) {
                    skyShakeTime -= delta;
                    camera.position.x += (Math.random() - 0.5) * 2;
                    camera.position.y += (Math.random() - 0.5) * 2;
                    scene.background.lerp(new THREE.Color(0xFFFFFF), 0.02);
                    scene.fog.color.lerp(new THREE.Color(0xFFFFFF), 0.02);
                } else {
                    scene.background.lerp(new THREE.Color(0xFFD700), 0.01);
                    scene.fog.color.lerp(new THREE.Color(0xFFD700), 0.01);
                }

                if (osirisGroup) {
                    const cameraCapture = osirisGroup.position.clone().lerp(playerGroup.position, 0.5);
                    cameraCapture.y += 20;
                    camera.position.lerp(new THREE.Vector3(cameraCapture.x + 40, cameraCapture.y + 20, cameraCapture.z + 60), 0.05);
                    camera.lookAt(cameraCapture);
                }

                playerGroup.rotation.y += delta * 0.2;
            }
            renderer.render(scene, camera);
        }

        // الانتقال للعالم الآخر (عالم الموتى - دوات)
        function enterUnderworld() {
            if (isUnderworld) return;
            isUnderworld = true;
            triggerTransition('عالم الموتى - ممرات دوات', 0x1a052d, 0x0a0015, 0x9400D3);
        }

        // الكهف السحري
        function enterMagicalCave() {
            if (isUnderworld) return; 
            isUnderworld = true;
            triggerTransition('الكهف السحري - كنوز الفراعنة', 0x2c1b0e, 0x1a1a00, 0xFFD700);

            for (let i = 0; i < 30; i++) {
                const s = createSymbolsField();
                s.position.set((Math.random() - 0.5) * 1000, 0, (Math.random() - 0.5) * 1000);
                scene.add(s);
            }
        }

        // رسم خريطة (جوجل ماب) نوسا البحر الحديثة كأرضية
        function createNusaMapTexture() {
            const c = document.createElement('canvas'); c.width = 1024; c.height = 1024;
            const ctx = c.getContext('2d');
            
            // خلفية البيئة الحديثة
            ctx.fillStyle = '#e0e0e0'; ctx.fillRect(0, 0, 1024, 1024);
            
            // النيل وأفرعه (رياح جوجل ماب)
            ctx.fillStyle = '#2196F3';
            ctx.fillRect(400, 0, 60, 1024);
            
            // الأراضي الزراعية والمناطق الخضراء التي تميز نوسا البحر وأجا بالدقهلية
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(0, 0, 380, 1024);
            ctx.fillRect(480, 0, 544, 1024);
            
            // شوارع ومباني نوسا البحر الحديثة
            ctx.lineWidth = 12; ctx.strokeStyle = '#9e9e9e';
            for(let i=100; i<1000; i+=250) {
                ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(1024, i); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 1024); ctx.stroke();
            }
            
            // علامات ونقاط على الخريطة
            ctx.fillStyle = '#FFC107'; ctx.beginPath(); ctx.arc(200, 200, 20, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#FFC107'; ctx.beginPath(); ctx.arc(800, 800, 20, 0, Math.PI*2); ctx.fill();

            // كتابة جوجل ماب نوسا البحر بشكل جمالي
            ctx.fillStyle = '#e91e63';
            ctx.font = 'bold 50px "Aref Ruqaa", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('📍 نوسا البحر - الدقهلية', 512, 100);
            ctx.font = 'bold 30px Arial';
            ctx.fillText('Google Maps Area', 512, 150);
            
            const tex = new THREE.CanvasTexture(c);
            tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(5, 5);
            return tex;
        }

        function setupModernEnvironment() {
            scene.add(modernNusaGroup);
            const mapMat = new THREE.MeshPhongMaterial({ map: createNusaMapTexture(), color: 0xffffff });
            const modernGround = new THREE.Mesh(new THREE.PlaneGeometry(3000, 3000), mapMat);
            modernGround.rotation.x = -Math.PI / 2;
            modernNusaGroup.add(modernGround);

            // جسد أوزوريس العملاق يقف ليحكي القصة
            const oData = createOsirisModel();
            osirisStoryteller = oData.group;
            osirisStoryteller.scale.set(5, 5, 5);
            osirisStoryteller.position.set(0, 0, -200);
            modernNusaGroup.add(osirisStoryteller);
            
            const oLight = new THREE.PointLight(0xFFD700, 5, 800);
            oLight.position.set(0, 80, -100);
            modernNusaGroup.add(oLight);

            modernNusaGroup.position.set(MODERN_OFFSET_X, 0, MODERN_OFFSET_Z);
        }

        function enterModernNusa() {
            if (isModernTimes) return;
            isModernTimes = true;
            
            playGateSound();

            if (modernNusaGroup.children.length === 0) {
                setupModernEnvironment();
            }

            // وضع إيزيس في العالم الحديث (بعيد جداً عن العالم الفرعوني) لتقف فوق الخريطة
            playerGroup.position.set(MODERN_OFFSET_X, 0, MODERN_OFFSET_Z + 150);

            // إظهار زر العودة السحري
            document.getElementById('return-pharaonic-btn').style.display = 'flex';

            scene.background = new THREE.Color(0xF0F8FF); // لون مشرق لجو خرائط الجوجل
            scene.fog.color = new THREE.Color(0xF0F8FF);
            scene.fog.density = 0.001;

            // الكلمات السحرية تخرج من فم أوزوريس لتروي مسيرة نوسا البحر في الحاضر
            if(magicWordsInterval) clearInterval(magicWordsInterval);
            magicWordsInterval = setInterval(() => {
                const words = [
                    "نوسا البحر مسقط رأسي",
                    "أرض الدقهلية الخضراء",
                    "تاريخ فرعوني وحاضر مشرق",
                    "أحفاد الفراعنة الأبطال",
                    "أهلاً إيزيس في المستقبل!",
                    "تكتمل الأسطورة هنا.. في نوسا",
                    "حسن بلم يحييكم !"
                ];
                const word = words[Math.floor(Math.random() * words.length)];
                
                const wDiv = document.createElement('div');
                wDiv.innerText = word;
                wDiv.className = 'magic-story-word';
                document.body.appendChild(wDiv);

                // فم أوزوريس في العالم تقريباً عند Y=65
                const mouthPos = osirisStoryteller.position.clone();
                mouthPos.y += 65;
                // تعديل الموضع بالنسبة للمجموعة
                mouthPos.x += MODERN_OFFSET_X;
                mouthPos.z += MODERN_OFFSET_Z;

                const vector = mouthPos.project(camera);
                const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
                const y = (-(vector.y * 0.5) + 0.5) * window.innerHeight;
                
                wDiv.style.left = x + 'px';
                wDiv.style.top = y + 'px';

                setTimeout(() => {
                    const moveX = (Math.random() - 0.5) * 600;
                    wDiv.style.transform = `translate(${moveX}px, -400px) scale(1.5)`;
                    wDiv.style.opacity = '0';
                    setTimeout(() => {
                        if (document.body.contains(wDiv)) document.body.removeChild(wDiv);
                    }, 3000);
                }, 50);

            }, 2000); // كلمة كل ثانيتين
        }

        window.returnToPharaonicTimes = function() {
            if (!isModernTimes) return;
            isModernTimes = false;
            
            playGateSound();
            
            document.getElementById('return-pharaonic-btn').style.display = 'none';
            if (magicWordsInterval) clearInterval(magicWordsInterval);
            
            document.querySelectorAll('.magic-story-word').forEach(e => e.remove());

            // إرجاع الأجواء الأصلية
            if (isNight) {
                scene.background = new THREE.Color(0x050b18);
                scene.fog.color = new THREE.Color(0x050b18);
                scene.fog.density = 0.003;
            } else {
                scene.background = new THREE.Color(0x87CEEB);
                scene.fog.color = new THREE.Color(0x87CEEB);
                scene.fog.density = 0.002;
            }

            // وضع إيزيس عند أحد البوابات الزمنية للعودة منه
            if (timePortals.length > 0) {
                const backPos = timePortals[Math.floor(Math.random() * timePortals.length)].group.position.clone();
                // وضعها بمسافة قريبة من البوابة لكن بعيداً عن منطقة الاختراق
                const angle = backPos.angleTo(new THREE.Vector3(0,0,0));
                backPos.x += Math.sin(angle) * 80;
                backPos.z += Math.cos(angle) * 80;
                playerGroup.position.copy(backPos);
            } else {
                playerGroup.position.set(200, 0, 800);
            }
        }

        function triggerTransition(title, bgColor, floorColor, particleColor) {
            // تأثير بصري للانتقال
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed'; overlay.style.top = '0'; overlay.style.left = '0';
            overlay.style.width = '100%'; overlay.style.height = '100%';
            overlay.style.background = '#000'; overlay.style.zIndex = '10000';
            overlay.style.opacity = '0'; overlay.style.transition = 'opacity 1s';
            document.body.appendChild(overlay);

            setTimeout(() => { overlay.style.opacity = '1'; }, 10);

            setTimeout(() => {
                // تغيير أجواء العالم
                scene.background = new THREE.Color(bgColor);
                scene.fog.color = new THREE.Color(bgColor);
                scene.fog.density = 0.006;
                ambientLight.color.set(particleColor);

                // تغيير الأرضية
                if (ground) ground.material.color.set(floorColor);

                // إضافة جسيمات سحرية
                for (let i = 0; i < 120; i++) {
                    const p = new THREE.Mesh(new THREE.SphereGeometry(1.5, 8, 8), new THREE.MeshBasicMaterial({ color: particleColor, transparent: true, opacity: 0.6 }));
                    p.position.set((Math.random() - 0.5) * 4000, Math.random() * 300, (Math.random() - 0.5) * 4000);
                    scene.add(p);
                }

                // إضافة آلهة الفراعنة في العالم الجديد
                for (let i = 0; i < 15; i++) {
                    const god = createGodStatue(ALL_GOD_TYPES[i % ALL_GOD_TYPES.length]);
                    god.scale.set(4, 4, 4);
                    god.position.set((Math.random() - 0.5) * 3000, 0, (Math.random() - 0.5) * 3000);
                    scene.add(god);
                }

                // رسالة سينمائية
                const msg = document.createElement('div');
                msg.style.position = 'fixed'; msg.style.top = '50%'; msg.style.left = '50%';
                msg.style.transform = 'translate(-50%, -50%)'; msg.style.color = '#FFD700';
                msg.style.fontFamily = '"Aref Ruqaa", serif'; msg.style.fontSize = '4em';
                msg.style.zIndex = '10001'; msg.style.textAlign = 'center';
                msg.innerHTML = title + '<br><span style="font-size:0.5em">عالم غامض من أسرار نوسا</span>';
                document.body.appendChild(msg);

                // إرجاع إيزيس لوسط العالم الجديد
                playerGroup.position.set(0, 0, 0);
                playChimeSound();

                setTimeout(() => {
                    overlay.style.opacity = '0';
                    msg.style.transition = 'opacity 2s'; msg.style.opacity = '0';
                    setTimeout(() => {
                        if (document.body.contains(overlay)) document.body.removeChild(overlay);
                        if (document.body.contains(msg)) document.body.removeChild(msg);
                    }, 2000);
                }, 2000);
            }, 1000);
        }

        // نظام الصوت السحري (Web Audio API)
        let audioCtx = null;
        let isMuted = false;
        let masterGain = null;

        function getAudioCtx() {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                masterGain = audioCtx.createGain();
                masterGain.connect(audioCtx.destination);
            }
            return audioCtx;
        }

        window.toggleSound = function () {
            const ctx = getAudioCtx();
            isMuted = !isMuted;
            const btn = document.getElementById('sound-toggle-btn');
            if (btn) {
                if (isMuted) {
                    masterGain.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
                    btn.innerHTML = 'تشغيل الصوت <i class="fa-solid fa-volume-xmark"></i>';
                } else {
                    masterGain.gain.setTargetAtTime(1, ctx.currentTime, 0.1);
                    btn.innerHTML = 'كتم الصوت <i class="fa-solid fa-volume-high"></i>';
                }
            } else {
                if (isMuted) masterGain.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
                else masterGain.gain.setTargetAtTime(1, ctx.currentTime, 0.1);
            }
        }

        // تحديث جميع دوال الصوت لتستخدم masterGain بدلاً من destination مباشرة
        function playChimeSound() {
            const ctx = getAudioCtx();
            const now = ctx.currentTime;
            function createTone(freq, type, delay, duration, vol) {
                const osc = ctx.createOscillator(); const gain = ctx.createGain();
                osc.type = type; osc.frequency.setValueAtTime(freq, now);
                osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + delay + duration * 0.3);
                osc.frequency.exponentialRampToValueAtTime(freq * 0.8, now + delay + duration);
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(vol || 0.12, now + delay + 0.03);
                gain.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
                osc.connect(gain); gain.connect(masterGain);
                osc.start(now + delay); osc.stop(now + delay + duration + 0.1);
            }
            // سلم موسيقي فرعوني سحري (مقام شرقي)
            createTone(440, 'sine', 0, 1.8, 0.15);
            createTone(523, 'triangle', 0.08, 1.5, 0.12);
            createTone(659, 'sine', 0.15, 1.2, 0.1);
            createTone(880, 'sine', 0.25, 1.0, 0.08);
            createTone(1047, 'triangle', 0.35, 0.9, 0.07);
            createTone(1320, 'sine', 0.45, 0.7, 0.06);
            // صدى عميق (بيس)
            createTone(110, 'sine', 0, 2.5, 0.08);
            createTone(220, 'triangle', 0.1, 2.0, 0.05);
        }

        function playHitSound() {
            const ctx = getAudioCtx();
            const now = ctx.currentTime;
            const osc = ctx.createOscillator(); const gain = ctx.createGain();
            osc.type = 'square'; osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(40, now + 0.1);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            osc.connect(gain); gain.connect(masterGain);
            osc.start(); osc.stop(now + 0.15);

            // صوت طرقعة إضافي
            const noise = ctx.createBufferSource();
            const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
            noise.buffer = buffer;
            const nGain = ctx.createGain(); nGain.gain.setValueAtTime(0.1, now);
            nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            noise.connect(nGain); nGain.connect(masterGain);
            noise.start();
        }

        // صوت ضربة السلاح (أنخ أو سيف) مع تعاويذ سحرية
        function playSwingSound(type) {
            const ctx = getAudioCtx();
            const now = ctx.currentTime;

            // صوت السلاح الأساسي
            const osc = ctx.createOscillator(); const gain = ctx.createGain();
            if (type === 'ankh') {
                osc.type = 'triangle'; osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(200, now + 0.2);
                gain.gain.setValueAtTime(0.15, now);
            } else {
                osc.type = 'sawtooth'; osc.frequency.setValueAtTime(300, now);
                osc.frequency.exponentialRampToValueAtTime(80, now + 0.2);
                gain.gain.setValueAtTime(0.12, now);
            }
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.connect(gain); gain.connect(masterGain);
            osc.start(); osc.stop(now + 0.3);

            // إضافة "تعويذة" (صدى سحري)
            const spellOsc = ctx.createOscillator();
            const spellGain = ctx.createGain();
            spellOsc.type = 'sine';
            spellOsc.frequency.setValueAtTime(type === 'ankh' ? 880 : 440, now);
            spellOsc.frequency.linearRampToValueAtTime(type === 'ankh' ? 1760 : 110, now + 0.5);
            spellGain.gain.setValueAtTime(0.05, now);
            spellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
            spellOsc.connect(spellGain); spellGain.connect(masterGain);
            spellOsc.start(); spellOsc.stop(now + 0.6);
        }

        // صوت فتح البوابات الفرعونية
        function playGateSound() {
            const ctx = getAudioCtx();
            const now = ctx.currentTime;
            const osc = ctx.createOscillator(); const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(40, now);
            osc.frequency.linearRampToValueAtTime(80, now + 1.5);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
            osc.connect(gain); gain.connect(masterGain);
            osc.start(); osc.stop(now + 1.5);

            // صوت سحري مرافق
            playChimeSound();
        }

        // أصوات غامضة مخيفة (Whispers)
        function playMysteriousWhisper() {
            const ctx = getAudioCtx();
            const now = ctx.currentTime;
            const osc = ctx.createOscillator(); const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(100 + Math.random() * 200, now);
            osc.frequency.sineCurve = (t) => Math.sin(t * 10) * 50;
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.05, now + 0.5);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
            osc.connect(gain); gain.connect(masterGain);
            osc.start(); osc.stop(now + 2.0);
        }

        // صوت خطوات إيزيس على الرمال/الحجر
        function playFootstepSound() {
            const ctx = getAudioCtx();
            const bufferSize = ctx.sampleRate * 0.1;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass'; filter.frequency.value = 400;
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.03, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
            noise.connect(filter); filter.connect(gain); gain.connect(masterGain);
            noise.start();
        }

        // صوت صرخة وحش فرعوني مرعب
        function playMonsterMoan() {
            const ctx = getAudioCtx();
            const osc = ctx.createOscillator(); const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(80 + Math.random() * 40, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(30, ctx.currentTime + 1.2);
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
            osc.connect(gain); gain.connect(masterGain);
            osc.start(); osc.stop(ctx.currentTime + 1.2);
        }

        // فحيح الثعبان المرعب
        function playSnakeHiss() {
            const ctx = getAudioCtx();
            const now = ctx.currentTime;
            const bufferSize = ctx.sampleRate * 0.8;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
            const src = ctx.createBufferSource();
            src.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'highpass'; filter.frequency.value = 3000;
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.04, now + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
            src.connect(filter); filter.connect(gain); gain.connect(masterGain);
            src.start();
        }

        // موسيقى خلفية غامضة (Ambience) تتفاعل مع المسافة
        let backgroundGain = null;
        let ambientOscillators = [];

        function initAmbientMusic() {
            const ctx = getAudioCtx();
            if (backgroundGain) return; // تم البدء بالفعل

            backgroundGain = ctx.createGain();
            backgroundGain.gain.setValueAtTime(0.02, ctx.currentTime);
            backgroundGain.connect(masterGain);

            function addDrone(freq, type, vol, detune = 0) {
                const osc = ctx.createOscillator();
                const g = ctx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, ctx.currentTime);
                osc.detune.setValueAtTime(detune, ctx.currentTime);
                g.gain.setValueAtTime(vol, ctx.currentTime);
                osc.connect(g); g.connect(backgroundGain);
                osc.start();
                ambientOscillators.push(osc);
            }

            // توليد نغمات رعب غامضة (Horror Drones)
            addDrone(40, 'sawtooth', 0.4, -5);   // قرار منخفض جداً ومزعج
            addDrone(42, 'sine', 0.3, 5);      // تداخل ترددات لخلق توتر
            addDrone(80, 'square', 0.1);       // صوت معدني غريب

            // إضافة تأثير "رياح" أو ضوضاء غامضة
            const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
            const noiseData = noiseBuffer.getChannelData(0);
            for (let i = 0; i < noiseData.length; i++) noiseData[i] = Math.random() * 2 - 1;

            const noise = ctx.createBufferSource();
            noise.buffer = noiseBuffer;
            noise.loop = true;
            const nFilter = ctx.createBiquadFilter();
            nFilter.type = 'lowpass'; nFilter.frequency.value = 200;
            const nGain = ctx.createGain(); nGain.gain.value = 0.05;
            noise.connect(nFilter); nFilter.connect(nGain); nGain.connect(backgroundGain);
            noise.start();
        }

        // تحديث جميع التوصيلات المتبقية لتستخدم masterGain
        // (سيتم تطبيق ذلك داخلياً في الدوال التي تستدعي getAudioCtx)
        function wrapAudioConnect() {
            // ملاحظة: قمت بتحديث gain.connect(masterGain) في الدوال الرئيسية أعلاه
        }

        function updateAmbientVolume(dist) {
            if (!backgroundGain) return;
            // رفع الصوت تدريجياً عند الاقتراب من التوابيت (أقصى صوت عند مسافة 50)
            const targetVol = Math.max(0.02, 0.15 * (1 - Math.min(dist, 500) / 500));
            backgroundGain.gain.setTargetAtTime(targetVol, getAudioCtx().currentTime, 0.5);
        }

        // === نظام التأثيرات السحرية وأجزاء أوزوريس ===
        function showBodyPartUI(index, coffinGrp) {
            playChimeSound();
            isShowingPart = true;
            collectedParts++;
            document.getElementById('score').innerText = collectedParts;
            playerHealth = Math.min(100, playerHealth + 25);
            updateHealthUI();

            const data = bodyPartsData[index];
            document.getElementById('part-name').innerText = data.name;
            document.getElementById('part-desc').innerText = data.desc;
            document.getElementById('part-icon').className = 'fa-solid ' + data.icon;

            const modal = document.getElementById('part-modal');
            modal.style.display = 'flex';
            modal.classList.remove('modal-fire-out');
            setTimeout(() => {
                modal.classList.add('active');
            }, 10); // تعديل لتسريع الظهور

            // تدمير التابوت بتأثير سحري وجعل الروح تطير للسماء
            const coffinPos = coffinGrp.position.clone();
            createMagicBlast(coffinPos);

            // استخراج الروح من التابوت للتحكم بها بشكل منفصل إذا لزم الأمر
            const p = parts.find(part => part.group === coffinGrp);

            activeCollection = {
                coffin: coffinGrp,
                soul: p ? p.soul : null,
                pos: coffinPos,
                time: 0
            };

            // اختفاء تلقائي مع نار سحرية بسرعة لتفادي التهنيج
            setTimeout(() => {
                if (modal.classList.contains('active')) {
                    modal.classList.add('modal-fire-out');
                    setTimeout(() => {
                        modal.style.display = 'none';
                        modal.classList.remove('active', 'modal-fire-out');
                        isShowingPart = false;
                        document.getElementById('part-connector').style.display = 'none';
                        if (collectedParts >= TOTAL_PARTS) triggerWin();
                    }, 300); // إخفاء سريع
                }
            }, 1800); // 1.8 ثانية لضمان عدم توقف اللعبة طويلاً
        }

        function triggerWin() {
            if (isWinning) return;
            isWinning = true;

            // إخفاء واجهات اللعب
            document.getElementById('movement-controls').style.display = 'none';
            document.getElementById('weapon-sidebar').style.display = 'none';
            document.getElementById('health-board').style.display = 'none';

            // تهيئة مشهد النهاية السعيد
            startEndingSequence();
        }

        let osirisBody_M, osirisGroup, osirisLegR, osirisLegL;
        function createOsirisModel() {
            const group = new THREE.Group();
            const body = new THREE.Group();
            body.rotation.y = Math.PI;
            group.add(body);

            const cSkin = new THREE.MeshPhongMaterial({ color: 0x2e7d32, flatShading: true }); // بشرة خضراء ترمز للبعث
            const cShroud = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }); // رداء أبيض
            const cGold = new THREE.MeshPhongMaterial({ color: 0xffd700, shininess: 150 });

            // جسد المومياء المغطى بالكتان الأبيض
            const torso = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.3, 10, 12), cShroud);
            torso.position.y = 7; body.add(torso);

            // أرجل مغلفة
            const legGeo = new THREE.CylinderGeometry(0.6, 0.4, 6, 12);
            osirisLegR = new THREE.Mesh(legGeo, cShroud); osirisLegR.position.set(0.6, 3, 0); body.add(osirisLegR);
            osirisLegL = new THREE.Mesh(legGeo, cShroud); osirisLegL.position.set(-0.6, 3, 0); body.add(osirisLegL);

            // رأس أوزوريس الأخضر
            const headG = new THREE.Group(); headG.position.y = 13.5;
            const headM = new THREE.Mesh(new THREE.SphereGeometry(2.3, 24, 24), cSkin); headG.add(headM);

            // تاج عاطف (Atef Crown)
            const crown = new THREE.Mesh(new THREE.ConeGeometry(1.5, 7, 12), cShroud);
            crown.position.y = 4.5; headG.add(crown);
            for (let s of [-1, 1]) {
                const feather = new THREE.Mesh(new THREE.BoxGeometry(0.2, 5, 2), cGold);
                feather.position.set(s * 1.5, 5, 0); feather.rotation.z = s * 0.3;
                headG.add(feather);
            }

            const beard = new THREE.Mesh(new THREE.ConeGeometry(0.5, 3, 4), new THREE.MeshPhongMaterial({ color: 0x111111 }));
            beard.position.set(0, -2, 2); beard.rotation.x = Math.PI; headG.add(beard);

            body.add(headG);
            return { group, isisBody: body, legR: osirisLegR, legL: osirisLegL };
        }

        let skyShakeTime = 0;
        let endingPhase = 0; // 0=descend, 1=announce, 2=story, 3=embrace, 4=done
        let endingTimer = 0;
        let endingStoryWords = [];
        let endingWordIndex = 0;

        function startEndingSequence() {
            // توقيف المسوخ وإخفائها
            enemies.forEach(e => { e.active = false; scene.remove(e.group); });

            // === المرحلة 1: أوزوريس ينزل من السماء بطريقة إبداعية ===
            const oData = createOsirisModel();
            osirisGroup = oData.group;

            // يبدأ أوزوريس من السماء عالياً جداً
            const landingPos = playerGroup.position.clone().add(new THREE.Vector3(0, 0, -80).applyAxisAngle(new THREE.Vector3(0, 1, 0), playerGroup.rotation.y));
            osirisGroup.position.set(landingPos.x, 500, landingPos.z); // من السماء!
            osirisGroup.scale.set(2, 2, 2);
            scene.add(osirisGroup);

            // ضوء إلهي ينزل معه
            const divineLight = new THREE.PointLight(0xFFD700, 8, 500);
            divineLight.position.copy(osirisGroup.position);
            scene.add(divineLight);

            // شعاع ضوئي من السماء (عمود نور)
            const beamGeo = new THREE.CylinderGeometry(3, 15, 600, 8, 1, true);
            const beamMat = new THREE.MeshBasicMaterial({ color: 0xFFD700, transparent: true, opacity: 0.15, side: THREE.DoubleSide });
            const beam = new THREE.Mesh(beamGeo, beamMat);
            beam.position.set(landingPos.x, 300, landingPos.z);
            scene.add(beam);

            // اهتزاز السماء الشديد
            skyShakeTime = 12;
            playChimeSound();
            if (backgroundGain) backgroundGain.gain.setTargetAtTime(0.5, getAudioCtx().currentTime, 0.5);

            endingPhase = 0;
            endingTimer = 0;

            // كلمات قصة نوسا البحر التي يحكيها أوزوريس
            endingStoryWords = [
                "أنا أوزوريس العظيم!",
                "إله البعث وسيد العالم الآخر",
                "لقد اكتمل جسدي المقدس..",
                "بفضل إيزيس.. ملكة السحر والوفاء",
                "هنا في نوسا البحر..",
                "أرض الدقهلية المباركة",
                "حيث يلتقي الماضي بالحاضر",
                "حيث تروى أعظم قصة حب",
                "أحفادنا يعيشون هنا بكرامة",
                "نوسا البحر.. مهد الحضارة",
                "تحيا مصر.. تحيا نوسا البحر!",
                "حسن بلم يحييكم من قلب التاريخ!"
            ];
            endingWordIndex = 0;

            // === أنيميشن النزول من السماء ===
            const descendInterval = setInterval(() => {
                endingTimer += 0.016;

                if (endingPhase === 0) {
                    // النزول من السماء بسلاسة
                    const targetY = 0;
                    osirisGroup.position.y += (targetY - osirisGroup.position.y) * 0.02;
                    divineLight.position.copy(osirisGroup.position);
                    divineLight.position.y += 20;

                    // جسيمات ذهبية تتساقط مع النزول
                    if (Math.random() < 0.3) {
                        const sparkle = new THREE.Mesh(
                            new THREE.SphereGeometry(1, 6, 6),
                            new THREE.MeshBasicMaterial({ color: 0xFFD700, transparent: true })
                        );
                        sparkle.position.copy(osirisGroup.position);
                        sparkle.position.x += (Math.random() - 0.5) * 40;
                        sparkle.position.z += (Math.random() - 0.5) * 40;
                        sparkle.position.y += Math.random() * 30;
                        scene.add(sparkle);
                        soulTrailParticles.push({ mesh: sparkle, life: 1.5, vel: 5 + Math.random() * 10 });
                    }

                    // دوران بطيء أثناء النزول
                    osirisGroup.rotation.y += 0.02;

                    if (osirisGroup.position.y < 5) {
                        osirisGroup.position.y = 0;
                        osirisGroup.rotation.y = 0;
                        osirisGroup.lookAt(playerGroup.position);
                        endingPhase = 1;
                        endingTimer = 0;

                        // إعلان "أنا أوزوريس العظيم" بشكل سينمائي
                        showCinematicText("أنا أوزوريس العظيم!", 4000);
                        playChimeSound();

                        // إزالة شعاع الضوء بالتلاشي
                        let beamFade = 1;
                        const fadeBeam = setInterval(() => {
                            beamFade -= 0.02;
                            beamMat.opacity = 0.15 * beamFade;
                            if (beamFade <= 0) { scene.remove(beam); clearInterval(fadeBeam); }
                        }, 30);
                    }
                }

                else if (endingPhase === 1) {
                    // انتظار بعد الإعلان ثم بدء الحكاية
                    if (endingTimer > 4.5) {
                        endingPhase = 2;
                        endingTimer = 0;
                        endingWordIndex = 1; // بداية من الكلمة الثانية (الأولى ظهرت)
                    }
                }

                else if (endingPhase === 2) {
                    // أوزوريس يحكي القصة - كلمات سحرية تخرج من فمه
                    if (endingTimer > 2.0 && endingWordIndex < endingStoryWords.length) {
                        endingTimer = 0;
                        const word = endingStoryWords[endingWordIndex];
                        endingWordIndex++;

                        // كلمة تخرج من فم أوزوريس
                        const wDiv = document.createElement('div');
                        wDiv.innerText = word;
                        wDiv.className = 'magic-story-word';
                        wDiv.style.color = '#FFD700';
                        wDiv.style.fontSize = '50px';
                        wDiv.style.textShadow = '0 0 30px #FFD700, 0 0 60px #ff4500';
                        document.body.appendChild(wDiv);

                        const mouthPos = osirisGroup.position.clone();
                        mouthPos.y += 30;
                        const vector = mouthPos.project(camera);
                        const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
                        const y = (-(vector.y * 0.5) + 0.5) * window.innerHeight;
                        wDiv.style.left = x + 'px';
                        wDiv.style.top = y + 'px';

                        setTimeout(() => {
                            wDiv.style.transform = 'translate(-50%, -300px) scale(1.3)';
                            wDiv.style.opacity = '0';
                            setTimeout(() => { if (document.body.contains(wDiv)) document.body.removeChild(wDiv); }, 3500);
                        }, 50);

                        playChimeSound();

                        // اهتزاز خفيف مع كل كلمة
                        skyShakeTime = Math.max(skyShakeTime, 0.5);
                    }

                    // بعد كل الكلمات ننتقل للعناق
                    if (endingWordIndex >= endingStoryWords.length && endingTimer > 3) {
                        endingPhase = 3;
                        endingTimer = 0;
                        showCinematicText("عناق الأبدية.. إيزيس وأوزوريس", 5000);
                    }
                }

                else if (endingPhase === 3) {
                    // === المرحلة 3: العناق السينمائي ===
                    const dist = osirisGroup.position.distanceTo(playerGroup.position);

                    if (dist > 8) {
                        // إيزيس تمشي نحو أوزوريس
                        const dirI = osirisGroup.position.clone().sub(playerGroup.position).normalize();
                        playerGroup.position.add(dirI.multiplyScalar(0.6));

                        // أوزوريس يمشي نحو إيزيس
                        const dirO = playerGroup.position.clone().sub(osirisGroup.position).normalize();
                        osirisGroup.position.add(dirO.multiplyScalar(0.3));

                        // حركة المشي
                        const walk = Math.sin(Date.now() * 0.012);
                        osirisLegR.rotation.x = walk * 0.5;
                        osirisLegL.rotation.x = -walk * 0.5;
                        legR.rotation.x = -walk * 0.5;
                        legL.rotation.x = walk * 0.5;

                        // مواجهة بعضهما
                        osirisGroup.lookAt(playerGroup.position);
                        isisBody.rotation.y = Math.atan2(
                            osirisGroup.position.x - playerGroup.position.x,
                            osirisGroup.position.z - playerGroup.position.z
                        );
                    } else {
                        // لحظة العناق ! انفجار ذهبي ونجوم
                        if (endingPhase === 3) {
                            endingPhase = 4;
                            
                            // انفجار جسيمات العناق
                            const embracePos = playerGroup.position.clone().lerp(osirisGroup.position, 0.5);
                            embracePos.y += 15;
                            for (let i = 0; i < 80; i++) {
                                const p = new THREE.Mesh(
                                    new THREE.SphereGeometry(0.8 + Math.random(), 6, 6),
                                    new THREE.MeshBasicMaterial({ color: Math.random() > 0.5 ? 0xFFD700 : 0xff4500, transparent: true })
                                );
                                p.position.copy(embracePos);
                                scene.add(p);
                                soulTrailParticles.push({
                                    mesh: p,
                                    life: 2 + Math.random() * 2,
                                    vel: -(10 + Math.random() * 20) // تصعد للأعلى
                                });
                            }

                            createMagicBlast(embracePos);
                            playChimeSound();
                            skyShakeTime = 8;
                            divineLight.intensity = 15;

                            // عرض شاشة النهاية بعد 3 ثوانٍ
                            setTimeout(() => {
                                const winUI = document.getElementById('win-screen');
                                winUI.style.display = 'block';
                                winUI.innerHTML = `
                                    <div style="background: rgba(0,0,0,0.85); padding: 40px; border-radius: 25px; border: 4px solid #FFD700; box-shadow: 0 0 80px #FFD700, 0 0 150px rgba(255,69,0,0.5); max-width: 700px; animation: modal-pop 0.8s ease-out;">
                                        <h2 style="color: #FFD700; font-family: 'Aref Ruqaa', serif; font-size: 3.5em; margin: 0; text-shadow: 0 0 20px #FFD700;">☥ اكتمل الجسد المقدس ☥</h2>
                                        <p style="color: #fff; font-size: 1.4em; margin: 25px 0; line-height: 2; font-family: 'Aref Ruqaa', serif;">
                                            نزل أوزوريس من السماء بجلاله.. واحتضنته إيزيس بعد رحلة أسطورية<br>
                                            في أرض نوسا البحر المباركة.. حيث انتصر الحب والوفاء<br>
                                            <span style="color: #FFD700;">أحفاد الفراعنة يحيون ذكرى هذا اللقاء إلى الأبد</span>
                                        </p>
                                        <p style="color: #ff8800; font-size: 1.1em; margin: 15px 0;">منتدى شباب نوسا البحر - حسن بلم</p>
                                        <button onclick="location.reload()" style="background: linear-gradient(135deg, #FFD700, #ff8800); color: #000; border: none; padding: 18px 50px; border-radius: 15px; font-family: 'Aref Ruqaa', serif; font-size: 1.3em; cursor: pointer; transition: 0.3s; box-shadow: 0 5px 20px rgba(255,215,0,0.4);" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                                            <i class="fa-solid fa-redo"></i> أعد إحياء الأسطورة
                                        </button>
                                    </div>
                                `;
                            }, 3000);
                        }
                    }
                }

                else if (endingPhase === 4) {
                    // الدوران حول المشهد بعد العناق
                    divineLight.intensity *= 0.99;
                }

            }, 16); // 60fps
        }

        // نص سينمائي كبير يظهر ويختفي
        function showCinematicText(text, duration) {
            const div = document.createElement('div');
            div.style.cssText = `
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.5);
                color: #FFD700; font-family: 'Aref Ruqaa', serif; font-size: 5em;
                text-shadow: 0 0 40px #FFD700, 0 0 80px #ff4500, 0 0 120px rgba(255,69,0,0.3);
                z-index: 99999; pointer-events: none; text-align: center;
                transition: all 1s ease-out; opacity: 0; white-space: nowrap;
            `;
            div.innerText = text;
            document.body.appendChild(div);
            
            setTimeout(() => { div.style.opacity = '1'; div.style.transform = 'translate(-50%, -50%) scale(1)'; }, 50);
            setTimeout(() => { div.style.opacity = '0'; div.style.transform = 'translate(-50%, -50%) scale(1.5) translateY(-100px)'; }, duration - 1000);
            setTimeout(() => { if (document.body.contains(div)) document.body.removeChild(div); }, duration);
        }

        function updateConnector(worldPos) {
            const connector = document.getElementById('part-connector');
            const vector = worldPos.clone().project(camera);
            const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
            const y = (-(vector.y * 0.5) + 0.5) * window.innerHeight;

            const modal = document.getElementById('part-modal');
            const rect = modal.getBoundingClientRect();
            const modalX = rect.left + rect.width / 2;
            const modalY = rect.top + rect.height / 2;

            const length = Math.sqrt(Math.pow(modalX - x, 2) + Math.pow(modalY - y, 2));
            const angle = Math.atan2(modalY - y, modalX - x) * 180 / Math.PI;

            connector.style.display = 'block';
            connector.style.left = x + 'px';
            connector.style.top = y + 'px';
            connector.style.height = length + 'px';
            connector.style.transform = `rotate(${angle - 90}deg)`;
        }

        window.closePartModal = function () {
            const modal = document.getElementById('part-modal');
            const connector = document.getElementById('part-connector');
            modal.classList.remove('active');
            connector.style.display = 'none';
            setTimeout(() => {
                modal.style.display = 'none';
                isShowingPart = false;

                // حركة تلقائية ناعمة بعد جمع الجزء لاستكمال الرحلة
                const currentRot = playerGroup.rotation.y;
                const pushDir = new THREE.Vector3(0, 0, -15).applyEuler(playerGroup.rotation);
                playerGroup.position.add(pushDir);
                playFootstepSound();

                if (collectedParts >= TOTAL_PARTS) {
                    triggerWin();
                }
            }, 300); // تصغير الوقت لتقليل الانتظار
        };

        function createMagicBlast(pos) {
            const blastLight = new THREE.PointLight(0xFFD700, 5, 50);
            blastLight.position.copy(pos);
            scene.add(blastLight);

            const ringGeo = new THREE.TorusGeometry(2, 0.1, 8, 32);
            const ringMat = new THREE.MeshBasicMaterial({ color: 0xFFD700, transparent: true, opacity: 1 });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.position.copy(pos);
            ring.rotation.x = Math.PI / 2;
            scene.add(ring);

            const pCount = 8;
            const pMeshes = [];
            for (let i = 0; i < pCount; i++) {
                const p = new THREE.Mesh(new THREE.SphereGeometry(0.6, 4, 4), new THREE.MeshBasicMaterial({ color: 0xFFD700 }));
                p.position.copy(pos);
                p.userData.vel = new THREE.Vector3((Math.random() - 0.5), Math.random(), (Math.random() - 0.5)).multiplyScalar(1.5);
                scene.add(p);
                pMeshes.push(p);
            }

            let t = 0;
            const interval = setInterval(() => {
                t += 0.08;
                ring.scale.setScalar(1 + t * 20);
                ringMat.opacity = 1 - t;
                blastLight.intensity = 5 * (1 - t);
                pMeshes.forEach(p => {
                    p.position.add(p.userData.vel);
                    p.scale.setScalar(1 - t);
                });
                if (t >= 1) {
                    scene.remove(ring); scene.remove(blastLight);
                    pMeshes.forEach(p => scene.remove(p));
                    clearInterval(interval);
                }
            }, 40);
        }

        window.addEventListener('resize', () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });

        // === نظام المجسم الجانبي المتطور لايزيس (Portrait Canvas) ===
        let portScene, portCam, portRen, portIsisHead, portIsisData;
        let portRotDir = 0; // اتجاه الدوران اليدوي للبورتريه

        function initPortrait() {
            portScene = new THREE.Scene();
            portCam = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
            portRen = new THREE.WebGLRenderer({ canvas: document.getElementById('isis-portrait-canvas'), alpha: true, antialias: true });
            portRen.setPixelRatio(window.devicePixelRatio);

            const pLight = new THREE.AmbientLight(0xffffff, 1); portScene.add(pLight);
            const pDir = new THREE.DirectionalLight(0xffffff, 0.8); pDir.position.set(5, 5, 5); portScene.add(pDir);

            // إنشاء مجسم مبسط للرأس في البورتريه
            portIsisData = createIsisModel();
            portIsisHead = portIsisData.group;
            portIsisData.halo.visible = false; // إخفاء الهالة في البورتريه للوضوح
            portScene.add(portIsisHead);
            portCam.position.set(0, 12, 18);
            portCam.lookAt(0, 12, 0);
        }
        function updatePortrait(delta) {
            if (!portRen) initPortrait();
            // المجسم الجانبي يقلد اتجاه الملكة أو يدور يدوياً بناءً على الأزرار
            if (portRotDir !== 0) {
                portIsisHead.rotation.y += portRotDir * delta * 3;
            } else {
                portIsisHead.rotation.y = playerGroup.rotation.y + Math.PI;
                portIsisData.isisBody.rotation.y = isisBody.rotation.y;
            }
            portRen.render(portScene, portCam);
        }
