// ===== تبدیل تاریخ میلادی به شمسی (نسخهٔ درست و پایدار) =====
function gregorianToJalali(gy, gm, gd) {
    const g_days_in_month = [31,28,31,30,31,30,31,31,30,31,30,31];
    const j_days_in_month = [31,31,31,31,31,31,30,30,30,30,30,29];

    const gy2 = gy - 1600;
    const gm2 = gm - 1;
    const gd2 = gd - 1;

    // روز شماره‌ای از تاریخ مرجع (گرگوری)
    let g_day_no = 365 * gy2 + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400);
    for (let i = 0; i < gm2; ++i) {
        g_day_no += g_days_in_month[i];
    }
    // اگر تا بعد از فوریه هستیم و سال گرگوری کبیسه است، یک روز اضافه کن
    if (gm2 > 1 && ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0))) {
        g_day_no += 1;
    }
    g_day_no += gd2;

    // تبدیل به شماره روز جلالی از مرجع
    let j_day_no = g_day_no - 79;

    const j_np = Math.floor(j_day_no / 12053); // دوره‌های 33 ساله
    j_day_no = j_day_no % 12053;

    let jy = 979 + 33 * j_np + 4 * Math.floor(j_day_no / 1461);
    j_day_no = j_day_no % 1461;

    if (j_day_no >= 366) {
        jy += Math.floor((j_day_no - 366) / 365);
        j_day_no = (j_day_no - 366) % 365;
    }

    // محاسبه ماه و روز
    let jm = 0;
    let jd = 0;
    let i = 0;
    for (; i < 12 && j_day_no >= j_days_in_month[i]; ++i) {
        j_day_no -= j_days_in_month[i];
    }
    jm = i + 1;
    jd = j_day_no + 1;

    return [jy, jm, jd];
}

// ===== تاریخ و ساعت =====
function updateTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeStr = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
    document.getElementById("currentTime").textContent = timeStr;

    // تبدیل به تاریخ شمسی
    const [jy, jm, jd] = gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
    
    const days = ["یکشنبه","دوشنبه","سه‌شنبه","چهارشنبه","پنج‌شنبه","جمعه","شنبه"];
    const months = ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
    
    const dateStr = `${days[now.getDay()]}, ${jd} ${months[jm - 1]}`;
    document.getElementById("currentDate").textContent = dateStr;
}

// به‌روزرسانی ساعت هر ثانیه
setInterval(updateTime, 1000);
updateTime();

// ===== مدیریت لوگو =====
function uploadLogo() {
    // خالی - فقط برای نمایش
    console.log('کلیک روی لوگو');
}

function loadLogo() {
    const logoImage = document.getElementById("logoImage");
    const logoPlaceholder = document.getElementById("logoPlaceholder");
    
    // چک کردن فایل‌های مختلف لوگو
    const logoFiles = ["logo.png", "logo.jpg", "logo.jpeg", "logo.gif", "logo.svg"];
    let logoFound = false;
    
    function tryLoadLogo(index) {
        if (index >= logoFiles.length) {
            // هیچ فایل لوگو پیدا نشد
            logoImage.style.display = "none";
            logoPlaceholder.style.display = "block";
            return;
        }
        
        const tempImg = new Image();
        tempImg.onload = function() {
            // فایل لوگو پیدا شد
            logoImage.src = logoFiles[index];
            logoImage.style.display = "block";
            logoPlaceholder.style.display = "none";
            logoFound = true;
        };
        tempImg.onerror = function() {
            // این فایل وجود نداره، فایل بعدی رو امتحان کن
            tryLoadLogo(index + 1);
        };
        tempImg.src = logoFiles[index];
    }
    
    tryLoadLogo(0);
}

