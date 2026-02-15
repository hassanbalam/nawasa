 (function () {
            'use strict';

            // ===== TOPIC DATA =====
            // Forum topics with appropriate icons and images
            const mihrabTopics = [
                { title: "صلوات الفاتح لما أغلق", link: "https://nawasa-elbahr.yoo7.com/t13317-topic", icon: "fa-door-open", img: "https://picsum.photos/seed/fatih1/400/250" },
                { title: "الصلاة على النبي ﷺ وفضائلها", link: "https://nawasa-elbahr.yoo7.com/t13318-topic", icon: "fa-star-and-crescent", img: "https://picsum.photos/seed/salawat/400/250" },
                { title: "أذكار الصباح والمساء", link: "https://nawasa-elbahr.yoo7.com/t13319-topic", icon: "fa-sun", img: "https://picsum.photos/seed/azkar1/400/250" },
                { title: "تفسير سورة الكهف وحكمها", link: "https://nawasa-elbahr.yoo7.com/t13320-topic", icon: "fa-book-quran", img: "https://picsum.photos/seed/kahf1/400/250" },
                { title: "دعاء الأرواح الراجعة إلى الله", link: "https://nawasa-elbahr.yoo7.com/t13321-topic", icon: "fa-wind", img: "https://picsum.photos/seed/spirit1/400/250" },
                { title: "أسرار بسم الله الرحمن الرحيم", link: "https://nawasa-elbahr.yoo7.com/t13322-topic", icon: "fa-feather-pointed", img: "https://picsum.photos/seed/basmala/400/250" },
                { title: "فضل قيام الليل والتهجد", link: "https://nawasa-elbahr.yoo7.com/t13323-topic", icon: "fa-moon", img: "https://picsum.photos/seed/qiyam1/400/250" },
                { title: "الورد اليومي من الأذكار والأدعية", link: "https://nawasa-elbahr.yoo7.com/t13324-topic", icon: "fa-hands-praying", img: "https://picsum.photos/seed/wird1/400/250" },
                { title: "طعم المحبة الإلهية", link: "https://nawasa-elbahr.yoo7.com/t13337-topic", icon: "fa-heart", img: "https://picsum.photos/seed/love2/400/250" },
                { title: "حكم ومواعظ من السلف الصالح", link: "https://nawasa-elbahr.yoo7.com/t13325-topic", icon: "fa-scroll", img: "https://picsum.photos/seed/hikam1/400/250" },
                { title: "رحلة الإسراء والمعراج", link: "https://nawasa-elbahr.yoo7.com/t13326-topic", icon: "fa-cloud-moon", img: "https://picsum.photos/seed/isra1/400/250" },
                { title: "قصص الأنبياء والمرسلين", link: "https://nawasa-elbahr.yoo7.com/t13327-topic", icon: "fa-book-open", img: "https://picsum.photos/seed/prophets/400/250" },
                { title: "فقه العبادات وأحكام الطهارة", link: "https://nawasa-elbahr.yoo7.com/t13328-topic", icon: "fa-mosque", img: "https://picsum.photos/seed/fiqh1/400/250" },
                { title: "معاني أسماء الله الحسنى", link: "https://nawasa-elbahr.yoo7.com/t13329-topic", icon: "fa-list-ol", img: "https://picsum.photos/seed/names1/400/250" },
                { title: "آداب الدعاء وأوقات الاستجابة", link: "https://nawasa-elbahr.yoo7.com/t13330-topic", icon: "fa-hand-holding-heart", img: "https://picsum.photos/seed/duaa1/400/250" },
                { title: "السيرة النبوية العطرة", link: "https://nawasa-elbahr.yoo7.com/t13331-topic", icon: "fa-kaaba", img: "https://picsum.photos/seed/sira1/400/250" },
                { title: "الإعجاز العلمي في القرآن الكريم", link: "https://nawasa-elbahr.yoo7.com/t13332-topic", icon: "fa-atom", img: "https://picsum.photos/seed/ijaz1/400/250" },
                { title: "فضل الصدقة وأبوابها", link: "https://nawasa-elbahr.yoo7.com/t13333-topic", icon: "fa-hand-holding-dollar", img: "https://picsum.photos/seed/sadaqa/400/250" },
            ];

            // Attempt to fetch real topics from RSS, fallback to hardcoded
            let currentTopics = mihrabTopics;
            let currentSlide = 0;
            const visibleSlides = 5; // Show 5 cards at a time (main + 2 each side)
            let autoSlideTimer = null;

            // ===== TRY LOADING FROM RSS =====
            async function tryLoadRSS() {
                try {
                    const rssUrl = 'https://nawasa-elbahr.yoo7.com/feed/?f=1';
                    const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(rssUrl);
                    const response = await fetch(proxyUrl, { signal: AbortSignal.timeout(8000) });
                    if (!response.ok) throw new Error('Network response was not ok');
                    const text = await response.text();
                    const parser = new DOMParser();
                    const xml = parser.parseFromString(text, 'text/xml');
                    const items = xml.querySelectorAll('item');

                    if (items.length >= 10) {
                        const iconPool = [
                            'fa-door-open', 'fa-star-and-crescent', 'fa-sun', 'fa-book-quran',
                            'fa-wind', 'fa-feather-pointed', 'fa-moon', 'fa-hands-praying',
                            'fa-heart', 'fa-scroll', 'fa-cloud-moon', 'fa-book-open',
                            'fa-mosque', 'fa-list-ol', 'fa-hand-holding-heart', 'fa-kaaba',
                            'fa-atom', 'fa-hand-holding-dollar'
                        ];
                        const rssTopics = [];
                        items.forEach((item, i) => {
                            if (i >= 18) return;
                            const title = item.querySelector('title')?.textContent || '';
                            const link = item.querySelector('link')?.textContent || '#';
                            rssTopics.push({
                                title: title,
                                link: link,
                                icon: iconPool[i % iconPool.length],
                                img: `https://picsum.photos/seed/rss${i}/400/250`
                            });
                        });
                        if (rssTopics.length >= 10) {
                            currentTopics = rssTopics;
                            buildSlideshow();
                        }
                    }
                } catch (e) {
                    console.log('RSS load failed, using default topics:', e.message);
                }
            }

            // ===== CREATE STARS =====
            function createMihrabStars() {
                const container = document.getElementById('mihrab-stars');
                if (!container) return;
                for (let i = 0; i < 80; i++) {
                    const star = document.createElement('div');
                    star.className = 'mihrab-star';
                    star.style.left = Math.random() * 100 + '%';
                    star.style.top = Math.random() * 100 + '%';
                    star.style.setProperty('--dur', (2 + Math.random() * 4) + 's');
                    star.style.animationDelay = Math.random() * 3 + 's';
                    star.style.width = (1 + Math.random() * 3) + 'px';
                    star.style.height = star.style.width;
                    container.appendChild(star);
                }
            }

            // ===== CREATE PARTICLES =====
            function createParticles() {
                const container = document.getElementById('mihrab-particles');
                if (!container) return;
                for (let i = 0; i < 20; i++) {
                    const p = document.createElement('div');
                    p.className = 'mihrab-particle';
                    p.style.left = (10 + Math.random() * 80) + '%';
                    p.style.bottom = (Math.random() * 30) + '%';
                    p.style.setProperty('--float-dur', (4 + Math.random() * 6) + 's');
                    p.style.setProperty('--float-x', (Math.random() * 60 - 30) + 'px');
                    p.style.animationDelay = Math.random() * 5 + 's';
                    p.style.width = (2 + Math.random() * 4) + 'px';
                    p.style.height = p.style.width;
                    container.appendChild(p);
                }
            }

            // ===== BUILD SLIDESHOW =====
            function buildSlideshow() {
                const track = document.getElementById('slideshow-track');
                const dotsContainer = document.getElementById('mihrab-dots');
                if (!track || !dotsContainer) return;

                track.innerHTML = '';
                dotsContainer.innerHTML = '';

                currentTopics.forEach((topic, idx) => {
                    // Create slide
                    const slide = document.createElement('div');
                    slide.className = 'mihrab-slide';
                    slide.dataset.index = idx;

                    slide.innerHTML = `
                    <div class="slide-image">
                        <img src="${topic.img}" alt="${topic.title}" loading="lazy" onerror="this.src='https://picsum.photos/seed/fallback${idx}/400/250'">
                        <div class="slide-image-overlay"></div>
                    </div>
                    <div class="slide-icon">
                        <i class="fas ${topic.icon}"></i>
                    </div>
                    <div class="slide-content">
                        <h3><a href="${topic.link}" target="_blank" class="slide-title-link">${topic.title}</a></h3>
                        <p>اكتشف المزيد من المعرفة والنور في هذا الموضوع المميز من منتدى نوسا البحر</p>
                        <a href="${topic.link}" target="_blank" class="slide-read-btn">
                            <i class="fas fa-external-link-alt"></i> اقرأ المزيد
                        </a>
                    </div>
                `;

                    // 3D hover tilt effect
                    slide.addEventListener('mousemove', function (e) {
                        const rect = this.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        const centerX = rect.width / 2;
                        const centerY = rect.height / 2;
                        const rotateX = ((y - centerY) / centerY) * -12;
                        const rotateY = ((x - centerX) / centerX) * 12;
                        this.style.transform = this.style.transform.replace(
                            /rotateX\([^)]*\)\s*rotateY\([^)]*\)/,
                            `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
                        );
                        // Keep existing transform parts and add tilt
                        if (!this.style.transform.includes('rotateX')) {
                            this.style.transform += ` rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                        }
                    });

                    slide.addEventListener('mouseleave', function () {
                        updateSlidePositions();
                    });

                    slide.addEventListener('click', function (e) {
                        if (!e.target.closest('.slide-read-btn')) {
                            const idx = parseInt(this.dataset.index);
                            goToSlide(idx);
                        }
                    });

                    track.appendChild(slide);

                    // Create dot
                    const dot = document.createElement('div');
                    dot.className = 'mihrab-dot' + (idx === 0 ? ' active' : '');
                    dot.addEventListener('click', () => goToSlide(idx));
                    dotsContainer.appendChild(dot);
                });

                updateSlidePositions();
            }

            // ===== POSITION SLIDES IN 3D =====
            function updateSlidePositions() {
                const slides = document.querySelectorAll('.mihrab-slide');
                const total = slides.length;
                const dots = document.querySelectorAll('.mihrab-dot');

                slides.forEach((slide, idx) => {
                    const offset = idx - currentSlide;
                    let adjustedOffset = offset;

                    // Wrap around for circular effect
                    if (adjustedOffset > total / 2) adjustedOffset -= total;
                    if (adjustedOffset < -total / 2) adjustedOffset += total;

                    const absOffset = Math.abs(adjustedOffset);
                    const sign = adjustedOffset < 0 ? -1 : (adjustedOffset > 0 ? 1 : 0);

                    // Position calculations
                    let translateX, translateZ, rotateY, opacity, scale;

                    if (absOffset === 0) {
                        // Center (Active)
                        translateX = -130; // half of card width
                        translateZ = 100;
                        rotateY = 0;
                        opacity = 1;
                        scale = 1;
                    } else if (absOffset <= 2) {
                        // Adjacent cards
                        translateX = -130 + (sign * absOffset * 200);
                        translateZ = 100 - (absOffset * 80);
                        rotateY = sign * -25 * absOffset;
                        opacity = 1 - (absOffset * 0.25);
                        scale = 1 - (absOffset * 0.12);
                    } else {
                        // Far cards (hidden)
                        translateX = -130 + (sign * 500);
                        translateZ = -200;
                        rotateY = sign * -60;
                        opacity = 0;
                        scale = 0.6;
                    }

                    slide.style.transform = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
                    slide.style.opacity = opacity;
                    slide.style.zIndex = 10 - absOffset;
                    slide.style.pointerEvents = absOffset <= 2 ? 'auto' : 'none';

                    // Toggle active class
                    slide.classList.toggle('active', absOffset === 0);
                });

                // Update dots
                dots.forEach((dot, idx) => {
                    dot.classList.toggle('active', idx === currentSlide);
                });
            }

            // ===== NAVIGATION =====
            function goToSlide(index) {
                currentSlide = ((index % currentTopics.length) + currentTopics.length) % currentTopics.length;
                updateSlidePositions();
                resetAutoSlide();
            }

            function nextSlide() {
                goToSlide(currentSlide + 1);
            }

            function prevSlide() {
                goToSlide(currentSlide - 1);
            }

            function resetAutoSlide() {
                if (autoSlideTimer) clearInterval(autoSlideTimer);
                autoSlideTimer = setInterval(nextSlide, 5000);
            }

            // ===== TOUCH SUPPORT =====
            let touchStartX = 0;
            function handleTouchStart(e) {
                touchStartX = e.touches[0].clientX;
            }
            function handleTouchEnd(e) {
                const diff = touchStartX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) nextSlide();
                    else prevSlide();
                }
            }

            // ===== INITIALIZATION =====
            function initMihrab() {
                createMihrabStars();
                createParticles();
                buildSlideshow();

                // Navigation buttons
                const prevBtn = document.getElementById('mihrab-prev');
                const nextBtn = document.getElementById('mihrab-next');
                if (prevBtn) prevBtn.addEventListener('click', prevSlide);
                if (nextBtn) nextBtn.addEventListener('click', nextSlide);

                // Touch events
                const slideshow = document.getElementById('mihrab-slideshow');
                if (slideshow) {
                    slideshow.addEventListener('touchstart', handleTouchStart, { passive: true });
                    slideshow.addEventListener('touchend', handleTouchEnd, { passive: true });
                }

                // Keyboard navigation (when section is visible)
                document.addEventListener('keydown', function (e) {
                    const section = document.getElementById('mihrab-section');
                    if (!section) return;
                    const rect = section.getBoundingClientRect();
                    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                    if (isVisible) {
                        if (e.key === 'ArrowLeft') nextSlide();
                        else if (e.key === 'ArrowRight') prevSlide();
                    }
                });

                // Auto-slide
                resetAutoSlide();

                // Pause on hover
                const container = document.querySelector('.mihrab-slideshow');
                if (container) {
                    container.addEventListener('mouseenter', () => {
                        if (autoSlideTimer) clearInterval(autoSlideTimer);
                    });
                    container.addEventListener('mouseleave', resetAutoSlide);
                }

                // Try loading real RSS topics
                tryLoadRSS();
            }

            // Run when DOM is ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initMihrab);
            } else {
                initMihrab();
            }
        })();
