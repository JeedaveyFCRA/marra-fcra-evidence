document.addEventListener('DOMContentLoaded', function () {
    const CREDITORS = {
        'ally': {
            name: 'Ally Financial',
            logo: './assets/logos/Ally_Financial.svg',
            violations: 5
        },
        'chase': {
            name: 'JPMorgan Chase',
            logo: './assets/logos/Chase_Logo.svg',
            violations: 3
        }
    };

    const bureauBoxes = ['equifax', 'experian', 'transunion'];
    const dateCount = 9;

    // Violation data from CSV
    const VIOLATION_DATA = [
        {filename: 'ALLY-EQ-2024-04-25-P51.png', creditor: 'ALLY', bureau: 'EQ', date: '2024-04-25', page: 'P51', x: 44, y: 229, width: 485, height: 67, code: '§1681s-2(a)(1)(A)', severity: 'severe'},
        {filename: 'ALLY-EQ-2024-04-25-P51.png', creditor: 'ALLY', bureau: 'EQ', date: '2024-04-25', page: 'P51', x: 1022, y: 293, width: 4, height: 5, code: '§1681s-2(b)', severity: 'serious'},
        {filename: 'ALLY-EQ-2024-08-19-P99.png', creditor: 'ALLY', bureau: 'EQ', date: '2024-08-19', page: 'P99', x: 58, y: 462, width: 967, height: 72, code: '§1681s-2(a)(1)(A)', severity: 'severe'},
        {filename: 'ALLY-EQ-2024-08-19-P98.png', creditor: 'ALLY', bureau: 'EQ', date: '2024-08-19', page: 'P98', x: 45, y: 507, width: 985, height: 64, code: '§1681s-2(b)', severity: 'serious'},
        {filename: 'ALLY-EQ-2025-02-10-P51.png', creditor: 'ALLY', bureau: 'EQ', date: '2025-02-10', page: 'P51', x: 36, y: 231, width: 485, height: 69, code: '§1681s-2(a)(1)(A)', severity: 'severe'},
        {filename: 'ALLY-EQ-2025-02-10-P51.png', creditor: 'ALLY', bureau: 'EQ', date: '2025-02-10', page: 'P51', x: 532, y: 231, width: 480, height: 68, code: '§1681s-2(b)', severity: 'serious'},
        {filename: 'ALLY-EQ-2025-03-22-P40.png', creditor: 'ALLY', bureau: 'EQ', date: '2025-03-22', page: 'P40', x: 31, y: 229, width: 500, height: 67, code: '§1681s-2(a)(1)(A)', severity: 'severe'},
        {filename: 'ALLY-EQ-2025-03-22-P40.png', creditor: 'ALLY', bureau: 'EQ', date: '2025-03-22', page: 'P40', x: 545, y: 228, width: 471, height: 67, code: '§1681s-2(b)', severity: 'serious'},
        {filename: 'ALLY-EQ-2025-04-02-P51.png', creditor: 'ALLY', bureau: 'EQ', date: '2025-04-02', page: 'P51', x: 1011, y: 293, width: 5, height: 4, code: '§1681s-2(b)', severity: 'serious'},
        {filename: 'ALLY-EQ-2025-04-02-P51.png', creditor: 'ALLY', bureau: 'EQ', date: '2025-04-02', page: 'P51', x: 27, y: 232, width: 510, height: 67, code: '§1681s-2(a)(1)(A)', severity: 'severe'},
        {filename: 'ALLY-EQ-2025-04-14-P51.png', creditor: 'ALLY', bureau: 'EQ', date: '2025-04-14', page: 'P51', x: 36, y: 227, width: 494, height: 72, code: '§1681s-2(a)(1)(A)', severity: 'severe'},
        {filename: 'ALLY-EQ-2025-04-14-P51.png', creditor: 'ALLY', bureau: 'EQ', date: '2025-04-14', page: 'P51', x: 539, y: 229, width: 475, height: 72, code: '§1681s-2(b)', severity: 'serious'},
        {filename: 'ALLY-EQ-2025-03-13-P42.png', creditor: 'ALLY', bureau: 'EQ', date: '2025-03-13', page: 'P42', x: 40, y: 225, width: 492, height: 72, code: '§1681s-2(a)(1)(A)', severity: 'severe'},
        {filename: 'ALLY-EQ-2025-03-13-P42.png', creditor: 'ALLY', bureau: 'EQ', date: '2025-03-13', page: 'P42', x: 545, y: 225, width: 468, height: 70, code: '§1681s-2(b)', severity: 'serious'},
        {filename: 'ALLY-EQ-2025-03-02-P51.png', creditor: 'ALLY', bureau: 'EQ', date: '2025-03-02', page: 'P51', x: 28, y: 226, width: 511, height: 72, code: '§1681s-2(a)(1)(A)', severity: 'severe'},
        {filename: 'ALLY-EQ-2025-03-02-P51.png', creditor: 'ALLY', bureau: 'EQ', date: '2025-03-02', page: 'P51', x: 548, y: 226, width: 471, height: 73, code: '§1681s-2(b)', severity: 'serious'}
    ];

    let currentState = {
        creditor: null,
        bureau: null,
        selectedDate: null
    };

    let currentPageIndex = 0;
    let currentImageList = [];
    let currentViolationOverlays = [];

    const multiPageFilenames = {
        'equifax-ally-3': [
            'ALLY-EQ-2024-08-19-P99.png',
            'ALLY-EQ-2024-08-19-P98.png'
        ],
        'equifax-ally-9': [
            'ALLY-EQ-2025-04-14-P49.png',
            'ALLY-EQ-2025-04-14-P50.png'
        ]
    };

    const vioCountElement = document.getElementById('violation-count');
    const creditorNameElement = document.querySelector('.creditor-name');
    const creditorLogoElement = document.querySelector('.creditor-logo');
    const selectedRuleOverlay = document.getElementById('selected-rule-overlay') || createSelectedOverlay();

    function createSelectedOverlay() {
        const img = document.createElement('img');
        img.id = 'selected-rule-overlay';
        img.style.position = 'absolute';
        img.style.left = '424px';
        img.style.top = '12.92px';
        img.style.width = '640px';
        img.style.height = '189.55px';
        img.style.display = 'none';
        img.style.zIndex = '100';
        document.body.appendChild(img);
        return img;
    }

    function init() {
        const urlParams = new URLSearchParams(window.location.search);
        const creditorId = urlParams.get('creditor')?.toLowerCase() || 'ally';
        currentState.creditor = CREDITORS[creditorId] || CREDITORS.ally;

        updateCreditorInfo();
        initBureauBoxes();
        initDateImages();
        initHoverBoxes6to9();
        initViolationCounter();
        clearBox1();
    }

    function updateCreditorInfo() {
        creditorNameElement.textContent = `(${currentState.creditor.name})`;
        creditorLogoElement.src = currentState.creditor.logo;
        vioCountElement.textContent = currentState.creditor.violations;
    }

    function initBureauBoxes() {
        document.querySelectorAll('[data-bureau]').forEach(box => {
            box.addEventListener('click', function () {
                const selectedBureau = box.dataset.bureau;

                if (currentState.bureau === selectedBureau) {
                    currentState.bureau = null;
                    currentState.selectedDate = null;
                    resetBureauBoxes();
                    clearDateSelectionUI();
                    clearBox1();
                    hideSelectedOverlay();
                    clearViolationOverlays();
                } else {
                    currentState.bureau = selectedBureau;
                    currentState.selectedDate = null;
                    setActiveBureauBox(box);
                    clearDateSelectionUI();
                    clearBox1();
                    hideSelectedOverlay();
                    clearViolationOverlays();
                }
            });
        });
    }

    function resetBureauBoxes() {
        document.querySelectorAll('[data-bureau]').forEach(box => {
            box.classList.remove('active', 'non-selected');
        });
    }

    function setActiveBureauBox(activeBox) {
        document.querySelectorAll('[data-bureau]').forEach(box => {
            box.classList.remove('active', 'non-selected');
        });
        activeBox.classList.add('active');
        document.querySelectorAll('[data-bureau]').forEach(box => {
            if (box !== activeBox) {
                box.classList.add('non-selected');
            }
        });
    }

    function clearDateSelectionUI() {
        document.querySelectorAll('.date-img').forEach(img => {
            img.classList.remove('selected');
            img.src = `/creditor-details/assets/rules/default-date-${img.dataset.date}.png`;
        });
    }

    function clearBox1() {
        const crBox1 = document.querySelector('.cr-box1');
        crBox1.innerHTML = '';
        const placeholder = document.createElement('div');
        placeholder.className = 'cr-placeholder-text';
        placeholder.textContent = 'Reports will appear here';
        crBox1.appendChild(placeholder);
        crBox1.classList.remove('has-image');
        currentPageIndex = 0;
        currentImageList = [];
        clearViolationOverlays();
    }

    function hideSelectedOverlay() {
        selectedRuleOverlay.style.display = 'none';
    }

    function clearViolationOverlays() {
        currentViolationOverlays.forEach(overlay => {
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        });
        currentViolationOverlays = [];
    }

    function initDateImages() {
        const box5 = document.querySelector('.box5');
        box5.innerHTML = '';

        for (let i = 1; i <= dateCount; i++) {
            const dateImg = document.createElement('img');
            dateImg.className = 'date-img';
            dateImg.dataset.date = i;
            dateImg.src = `/creditor-details/assets/rules/default-date-${i}.png`;
            Object.assign(dateImg.style, {
                position: 'absolute',
                left: '0px',
                top: `${15 + (i - 1) * 21}px`,
                width: '212px',
                height: '19.5px',
                cursor: 'pointer'
            });

            dateImg.addEventListener('mouseenter', () => {
                if (!dateImg.classList.contains('selected')) {
                    dateImg.src = `/creditor-details/assets/rules/hover-date-${i}.png`;
                }
            });

            dateImg.addEventListener('mouseleave', () => {
                if (!dateImg.classList.contains('selected')) {
                    dateImg.src = `/creditor-details/assets/rules/default-date-${i}.png`;
                }
            });

            dateImg.addEventListener('click', () => {
                if (!currentState.bureau) {
                    box5.classList.add('shake');
                    setTimeout(() => box5.classList.remove('shake'), 500);
                    return;
                }
                selectDate(i);
            });

            box5.appendChild(dateImg);
        }
    }

    function displayReportImageInBox1(imageName) {
        const crBox1 = document.querySelector('.cr-box1');

        // Preserve nav and page counter
        const preservedNodes = Array.from(crBox1.children).filter(child =>
            child.classList &&
            (child.classList.contains('cr-image-nav') || child.classList.contains('page-counter'))
        );
        crBox1.innerHTML = '';
        preservedNodes.forEach(node => crBox1.appendChild(node));

        if (!imageName || typeof imageName !== 'string' || imageName.trim() === '') {
            const placeholder = document.createElement('div');
            placeholder.className = 'cr-placeholder-text';
            placeholder.textContent = 'Reports will appear here';
            crBox1.appendChild(placeholder);
            crBox1.classList.remove('has-image');
            clearViolationOverlays();
            return;
        }

        const img = document.createElement('img');
        img.id = 'report-image';
        img.src = `/creditor-details/assets/reports/${imageName}`;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        img.style.position = 'absolute';
        img.style.top = '0';
        img.style.left = '0';
        img.style.zIndex = '1';
        crBox1.appendChild(img);
        crBox1.classList.add('has-image');

        createNavArrows();
        updatePageCounter(currentPageIndex + 1, currentImageList.length);
        
        // Add violation overlays if Equifax is selected
        if (currentState.bureau === 'equifax') {
            addViolationOverlays(imageName);
        }
    }

    function addViolationOverlays(imageName) {
        clearViolationOverlays();
        
        const crBox1 = document.querySelector('.cr-box1');
        const violationsForImage = VIOLATION_DATA.filter(v => v.filename === imageName);
        
        violationsForImage.forEach(violation => {
            const overlay = document.createElement('div');
            overlay.className = 'violation-overlay active';
            
            // Position and size the overlay based on the violation data
            overlay.style.left = `${violation.x}px`;
            overlay.style.top = `${violation.y}px`;
            overlay.style.width = `${violation.width}px`;
            overlay.style.height = `${violation.height}px`;
            
            // Add label with violation code
            const label = document.createElement('div');
            label.className = 'violation-overlay-label';
            label.textContent = violation.code;
            overlay.appendChild(label);
            
            // Add checkbox to toggle overlay
            const checkboxId = `overlay-${violation.code}-${Date.now()}`;
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = checkboxId;
            checkbox.className = 'violation-overlay-checkbox';
            checkbox.checked = true;
            checkbox.style.position = 'absolute';
            checkbox.style.right = '5px';
            checkbox.style.top = '5px';
            checkbox.style.zIndex = '20';
            checkbox.style.pointerEvents = 'auto';
            checkbox.style.cursor = 'pointer';
            
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    overlay.style.display = 'block';
                } else {
                    overlay.style.display = 'none';
                }
                updateViolationCount();
            });
            
            overlay.appendChild(checkbox);
            crBox1.appendChild(overlay);
            currentViolationOverlays.push(overlay);
        });
        
        updateViolationCount();
    }

    function createNavArrows() {
        const crBox1 = document.querySelector('.cr-box1');

        // Remove old arrows
        crBox1.querySelectorAll('.cr-image-nav').forEach(el => el.remove());

        const prev = document.createElement('div');
        prev.className = 'cr-image-nav prev';
        prev.innerHTML = '&#10094;';
        prev.style.cssText = `
            position: absolute;
            top: 50%;
            left: 10px;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.7);
            border-radius: 50%;
            width: 40px; height: 40px;
            font-size: 24px;
            color: black;
            text-align: center;
            line-height: 40px;
            cursor: pointer;
            z-index: 50;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            display: ${currentPageIndex > 0 ? 'block' : 'none'};
        `;
        prev.addEventListener('click', e => {
            e.preventDefault(); e.stopPropagation();
            navigatePrev();
        });

        const next = document.createElement('div');
        next.className = 'cr-image-nav next';
        next.innerHTML = '&#10095;';
        next.style.cssText = `
            position: absolute;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.7);
            border-radius: 50%;
            width: 40px; height: 40px;
            font-size: 24px;
            color: black;
            text-align: center;
            line-height: 40px;
            cursor: pointer;
            z-index: 50;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            display: ${currentPageIndex < currentImageList.length - 1 ? 'block' : 'none'};
        `;
        next.addEventListener('click', e => {
            e.preventDefault(); e.stopPropagation();
            navigateNext();
        });

        crBox1.appendChild(prev);
        crBox1.appendChild(next);
    }

    function updatePageCounter(current, total) {
        const crBox1 = document.querySelector('.cr-box1');
        crBox1.querySelectorAll('.page-counter').forEach(el => el.remove());
        if (total > 1) {
            const counter = document.createElement('div');
            counter.className = 'page-counter';
            counter.textContent = `Page ${current} of ${total}`;
            counter.style.cssText = `
                position: absolute;
                bottom: 10px;
                right: 10px;
                background: rgba(255, 255, 255, 0.7);
                padding: 5px 10px;
                border-radius: 3px;
                font-size: 14px;
                font-weight: 500;
                z-index: 50;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
            `;
            crBox1.appendChild(counter);
        }
    }

    function navigateNext() {
        if (!Array.isArray(currentImageList) || currentImageList.length < 2) return;
        if (currentPageIndex < currentImageList.length - 1) {
            currentPageIndex++;
            displayReportImageInBox1(currentImageList[currentPageIndex]);
        }
    }

    function navigatePrev() {
        if (!Array.isArray(currentImageList) || currentImageList.length < 2) return;
        if (currentPageIndex > 0) {
            currentPageIndex--;
            displayReportImageInBox1(currentImageList[currentPageIndex]);
        }
    }

    function selectDate(dateNumber) {
        clearDateSelectionUI();
        const selectedImg = document.querySelector(`.date-img[data-date="${dateNumber}"]`);
        selectedImg.classList.add('selected');
        selectedImg.src = `/creditor-details/assets/rules/hover-date-${dateNumber}.png`;

        currentState.selectedDate = dateNumber;
        const key = `${currentState.bureau}-ally-${dateNumber}`;
        currentPageIndex = 0;

        if (multiPageFilenames[key]) {
            currentImageList = multiPageFilenames[key];
            displayReportImageInBox1(currentImageList[currentPageIndex]);
        } else {
            currentImageList = [];
            const img = getReportImageFilename(currentState.bureau, 'ally', dateNumber);
            displayReportImageInBox1(img);
        }

        // Rule overlay logic
        if (currentState.bureau === 'equifax') {
            selectedRuleOverlay.src = `/creditor-details/assets/rules/equifax-rule-${dateNumber}.png`;
            selectedRuleOverlay.style.display = 'block';
        } else if (currentState.bureau === 'experian') {
            selectedRuleOverlay.src = `/creditor-details/assets/rules/experian-rule-${dateNumber}.png`;
            selectedRuleOverlay.style.display = 'block';
        } else {
            selectedRuleOverlay.style.display = 'none';
        }
    }

    function getReportImageFilename(bureau, creditor, dateIndex) {
        const filenames = {
            'equifax': {
                'ally': {
                    1: '',
                    2: 'ALLY-EQ-2024-04-25-P51.png',
                    3: 'ALLY-EQ-2024-08-19-P99.png',
                    4: 'ALLY-EQ-2025-02-10-P51.png',
                    5: 'ALLY-EQ-2025-03-02-P51.png',
                    6: 'ALLY-EQ-2025-03-13-P42.png',
                    7: 'ALLY-EQ-2025-03-22-P40.png',
                    8: 'ALLY-EQ-2025-04-02-P51.png',
                    9: 'ALLY-EQ-2025-04-14-P51.png'
                }
            }
        };
        return filenames[bureau]?.[creditor]?.[dateIndex] || '';
    }

    function initHoverBoxes6to9() {
        ['box6', 'box7', 'box8', 'box9'].forEach(className => {
            const box = document.querySelector(`.${className}`);
            if (!box) return;

            const defaultLogo = box.querySelector('.default-logo');
            const hoverLogo = box.querySelector('.hover-logo');
            const text = box.querySelector('.box-text');

            box.addEventListener('mouseenter', () => {
                if (defaultLogo && hoverLogo) {
                    defaultLogo.style.display = 'none';
                    hoverLogo.style.display = 'block';
                }
                if (text) {
                    text.style.color = 'rgba(0,0,0,0.65)';
                    text.style.textDecoration = 'underline';
                    text.style.textDecorationThickness = '1px';
                    text.style.textUnderlineOffset = '4px';
                }
            });

            box.addEventListener('mouseleave', () => {
                if (defaultLogo && hoverLogo) {
                    defaultLogo.style.display = 'block';
                    hoverLogo.style.display = 'none';
                }
                if (text) {
                    text.style.color = 'rgba(0,0,0,0.85)';
                    text.style.textDecoration = 'none';
                }
            });
        });
    }

    function initViolationCounter() {
        const checkboxes = document.querySelectorAll('.violation-list input[type="checkbox"]');
        function updateViolationCount() {
            // Count checked boxes in violation list
            const listCount = document.querySelectorAll('.violation-list input[type="checkbox"]:checked').length;
            
            // Count active violation overlays
            const overlayCount = document.querySelectorAll('.violation-overlay.active').length;
            
            // Total count is sum of both
            const totalCount = listCount + overlayCount;
            
            vioCountElement.textContent = totalCount;
            vioCountElement.classList.add('pop');
            setTimeout(() => vioCountElement.classList.remove('pop'), 300);
        }
        
        checkboxes.forEach(cb => cb.addEventListener('change', updateViolationCount));
        updateViolationCount();
    }

    init();
});