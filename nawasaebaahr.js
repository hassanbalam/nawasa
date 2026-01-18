 /* 
           Nawasa El Bahr Script
           Functionality: Theme Toggle, Custom Cursor, Scroll Animation, Hero 3D Card
        */

        document.addEventListener("DOMContentLoaded", () => {

            // --- Theme Toggle Logic ---
            const themeToggleBtn = document.querySelector(".theme-toggle");
            const body = document.body;

            // Check saved theme
            const savedTheme = localStorage.getItem("theme");
            if (savedTheme === "light") {
                body.classList.add("light-mode");
                body.classList.remove("dark-mode");
            }

            themeToggleBtn.addEventListener("click", () => {
                body.classList.toggle("light-mode");
                body.classList.toggle("dark-mode");

                const currentTheme = body.classList.contains("light-mode") ? "light" : "dark";
                localStorage.setItem("theme", currentTheme);
            });

            // --- Mobile Menu Toggle ---
            const menuBtn = document.querySelector(".mobile-menu-btn");
            const navbar = document.querySelector(".navbar");
            const navLinks = document.querySelectorAll(".nav-link");

            menuBtn.addEventListener("click", () => {
                navbar.classList.toggle("active");
                const icon = menuBtn.querySelector("i");
                if (navbar.classList.contains("active")) {
                    icon.classList.remove("fa-bars");
                    icon.classList.add("fa-xmark");
                } else {
                    icon.classList.add("fa-bars");
                    icon.classList.remove("fa-xmark");
                }
            });

            // Close menu when clicking link
            navLinks.forEach(link => {
                link.addEventListener("click", () => {
                    navbar.classList.remove("active");
                    const icon = menuBtn.querySelector("i");
                    icon.classList.add("fa-bars");
                    icon.classList.remove("fa-xmark");
                });
            });

            // --- Professional Slideshow Controls ---
            let currentSlideIndex = 0;
            const slides = document.querySelectorAll('.slide');
            const indicators = document.querySelectorAll('.indicator');
            let autoSlideInterval;

            function showSlide(index) {
                slides.forEach(slide => slide.classList.remove('active'));
                indicators.forEach(ind => ind.classList.remove('active'));

                if (index >= slides.length) currentSlideIndex = 0;
                else if (index < 0) currentSlideIndex = slides.length - 1;
                else currentSlideIndex = index;

                slides[currentSlideIndex].classList.add('active');
                indicators[currentSlideIndex].classList.add('active');
            }

            window.changeSlide = function (direction) {
                showSlide(currentSlideIndex + direction);
                resetAutoSlide();
            }

            window.currentSlide = function (index) {
                showSlide(index);
                resetAutoSlide();
            }

            function autoSlide() {
                currentSlideIndex++;
                showSlide(currentSlideIndex);
            }

            function resetAutoSlide() {
                clearInterval(autoSlideInterval);
                autoSlideInterval = setInterval(autoSlide, 5000);
            }

            autoSlideInterval = setInterval(autoSlide, 5000);

            // --- Custom Cursor ---
            const cursorDot = document.querySelector("[data-cursor-dot]");
            const cursorOutline = document.querySelector("[data-cursor-outline]");

            window.addEventListener("mousemove", (e) => {
                const posX = e.clientX;
                const posY = e.clientY;

                // Dot follows instantly
                cursorDot.style.left = `${posX}px`;
                cursorDot.style.top = `${posY}px`;

                // Outline follows with lag which we can animate using standard JS or keyframes
                // Using animate() for smooth performance
                cursorOutline.animate({
                    left: `${posX}px`,
                    top: `${posY}px`
                }, { duration: 500, fill: "forwards" });
            });

            // Add hover states for inputs and buttons
            const interactiveElements = document.querySelectorAll("a, button, .hero-card, .cat-card, .post-card");
            interactiveElements.forEach(el => {
                el.addEventListener("mouseenter", () => {
                    cursorOutline.style.transform = "translate(-50%, -50%) scale(1.5)";
                    cursorOutline.style.backgroundColor = "rgba(6, 182, 212, 0.1)"; // accent color transparent
                });
                el.addEventListener("mouseleave", () => {
                    cursorOutline.style.transform = "translate(-50%, -50%) scale(1)";
                    cursorOutline.style.backgroundColor = "transparent";
                });
            });

            // --- RSS Feed Logic ---
            const rssFeedUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://nawasa-elbahr.yoo7.com/rss';
            const rssTrack = document.getElementById('rssTrack');
            const rssSection = document.getElementById('rssFeed');

            if (rssTrack && rssSection) {
                // Fetch Data
                fetch(rssFeedUrl)
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'ok' && data.items.length > 0) {
                            renderRssItems(data.items);
                        } else {
                            rssTrack.innerHTML = '<p style="color:var(--text-secondary); padding:2rem;">لا توجد أخبار حالياً</p>';
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching RSS:', error);
                        rssTrack.innerHTML = '<p style="color:var(--text-secondary); padding:2rem;">فشل تحميل الأخبار. يرجى المحاولة لاحقاً.</p>';
                    });

                function renderRssItems(items) {
                    rssTrack.innerHTML = '';
                    items.forEach(item => {
                        // Extract image from description or use placeholder
                        let imgUrl = 'https://i.servimg.com/u/f65/13/97/93/74/aaoco_10.png'; // Fallback
                        const imgMatch = item.description.match(/src="([^"]+)"/);
                        if (imgMatch) {
                            imgUrl = imgMatch[1];
                        }

                        const card = document.createElement('div');
                        card.className = 'rss-card';
                        card.innerHTML = `
                    <img src="${imgUrl}" alt="${item.title}" loading="lazy">
                    <h4>${item.title}</h4>
                    <a href="${item.link}" target="_blank" class="rss-link">اقرأ المزيد <i class="fa-solid fa-arrow-left"></i></a>
                `;
                        rssTrack.appendChild(card);
                    });

                    // Clone items for infinite loop feel (optional, but good for sliding)
                    // For now, simple sliding based on mouse position relative to container
                }


            }

            // --- Timeline (Announcements) Logic ---
            const timelineTrack = document.getElementById('timelineTrack');

            if (timelineTrack) {
                // Reuse the same RSS URL as requested
                // https://nawasa-elbahr.yoo7.com/rss
                const timelineFeedUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://nawasa-elbahr.yoo7.com/rss';

                fetch(timelineFeedUrl)
                    .then(res => res.json())
                    .then(data => {
                        if (data.status === 'ok' && data.items.length > 0) {
                            renderTimeline(data.items);
                        } else {
                            timelineTrack.innerHTML = '<p style="text-align:center;">لا توجد إعلانات حالياً</p>';
                        }
                    })
                    .catch(err => {
                        console.error('Timeline Error:', err);
                        timelineTrack.innerHTML = '<p style="text-align:center;">تعذر تحميل الإعلانات.</p>';
                    });

                function renderTimeline(items) {
                    timelineTrack.innerHTML = '';
                    items.forEach((item, index) => {
                        const div = document.createElement('div');
                        div.className = `timeline-item fade-in`;

                        // Extract icon or use random for floating background
                        const icons = ['fa-star', 'fa-bell', 'fa-lightbulb', 'fa-bullhorn'];
                        const randIcon = icons[Math.floor(Math.random() * icons.length)];

                        // Icon for title (interactive)
                        const titleIcon = 'fa-circle-check';

                        // Icon on the timeline axis
                        const timelineIcon = 'fa-calendar-check';

                        div.innerHTML = `
                                <!-- Node on the line -->
                                <div class="timeline-node">
                                    <i class="fa-solid ${randIcon}"></i>
                                </div>
                                <div class="timeline-date-badge">${item.pubDate.split(' ')[0]}</div>

                                <div class="timeline-content" style="text-align: right; direction: rtl;">
                                    <i class="fa-solid ${randIcon} timeline-icon-floating"></i>
                                    <h3 class="timeline-title">
                                        <i class="fa-solid ${titleIcon} title-icon-anim"></i>
                                        ${item.title}
                                    </h3>
                                    <a href="${item.link}" target="_blank" class="timeline-link">التكامل <i class="fa-solid fa-arrow-left"></i></a>
                                </div>
                            `;
                        timelineTrack.appendChild(div);

                        // Fix: Observe element for animation
                        if (typeof observer !== 'undefined') {
                            observer.observe(div);
                        } else {
                            div.style.opacity = 1;
                            div.style.transform = 'translateY(0)';
                        }
                    });
                }
            }


            // --- Hero 3D Card Effect ---
            const heroSection = document.querySelector(".hero");
            const heroCard = document.querySelector("#heroCard");

            // Check if hero elements exist to avoid errors on pages without them
            if (heroSection && heroCard) {
                heroSection.addEventListener("mousemove", (e) => {
                    // Calculate position relative to container
                    let xAxis = (window.innerWidth / 2 - e.pageX) / 20;
                    let yAxis = (window.innerHeight / 2 - e.pageY) / 20;

                    // Limit the rotation
                    heroCard.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
                });

                // Snap back on leave
                heroSection.addEventListener("mouseleave", () => {
                    heroCard.style.transform = `rotateY(0deg) rotateX(0deg)`;
                    heroCard.style.transition = "transform 0.5s ease";
                });

                heroSection.addEventListener("mouseenter", () => {
                    heroCard.style.transition = "none";
                });
            }

            // --- Scroll Animations (Intersection Observer) ---
            const observerOptions = {
                threshold: 0.1,
                rootMargin: "0px 0px -50px 0px"
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            }, observerOptions);

            const fadeElements = document.querySelectorAll(".fade-in");
            fadeElements.forEach(el => observer.observe(el));


            // --- Slider Button Controls ---

            // Helper function to scroll tracks
            function scrollTrack(trackId, direction) {
                const track = document.getElementById(trackId);
                if (track) {
                    const scrollAmount = 350; // Width of card + gap
                    if (direction === 'left') {
                        track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                    } else {
                        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                    }
                }
            }

            // Latest Posts Controls
            document.getElementById('postsPrev')?.addEventListener('click', () => {
                scrollTrack('postsTrack', 'right'); // Left button moves track right (shows previous)
            });

            document.getElementById('postsNext')?.addEventListener('click', () => {
                scrollTrack('postsTrack', 'left'); // Right button moves track left (shows next)
            });

            // RSS Controls (Hybrid approach)
            // Since RSS uses custom transform logic, we can also add manual offsets
            let rssManualOffset = 0;
            const rssTrackEl = document.getElementById('rssTrack');

            document.getElementById('rssPrev')?.addEventListener('click', () => {
                // In RTL, Prev (Right Arrow) moves track LEFT to show previous (right) items
                if (!rssTrackEl) return;
                const currentTransform = new WebKitCSSMatrix(window.getComputedStyle(rssTrackEl).transform);
                const currentX = currentTransform.m41;
                rssTrackEl.style.transform = `translateX(${currentX - 320}px)`;
            });

            document.getElementById('rssNext')?.addEventListener('click', () => {
                // In RTL, Next (Left Arrow) moves track RIGHT to show next (left) items
                if (!rssTrackEl) return;
                const currentTransform = new WebKitCSSMatrix(window.getComputedStyle(rssTrackEl).transform);
                const currentX = currentTransform.m41;
                rssTrackEl.style.transform = `translateX(${currentX + 320}px)`;
            });

            // --- Creative Gallery Logic (Manual Buttons Only) ---
            const gallerySection = document.querySelector('.gallery-section');
            const galleryTrack = document.getElementById('galleryTrack');
            const btnPrevGallery = document.getElementById('galleryPrev');
            const btnNextGallery = document.getElementById('galleryNext');


            // --- Creative Search Logic (In-Page) ---
            const searchForm = document.querySelector('.search-form');
            const searchInput = document.querySelector('.search-input');
            const searchModal = document.getElementById('searchModal');
            const closeSearchBtn = document.getElementById('closeSearchBtn');
            const modalSearchForm = document.getElementById('modalSearchForm');
            const modalSearchInput = document.getElementById('modalSearchInput');

            if (searchForm) {
                searchForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const query = searchInput.value.trim();
                    if (query.length > 0) {
                        if (modalSearchInput) modalSearchInput.value = query;
                        performPageSearch(query);
                        openSearchModal();
                    }
                });
            }

            if (modalSearchForm) {
                modalSearchForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const query = modalSearchInput.value.trim();
                    if (query.length > 0) {
                        performPageSearch(query);
                    }
                });
            }

            // Also trigger on icon click
            const searchBtnIcon = document.querySelector('.search-btn');
            if (searchBtnIcon && searchInput) {
                searchBtnIcon.addEventListener('click', (e) => {
                    e.preventDefault();
                    const query = searchInput.value.trim();
                    if (query.length > 0) {
                        if (modalSearchInput) modalSearchInput.value = query;
                        performPageSearch(query);
                        openSearchModal();
                    }
                });
            }

            // Close Logic
            if (closeSearchBtn) {
                closeSearchBtn.addEventListener('click', closeSearchModal);
            }
            if (searchModal) {
                searchModal.addEventListener('click', (e) => {
                    if (e.target === searchModal) closeSearchModal();
                });
            }

            function openSearchModal() {
                searchModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            function closeSearchModal() {
                searchModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }

            // External Link Logic
            let lastSearchQuery = "";
            document.getElementById('openExternalSearch')?.addEventListener('click', () => {
                if (lastSearchQuery) {
                    const searchUrl = `https://nawasa-elbahr.yoo7.com/search?search_keywords=${encodeURIComponent(lastSearchQuery)}`;
                    window.open(searchUrl, '_blank');
                }
            });

            // The Search Logic (Using Internal Forum Search Iframe)
            function performPageSearch(query) {
                // Ensure modal is open
                openSearchModal();
                lastSearchQuery = query;

                const searchIframe = document.getElementById('forumSearchIframe');
                if (searchIframe) {
                    // Build the internal forum search URL
                    const searchUrl = `https://nawasa-elbahr.yoo7.com/search?search_keywords=${encodeURIComponent(query)}`;
                    searchIframe.src = searchUrl;
                }
            }

            if (galleryTrack && btnPrevGallery && btnNextGallery) {
                let currentIndex = 0;

                const updateGallery = (smooth = true) => {
                    const trackWidth = galleryTrack.parentElement.offsetWidth;
                    const item = galleryTrack.querySelector('.gallery-item');
                    if (!item) return;

                    const itemWidth = item.offsetWidth;
                    const gap = parseFloat(getComputedStyle(galleryTrack).gap) || 30;
                    const slideWidth = itemWidth + gap;

                    const itemsPerView = Math.max(1, Math.floor((trackWidth + gap) / slideWidth));
                    const itemsCount = galleryTrack.children.length;
                    const maxIndex = Math.max(0, itemsCount - itemsPerView);

                    if (currentIndex > maxIndex) currentIndex = maxIndex;
                    if (currentIndex < 0) currentIndex = 0;

                    // Positive for RTL: moving track right shows items to the left
                    const offset = currentIndex * slideWidth;
                    galleryTrack.style.transition = smooth ? 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)' : 'none';
                    galleryTrack.style.transform = `translateX(${offset}px)`;
                };

                btnNextGallery.addEventListener('click', () => {
                    const trackWidth = galleryTrack.parentElement.offsetWidth;
                    const item = galleryTrack.querySelector('.gallery-item');
                    const gap = parseFloat(getComputedStyle(galleryTrack).gap) || 30;
                    const slideWidth = item.offsetWidth + gap;
                    const itemsPerView = Math.max(1, Math.floor((trackWidth + gap) / slideWidth));
                    const itemsCount = galleryTrack.children.length;

                    if (currentIndex < itemsCount - itemsPerView) {
                        currentIndex++;
                    } else {
                        currentIndex = 0;
                    }
                    updateGallery();
                });

                btnPrevGallery.addEventListener('click', () => {
                    const trackWidth = galleryTrack.parentElement.offsetWidth;
                    const item = galleryTrack.querySelector('.gallery-item');
                    const gap = parseFloat(getComputedStyle(galleryTrack).gap) || 30;
                    const slideWidth = item.offsetWidth + gap;
                    const itemsPerView = Math.max(1, Math.floor((trackWidth + gap) / slideWidth));
                    const itemsCount = galleryTrack.children.length;

                    if (currentIndex > 0) {
                        currentIndex--;
                    } else {
                        currentIndex = Math.max(0, itemsCount - itemsPerView);
                    }
                    updateGallery();
                });

                // Initialize
                setTimeout(() => updateGallery(false), 100);
                window.addEventListener('resize', () => updateGallery(false));
            }

            // --- Directory Slider Logic ---
            const dirTrack = document.getElementById('dirTrack');
            const btnPrevDir = document.getElementById('dirPrev');
            const btnNextDir = document.getElementById('dirNext');

            if (dirTrack && btnPrevDir && btnNextDir) {
                let dirPosition = 0;
                const cardWidth = 244;

                const updateDirMaxScroll = () => {
                    return dirTrack.scrollWidth - dirTrack.parentElement.offsetWidth;
                };

                btnNextDir.addEventListener('click', () => {
                    const maxScroll = updateDirMaxScroll();
                    dirPosition += cardWidth;
                    if (dirPosition > maxScroll) dirPosition = maxScroll;
                    dirTrack.style.transform = `translateX(${dirPosition}px)`;
                });

                btnPrevDir.addEventListener('click', () => {
                    dirPosition -= cardWidth;
                    if (dirPosition < 0) dirPosition = 0;
                    dirTrack.style.transform = `translateX(${dirPosition}px)`;
                });
            }

        });
