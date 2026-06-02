// --- Configuration ---
// يرجى استبدال الرابط أدناه بالرابط الخاص بـ Web App بعد نشر Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbwzKqOQrYP80lFviKtQtGWseYvnfqje-b4q22xgp5DQ5ox9v29vh4_OsBXJnmSqQNmH_Q/exec"; 

// --- Data Definitions ---
const assetBrands = {
    "كمبيوتر": ["Dell", "Hp", "Premum", "Compaq", "laptop", "Taplet"],
    "بروجيكتور": ["sharp", "infocus", "sony"],
    "طابعة ألوان": ["hp pro300", "hp1525n",],
    "طابعة أبيض وأسود": ["p2035", "p1005", "p1006","P1102","P2025"],
    "آلة تصوير": ["كانون", "كيوسيرا","توشيبا"],
    " شاشة كمبيوتر": ["]Dell", "hp","Samsung"],
" شاشة تلبفزيوبنة": ["Dansat", "Mando","Samsung"," Wansa"],
    "سبورة": ["تفاعلية", "عادية", "متحركة", "بيضاء منسدلة"],
    "لوحة وبرية": ["قياسية"],
    "مكيف": ["LG", "Media", "Hair","Smart"," Gaint"," Crown"," Top-Tech","Plasma","Hammer","Dankin","TIT","Bancool","StarWay"],
    "طاولة طالب": ["خشب", "حديد", "بلاستيك"],
    "مقعد طالب": ["خشب", "حديد"],
    "مكتب معلم": ["خشب كبير", "خشب صغير"],
    "كرسي معلم": ["دوار", "ثابت"],
    "سماعة ": ["Qomo", "Edis", "Supper","matrix"," متحركة"],
    "ماسح ضوئي": ["Hp", "Canon", "Epson"],
    "دولاب": ["خشبي", "حديد"],
    "خزنة حديد": ["صغيرة", "كبيرة"],
    "خزانة كتب": ["خشبية", "معدنية"],
    "طاولة اجتماعات": ["بيضاوي", "مستطيل"],
    "طاولة دائرية": ["صغيرة", "كبيرة"],
    "كاميرا مراقبة": ["Hikvision", "Dahua"],
    "كبينة نت": ["قياسية"],
    "إذاعة مدرسية": ["اذاعة"],
    " ساعة حائط": ["ساعة حائط"],
    "سماعات اذاعية": ["سماعة"],
    "دروع مدرسية": ["درع"],
    "ثلاجة": ["ثلاجة"],
    "برادة مياه ": ["برادة"],
    "جهاز بصمة": ["بصمة"],
    "سلة مهملات": ["سلة"],
    "كاميرا": ["Hikvision","Dahua","E-Gaurde","View"],
    "DVR": ["HikVision","E-Gaurde"],
    "NVR": ["Hikvesion","E-Gaurde"],
    "Switch ": ["8 Port","16 Port","24 Port","48 Port"],
    "Access Point": ["Linksysy","TP-Link","D-Link","Aruba"]

};
// --- DOM Elements ---
const navLinks = document.querySelectorAll('.nav-links a');
const pageSections = document.querySelectorAll('.page-section');
const assetTypeSelect = document.getElementById('assetType');
const brandSelect = document.getElementById('brand');
const customBrandInput = document.getElementById('customBrand');
const assetForm = document.getElementById('asset-form');
const submitBtn = document.getElementById('submitBtn');
const spinner = document.getElementById('spinner');
const toast = document.getElementById('toast');
const toastIcon = document.getElementById('toastIcon');
const toastMessage = document.getElementById('toastMessage');

// Filters
const searchInput = document.getElementById('searchInput');
const filterBranch = document.getElementById('filterBranch');
const filterSchool = document.getElementById('filterSchool');
const filterStatus = document.getElementById('filterStatus');
const filterRoomNo = document.getElementById('filterRoomNo');
const filterAssetType = document.getElementById('filterAssetType');

// Statistics
const statBranch = document.getElementById('statBranch');
const statSchool = document.getElementById('statSchool');
const statAssetType = document.getElementById('statAssetType');
const statBrand = document.getElementById('statBrand');
const statisticsResults = document.getElementById('statisticsResults');

// Distribution
const distBranch = document.getElementById('distBranch');
const distSchool = document.getElementById('distSchool');
const distAssetType = document.getElementById('distAssetType');
const distBrand = document.getElementById('distBrand');

// Table
const tableBody = document.getElementById('tableBody');
let globalData = [];

// --- Navigation Logic ---
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('data-target');
        navigateTo(targetId);
    });
});

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinksContainer = document.querySelector('.nav-links');
if (mobileMenuBtn && navLinksContainer) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
            if (icon.classList.contains('fa-bars')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        }
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.className = 'fa-solid fa-bars';
            }
        });
    });
}

window.navigateTo = function(targetId) {
    // Update active nav link
    navLinks.forEach(link => {
        if (link.getAttribute('data-target') === targetId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Update active section
    pageSections.forEach(section => {
        if (section.id === targetId) {
            section.classList.remove('hidden');
            section.classList.add('active');
            // Re-trigger animation
            section.style.animation = 'none';
            section.offsetHeight; // trigger reflow
            section.style.animation = null;
        } else {
            section.classList.add('hidden');
            section.classList.remove('active');
        }
    });

    // Fetch data if navigating to dashboard, statistics or distribution
    if ((targetId === 'dashboard' || targetId === 'statistics' || targetId === 'distribution') && globalData.length === 0) {
        fetchData();
    } else if (globalData.length > 0) {
        if (targetId === 'statistics') {
            updateStatFilters();
            renderStatistics();
        }
        if (targetId === 'distribution') {
            updateDistFilters();
            renderMatrixTable();
        }
    }
}

// --- Dynamic Dropdowns ---
assetTypeSelect.addEventListener('change', (e) => {
    const selectedType = e.target.value;
    brandSelect.innerHTML = '<option value="">اختر الماركة</option>';
    
    if (assetBrands[selectedType]) {
        assetBrands[selectedType].forEach(brand => {
            const option = document.createElement('option');
            option.value = brand;
            option.textContent = brand;
            brandSelect.appendChild(option);
        });
        brandSelect.classList.remove('hidden');
        customBrandInput.classList.add('hidden');
        
        // Add custom option
        const customOption = document.createElement('option');
        customOption.value = "أخرى";
        customOption.textContent = "أخرى (كتابة يدوية)";
        brandSelect.appendChild(customOption);
    } else {
        brandSelect.classList.add('hidden');
        customBrandInput.classList.remove('hidden');
    }
});

brandSelect.addEventListener('change', (e) => {
    if (e.target.value === "أخرى") {
        customBrandInput.classList.remove('hidden');
        customBrandInput.required = true;
    } else {
        customBrandInput.classList.add('hidden');
        customBrandInput.required = false;
        customBrandInput.value = "";
    }
});

// --- Form Submission ---
assetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (API_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL" || API_URL === "") {
        showToast('يرجى إضافة رابط Google Apps Script أولاً في ملف script.js', 'error');
        return;
    }

    const formData = new FormData(assetForm);
    const data = Object.fromEntries(formData.entries());
    
    // Handle brand
    if (data.brand === "أخرى" || !data.brand) {
        data.brand = data.customBrand || "غير محدد";
    }

    // Add timestamp and random ID
    data.date = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit' });
    data.id = "AST-" + Math.floor(Math.random() * 1000000);

    setLoading(true);

    try {
        // We use mode: 'no-cors' because Google Apps Script does not return proper CORS headers for POST
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        // Assuming success if fetch didn't throw
        showToast('تم حفظ الأصل بنجاح!', 'success');
        assetForm.reset();
        brandSelect.innerHTML = '<option value="">اختر أو اكتب...</option>';
        customBrandInput.classList.add('hidden');
        // Clear global data so next visit to dashboard forces refresh
        globalData = []; 
    } catch (error) {
        console.error('Error saving:', error);
        showToast('حدث خطأ أثناء الحفظ. تأكد من اتصالك أو الرابط.', 'error');
    } finally {
        setLoading(false);
    }
});

function setLoading(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        document.querySelector('.btn-text').textContent = 'جاري الحفظ...';
        spinner.classList.remove('hidden');
    } else {
        submitBtn.disabled = false;
        document.querySelector('.btn-text').textContent = 'حفظ البيانات';
        spinner.classList.add('hidden');
    }
}

