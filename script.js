// --- Configuration ---
// يرجى استبدال الرابط أدناه بالرابط الخاص بـ Web App بعد نشر Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbxlnLVidV9PvKBIxhbKxO60gpIHVFg7SHVWR5TFPIhtsHggphk-jsEwq62L65XkeuMW8Q/exec"; 

// --- Data Definitions ---

const assetBrands = {
    "كمبيوتر": ["Dell", "Hp", "Premum", "Compaq", "laptop", "Taplet"],
    "بروجيكتور": ["Sharp", "Infocus", "Sony"],
    "أنظمة معامل": ["DBS", "DTS"],
    "طابعة ألوان": ["Hp Pro 300", "HP Cp1525n",],
    "طابعة أبيض وأسود": ["P2035", "P1005", "P1006","P1102","P2025"],
    "آلة تصوير": ["كانون", "كيوسيرا","توشيبا"],
    " شاشة كمبيوتر": ["]Dell", "hp","Samsung"],
   " شاشة تلبفزيوبنة": ["Dansat", "Mando","Samsung"," Wansa"],
    "سبورة": ["تفاعلية", "عادية", "متحركة", "بيضاء منسدلة"],
    "لوحة وبرية": ["صغيرة","كبيرة"],
    "مكيف": ["LG", "Media", "Hair","Smart"," Gaint"," Crown"," Top-Tech","Plasma","Hammer","Dankin","TIT","Bancool","StarWay"],
    "طاولة": ["طاولة طالب", "طاولة اجتماعات", "طاولة دائرية","طاولة ضيافة","طاولة ريبوت","طاولة كمبيوتر","طاولة معمل"],
    "مكتب": ["مكتب بملحق", "مكتب بدون ملحق"],
    "كرسي": ["كرسي معلم دوار", "كرسي معلم ثابت","كرسي طالب","كرسي معمل","كرسي مرسم","كرسي مصادر","كرسي استقبال","كنبة استقبال"],
    "سماعة": ["Qomo", "Edis", "Supper","Matrix","متحركة","مكتبية","اذاعية","سماعات كبيرة"], 
    "ماسح ضوئي": ["Hp", "Canon", "Epson"],
    "دولاب": ["دولاب زجاج بخزنة", "دولاب خشب","دولاب حديد بخزنة","دولاب خشب ارفف","دولاب جرار","دولاب ارفف"],
    "كاميرا مراقبة": ["Hikvision", "Dahua"],
    "كبينة نت": ["كبيرة","صغيرة"],
    "إذاعة مدرسية": ["اذاعة"],
    " ساعة حائط": ["ساعة حائط"],
    "دروع مدرسية": ["درع"],
     "برواز حائط": ["برواز"],
    "ثلاجة": ["صغيرة","كبيرة"],
    "برادة مياه": ["برادة"],
    "جهاز بصمة": ["بصمة"],
    "سلة مهملات": ["سلة مهملات","جردل نظافة"],
    "ستائر": ["ستائر"],
    "حقيبة ادوات": ["حقيبة ادوات"],
    "صندوق": ["صندوق خشبي","خزنة","خزينة"],
    "ارفف كتب": ["ارفف كتب"],
    "حامل": ["حامل"],
    "ملحق مكتب": ["ملحق مكتب"],
    "كاميرا مراقبة": ["Hikvision","Dahua","E-Gaurde","View"],
    "DVR": ["HikVision","E-Gaurde"],
    "NVR": ["Hikvesion","E-Gaurde"],
    "Switch": ["8 Ports","16 Ports","24 Ports","48 Ports"],
    "Access Point": ["Linksysy","TP-Link","D-Link","Aruba"],
    "CD Player": ["CD Player"],
     "Robot": ["Robot Package"],
      "رياضة": ["طاولة تنس","طاولة كرة قدم","جهاز ممارسة المشي","جهاز ممارسة الجري","مرتبة رياضية","جهاز تمرين البطن"],
      "وسائل تعليمية": ["ميكروسكوب"],

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
    navLinks.forEach(link => {
        if (link.getAttribute('data-target') === targetId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    pageSections.forEach(section => {
        if (section.id === targetId) {
            section.classList.remove('hidden');
            section.classList.add('active');
            section.style.animation = 'none';
            section.offsetHeight;
            section.style.animation = null;
        } else {
            section.classList.add('hidden');
            section.classList.remove('active');
        }
    });

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
// --- Memory & Autofill Functions ---

window.resetAssetDetailsOnly = function() {
    // Clear asset type select
    const assetType = document.getElementById('assetType');
    if (assetType) {
        assetType.value = '';
        assetType.dispatchEvent(new Event('change'));
    }
    
    // Clear custom brand
    const customBrand = document.getElementById('customBrand');
    if (customBrand) {
        customBrand.value = '';
        customBrand.classList.add('hidden');
        customBrand.required = false;
    }
    
    // Clear brand select options
    brandSelect.innerHTML = '<option value="">اختر أو اكتب...</option>';
    
    // Clear other text fields
    const model = document.getElementById('model');
    if (model) model.value = '';
    
    const serial = document.getElementById('serial');
    if (serial) serial.value = '';
    
    const quantity = document.getElementById('quantity');
    if (quantity) quantity.value = '1';
    
    const description = document.getElementById('description');
    if (description) description.value = '';
};

window.fillAddAssetForm = function(data) {
    if (!data) return;
    
    const branch = document.getElementById('branch');
    if (branch && data.branch) {
        branch.value = data.branch;
        branch.dispatchEvent(new Event('change'));
    }
    
    const school = document.getElementById('school');
    if (school && data.school) {
        school.value = data.school;
        school.dispatchEvent(new Event('change'));
    }
    
    const roomType = document.getElementById('roomType');
    if (roomType && data.roomType) {
        roomType.value = data.roomType;
        roomType.dispatchEvent(new Event('change'));
    }
    
    const floor = document.getElementById('floor');
    if (floor && data.floor) {
        floor.value = data.floor;
        floor.dispatchEvent(new Event('change'));
    }
    
    const roomNo = document.getElementById('roomNo');
    if (roomNo && data.roomNo) roomNo.value = data.roomNo;
    
    const status = document.getElementById('status');
    if (status && data.status) {
        status.value = data.status;
        status.dispatchEvent(new Event('change'));
    }
    
    const assetType = document.getElementById('assetType');
    if (assetType && data.assetType) {
        assetType.value = data.assetType;
        assetType.dispatchEvent(new Event('change'));
    }
    
    const brand = document.getElementById('brand');
    const customBrand = document.getElementById('customBrand');
    if (brand && data.brand) {
        let optionExists = false;
        for (let i = 0; i < brand.options.length; i++) {
            if (brand.options[i].value === data.brand) {
                optionExists = true;
                break;
            }
        }
        
        if (optionExists) {
            brand.value = data.brand;
            brand.dispatchEvent(new Event('change'));
            if (customBrand) {
                customBrand.value = '';
                customBrand.classList.add('hidden');
                customBrand.required = false;
            }
        } else {
            brand.value = 'أخرى';
            brand.dispatchEvent(new Event('change'));
            if (customBrand) {
                customBrand.value = data.brand;
                customBrand.classList.remove('hidden');
                customBrand.required = true;
            }
        }
    }
    
    const model = document.getElementById('model');
    if (model && data.model) model.value = data.model;
    
    const quantity = document.getElementById('quantity');
    if (quantity && data.quantity) quantity.value = data.quantity;
    
    const serial = document.getElementById('serial');
    if (serial && data.serial) serial.value = data.serial;
    
    const description = document.getElementById('description');
    if (description && data.description) description.value = data.description;
};

window.restoreLocationFields = function() {
    const lastAssetStr = localStorage.getItem('last_asset');
    if (lastAssetStr) {
        try {
            const lastAsset = JSON.parse(lastAssetStr);
            
            const branch = document.getElementById('branch');
            if (branch && lastAsset.branch) {
                branch.value = lastAsset.branch;
                branch.dispatchEvent(new Event('change'));
            }
            
            const school = document.getElementById('school');
            if (school && lastAsset.school) {
                school.value = lastAsset.school;
                school.dispatchEvent(new Event('change'));
            }
            
            const roomType = document.getElementById('roomType');
            if (roomType && lastAsset.roomType) {
                roomType.value = lastAsset.roomType;
                roomType.dispatchEvent(new Event('change'));
            }
            
            const floor = document.getElementById('floor');
            if (floor && lastAsset.floor) {
                floor.value = lastAsset.floor;
                floor.dispatchEvent(new Event('change'));
            }
            
            const roomNo = document.getElementById('roomNo');
            if (roomNo && lastAsset.roomNo) roomNo.value = lastAsset.roomNo;
            
            const status = document.getElementById('status');
            if (status && lastAsset.status) {
                status.value = lastAsset.status;
                status.dispatchEvent(new Event('change'));
            }
        } catch (e) {
            console.error('Error parsing last_asset on load:', e);
        }
    }
};

assetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (API_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL" || API_URL === "") {
        showToast('يرجى إضافة رابط Google Apps Script أولاً في ملف script.js', 'error');
        return;
    }

    const formData = new FormData(assetForm);
    const data = Object.fromEntries(formData.entries());
    
    if (data.brand === "أخرى" || !data.brand) {
        data.brand = data.customBrand || "غير محدد";
    }

    data.date = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit' });
    data.id = "AST-" + Math.floor(Math.random() * 1000000);

    setLoading(true);

    try {
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        showToast('تم حفظ الأصل بنجاح!', 'success');
        
        // Save the full asset data to localStorage
        localStorage.setItem('last_asset', JSON.stringify(data));
        
        // Reset only the asset details, keeping location and status
        resetAssetDetailsOnly();
        
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
        tableBody.innerHTML = '<tr><td colspan="14" class="text-center empty-state"><div class="empty-icon"><i class="fa-solid fa-link-slash"></i></div><h3>لم يتم الربط بقاعدة البيانات</h3><p>يرجى إضافة رابط Google Apps Script في ملف script.js</p></td></tr>';
        return;
    }

    tableBody.innerHTML = '<tr><td colspan="14" class="text-center empty-state"><i class="fa-solid fa-spinner fa-spin fa-2x" style="color: var(--primary); margin-bottom:1rem;"></i><br>جاري تحميل البيانات...</td></tr>';
    
    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        
        if (result && result.data && result.data.length > 0) {
            globalData = result.data;
            updateRoomDropdown();
            updateStatFilters();
            updateDistFilters();
            applyFilters();
            if (typeof renderStatistics === 'function') renderStatistics();
            if (typeof renderMatrixTable === 'function') renderMatrixTable();
        } else {
            tableBody.innerHTML = '<tr><td colspan="14" class="text-center empty-state"><div class="empty-icon"><i class="fa-solid fa-inbox"></i></div><h3>لا توجد بيانات</h3><p>لم يتم تسجيل أي أصول في قاعدة البيانات حتى الآن.</p></td></tr>';
            globalData = [];
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        tableBody.innerHTML = '<tr><td colspan="14" class="text-center empty-state" style="color:var(--danger)"><div class="empty-icon"><i class="fa-solid fa-triangle-exclamation"></i></div><h3>خطأ في التحميل</h3><p>فشل في جلب البيانات. تأكد من صحة الرابط أو صلاحيات السكريبت.</p></td></tr>';
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
        tableBody.innerHTML = '<tr><td colspan="14" class="text-center empty-state"><h3>لم يتم العثور على نتائج مطابقة للبحث</h3></td></tr>';
        return;
    }

    data.forEach(row => {
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
            <td>${row.description || '-'}</td>
            <td><span class="status-badge ${getStatusClass(row.status)}">${row.status || '-'}</span></td>
            <td style="font-size: 0.85rem; color: var(--text-muted);">${row.date || '-'}</td>
            <td>
                <div class="action-btns">
                    <button class="action-btn action-btn-edit" title="تعديل" onclick="openEditModal('${row.id}')">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="action-btn action-btn-delete" title="حذف" onclick="openDeleteConfirm('${row.id}')">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </td>
        `;
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
        </td>
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
const reportFloor    = document.getElementById('reportFloor');
const reportFloorGroup= document.getElementById('reportFloorGroup');
const reportAssetType= document.getElementById('reportAssetType');
const reportBrand    = document.getElementById('reportBrand');
const reportStatus   = document.getElementById('reportStatus');
const printReportBtn = document.getElementById('printReportBtn');
const exportCsvBtn   = document.getElementById('exportCsvBtn');
const reportPreviewArea   = document.getElementById('reportPreviewArea');
const reportEmptyState    = document.getElementById('reportEmptyState');
const printableReport     = document.getElementById('printableReport');
const reportPreviewInfo   = document.getElementById('reportPreviewInfo');

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
    updateReportBrandDropdown();
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

function updateReportBrandDropdown() {
    if (globalData.length === 0) return;
    const selectedAssetType = reportAssetType.value;
    const prevBrand = reportBrand.value;

    const filteredForBrands = globalData.filter(row => {
        if(row.id === "ID" || row.id === "id") return false;
        return selectedAssetType === "" || row.assetType === selectedAssetType;
    });

    const brands = [...new Set(filteredForBrands.map(row => row.brand).filter(b => b))].sort();

    reportBrand.innerHTML = '<option value="">الكل (جميع الماركات)</option>';
    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        reportBrand.appendChild(option);
    });

    if (brands.includes(prevBrand)) {
        reportBrand.value = prevBrand;
    } else {
        reportBrand.value = "";
    }
}

reportType.addEventListener('change', () => {
    if (reportType.value === 'room') {
        reportRoomGroup.classList.remove('hidden');
        reportFloorGroup.classList.add('hidden');
    } else {
        reportRoomGroup.classList.add('hidden');
        reportFloorGroup.classList.remove('hidden');
    }
});

reportBranch.addEventListener('change', updateReportRoomDropdown);
reportSchool.addEventListener('change', updateReportRoomDropdown);
reportAssetType.addEventListener('change', updateReportBrandDropdown);

function buildReportHeader(reportTitle, filtersSummary) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    return `
        <div class="report-doc-header">
            <div class="report-doc-header-right">
                <div class="report-doc-logo" style="width: 60px; height: 60px; border-radius: 12px; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #ffffff; border: 1px solid var(--border-color); padding: 5px;">
                    <img src="Logo.png" style="max-width: 100%; max-height: 100%; object-fit: contain;" alt="Logo" />
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

function buildRoomReportHeader(branchName, schoolName, roomNo, roomType, floor) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    return `
        <div class="report-doc-header" style="border-bottom: 3px solid var(--primary); padding-bottom: 1.5rem; margin-bottom: 2rem;">
            <div class="report-doc-header-right" style="display: flex; align-items: center; gap: 1.5rem;">
                <div class="report-doc-logo" style="width: 60px; height: 60px; border-radius: 12px; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #ffffff; border: 1px solid var(--border-color); padding: 5px;">
                    <img src="Logo.png" style="max-width: 100%; max-height: 100%; object-fit: contain;" alt="Logo" />
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

function getReportData() {
    const branch = reportBranch.value;
    const school = reportSchool.value;
    const assetT = reportAssetType.value;
    const brand  = reportBrand.value;
    const status = reportStatus.value;
    const roomNo = reportRoomNo.value;
    const floor  = reportFloor.value;
    const type   = reportType.value;

    return globalData.filter(row => {
        if (row.id === 'ID' || row.id === 'id' || !row.id) return false;
        const mBranch  = branch  === '' || row.branch    === branch;
        const mSchool  = school  === '' || row.school    === school;
        const mAsset   = assetT  === '' || row.assetType === assetT;
        const mStatus  = status  === '' || row.status    === status;
        const mRoom    = type !== 'room' || roomNo === '' || (row.roomNo && String(row.roomNo) === String(roomNo));
        const mFloor   = type === 'room' || floor === '' || row.floor === floor;
        const mBrand   = brand  === '' || (row.brand && String(row.brand).toLowerCase() === brand.toLowerCase());
        return mBranch && mSchool && mAsset && mStatus && mRoom && mFloor && mBrand;
    });
}

function filterTag(icon, label, value) {
    const display = value === '' ? 'الكل' : value;
    return `<span class="report-filter-tag"><i class="fa-solid ${icon}"></i> ${label}: ${display}</span>`;
}

function statusBadge(status) {
    const cls = getStatusClass(status || '');
    return `<span class="status-badge ${cls}" style="font-size:0.8rem;">${status || '-'}</span>`;
}

window.renderReport = function() {
    if (globalData.length === 0) {
        showToast('يرجى تحميل البيانات أولاً من صفحة البحث والتحليل', 'error');
        return;
    }

    const type   = reportType.value;
    const branch = reportBranch.value;
    const school = reportSchool.value;
    const assetT = reportAssetType.value;
    const brand  = reportBrand.value;
    const status = reportStatus.value;
    const roomNo = reportRoomNo.value;
    const floor  = reportFloor.value;

    let filtersSummaryHtml =
        filterTag('code-branch', 'الفرع', branch) +
        filterTag('school', 'المرحلة', school) +
        filterTag('box', 'نوع الأصل', assetT) +
        filterTag('tag', 'الماركة', brand) +
        filterTag('shield-halved', 'الحالة', status);

    if (type === 'room') {
        filtersSummaryHtml += filterTag('door-open', 'الغرفة', roomNo);
    } else {
        filtersSummaryHtml += filterTag('layer-group', 'الدور', floor);
    }

    let reportData = getReportData();
    let html = '';

    if (type === 'full') {
        const reportTitle = 'كشف الجرد الكامل للأصول';
        const header = buildReportHeader(reportTitle, filtersSummaryHtml);

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
                    <tbody>${rows || '<tr><td colspan="12" style="text-align:center;">لا توجد بيانات</td>'}</tbody>
                    <tfoot>${totalRow}</tfoot>
                </table>
            </div>
        `;
    }

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
                `<tr><td style="text-align:right;">${k}</td><td style="text-align:center; font-weight:800;">${v}</td><td style="text-align:center;">${Math.round(v/grandTotal*100)}%</td></tr>`
            ).join('');
            return `
                <h3 style="font-size:1rem; color:var(--primary); margin:1.5rem 0 0.75rem; border-right:4px solid var(--primary); padding-right:0.75rem;">
                    <i class="fa-solid ${icon}"></i> ${title}
                </h3>
                <table class="report-table" style="margin-bottom:1.5rem;">
                    <thead><tr><th style="text-align:right;">البيان</th><th style="text-align:center;">العدد</th><th style="text-align:center;">النسبة</th></tr></thead>
                    <tbody>${rows || '<td><td colspan="3" style="text-align:center;">لا بيانات</td>'}</tbody>
                    <tfoot><td><strong>الإجمالي</strong></td><td style="text-align:center; font-weight:900;">${grandTotal}</td><td style="text-align:center;">100%</td></tr></tfoot>
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

    else if (type === 'maintenance') {
        const reportTitle = 'تقرير الأصول التي تحتاج صيانة أو تالفة';
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
                    <tbody>${rows || '<tr><td colspan="9" style="text-align:center; color:#10b981; font-weight:700;"><i class="fa-solid fa-check-circle"></i> لا توجد أصول تحتاج صيانة أو تالفة وفق هذه الفلاتر!</td>'}</tbody>
                </table>
            </div>
        `;
    }

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
                return `<td style="text-align:center;">${sum > 0 ? `<strong>${sum}</strong>` : '<span style="color:#cbd5e1;">0</span>'}</td>`;
            }).join('');
            grandTotal += rowTotal;
            const bg = idx % 2 === 0 ? '#fff' : '#f8fafc';
            return `<tr style="background-color:${bg};"><td style="font-weight:700; text-align:right;">${loc.label}</td>${cells}<td style="text-align:center; font-weight:900; color:var(--primary);">${rowTotal}</td></tr>`;
        }).join('');

        const footerCells = assetTypes.map(t => `<td style="text-align:center;">${colTotals[t]}</td>`).join('');

        html = header + `
            <div style="overflow-x:auto;">
                <table class="report-matrix-table">
                    <thead>
                        <tr>
                            <th style="text-align:right;">القسم / الفرع</th>
                            ${assetTypes.map(t => `<th style="text-align:center;">${t}</th>`).join('')}
                            <th style="text-align:center;">الإجمالي</th>
                        </tr>
                    </thead>
                    <tbody>${matrixRows || '<tr><td colspan="99" style="text-align:center;">لا توجد بيانات</td>'}</tbody>
                    <tfoot>
                        <tr>
                            <td style="text-align:right; font-weight:800;">الإجمالي الكلي</td>
                            ${footerCells}
                            <td style="text-align:center; font-weight:900; background-color:var(--primary); color:white;">${grandTotal}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `;
    }
    
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
                <td style="text-align:right;"><strong>${row.assetType || '-'}</strong></td>
                <td style="text-align:right;">${row.brand || '-'}</td>
                <td style="text-align:right;">${row.model || '-'}</td>
                <td style="font-family:monospace; font-size:0.85rem;">${row.serial || '-'}</td>
                <td style="text-align:center;">${statusBadge(row.status)}</td>
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
                            <th style="text-align:right;">نوع الأصل</th>
                            <th style="text-align:right;">الماركة</th>
                            <th style="text-align:right;">الموديل</th>
                            <th style="text-align:right;">السيريال</th>
                            <th style="text-align:center;">الحالة</th>
                            <th style="width: 80px; text-align:center;">الكمية</th>
                        </tr>
                    </thead>
                    <tbody>${rows || '<tr><td colspan="7" style="text-align:center;">لا توجد أصول مسجلة في هذه الغرفة</td>'}</tbody>
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

    else if (type === 'asset_report') {
        if (!assetT) {
            showToast('يرجى اختيار نوع الأصل أولاً لمعاينة تقرير الأصل المخصص', 'error');
            return;
        }

        const brandText = brand ? ` (${brand})` : ' (جميع الماركات)';
        const reportTitle = `تقرير جرد أصل: ${assetT}${brandText}`;
        const header = buildReportHeader(reportTitle, filtersSummaryHtml);

        const totalItems = reportData.length;
        const totalQty   = reportData.reduce((acc, r) => acc + (parseInt(r.quantity) || 1), 0);
        const uniqueRooms= new Set(reportData.map(r => r.roomNo)).size;

        const summaryCards = `
            <div class="report-summary-cards">
                <div class="report-summary-card">
                    <div class="count">${totalQty}</div>
                    <div class="label">إجمالي الكمية</div>
                </div>
                <div class="report-summary-card">
                    <div class="count">${totalItems}</div>
                    <div class="label">عدد السجلات</div>
                </div>
                <div class="report-summary-card">
                    <div class="count">${uniqueRooms}</div>
                    <div class="label">غرف / مواقع متواجد فيها</div>
                </div>
            </div>
        `;

        const rows = reportData.map((row, index) => `
            <tr>
                <td style="text-align:center;">${index + 1}</td>
                <td style="text-align:right;">${row.branch || '-'}</td>
                <td style="text-align:right;">${row.school || '-'}</td>
                <td style="text-align:right;">${row.floor || '-'}</td>
                <td style="text-align:right;"><strong>${row.roomNo || '-'}</strong></td>
                <td style="text-align:right;">${row.brand || '-'}</td>
                <td style="text-align:right;">${row.model || '-'}</td>
                <td style="font-family:monospace; font-size:0.85rem;">${row.serial || '-'}</td>
                <td style="text-align:center;">${statusBadge(row.status)}</td>
                <td style="text-align:center; font-weight:800;">${row.quantity || '1'}</td>
             </tr>
        `).join('');

        const totalRow = `
            <tr>
                <td colspan="9" style="text-align:left; font-weight:800;">الإجمالي الكلي للكمية</td>
                <td style="text-align:center; font-weight:900; font-size:1.1rem; color:var(--primary);">${totalQty}</td>
            </tr>
        `;

        const tableHtml = `
            <h3 style="font-size:1.1rem; color:var(--primary); margin-bottom:1rem; border-right:4px solid var(--primary); padding-right:0.75rem;">
                <i class="fa-solid fa-list-check"></i> تفاصيل تواجد الأصل (${totalItems} سجل)
            </h3>
            <div style="overflow-x:auto;">
                <table class="report-table">
                    <thead>
                        <tr>
                            <th style="width: 50px; text-align:center;">م</th>
                            <th style="text-align:right;">الفرع</th>
                            <th style="text-align:right;">المرحلة</th>
                            <th style="text-align:right;">الدور</th>
                            <th style="text-align:right;">الغرفة</th>
                            <th style="text-align:right;">الماركة</th>
                            <th style="text-align:right;">الموديل</th>
                            <th style="text-align:right;">السيريال</th>
                            <th style="text-align:center;">الحالة</th>
                            <th style="width: 80px; text-align:center;">الكمية</th>
                        </tr>
                    </thead>
                    <tbody>${rows || '<tr><td colspan="10" style="text-align:center;">لا توجد أصول مسجلة تطابق هذه التصفية</td>'}</tbody>
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

        html = header + summaryCards + tableHtml + signaturesHtml;
    }

    html += `
        <div class="report-doc-footer">
            <span>نظام جرد أصول المدرسة &copy; ${new Date().getFullYear()}</span>
            <span>تم إنشاء هذا التقرير تلقائياً بتاريخ: ${new Date().toLocaleDateString('ar-EG')}</span>
        </div>
    `;

    printableReport.innerHTML = html;
    reportPreviewArea.classList.remove('hidden');
    reportEmptyState.classList.add('hidden');

    const typeLabels = { full: 'كشف الجرد الكامل', summary: 'ملخص إجمالي الأصول', maintenance: 'الأصول المتضررة', distribution: 'جدول التوزيع', room: 'تقرير جرد الغرفة', asset_report: 'تقرير جرد أصل مخصص' };
    reportPreviewInfo.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#a5f3fc;"></i> تم إنشاء التقرير: <strong>${typeLabels[type] || ''}</strong>`;

    printReportBtn.disabled = false;
    exportCsvBtn.disabled = false;

    reportPreviewArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

window.printReport = function() {
    if (!printableReport || printableReport.innerHTML.trim() === '') {
        showToast('يرجى معاينة التقرير أولاً', 'error');
        return;
    }
    window.print();
};

window.exportCSV = function() {
    if (globalData.length === 0) {
        showToast('لا توجد بيانات للتصدير', 'error');
        return;
    }

    const type    = reportType.value;
    const branch  = reportBranch.value;
    const school  = reportSchool.value;
    const assetT  = reportAssetType.value;
    const brand   = reportBrand.value;
    const status  = reportStatus.value;
    const floor   = reportFloor.value;

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
    } else if (type === 'asset_report') {
        if (!assetT) {
            showToast('يرجى اختيار نوع الأصل أولاً لتصدير تقرير الأصل المخصص', 'error');
            return;
        }
        reportData = getReportData();
        const brandText = brand ? `_${brand}` : '';
        filename = `تقرير_جرد_أصل_${assetT}${brandText}`;
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
    } else if (type === 'asset_report') {
        csvRows.push(['م', 'الفرع', 'المرحلة/المدرسة', 'الدور', 'الغرفة', 'الماركة', 'الموديل', 'الرقم التسلسلي', 'الحالة', 'الكمية']);
        reportData.forEach((row, idx) => {
            csvRows.push([
                idx + 1,
                row.branch || '',
                row.school || '',
                row.floor || '',
                row.roomNo || '',
                row.brand || '',
                row.model || '',
                row.serial || '',
                row.status || '',
                row.quantity || '1'
            ]);
        });
    } else if (type === 'summary') {
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
        csvRows.push(['الفرع', 'المرحلة', 'نوع المكان', 'الدور', 'الغرفة', 'نوع الأصل', 'الكمية', 'الماركة', 'الموديل', 'السيريال', 'الحالة', 'التاريخ']);
        reportData.forEach(row => {
            csvRows.push([
                row.branch || '', row.school || '', row.roomType || '', row.floor || '',
                row.roomNo || '', row.assetType || '', row.quantity || '1',
                row.brand || '', row.model || '', row.serial || '', row.status || '', row.date || ''
            ]);
        });
    }

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

const _origNavigateTo = window.navigateTo;
window.navigateTo = function(targetId) {
    _origNavigateTo(targetId);
    if (targetId === 'reports' && globalData.length > 0) {
        updateReportFilters();
    } else if (targetId === 'reports' && globalData.length === 0) {
        fetchData().then(() => updateReportFilters());
    }
};

// ============================================================
// EDIT ASSET FUNCTIONS - إضافة ميزة التعديل
// ============================================================

window.openEditModal = async function(assetId) {
    if (!globalData || globalData.length === 0) {
        showToast('البيانات لم يتم تحميلها بعد، يرجى تحديث البيانات أولاً', 'error');
        return;
    }
    
    const asset = globalData.find(item => String(item.id) === String(assetId));
    
    if (!asset) {
        showToast('لم يتم العثور على الأصل المطلوب', 'error');
        return;
    }
    
    document.getElementById('editAssetId').value = asset.id;
    document.getElementById('editAssetDate').value = asset.date || '';
    
    const editBranch = document.getElementById('editBranch');
    if (editBranch) editBranch.value = asset.branch || 'بنين';
    
    const editSchool = document.getElementById('editSchool');
    if (editSchool) editSchool.value = asset.school || 'ابتدائي';
    
    const editRoomType = document.getElementById('editRoomType');
    if (editRoomType) editRoomType.value = asset.roomType || 'فصل';
    
    const editFloor = document.getElementById('editFloor');
    if (editFloor) editFloor.value = asset.floor || 'الدور الأرضي';
    
    const editRoomNo = document.getElementById('editRoomNo');
    if (editRoomNo) editRoomNo.value = asset.roomNo || '';
    
    const editAssetType = document.getElementById('editAssetType');
    if (editAssetType) editAssetType.value = asset.assetType || '';
    
    const editQuantity = document.getElementById('editQuantity');
    if (editQuantity) editQuantity.value = asset.quantity || '1';
    
    const editBrand = document.getElementById('editBrand');
    if (editBrand) editBrand.value = asset.brand || '';
    
    const editModel = document.getElementById('editModel');
    if (editModel) editModel.value = asset.model || '';
    
    const editSerial = document.getElementById('editSerial');
    if (editSerial) editSerial.value = asset.serial || '';
    
    const editDescription = document.getElementById('editDescription');
    if (editDescription) editDescription.value = asset.description || '';
    
    const editStatus = document.getElementById('editStatus');
    if (editStatus) editStatus.value = asset.status || 'ممتاز';
    
    const modal = document.getElementById('editModal');
    if (modal) modal.classList.remove('hidden');
};

window.closeEditModal = function() {
    const modal = document.getElementById('editModal');
    if (modal) modal.classList.add('hidden');
    
    document.getElementById('editAssetId').value = '';
    document.getElementById('editAssetDate').value = '';
};

window.saveEdit = async function() {
    const assetId = document.getElementById('editAssetId').value;
    if (!assetId) {
        showToast('خطأ: لم يتم العثور على معرف الأصل', 'error');
        return;
    }
    
    const updatedData = {
        action: 'update',
        id: assetId,
        branch: document.getElementById('editBranch').value,
        school: document.getElementById('editSchool').value,
        roomType: document.getElementById('editRoomType').value,
        floor: document.getElementById('editFloor').value,
        roomNo: document.getElementById('editRoomNo').value,
        assetType: document.getElementById('editAssetType').value,
        quantity: document.getElementById('editQuantity').value,
        brand: document.getElementById('editBrand').value,
        model: document.getElementById('editModel').value,
        serial: document.getElementById('editSerial').value,
        description: document.getElementById('editDescription').value,
        status: document.getElementById('editStatus').value,
        date: document.getElementById('editAssetDate').value || new Date().toISOString()
    };
    
    const saveBtn = document.getElementById('saveEditBtn');
    const btnText = saveBtn.querySelector('.btn-text');
    const editSpinner = document.getElementById('editSpinner');
    
    saveBtn.disabled = true;
    btnText.textContent = 'جاري الحفظ...';
    if (editSpinner) editSpinner.classList.remove('hidden');
    
    try {
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });
        
        showToast('تم تعديل الأصل بنجاح!', 'success');
        closeEditModal();
        
        globalData = [];
        await fetchData();
        
        if (typeof renderStatistics === 'function') renderStatistics();
        if (typeof renderMatrixTable === 'function') renderMatrixTable();
        
    } catch (error) {
        console.error('Error updating asset:', error);
        showToast('حدث خطأ أثناء تعديل الأصل', 'error');
    } finally {
        saveBtn.disabled = false;
        btnText.textContent = 'حفظ التعديلات';
        if (editSpinner) editSpinner.classList.add('hidden');
    }
};