// ===== Quick Access Sites =====
let sites = JSON.parse(localStorage.getItem("sites")) || [
    {
        name: "گوگل",
        url: "https://www.google.com",
        icon: "https://www.google.com/favicon.ico"
    },
    {
        name: "یوتیوب",
        url: "https://www.youtube.com",
        icon: "https://www.youtube.com/favicon.ico"
    },
    {
        name: "اینستاگرام",
        url: "https://www.instagram.com",
        icon: "https://www.instagram.com/favicon.ico"
    },
    {
        name: "توییتر",
        url: "https://www.twitter.com",
        icon: "https://abs.twimg.com/favicons/twitter.ico"
    },
    {
        name: "فیسبوک",
        url: "https://www.facebook.com",
        icon: "https://www.facebook.com/favicon.ico"
    },
    {
        name: "لینکداین",
        url: "https://www.linkedin.com",
        icon: "https://www.linkedin.com/favicon.ico"
    },
    {
        name: "گیت‌هاب",
        url: "https://github.com",
        icon: "https://github.com/favicon.ico"
    },
    {
        name: "واتساپ",
        url: "https://web.whatsapp.com",
        icon: "https://web.whatsapp.com/favicon.ico"
    }
];

// ===== گرفتن Favicon خودکار =====
function getFavicon(url) {
    try {
        const u = new URL(url);
        return `${u.origin}/favicon.ico`;
    } catch (e) {
        return null;
    }
}

// ===== رندر سایت‌ها =====
function renderSites() {
    const grid = document.getElementById("sitesGrid");
    grid.innerHTML = '';

    // سایت‌های موجود
    sites.forEach((site, index) => {
        const div = document.createElement("a");
        div.className = "site-item";
        div.href = site.url;
        div.target = "_blank";
        div.setAttribute("data-url", site.url);
        div.setAttribute("data-index", index);
        div.innerHTML = `
            ${site.icon ? `<img src="${site.icon}" class="site-favicon" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />` : ''}
            <div class="site-icon" style="${site.icon ? 'display:none' : ''}">🌐</div>
            <div class="site-name">${site.name}</div>
            <button class="delete-btn" onclick="deleteSite(event, ${index})">×</button>
        `;
        grid.appendChild(div);
    });

    // دکمه افزودن سایت همیشه آخر
    const addNew = document.createElement("div");
    addNew.className = "site-item add-new";
    addNew.innerHTML = `<div class="site-icon">+</div><div class="site-name">افزودن</div>`;
    addNew.addEventListener("click", openAddSiteModal);
    grid.appendChild(addNew);

    // ذخیره در localStorage
    localStorage.setItem("sites", JSON.stringify(sites));
}

// ===== حذف سایت =====
function deleteSite(event, index) {
    event.preventDefault();
    event.stopPropagation();
    sites.splice(index, 1);
    renderSites();
}

// ===== باز و بستن مودال =====
function openAddSiteModal() {
    document.getElementById("addSiteModal").style.display = "block";
}

function closeModal() {
    document.getElementById("addSiteModal").style.display = "none";
    document.getElementById("addSiteForm").reset();
}

// ===== جستجو در گوگل =====
document.getElementById("searchInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        const searchTerm = this.value.trim();
        if (searchTerm) {
            const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
            window.open(googleUrl, "_blank");
            this.value = ""; // پاک کردن ورودی
        }
    }
});

// ===== اضافه کردن سایت جدید =====
document.getElementById("addSiteForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const name = document.getElementById("siteName").value;
    const url = document.getElementById("siteUrl").value;
    const iconFile = document.getElementById("siteIcon").files[0];

    if (iconFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const icon = event.target.result;
            sites.push({name, url, icon});
            renderSites();
            closeModal();
        };
        reader.readAsDataURL(iconFile);
    } else {
        const icon = getFavicon(url); // لوگوی خودکار سایت
        sites.push({name, url, icon});
        renderSites();
        closeModal();
    }
});

// کلیک خارج از مودال برای بستن
window.addEventListener("click", function(e) {
    const modal = document.getElementById("addSiteModal");
    if (e.target === modal) {
        closeModal();
    }
});

// ===== اجرای اولیه =====
document.addEventListener("DOMContentLoaded", function() {
    loadLogo();
    renderSites();
});

// برای اطمینان از اجرا حتی اگر DOM آماده باشد
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        loadLogo();
        renderSites();
    });
} else {
    loadLogo();
    renderSites();
}