function showToast(msg, type = 'success') {
    toastMessage.textContent = msg;
    if (type === 'success') {
        toast.className = 'toast show toast-success';
        toastIcon.className = 'fa-solid fa-check-circle';
    } else {
        toast.className = 'toast show toast-error';
        toastIcon.className = 'fa-solid fa-exclamation-circle';
    }

    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// --- Dashboard Fetching ---
window.fetchData = async function() {
    if (API_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL" || API_URL === "") {
        tableBody.innerHTML = '<tr><td colspan="12" class="text-center empty-state"><div class="empty-icon"><i class="fa-solid fa-link-slash"></i></div><h3>لم يتم الربط بقاعدة البيانات</h3><p>يرجى إضافة رابط Google Apps Script في ملف script.js</p></td></tr>';
        return;
    }

    tableBody.innerHTML = '<tr><td colspan="12" class="text-center empty-state"><i class="fa-solid fa-spinner fa-spin fa-2x" style="color: var(--primary); margin-bottom:1rem;"></i><br>جاري تحميل البيانات...</td></tr>';
    
    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        
        if (result && result.data && result.data.length > 0) {
            globalData = result.data;
            updateRoomDropdown();
            updateStatFilters();
            updateDistFilters();
            applyFilters(); // render with current filters
            if (typeof renderStatistics === 'function') renderStatistics();
            if (typeof renderMatrixTable === 'function') renderMatrixTable();
        } else {
            tableBody.innerHTML = '<tr><td colspan="12" class="text-center empty-state"><div class="empty-icon"><i class="fa-solid fa-inbox"></i></div><h3>لا توجد بيانات</h3><p>لم يتم تسجيل أي أصول في قاعدة البيانات حتى الآن.</p></td></tr>';
            globalData = [];
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        tableBody.innerHTML = '<tr><td colspan="12" class="text-center empty-state" style="color:var(--danger)"><div class="empty-icon"><i class="fa-solid fa-triangle-exclamation"></i></div><h3>خطأ في التحميل</h3><p>فشل في جلب البيانات. تأكد من صحة الرابط أو صلاحيات السكريبت.</p></td></tr>';
    }
}

function getStatusClass(status) {
    if(status.includes('ممتاز')) return 'status-excellent';
    if(status.includes('جيد')) return 'status-good';
    if(status.includes('صيانة')) return 'status-maintenance';
    if(status.includes('تالف')) return 'status-broken';
    return 'status-good';
}

function renderTable(data) {
    tableBody.innerHTML = '';
    
    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="12" class="text-center empty-state"><h3>لم يتم العثور على نتائج مطابقة للبحث</h3></td></tr>';
        return;
    }

    data.forEach(row => {
        // Skip header row if it comes from sheet by mistake
        if(row.id === "ID" || row.id === "id" || !row.id) return; 

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.branch || '-'}</td>
            <td>${row.school || '-'}</td>
            <td>${row.roomType || '-'}</td>
            <td>${row.floor || '-'}</td>
            <td><strong>${row.roomNo || '-'}</strong></td>
            <td>${row.assetType || '-'}</td>
            <td><strong>${row.quantity || '1'}</strong></td>
            <td>${row.brand || '-'}</td>
            <td>${row.model || '-'}</td>
            <td style="font-family: monospace; color: var(--text-muted);">${row.serial || '-'}</td>
            <td><span class="status-badge ${getStatusClass(row.status)}">${row.status || '-'}</span></td>
            <td style="font-size: 0.85rem; color: var(--text-muted);">${row.date || '-'}</td>
        `;
        // Excluded ID from table view to keep it clean, added strong to roomNo
        tableBody.appendChild(tr);
    });
}

// --- Filtering ---
function applyFilters() {
    if (globalData.length === 0) return;

    const searchTerm = searchInput.value.toLowerCase();
    const branch = filterBranch.value;
    const school = filterSchool.value;
    const status = filterStatus.value;
    const roomNo = filterRoomNo.value;
    const assetType = filterAssetType.value;

    const filteredData = globalData.filter(row => {
        if(row.id === "ID" || row.id === "id") return false;

        const matchesSearch = 
            (row.assetType && String(row.assetType).toLowerCase().includes(searchTerm)) ||
            (row.roomNo && String(row.roomNo).toLowerCase().includes(searchTerm)) ||
            (row.floor && String(row.floor).toLowerCase().includes(searchTerm)) ||
            (row.serial && String(row.serial).toLowerCase().includes(searchTerm)) ||
            (row.brand && String(row.brand).toLowerCase().includes(searchTerm)) ||
            (row.model && String(row.model).toLowerCase().includes(searchTerm));
            
        const matchesBranch = branch === "" || row.branch === branch;
        const matchesSchool = school === "" || row.school === school;
        const matchesStatus = status === "" || row.status === status;
        const matchesRoomNo = roomNo === "" || (row.roomNo && String(row.roomNo) === String(roomNo));
        const matchesAssetType = assetType === "" || row.assetType === assetType;

        return matchesSearch && matchesBranch && matchesSchool && matchesStatus && matchesRoomNo && matchesAssetType;
    });

    renderTable(filteredData);
}

function updateRoomDropdown() {
    if (globalData.length === 0) return;
    const branch = filterBranch.value;
    const school = filterSchool.value;
    const currentSelection = filterRoomNo.value;
    
    const relevantData = globalData.filter(row => {
        if(row.id === "ID" || row.id === "id") return false;
        const matchesBranch = branch === "" || row.branch === branch;
        const matchesSchool = school === "" || row.school === school;
        return matchesBranch && matchesSchool;
    });

    const rooms = [...new Set(relevantData.map(row => row.roomNo).filter(r => r))].sort();

    filterRoomNo.innerHTML = '<option value="">الكل</option>';
    rooms.forEach(room => {
        const option = document.createElement('option');
        option.value = room;
        option.textContent = room;
        filterRoomNo.appendChild(option);
    });

    if (rooms.includes(currentSelection)) {
        filterRoomNo.value = currentSelection;
    } else {
        filterRoomNo.value = "";
    }
}

searchInput.addEventListener('input', applyFilters);
filterBranch.addEventListener('change', () => { updateRoomDropdown(); applyFilters(); });
filterSchool.addEventListener('change', () => { updateRoomDropdown(); applyFilters(); });
filterStatus.addEventListener('change', applyFilters);
filterRoomNo.addEventListener('change', applyFilters);
filterAssetType.addEventListener('change', applyFilters);

// --- Statistics Logic ---
function updateStatFilters() {
    if (globalData.length === 0) return;

    const assetTypes = [...new Set(globalData.map(row => row.assetType).filter(t => t && t !== "ID" && t !== "id"))].sort();
    const prevAssetType = statAssetType.value;
    
    statAssetType.innerHTML = '<option value="">الكل (جميع الأصول)</option>';
    assetTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        statAssetType.appendChild(option);
    });
    if (assetTypes.includes(prevAssetType)) {
        statAssetType.value = prevAssetType;
    } else {
        statAssetType.value = "";
    }

    updateStatBrandDropdown();
}

function updateStatBrandDropdown() {
    const selectedAssetType = statAssetType.value;
    const prevBrand = statBrand.value;

    const filteredForBrands = globalData.filter(row => {
        if(row.id === "ID" || row.id === "id") return false;
        return selectedAssetType === "" || row.assetType === selectedAssetType;
    });

    const brands = [...new Set(filteredForBrands.map(row => row.brand).filter(b => b))].sort();

    statBrand.innerHTML = '<option value="">الكل (جميع الماركات)</option>';
    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        statBrand.appendChild(option);
    });

    if (brands.includes(prevBrand)) {
        statBrand.value = prevBrand;
    } else {
        statBrand.value = "";
    }
}

function renderStatistics() {
    if (globalData.length === 0) {
        statisticsResults.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 2rem;">لا توجد بيانات متاحة للإحصائيات.</div>';
        return;
    }

    const branch = statBranch.value;
    const school = statSchool.value;
    const assetType = statAssetType.value;
    const brand = statBrand.value;

    const targetData = globalData.filter(row => {
        if(row.id === "ID" || row.id === "id") return false;
        
        const matchesBranch = branch === "" || row.branch === branch;
        const matchesSchool = school === "" || row.school === school;
        const matchesAssetType = assetType === "" || row.assetType === assetType;
        const matchesBrand = brand === "" || (row.brand && String(row.brand).toLowerCase() === brand.toLowerCase());
        
        return matchesBranch && matchesSchool && matchesAssetType && matchesBrand;
    });
    
    if (targetData.length === 0) {
        statisticsResults.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 2rem;">لا توجد أصول مسجلة تطابق هذه التصفية.</div>';
        return;
    }

    // Calculations
    let totalAssets = 0;
    const typeStats = {};
    const brandStats = {};
    const statusStats = {};
    const locationStats = {};

    targetData.forEach(row => {
        const qty = parseInt(row.quantity) || 1;
        totalAssets += qty;

        const type = row.assetType || 'غير محدد';
        typeStats[type] = (typeStats[type] || 0) + qty;

        const bName = row.brand || 'غير محدد';
        brandStats[bName] = (brandStats[bName] || 0) + qty;

        const status = row.status || 'غير محدد';
        statusStats[status] = (statusStats[status] || 0) + qty;

        const loc = `${row.branch || 'غير محدد'} - ${row.school || 'غير محدد'}`;
        locationStats[loc] = (locationStats[loc] || 0) + qty;
    });

    function getStatusClassLocal(status) {
        if(status.includes('ممتاز')) return 'status-excellent';
        if(status.includes('جيد')) return 'status-good';
        if(status.includes('صيانة')) return 'status-maintenance';
        if(status.includes('تالف')) return 'status-broken';
        return '';
    }

    let html = '';

    // 1. MAIN CARD (TOTAL)
    let mainTitle = "إجمالي الأصول";
    if (assetType !== "" && brand !== "") {
        mainTitle = `إجمالي: ${assetType} (${brand})`;
    } else if (assetType !== "") {
        mainTitle = `إجمالي: ${assetType}`;
    } else if (brand !== "") {
        mainTitle = `إجمالي ماركة: ${brand}`;
    }

    html += `
        <div class="stat-card animate-fade-in" style="grid-column: 1 / -1; background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%); color: white; padding: 2rem; position: relative; overflow: hidden; text-align: center;">
            <i class="fa-solid fa-boxes-stacked" style="color: white; opacity: 0.15; font-size: 8rem; position: absolute; left: -10px; bottom: -10px;"></i>
            <h3 style="color: white; font-size: 1.25rem;">${mainTitle}</h3>
            <p style="color: white; font-size: 3rem; font-weight: bold; margin-top: 0.5rem; line-height: 1;">${totalAssets}</p>
        </div>
    `;

    // 2. BREAKDOWN RENDERING
    if (assetType !== "" && brand !== "") {
        html += renderSectionHTML("الحالة التشغيلية", statusStats, 'status', getStatusClassLocal);
        html += renderSectionHTML("أماكن التواجد", locationStats, 'location');
    }
    else if (assetType !== "") {
        html += renderSectionHTML("الماركات المتوفرة", brandStats, 'brand');
        html += renderSectionHTML("الحالة التشغيلية", statusStats, 'status', getStatusClassLocal);
        html += renderSectionHTML("أماكن التواجد", locationStats, 'location');
    }
    else if (brand !== "") {
        html += renderSectionHTML("أنواع الأصول لهذه الماركة", typeStats, 'asset');
        html += renderSectionHTML("الحالة التشغيلية", statusStats, 'status', getStatusClassLocal);
        html += renderSectionHTML("أماكن التواجد", locationStats, 'location');
    }
    else {
        html += renderSectionHTML("توزيع الأصول حسب النوع", typeStats, 'asset');
        html += renderSectionHTML("الحالة التشغيلية العامة", statusStats, 'status', getStatusClassLocal);
    }

    statisticsResults.innerHTML = html;
}

function renderSectionHTML(title, statsObj, iconType, classFunc = null) {
    let icon = 'fa-hashtag';
    if (iconType === 'status') icon = 'fa-shield-halved';
    if (iconType === 'location') icon = 'fa-location-dot';
    if (iconType === 'brand') icon = 'fa-tag';
    if (iconType === 'asset') icon = 'fa-box';

    let sectionHtml = `
        <div style="grid-column: 1 / -1; margin-top: 1.5rem; border-bottom: 2px solid var(--border-color); padding-bottom: 0.5rem; text-align: right;">
            <h3 style="font-size: 1.2rem; color: var(--primary); display: flex; align-items: center; gap: 0.5rem;">
                <i class="fa-solid ${icon}"></i> ${title}
            </h3>
        </div>
    `;

    for (const [key, count] of Object.entries(statsObj)) {
        const extraClass = classFunc ? classFunc(key) : '';
        const badgeSpan = classFunc ? `<span class="status-badge ${extraClass}" style="font-size:1.1rem; display:inline-block; padding: 0.25rem 0.75rem;">${key}</span>` : `<h4 style="margin: 0; font-size: 1.05rem;">${key}</h4>`;

        sectionHtml += `
            <div class="stat-card animate-fade-in">
                <div class="icon-wrapper tech-icon">
                    <i class="fa-solid ${icon}"></i>
                </div>
                <div style="margin-top: 0.5rem;">
                    ${badgeSpan}
                </div>
                <p style="font-size: 1.8rem; font-weight: bold; color: var(--text-dark); margin-top: 0.5rem;">${count}</p>
            </div>
        `;
    }
    return sectionHtml;
}

// --- Distribution Page Logic ---
function updateDistFilters() {
    if (globalData.length === 0) return;

    const assetTypes = [...new Set(globalData.map(row => row.assetType).filter(t => t && t !== "ID" && t !== "id"))].sort();
    const prevAssetType = distAssetType.value;
    
    distAssetType.innerHTML = '<option value="">الكل (جميع الأصول)</option>';
    assetTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        distAssetType.appendChild(option);
    });
    if (assetTypes.includes(prevAssetType)) {
        distAssetType.value = prevAssetType;
    } else {
        distAssetType.value = "";
    }

    updateDistBrandDropdown();
}

function updateDistBrandDropdown() {
    const selectedAssetType = distAssetType.value;
    const prevBrand = distBrand.value;

    const filteredForBrands = globalData.filter(row => {
        if(row.id === "ID" || row.id === "id") return false;
        return selectedAssetType === "" || row.assetType === selectedAssetType;
    });

    const brands = [...new Set(filteredForBrands.map(row => row.brand).filter(b => b))].sort();

    distBrand.innerHTML = '<option value="">الكل (جميع الماركات)</option>';
    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        distBrand.appendChild(option);
    });

    if (brands.includes(prevBrand)) {
        distBrand.value = prevBrand;
    } else {
        distBrand.value = "";
    }
}

function renderMatrixTable() {
    const matrixContainer = document.getElementById('matrixTableContainer');
    if (!matrixContainer) return;

    if (globalData.length === 0) {
        matrixContainer.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 2rem;">لا توجد بيانات كافية لإنشاء جدول التوزيع.</div>';
        return;
    }

    const branch = distBranch.value;
    const school = distSchool.value;
    const assetType = distAssetType.value;
    const brand = distBrand.value;

    const locations = [
        { branch: 'بنين', school: 'ابتدائي', label: 'بنين - ابتدائي' },
        { branch: 'بنين', school: 'متوسطة', label: 'بنين - متوسطة' },
        { branch: 'بنين', school: 'ثانوي', label: 'بنين - ثانوي' },
        { branch: 'بنين', school: 'دبلوما أمريكية', label: 'بنين - دبلوما أمريكية' },
        { branch: 'بنين', school: 'الإدارة العامة', label: 'بنين - الإدارة العامة' },
        { branch: 'بنات', school: 'ابتدائي', label: 'بنات - ابتدائي' },
        { branch: 'بنات', school: 'متوسطة', label: 'بنات - متوسطة' },
        { branch: 'بنات', school: 'ثانوي', label: 'بنات - ثانوي' },
        { branch: 'بنات', school: 'دبلوما أمريكية', label: 'بنات - دبلوما أمريكية' },
        { branch: 'بنات', school: 'الإدارة العامة', label: 'بنات - الإدارة العامة' }
    ];

    let filteredLocations = locations.filter(loc => {
        const matchesBranch = branch === "" || loc.branch === branch;
        const matchesSchool = school === "" || loc.school === school;
        return matchesBranch && matchesSchool;
    });

    let assetTypes = [...new Set(globalData.map(row => row.assetType).filter(t => t && t !== "ID" && t !== "id"))].sort();
    if (assetType !== "") {
        assetTypes = assetTypes.filter(t => t === assetType);
    }

    if (filteredLocations.length === 0 || assetTypes.length === 0) {
        matrixContainer.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 2rem; background-color: var(--card-bg); border-radius: var(--border-radius); box-shadow: var(--shadow);">لا توجد أصول مسجلة تطابق هذه التصفية لجدول التوزيع.</div>';
        return;
    }

    let html = `
        <div class="table-container animate-fade-in" style="margin-top: 2rem; border: 1px solid var(--border-color); box-shadow: var(--shadow);">
            <div style="padding: 1.5rem; border-bottom: 1px solid var(--border-color); background-color: var(--card-bg); text-align: right;">
                <h3 style="font-size: 1.2rem; color: var(--primary); display: flex; align-items: center; gap: 0.5rem; margin: 0;">
                    <i class="fa-solid fa-table-cells"></i> جدول توزيع الأصول التفصيلي
                </h3>
                <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem; color: var(--text-muted);">يوضح هذا الجدول أعداد الأصول الإجمالية في جميع فروع وأقسام المدرسة حسب التصفية الحالية.</p>
            </div>
            <div style="overflow-x: auto; max-width: 100%;">
                <table style="width: 100%; border-collapse: collapse; min-width: 800px;">
                    <thead>
                        <tr>
                            <th style="position: sticky; right: 0; background-color: #f8fafc; z-index: 10; border-left: 2px solid var(--border-color); font-weight: 800; color: var(--text-main); text-align: right;">القسم / الفرع</th>
    `;

    assetTypes.forEach(type => {
        html += `<th style="text-align: center; font-weight: 700;">${type}</th>`;
    });

    html += `
                            <th style="text-align: center; font-weight: 800; background-color: #f1f5f9; color: var(--primary);">إجمالي الفرع</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    const colTotals = {};
    assetTypes.forEach(t => colTotals[t] = 0);
    let grandTotal = 0;

    filteredLocations.forEach((loc, index) => {
        const locRows = globalData.filter(row => {
            if(row.id === "ID" || row.id === "id") return false;
            const matchesLoc = row.branch === loc.branch && row.school === loc.school;
            const matchesBrand = brand === "" || (row.brand && String(row.brand).toLowerCase() === brand.toLowerCase());
            return matchesLoc && matchesBrand;
        });

        const rowCounts = {};
        let rowTotal = 0;

        assetTypes.forEach(type => {
            const sum = locRows
                .filter(row => row.assetType === type)
                .reduce((acc, row) => acc + (parseInt(row.quantity) || 1), 0);
            rowCounts[type] = sum;
            rowTotal += sum;
            colTotals[type] += sum;
        });

        grandTotal += rowTotal;

        const rowBg = index % 2 === 0 ? '#ffffff' : '#f8fafc';

        html += `
            <tr style="background-color: ${rowBg};">
                <td style="position: sticky; right: 0; background-color: ${rowBg}; z-index: 5; border-left: 2px solid var(--border-color); font-weight: bold; text-align: right;">${loc.label}</td>
        `;

        assetTypes.forEach(type => {
            const count = rowCounts[type];
            const displayCount = count > 0 ? `<strong>${count}</strong>` : `<span style="color: #cbd5e1;">0</span>`;
            html += `<td style="text-align: center; font-size: 0.95rem;">${displayCount}</td>`;
        });

        html += `
                <td style="text-align: center; font-weight: 800; background-color: #f1f5f9; color: var(--primary);">${rowTotal}</td>
            </tr>
        `;
    });

    html += `
        <tr style="background-color: #e2e8f0; font-weight: bold; border-top: 2px solid var(--text-muted);">
            <td style="position: sticky; right: 0; background-color: #e2e8f0; z-index: 5; border-left: 2px solid var(--border-color); font-weight: 800; text-align: right;">الإجمالي الكلي</td>
    `;

    assetTypes.forEach(type => {
        html += `<td style="text-align: center; font-size: 1rem; color: var(--text-main); font-weight: 800;">${colTotals[type]}</td>`;
    });

    html += `
            <td style="text-align: center; font-size: 1.1rem; font-weight: 900; background-color: var(--primary); color: white;">${grandTotal}</td>
        </tr>
    `;

    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;

    matrixContainer.innerHTML = html;
}

// --- Event Listeners ---
statBranch.addEventListener('change', renderStatistics);
statSchool.addEventListener('change', renderStatistics);
statAssetType.addEventListener('change', () => {
    updateStatBrandDropdown();
    renderStatistics();
});
statBrand.addEventListener('change', renderStatistics);

distBranch.addEventListener('change', renderMatrixTable);
distSchool.addEventListener('change', renderMatrixTable);
distAssetType.addEventListener('change', () => {
    updateDistBrandDropdown();
    renderMatrixTable();
});
distBrand.addEventListener('change', renderMatrixTable);

// ============================================================
// REPORTS PAGE LOGIC
// ============================================================

const reportType     = document.getElementById('reportType');
const reportBranch   = document.getElementById('reportBranch');
const reportSchool   = document.getElementById('reportSchool');
const reportRoomNo   = document.getElementById('reportRoomNo');
const reportRoomGroup= document.getElementById('reportRoomGroup');
const reportAssetType= document.getElementById('reportAssetType');
const reportStatus   = document.getElementById('reportStatus');
const printReportBtn = document.getElementById('printReportBtn');
const exportCsvBtn   = document.getElementById('exportCsvBtn');
const reportPreviewArea   = document.getElementById('reportPreviewArea');
const reportEmptyState    = document.getElementById('reportEmptyState');
const printableReport     = document.getElementById('printableReport');
const reportPreviewInfo   = document.getElementById('reportPreviewInfo');

// Populate asset types in the report filter dynamically from globalData
function updateReportFilters() {
    if (globalData.length === 0) return;
    const assetTypes = [...new Set(globalData.map(r => r.assetType).filter(t => t && t !== 'ID' && t !== 'id'))].sort();
    const prev = reportAssetType.value;
    reportAssetType.innerHTML = '<option value="">الكل (جميع الأصول)</option>';
    assetTypes.forEach(type => {
        const opt = document.createElement('option');
        opt.value = type;
        opt.textContent = type;
        reportAssetType.appendChild(opt);
    });
    if (assetTypes.includes(prev)) reportAssetType.value = prev;

    updateReportRoomDropdown();
}

function updateReportRoomDropdown() {
    if (globalData.length === 0) return;
    const branch = reportBranch.value;
    const school = reportSchool.value;
    const currentSelection = reportRoomNo.value;
    
    const relevantData = globalData.filter(row => {
        if(row.id === "ID" || row.id === "id" || !row.id) return false;
        const matchesBranch = branch === "" || row.branch === branch;
        const matchesSchool = school === "" || row.school === school;
        return matchesBranch && matchesSchool;
    });

    const rooms = [...new Set(relevantData.map(row => row.roomNo).filter(r => r))].sort();

    reportRoomNo.innerHTML = '<option value="">اختر الغرفة...</option>';
    rooms.forEach(room => {
        const option = document.createElement('option');
        option.value = room;
        option.textContent = room;
        reportRoomNo.appendChild(option);
    });

    if (rooms.includes(currentSelection)) {
        reportRoomNo.value = currentSelection;
    } else {
        reportRoomNo.value = "";
    }
}

// Event Listeners for report filters toggles
reportType.addEventListener('change', () => {
    if (reportType.value === 'room') {
        reportRoomGroup.classList.remove('hidden');
    } else {
        reportRoomGroup.classList.add('hidden');
    }
});

reportBranch.addEventListener('change', updateReportRoomDropdown);
reportSchool.addEventListener('change', updateReportRoomDropdown);

// Helper: build report document header HTML
function buildReportHeader(reportTitle, filtersSummary) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    return `
        <div class="report-doc-header">
            <div class="report-doc-header-right">
                <div class="report-doc-logo">
                    <i class="fa-solid fa-school"></i>
                </div>
                <div class="report-doc-title-block">
                    <h2>${reportTitle}</h2>
                    <p>نظام جرد أصول المدرسة</p>
                </div>
            </div>
            <div class="report-doc-header-left">
                <div>📅 ${dateStr}</div>
                <div>🕒 ${timeStr}</div>
            </div>
        </div>
        <div class="report-filters-summary">
            <span style="font-weight:700; margin-left:0.5rem; color:#334155;">الفلاتر المطبقة:</span>
            ${filtersSummary}
        </div>
    `;
}