// ============================================================
// DELETE ASSET FUNCTIONS - إضافة ميزة الحذف
// ============================================================

window.openDeleteConfirm = function(assetId) {
    if (!globalData || globalData.length === 0) {
        showToast('البيانات لم يتم تحميلها بعد', 'error');
        return;
    }
    
    const asset = globalData.find(item => String(item.id) === String(assetId));
    
    if (!asset) {
        showToast('لم يتم العثور على الأصل', 'error');
        return;
    }
    
    document.getElementById('deleteAssetId').value = asset.id;
    const deleteInfo = document.getElementById('deleteAssetInfo');
    if (deleteInfo) {
        deleteInfo.innerHTML = `${asset.assetType || 'أصل'} - ${asset.brand || ''} (الغرفة: ${asset.roomNo || 'غير محدد'})`;
    }
    
    const modal = document.getElementById('deleteModal');
    if (modal) modal.classList.remove('hidden');
};

window.closeDeleteModal = function() {
    const modal = document.getElementById('deleteModal');
    if (modal) modal.classList.add('hidden');
    document.getElementById('deleteAssetId').value = '';
};

window.confirmDelete = async function() {
    const assetId = document.getElementById('deleteAssetId').value;
    if (!assetId) {
        showToast('خطأ في معرف الأصل', 'error');
        return;
    }
    
    const deleteBtn = document.getElementById('confirmDeleteBtn');
    const btnText = deleteBtn.querySelector('.btn-text');
    const deleteSpinner = document.getElementById('deleteSpinner');
    
    deleteBtn.disabled = true;
    btnText.textContent = 'جاري الحذف...';
    if (deleteSpinner) deleteSpinner.classList.remove('hidden');
    
    try {
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'delete',
                id: assetId
            })
        });
        
        showToast('تم حذف الأصل بنجاح!', 'success');
        closeDeleteModal();
        
        globalData = [];
        await fetchData();
        
        if (typeof renderStatistics === 'function') renderStatistics();
        if (typeof renderMatrixTable === 'function') renderMatrixTable();
        
    } catch (error) {
        console.error('Error deleting asset:', error);
        showToast('حدث خطأ أثناء حذف الأصل', 'error');
    } finally {
        deleteBtn.disabled = false;
        btnText.textContent = 'حذف نهائي';
        if (deleteSpinner) deleteSpinner.classList.add('hidden');
    }
};

