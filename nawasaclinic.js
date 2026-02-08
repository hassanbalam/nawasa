                document.addEventListener('DOMContentLoaded', () => {
                    const slideshow = document.getElementById('clinicSlideshow');
                    const dotsContainer = document.getElementById('clinicDots');
                    const prevBtn = document.getElementById('clinicPrev');
                    const nextBtn = document.getElementById('clinicNext');

                    // Medical Topics Data from Forum
                    const medicalTopics = [
                        {
                            title: 'يعمدون إلى تعقيد الأمور على المريض حتّى فى قراءة الروشتة',
                            desc: 'موضوع مهم عن صعوبات قراءة الوصفات الطبية',
                            link: 'https://nawasa-elbahr.yoo7.com/t13372-topic',
                            icon: 'fa-prescription',
                            img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400'
                        },
                        {
                            title: 'علاج البواسير بدون تدخل جراحى',
                            desc: 'طرق طبيعية وفعالة للعلاج',
                            link: 'https://nawasa-elbahr.yoo7.com/t13370-topic',
                            icon: 'fa-hand-holding-medical',
                            img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400'
                        },
                        {
                            title: 'الفرق بين الفيروس والميكروب',
                            desc: 'معلومات طبية هامة للتفريق بينهما',
                            link: 'https://nawasa-elbahr.yoo7.com/t13015-topic',
                            icon: 'fa-virus',
                            img: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=400'
                        },
                        {
                            title: 'طريقة علاج تسلخات الاطفال بوصفة سحرية',
                            desc: 'وصفة طبيعية بدون كريمات وأدوية',
                            link: 'https://nawasa-elbahr.yoo7.com/t12662-topic',
                            icon: 'fa-baby',
                            img: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&q=80&w=400'
                        },
                        {
                            title: 'الجرجير أقوى من الفياجرا',
                            desc: 'فوائد صحية مذهلة للجرجير',
                            link: 'https://nawasa-elbahr.yoo7.com/t12312-topic',
                            icon: 'fa-leaf',
                            img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400'
                        },
                        {
                            title: 'الرياضة تنقذ حياتك من أزمات العمر',
                            desc: 'أهمية الرياضة للصحة العامة',
                            link: 'https://nawasa-elbahr.yoo7.com/t11587-topic',
                            icon: 'fa-person-running',
                            img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=400'
                        },
                        {
                            title: 'قلة السوائل سبب رئيسى فى الإصابة بحصوات الجهاز البولى',
                            desc: 'نصائح للوقاية من حصوات الكلى',
                            link: 'https://nawasa-elbahr.yoo7.com/t11586-topic',
                            icon: 'fa-droplet',
                            img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400'
                        },
                        {
                            title: 'علاج طبيعى لضعف النظر وتمارين لتقوية البصر',
                            desc: 'تمارين للاستغناء عن النظارة',
                            link: 'https://nawasa-elbahr.yoo7.com/t11514-topic',
                            icon: 'fa-eye',
                            img: 'https://images.unsplash.com/photo-1494869042583-f6c911f04b4c?auto=format&fit=crop&q=80&w=400'
                        },
                        {
                            title: 'دورة الاسعافات الأولية للحالات الطارئة',
                            desc: 'دورة كاملة صوتية mp3',
                            link: 'https://nawasa-elbahr.yoo7.com/t11420-topic',
                            icon: 'fa-kit-medical',
                            img: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80&w=400'
                        },
                        {
                            title: 'طريقة تنظيف الكبد بطرق طبيعية',
                            desc: 'كيف تنظف كبدك وتحافظ على صحته',
                            link: 'https://nawasa-elbahr.yoo7.com/t11338-topic',
                            icon: 'fa-heart',
                            img: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80&w=400'
                        },
                        {
                            title: 'أسباب ضعف الذاكرة وطرق تقويتها',
                            desc: 'علاج ضعف الذاكرة بطرق فعالة',
                            link: 'https://nawasa-elbahr.yoo7.com/t11245-topic',
                            icon: 'fa-brain',
                            img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=400'
                        },
                        {
                            title: 'أسباب نزيف الأنف وطريقة علاجه',
                            desc: 'معلومات طبية عن الرعاف وعلاجه',
                            link: 'https://nawasa-elbahr.yoo7.com/t11206-topic',
                            icon: 'fa-face-grimace',
                            img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400'
                        }
                    ];

                    let currentSlide = 0;
                    let autoPlayInterval;

                    // Render Slides & Dots
                    if (slideshow && dotsContainer) {
                        slideshow.innerHTML = '';
                        dotsContainer.innerHTML = '';

                        medicalTopics.forEach((topic, i) => {
                            // Create Slide
                            const slide = document.createElement('div');
                            slide.className = `clinic-slide ${i === 0 ? 'active' : ''}`;
                            slide.innerHTML = `
                                <img src="${topic.img}" alt="${topic.title}" class="slide-topic-image">
                                <div class="slide-topic-content">
                                    <div class="slide-topic-icon">
                                        <i class="fa-solid ${topic.icon}"></i>
                                    </div>
                                    <a href="${topic.link}" target="_blank" class="slide-topic-title-link">
                                        <h3 class="slide-topic-title">${topic.title}</h3>
                                    </a>
                                    <p class="slide-topic-desc">${topic.desc}</p>
                                    <a href="${topic.link}" target="_blank" class="slide-topic-btn">
                                        <i class="fa-solid fa-book-medical"></i>
                                        اقرأ المزيد
                                    </a>
                                </div>
                            `;
                            slideshow.appendChild(slide);

                            // Create Dot
                            const dot = document.createElement('span');
                            dot.className = `clinic-dot ${i === 0 ? 'active' : ''}`;
                            dot.dataset.index = i;
                            dot.addEventListener('click', () => goToClinicSlide(i));
                            dotsContainer.appendChild(dot);
                        });

                        // Auto-play
                        function startAutoPlay() {
                            autoPlayInterval = setInterval(() => {
                                goToClinicSlide((currentSlide + 1) % medicalTopics.length);
                            }, 5000);
                        }

                        function stopAutoPlay() {
                            clearInterval(autoPlayInterval);
                        }

                        startAutoPlay();

                        // Pause on hover
                        slideshow.parentElement.addEventListener('mouseenter', stopAutoPlay);
                        slideshow.parentElement.addEventListener('mouseleave', startAutoPlay);
                    }

                    function goToClinicSlide(index) {
                        const slides = slideshow.querySelectorAll('.clinic-slide');
                        const dots = dotsContainer.querySelectorAll('.clinic-dot');

                        // Remove active from current
                        slides[currentSlide].classList.remove('active');
                        dots[currentSlide].classList.remove('active');

                        // Add active to new
                        slides[index].classList.add('active');
                        dots[index].classList.add('active');

                        currentSlide = index;
                    }

                    // Navigation Buttons
                    if (prevBtn) {
                        prevBtn.addEventListener('click', () => {
                            stopAutoPlay();
                            goToClinicSlide((currentSlide - 1 + medicalTopics.length) % medicalTopics.length);
                            startAutoPlay();
                        });
                    }

                    if (nextBtn) {
                        nextBtn.addEventListener('click', () => {
                            stopAutoPlay();
                            goToClinicSlide((currentSlide + 1) % medicalTopics.length);
                            startAutoPlay();
                        });
                    }

                    function stopAutoPlay() {
                        clearInterval(autoPlayInterval);
                    }

                    function startAutoPlay() {
                        stopAutoPlay();
                        autoPlayInterval = setInterval(() => {
                            goToClinicSlide((currentSlide + 1) % medicalTopics.length);
                        }, 5000);
                    }
                });
