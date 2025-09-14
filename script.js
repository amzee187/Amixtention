// ===== تاریخ و ساعت =====
function updateTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeStr = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
    document.getElementById("currentTime").textContent = timeStr;

    const days = ["یکشنبه","دوشنبه","سه‌شنبه","چهارشنبه","پنج‌شنبه","جمعه","شنبه"];
    const months = ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
    const dateStr = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
    document.getElementById("currentDate").textContent = dateStr;
}
setInterval(updateTime, 1000);
updateTime();

// ===== Quick Access Sites =====
let sites = JSON.parse(localStorage.getItem("sites")) || [];

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
    sites.forEach(site => {
        const div = document.createElement("a");
        div.className = "site-item";
        div.href = site.url;
        div.target = "_blank";
        div.setAttribute("data-url", site.url);
        div.innerHTML = `
            ${site.icon ? `<img src="${site.icon}" class="site-favicon" />` : `<div class="site-icon">🌐</div>`}
            <div class="site-name">${site.name}</div>
            <button class="delete-btn">×</button>
        `;
        grid.appendChild(div);
    });

    // دکمه افزودن سایت همیشه آخر
    const addNew = document.createElement("div");
    addNew.className = "site-item add-new";
    addNew.innerHTML = `<div class="site-icon">+</div><div class="site-name">افزودن</div>`;
    addNew.addEventListener("click", openAddSiteModal);
    grid.appendChild(addNew);
}

// ===== باز و بستن مودال =====
function openAddSiteModal() {
    document.getElementById("addSiteModal").style.display = "block";
}
function closeModal() {
    document.getElementById("addSiteModal").style.display = "none";
    document.getElementById("addSiteForm").reset();
}

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
            localStorage.setItem("sites", JSON.stringify(sites));
            renderSites();
            closeModal();
        };
        reader.readAsDataURL(iconFile);
    } else {
        const icon = getFavicon(url); // لوگوی خودکار سایت
        sites.push({name, url, icon});
        localStorage.setItem("sites", JSON.stringify(sites));
        renderSites();
        closeModal();
    }
});

// ===== حذف سایت‌ها =====
document.getElementById("sitesGrid").addEventListener("click", function(e) {
    if (e.target.classList.contains("delete-btn")) {
        const siteItem = e.target.closest(".site-item");
        const siteUrl = siteItem.getAttribute("data-url");
        sites = sites.filter(s => s.url !== siteUrl); // حذف از آرایه
        localStorage.setItem("sites", JSON.stringify(sites)); // ذخیره مجدد
        renderSites(); // رندر دوباره
    }
});

// ===== رندر اولیه =====
renderSites();