// Helper: build room report document header HTML
function buildRoomReportHeader(branchName, schoolName, roomNo, roomType, floor) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    return `
        <div class="report-doc-header" style="border-bottom: 3px solid var(--primary); padding-bottom: 1.5rem; margin-bottom: 2rem;">
            <div class="report-doc-header-right" style="display: flex; align-items: center; gap: 1.5rem;">
                <div class="report-doc-logo" style="width: 60px; height: 60px; background: linear-gradient(135deg, var(--primary), var(--secondary)); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; color: white;">
                    <i class="fa-solid fa-school"></i>
                </div>
                <div class="report-doc-title-block">
                    <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--primary); margin: 0;">تقرير جرد محتويات غرفة</h2>
                    <p style="margin: 0.25rem 0 0; font-size: 0.9rem; color: var(--text-muted); font-weight: 600;">نظام جرد أصول المدرسة</p>
                </div>
            </div>
            <div class="report-doc-header-left" style="text-align: left; font-size: 0.85rem; color: var(--text-muted); line-height: 1.8;">
                <div>📅 التاريخ: ${dateStr}</div>
                <div>🕒 الوقت: ${timeStr}</div>
            </div>
        </div>
        
        <div class="room-details-header" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; background-color: #f8fafc; border: 1px solid var(--border-color); border-radius: 12px; padding: 1.25rem; margin-bottom: 2rem; direction: rtl;">
            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.95rem; color: var(--text-main);">
                <i class="fa-solid fa-school" style="color: var(--primary); width: 20px;"></i>
                <strong>المرحلة:</strong> <span>${schoolName}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.95rem; color: var(--text-main);">
                <i class="fa-solid fa-code-branch" style="color: var(--primary); width: 20px;"></i>
                <strong>الفرع:</strong> <span>${branchName}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.95rem; color: var(--text-main);">
                <i class="fa-solid fa-door-open" style="color: var(--primary); width: 20px;"></i>
                <strong>رقم الغرفة:</strong> <span style="font-weight: 700; color: var(--primary);">${roomNo}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.95rem; color: var(--text-main);">
                <i class="fa-solid fa-circle-info" style="color: var(--primary); width: 20px;"></i>
                <strong>نوع المكان:</strong> <span>${roomType}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.95rem; color: var(--text-main);">
                <i class="fa-solid fa-layer-group" style="color: var(--primary); width: 20px;"></i>
                <strong>الدور:</strong> <span>${floor}</span>
            </div>
        </div>
    `;
}

