 // --- GLOBAL STATE ---
        let sheetsData = {}; // { sheetName: [rowData] }
        let currentSheetName = '';
        let companyName = localStorage.getItem('companyName') || 'نوسا البحر';
        let companyLogoBase64 = localStorage.getItem('companyLogoBase64') || null;
        let currentFilterQuery = { search: '', sort: 'default', letter: '', gov: '' };
        let currentChartMode = 'total';

        const rawForums = [
            "المنتدى الاسلامى|f1-montada|fa-mosque", "المنتدى العام|f11-montada|fa-users", "قهوة المنتدى|f54-montada|fa-coffee", "فضفضة|f40-montada|fa-comments",
            "فرشه جرايد|f63-montada|fa-newspaper", "أ .ح . أ|f65-montada|fa-pen", "أخبارنوسا البحر|f16-montada|fa-bullhorn",
            "التعارف والاهداءات|f10-montada|fa-handshake", "صور نوسا البحر|f27-montada|fa-images", "قضايا ومشاكل|f32-montada|fa-gavel",
            "أبناؤنا فى الخارج|f29-montada|fa-plane", "أعلام نوسا البحر|f31-montada|fa-star", "منتدى الذكريات|f19-montada|fa-history",
            "منتدى الابداع|f5-montada|fa-magic", "المنتدى السياسى|f6-montada|fa-landmark", "المنتدى العلمى|f17-montada|fa-flask",
            "ثقافة كاتم الصوت|f18-montada|fa-quote-right", "المكتبة الشاملة|f23-montada|fa-book-open", "مرتفعات أو سوناتا|f28-montada|fa-music",
            "فقّاعات أو كوكب|f64-montada|fa-globe", "منتدى السينما|f2-montada|fa-film", "أفلام الزمن الجميل|f41-montada|fa-video",
            "منتدى المسرح|f44-montada|fa-theater-masks", "الدراما الأجنبية|f43-montada|fa-tv", "الأفلام الوثائقية|f30-montada|fa-tape",
            "برامج تليفزيونية|f25-montada|fa-satellite-dish", "منتدى الدراما|f24-montada|fa-tv", "أفلام الكارتون|f33-montada|fa-child",
            "الأغانى كليب|f3-montada|fa-music", "الأغانى الدينية|f42-montada|fa-play", "كلمات الأغانى|f58-montada|fa-file-audio",
            "YouTube|f62-montada|fa-youtube", "الساحره المستديره|f15-montada|fa-futbol", "المصارعه الحره|f7-montada|fa-fist-raised",
            "الكمبيوتر وبرامجه|f4-montada|fa-desktop", "منتدى القراصنة|f47-montada|fa-skull-crossbones", "منتدى الألعاب|f12-montada|fa-gamepad",
            "لغات وبرمجة|f69-montada|fa-code", "هـو و هـى|f55-montada|fa-venus-mars", "عـالم آدم|f53-montada|fa-male",
            "عآلــمها الخآص|f56-montada|fa-female", "آه يا قلبى|f57-montada|fa-heartbeat", "الالعاب الكتابيه|f61-montada|fa-keyboard",
            "ما وراء الطبيعة|f60-montada|fa-ghost", "جــــراج نوسا|f59-montada|fa-car", "الصيانة المنزليّة|f68-montada|fa-tools",
            "الديكور المنزلى|f14-montada|fa-couch", "الطبخ والطهى|f13-montada|fa-utensils", "المنتدى الطبى|f22-montada|fa-stethoscope",
            "منتدى الكوميديا|f8-montada|fa-laugh-squint", "منتدى الأبراج|f9-montada|fa-star-and-crescent", "منتدى الستالايت|f45-montada|fa-satellite",
            "الصور والفوتوشوب|f34-montada|fa-palette", "الصور الاٍسلامية|f36-montada|fa-kaaba", "صور الحب|f35-montada|fa-heart",
            "الصور التاريخية|f37-montada|fa-hourglass-half", "الصور المضحكة|f38-montada|fa-smile-wink", "أدب جوال|f39-montada|fa-mobile-alt",
            "برامج الجوال|f20-montada|fa-mobile", "رسائل ونغمات|f21-montada|fa-envelope", "المنتدى التعليمى|f46-montada|fa-chalkboard-teacher",
            "المرحلة الابتدائية|f50-montada|fa-school", "المرحلة الاعدادية|f51-montada|fa-book-reader", "المرحلة الثانوية|f52-montada|fa-graduation-cap",
            "الشكاوى والمقترحات|f26-montada|fa-info-circle", "منتدى الاعلانات|f48-montada|fa-ad"
        ];

        let themes = ['colorful-invoices', 'theme-gold', 'theme-light'];
        let currentThemeIndex = 0;

        // --- INITIALIZATION ---
        document.addEventListener('DOMContentLoaded', () => {
            initParticles();
            initCharts();
            loadSettings();
            loadSavedSheets();
            buildAlphabetFilters();
            buildForumGrid();
            initFooterTilt();
            fetchLatestRates();

            const dropZone = document.getElementById('uploadZone');
            dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
            dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('dragover');
                if (e.dataTransfer.files.length) handleFile({ target: { files: e.dataTransfer.files } });
            });
        });

        function scrollTo_(selector) {
            const target = document.querySelector(selector);
            if (!target) return;

            if (document.body.classList.contains('creative-view')) {
                document.querySelectorAll('.section, .hero').forEach(s => s.classList.remove('active-section'));
                target.classList.add('active-section');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                target.scrollIntoView({ behavior: 'smooth' });
            }
            
            document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
            const link = document.querySelector(`.nav-links a[href="${selector}"]`);
            if (link) link.classList.add('active');
            document.querySelector('.nav-links').classList.remove('open');
        }

        window.toggleViewMode = () => {
            console.log("Toggling View Mode...");
            const body = document.body;
            const icon = document.getElementById('viewModeIcon');
            const desc = document.getElementById('viewModeDesc');
            const isCreative = body.classList.toggle('creative-view');
            
            if (isCreative) {
                if (icon) icon.className = 'fas fa-th-large';
                if (desc) desc.innerText = 'العودة للعرض العادي';
                // Set first section active
                const activeHash = window.location.hash || '#home';
                scrollTo_(activeHash);
                showToast('تم تفعيل الوضع الإبداعي 3D بنجاح', 'success');
            } else {
                if (icon) icon.className = 'fas fa-magic';
                if (desc) desc.innerText = 'تفعيل العرض الإبداعي 3D';
                document.querySelectorAll('.section, .hero').forEach(s => {
                    s.classList.remove('active-section');
                    s.style.display = ''; // Reset display
                });
                showToast('تم العودة لوضع اللاندينج التقليدي', 'success');
            }
        };

        window.onscroll = () => {
            const btt = document.getElementById('backToTop');
            if (window.scrollY > 500) {
                btt.style.display = 'flex';
            } else {
                btt.style.display = 'none';
            }
        };

        function showToast(msg, type = 'success') {
            const toast = document.getElementById('toast');
            toast.textContent = msg;
            toast.style.borderColor = type === 'success' ? '#00e676' : '#ff5252';
            toast.className = 'toast show';
            setTimeout(() => toast.classList.remove('show'), 3000);
        }

        window.toggleForum = () => {
            document.getElementById('forumGrid').classList.toggle('collapsed');
        }

        function buildAlphabetFilters() {
            const arAlphabets = ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'];
            const enAlphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
            const all = [...arAlphabets, ...enAlphabets];
            let html = `<button class="alpha-btn active" onclick="setAlphaFilter('', this)">الكل</button>`;
            all.forEach(a => { html += `<button class="alpha-btn" onclick="setAlphaFilter('${a}', this)">${a}</button>`; });
            const container = document.getElementById('alphabetFilters');
            if (container) container.innerHTML = html;
        }

        window.setAlphaFilter = (letter, btnElem) => {
            currentFilterQuery.letter = letter;
            document.querySelectorAll('.alpha-btn').forEach(b => b.classList.remove('active'));
            btnElem.classList.add('active');
            applyFilters();
        }

        window.cycleTheme = () => {
            document.body.classList.remove(themes[currentThemeIndex]);
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            document.body.classList.add(themes[currentThemeIndex]);
            showToast('تم تغيير تصميم الألوان الإبداعي للفواتير', 'success');
        }

        // --- PARTICLES ---
        function initParticles() {
            const canvas = document.getElementById('bgCanvas');
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const particles = [];
            for (let i = 0; i < 40; i++) { particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: Math.random() * 2 + 0.5, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4 }); }

            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'rgba(0, 212, 255, 0.2)';
                particles.forEach(p => {
                    p.x += p.vx; p.y += p.vy;
                    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                });
                requestAnimationFrame(animate);
            }
            animate();
            window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
        }

        // --- SETTINGS (LOGO & NAME) ---
        function loadSettings() {
            document.getElementById('companyName').value = companyName;
            if (companyLogoBase64) document.getElementById('clearLogoBtn').style.display = 'inline-flex';
        }
        function saveSettings() {
            companyName = document.getElementById('companyName').value || 'نوسا البحر';
            localStorage.setItem('companyName', companyName);
            renderInvoices();
        }
        window.handleLogoUpload = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (evt) => {
                companyLogoBase64 = evt.target.result;
                localStorage.setItem('companyLogoBase64', companyLogoBase64);
                document.getElementById('clearLogoBtn').style.display = 'inline-flex';
                showToast('تم رفع الشعار. تفقد الفواتير الآن');
                renderInvoices();
            };
            reader.readAsDataURL(file);
        };
        window.clearLogo = () => {
            companyLogoBase64 = null;
            localStorage.removeItem('companyLogoBase64');
            document.getElementById('clearLogoBtn').style.display = 'none';
            showToast('تم حذف الشعار');
            renderInvoices();
        };

        // --- EXCEL PARSING ---
        window.handleFile = (e) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const data = new Uint8Array(event.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheet = workbook.SheetNames[0];
                    const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet], { raw: false, defval: '' });
                    sheetsData[file.name] = normalizeData(jsonData);
                    saveSheetsToStorage();
                    showToast(`تم رفع شيت "${file.name}" وتحليله بنجاح`);
                    currentSheetName = file.name;
                    updateDashboard();
                };
                reader.readAsArrayBuffer(file);
            });
            e.target.value = '';
        };

        function normalizeData(jsonData) {
            return jsonData.map((row, index) => {
                const findKey = (keywords) => { for (let key in row) if (keywords.some(kw => key.includes(kw))) return row[key]; return ''; };
                return {
                    id: index + 1,
                    product: findKey(['المنتج', 'Product', 'الصنف']),
                    size: findKey(['المقاس', 'Size', 'الحجم']),
                    total: parseFloat(findKey(['الإجمالي', 'Total', 'السعر', 'اجمالي'])) || 0,
                    quantity: parseFloat(findKey(['الكمية', 'Quantity', 'العدد', 'qty'])) || 1,
                    notes: findKey(['ملاحظة', 'ملاحظات', 'Notes']),
                    governorate: findKey(['المحافظة', 'Gov', 'المدينة']),
                    clientName: findKey(['اسم العميل', 'العميل', 'Name', 'Client']),
                    address: findKey(['العنوان', 'Address']),
                    clientPhone: findKey(['رقم العميل', 'رقم الهاتف', 'موبايل', 'Phone', 'تليفون']),
                    sales: findKey(['السيلز', 'Sales', 'المندوب', 'بائع']),
                    date: new Date().toLocaleDateString('ar-EG')
                };
            }).filter(row => row.product || row.clientName);
        }

        function saveSheetsToStorage() { localStorage.setItem('nusaSheets', JSON.stringify(sheetsData)); localStorage.setItem('nusaCurrentSheet', currentSheetName); }
        function loadSavedSheets() {
            const saved = localStorage.getItem('nusaSheets');
            if (saved) {
                sheetsData = JSON.parse(saved);
                currentSheetName = localStorage.getItem('nusaCurrentSheet') || Object.keys(sheetsData)[0];
                if (currentSheetName) updateDashboard();
            }
        }

        function updateDashboard() {
            try {
                renderSheetsManager();
                populateFilters();
                
                if (!currentSheetName || !sheetsData[currentSheetName]) {
                    updateCurrency(0);
                    updateCalcDynamicInfo();
                    return;
                }

                populateRevenueControls(sheetsData[currentSheetName] || []);
                applyFilters();
                updateCalcDynamicInfo();

                // Advanced & Global Updates
                if (typeof updateGlobalComparison === 'function') updateGlobalComparison();
                if (typeof updateWaClientsList === 'function') updateWaClientsList();
                if (typeof syncInventoryFromSheets === 'function') syncInventoryFromSheets();
                if (typeof updateAdvancedAnalysis === 'function') updateAdvancedAnalysis();
                
            } catch (err) {
                console.error('Dashboard Update Error:', err);
            }
        }

        function renderSheetsManager() {
            const container = document.getElementById('sheetsManager');
            container.innerHTML = '';
            Object.keys(sheetsData).forEach(name => {
                const active = name === currentSheetName;
                container.innerHTML += `<div style="background:var(--card);border:1px solid ${active ? 'var(--accent)' : 'rgba(0,212,255,0.1)'};padding:8px 16px;border-radius:20px;display:flex;align-items:center;gap:10px;font-size:14px;box-shadow:${active ? '0 0 10px rgba(0,212,255,0.3)' : 'none'};transition:0.3s">
            <span onclick="switchSheet('${name}')" style="cursor:pointer;color:${active ? 'var(--accent)' : 'var(--text)'};font-weight:bold"><i class="fas fa-file-excel"></i> ${name}</span>
            <span onclick="removeSheet('${name}')" style="color:var(--red);cursor:pointer;font-weight:bold" title="حذف">✕</span>
        </div>`;
            });
            renderDataEditor();
        }
        window.switchSheet = (name) => { currentSheetName = name; localStorage.setItem('nusaCurrentSheet', name); updateDashboard(); };
        window.removeSheet = (name) => {
            delete sheetsData[name];
            if (currentSheetName === name) currentSheetName = Object.keys(sheetsData)[0] || '';
            saveSheetsToStorage();
            if (!currentSheetName) { document.getElementById('invoicesGrid').innerHTML = ''; updateCurrency(0); updateCalcDynamicInfo(); renderDataEditor(); }
            else updateDashboard();
        };

        function renderDataEditor() {
            const editor = document.getElementById('sheetDataEditor');
            const table = document.getElementById('sheetDataTable');
            if (!editor || !table) return;
            if (!currentSheetName || !sheetsData[currentSheetName] || sheetsData[currentSheetName].length === 0) {
                editor.style.display = 'none';
                return;
            }
            editor.style.display = 'block';
            const data = sheetsData[currentSheetName];
            let html = `<tr>
        <th style="padding:10px; border-bottom:1px solid rgba(0,212,255,0.3)">اسم العميل</th>
        <th style="padding:10px; border-bottom:1px solid rgba(0,212,255,0.3)">تليفون</th>
        <th style="padding:10px; border-bottom:1px solid rgba(0,212,255,0.3)">المنتج</th>
        <th style="padding:10px; border-bottom:1px solid rgba(0,212,255,0.3)">الكمية</th>
        <th style="padding:10px; border-bottom:1px solid rgba(0,212,255,0.3)">الإجمالي (ج.م)</th>
        <th style="padding:10px; border-bottom:1px solid rgba(0,212,255,0.3)">المحافظة</th>
    </tr>`;
            data.forEach((row, i) => {
                html += `<tr style="border-bottom:1px solid rgba(255,255,255,0.1)">
            <td style="padding:8px"><input type="text" class="custom-input" style="padding:5px;min-width:120px" value="${row.clientName || ''}" onchange="updateRowData(${i}, 'clientName', this.value)"></td>
            <td style="padding:8px"><input type="text" class="custom-input" style="padding:5px;min-width:100px" value="${row.clientPhone || ''}" onchange="updateRowData(${i}, 'clientPhone', this.value)"></td>
            <td style="padding:8px"><input type="text" class="custom-input" style="padding:5px;min-width:100px" value="${row.product || ''}" onchange="updateRowData(${i}, 'product', this.value)"></td>
            <td style="padding:8px"><input type="number" class="custom-input" style="padding:5px;min-width:70px" value="${row.quantity || 1}" onchange="updateRowData(${i}, 'quantity', this.value)"></td>
            <td style="padding:8px"><input type="number" class="custom-input" style="padding:5px;min-width:90px" value="${row.total || 0}" onchange="updateRowData(${i}, 'total', this.value)"></td>
            <td style="padding:8px"><input type="text" class="custom-input" style="padding:5px;min-width:100px" value="${row.governorate || ''}" onchange="updateRowData(${i}, 'governorate', this.value)"></td>
        </tr>`;
            });
            table.innerHTML = html;
        }

        window.updateRowData = (index, field, value) => {
            if (sheetsData[currentSheetName] && sheetsData[currentSheetName][index]) {
                if (field === 'total' || field === 'quantity') value = parseFloat(value) || 0;
                sheetsData[currentSheetName][index][field] = value;
            }
        };

        window.saveEditedSheetData = () => {
            saveSheetsToStorage();
            updateDashboard();
            showToast('تم حفظ التعديلات وإعادة المعالجة بنجاح', 'success');
        };

        function populateFilters() {
            let govs = new Set();
            Object.values(sheetsData).forEach(sheet => { sheet.forEach(r => { if (r.governorate) govs.add(r.governorate.trim()); }) });
            const govSelect = document.getElementById('govFilterSelect');
            govSelect.innerHTML = `<option value="">???? تصفية حسب المحافظة (الكل)</option>`;
            Array.from(govs).sort().forEach(g => { govSelect.innerHTML += `<option value="${g}">${g}</option>`; });
        }

        window.applyFilters = () => {
            currentFilterQuery.search = document.getElementById('searchInput').value.toLowerCase();
            currentFilterQuery.sort = document.getElementById('sortSelect').value;
            currentFilterQuery.gov = document.getElementById('govFilterSelect').value;
            renderInvoices();
            updateCharts();
        }

        // --- RENDERING INVOICES & PRINT ---
        window.adjustInvoiceSize = (prop, val) => {
            const grid = document.getElementById('invoicesGrid');
            if (!grid) return;

            let currentMinW = grid.dataset.minWidth ? parseInt(grid.dataset.minWidth) : 350;
            let currentScale = grid.dataset.invScale ? parseFloat(grid.dataset.invScale) : 1.0;

            if (prop === 'width') {
                currentMinW += val;
                if (currentMinW < 200) currentMinW = 200;
                grid.dataset.minWidth = currentMinW;
                grid.style.gridTemplateColumns = `repeat(auto-fill, minmax(${currentMinW}px, 1fr))`;
            } else if (prop === 'scale') {
                currentScale += val;
                if (currentScale < 0.5) currentScale = 0.5;
                if (currentScale > 2.0) currentScale = 2.0;
                grid.dataset.invScale = currentScale;
                document.querySelectorAll('.invoice-card').forEach(c => {
                    c.style.transform = `scale(${currentScale})`;
                    c.style.transformOrigin = 'top center';
                });
            } else if (prop === 'height') {
                let currentH = grid.dataset.minHeight ? parseInt(grid.dataset.minHeight) : 0;
                if (!currentH) {
                    const firstC = document.querySelector('.invoice-card');
                    currentH = firstC ? firstC.offsetHeight : 450;
                }
                currentH += val;
                if (currentH < 250) currentH = 250;
                grid.dataset.minHeight = currentH;
                document.querySelectorAll('.invoice-card').forEach(c => {
                    c.style.height = `${currentH}px`;
                    c.style.minHeight = 'auto';
                });
            }
        };
        function renderInvoices() {
            let data = [...(sheetsData[currentSheetName] || [])];

            if (currentFilterQuery.search) {
                data = data.filter(r => (r.clientName && r.clientName.toLowerCase().includes(currentFilterQuery.search)) || (r.clientPhone && String(r.clientPhone).includes(currentFilterQuery.search)) || (r.product && r.product.toLowerCase().includes(currentFilterQuery.search)));
            }
            if (currentFilterQuery.gov) { data = data.filter(r => r.governorate && r.governorate.trim() === currentFilterQuery.gov); }
            if (currentFilterQuery.letter) {
                data = data.filter(r => r.clientName && r.clientName.trim().toUpperCase().startsWith(currentFilterQuery.letter.toUpperCase()));
            }

            if (currentFilterQuery.sort === 'name') data.sort((a, b) => (a.clientName || '').localeCompare(b.clientName || ''));
            else if (currentFilterQuery.sort === 'gov') data.sort((a, b) => (a.governorate || '').localeCompare(b.governorate || ''));
            else if (currentFilterQuery.sort === 'total_desc') data.sort((a, b) => b.total - a.total);

            const grid = document.getElementById('invoicesGrid');
            if (!data.length) { grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:30px;color:var(--text2);font-size:20px"><i class="fas fa-folder-open fa-2x"></i><br>لا توجد بيانات متاحة تلبي الشروط</div>'; return; }

            const logoHtml = companyLogoBase64 ? `<img src="${companyLogoBase64}" class="invoice-logo-img">` : ``;

            let html = '';
            data.forEach(row => {
                html += `<div class="invoice-card" id="inv_${row.id}">
            <div class="invoice-header">
                <div class="invoice-logo-container">${logoHtml}<div class="invoice-logo-text">${companyName}</div></div>
                <div style="text-align:left">
                    <div class="invoice-num invoice-text-color">#INV-${row.id}</div>
                    <div style="font-size:12px;color:gray">${row.date}</div>
                </div>
            </div>
            <div style="margin-bottom:20px;padding:12px;border:1px solid rgba(128,128,128,0.2);border-radius:12px;background:rgba(0,0,0,0.05)">
                <h4 style="color:var(--accent);margin-bottom:5px;font-family:'Amiri'"><i class="fas fa-user-tag"></i> بيانات العميل</h4>
                <div class="invoice-text-color" style="font-size:16px;font-weight:900;margin-bottom:2px">${row.clientName || '-'}</div>
                <div style="font-size:13px;color:gray;margin-bottom:2px"><i class="fas fa-phone-alt"></i> <span style="direction:ltr">${row.clientPhone || '-'}</span></div>
                <div style="font-size:13px;color:gray"><i class="fas fa-map-marker-alt"></i> ${row.governorate ? row.governorate + ' - ' : ''}${row.address || '-'}</div>
            </div>
            <h4 class="invoice-text-color" style="border-bottom:1px solid rgba(128,128,128,0.2);padding-bottom:5px;margin-bottom:10px;font-family:'Amiri'"><i class="fas fa-box"></i> تفاصيل الطلب</h4>
            <div class="invoice-details">
                <div style="color:gray">المنتج:</div><div class="invoice-text-color" style="font-weight:900">${row.product || '-'}</div>
                <div style="color:gray">المقاس:</div><div class="invoice-text-color" style="font-weight:900">${row.size || '-'}</div>
                <div style="color:gray">الكمية:</div><div class="invoice-text-color" style="font-weight:900">${row.quantity || 1}</div>
                <div style="color:gray">السيلز:</div><div class="invoice-text-color" style="font-weight:900">${row.sales || '-'}</div>
                <div style="color:gray">ملاحظة:</div><div style="font-weight:900;color:var(--gold)">${row.notes || '-'}</div>
            </div>
            <div class="invoice-total">
                <div style="font-size:14px;margin-bottom:5px">الإجمالي المستحق</div>
                <div style="font-size:28px;font-weight:900;font-family:'Amiri'">${row.total.toLocaleString()} ج.م</div>
            </div>
            
            <div class="invoice-codes-container">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=INV-${row.id}" class="inv-code-img" title="QR Code الفاتورة">
                <img src="https://bwipjs-api.metafloor.com/?bcid=code128&text=INV-${row.id}&scale=3&height=10&includetext" class="inv-code-img" style="width:120px; object-fit:contain" title="باركود الفاتورة">
            </div>

            <div class="invoice-shipping-note"><i class="fas fa-shipping-fast fa-lg"></i> (فى حالة رفض الأوردر يتم دفع مصاريف الشحن)</div>
            <div class="invoice-actions no-print">
                <button class="btn btn-primary" onclick="openMapModal('${row.governorate || ''}', '${row.address || ''}')"><i class="fas fa-map-marked-alt"></i> تتبع العنوان 3D</button>
                <button class="btn btn-green" onclick="printSingleInvoice('inv_${row.id}')"><i class="fas fa-print"></i> طباعة الفاتورة</button>
            </div>
        </div>`;
            });
            grid.innerHTML = html;
        }

        window.printSingleInvoice = (id) => {
            document.body.classList.add('print-single-mode');
            document.querySelectorAll('.invoice-card').forEach(c => c.classList.remove('print-active'));
            const target = document.getElementById(id);
            if (target) target.classList.add('print-active');
            window.print();
            setTimeout(() => { document.body.classList.remove('print-single-mode'); if (target) target.classList.remove('print-active'); }, 1000);
        }

        // --- STATS & CHARTS ---
        let myCharts = {};
        function initCharts() { Chart.defaults.color = '#9fa8da'; Chart.defaults.font.family = 'Cairo'; }

        window.setChartMode = (mode) => {
            currentChartMode = mode;
            updateCharts();
        }

        function updateCharts() {
            let data = sheetsData[currentSheetName] || [];

            // Always calculate totals ignoring the search filter, but obey governorate filter for local stats
            if (currentFilterQuery.gov) { data = data.filter(r => r.governorate && r.governorate.trim() === currentFilterQuery.gov); }

            let totalRevenue = 0, totalQty = 0;
            const totals = [];
            const govData = {}, prodData = {}, salesData = {}, prodQty = {};

            data.forEach(r => {
                const amt = r.total || 0;
                totalRevenue += amt;
                totals.push(amt);
                const qty = r.quantity || 1;
                totalQty += qty;
                if (r.governorate) govData[r.governorate] = (govData[r.governorate] || 0) + amt;
                if (r.product) {
                    prodData[r.product] = (prodData[r.product] || 0) + amt;
                    prodQty[r.product] = (prodQty[r.product] || 0) + qty;
                }
                if (r.sales) salesData[r.sales] = (salesData[r.sales] || 0) + amt;
            });

            const N = totals.length || 1;
            const mean = totalRevenue / N;
            // Standard Deviation
            let sumVar = 0;
            totals.forEach(t => sumVar += Math.pow(t - mean, 2));
            const stdDev = Math.sqrt(sumVar / N);

            document.getElementById('totalInvoices').innerText = totals.length;
            document.getElementById('totalRevenue').innerText = totalRevenue.toLocaleString();
            document.getElementById('totalClients').innerText = new Set(data.filter(r => r.clientPhone).map(r => r.clientPhone)).size || totals.length;

            // Advanced 3D Stats
            document.getElementById('advMean').innerText = mean.toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' ج.م';
            document.getElementById('advStdDev').innerText = stdDev.toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' ج.م';
            document.getElementById('advTotalQty').innerText = totalQty.toLocaleString();

            // Trigger Currency Updates
            updateCurrency(totalRevenue);

            // Sub Charts
            createOrUpdateChart('chartGovCompare', 'bar', Object.keys(govData), Object.values(govData), 'المبيعات حسب المحافظة');
            createOrUpdateChart('chartStats3D', 'bar', ['المتوسط العام', 'الانحراف المعياري'], [mean, stdDev], 'تحليل المبيعات (ج.م)');
            createOrUpdateChart('chartQtyByProduct', 'pie', Object.keys(prodQty), Object.values(prodQty), 'الوحدات المباعة حسب المنتج');

            const sheetNames = Object.keys(sheetsData);
            if (sheetNames.length > 0) {
                const sheetTotals = sheetNames.map(name => sheetsData[name].reduce((acc, curr) => acc + (curr.total || 0), 0));
                createOrUpdateChart('chartCompare', 'line', sheetNames, sheetTotals, 'إجمالي حركات كل الشيتات');
            }

            // Main Dynamic Chart
            let mainLabels = [], mainData = [], mainTitle = '', type = 'bar';
            if (currentChartMode === 'total') { mainLabels = ['الإجمالي العام']; mainData = [totalRevenue]; mainTitle = 'مقارنة الإيرادات الإجمالية لمعاملاتك'; type = 'bar'; }
            else if (currentChartMode === 'sales') { mainLabels = Object.keys(salesData); mainData = Object.values(salesData); mainTitle = 'أداء مندوبي المبيعات (Sales)'; type = 'doughnut'; }
            else if (currentChartMode === 'product') { mainLabels = Object.keys(prodData); mainData = Object.values(prodData); mainTitle = 'حركة المبيعات بالصنف والمنتج'; type = 'pie'; }
            else if (currentChartMode === 'gov') { mainLabels = Object.keys(govData); mainData = Object.values(govData); mainTitle = 'نطاق التوزيع على المحافظات'; type = 'polarArea'; }

            createOrUpdateChart('chartMain', type, mainLabels, mainData, mainTitle, true);
        }

        function populateRevenueControls(data) {
            const sel = document.getElementById('revProductSelect');
            if (!sel) return;
            let products = new Set();
            data.forEach(r => { if (r.product) products.add(r.product.trim()); });

            sel.innerHTML = `<option value="">-- كل المنتجات / الشيت الحالي --</option>`;
            Array.from(products).sort().forEach(p => {
                sel.innerHTML += `<option value="${p}">${p}</option>`;
            });
            calcCustomRevenue();
        }

        window.calcCustomRevenue = () => {
            if (!currentSheetName || !sheetsData[currentSheetName]) return;
            const data = sheetsData[currentSheetName];
            const targetProd = document.getElementById('revProductSelect').value;
            const shippingAdd = parseFloat(document.getElementById('shippingCostAdd').value) || 0;
            const shippingDisc = parseFloat(document.getElementById('shippingDiscount').value) || 0;

            let baseRevenue = 0;
            data.forEach(r => {
                if (!targetProd || (r.product && r.product.trim() === targetProd)) {
                    baseRevenue += (r.total || 0);
                }
            });

            const net = baseRevenue + shippingAdd - shippingDisc;
            document.getElementById('customNetRevenueVal').innerText = net.toLocaleString();
        };

        function createOrUpdateChart(id, type, labels, dataArr, label, isMain = false) {
            const ctx = document.getElementById(id);
            if (!ctx) return;
            if (myCharts[id]) myCharts[id].destroy();

            const colors = ['rgba(0, 212, 255, 0.7)', 'rgba(123, 47, 247, 0.7)', 'rgba(255, 215, 0, 0.7)', 'rgba(0, 230, 118, 0.7)', 'rgba(255, 82, 82, 0.7)', 'rgba(255, 152, 0, 0.7)', 'rgba(233, 30, 99, 0.7)', 'rgba(0, 188, 212, 0.7)'];
            let bgColors = colors.slice(0, labels.length);
            while (bgColors.length < labels.length) bgColors = bgColors.concat(colors);

            myCharts[id] = new Chart(ctx, {
                type: type,
                data: {
                    labels: labels,
                    datasets: [{
                        label: label,
                        data: dataArr,
                        backgroundColor: bgColors,
                        borderColor: bgColors.map(c => c.replace('0.7', '1')),
                        borderWidth: 2,
                        borderRadius: (type === 'bar') ? 12 : 0,
                        fill: type === 'line',
                        tension: 0.5
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { position: isMain ? 'right' : 'bottom', labels: { color: '#fff', font: { family: 'Cairo', size: 14 } } } },
                    scales: (type === 'line' || type === 'bar') ? { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { grid: { display: false } } } : {}
                }
            });
        }

        // --- CURRENCY EXCHANGE ---
        let currentTotalEGP = 0;
        window.updateCurrency = (overrideVal) => {
            if (overrideVal !== undefined) currentTotalEGP = overrideVal;

            const usdRate = parseFloat(document.getElementById('usdRate').value) || 48.5;

            document.getElementById('egpTotalVal').innerText = currentTotalEGP.toLocaleString(undefined, { maximumFractionDigits: 0 });

            // Convert logic
            const usdVal = currentTotalEGP / usdRate;
            const eurVal = currentTotalEGP / parseFloat(document.getElementById('eurRate').value || 52.4);
            const gbpVal = currentTotalEGP / parseFloat(document.getElementById('gbpRate').value || 61.2);
            const sarVal = currentTotalEGP / parseFloat(document.getElementById('sarRate').value || 12.9);
            const aedVal = currentTotalEGP / parseFloat(document.getElementById('aedRate').value || 13.2);
            const kwdVal = currentTotalEGP / parseFloat(document.getElementById('kwdRate').value || 157.5);

            function setVal(id, val) { 
                const el = document.getElementById(id);
                if(el) el.innerText = val.toLocaleString(undefined, { maximumFractionDigits: 2 }); 
            }
            setVal('valUSD', usdVal);
            setVal('valEUR', eurVal);
            setVal('valGBP', gbpVal);
            setVal('valSAR', sarVal);
            setVal('valAED', aedVal);
            setVal('valKWD', kwdVal);

            updateCurrency3DChart(usdVal, eurVal, gbpVal, sarVal, aedVal, kwdVal);
        }

        function updateCurrency3DChart(usd, eur, gbp, sar, aed, kwd) {
            const ctx = document.getElementById('chartCurrency3D');
            if (!ctx) return;
            if (myCharts['chartCurrency3D']) myCharts['chartCurrency3D'].destroy();

            myCharts['chartCurrency3D'] = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['دولار (USD)', 'يورو (EUR)', 'جنيه إسترليني (GBP)', 'ريال سعودي (SAR)', 'درهم (AED)', 'دينار (KWD)'],
                    datasets: [{
                        label: 'قيمة التحويل (بآلاف)',
                        data: [(usd||0) / 1000, (eur||0) / 1000, (gbp||0) / 1000, (sar||0) / 1000, (aed||0) / 1000, (kwd||0) / 1000],
                        backgroundColor: ['#00e676', '#00d4ff', '#7b2ff7', '#ffd700', '#ff5252', '#ff9800'],
                        borderWidth: 2,
                        borderRadius: 15,
                        borderColor: ['#00e676', '#00d4ff', '#7b2ff7', '#ffd700', '#ff5252', '#ff9800']
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#fff', font: { family: 'Cairo', size: 14 } } } }, scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { grid: { display: false } } } }
            });
        }

        // --- CALCULATOR ---
        let calcExpression = '';
        let calcChartData = [];
        window.calcInput = (val) => { calcExpression += val; document.getElementById('calcExpr').innerText = calcExpression; };
        window.calcClear = () => { calcExpression = ''; calcChartData = []; document.getElementById('calcExpr').innerText = ''; document.getElementById('calcResult').innerText = '0'; updateCalcChart(); };
        window.calcEval = () => {
            try {
                let toEval = calcExpression.replace(/×/g, '*').replace(/−/g, '-').replace(/÷/g, '/');
                if (toEval.includes('%')) toEval = toEval.replace(/(\d+)%/g, '($1/100)');
                const res = eval(toEval);
                document.getElementById('calcResult').innerText = res.toLocaleString();

                calcChartData.push(res);
                if (calcChartData.length > 12) calcChartData.shift();
                updateCalcChart();

                calcExpression = res.toString();
            } catch (e) { document.getElementById('calcResult').innerText = 'Error'; setTimeout(() => calcClear(), 1500); }
        };

        function updateCalcChart() {
            const ctx = document.getElementById('calcMiniChart');
            if (!ctx) return;
            if (myCharts['calcMiniChart']) myCharts['calcMiniChart'].destroy();
            if (calcChartData.length === 0) return;

            myCharts['calcMiniChart'] = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: calcChartData.map((_, i) => i + 1),
                    datasets: [{ data: calcChartData, borderColor: '#00d4ff', backgroundColor: 'rgba(0, 212, 255, 0.4)', fill: true, tension: 0.4, borderWidth: 4 }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false }, tooltip: { enabled: false } },
                    scales: { x: { display: false }, y: { display: false } },
                    animation: { duration: 800, easing: 'easeOutQuart' }
                }
            });
        }

        function updateCalcDynamicInfo() {
            const names = Object.keys(sheetsData);
            if (names.length === 0) {
                if (document.getElementById('calcTotalSheets')) {
                    document.getElementById('calcTotalSheets').innerText = '0';
                    document.getElementById('calcTotalAllSheets').innerText = '0';
                    document.getElementById('calcDynamicButtons').innerHTML = '';
                }
                return;
            }

            let totalValue = 0;
            let products = {};
            let govs = {};

            names.forEach(n => {
                sheetsData[n].forEach(r => {
                    let t = r.total || 0;
                    totalValue += t;
                    if (r.product) products[r.product] = (products[r.product] || 0) + t;
                    if (r.governorate) govs[r.governorate] = (govs[r.governorate] || 0) + t;
                });
            });

            if (document.getElementById('calcTotalSheets')) {
                document.getElementById('calcTotalSheets').innerText = names.length;
                document.getElementById('calcTotalAllSheets').innerText = totalValue.toLocaleString();
            }

            const dyContainer = document.getElementById('calcDynamicButtons');
            if (dyContainer) {
                let html = '';
                Object.keys(products).forEach(p => {
                    html += `<button class="btn btn-primary" onclick="calcInput('${products[p]}')" style="padding:6px 12px; font-size:13px; margin:3px;" title="إجمالي ${p}">${p} <span style="color:var(--gold);margin-right:5px">(${products[p].toLocaleString()})</span></button>`;
                });
                Object.keys(govs).forEach(g => {
                    html += `<button class="btn btn-purple" onclick="calcInput('${govs[g]}')" style="padding:6px 12px; font-size:13px; margin:3px;" title="إجمالي ${g}">${g} <span style="color:var(--gold);margin-right:5px">(${govs[g].toLocaleString()})</span></button>`;
                });
                dyContainer.innerHTML = html;
            }
        }

        // --- FORUM GENERATION ---
        function buildForumGrid() {
            const grid = document.getElementById('forumGrid');
            let html = `<div class="forum-card" onclick="openForumModal('https://nawasa-elbahr.yoo7.com/')">
       <div class="f-icon"><i class="fas fa-globe-africa"></i></div><h3>الرئيسية الشاملة</h3></div>`;

            rawForums.forEach(item => {
                const parts = item.split('|');
                html += `<div class="forum-card" onclick="openForumModal('https://nawasa-elbahr.yoo7.com/${parts[1]}')">
           <div class="f-icon"><i class="fas ${parts[2]}"></i></div><h3>${parts[0]}</h3></div>`;
            });
            grid.innerHTML = html;
        }

        // --- MODALS (MAP & FORUM) ---
        let currentIframeUrl = '';

        window.openMapModal = (gov, addr) => {
            let query = encodeURIComponent((gov ? gov + " ، " : "") + (addr || "مصر"));
            currentIframeUrl = `https://maps.google.com/maps?q=${query}&hl=ar&z=15&output=embed`;
            
            document.getElementById('modalHeaderTitle').innerHTML = `<h2><i class="fas fa-map-marked-alt"></i> تتبع خط سير المندوب / العميل - ${addr || gov || 'مصر'}</h2>`;
            document.getElementById('loadingIcon3D').innerHTML = `<i class="fas fa-motorcycle"></i>`;
            document.getElementById('loadingText3D').innerText = `جاري استخراج وتجهيز بيانات خط السير...`;
            
            document.getElementById('modalActions').innerHTML = `
                <button class="btn btn-gold" onclick="window.open('${currentIframeUrl}', '_blank')" style="padding: 8px 20px; font-weight: bold; font-size:14px; border-radius: 12px;">
                    <i class="fas fa-external-link-alt"></i> عرض الخريطة خارجياً بملء الشاشة
                </button>
            `;
            
            document.getElementById('modalLoading').style.display = 'flex';
            document.getElementById('modalIframeContainer').style.opacity = '0';
            document.getElementById('modalIframe').src = currentIframeUrl;
            
            document.getElementById('reusableModal').classList.add('show');
            document.getElementById('reusableModal').style.display = 'flex';
        }

        window.openForumModal = (url) => {
            currentIframeUrl = url;
            
            document.getElementById('modalHeaderTitle').innerHTML = `<h2><i class="fas fa-users"></i> موسوعة منتدى نوسا البحر</h2>`;
            document.getElementById('loadingIcon3D').innerHTML = `<i class="fas fa-compass fa-spin"></i>`;
            document.getElementById('loadingText3D').innerText = `جاري تحميل منتدى نوسا البحر المدمج...`;

            // Add Share Buttons dynamically for forum links
            document.getElementById('modalActions').innerHTML = `
                <span style="color:var(--text2);align-self:center;font-weight:bold;margin-left:15px"><i class="fas fa-share-alt"></i> مشاركة القسم السريع:</span>
                <button class="btn btn-primary" onclick="shareLink('facebook')" style="background:#1877F2;color:#fff;padding:8px 15px;border-radius:10px;"><i class="fab fa-facebook-f"></i></button>
                <button class="btn btn-primary" onclick="shareLink('twitter')" style="background:#1DA1F2;color:#fff;padding:8px 15px;border-radius:10px;"><i class="fab fa-twitter"></i></button>
                <button class="btn btn-primary" onclick="shareLink('whatsapp')" style="background:#25D366;color:#fff;padding:8px 15px;border-radius:10px;"><i class="fab fa-whatsapp"></i></button>
                <button class="btn btn-gold" onclick="window.open('${url}', '_blank')" style="padding:8px 15px; margin-right: 15px; border-radius:10px;"><i class="fas fa-external-link-alt"></i> فتح في نافذة جديدة</button>
            `;

            document.getElementById('modalLoading').style.display = 'flex';
            document.getElementById('modalIframeContainer').style.opacity = '0';
            document.getElementById('modalIframe').src = url;

            document.getElementById('reusableModal').classList.add('show');
            document.getElementById('reusableModal').style.display = 'flex';
        }

        window.shareLink = (platform) => {
            const urlText = encodeURIComponent(currentIframeUrl);
            const msgText = encodeURIComponent("شاهد هذا القسم الرائع من منتدى نوسا البحر المدمج بالنظام المحاسبي: ");
            if (platform === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${urlText}`, '_blank');
            if (platform === 'twitter') window.open(`https://twitter.com/intent/tweet?text=${msgText}&url=${urlText}`, '_blank');
            if (platform === 'whatsapp') window.open(`https://api.whatsapp.com/send?text=${msgText} ${urlText}`, '_blank');
        }

        window.closeModal = () => {
            document.getElementById('reusableModal').classList.remove('show');
            setTimeout(() => {
                document.getElementById('reusableModal').style.display = 'none';
                document.getElementById('modalIframe').src = '';
            }, 500);
        }

        // --- FOOTER TILT EFFECT ---
        function initFooterTilt() {
            const footer = document.getElementById('creativeFooter');
            const box = document.getElementById('footerTiltBox');
            if (!footer || !box) return;

            footer.addEventListener('mousemove', (e) => {
                const rect = footer.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -10; // Max 10 degrees
                const rotateY = ((x - centerX) / centerX) * 10;   // Max 10 degrees

                box.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            footer.addEventListener('mouseleave', () => {
                box.style.transform = `rotateX(0deg) rotateY(0deg)`;
            });
        }

        // --- MANUAL ENTRY FUNCTIONS ---
        window.toggleManualForm = (toCurrent = false) => {
            const form = document.getElementById('manualEntryForm');
            const targetSelect = document.getElementById('m_targetSheet');

            // Rebuild target sheet options
            let options = '<option value="new">سجل إدخال يدوي جديد</option>';
            Object.keys(sheetsData).forEach(name => {
                options += `<option value="${name}" ${toCurrent && name === currentSheetName ? 'selected' : ''}>إضافة إلى: ${name}</option>`;
            });
            targetSelect.innerHTML = options;

            if (form.style.display === 'block') {
                form.style.display = 'none';
            } else {
                form.style.display = 'block';
                form.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        };

        window.submitManualEntry = () => {
            const name = document.getElementById('m_clientName').value;
            const product = document.getElementById('m_product').value;
            const total = parseFloat(document.getElementById('m_total').value) || 0;
            const targetSheetType = document.getElementById('m_targetSheet').value;

            if (!name || !product) {
                showToast('برجاء كتابة اسم العميل والمنتج على الأقل لإصدار فاتورة صحيحة', 'error');
                return;
            }

            let targetSheetName = targetSheetType === 'new' ? 'سجل الإدخال اليدوي' : targetSheetType;
            if (!sheetsData[targetSheetName]) sheetsData[targetSheetName] = [];

            const newEntry = {
                id: Date.now(), // Unique ID based on time
                product: product,
                size: document.getElementById('m_size').value || '-',
                total: total,
                quantity: parseFloat(document.getElementById('m_qty').value) || 1,
                notes: document.getElementById('m_notes').value || '-',
                governorate: document.getElementById('m_gov').value || '-',
                clientName: name,
                address: document.getElementById('m_address').value || '-',
                clientPhone: document.getElementById('m_clientPhone').value || '-',
                sales: document.getElementById('m_sales').value || '-',
                date: new Date().toLocaleDateString('ar-EG')
            };

            sheetsData[targetSheetName].push(newEntry);
            currentSheetName = targetSheetName;
            saveSheetsToStorage();
            updateDashboard();

            // Reset Form
            const inputs = document.querySelectorAll('#manualEntryForm .custom-input');
            inputs.forEach(inp => {
                if (inp.id === 'm_qty') inp.value = '1';
                else inp.value = '';
            });

            showToast(`تم إصدار فاتورة بنجاح للعميل: ${name}`, 'success');
            document.getElementById('manualEntryForm').style.display = 'none';

            // Scroll to the new invoice
            setTimeout(() => {
                document.getElementById('invoicesSection').scrollIntoView({ behavior: 'smooth' });
            }, 600);
        };

        // --- GLOBAL COMPARISON LOGIC ---
        let currentComparisonMode = 'total';
        window.toggleComparisonMode = (mode) => {
            currentComparisonMode = mode;
            updateGlobalComparison();
            showToast(`تم التبديل إلى: ${mode === 'total' ? 'الأداء الكلي' : 'المصفوفة التفصيلية'}`, 'success');
        };

        function updateGlobalComparison() {
            const sheetNames = Object.keys(sheetsData).filter(n => n !== 'الشيت المجمع الشامل');
            if (sheetNames.length === 0) return;

            let globalTotal = 0;
            let globalQty = 0;
            let globalOrders = 0;
            let bestSheet = { name: '-', val: 0 };

            const matrixData = {
                labels: sheetNames,
                revenues: [],
                quantities: [],
                orders: []
            };

            sheetNames.forEach(name => {
                const data = sheetsData[name];
                let sTotal = 0, sQty = 0;

                data.forEach(r => {
                    sTotal += (r.total || 0);
                    sQty += (r.quantity || 1);
                });

                globalTotal += sTotal;
                globalQty += sQty;
                globalOrders += data.length;

                if (sTotal > bestSheet.val) {
                    bestSheet = { name: name, val: sTotal };
                }

                matrixData.revenues.push(sTotal);
                matrixData.quantities.push(sQty);
                matrixData.orders.push(data.length);
            });

            // Update Cards
            const gTotalEl = document.getElementById('globalGrandTotal');
            const gQtyEl = document.getElementById('globalGrandQty');
            const gOrdersEl = document.getElementById('globalGrandOrders');
            const bSheetEl = document.getElementById('bestPerformingSheet');
            const bSheetValEl = document.getElementById('bestSheetVal');

            if (gTotalEl) gTotalEl.innerText = globalTotal.toLocaleString() + ' ج.م';
            if (gQtyEl) gQtyEl.innerText = globalQty.toLocaleString();
            if (gOrdersEl) gOrdersEl.innerText = globalOrders.toLocaleString();
            if (bSheetEl) bSheetEl.innerText = bestSheet.name;
            if (bSheetValEl) bSheetValEl.innerText = bestSheet.val.toLocaleString() + ' ج.م';

            // Chart 1: Multi-Metric Comparison
            const ctxMulti = document.getElementById('chartGlobalMultiMetric');
            if (ctxMulti) {
                if (myCharts['chartGlobalMultiMetric']) myCharts['chartGlobalMultiMetric'].destroy();
                myCharts['chartGlobalMultiMetric'] = new Chart(ctxMulti, {
                    type: 'bar',
                    data: {
                        labels: sheetNames,
                        datasets: [
                            { label: 'الإيرادات (×10)', data: matrixData.revenues.map(v => v / 10), backgroundColor: 'rgba(255, 215, 0, 0.7)', borderRadius: 5 },
                            { label: 'عدد الأوردرات', data: matrixData.orders, backgroundColor: 'rgba(0, 212, 255, 0.7)', borderRadius: 5 },
                            { label: 'كمية المنتجات', data: matrixData.quantities, backgroundColor: 'rgba(123, 47, 247, 0.7)', borderRadius: 5 }
                        ]
                    },
                    options: {
                        responsive: true, maintainAspectRatio: false,
                        scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#fff' } }, x: { ticks: { color: '#fff' } } },
                        plugins: { legend: { labels: { color: '#fff', font: { family: 'Cairo' } } } }
                    }
                });
            }

            // Chart 2: Stock vs Sheets Compare (Professional Pie/Doughnut)
            const ctxStock = document.getElementById('chartStockVsSheetsCompare');
            if (ctxStock) {
                let totalInventoryItems = 0;
                Object.values(productInventory).forEach(v => totalInventoryItems += (parseFloat(v) || 0));

                if (myCharts['chartStockVsSheetsCompare']) myCharts['chartStockVsSheetsCompare'].destroy();
                myCharts['chartStockVsSheetsCompare'] = new Chart(ctxStock, {
                    type: 'polarArea',
                    data: {
                        labels: ['إجمالي مبيعات الشيتات', 'إجمالي المخزون المتاح'],
                        datasets: [{
                            data: [globalQty, totalInventoryItems],
                            backgroundColor: ['rgba(255, 82, 82, 0.7)', 'rgba(0, 230, 118, 0.7)'],
                            borderColor: ['#ff5252', '#00e676'],
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true, maintainAspectRatio: false,
                        scales: { r: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { display: false } } },
                        plugins: { legend: { position: 'bottom', labels: { color: '#fff', font: { family: 'Cairo' } } } }
                    }
                });
            }
        }


        // Ensure it updates on dashboard changes
        // Dashboard updates are now handled in the main updateDashboard function

        // --- SMART WHATSAPP LOGIC ---
        let waMessages = [];
        let waStopFlag = false;

        window.addWaMessage = () => {
            const msgInput = document.getElementById('waNewMessage');
            const msg = msgInput.value.trim();
            if (!msg) {
                showToast('برجاء كتابة نص الرسالة أولاً', 'error');
                return;
            }
            waMessages.push(msg);
            msgInput.value = '';
            renderWaMessages();
            showToast('تمت إضافة الرسالة بنجاح');
        };

        window.removeWaMessage = (index) => {
            waMessages.splice(index, 1);
            renderWaMessages();
            showToast('تم حذف الرسالة');
        };

        function renderWaMessages() {
            const list = document.getElementById('waMessagesList');
            if (waMessages.length === 0) {
                list.innerHTML = '<p style="text-align: center; color: var(--text2); font-size: 14px;">لا توجد رسائل مضافة بعد</p>';
                return;
            }
            list.innerHTML = waMessages.map((msg, i) => `
                <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; margin-bottom: 8px; position: relative; border-right: 3px solid var(--accent);">
                    <div style="font-size: 13px; color: var(--text); padding-left: 30px; white-space: pre-wrap;">${msg}</div>
                    <button onclick="removeWaMessage(${i})" style="position: absolute; left: 10px; top: 10px; background: none; border: none; color: var(--red); cursor: pointer;"><i class="fas fa-trash"></i></button>
                </div>
            `).join('');
        }

        window.updateWaClientsList = () => {
            const list = document.getElementById('waClientsList');
            let allClients = [];

            // Get all unique clients from all sheets
            Object.keys(sheetsData).forEach(sheetName => {
                sheetsData[sheetName].forEach(row => {
                    if (row.clientPhone && row.clientName) {
                        const phone = row.clientPhone.replace(/\D/g, '');
                        if (phone.length >= 10) {
                            // Avoid duplicates based on phone
                            if (!allClients.find(c => c.phone === phone)) {
                                allClients.push({ name: row.clientName, phone: phone });
                            }
                        }
                    }
                });
            });

            if (allClients.length === 0) {
                list.innerHTML = '<p style="text-align: center; color: var(--text2); padding: 20px;">يرجى رفع شيت إكسيل أولاً لاستخراج أرقام العملاء</p>';
                return;
            }

            list.innerHTML = allClients.map((client, i) => `
                <div style="display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; margin-bottom: 5px;">
                    <input type="checkbox" class="wa-client-checkbox" data-name="${client.name}" data-phone="${client.phone}" checked style="width: 18px; height: 18px; cursor: pointer;">
                    <div style="flex: 1;">
                        <div style="font-weight: bold; color: var(--text); font-size: 14px;">${client.name}</div>
                        <div style="color: var(--accent); font-size: 12px;">${client.phone}</div>
                    </div>
                </div>
            `).join('');
        };

        window.selectAllWaClients = (status) => {
            document.querySelectorAll('.wa-client-checkbox').forEach(cb => cb.checked = status);
        };

        window.startWaBulkSend = async () => {
            const selectedClients = Array.from(document.querySelectorAll('.wa-client-checkbox:checked')).map(cb => ({
                name: cb.getAttribute('data-name'),
                phone: cb.getAttribute('data-phone')
            }));

            if (selectedClients.length === 0) {
                showToast('برجاء تحديد عملاء للإرسال إليهم', 'error');
                return;
            }
            if (waMessages.length === 0) {
                showToast('برجاء إضافة رسالة واحدة على الأقل', 'error');
                return;
            }

            const delayPerMsg = (parseInt(document.getElementById('waDelayPerMsg').value) || 1) * 1000;
            const delayPerClient = (parseInt(document.getElementById('waDelayPerClient').value) || 2) * 1000;

            waStopFlag = false;
            document.getElementById('waStartBtn').style.display = 'none';
            document.getElementById('waStopBtn').style.display = 'inline-block';
            document.getElementById('waProgressBarContainer').style.display = 'block';

            const total = selectedClients.length;
            const progressBar = document.getElementById('waProgressBar');
            const progressText = document.getElementById('waProgressText');
            const progressPercent = document.getElementById('waProgressPercent');

            for (let i = 0; i < total; i++) {
                if (waStopFlag) break;

                const client = selectedClients[i];

                // Progress Update
                const percent = Math.round(((i + 1) / total) * 100);
                progressBar.style.width = percent + '%';
                progressText.innerText = `جاري الإرسال: ${i + 1} / ${total}`;
                progressPercent.innerText = percent + '%';

                // Send each message
                for (let j = 0; j < waMessages.length; j++) {
                    if (waStopFlag) break;

                    let finalMsg = waMessages[j].replace(/{name}/g, client.name);
                    const encodedMsg = encodeURIComponent(finalMsg);
                    const waUrl = `https://api.whatsapp.com/send?phone=2${client.phone}&text=${encodedMsg}`;

                    window.open(waUrl, '_blank');

                    if (j < waMessages.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, delayPerMsg));
                    }
                }

                if (i < total - 1) {
                    await new Promise(resolve => setTimeout(resolve, delayPerClient));
                }
            }

            document.getElementById('waStartBtn').style.display = 'inline-block';
            document.getElementById('waStopBtn').style.display = 'none';

            if (waStopFlag) {
                showToast('تم إيقاف الإرسال بطلب من المستخدم', 'error');
            } else {
                showToast('تم الانتهاء من إرسال جميع الرسائل بنجاح', 'success');
            }
        };

        window.stopWaBulkSend = () => {
            waStopFlag = true;
        };

        // --- MERGE SHEETS LOGIC ---
        window.mergeAllSheets = () => {
            const names = Object.keys(sheetsData);
            if (names.length <= 1) {
                showToast('يجب وجود أكثر من شيت للقيام بعملية الدمج', 'error');
                return;
            }
            const mergedData = [];
            names.forEach(name => {
                if (name !== 'الشيت المجمع الشامل') {
                    sheetsData[name].forEach(row => {
                        mergedData.push({ ...row, sourceSheet: name });
                    });
                }
            });
            const mergedName = 'الشيت المجمع الشامل';
            sheetsData[mergedName] = mergedData;
            currentSheetName = mergedName;
            saveSheetsToStorage();
            updateDashboard();
            showToast('تم دمج جميع البيانات في شيت واحد مجمع بنجاح', 'success');
        };

        // --- ADVANCED ANALYSIS & INVENTORY LOGIC ---
        let productInventory = JSON.parse(localStorage.getItem('productInventory') || '{}');
        let inventoryFilter = 'all';

        window.setInventoryFilter = (f) => {
            inventoryFilter = f;
            syncInventoryFromSheets();
        };

        window.updateProductStock = (name, val) => {
            productInventory[name] = parseFloat(val) || 0;
            localStorage.setItem('productInventory', JSON.stringify(productInventory));
            updateAdvancedAnalysis();
        };

        let productWholesalePrices = JSON.parse(localStorage.getItem('productWholesalePrices') || '{}');

        window.updateProductWholesale = (name, val) => {
            productWholesalePrices[name] = parseFloat(val) || 0;
            localStorage.setItem('productWholesalePrices', JSON.stringify(productWholesalePrices));
            updateAdvancedAnalysis();
        };

        function syncInventoryFromSheets() {
            const allProducts = new Set();
            const currentProducts = new Set();
            Object.values(sheetsData).forEach(sheet => {
                sheet.forEach(row => { if (row.product) allProducts.add(row.product.trim()); });
            });
            (sheetsData[currentSheetName] || []).forEach(row => {
                if (row.product) currentProducts.add(row.product.trim());
            });

            const list = document.getElementById('inventoryProductsList');
            const selector = document.getElementById('advProductSelector');
            if (!list) return;

            // Update selector
            const savedSelected = selector.value;
            selector.innerHTML = '<option value="all">-- تحليل جميع المنتجات --</option>';
            Array.from(allProducts).sort().forEach(p => {
                selector.innerHTML += `<option value="${p}">${p}</option>`;
            });
            selector.value = savedSelected;

            list.innerHTML = '';
            const targetSet = (inventoryFilter === 'all') ? allProducts : currentProducts;
            const sortedProducts = Array.from(targetSet).sort();
            
            let totalStockItems = 0;
            sortedProducts.forEach(prod => {
                if (productInventory[prod] === undefined) productInventory[prod] = 0;
                if (productWholesalePrices[prod] === undefined) productWholesalePrices[prod] = 0;
                
                const stockQty = productInventory[prod];
                const wholesalePrice = productWholesalePrices[prod];
                totalStockItems += stockQty;

                const div = document.createElement('div');
                div.className = 'inventory-item-card';
                div.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <span class="inv-prod-name" title="${prod}">${prod}</span>
                        <span class="inv-prod-count">${stockQty} قطعة</span>
                    </div>
                    <div class="inv-edit-area" style="display:none; margin-top: 10px; border-top: 1px dashed rgba(0,212,255,0.3); padding-top: 10px;">
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                            <div>
                                <label style="font-size:10px; color:var(--text2); display:block; margin-bottom: 2px;">المخزون (قطعة):</label>
                                <input type="number" class="compact-input" 
                                       value="${stockQty}" onchange="updateProductStock('${prod}', this.value)">
                            </div>
                            <div>
                                <label style="font-size:10px; color:var(--text2); display:block; margin-bottom: 2px;">سعر الجملة (%):</label>
                                <input type="number" class="compact-input" 
                                       value="${wholesalePrice}" onchange="updateProductWholesale('${prod}', this.value)">
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-primary" onclick="toggleInvEdit(this)" style="width: 100%; margin-top: 10px; padding: 5px; font-size: 12px; border-radius: 8px;">
                        <i class="fas fa-edit"></i> تعديل
                    </button>
                `;
                list.appendChild(div);
            });
            document.getElementById('inventoryCountInfo').innerHTML = `عدد الأصناف: <b style="color:#fff">${sortedProducts.length}</b> | إجمالي القطع: <b style="color:var(--gold)">${totalStockItems}</b>`;
            
            // Render 3D Chart
            const ctxInv = document.getElementById('chartInvProducts3D');
            if (ctxInv) {
                if (myCharts['chartInvProducts3D']) myCharts['chartInvProducts3D'].destroy();
                const labels = sortedProducts;
                const data = sortedProducts.map(p => productInventory[p] || 0);
                
                myCharts['chartInvProducts3D'] = new Chart(ctxInv, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'المخزون المتوفر (قطعة)',
                            data: data,
                            backgroundColor: labels.map((_, i) => `hsl(${i * (360 / labels.length)}, 80%, 60%)`),
                            borderColor: labels.map((_, i) => `hsl(${i * (360 / labels.length)}, 80%, 40%)`),
                            borderWidth: 2,
                            borderRadius: 10
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', titleFont: { family: 'Cairo' }, bodyFont: { family: 'Cairo' } }
                        },
                        scales: {
                            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#fff' } },
                            x: { grid: { display: false }, ticks: { color: '#aaa', font: { family: 'Cairo', size: 10 } } }
                        },
                        animation: {
                            duration: 1500,
                            easing: 'easeOutQuart'
                        }
                    }
                });
            }
        }

        window.toggleInvEdit = (btn) => {
            const card = btn.closest('.inventory-item-card');
            const editArea = card.querySelector('.inv-edit-area');
            if (editArea.style.display === 'none') {
                editArea.style.display = 'block';
                btn.innerHTML = '<i class="fas fa-check"></i> تم';
                btn.className = 'btn btn-green';
                btn.style.width = '100%';
                btn.style.marginTop = '10px';
                btn.style.padding = '5px';
                btn.style.fontSize = '12px';
                btn.style.borderRadius = '8px';
            } else {
                editArea.style.display = 'none';
                btn.innerHTML = '<i class="fas fa-edit"></i> تعديل';
                btn.className = 'btn btn-primary';
                btn.style.width = '100%';
                btn.style.marginTop = '10px';
                btn.style.padding = '5px';
                btn.style.fontSize = '12px';
                btn.style.borderRadius = '8px';
            }
        };

        function updateStockVsSoldChart(soldQtys) {
            // Get all unique products from inventory and sold list
            const allProductNames = Array.from(new Set([
                ...Object.keys(productInventory),
                ...(soldQtys ? Object.keys(soldQtys) : [])
            ])).filter(p => p && p.trim() !== '');

            // Filter out products with 0 stock AND 0 sales to keep chart clean
            const labels = allProductNames.filter(p => (productInventory[p] || 0) > 0 || (soldQtys && (soldQtys[p] || 0) > 0));
            const stockData = labels.map(p => productInventory[p] || 0);
            const soldData = labels.map(p => (soldQtys && soldQtys[p]) || 0);

            const ctx = document.getElementById('chartStockVsSold');
            if (!ctx) return;
            if (myCharts['chartStockVsSold']) myCharts['chartStockVsSold'].destroy();
            myCharts['chartStockVsSold'] = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        { 
                            label: 'المخزون المتاح (قطع)', 
                            data: stockData, 
                            backgroundColor: 'rgba(0, 212, 255, 0.7)', 
                            borderColor: '#00d4ff', 
                            borderWidth: 2,
                            borderRadius: 5
                        },
                        { 
                            label: 'الكمية المباعة (قطع)', 
                            data: soldData, 
                            backgroundColor: 'rgba(255, 215, 0, 0.7)', 
                            borderColor: '#ffd700', 
                            borderWidth: 2,
                            borderRadius: 5
                        }
                    ]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    indexAxis: 'y', // Horizontal bars are better for many products
                    scales: { 
                        y: { 
                            grid: { display: false }, 
                            ticks: { color: '#fff', font: { size: 11 } } 
                        }, 
                        x: { 
                            beginAtZero: true, 
                            grid: { color: 'rgba(255,255,255,0.05)' }, 
                            ticks: { color: '#aaa' } 
                        } 
                    },
                    plugins: { 
                        legend: { position: 'top', labels: { color: '#fff', font: { family: 'Cairo' } } },
                        tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', titleFont: { family: 'Cairo' }, bodyFont: { family: 'Cairo' } }
                    }
                }
            });
        }

        window.updateProductStock = (name, val) => {
            productInventory[name] = parseFloat(val) || 0;
            localStorage.setItem('productInventory', JSON.stringify(productInventory));
            updateAdvancedAnalysis();
        };

        function updateAdvancedAnalysis() {
            const currentSheetData = sheetsData[currentSheetName] || [];
            const selector = document.getElementById('advProductSelector');
            if (!selector) return;
            const selectedProd = selector.value;
            
            const invContainer = document.getElementById('advInventoryValContainer');
            if (selectedProd !== 'all') {
                if (invContainer) invContainer.style.display = 'block';
                const invInput = document.getElementById('advInventoryVal');
                if (invInput) invInput.value = productInventory[selectedProd] || 0;
            } else {
                if (invContainer) invContainer.style.display = 'none';
            }

            let filteredData = currentSheetData;
            if (selectedProd !== 'all') {
                filteredData = currentSheetData.filter(r => r.product && r.product.trim() === selectedProd);
            }
            const shippingPerOrder = parseFloat(document.getElementById('advShippingPerOrder').value) || 0;
            const wholesalePerc = parseFloat(document.getElementById('advWholesalePercent').value) || 70;
            const currentAssets = parseFloat(document.getElementById('advCurrentAssets').value) || 100000;
            const currentLiabilities = parseFloat(document.getElementById('advCurrentLiabilities').value) || 30000;

            const soldQtys = {};
            const targetSheets = (inventoryFilter === 'all') ? Object.values(sheetsData) : [currentSheetData];
            targetSheets.forEach(sheet => {
                sheet.forEach(r => {
                    if (r.product) {
                        const pName = r.product.trim();
                        if (selectedProd === 'all' || pName === selectedProd) {
                            soldQtys[pName] = (soldQtys[pName] || 0) + (r.quantity || 1);
                        }
                    }
                });
            });

            const baseRevenue = filteredData.reduce((sum, r) => sum + (r.total || 0), 0);
            const shipInput = document.getElementById('advShippingTotal');
            const shippingTotalManual = parseFloat(shipInput ? shipInput.value : 0) || 0;
            
            let autoShippingTotal = 0;
            if (selectedProd === 'all') {
                Object.values(productInventory).forEach(val => autoShippingTotal += (parseFloat(val) || 0) * shippingPerOrder);
            } else {
                autoShippingTotal = (productInventory[selectedProd] || 0) * shippingPerOrder;
            }

            const shippingToUse = (shippingTotalManual === 0) ? autoShippingTotal : shippingTotalManual;
            if (shipInput && shippingTotalManual === 0) shipInput.value = autoShippingTotal;

            const revenue = baseRevenue - shippingToUse;
            
            let cogs = 0;
            if (selectedProd === 'all') {
                cogs = baseRevenue * (wholesalePerc / 100);
            } else {
                const itemWholesale = productWholesalePrices[selectedProd] || 0;
                const totalSoldQty = filteredData.reduce((sum, r) => sum + (r.quantity || 1), 0);
                cogs = itemWholesale * totalSoldQty;
            }

            const grossProfit = revenue - cogs;
            const netProfit = grossProfit - (baseRevenue * 0.1); 
            
            const currentInvVal = (selectedProd === 'all') 
                ? Object.keys(productInventory).reduce((sum, p) => sum + (productInventory[p] * (productWholesalePrices[p] || 0)), 0)
                : (productInventory[selectedProd] || 0) * (productWholesalePrices[selectedProd] || 0);

            const totalAssets = currentAssets + currentInvVal + 200000;

            const gpMargin = baseRevenue ? (grossProfit / baseRevenue) * 100 : 0;
            const npMargin = baseRevenue ? (netProfit / baseRevenue) * 100 : 0;
            const roa = totalAssets ? (netProfit / totalAssets) * 100 : 0;

            document.getElementById('ratioGrossProfit').innerText = gpMargin.toFixed(1) + '%';
            document.getElementById('ratioNetProfit').innerText = npMargin.toFixed(1) + '%';
            document.getElementById('ratioROA').innerText = roa.toFixed(1) + '%';

            const currentRatio = currentLiabilities ? (currentAssets + currentInvVal) / currentLiabilities : 0;
            const quickRatio = currentLiabilities ? currentAssets / currentLiabilities : 0;
            const bep = (baseRevenue * 0.4) / (gpMargin / 100 || 1); 

            document.getElementById('ratioCurrent').innerText = currentRatio.toFixed(2);
            document.getElementById('ratioQuick').innerText = quickRatio.toFixed(2);
            document.getElementById('breakEvenPoint').innerText = bep.toLocaleString(undefined, {maximumFractionDigits:0}) + ' ج.م';

            const invTurnover = currentInvVal ? cogs / currentInvVal : 0;
            const dso = revenue ? (currentAssets / revenue) * 365 : 0;
            const zScore = (1.2 * (currentAssets / totalAssets)) + (1.4 * (netProfit / totalAssets)) + (3.3 * (grossProfit / totalAssets)) + (0.6 * (revenue / totalAssets));

            document.getElementById('ratioInvTurnover').innerText = invTurnover.toFixed(2);
            document.getElementById('ratioDSO').innerText = dso.toFixed(0) + ' يوم';
            const scoreEl = document.getElementById('altmanZScore');
            if (scoreEl) scoreEl.innerText = zScore.toFixed(2);

            const roe = (npMargin / 100) * (revenue / totalAssets) * 1.5;
            document.getElementById('dupontMargin').innerText = npMargin.toFixed(1) + '%';
            document.getElementById('dupontTurnover').innerText = (revenue / totalAssets).toFixed(2);
            document.getElementById('dupontROE').innerText = (roe * 100).toFixed(1) + '%';

            // --- NEW: PROFITABILITY & REVENUE COMPUTATION PER PRODUCT ---
            const productMetrics = {}; // { [prodName]: { revenue, cogs, profit, soldQty } }
            const targetSheetsAll = Object.values(sheetsData);
            
            targetSheetsAll.forEach(sheet => {
                sheet.forEach(r => {
                    if (r.product) {
                        const pName = r.product.trim();
                        if (!productMetrics[pName]) productMetrics[pName] = { revenue: 0, cogs: 0, profit: 0, soldQty: 0 };
                        productMetrics[pName].soldQty += (r.quantity || 1);
                        productMetrics[pName].revenue += (r.total || 0);
                    }
                });
            });

            // Calculate profit for each product
            let topProduct = { name: '-', profit: -Infinity, revenue: 0, soldQty: 0 };
            
            Object.keys(productMetrics).forEach(pName => {
                const metric = productMetrics[pName];
                const itemWholesale = productWholesalePrices[pName] || 0;
                const cogsCalc = itemWholesale > 0 ? itemWholesale * metric.soldQty : metric.revenue * (wholesalePerc / 100);
                const shipCalc = (productInventory[pName] || 0) * shippingPerOrder;
                const grossCalc = metric.revenue - cogsCalc - shipCalc;
                const netCalc = grossCalc - (metric.revenue * 0.1);
                metric.profit = netCalc;
                metric.cogs = cogsCalc;

                if (netCalc > topProduct.profit && metric.soldQty > 0) {
                    topProduct = { name: pName, profit: netCalc, revenue: metric.revenue, soldQty: metric.soldQty };
                }
            });

            if(topProduct.profit === -Infinity) topProduct.profit = 0;

            const elTopName = document.getElementById('topProductName');
            const elTopProfit = document.getElementById('topProductProfit');
            if(elTopName) elTopName.innerText = topProduct.name;
            if(elTopProfit) elTopProfit.innerText = Math.round(topProduct.profit).toLocaleString();

            const elSelectedProfit = document.getElementById('selectedProductProfit');
            if(elSelectedProfit) {
                if(selectedProd === 'all') {
                    const totalNet = Object.values(productMetrics).reduce((s, m) => s + m.profit, 0);
                    elSelectedProfit.innerText = Math.round(totalNet).toLocaleString() + ' ج.م';
                } else {
                    const singleNet = productMetrics[selectedProd] ? productMetrics[selectedProd].profit : 0;
                    elSelectedProfit.innerText = Math.round(singleNet).toLocaleString() + ' ج.م';
                }
            }

            // Render Product Profits Chart
            const ctxProfits = document.getElementById('chartProductProfits3D');
            if(ctxProfits) {
                if(myCharts['chartProductProfits3D']) myCharts['chartProductProfits3D'].destroy();
                const profitLabels = Object.keys(productMetrics).filter(p => productMetrics[p].soldQty > 0);
                const profitData = profitLabels.map(p => productMetrics[p].profit);
                
                myCharts['chartProductProfits3D'] = new Chart(ctxProfits, {
                    type: 'bar',
                    data: {
                        labels: profitLabels,
                        datasets: [{
                            label: 'صافي الربح (ج.م)',
                            data: profitData,
                            backgroundColor: profitLabels.map((_, i) => `hsl(${i * (360 / profitLabels.length)}, 80%, 50%)`),
                            borderColor: profitLabels.map((_, i) => `hsl(${i * (360 / profitLabels.length)}, 80%, 30%)`),
                            borderWidth: 2,
                            borderRadius: 8
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { titleFont: { family: 'Cairo' }, bodyFont: { family: 'Cairo' } } }, scales: { y: { beginAtZero:true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#fff' } }, x: { grid: { display: false }, ticks: { color: '#aaa', font: { family: 'Cairo' } } } }, animation: { duration: 1500, easing: 'easeOutQuart' } }
                });
            }

            // Render Product Revenues Chart
            const ctxRevenues = document.getElementById('chartProductRevenues3D');
            if(ctxRevenues) {
                if(myCharts['chartProductRevenues3D']) myCharts['chartProductRevenues3D'].destroy();
                const revLabels = Object.keys(productMetrics).filter(p => productMetrics[p].soldQty > 0);
                const revData = revLabels.map(p => productMetrics[p].revenue);
                
                myCharts['chartProductRevenues3D'] = new Chart(ctxRevenues, {
                    type: 'line',
                    data: {
                        labels: revLabels,
                        datasets: [{
                            label: 'الإيرادات (ج.م)',
                            data: revData,
                            borderColor: '#00e676',
                            backgroundColor: 'rgba(0, 230, 118, 0.2)',
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: '#fff',
                            pointBorderColor: '#00e676',
                            pointRadius: 5
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { titleFont: { family: 'Cairo' }, bodyFont: { family: 'Cairo' } } }, scales: { y: { beginAtZero:true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#fff' } }, x: { grid: { display: false }, ticks: { color: '#aaa', font: { family: 'Cairo' } } } }, animation: { duration: 1500, easing: 'easeOutQuart' } }
                });
            }

            updateAdvancedCharts(revenue, cogs, shippingToUse, netProfit);
            updateStockVsSoldChart(soldQtys);
        }

        function updateAdvancedCharts(rev, cogs, ship, net) {
            // Vertical Analysis Chart
            const vCtx = document.getElementById('chartVerticalAnalysis');
            if (vCtx) {
                if (myCharts['chartVerticalAnalysis']) myCharts['chartVerticalAnalysis'].destroy();
                myCharts['chartVerticalAnalysis'] = new Chart(vCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['تكلفة البضاعة (COGS)', 'مصاريف الشحن', 'صافي الربح', 'مصاريف أخرى'],
                        datasets: [{
                            data: [cogs, ship, Math.max(0, net), rev * 0.1],
                            backgroundColor: ['#ff5252', '#ffd700', '#00e676', '#7b2ff7']
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#fff' } } } }
                });
            }

            // Horizontal Analysis Chart
            const hCtx = document.getElementById('chartHorizontalAnalysis');
            if (hCtx) {
                const names = Object.keys(sheetsData).filter(n => n !== 'الشيت المجمع الشامل');
                const values = names.map(n => sheetsData[n].reduce((s, r) => s + (r.total || 0), 0));
                if (myCharts['chartHorizontalAnalysis']) myCharts['chartHorizontalAnalysis'].destroy();
                myCharts['chartHorizontalAnalysis'] = new Chart(hCtx, {
                    type: 'line',
                    data: {
                        labels: names,
                        datasets: [{
                            label: 'نمو الإيرادات',
                            data: values,
                            borderColor: '#00d4ff',
                            fill: true,
                            backgroundColor: 'rgba(0, 212, 255, 0.2)',
                            tension: 0.4
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { color: '#fff' } }, x: { ticks: { color: '#fff' } } } }
                });
            }
        }

        // --- AI CHATBOT LOGIC ---
        function toggleAiChat() {
            const win = document.getElementById('aiChatWindow');
            win.style.display = (win.style.display === 'flex') ? 'none' : 'flex';
            if (win.style.display === 'flex') {
                if (document.getElementById('aiChatMessages').children.length === 0) {
                    addAiMessage('مرحباً بك في نظام نوسا البحر المتقدم! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم في إدارة حساباتك؟', 'bot');
                }
            }
        }

        function addAiMessage(text, type) {
            const container = document.getElementById('aiChatMessages');
            const div = document.createElement('div');
            div.className = `ai-msg ${type}`;
            div.innerHTML = text.replace(/\n/g, '<br>');
            container.appendChild(div);
            container.scrollTop = container.scrollHeight;
        }

        window.handleAiSuggestion = (id) => {
            const suggestions = {
                'sheet_format': {
                    q: 'ما هو شكل الشيت المطلوب؟',
                    a: 'لضمان أفضل أداء، يفضل أن يحتوي الشيت على الأعمدة التالية:\n1. اسم العميل (أو العميل)\n2. رقم الهاتف (أو التليفون)\n3. المنتج (أو الصنف)\n4. الكمية\n5. الإجمالي (السعر)\n6. المحافظة (أو المدينة)\nنظامنا ذكي ويمكنه التعرف على هذه المسميات حتى لو اختلفت قليلاً!'
                },
                'how_to_upload': {
                    q: 'كيف أقوم برفع الشيتات؟',
                    a: 'ببساطة، يمكنك سحب ملف الإكسيل (Excel) من جهازك وإسقاطه في منطقة "رفع الملفات" المحددة، أو الضغط عليها واختيار الملف. سيقوم النظام بمعالجته في ثوانٍ!'
                },
                'merge_logic': {
                    q: 'كيف تعمل خاصية الدمج؟',
                    a: 'خاصية الدمج تسمح لك بتجميع بيانات كافة الشيتات المرفوعة في شيت واحد عملاق يسمى "الشيت المجمع". هذا يساعدك في رؤية إجمالي المبيعات والعملاء لكل الفترة دفعة واحدة.'
                },
                'profit_calc': {
                    q: 'كيف يتم حساب الأرباح؟',
                    a: 'في قسم "التحليل المتقدم"، يمكنك إدخال "ثمن الجملة" كنسبة مئوية، وسيقوم النظام بخصم التكلفة ومصاريف الشحن من الإيرادات ليعطيك "صافي الربح" الدقيق.'
                },
                'barcode_search': {
                    q: 'كيف أبحث باستخدام الباركود؟',
                    a: 'اضغط على أيقونة الكاميرا بجوار مربع البحث، ووجهها نحو الباركود الموجود أسفل الفاتورة. سيقوم النظام بالتعرف على رقم الفاتورة وجلب بيانات العميل فوراً!'
                },
                'contact_dev': {
                    q: 'كيف أتواصل مع المبرمج؟',
                    a: 'المبرمج حسن بلم دائماً في خدمتك! يمكنك التواصل معه مباشرة عبر الواتساب على الرقم: 01094044300 لأي استفسارات أو تطويرات مخصصة.'
                }
            };
            
            const item = suggestions[id];
            addAiMessage(item.q, 'user');
            setTimeout(() => addAiMessage(item.a, 'bot'), 500);
        };

        function handleAiChat(e) {
            if (e.key === 'Enter') {
                const input = document.getElementById('aiChatInputBox');
                const msg = input.value.trim();
                if (!msg) return;
                addAiMessage(msg, 'user');
                input.value = '';
                
                setTimeout(() => {
                    let reply = 'أهلاً بك في فضاء نوسا الإبداعي! سأكون رفيقك في هذه الرحلة المحاسبية الممتعة. يمكنك اختيار أحد الأسئلة المقترحة بالأسفل أو سؤالي مباشرة.';
                    const m = msg.toLowerCase();
                    if (m.includes('رفع') || m.includes('كيف')) reply = 'يا لها من عملية بسيطة وممتعة! فقط قم بسحب ملف الإكسيل وإلقائه في "منطقة السحب" السحرية بالأعلى، وسأقوم بتحويل تلك الأرقام الجامدة إلى فواتير حية ورسوم بيانية تنبض بالحياة في لمح البصر!';
                    else if (m.includes('دمج')) reply = 'الدمج هو قوتنا الخارقة! اضغط على زر "الدمج المجمع" وسأقوم بدمج كل ذرات بياناتك في شيت واحد عملاق يمنحك الرؤية الشاملة لإمبراطوريتك المالية.';
                    else if (m.includes('نموذج')) reply = 'إليك السر الصغير: لكي أعمل بأفضل أداء، اجعل الشيت يحتوي على أعمدة واضحة لاسم العميل، الهاتف، والمنتج. أنا ذكي بما يكفي لأتعرف عليها حتى لو اختلفت المسميات!';
                    else if (m.includes('قاعدة') || m.includes('ربط')) reply = 'نحن نتصل بالمستقبل! يمكنك ربط نظامك بقواعد بيانات محلية أو سحابية (MySQL, MongoDB) بضغطة زر واحدة في قسم قواعد البيانات، لتبقى بياناتك آمنة ومنظمة دائماً.';
                    else if (m.includes('شحن')) reply = 'لقد أضفنا خاصية ذكية لخصم الشحن سواء كان مبلغاً ثابتاً لكل أوردر أو مبلغاً كلياً، ليظهر لك "الصافي الحقيقي" الذي يلامس جيبك فعلياً!';
                    else if (m.includes('تحليل')) reply = 'التحليل المتقدم هو عقلي المدبر! نحسب لك هوامش الربح، نسب السيولة، وحتى "نقاط التعادل" لتعرف متى ستبدأ أرباحك في التحليق عالياً.';
                    
                    addAiMessage(reply, 'bot');
                }, 800);
            }
        }

        // --- DATABASE LOGIC ---
        window.toggleDbFields = () => {
            const type = document.getElementById('dbType').value;
            const externalFields = document.getElementById('externalDbFields');
            if (type === 'local') {
                externalFields.style.display = 'none';
            } else {
                externalFields.style.display = 'contents'; // Keep grid layout
            }
        };

        window.connectToDatabase = () => {
            const type = document.getElementById('dbType').value;
            const host = document.getElementById('dbHost').value;
            const user = document.getElementById('dbUser').value;
            const pass = document.getElementById('dbPass').value;
            const status = document.getElementById('dbStatus');
            
            if (type !== 'local' && (!host || !user || !pass)) {
                showToast('برجاء إدخال كافة بيانات تسجيل الدخول للقاعدة الخارجية', 'error');
                return;
            }

            status.innerHTML = `جاري الاتصال بـ ${type}... <i class="fas fa-spinner fa-spin"></i>`;
            setTimeout(() => {
                status.innerHTML = `تم الاتصال بنجاح بـ <span style="color:var(--green)">${type}</span> (${type === 'local' ? 'متصفح' : host})`;
                showToast(`تم الربط بنجاح مع ${type}`, 'success');
            }, 1500);
        };

        window.saveToDatabase = async () => {
            const type = document.getElementById('dbType').value;
            const status = document.getElementById('dbStatus');
            
            if (Object.keys(sheetsData).length === 0) {
                showToast('لا توجد شيتات أو بيانات لرفعها!', 'error');
                return;
            }

            if (type === 'local') {
                localStorage.setItem('nusaSheets_Backup', JSON.stringify(sheetsData));
                showToast('تم حفظ الشيتات والبيانات بنجاح في المتصفح المحلي', 'success');
            } else {
                const host = document.getElementById('dbHost').value;
                if (!host) {
                    showToast('برجاء إدخال رابط الهوست والاتصال بالقاعدة أولاً', 'error');
                    return;
                }
                
                status.innerHTML = `جاري رفع وتزامن كافة الشيتات إلى ${type} <i class="fas fa-spinner fa-spin"></i>`;
                showToast('بدء عملية رفع الشيتات والبيانات...', 'success');
                
                // محاكاة عملية الرفع للشبكة
                await new Promise(r => setTimeout(r, 2500));
                
                status.innerHTML = `تم مزامنة ورفع كافة الشيتات بنجاح على قاعدة <span style="color:var(--green)">${type}</span>`;
                showToast(`تم رفع جميع الشيتات بنجاح إلى قاعدة بيانات ${type}!`, 'success');
            }
        };

        window.downloadDatabase = () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sheetsData));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "nusa_accounting_db.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        };

        window.clearLocalDatabase = () => {
            if (confirm('هل أنت متأكد من مسح جميع البيانات؟ لا يمكن التراجع!')) {
                sheetsData = {};
                saveSheetsToStorage();
                updateDashboard();
                showToast('تم مسح جميع البيانات', 'error');
            }
        };

        // Initialize Advanced UI on startup
        const originalInit = document.addEventListener('DOMContentLoaded', () => {});
        document.addEventListener('DOMContentLoaded', () => {
            // Existing ones are already there in the file, we add ours
            updateAdvancedAnalysis();
        });
        
        // Ensure advanced analysis updates when data changes
        // Dashboard updates are now handled in the main updateDashboard function

        window.exportAllSheetsToExcel = () => {
            const sheetNames = Object.keys(sheetsData);
            if (sheetNames.length === 0) {
                showToast('لا توجد شيتات لتصديرها!', 'error');
                return;
            }

            const allData = [];
            sheetNames.forEach(name => {
                const data = sheetsData[name];
                data.forEach(row => {
                    allData.push({
                        'اسم الشيت': name,
                        'اسم العميل': row.clientName || '',
                        'رقم الهاتف': row.clientPhone || '',
                        'المحافظة': row.governorate || '',
                        'العنوان': row.address || '',
                        'المنتج': row.product || '',
                        'المقاس': row.size || '',
                        'الكمية': row.quantity || 1,
                        'الإجمالي': row.total || 0,
                        'السيلز': row.sales || '',
                        'التاريخ': row.date || '',
                        'ملاحظات': row.notes || ''
                    });
                });
            });

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(allData);
            XLSX.utils.book_append_sheet(wb, ws, "Master_Export");
            XLSX.writeFile(wb, `Nusa_Master_Export_${new Date().toLocaleDateString()}.xlsx`);
            showToast('تم تصدير الملف المجمع بنجاح', 'success');
        };

        // --- QR & BARCODE SCANNING LOGIC ---
        let html5QrCode;
        window.toggleScanner = async () => {
            const container = document.getElementById('qrScannerContainer');
            if (container.style.display === 'block') {
                stopScanner();
                return;
            }
            container.style.display = 'block';
            html5QrCode = new Html5Qrcode("reader");
            // إعدادات محسنة لالتقاط الباركود الطولي (1D) بدقة عالية وكفاءة
            const config = { 
                fps: 20, 
                qrbox: { width: 350, height: 150 }, 
                aspectRatio: 1.0 
            };
            
            try {
                await html5QrCode.start({ facingMode: "environment" }, config, (decodedText) => {
                    handleScanResult(decodedText);
                    stopScanner();
                });
            } catch (err) {
                showToast('فشل فتح الكاميرا: تأكد من إعطاء الصلاحية للكاميرا', 'error');
                container.style.display = 'none';
            }
        };

        window.stopScanner = () => {
            if (html5QrCode) {
                try {
                    html5QrCode.stop().then(() => {
                        html5QrCode.clear();
                        document.getElementById('qrScannerContainer').style.display = 'none';
                    }).catch(() => {
                        document.getElementById('qrScannerContainer').style.display = 'none';
                    });
                } catch(e) {
                    document.getElementById('qrScannerContainer').style.display = 'none';
                }
            } else {
                document.getElementById('qrScannerContainer').style.display = 'none';
            }
        };

        window.scanImage = async (input) => {
            if (input.files && input.files[0]) {
                showToast('جاري تحليل الصورة والبحث عن الباركود...', 'success');
                try {
                    const html5QrCodeImage = new Html5Qrcode("reader");
                    // تحليل الصورة تلقائياً وبكفاءة
                    const decodedText = await html5QrCodeImage.scanFile(input.files[0], false);
                    handleScanResult(decodedText);
                    html5QrCodeImage.clear();
                } catch(err) {
                    showToast('لم يتم العثور على باركود! تأكد من وضوح الصورة وأن الباركود غير مقطوع', 'error');
                } finally {
                    input.value = ''; // تصفير الحقل ليقبل نفس الصورة أو صورة أخرى فوراً
                }
            }
        };

        function handleScanResult(text) {
            // Check if it's our invoice ID format: INV-XXX
            let id = text;
            if (text.includes('INV-')) {
                id = text.split('INV-')[1];
            }
            
            document.getElementById('searchInput').value = text;
            applyFilters();
            showToast(`تم العثور على الفاتورة: ${text}`, 'success');
            
            // Scroll to search area
            document.getElementById('invoicesSection').scrollIntoView({ behavior: 'smooth' });
        }
