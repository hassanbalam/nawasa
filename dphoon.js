        /* ========= Phone Directory Logic ========= */
        (function() {
            // === Phone Data from both pages ===
            const phoneData = [
                {name: "إبتسام صلاح عبد العزيز الشناوى", phone: "6432774"},
                {name: "إبراهيم إبراهيم أحمد بلم", phone: "6432204"},
                {name: "إبراهيم إبراهيم أحمد واصل", phone: "6431134"},
                {name: "إبراهيم إبراهيم الدسوقي إبراهيم", phone: "6431237"},
                {name: "إبراهيم إبراهيم حسن عبد الحليم", phone: "6432415"},
                {name: "إبراهيم إبراهيم محمد الباجورى", phone: "6433188"},
                {name: "إبراهيم أحمد إبراهيم بلم", phone: "6431100"},
                {name: "إبراهيم أحمد إبراهيم سليم", phone: "6432277"},
                {name: "إبراهيم الصاوى الشحات الشناوى", phone: "6432834"},
                {name: "إبراهيم حسن محمد الشناوى", phone: "6432576"},
                {name: "إبراهيم محمد إبراهيم البرديسى", phone: "6432816"},
                {name: "إبراهيم محمد حسن الريس", phone: "6432832"},
                {name: "إبراهيم محمد حسن الملاح", phone: "6431474"},
                {name: "أحمد إبراهيم المية", phone: "6431792"},
                {name: "أحمد حافظ داوود", phone: "6431103"},
                {name: "أحمد حامد زغلول", phone: "6431495"},
                {name: "أحمد حسن أحمد الدخاخنى", phone: "6432760"},
                {name: "أحمد حسن أحمد يوسف", phone: "6433196"},
                {name: "أحمد حسن المرسى الريس", phone: "6432825"},
                {name: "أحمد حسن عبد الفتاح يوسف", phone: "6432442"},
                {name: "أحمد رزق عبد المجيد طه", phone: "6432260"},
                {name: "أحمد سعيد أحمد المصرى", phone: "6431720"},
                {name: "أحمد سعيد قاسم واصل", phone: "6431138"},
                {name: "أحمد سليمان ندا", phone: "6431543"},
                {name: "أحمد شوقى محمد بلم", phone: "6431133"},
                {name: "أحمد صلاح عبد العزيز الشناوى", phone: "6431539"},
                {name: "أحمد عبد الحميد زغلول", phone: "6431494"},
                {name: "أحمد عبد الرحمن أحمد يوسف", phone: "6432783"},
                {name: "أحمد عبد الفتاح شبل كامل", phone: "6432291"},
                {name: "أحمد عبد اللطيف حسان حسونة", phone: "6432222"},
                {name: "أحمد عبد الوهاب أحمد الدخاخنى", phone: "6431175"},
                {name: "أحمد فاروق أحمد بلم", phone: "6433217"},
                {name: "أحمد فوزى عبد الرحمن يوسف", phone: "6432218"},
                {name: "أحمد محمد أحمد العطار", phone: "6431481"},
                {name: "أحمد محمد أحمد حماد", phone: "6431249"},
                {name: "أحمد محمد أحمد سمك", phone: "6432209"},
                {name: "أحمد محمد أحمد غنيم", phone: "6431490"},
                {name: "أحمد محمد حسن بلم", phone: "6432201"},
                {name: "أحمد محمد صالح البرديسى", phone: "6432261"},
                {name: "أحمد محمد عبد الحافظ يوسف", phone: "6431182"},
                {name: "أحمد محمد عقدة", phone: "6431533"},
                {name: "أحمد محمد مسعد الملاح", phone: "6431473"},
                {name: "السيد إبراهيم السيد بلم", phone: "6432200"},
                {name: "السيد إبراهيم على حسونة", phone: "6432230"},
                {name: "السيد حسن عوض الشناوى", phone: "6431750"},
                {name: "السيد رمضان عامر", phone: "6432211"},
                {name: "السيد عبد الرحمن حماد", phone: "6431250"},
                {name: "السيد عبد الفتاح كامل", phone: "6432292"},
                {name: "السيد محمد العبد حسونة", phone: "6432225"},
                {name: "السيد محمد حسن يوسف", phone: "6431194"},
                {name: "السيد مسعد الملاح", phone: "6431475"},
                {name: "حسن إبراهيم بلم", phone: "6431101"},
                {name: "حسن أحمد الشناوى", phone: "6431538"},
                {name: "حسن محمد حسن بلم", phone: "6432202"},
                {name: "حسن محمد حسن الريس", phone: "6432830"},
                {name: "حسن عبد الحليم حسن", phone: "6432416"},
                {name: "حسن محمد الباجورى", phone: "6433189"},
                {name: "خالد إبراهيم الدسوقي", phone: "6431238"},
                {name: "خالد أحمد المصرى", phone: "6431721"},
                {name: "خالد محمد حسن الملاح", phone: "6431476"},
                {name: "رمضان سعيد واصل", phone: "6431139"},
                {name: "سعيد أحمد المصرى", phone: "6431722"},
                {name: "سعيد قاسم واصل", phone: "6431140"},
                {name: "سمير محمد البرديسى", phone: "6432817"},
                {name: "شعبان إبراهيم بلم", phone: "6431102"},
                {name: "صلاح عبد العزيز الشناوى", phone: "6432775"},
                {name: "عادل محمد حسن بلم", phone: "6432203"},
                {name: "عبد الحميد محمد زغلول", phone: "6431496"},
                {name: "عبد الرحمن أحمد يوسف", phone: "6432784"},
                {name: "عبد الفتاح شبل كامل", phone: "6432293"},
                {name: "عبد اللطيف حسان حسونة", phone: "6432223"},
                {name: "عبد الوهاب أحمد الدخاخنى", phone: "6431176"},
                {name: "على حسن عوض الشناوى", phone: "6431751"},
                {name: "على محمد العبد حسونة", phone: "6432226"},
                {name: "فاروق أحمد بلم", phone: "6433218"},
                {name: "فوزى عبد الرحمن يوسف", phone: "6432219"},
                {name: "كامل عبد الفتاح كامل", phone: "6432294"},
                {name: "محمد إبراهيم البرديسى", phone: "6432818"},
                {name: "محمد إبراهيم الدسوقي", phone: "6431239"},
                {name: "محمد أحمد حماد", phone: "6431251"},
                {name: "محمد أحمد سمك", phone: "6432210"},
                {name: "محمد أحمد غنيم", phone: "6431491"},
                {name: "محمد حسن بلم", phone: "6432205"},
                {name: "محمد حسن الريس", phone: "6432831"},
                {name: "محمد حسن الملاح", phone: "6431477"},
                {name: "محمد حسن يوسف", phone: "6431195"},
                {name: "محمد رزق عبد المجيد طه", phone: "6432262"},
                {name: "محمد سعيد قاسم واصل", phone: "6431141"},
                {name: "محمد شوقى بلم", phone: "6431135"},
                {name: "محمد صالح البرديسى", phone: "6432263"},
                {name: "محمد صلاح عبد العزيز الشناوى", phone: "6432776"},
                {name: "محمد عبد الحافظ يوسف", phone: "6431183"},
                {name: "محمد عبد الحميد زغلول", phone: "6431497"},
                {name: "محمد عبد الرحمن حماد", phone: "6431252"},
                {name: "محمد عقدة", phone: "6431534"},
                {name: "محمد فوزى عبد الرحمن يوسف", phone: "6432220"},
                {name: "محمد مسعد الملاح", phone: "6431478"},
                {name: "محمود إبراهيم بلم", phone: "6431103"},
                {name: "محمود حسن الشناوى", phone: "6432577"},
                {name: "محمود محمد حسن بلم", phone: "6432206"},
                {name: "مسعد محمد الملاح", phone: "6431479"},
                {name: "مصطفى أحمد المصرى", phone: "6431723"},
                {name: "مصطفى محمد حسن بلم", phone: "6432207"},
                {name: "نبيل محمد الباجورى", phone: "6433190"},
                {name: "يوسف أحمد يوسف", phone: "6432785"},
                {name: "يوسف عبد الفتاح كامل", phone: "6432295"}
            ];

            const arabicLetters = ['ا','أ','إ','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش','ص','ض','ط','ظ','ع','غ','ف','ق','ك','ل','م','ن','ه','و','ي'];

            let currentFilter = 'all';
            let searchQuery = '';

            // Build Alphabet Filter
            function buildAlphabetFilter() {
                const filterBar = document.getElementById('alpha-filter');
                if (!filterBar) return;

                // Show all button
                const allBtn = document.createElement('button');
                allBtn.className = 'alpha-btn show-all active';
                allBtn.textContent = 'الكل';
                allBtn.onclick = () => { setFilter('all', allBtn); };
                filterBar.appendChild(allBtn);

                arabicLetters.forEach(letter => {
                    const btn = document.createElement('button');
                    btn.className = 'alpha-btn';
                    btn.textContent = letter;
                    btn.onclick = () => { setFilter(letter, btn); };
                    filterBar.appendChild(btn);
                });
            }

            function setFilter(filter, btnEl) {
                currentFilter = filter;
                // Update active
                document.querySelectorAll('.alpha-btn').forEach(b => b.classList.remove('active'));
                btnEl.classList.add('active');
                renderCards();
            }

            // Filter data
            function getFilteredData() {
                let data = phoneData;

                // Alphabet filter
                if (currentFilter !== 'all') {
                    data = data.filter(entry => {
                        const firstChar = entry.name.trim().charAt(0);
                        return firstChar === currentFilter;
                    });
                }

                // Search filter
                if (searchQuery) {
                    const q = searchQuery.toLowerCase();
                    data = data.filter(entry =>
                        entry.name.toLowerCase().includes(q) || entry.phone.includes(q)
                    );
                }

                return data;
            }

            // Render phone cards
            function renderCards() {
                const track = document.getElementById('phone-carousel-track');
                if (!track) return;
                track.innerHTML = '';

                const filtered = getFilteredData();

                // Update counter
                const visibleEl = document.getElementById('visible-count');
                const totalEl = document.getElementById('total-count');
                if (visibleEl) visibleEl.textContent = filtered.length;
                if (totalEl) totalEl.textContent = phoneData.length;

                if (filtered.length === 0) {
                    track.innerHTML = '<div style="color: rgba(255,255,255,0.4); text-align: center; width: 100%; padding: 3rem;">لا توجد نتائج</div>';
                    return;
                }

                filtered.forEach((entry, idx) => {
                    const card = document.createElement('div');
                    card.className = 'phone-card-3d';
                    card.style.opacity = '0';
                    card.style.animation = `fadeInUp 0.5s ease forwards ${idx * 0.03}s`;

                    // Generate avatar initials
                    const initials = entry.name.split(' ').slice(0, 2).map(w => w.charAt(0)).join('');

                    card.innerHTML = `
                        <div class="phone-card-inner">
                            <div class="booth-top"></div>
                            <div class="phone-avatar">${initials}</div>
                            <div class="phone-name">${entry.name}</div>
                            <div class="phone-number">${entry.phone}</div>
                            <a href="tel:${entry.phone}" class="phone-call-btn">
                                <i class="ri-phone-line"></i> اتصل
                            </a>
                        </div>
                    `;

                    // 3D hover tilt effect
                    const inner = card;
                    inner.addEventListener('mousemove', (e) => {
                        const rect = inner.getBoundingClientRect();
                        const x = ((e.clientX - rect.left) / rect.width) - 0.5;
                        const y = ((e.clientY - rect.top) / rect.height) - 0.5;
                        const cardInner = inner.querySelector('.phone-card-inner');
                        if (cardInner) {
                            cardInner.style.transform = `translateY(-10px) rotateY(${x * 15}deg) rotateX(${-y * 15}deg)`;
                        }
                    });
                    inner.addEventListener('mouseleave', () => {
                        const cardInner = inner.querySelector('.phone-card-inner');
                        if (cardInner) {
                            cardInner.style.transform = '';
                        }
                    });

                    track.appendChild(card);
                });
            }

            // Carousel Navigation
            function initPhoneCarouselNav() {
                const track = document.getElementById('phone-carousel-track');
                const prevBtn = document.getElementById('phone-prev');
                const nextBtn = document.getElementById('phone-next');
                if (!track || !prevBtn || !nextBtn) return;

                prevBtn.addEventListener('click', () => {
                    track.scrollBy({ left: 300, behavior: 'smooth' });
                });
                nextBtn.addEventListener('click', () => {
                    track.scrollBy({ left: -300, behavior: 'smooth' });
                });
            }

            // Search
            function initPhoneSearch() {
                const input = document.getElementById('phone-search-input');
                if (!input) return;
                input.addEventListener('input', (e) => {
                    searchQuery = e.target.value;
                    renderCards();
                });
            }

            // ======= Personal Directory (Cookie Storage) =======
            function getPersonalEntries() {
                try {
                    const raw = getCookie('nawasa_personal_dir');
                    if (raw) return JSON.parse(decodeURIComponent(raw));
                } catch(e) {}
                return [];
            }

            function savePersonalEntries(entries) {
                const val = encodeURIComponent(JSON.stringify(entries));
                // Cookie expires in 365 days
                const d = new Date();
                d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
                document.cookie = `nawasa_personal_dir=${val};expires=${d.toUTCString()};path=/;SameSite=Lax`;
            }

            function getCookie(name) {
                const v = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
                return v ? v.pop() : '';
            }

            window.addPersonalEntry = function() {
                const nameInput = document.getElementById('my-name-input');
                const phoneInput = document.getElementById('my-phone-input');
                if (!nameInput || !phoneInput) return;

                const name = nameInput.value.trim();
                const phone = phoneInput.value.trim();

                if (!name || !phone) {
                    alert('الرجاء إدخال الاسم ورقم الموبايل');
                    return;
                }

                const entries = getPersonalEntries();
                entries.push({ name, phone, id: Date.now() });
                savePersonalEntries(entries);

                nameInput.value = '';
                phoneInput.value = '';
                renderPersonalEntries();
            };

            window.deletePersonalEntry = function(id) {
                let entries = getPersonalEntries();
                entries = entries.filter(e => e.id !== id);
                savePersonalEntries(entries);
                renderPersonalEntries();
            };

            function renderPersonalEntries() {
                const container = document.getElementById('personal-entries-list');
                if (!container) return;

                const entries = getPersonalEntries();

                if (entries.length === 0) {
                    container.innerHTML = '<div class="no-entries-msg">لم تضف أي أرقام بعد</div>';
                    return;
                }

                container.innerHTML = '';
                entries.forEach(entry => {
                    const div = document.createElement('div');
                    div.className = 'personal-entry';
                    div.innerHTML = `
                        <div class="pe-info">
                            <span class="pe-name"><i class="ri-user-line" style="color:#00c8ff;margin-left:5px;"></i>${entry.name}</span>
                            <span class="pe-phone">${entry.phone}</span>
                        </div>
                        <button class="pe-delete" onclick="deletePersonalEntry(${entry.id})" title="حذف">
                            <i class="ri-delete-bin-line"></i>
                        </button>
                    `;
                    container.appendChild(div);
                });
            }

            // Initialize on DOM ready
            function initPhoneDirectory() {
                buildAlphabetFilter();
                renderCards();
                initPhoneCarouselNav();
                initPhoneSearch();
                renderPersonalEntries();
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initPhoneDirectory);
            } else {
                initPhoneDirectory();
            }
        })();