// Helper: get filtered report data based on current filter selections
function getReportData() {
    const branch = reportBranch.value;
    const school = reportSchool.value;
    const assetT = reportAssetType.value;
    const status = reportStatus.value;
    const roomNo = reportRoomNo.value;
    const type   = reportType.value;

    return globalData.filter(row => {
        if (row.id === 'ID' || row.id === 'id' || !row.id) return false;
        const mBranch  = branch  === '' || row.branch    === branch;
        const mSchool  = school  === '' || row.school    === school;
        const mAsset   = assetT  === '' || row.assetType === assetT;
        const mStatus  = status  === '' || row.status    === status;
        const mRoom    = type !== 'room' || roomNo === '' || (row.roomNo && String(row.roomNo) === String(roomNo));
        return mBranch && mSchool && mAsset && mStatus && mRoom;
    });
}

// Helper: build a filter tag badge
function filterTag(icon, label, value) {
    const display = value === '' ? 'الكل' : value;
    return `<span class="report-filter-tag"><i class="fa-solid ${icon}"></i> ${label}: ${display}</span>`;
}

// Build status badge for the report table
function statusBadge(status) {
    const cls = getStatusClass(status || '');
    return `<span class="status-badge ${cls}" style="font-size:0.8rem;">${status || '-'}</span>`;
}

