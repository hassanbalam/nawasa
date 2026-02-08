 document.addEventListener('DOMContentLoaded', () => {
                    const screen = document.getElementById('cinemaScreen');
                    const dotsContainer = document.getElementById('cinemaDots');

                    // Movies Data from Forum
                    const movies = [
                        { title: 'الظلال في الجانب الآخر', desc: 'فيلم درامي كلاسيكي - بطولة نجلاء فتحي', link: 'https://nawasa-elbahr.yoo7.com/t10197-topic', img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800', icon: 'fa-masks-theater' },
                        { title: 'الثعلب والحرباء', desc: 'إثارة وتشويق - ناهد شريف', link: 'https://nawasa-elbahr.yoo7.com/t10623-topic', img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800', icon: 'fa-paw' },
                        { title: 'رحلة عذاب', desc: 'دراما إنسانية مؤثرة', link: 'https://nawasa-elbahr.yoo7.com/t10622-topic', img: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=800', icon: 'fa-person-walking-luggage' },
                        { title: 'الجاكوار السوداء', desc: 'أكشن ومغامرات لا تنسى', link: 'https://nawasa-elbahr.yoo7.com/t10504-topic', img: 'https://images.unsplash.com/photo-1517604931442-710c8ef5ad25?auto=format&fit=crop&q=80&w=800', icon: 'fa-cat' },
                        { title: 'سمارة', desc: 'كلاسيكيات السينما المصرية', link: 'https://nawasa-elbahr.yoo7.com/t13250-topic', img: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=800', icon: 'fa-star' }
                    ];

                    let currentIndex = 0;

                    // Render Slides & Dots
                    if (screen && dotsContainer) {
                        screen.innerHTML = '';
                        dotsContainer.innerHTML = '';

                        movies.forEach((movie, i) => {
                            // Slide
                            const slide = document.createElement('div');
                            slide.className = `film-slide ${i === 0 ? 'active' : ''}`;
                            slide.innerHTML = `
                                <img src="${movie.img}" alt="${movie.title}" class="film-poster">
                                <div class="film-info">
                                    <i class="fa-solid ${movie.icon} film-icon-3d"></i>
                                    <h3 class="film-title">${movie.title}</h3>
                                    <p class="film-desc">${movie.desc}</p>
                                    <a href="${movie.link}" target="_blank" class="btn-film">
                                        <i class="fa-solid fa-ticket"></i> مشاهدة الفيلم
                                    </a>
                                </div>
                            `;
                            screen.appendChild(slide);

                            // Dot
                            const dot = document.createElement('span');
                            dot.className = `cinema-dot ${i === 0 ? 'active' : ''}`;
                            dot.dataset.index = i;
                            dot.addEventListener('click', () => goToSlide(i));
                            dotsContainer.appendChild(dot);
                        });

                        // Auto-play
                        setInterval(() => {
                            goToSlide((currentIndex + 1) % movies.length);
                        }, 7000);
                    }

                    function goToSlide(index) {
                        const slides = screen.querySelectorAll('.film-slide');
                        const dots = dotsContainer.querySelectorAll('.cinema-dot');
                        const reelLeft = document.getElementById('reelLeft');
                        const reelRight = document.getElementById('reelRight');
                        const filmStrip = document.getElementById('filmStrip');
                        const curtainLeft = document.getElementById('curtainLeft');
                        const curtainRight = document.getElementById('curtainRight');

                        // Trigger reel spinning animation
                        if (reelLeft && reelRight) {
                            reelLeft.classList.add('spinning');
                            reelRight.classList.add('spinning');
                            setTimeout(() => {
                                reelLeft.classList.remove('spinning');
                                reelRight.classList.remove('spinning');
                            }, 1500);
                        }

                        // Trigger film strip movement
                        if (filmStrip) {
                            filmStrip.classList.add('moving');
                            setTimeout(() => {
                                filmStrip.classList.remove('moving');
                            }, 1500);
                        }

                        // Trigger curtain opening animation
                        if (curtainLeft && curtainRight) {
                            curtainLeft.classList.add('opening');
                            curtainRight.classList.add('opening');
                            setTimeout(() => {
                                curtainLeft.classList.remove('opening');
                                curtainRight.classList.remove('opening');
                            }, 1500);
                        }

                        // Exit current
                        slides[currentIndex].classList.remove('active');
                        slides[currentIndex].classList.add('exit');
                        dots[currentIndex].classList.remove('active');

                        // Enter new
                        setTimeout(() => {
                            slides[currentIndex].classList.remove('exit');
                            slides[index].classList.add('active');
                            dots[index].classList.add('active');
                            currentIndex = index;
                        }, 100);
                    }
                });
