 document.addEventListener("DOMContentLoaded", () => {
                    const deckContainer = document.getElementById('solitaireDeck');
                    const infoContainer = document.getElementById('solitaireInfoContent');
                    const handIcon = document.getElementById('handData');
                    const btnNext = document.getElementById('solitaireNext');
                    const btnPrev = document.getElementById('solitairePrev');

                    // Specific Data Provided by User in Last Request
                    const images = [
                        { src: 'https://2img.net/280x/i.servimg.com/u/f27/20/26/76/31/unname17.jpg', title: 'إنجيل برنابا كامل النسخة الأصلية قراءة مباشرة', desc: '', icon: 'fa-book-bible', link: 'https://nawasa-elbahr.yoo7.com/r27572' },
                        { src: 'https://2img.net/280x/i.servimg.com/u/f27/20/26/76/31/unname16.jpg', title: 'الطين.. تلك التميمةُ التي تركها المطرُ على ناصيةِ الشارع', desc: '', icon: 'fa-cloud-rain', link: 'https://nawasa-elbahr.yoo7.com/r27567' },
                        { src: 'https://2img.net/280x/i.servimg.com/u/f27/20/26/76/31/unname15.jpg', title: 'الطين.. تلك التميمةُ التي تركها المطرُ على ناصيةِ الشارع', desc: '', icon: 'fa-umbrella', link: 'https://nawasa-elbahr.yoo7.com/r27567' },
                        { src: 'https://2img.net/280x/i.servimg.com/u/f27/20/26/76/31/unname19.jpg', title: 'كونى معى روحاً تعانقُ واقعى وتحيطُ بالأحلامِ نهرَ حياتِى', desc: '', icon: 'fa-heart', link: 'https://nawasa-elbahr.yoo7.com/r27566' },
                        { src: 'https://2img.net/280x/i.servimg.com/u/f27/20/26/76/31/unname18.jpg', title: 'كونى معى روحاً تعانقُ واقعى وتحيطُ بالأحلامِ نهرَ حياتِى', desc: '', icon: 'fa-water', link: 'https://nawasa-elbahr.yoo7.com/r27566' },
                        { src: 'https://2img.net/280x/i.servimg.com/u/f27/20/26/76/31/3o10.jpg', title: 'نوسا سفر التاريخ المفقود', desc: '', icon: 'fa-scroll', link: 'https://nawasa-elbahr.yoo7.com/r27563' }
                    ];

                    let currentIndex = 0;
                    let autoPlayInterval;

                    function initSolitaire() {
                        if (!deckContainer || !infoContainer) return;
                        deckContainer.innerHTML = '';
                        infoContainer.innerHTML = '';

                        // Add 3D Arrow Element Implementation
                        // Remove if exists to avoid duplication on re-runs
                        const existingArrow = document.getElementById('animArrow3D');
                        if (existingArrow) existingArrow.remove();

                        const arrowEl = document.createElement('i');
                        arrowEl.className = 'fa-solid fa-arrow-left connecting-arrow-3d';
                        arrowEl.id = 'animArrow3D';
                        deckContainer.parentElement.appendChild(arrowEl);

                        images.forEach((img, i) => {
                            // Create Card
                            const card = document.createElement('div');
                            card.className = 'solitaire-card';

                            const rot = (Math.random() * 4) - 2;
                            const offsetX = (Math.random() * 2) - 1;
                            const offsetY = (Math.random() * 2) - 1;

                            card.style.transform = `rotate(${rot}deg) translate(${offsetX}px, ${offsetY}px)`;
                            card.style.zIndex = images.length - i;

                            if (i === 0) card.classList.add('top-card');

                            // Card Content - Dual Image Structure for Blurred BG Effect
                            card.innerHTML = `
                                <div class="solitaire-card-inner">
                                    <img src="${img.src}" class="solitaire-card-bg" alt="bg">
                                    <img src="${img.src}" class="solitaire-card-img-main" alt="${img.title}">
                                    
                                    <div class="card-icon-overlay"><i class="fa-solid ${img.icon}"></i></div>
                                    <div class="card-hover-info">
                                        <i class="fa-solid ${img.icon} hover-icon-large"></i>
                                        <div class="card-hover-title">${img.title}</div>
                                        <p><i class="fa-solid fa-arrow-pointer"></i> اضغط للتفاصيل</p>
                                    </div>
                                </div>
                            `;

                            // REMOVED: 3D Tilt Effect on Hover (Requested to remove frame movement)
                            // Only reset on leave if needed, but since we don't tilt, we just keep initial random pos.

                            card.addEventListener('click', () => {
                                window.open(img.link, '_blank');
                            });

                            deckContainer.appendChild(card);

                            // Create Info Item
                            const info = document.createElement('div');
                            info.className = `info-item ${i === 0 ? 'active' : ''}`;
                            info.innerHTML = `
                                <h3 class="info-title"><i class="fa-solid ${img.icon}" style="margin-left:10px; font-size:0.8em;"></i>${img.title}</h3>
                                <p class="info-desc">${img.title}</p>
                                <a href="${img.link}" target="_blank" class="btn-3d-creative">
                                    <span>مشاهدة الموضوع</span>
                                    <i class="fa-solid fa-up-right-from-square"></i>
                                </a>
                            `;
                            infoContainer.appendChild(info);
                        });

                        startAutoPlay();
                    }

                    function nextCard() {
                        if (!deckContainer) return;
                        const cards = Array.from(deckContainer.children);
                        if (cards.length === 0) return;

                        const topCard = cards[currentIndex];
                        const currentInfo = infoContainer.children[currentIndex];
                        const arrow3D = document.getElementById('animArrow3D');

                        // Hand Animation - Trigger
                        if (handIcon) {
                            handIcon.classList.remove('animate');
                            void handIcon.offsetWidth;
                            handIcon.classList.add('animate');
                        }

                        // Arrow Animation - Trigger
                        if (arrow3D) {
                            arrow3D.classList.remove('animate');
                            void arrow3D.offsetWidth;
                            setTimeout(() => arrow3D.classList.add('animate'), 200);
                        }

                        // Fly Out Animation (Card being dealt)
                        setTimeout(() => {
                            topCard.classList.add('fly-out');
                            topCard.classList.remove('top-card');
                            currentInfo.classList.remove('active');
                        }, 400);

                        let nextIndex = (currentIndex + 1) % images.length;
                        const nextInfo = infoContainer.children[nextIndex];
                        const nextCardEl = cards[nextIndex];

                        // Show Next Info & Card Focus
                        setTimeout(() => {
                            if (nextInfo) nextInfo.classList.add('active');
                            if (nextCardEl) nextCardEl.classList.add('top-card');
                        }, 700);

                        // Reset position (Send to back of stack)
                        setTimeout(() => {
                            topCard.style.zIndex = -1; // Temporary lowest
                            topCard.classList.remove('fly-out');
                            topCard.classList.add('reset-pos');

                            // Re-sort Z-indices
                            cards.forEach((card, i) => {
                                let dist = (i - nextIndex + images.length) % images.length;
                                card.style.zIndex = images.length - dist;

                                if (i === currentIndex) {
                                    setTimeout(() => card.classList.remove('reset-pos'), 50);
                                }
                            });

                            currentIndex = nextIndex;
                        }, 1000);
                    }

                    function startAutoPlay() {
                        clearInterval(autoPlayInterval);
                        autoPlayInterval = setInterval(nextCard, 5000);
                    }

                    function stopAutoPlay() {
                        clearInterval(autoPlayInterval);
                    }

                    // Init
                    initSolitaire();

                    // Events
                    if (btnNext) btnNext.addEventListener('click', () => {
                        stopAutoPlay();
                        nextCard();
                        startAutoPlay();
                    });

                    if (btnPrev) btnPrev.addEventListener('click', () => {
                        stopAutoPlay();
                        nextCard(); // Simple cycle
                        startAutoPlay();
                    });

                    // Hover pauses
                    deckContainer.addEventListener('mouseenter', stopAutoPlay);
                    deckContainer.addEventListener('mouseleave', startAutoPlay);
                });