// ---- RENDER REPORT ----
window.renderReport = function() {
    if (globalData.length === 0) {
        showToast('يرجى تحميل البيانات أولاً من صفحة البحث والتحليل', 'error');
        return;
    }

    const type   = reportType.value;
    const branch = reportBranch.value;
    const school = reportSchool.value;
    const assetT = reportAssetType.value;
    const status = reportStatus.value;
    const roomNo = reportRoomNo.value;

    let filtersSummaryHtml =
        filterTag('code-branch', 'الفرع', branch) +
        filterTag('school', 'المرحلة', school) +
        filterTag('box', 'نوع الأصل', assetT) +
        filterTag('shield-halved', 'الحالة', status);

    if (type === 'room') {
        filtersSummaryHtml += filterTag('door-open', 'الغرفة', roomNo);
    }

    let reportData = getReportData();
    let html = '';

    // ---- REPORT TYPE: FULL INVENTORY ----
    if (type === 'full') {
        // Maintenance report auto-overrides status filter
        const reportTitle = 'كشف الجرد الكامل للأصول';
        const header = buildReportHeader(reportTitle, filtersSummaryHtml);

        // Summary cards
        const totalItems = reportData.length;
        const totalQty   = reportData.reduce((acc, r) => acc + (parseInt(r.quantity) || 1), 0);
        const uniqueTypes= new Set(reportData.map(r => r.assetType)).size;
        const uniqueRooms= new Set(reportData.map(r => r.roomNo)).size;

        const summaryCards = `
            <div class="report-summary-cards">
                <div class="report-summary-card">
                    <div class="count">${totalItems}</div>
                    <div class="label">عدد السجلات</div>
                </div>
                <div class="report-summary-card">
                    <div class="count">${totalQty}</div>
                    <div class="label">إجمالي الكميات</div>
                </div>
                <div class="report-summary-card">
                    <div class="count">${uniqueTypes}</div>
                    <div class="label">أنواع الأصول</div>
                </div>
                <div class="report-summary-card">
                    <div class="count">${uniqueRooms}</div>
                    <div class="label">غرف / أماكن</div>
                </div>
            </div>
        `;

        const rows = reportData.map(row => `
            <tr>
                <td>${row.branch || '-'}</td>
                <td>${row.school || '-'}</td>
                <td>${row.roomType || '-'}</td>
                <td>${row.floor || '-'}</td>
                <td><strong>${row.roomNo || '-'}</strong></td>
                <td>${row.assetType || '-'}</td>
                <td style="text-align:center;"><strong>${row.quantity || '1'}</strong></td>
                <td>${row.brand || '-'}</td>
                <td>${row.model || '-'}</td>
                <td style="font-family:monospace; font-size:0.8rem;">${row.serial || '-'}</td>
                <td>${statusBadge(row.status)}</td>
                <td style="font-size:0.78rem;">${row.date || '-'}</td>
            </tr>
        `).join('');

        const totalRow = `
            <tr>
                <td colspan="6" style="text-align:right; font-weight:800;">الإجمالي الكلي</td>
                <td style="text-align:center; font-weight:900;">${totalQty}</td>
                <td colspan="5"></td>
            </tr>
        `;

        html = header + summaryCards + `
            <h3 style="font-size:1.1rem; color:var(--primary); margin-bottom:1rem; border-right:4px solid var(--primary); padding-right:0.75rem;">
                <i class="fa-solid fa-list"></i> تفاصيل الأصول (${totalItems} سجل)
            </h3>
            <div style="overflow-x:auto;">
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>الفرع</th><th>المرحلة</th><th>المكان</th><th>الدور</th>
                            <th>الغرفة</th><th>نوع الأصل</th><th>الكمية</th>
                            <th>الماركة</th><th>الموديل</th><th>السيريال</th>
                            <th>الحالة</th><th>التاريخ</th>
                        </tr>
                    </thead>
                    <tbody>${rows || '<tr><td colspan="12" style="text-align:center;">لا توجد بيانات</td></tr>'}</tbody>
                    <tfoot>${totalRow}</tfoot>
                </table>
            </div>
        `;
    }

    // ---- REPORT TYPE: SUMMARY ----
    else if (type === 'summary') {
        const reportTitle = 'ملخص إجمالي الأصول';
        const header = buildReportHeader(reportTitle, filtersSummaryHtml);

        const typeStats = {};
        let grandTotal = 0;
        reportData.forEach(row => {
            const qty = parseInt(row.quantity) || 1;
            const t = row.assetType || 'غير محدد';
            typeStats[t] = (typeStats[t] || 0) + qty;
            grandTotal += qty;
        });

        const statusStats = {};
        reportData.forEach(row => {
            const qty = parseInt(row.quantity) || 1;
            const s = row.status || 'غير محدد';
            statusStats[s] = (statusStats[s] || 0) + qty;
        });

        const locationStats = {};
        reportData.forEach(row => {
            const qty = parseInt(row.quantity) || 1;
            const loc = `${row.branch || '-'} / ${row.school || '-'}`;
            locationStats[loc] = (locationStats[loc] || 0) + qty;
        });

        const buildSummaryTable = (title, stats, icon) => {
            const rows = Object.entries(stats).sort((a,b) => b[1]-a[1]).map(([k,v]) =>
                `<tr><td>${k}</td><td style="text-align:center; font-weight:800;">${v}</td><td style="text-align:center;">${Math.round(v/grandTotal*100)}%</td></tr>`
            ).join('');
            return `
                <h3 style="font-size:1rem; color:var(--primary); margin:1.5rem 0 0.75rem; border-right:4px solid var(--primary); padding-right:0.75rem;">
                    <i class="fa-solid ${icon}"></i> ${title}
                </h3>
                <table class="report-table" style="margin-bottom:1.5rem;">
                    <thead><tr><th>البيان</th><th style="text-align:center;">العدد</th><th style="text-align:center;">النسبة</th></tr></thead>
                    <tbody>${rows || '<tr><td colspan="3" style="text-align:center;">لا بيانات</td></tr>'}</tbody>
                    <tfoot><tr><td><strong>الإجمالي</strong></td><td style="text-align:center; font-weight:900;">${grandTotal}</td><td style="text-align:center;">100%</td></tr></tfoot>
                </table>
            `;
        };

        html = header +
            `<div class="report-summary-cards">
                <div class="report-summary-card">
                    <div class="count">${grandTotal}</div>
                    <div class="label">إجمالي الأصول</div>
                </div>
                <div class="report-summary-card">
                    <div class="count">${Object.keys(typeStats).length}</div>
                    <div class="label">أنواع مختلفة</div>
                </div>
                <div class="report-summary-card">
                    <div class="count">${reportData.length}</div>
                    <div class="label">عدد السجلات</div>
                </div>
            </div>` +
            buildSummaryTable('توزيع الأصول حسب النوع', typeStats, 'box') +
            buildSummaryTable('توزيع الأصول حسب الحالة', statusStats, 'shield-halved') +
            buildSummaryTable('توزيع الأصول حسب الفرع والمرحلة', locationStats, 'location-dot');
    }

    // ---- REPORT TYPE: MAINTENANCE ----
    else if (type === 'maintenance') {
        const reportTitle = 'تقرير الأصول التي تحتاج صيانة أو تالفة';
        // Override filter for maintenance: always show both statuses
        let mData = globalData.filter(row => {
            if (row.id === 'ID' || row.id === 'id' || !row.id) return false;
            const mBranch = reportBranch.value === '' || row.branch === reportBranch.value;
            const mSchool = reportSchool.value === '' || row.school === reportSchool.value;
            const mAsset  = reportAssetType.value === '' || row.assetType === reportAssetType.value;
            const isBad   = row.status === 'يحتاج صيانة' || row.status === 'تالف';
            return mBranch && mSchool && mAsset && isBad;
        });

        const header = buildReportHeader(reportTitle, filtersSummaryHtml);
        const maintenanceCount = mData.filter(r => r.status === 'يحتاج صيانة').length;
        const brokenCount      = mData.filter(r => r.status === 'تالف').length;

        const rows = mData.map(row => `
            <tr>
                <td>${row.branch || '-'}</td>
                <td>${row.school || '-'}</td>
                <td>${row.floor || '-'}</td>
                <td><strong>${row.roomNo || '-'}</strong></td>
                <td>${row.assetType || '-'}</td>
                <td style="text-align:center;">${row.quantity || '1'}</td>
                <td>${row.brand || '-'}</td>
                <td>${row.serial || '-'}</td>
                <td>${statusBadge(row.status)}</td>
            </tr>
        `).join('');

        html = header + `
            <div class="report-summary-cards">
                <div class="report-summary-card">
                    <div class="count" style="color:#f59e0b;">${maintenanceCount}</div>
                    <div class="label">يحتاج صيانة</div>
                </div>
                <div class="report-summary-card">
                    <div class="count" style="color:#ef4444;">${brokenCount}</div>
                    <div class="label">تالف</div>
                </div>
                <div class="report-summary-card">
                    <div class="count">${mData.length}</div>
                    <div class="label">إجمالي السجلات</div>
                </div>
            </div>
            <h3 style="font-size:1.1rem; color:#ef4444; margin-bottom:1rem; border-right:4px solid #ef4444; padding-right:0.75rem;">
                <i class="fa-solid fa-triangle-exclamation"></i> قائمة الأصول المتضررة (${mData.length} سجل)
            </h3>
            <div style="overflow-x:auto;">
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>الفرع</th><th>المرحلة</th><th>الدور</th><th>الغرفة</th>
                            <th>نوع الأصل</th><th>الكمية</th><th>الماركة</th><th>السيريال</th><th>الحالة</th>
                        </tr>
                    </thead>
                    <tbody>${rows || '<tr><td colspan="9" style="text-align:center; color:#10b981; font-weight:700;"><i class="fa-solid fa-check-circle"></i> لا توجد أصول تحتاج صيانة أو تالفة وفق هذه الفلاتر!</td></tr>'}</tbody>
                </table>
            </div>
        `;
    }

    // ---- REPORT TYPE: DISTRIBUTION MATRIX ----
    else if (type === 'distribution') {
        const reportTitle = 'جدول توزيع الأصول على الفروع والمراحل';
        const header = buildReportHeader(reportTitle, filtersSummaryHtml);

        const locations = [
            { branch: 'بنين', school: 'ابتدائي',        label: 'بنين - ابتدائي' },
            { branch: 'بنين', school: 'متوسطة',         label: 'بنين - متوسطة' },
            { branch: 'بنين', school: 'ثانوي',          label: 'بنين - ثانوي' },
            { branch: 'بنين', school: 'دبلوما أمريكية', label: 'بنين - دبلوما أمريكية' },
            { branch: 'بنين', school: 'الإدارة العامة', label: 'بنين - الإدارة العامة' },
            { branch: 'بنات', school: 'ابتدائي',        label: 'بنات - ابتدائي' },
            { branch: 'بنات', school: 'متوسطة',         label: 'بنات - متوسطة' },
            { branch: 'بنات', school: 'ثانوي',          label: 'بنات - ثانوي' },
            { branch: 'بنات', school: 'دبلوما أمريكية', label: 'بنات - دبلوما أمريكية' },
            { branch: 'بنات', school: 'الإدارة العامة', label: 'بنات - الإدارة العامة' },
        ];

        const branch = reportBranch.value;
        const school = reportSchool.value;
        const assetT = reportAssetType.value;

        const filteredLocs = locations.filter(loc =>
            (branch === '' || loc.branch === branch) &&
            (school === '' || loc.school === school)
        );

        let assetTypes = [...new Set(reportData.map(r => r.assetType).filter(t => t && t !== 'ID'))].sort();
        if (assetT !== '') assetTypes = assetTypes.filter(t => t === assetT);

        const colTotals = {};
        assetTypes.forEach(t => colTotals[t] = 0);
        let grandTotal = 0;

        const matrixRows = filteredLocs.map((loc, idx) => {
            const locRows = reportData.filter(r => r.branch === loc.branch && r.school === loc.school);
            let rowTotal = 0;
            const cells = assetTypes.map(t => {
                const sum = locRows.filter(r => r.assetType === t).reduce((a, r) => a + (parseInt(r.quantity)||1), 0);
                rowTotal += sum;
                colTotals[t] += sum;
                return `<td>${sum > 0 ? `<strong>${sum}</strong>` : '<span style="color:#cbd5e1;">0</span>'}</td>`;
            }).join('');
            grandTotal += rowTotal;
            const bg = idx % 2 === 0 ? '#fff' : '#f8fafc';
            return `<tr style="background-color:${bg};"><td style="font-weight:700;">${loc.label}</td>${cells}<td style="text-align:center; font-weight:900; color:var(--primary);">${rowTotal}</td></tr>`;
        }).join('');

        const footerCells = assetTypes.map(t => `<td>${colTotals[t]}</td>`).join('');

        html = header + `
            <div style="overflow-x:auto;">
                <table class="report-matrix-table">
                    <thead>
                        <tr>
                            <th>القسم / الفرع</th>
                            ${assetTypes.map(t => `<th>${t}</th>`).join('')}
                            <th>الإجمالي</th>
                        </tr>
                    </thead>
                    <tbody>${matrixRows || '<tr><td colspan="99" style="text-align:center;">لا توجد بيانات</td></tr>'}</tbody>
                    <tfoot>
                        <tr>
                            <td>الإجمالي الكلي</td>
                            ${footerCells}
                            <td>${grandTotal}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `;
    }
    
    // ---- REPORT TYPE: ROOM INVENTORY ----
    else if (type === 'room') {
        if (!roomNo) {
            showToast('يرجى اختيار الغرفة أولاً لمعاينة تقرير الغرفة المحددة', 'error');
            return;
        }

        const branchName = reportData[0]?.branch || branch || 'الكل';
        const schoolName = reportData[0]?.school || school || 'الكل';
        const roomTypeName = reportData[0]?.roomType || 'غير محدد';
        const floorName = reportData[0]?.floor || 'غير محدد';

        const header = buildRoomReportHeader(branchName, schoolName, roomNo, roomTypeName, floorName);

        const rows = reportData.map((row, index) => `
            <tr>
                <td style="text-align:center;">${index + 1}</td>
                <td><strong>${row.assetType || '-'}</strong></td>
                <td>${row.brand || '-'}</td>
                <td>${row.model || '-'}</td>
                <td style="font-family:monospace; font-size:0.85rem;">${row.serial || '-'}</td>
                <td>${statusBadge(row.status)}</td>
                <td style="text-align:center; font-weight:800;">${row.quantity || '1'}</td>
            </tr>
        `).join('');

        const totalQty = reportData.reduce((acc, r) => acc + (parseInt(r.quantity) || 1), 0);
        const totalRow = `
            <tr>
                <td colspan="6" style="text-align:left; font-weight:800;">الإجمالي الكلي للأصول في الغرفة</td>
                <td style="text-align:center; font-weight:900; font-size:1.1rem; color:var(--primary);">${totalQty}</td>
            </tr>
        `;

        const tableHtml = `
            <h3 style="font-size:1.1rem; color:var(--primary); margin-bottom:1rem; border-right:4px solid var(--primary); padding-right:0.75rem;">
                <i class="fa-solid fa-list-check"></i> الأصول المتواجدة في الغرفة (${reportData.length} سجل)
            </h3>
            <div style="overflow-x:auto;">
                <table class="report-table">
                    <thead>
                        <tr>
                            <th style="width: 50px; text-align:center;">م</th>
                            <th>نوع الأصل</th>
                            <th>الماركة</th>
                            <th>الموديل</th>
                            <th>السيريال</th>
                            <th>الحالة</th>
                            <th style="width: 80px; text-align:center;">الكمية</th>
                        </tr>
                    </thead>
                    <tbody>${rows || '<tr><td colspan="7" style="text-align:center;">لا توجد أصول مسجلة في هذه الغرفة</td></tr>'}</tbody>
                    <tfoot>${totalRow}</tfoot>
                </table>
            </div>
        `;

        const signaturesHtml = `
            <div class="report-signatures-section" style="margin-top: 3.5rem; display: flex; justify-content: space-between; gap: 3rem; direction: rtl;">
                <div class="signature-box" style="flex: 1; border: 1px dashed var(--border-color); border-radius: 12px; padding: 1.25rem; text-align: center; background-color: #fafafa;">
                    <h4 style="margin-bottom: 2rem; color: var(--text-main); font-weight: 700;">مسؤول العهدة</h4>
                    <p style="border-top: 1px solid var(--text-muted); width: 80%; margin: 1rem auto 0 auto; padding-top: 0.5rem; font-size: 0.9rem; color: var(--text-muted);">التوقيع: ............................</p>
                </div>
                <div class="signature-box" style="flex: 1; border: 1px dashed var(--border-color); border-radius: 12px; padding: 1.25rem; text-align: center; background-color: #fafafa;">
                    <h4 style="margin-bottom: 2rem; color: var(--text-main); font-weight: 700;">قائد المدرسة / مدير الفرع</h4>
                    <p style="border-top: 1px solid var(--text-muted); width: 80%; margin: 1rem auto 0 auto; padding-top: 0.5rem; font-size: 0.9rem; color: var(--text-muted);">التوقيع: ............................</p>
                </div>
            </div>
        `;

        html = header + tableHtml + signaturesHtml;
    }

    // Footer
    html += `
        <div class="report-doc-footer">
            <span>نظام جرد أصول المدرسة &copy; ${new Date().getFullYear()}</span>
            <span>تم إنشاء هذا التقرير تلقائياً بتاريخ: ${new Date().toLocaleDateString('ar-EG')}</span>
        </div>
    `;

    // Inject into DOM
    printableReport.innerHTML = html;
    reportPreviewArea.classList.remove('hidden');
    reportEmptyState.classList.add('hidden');

    // Update toolbar info
    const typeLabels = { full: 'كشف الجرد الكامل', summary: 'ملخص إجمالي الأصول', maintenance: 'الأصول المتضررة', distribution: 'جدول التوزيع', room: 'تقرير جرد الغرفة' };
    reportPreviewInfo.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#a5f3fc;"></i> تم إنشاء التقرير: <strong>${typeLabels[type] || ''}</strong>`;

    // Enable buttons
    printReportBtn.disabled = false;
    exportCsvBtn.disabled = false;

    // Scroll to preview
    reportPreviewArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// ---- PRINT ----
window.printReport = function() {
    if (!printableReport || printableReport.innerHTML.trim() === '') {
        showToast('يرجى معاينة التقرير أولاً', 'error');
        return;
    }
    window.print();
};

// ---- EXPORT CSV ----
window.exportCSV = function() {
    if (globalData.length === 0) {
        showToast('لا توجد بيانات للتصدير', 'error');
        return;
    }

    const type    = reportType.value;
    const branch  = reportBranch.value;
    const school  = reportSchool.value;
    const assetT  = reportAssetType.value;
    const status  = reportStatus.value;

    let reportData;
    let csvRows = [];
    let filename = 'تقرير_الأصول';

    if (type === 'room') {
        if (!reportRoomNo.value) {
            showToast('يرجى اختيار الغرفة أولاً لتصدير تقرير الغرفة المحددة', 'error');
            return;
        }
        reportData = getReportData();
        filename = `تقرير_جرد_الغرفة_${reportRoomNo.value}`;
    } else if (type === 'maintenance') {
        reportData = globalData.filter(row => {
            if (row.id === 'ID' || row.id === 'id' || !row.id) return false;
            const mBranch = branch === '' || row.branch === branch;
            const mSchool = school === '' || row.school === school;
            const mAsset  = assetT  === '' || row.assetType === assetT;
            const isBad   = row.status === 'يحتاج صيانة' || row.status === 'تالف';
            return mBranch && mSchool && mAsset && isBad;
        });
        filename = 'تقرير_الأصول_المتضررة';
    } else {
        reportData = getReportData();
    }

    if (type === 'room') {
        // Room inventory export format
        csvRows.push(['م', 'نوع الأصل', 'الماركة', 'الموديل', 'الرقم التسلسلي', 'الحالة', 'الكمية']);
        reportData.forEach((row, idx) => {
            csvRows.push([
                idx + 1,
                row.assetType || '',
                row.brand || '',
                row.model || '',
                row.serial || '',
                row.status || '',
                row.quantity || '1'
            ]);
        });
    } else if (type === 'summary') {
        // Summary report: export type totals
        filename = 'ملخص_الأصول';
        const typeStats = {};
        reportData.forEach(row => {
            const qty = parseInt(row.quantity) || 1;
            const t = row.assetType || 'غير محدد';
            typeStats[t] = (typeStats[t] || 0) + qty;
        });
        csvRows.push(['نوع الأصل', 'الإجمالي']);
        Object.entries(typeStats).sort((a,b)=>b[1]-a[1]).forEach(([k,v]) => csvRows.push([k, v]));
    } else if (type === 'distribution') {
        // Distribution: export matrix
        filename = 'جدول_توزيع_الأصول';
        const assetTypes = [...new Set(reportData.map(r => r.assetType).filter(t => t && t !== 'ID'))].sort();
        const locations = [
            { branch: 'بنين', school: 'ابتدائي', label: 'بنين - ابتدائي' },
            { branch: 'بنين', school: 'متوسطة', label: 'بنين - متوسطة' },
            { branch: 'بنين', school: 'ثانوي', label: 'بنين - ثانوي' },
            { branch: 'بنين', school: 'دبلوما أمريكية', label: 'بنين - دبلوما أمريكية' },
            { branch: 'بنين', school: 'الإدارة العامة', label: 'بنين - الإدارة العامة' },
            { branch: 'بنات', school: 'ابتدائي', label: 'بنات - ابتدائي' },
            { branch: 'بنات', school: 'متوسطة', label: 'بنات - متوسطة' },
            { branch: 'بنات', school: 'ثانوي', label: 'بنات - ثانوي' },
            { branch: 'بنات', school: 'دبلوما أمريكية', label: 'بنات - دبلوما أمريكية' },
            { branch: 'بنات', school: 'الإدارة العامة', label: 'بنات - الإدارة العامة' },
        ].filter(loc => (branch === '' || loc.branch === branch) && (school === '' || loc.school === school));

        csvRows.push(['القسم / الفرع', ...assetTypes, 'الإجمالي']);
        const colTotals = {};
        assetTypes.forEach(t => colTotals[t] = 0);
        let grandTotal = 0;
        locations.forEach(loc => {
            const locRows = reportData.filter(r => r.branch === loc.branch && r.school === loc.school);
            let rowTotal = 0;
            const cells = assetTypes.map(t => {
                const sum = locRows.filter(r => r.assetType === t).reduce((a, r) => a + (parseInt(r.quantity)||1), 0);
                rowTotal += sum;
                colTotals[t] += sum;
                return sum;
            });
            grandTotal += rowTotal;
            csvRows.push([loc.label, ...cells, rowTotal]);
        });
        csvRows.push(['الإجمالي الكلي', ...assetTypes.map(t => colTotals[t]), grandTotal]);
    } else {
        // Full / Maintenance: export all rows
        csvRows.push(['الفرع', 'المرحلة', 'نوع المكان', 'الدور', 'الغرفة', 'نوع الأصل', 'الكمية', 'الماركة', 'الموديل', 'السيريال', 'الحالة', 'التاريخ']);
        reportData.forEach(row => {
            csvRows.push([
                row.branch || '', row.school || '', row.roomType || '', row.floor || '',
                row.roomNo || '', row.assetType || '', row.quantity || '1',
                row.brand || '', row.model || '', row.serial || '', row.status || '', row.date || ''
            ]);
        });
    }

    // Build CSV string (with UTF-8 BOM for Arabic Excel compatibility)
    const csvContent = '\uFEFF' + csvRows.map(row =>
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toLocaleDateString('en-CA')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('تم تصدير الملف بنجاح! يمكن فتحه في Excel', 'success');
};

// --- Wire up: when navigating to reports, populate filters ---
const _origNavigateTo = window.navigateTo;
window.navigateTo = function(targetId) {
    _origNavigateTo(targetId);
    if (targetId === 'reports' && globalData.length > 0) {
        updateReportFilters();
    } else if (targetId === 'reports' && globalData.length === 0) {
        fetchData().then(() => updateReportFilters());
    }
};