// ============================================================
// LOCATION FILTER FUNCTIONS - تصفية حسب الفصل أو المكتب
// ============================================================

function addLocationFilters() {
    const filtersCard = document.querySelector('#dashboard .filters');
    if (!filtersCard) return;
    
    if (document.getElementById('filterLocation')) return;
    
    const locationFilterHTML = `
        <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
            <div class="form-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
                <div class="form-group">
                    <label><i class="fa-solid fa-building"></i> تصفية حسب الموقع</label>
                    <select id="filterLocation">
                        <option value="">الكل (جميع المواقع)</option>
                        <option value="فصل">فصول دراسية فقط</option>
                        <option value="مكتب">مكاتب فقط</option>
                    </select>
                </div>
                <div class="form-group">
                    <label><i class="fa-solid fa-magnifying-glass-chart"></i> بحث مخصص في الموقع</label>
                    <input type="text" id="filterCustomLocation" placeholder="أدخل رقم الفصل أو اسم المكتب...">
                </div>
            </div>
        </div>
    `;
    
    filtersCard.insertAdjacentHTML('beforeend', locationFilterHTML);
    
    document.getElementById('filterLocation')?.addEventListener('change', applyFiltersWithLocation);
    document.getElementById('filterCustomLocation')?.addEventListener('input', applyFiltersWithLocation);
}

