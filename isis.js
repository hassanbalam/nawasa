  const forumData = [
            { cat: 'المنتدى الاسلامى', icon: 'fa-solid fa-mosque', url: 'https://nawasa-elbahr.yoo7.com/f1-montada', desc: 'نور الإيمان والهدى في رحاب نوسا البحر' },
            { cat: 'المنتدى العام', icon: 'fa-solid fa-comments', url: 'https://nawasa-elbahr.yoo7.com/f11-montada', desc: 'نقاشات عامة وحوارات بناءة بين أهل البلدة' },
            { cat: 'قهوة المنتدى', icon: 'fa-solid fa-mug-hot', url: 'https://nawasa-elbahr.yoo7.com/f54-montada', desc: 'استراحة المحارب ودردشة ودية في جو أخوي' },
            { cat: 'أخبار نوسا البحر', icon: 'fa-solid fa-newspaper', url: 'https://nawasa-elbahr.yoo7.com/f16-montada', desc: 'آخر المستجدات والأخبار الحصرية لمدينتنا الغالية' },
            { cat: 'صور نوسا البحر', icon: 'fa-solid fa-images', url: 'https://nawasa-elbahr.yoo7.com/f27-montada', desc: 'جمال الطبيعة وتاريخنا الموثق بالصور' },
            { cat: 'منتدى الابداع', icon: 'fa-solid fa-pen-nib', url: 'https://nawasa-elbahr.yoo7.com/f5-montada', desc: 'واحة الأدب والشعر والفنون لأصحاب الأقلام المبدعة' },
            { cat: 'المنتدى العلمى', icon: 'fa-solid fa-microscope', url: 'https://nawasa-elbahr.yoo7.com/f17-montada', desc: 'نافذة على المعرفة والعلوم والابتكارات الحديثة' },
            { cat: 'المكتبة الشاملة', icon: 'fa-solid fa-book', url: 'https://nawasa-elbahr.yoo7.com/f23-montada', desc: 'كنوز المعرفة والكتب في شتى المجالات' },
            { cat: 'منتدى السينما', icon: 'fa-solid fa-film', url: 'https://nawasa-elbahr.yoo7.com/f2-montada', desc: 'عالم الفن السابع وأحدث الأفلام والمسلسلات' },
            { cat: 'منتدى الكارتون', icon: 'fa-solid fa-face-smile', url: 'https://nawasa-elbahr.yoo7.com/f33-montada', desc: 'عالم الخيال والرسوم المتحركة لجميع الأعمار' },
            { cat: 'منتدى الألعاب', icon: 'fa-solid fa-gamepad', url: 'https://nawasa-elbahr.yoo7.com/f12-montada', desc: 'تحديات وإثارة وأحدث الألعاب الإلكترونية' },
            { cat: 'منتدى الكمبيوتر', icon: 'fa-solid fa-desktop', url: 'https://nawasa-elbahr.yoo7.com/f4-montada', desc: 'حلول تقنية برمجيات وكل ما يخص التكنولوجيا' },
            { cat: 'منتدى الطبخ', icon: 'fa-solid fa-utensils', url: 'https://nawasa-elbahr.yoo7.com/f13-montada', desc: 'أشهى المأكولات ووصفات من مطابخ العالم' },
            { cat: 'منتدى الكوميديا', icon: 'fa-solid fa-masks-theater', url: 'https://nawasa-elbahr.yoo7.com/f8-montada', desc: 'ابتسامات وضحكات تخفف عنا ضغوط الحياة' }
        ];

        const grid = document.getElementById('forum-grid');
        forumData.forEach(section => {
            const card = document.createElement('div');
            card.className = 'forum-3d-card';
            card.innerHTML = `
                <i class="${section.icon}"></i>
                <h3>${section.cat}</h3>
                <p>${section.desc}</p>
                <div class="card-glow"></div>
            `;

            // إضافة تأثير الماوس 3D
            card.onmousemove = (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--x', `${(x / rect.width) * 100}%`);
                card.style.setProperty('--y', `${(y / rect.height) * 100}%`);

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                card.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            };

            card.onmouseleave = () => {
                card.style.transform = `translateY(0) rotateX(0) rotateY(0)`;
            };

            card.onclick = () => {
                openForumSection(section.url, section.cat);
            };

            grid.appendChild(card);
        });

        window.openForumSection = function (url, title) {
            const sectionsView = document.getElementById('forum-sections-view');
            const iframeView = document.getElementById('forum-iframe-view');
            const iframe = document.getElementById('forum-iframe');
            const titleEl = document.getElementById('section-title');
            const modalContainer = document.getElementById('forum-modal-container');

            titleEl.innerText = title;
            iframe.src = url;

            sectionsView.style.display = 'none';
            iframeView.style.display = 'flex';

            // إضافة تأثير انتقال إبداعي للحاوية
            modalContainer.style.animation = 'none';
            void modalContainer.offsetWidth; // trigger reflow
            modalContainer.style.animation = 'modal-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
        };

        window.closeForumSection = function () {
            const sectionsView = document.getElementById('forum-sections-view');
            const iframeView = document.getElementById('forum-iframe-view');
            const iframe = document.getElementById('forum-iframe');

            iframe.src = '';
            sectionsView.style.display = 'block';
            iframeView.style.display = 'none';
        };

        window.openSafarModal = function () {
            document.getElementById('safar-iframe').src = 'https://nawasa-elbahr.yoo7.com/t13526-topic';
            document.getElementById('safar-modal').style.display = 'flex';
        };

        // --- نظام القصة السينمائية ---
        const storyBlocks = document.querySelectorAll('.story-text-block');
        let currentStoryIndex = 0;

        function playStoryIntro() {
            const overlay = document.getElementById('story-overlay');
            overlay.style.display = 'flex';

            // إضافة رموز هيروغليفية طائرة في الخلفية
            const symbols = ['☥', '𓂀', '𓋹', '𓏠', '𓊽', '𓇳'];
            for (let i = 0; i < 30; i++) {
                const sym = document.createElement('div');
                sym.className = 'hieroglyph-float';
                sym.innerText = symbols[Math.floor(Math.random() * symbols.length)];
                sym.style.left = Math.random() * 100 + '%';
                sym.style.animationDelay = Math.random() * 15 + 's';
                sym.style.fontSize = (1 + Math.random() * 3) + 'em';
                overlay.appendChild(sym);
            }

            // إضافة رموز مقدسة كبيرة في الزوايا
            const sacreds = ['𓂀', '☥', '𓅃', '𓆗'];
            sacreds.forEach((s, i) => {
                const el = document.createElement('div');
                el.className = 'sacred-symbol';
                el.innerText = s;
                el.style.top = (i < 2 ? '10%' : '70%');
                el.style.left = (i % 2 === 0 ? '5%' : '85%');
                el.style.animationDelay = (i * 0.5) + 's';
                overlay.appendChild(el);
            });

            function showNextBlock() {
                if (currentStoryIndex < storyBlocks.length) {
                    storyBlocks[currentStoryIndex].classList.add('animate-text');
                    setTimeout(() => {
                        currentStoryIndex++;
                        showNextBlock();
                    }, 5000); // زيادة الوقت قليلاً لقراءة النص الطويل
                } else {
                    document.getElementById('start-game-btn').classList.add('btn-ready');
                }
            }
            showNextBlock();
        }

        window.startGame = function () {
            const overlay = document.getElementById('story-overlay');
            overlay.style.transition = 'all 1s ease-in-out';
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
                initializeGame(); // تفعيل الأصوات
                if (playerGroup) playerGroup.visible = true; // إظهار إيزيس عند بدء اللعب الفعلي
            }, 1000);
        };

        function initializeGame() {
            // تفعيل نظام الصوت العالمي (بدون موسيقى خلفية حالياً)
            console.log("Game controls and audio initialized.");
        }

        document.fonts.ready.then(() => {
            playStoryIntro();

            // تهيئة عناصر اللعبة في الخلفية
            drawRealMap();
            groundMat = createPharaonicFloor();
            const groundSize = 2500;
            ground = new THREE.Mesh(new THREE.PlaneGeometry(groundSize, groundSize, 10, 10), groundMat);
            ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

            river = new THREE.Mesh(new THREE.PlaneGeometry(160, groundSize, 4, 1), new THREE.MeshPhongMaterial({ color: 0x1ca3ec, transparent: true, opacity: 0.85, shininess: 80 }));
            river.rotation.x = -Math.PI / 2; river.position.set(-150, 1.5, 0); scene.add(river);
            addMapBoundaries();
            // استخدام تمثال ايزيس المدمج مسبقا لتجنب ترك نسخة جامدة (تمثال) عند الحركة
            playerGroup.scale.set(1.4, 1.4, 1.4);
            playerGroup.position.set(200, 0, 800);
            playerGroup.visible = false; // إخفاء إيزيس أثناء عرض المقدمة
            // المشهد تمت إضافة إيزيس له مسبقاً
            animate();
        });
