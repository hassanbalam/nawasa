 (function () {
            var libraryBooks = [
                { title: "تحميل كتاب سفاسف الأمور لبلال فضل", link: "https://nawasa-elbahr.yoo7.com/t11357-topic", icon: "fa-book", color: "linear-gradient(135deg,#c0392b,#922B21)", spineColor: "#7B241C", glow: "rgba(192,57,43,0.4)" },
                { title: "تحميل كتاب إغراء السلطة المطلقة لبسمة عبد العزيز", link: "https://nawasa-elbahr.yoo7.com/t6663-topic", icon: "fa-crown", color: "linear-gradient(135deg,#8E44AD,#6C3483)", spineColor: "#5B2C6F", glow: "rgba(142,68,173,0.4)" },
                { title: "تحميل كتاب مواليد حديقة الحيوان لأشرف العشماوى", link: "https://nawasa-elbahr.yoo7.com/t13518-topic", icon: "fa-paw", color: "linear-gradient(135deg,#27AE60,#1E8449)", spineColor: "#196F3D", glow: "rgba(39,174,96,0.4)" },
                { title: "تحميل كتاب كراسة التحرير لمكاوى سعيد", link: "https://nawasa-elbahr.yoo7.com/t11657-topic", icon: "fa-pen-fancy", color: "linear-gradient(135deg,#2980B9,#1F618D)", spineColor: "#1A5276", glow: "rgba(41,128,185,0.4)" },
                { title: "تحميل رواية الرحلة لفكري الخولي - ثلاثة أجزاء", link: "https://nawasa-elbahr.yoo7.com/t6300-topic", icon: "fa-route", color: "linear-gradient(135deg,#D4AC0D,#B7950B)", spineColor: "#9A7D0A", glow: "rgba(212,172,13,0.4)" },
                { title: "تحميل رواية أبو الهول لأحمد مراد", link: "https://nawasa-elbahr.yoo7.com/t13509-topic", icon: "fa-landmark", color: "linear-gradient(135deg,#CA6F1E,#A04000)", spineColor: "#873600", glow: "rgba(202,111,30,0.4)" },
                { title: "تحميل رواية أعدائى لممدوح عدوان", link: "https://nawasa-elbahr.yoo7.com/t9751-topic", icon: "fa-skull", color: "linear-gradient(135deg,#2C3E50,#1B2631)", spineColor: "#17202A", glow: "rgba(44,62,80,0.4)" },
                { title: "تحميل رواية أم ميمى لبلال فضل", link: "https://nawasa-elbahr.yoo7.com/t13290-topic", icon: "fa-heart", color: "linear-gradient(135deg,#E74C3C,#C0392B)", spineColor: "#A93226", glow: "rgba(231,76,60,0.4)" },
                { title: "تحميل كتاب كان وأخواتها - عبد القادر الشاوي", link: "https://nawasa-elbahr.yoo7.com/t6298-topic", icon: "fa-feather-pointed", color: "linear-gradient(135deg,#1ABC9C,#148F77)", spineColor: "#117A65", glow: "rgba(26,188,156,0.4)" },
                { title: "تحميل كتاب السامريون الأشرار لها جوون تشانج", link: "https://nawasa-elbahr.yoo7.com/t12694-topic", icon: "fa-globe", color: "linear-gradient(135deg,#34495E,#2C3E50)", spineColor: "#1C2833", glow: "rgba(52,73,94,0.4)" },
                { title: "تحميل الأعمال الكاملة لنجيب سرور", link: "https://nawasa-elbahr.yoo7.com/t6395-topic", icon: "fa-theater-masks", color: "linear-gradient(135deg,#7D3C98,#6C3483)", spineColor: "#5B2C6F", glow: "rgba(125,60,152,0.4)" },
                { title: "تحميل كتاب فن اللامبالاة لمارك مانسون", link: "https://nawasa-elbahr.yoo7.com/t12982-topic", icon: "fa-brain", color: "linear-gradient(135deg,#E67E22,#CA6F1E)", spineColor: "#B9770E", glow: "rgba(230,126,34,0.4)" },
                { title: "تحميل رواية لوكاندة بير الوطاويط لأحمد مراد", link: "https://nawasa-elbahr.yoo7.com/t13113-topic", icon: "fa-hotel", color: "linear-gradient(135deg,#16A085,#138D75)", spineColor: "#0E6655", glow: "rgba(22,160,133,0.4)" },
                { title: "تحميل الأعمال الكاملة للعقاد", link: "https://nawasa-elbahr.yoo7.com/t13031-topic", icon: "fa-scroll", color: "linear-gradient(135deg,#D35400,#BA4A00)", spineColor: "#A04000", glow: "rgba(211,84,0,0.4)" },
                { title: "تحميل الأعمال الكاملة ليوسف إدريس أربع مجلدات", link: "https://nawasa-elbahr.yoo7.com/t12979-topic", icon: "fa-book-open", color: "linear-gradient(135deg,#2E86C1,#2471A3)", spineColor: "#1F618D", glow: "rgba(46,134,193,0.4)" }
            ];

            // Books from f28-montada - مرتفعات أو سوناتا الكلام (Poetry & Literature)
            var poetryBooks = [
                { title: "لأنّه لا اسم يحتويها قد سُمّيت أسماء", link: "https://nawasa-elbahr.yoo7.com/t13535-topic", icon: "fa-feather", color: "linear-gradient(135deg,#6C3483,#4A235A)", spineColor: "#3B1C4A", glow: "rgba(108,52,131,0.4)" },
                { title: "لو كان قلبىَ خاتماً لوضعتُهُ فى إصبعِك", link: "https://nawasa-elbahr.yoo7.com/t13374-topic", icon: "fa-ring", color: "linear-gradient(135deg,#C0392B,#922B21)", spineColor: "#7B241C", glow: "rgba(192,57,43,0.4)" },
                { title: "لم يكن هناك جسد، بل أثرُ مرورٍ لفكرةٍ", link: "https://nawasa-elbahr.yoo7.com/t13540-topic", icon: "fa-ghost", color: "linear-gradient(135deg,#2C3E50,#1A252F)", spineColor: "#151E27", glow: "rgba(44,62,80,0.4)" },
                { title: "الموت حيوانٌ أعمى يتبع رائحة التراب", link: "https://nawasa-elbahr.yoo7.com/t13536-topic", icon: "fa-skull-crossbones", color: "linear-gradient(135deg,#17202A,#0D1117)", spineColor: "#0A0E12", glow: "rgba(23,32,42,0.5)" },
                { title: "ولست أجسّدها إنّها فوق طين التّجسّد", link: "https://nawasa-elbahr.yoo7.com/t13496-topic", icon: "fa-cloud", color: "linear-gradient(135deg,#1A5276,#0E3450)", spineColor: "#0C2B42", glow: "rgba(26,82,118,0.4)" },
                { title: "بشر الحافى - قصيدة لأحمد بخيت", link: "https://nawasa-elbahr.yoo7.com/t13528-topic", icon: "fa-shoe-prints", color: "linear-gradient(135deg,#784212,#5A3210)", spineColor: "#4A290E", glow: "rgba(120,66,18,0.4)" },
                { title: "شعر وقصائد كارل ماركس - ديوان كارل ماركس", link: "https://nawasa-elbahr.yoo7.com/t13519-topic", icon: "fa-pen-nib", color: "linear-gradient(135deg,#B71C1C,#8B0000)", spineColor: "#710000", glow: "rgba(183,28,28,0.4)" },
                { title: "شعر وقصائد بول كلوديل - ديوان الشاعر الفرنسى", link: "https://nawasa-elbahr.yoo7.com/t13511-topic", icon: "fa-palette", color: "linear-gradient(135deg,#0D47A1,#093170)", spineColor: "#072758", glow: "rgba(13,71,161,0.4)" },
                { title: "ملك الفجوات - قصائد قصيرة لفرناندو بيسوا", link: "https://nawasa-elbahr.yoo7.com/t13503-topic", icon: "fa-chess-king", color: "linear-gradient(135deg,#4A148C,#311060)", spineColor: "#270D4D", glow: "rgba(74,20,140,0.4)" },
                { title: "ديوان فريدريك نيتشه - شعر وقصائد نيتشه", link: "https://nawasa-elbahr.yoo7.com/t13477-topic", icon: "fa-fire", color: "linear-gradient(135deg,#BF360C,#8C2809)", spineColor: "#6E2007", glow: "rgba(191,54,12,0.4)" },
                { title: "ديوان أنا شاهد قبرك لفاطمة قنديل", link: "https://nawasa-elbahr.yoo7.com/t13476-topic", icon: "fa-eye", color: "linear-gradient(135deg,#1B5E20,#0E3B13)", spineColor: "#0A2E0F", glow: "rgba(27,94,32,0.4)" },
                { title: "ديوان سيرة الكرز لإبراهيم نصر الله", link: "https://nawasa-elbahr.yoo7.com/t13475-topic", icon: "fa-apple-whole", color: "linear-gradient(135deg,#AD1457,#7B0F3E)", spineColor: "#600C31", glow: "rgba(173,20,87,0.4)" },
                { title: "ديوان أغنية صياد السمك لسعدى يوسف", link: "https://nawasa-elbahr.yoo7.com/t13474-topic", icon: "fa-fish", color: "linear-gradient(135deg,#006064,#003D40)", spineColor: "#002E30", glow: "rgba(0,96,100,0.4)" },
                { title: "ديوان ذاكرة الوعل لفريد أبو سعدة", link: "https://nawasa-elbahr.yoo7.com/t13472-topic", icon: "fa-horse", color: "linear-gradient(135deg,#3E2723,#2A1B18)", spineColor: "#1E1310", glow: "rgba(62,39,35,0.5)" },
                { title: "فضة متربة وقصائد أخرى - شعر أمجد ناصر", link: "https://nawasa-elbahr.yoo7.com/t13454-topic", icon: "fa-moon", color: "linear-gradient(135deg,#546E7A,#37474F)", spineColor: "#263238", glow: "rgba(84,110,122,0.4)" }
            ];

            var shelvesData = [
                { label: "الرف الأول ❖ روايات وأدب", icon: "fa-bookmark", books: libraryBooks.slice(0, 5) },
                { label: "الرف الثانى ❖ كتب ومراجع", icon: "fa-book-reader", books: libraryBooks.slice(5, 10) },
                { label: "الرف الثالث ❖ مجلدات وأعمال كاملة", icon: "fa-layer-group", books: libraryBooks.slice(10, 15) },
                { label: "الرف الرابع ❖ مرتفعات سوناتا الكلام - شعر ودواوين", icon: "fa-feather-pointed", books: poetryBooks }
            ];
            function createDust() {
                var c = document.getElementById('lib-dust'); if (!c) return;
                for (var i = 0; i < 30; i++) {
                    var p = document.createElement('div'); p.className = 'dust-particle';
                    p.style.left = (Math.random() * 100) + '%'; p.style.top = (30 + Math.random() * 60) + '%';
                    p.style.setProperty('--dust-dur', (8 + Math.random() * 12) + 's');
                    p.style.setProperty('--dust-x', (Math.random() * 80 - 40) + 'px');
                    p.style.animationDelay = Math.random() * 10 + 's';
                    var s = (1 + Math.random() * 3) + 'px'; p.style.width = s; p.style.height = s;
                    c.appendChild(p);
                }
            }
            function buildLibrary() {
                var container = document.getElementById('library-shelves'); if (!container) return;
                container.innerHTML = '';
                shelvesData.forEach(function (shelf, si) {
                    var row = document.createElement('div'); row.className = 'bookshelf-row';
                    var label = document.createElement('div'); label.className = 'shelf-label';
                    label.innerHTML = '<i class="fas ' + shelf.icon + '"></i> ' + shelf.label;
                    row.appendChild(label);
                    var wrap = document.createElement('div'); wrap.style.position = 'relative';
                    var bc = document.createElement('div'); bc.className = 'books-container'; bc.id = 'books-' + si;
                    shelf.books.forEach(function (book, bi) { bc.appendChild(createBook(book, bi)); });
                    wrap.appendChild(bc);
                    var pb = document.createElement('button'); pb.className = 'shelf-nav-btn shelf-nav-prev';
                    pb.innerHTML = '<i class="fas fa-chevron-right"></i>'; pb.setAttribute('data-shelf', si);
                    pb.onclick = function () { scrollShelf(parseInt(this.getAttribute('data-shelf')), 'right'); };
                    var nb = document.createElement('button'); nb.className = 'shelf-nav-btn shelf-nav-next';
                    nb.innerHTML = '<i class="fas fa-chevron-left"></i>'; nb.setAttribute('data-shelf', si);
                    nb.onclick = function () { scrollShelf(parseInt(this.getAttribute('data-shelf')), 'left'); };
                    wrap.appendChild(pb); wrap.appendChild(nb); row.appendChild(wrap);
                    var se = document.createElement('div'); se.className = 'wooden-shelf';
                    se.innerHTML = '<div class="shelf-top"></div><div class="shelf-front"></div><div class="shelf-bracket shelf-bracket-left"></div><div class="shelf-bracket shelf-bracket-right"></div>';
                    row.appendChild(se); container.appendChild(row);
                });
            }
            function createBook(book) {
                var el = document.createElement('div'); el.className = 'book-3d';
                el.style.setProperty('--book-color', book.color);
                el.style.setProperty('--book-spine-color', book.spineColor);
                el.style.setProperty('--book-glow', book.glow);
                el.style.height = (230 + Math.random() * 30) + 'px';
                el.innerHTML = '<a href="' + book.link + '" target="_blank" class="book-link" title="' + book.title + '"></a><div class="book-wrapper"><div class="book-cover"><div class="book-cover-bg" style="background:' + book.color + '"></div><div class="book-cover-pattern"></div><div class="book-cover-icon"><i class="fas ' + book.icon + '"></i></div><div class="book-title-area"><div class="book-title">' + book.title + '</div></div></div><div class="book-spine" style="background:' + book.spineColor + '"><div class="spine-ornament top"></div><span class="spine-text">' + book.title.substring(0, 20) + '</span><div class="spine-ornament bottom"></div></div><div class="book-pages"></div></div>';
                el.addEventListener('mousemove', function (e) {
                    var r = this.getBoundingClientRect();
                    var x = (e.clientX - r.left) / r.width - 0.5;
                    var y = (e.clientY - r.top) / r.height - 0.5;
                    var w = this.querySelector('.book-wrapper');
                    if (w) w.style.transform = 'rotateX(' + (y * -15) + 'deg) rotateY(' + (x * 15 - 20) + 'deg)';
                });
                el.addEventListener('mouseleave', function () {
                    var w = this.querySelector('.book-wrapper'); if (w) w.style.transform = '';
                });
                return el;
            }
            function scrollShelf(si, dir) {
                var c = document.getElementById('books-' + si); if (!c) return;
                c.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
            }
            function initLibrary() { createDust(); buildLibrary(); }
            if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initLibrary); }
            else { initLibrary(); }
        })();