window.applyFiltersWithLocation = function() {
    if (globalData.length === 0) return;

    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const branch = document.getElementById('filterBranch')?.value || '';
    const school = document.getElementById('filterSchool')?.value || '';
    const status = document.getElementById('filterStatus')?.value || '';
    const roomNo = document.getElementById('filterRoomNo')?.value || '';
    const assetType = document.getElementById('filterAssetType')?.value || '';
    const locationType = document.getElementById('filterLocation')?.value || '';
    const customLocation = document.getElementById('filterCustomLocation')?.value.toLowerCase() || '';

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
        
        let matchesLocationType = true;
        if (locationType !== '') {
            if (locationType === 'فصل' && row.roomType !== 'فصل') matchesLocationType = false;
            if (locationType === 'مكتب' && row.roomType !== 'مكتب') matchesLocationType = false;
        }
        
        let matchesCustomLocation = true;
        if (customLocation !== '') {
            const roomNoMatch = row.roomNo && String(row.roomNo).toLowerCase().includes(customLocation);
            const roomTypeMatch = row.roomType && String(row.roomType).toLowerCase().includes(customLocation);
            if (!roomNoMatch && !roomTypeMatch) matchesCustomLocation = false;
        }

        return matchesSearch && matchesBranch && matchesSchool && matchesStatus && 
               matchesRoomNo && matchesAssetType && matchesLocationType && matchesCustomLocation;
    });

    renderTable(filteredData);
};

if (typeof window.originalApplyFilters === 'undefined') {
    window.originalApplyFilters = window.applyFilters;
    window.applyFilters = applyFiltersWithLocation;
}

const originalNavigateTo2 = window.navigateTo;
window.navigateTo = function(targetId) {
    originalNavigateTo2(targetId);
    if (targetId === 'dashboard') {
        setTimeout(addLocationFilters, 100);
    }
};

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addLocationFilters, 500);
});

// ============================================================
// CUSTOM SEARCHABLE SELECT COMPONENT
// ============================================================

function makeSearchableSelect(select) {
    if (!select || select.tagName !== 'SELECT') return;
    if (select.dataset.searchableInitialized) return;
    select.dataset.searchableInitialized = 'true';

    const wrapper = document.createElement('div');
    wrapper.className = 'custom-select-wrapper';
    
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);
    
    select.style.display = 'none';

    const trigger = document.createElement('div');
    trigger.className = 'custom-select-trigger';
    trigger.innerHTML = `<span></span><i class="fa-solid fa-chevron-down"></i>`;
    wrapper.appendChild(trigger);

    const dropdown = document.createElement('div');
    dropdown.className = 'custom-select-dropdown hidden';
    
    const searchInputSelect = document.createElement('input');
    searchInputSelect.type = 'text';
    searchInputSelect.className = 'custom-select-search';
    searchInputSelect.placeholder = 'ابحث هنا...';
    dropdown.appendChild(searchInputSelect);

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'custom-select-options';
    dropdown.appendChild(optionsContainer);
    
    wrapper.appendChild(dropdown);

    function updateTriggerText() {
        const selectedOption = select.options[select.selectedIndex];
        trigger.querySelector('span').textContent = selectedOption ? selectedOption.textContent : 'اختر...';
    }

    function rebuildOptions() {
        optionsContainer.innerHTML = '';
        const options = Array.from(select.options);
        
        if (options.length <= 4) {
            searchInputSelect.classList.add('hidden');
        } else {
            searchInputSelect.classList.remove('hidden');
        }

        options.forEach((opt, idx) => {
            const isSelected = opt.selected;
            const customOpt = document.createElement('div');
            customOpt.className = `custom-select-option${isSelected ? ' selected' : ''}`;
            customOpt.textContent = opt.textContent;
            customOpt.dataset.value = opt.value;
            customOpt.dataset.index = idx;
            
            customOpt.addEventListener('click', (e) => {
                e.stopPropagation();
                select.selectedIndex = idx;
                
                select.dispatchEvent(new Event('change', { bubbles: true }));
                
                closeDropdown();
            });
            optionsContainer.appendChild(customOpt);
        });
        
        updateTriggerText();
    }

    function filterOptions() {
        const filterText = searchInputSelect.value.toLowerCase().trim();
        const customOpts = optionsContainer.querySelectorAll('.custom-select-option');
        
        customOpts.forEach(customOpt => {
            const txt = customOpt.textContent.toLowerCase();
            if (txt.includes(filterText)) {
                customOpt.style.display = 'block';
            } else {
                customOpt.style.display = 'none';
            }
        });
    }

    function openDropdown() {
        document.querySelectorAll('.custom-select-wrapper.open').forEach(w => {
            if (w !== wrapper) {
                w.classList.remove('open');
                w.querySelector('.custom-select-dropdown').classList.add('hidden');
            }
        });

        wrapper.classList.add('open');
        dropdown.classList.remove('hidden');
        searchInputSelect.value = '';
        filterOptions();
        setTimeout(() => searchInputSelect.focus(), 50);
    }

    function closeDropdown() {
        wrapper.classList.remove('open');
        dropdown.classList.add('hidden');
    }

    function toggleDropdown(e) {
        e.stopPropagation();
        if (wrapper.classList.contains('open')) {
            closeDropdown();
        } else {
            openDropdown();
        }
    }

    trigger.addEventListener('click', toggleDropdown);
    searchInputSelect.addEventListener('input', filterOptions);

    function syncVisibility() {
        if (select.classList.contains('hidden')) {
            wrapper.classList.add('hidden');
        } else {
            wrapper.classList.remove('hidden');
        }
    }

    rebuildOptions();
    syncVisibility();

    select.addEventListener('change', () => {
        updateTriggerText();
        const customOpts = optionsContainer.querySelectorAll('.custom-select-option');
        customOpts.forEach((customOpt, idx) => {
            if (idx === select.selectedIndex) {
                customOpt.classList.add('selected');
            } else {
                customOpt.classList.remove('selected');
            }
        });
    });

    const parentForm = select.closest('form');
    if (parentForm) {
        parentForm.addEventListener('reset', () => {
            setTimeout(() => {
                rebuildOptions();
                syncVisibility();
            }, 50);
        });
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                rebuildOptions();
            } else if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                syncVisibility();
            }
        });
    });
    
    observer.observe(select, { 
        childList: true, 
        subtree: true, 
        characterData: true,
        attributes: true,
        attributeFilter: ['class']
    });
}

function initAllSearchableSelects() {
    const allSelects = document.querySelectorAll('select');
    allSelects.forEach(select => {
        makeSearchableSelect(select);
    });
}

window.initializeApp = function() {
    initAllSearchableSelects();
    restoreLocationFields();
    
    // Wire copy button
    const copyBtn = document.getElementById('copyLastAssetBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const lastAssetStr = localStorage.getItem('last_asset');
            if (lastAssetStr) {
                try {
                    const lastAsset = JSON.parse(lastAssetStr);
                    fillAddAssetForm(lastAsset);
                    showToast('تم نسخ بيانات آخر أصل!', 'success');
                } catch (e) {
                    console.error('Error copying last asset:', e);
                    showToast('لا توجد بيانات محفوظة مسبقاً', 'error');
                }
            } else {
                showToast('لا توجد بيانات محفوظة مسبقاً', 'error');
            }
        });
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-select-wrapper')) {
        document.querySelectorAll('.custom-select-wrapper.open').forEach(wrapper => {
            wrapper.classList.remove('open');
            wrapper.querySelector('.custom-select-dropdown').classList.add('hidden');
        });
    }
});