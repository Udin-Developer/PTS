const API_URL = "https://dummyjson.com/products";
const VIEW_KEY = "melodia_view_mode";

// State global data
let allProducts = [];
let lastFetchTimestamp = null;

// Fallback data lokal jika browser membatasi pembacaan fetch pada protokol file:///
const FALLBACK_PRODUCTS = [
  {
    id: 1,
    title: "Fender Player Stratocaster",
    category: "Gitar & Bass",
    brand: "Fender",
    price: 12850000,
    rating: 4.9,
    stock: 8,
    description: "Gitar elektrik legendaris dengan 3 pickup single-coil Player Series, bodi alder, dan neck maple modern C yang presisi.",
    thumbnail: "assets/images/fender-stratocaster.jpg"
  },
  {
    id: 2,
    title: "Yamaha Pacifica 112V",
    category: "Gitar & Bass",
    brand: "Yamaha",
    price: 3450000,
    rating: 4.8,
    stock: 14,
    description: "Gitar elektrik serbaguna konfigurasi H-S-S Alnico V pickups dengan coil-tap switch untuk jangkauan genre luas.",
    thumbnail: "assets/images/yamaha-pacifica.jpg"
  },
  {
    id: 5,
    title: "Roland FP-30X Digital Piano",
    category: "Keyboard & Piano",
    brand: "Roland",
    price: 11200000,
    rating: 4.9,
    stock: 6,
    description: "Piano digital panggung 88-tuts berbobot PHA-4 Standard dengan SuperNATURAL Piano sound engine dan audio Bluetooth.",
    thumbnail: "assets/images/roland-fp30x.jpg"
  },
  {
    id: 11,
    title: "Shure SM7B Cardioid Studio Mic",
    category: "Audio & Studio",
    brand: "Shure",
    price: 6400000,
    rating: 5.0,
    stock: 7,
    description: "Mikrofon dinamik vokal standar industri rekaman dengan pelindung elektromagnetik dan isolasi guncangan internal.",
    thumbnail: "assets/images/shure-sm7b.jpg"
  }
];

// ==========================================
// 1. Pengambilan Data REST/JSON Lokal
// ==========================================
async function loadData() {
  const statusEl = document.getElementById("status");
  const listEl = document.getElementById("data-list");

  try {
    if (statusEl) {
      statusEl.className = "status-notice status-loading";
      statusEl.textContent = "Memuat data katalog instrumen musik...";
    }
    if (listEl) {
      listEl.setAttribute("aria-busy", "true");
    }

    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} (${response.statusText})`);
    }

    const data = await response.json();
    if (!data || !Array.isArray(data.products)) {
      throw new Error("Format respons JSON tidak valid.");
    }

    allProducts = data.products;
    lastFetchTimestamp = new Date();
    updateTimestampUI();

    // Inisialisasi seluruh tampilan
    renderDashboardStats();
    populateCategories();
    loadSavedView();
    applyFilters();
  } catch (error) {
    handleLoadError(error);
  } finally {
    if (listEl) {
      listEl.removeAttribute("aria-busy");
    }
  }
}

function handleLoadError(error) {
  const statusEl = document.getElementById("status");
  if (!statusEl) return;

  statusEl.className = "status-notice status-error";
  statusEl.innerHTML = `
    <div>
      <p><strong>Gagal memuat katalog:</strong> ${escapeHTML(error.message)}</p>
      <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button type="button" class="btn btn-secondary" id="btn-retry">Coba Lagi</button>
        <button type="button" class="btn btn-outline" id="btn-use-fallback">Gunakan Cadangan Offline</button>
      </div>
    </div>
  `;

  document.getElementById("btn-retry")?.addEventListener("click", () => {
    loadData();
  });

  document.getElementById("btn-use-fallback")?.addEventListener("click", () => {
    allProducts = FALLBACK_PRODUCTS;
    lastFetchTimestamp = new Date();
    updateTimestampUI();
    renderDashboardStats();
    populateCategories();
    loadSavedView();
    applyFilters();
  });
}

function updateTimestampUI() {
  const timeEl = document.getElementById("last-updated");
  if (timeEl && lastFetchTimestamp) {
    const formatted = lastFetchTimestamp.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
    timeEl.textContent = `Sinkronisasi terakhir: ${formatted} WITA`;
  }
}

// ==========================================
// 2. Dashboard: Ringkasan Metrik Toko
// ==========================================
function renderDashboardStats() {
  const container = document.getElementById("dashboard-stats");
  if (!container || allProducts.length === 0) return;

  const rataRata = hitungRataRataHarga(allProducts);
  const termahal = cariTermahal(allProducts);
  const totalKategori = hitungJumlahKategori(allProducts);

  container.innerHTML = `
    <div class="stat-card">
      <dt class="stat-label">Total Instrumen</dt>
      <dd class="stat-value">${allProducts.length} Produk</dd>
    </div>
    <div class="stat-card">
      <dt class="stat-label">Kategori Produk</dt>
      <dd class="stat-value">${totalKategori} Kategori</dd>
    </div>
    <div class="stat-card">
      <dt class="stat-label">Rata-rata Harga</dt>
      <dd class="stat-value">${formatPrice(rataRata)}</dd>
    </div>
    <div class="stat-card">
      <dt class="stat-label">Produk Tertinggi</dt>
      <dd class="stat-value">${termahal ? escapeHTML(termahal.title) : "-"}</dd>
    </div>
  `;
}

// ==========================================
// 3. Fitur Y: Filter Data + Statistik Sederhana
// ==========================================
function populateCategories() {
  const categoryEl = document.getElementById("category-filter");
  if (!categoryEl) return;

  const categories = [...new Set(allProducts.map((p) => p.category))].sort();
  const optionsHTML = ['<option value="all">Semua Kategori</option>']
    .concat(categories.map((c) => `<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`))
    .join("");

  categoryEl.innerHTML = optionsHTML;
}

function applyFilters() {
  const categoryEl = document.getElementById("category-filter");
  const maxPriceEl = document.getElementById("max-price");
  const sortEl = document.getElementById("sort-by");
  const statusEl = document.getElementById("status");

  const selectedCategory = categoryEl ? categoryEl.value : "all";
  const maxPrice = maxPriceEl && maxPriceEl.value !== "" ? parseFloat(maxPriceEl.value) : Number.POSITIVE_INFINITY;
  const sortBy = sortEl ? sortEl.value : "default";

  // Filter dengan method array JavaScript
  let filtered = allProducts.filter((product) => {
    const matchCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchPrice = Number.isNaN(maxPrice) || Number(product.price) <= maxPrice;
    return matchCategory && matchPrice;
  });

  // Sorting
  if (sortBy === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === "name-asc") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === "rating-desc") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  renderProducts(filtered);
  renderStats(filtered);

  if (statusEl) {
    if (filtered.length === 0) {
      statusEl.className = "status-notice status-empty";
      statusEl.textContent = "Tidak ada produk yang memenuhi kriteria filter. Silakan ubah filter kategori atau naikkan batas harga.";
    } else {
      statusEl.className = "status-notice status-success";
      statusEl.textContent = `Menampilkan ${filtered.length} dari total ${allProducts.length} instrumen musik orisinal.`;
    }
  }
}

function resetFilters() {
  const categoryEl = document.getElementById("category-filter");
  const maxPriceEl = document.getElementById("max-price");
  const sortEl = document.getElementById("sort-by");

  if (categoryEl) categoryEl.value = "all";
  if (maxPriceEl) maxPriceEl.value = "";
  if (sortEl) sortEl.value = "default";

  applyFilters();
}

function renderProducts(items) {
  const listEl = document.getElementById("data-list");
  if (!listEl) return;

  if (items.length === 0) {
    listEl.innerHTML = "";
    return;
  }

  listEl.innerHTML = items
    .map(
      (product) => `
      <article class="product-card" data-id="${product.id}">
        <div class="card-media">
          <img src="${escapeHTML(product.thumbnail)}" alt="Foto instrumen ${escapeHTML(product.title)}" loading="lazy" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 320 200\\' width=\\'320\\' height=\\'200\\'><rect width=\\'100%25\\' height=\\'100%25\\' fill=\\'%23EEE8DC\\'/><text x=\\'50%25\\' y=\\'50%25\\' fill=\\'%23721820\\' font-family=\\'sans-serif\\' font-size=\\'14\\' font-weight=\\'bold\\' text-anchor=\\'middle\\'>Music For Living</text></svg>';">
          <span class="card-badge">${escapeHTML(product.category)}</span>
        </div>
        <div class="card-body">
          <div class="card-header-row">
            <span class="card-brand">${escapeHTML(product.brand)}</span>
            <span class="card-rating" aria-label="Rating ${product.rating} dari 5">Rating ${product.rating.toFixed(1)}</span>
          </div>
          <h3 class="card-title">${escapeHTML(product.title)}</h3>
          <p class="card-desc">${escapeHTML(product.description)}</p>
          <div class="card-footer-row">
            <div>
              <span class="price-label">Harga</span>
              <span class="price-value">${formatPrice(product.price)}</span>
            </div>
            <div class="card-footer-meta">
              <span class="stock-info">Stok: ${product.stock} unit</span>
              <a href="#kontak" class="card-action-link" aria-label="Konsultasikan instrumen ${escapeHTML(product.title)}">Konsultasi Alat &rarr;</a>
            </div>
          </div>
        </div>
      </article>
    `
    )
    .join("");
}

function renderStats(items) {
  const statsContainer = document.getElementById("stats");
  if (!statsContainer) return;

  const termahal = cariTermahal(items);
  const termurah = cariTermurah(items);
  const rataRata = hitungRataRataHarga(items);
  const totalKategori = hitungJumlahKategori(items);

  const statsData = [
    { label: "Rata-rata Harga", value: items.length > 0 ? formatPrice(rataRata) : "-" },
    { label: "Produk Termahal", value: termahal ? `${termahal.title} (${formatPrice(termahal.price)})` : "-" },
    { label: "Produk Termurah", value: termurah ? `${termurah.title} (${formatPrice(termurah.price)})` : "-" },
    { label: "Kategori Aktif", value: `${totalKategori} kategori` }
  ];

  statsContainer.innerHTML = statsData
    .map(
      (s) => `
      <div class="stat-card">
        <dt class="stat-label">${escapeHTML(s.label)}</dt>
        <dd class="stat-value">${escapeHTML(s.value)}</dd>
      </div>
    `
    )
    .join("");
}

// ==========================================
// 4. Challenge C: Toggle Grid/List (localStorage)
// ==========================================
function setView(mode) {
  const listEl = document.getElementById("data-list");
  const btnGrid = document.getElementById("btn-grid");
  const btnList = document.getElementById("btn-list");

  const isList = mode === "list";

  if (listEl) {
    listEl.classList.toggle("list-view", isList);
  }

  if (btnGrid && btnList) {
    btnGrid.setAttribute("aria-pressed", String(!isList));
    btnList.setAttribute("aria-pressed", String(isList));
  }

  try {
    localStorage.setItem(VIEW_KEY, isList ? "list" : "grid");
  } catch (e) {
    // Abaikan jika localStorage tidak diizinkan oleh kebijakan browser
  }
}

function loadSavedView() {
  let savedMode = "grid";
  try {
    const stored = localStorage.getItem(VIEW_KEY);
    if (stored === "list" || stored === "grid") {
      savedMode = stored;
    }
  } catch (e) {
    savedMode = "grid";
  }
  setView(savedMode);
}

// ==========================================
// 5. Validasi Z: Form Email + Konfirmasi Email
// ==========================================
function initContactForm() {
  const formEl = document.getElementById("contact-form");
  if (!formEl) return;

  const emailInput = document.getElementById("email");
  const confirmInput = document.getElementById("email-confirm");
  const nameInput = document.getElementById("nama");
  const messageInput = document.getElementById("pesan");

  // Validasi real-time saat blur dan saat pengguna mengetik ulang
  nameInput?.addEventListener("blur", () => {
    setFieldFeedback("nama", validateNama(nameInput.value));
  });
  nameInput?.addEventListener("input", () => {
    if (nameInput.getAttribute("aria-invalid") === "true") {
      setFieldFeedback("nama", validateNama(nameInput.value));
    }
  });

  emailInput?.addEventListener("blur", () => {
    setFieldFeedback("email", validateEmail(emailInput.value));
  });
  emailInput?.addEventListener("input", () => {
    if (emailInput.getAttribute("aria-invalid") === "true") {
      setFieldFeedback("email", validateEmail(emailInput.value));
    }
  });

  confirmInput?.addEventListener("blur", () => {
    setFieldFeedback("email-confirm", validateEmailConfirm(emailInput.value, confirmInput.value));
  });
  confirmInput?.addEventListener("input", () => {
    if (confirmInput.getAttribute("aria-invalid") === "true") {
      setFieldFeedback("email-confirm", validateEmailConfirm(emailInput.value, confirmInput.value));
    }
  });

  messageInput?.addEventListener("blur", () => {
    setFieldFeedback("pesan", validatePesan(messageInput.value));
  });
  messageInput?.addEventListener("input", () => {
    if (messageInput.getAttribute("aria-invalid") === "true") {
      setFieldFeedback("pesan", validatePesan(messageInput.value));
    }
  });

  // Submit Handler
  formEl.addEventListener("submit", (event) => {
    event.preventDefault();

    const successEl = document.getElementById("form-success");
    if (successEl) {
      successEl.innerHTML = "";
      successEl.className = "form-success-wrapper";
    }

    const emailVal = emailInput ? emailInput.value : "";
    const confirmVal = confirmInput ? confirmInput.value : "";
    const nameVal = nameInput ? nameInput.value : "";
    const messageVal = messageInput ? messageInput.value : "";

    const nameError = validateNama(nameVal);
    const emailError = validateEmail(emailVal);
    const confirmError = validateEmailConfirm(emailVal, confirmVal);
    const messageError = validatePesan(messageVal);

    setFieldFeedback("nama", nameError);
    setFieldFeedback("email", emailError);
    setFieldFeedback("email-confirm", confirmError);
    setFieldFeedback("pesan", messageError);

    const hasError = Boolean(nameError || emailError || confirmError || messageError);

    if (hasError) {
      const firstErrorId = nameError ? "nama" : emailError ? "email" : confirmError ? "email-confirm" : "pesan";
      document.getElementById(firstErrorId)?.focus();
      return;
    }

    if (successEl) {
      successEl.className = "form-success-box";
      successEl.innerHTML = `
        <strong>Permintaan Konsultasi Berhasil Dikirim</strong>
        <p>Terima kasih, <strong>${escapeHTML(nameVal.trim())}</strong>. Tim spesialis Music For Living telah menerima rincian kebutuhan Anda. Salinan konsultasi telah dikirim ke alamat <strong>${escapeHTML(emailVal.trim())}</strong>.</p>
      `;
    }

    formEl.reset();
  });
}

function setFieldFeedback(fieldId, errorMessage) {
  const errorEl = document.getElementById(`${fieldId}-error`);
  const inputEl = document.getElementById(fieldId);

  if (errorEl) {
    errorEl.textContent = errorMessage;
  }
  if (inputEl) {
    inputEl.setAttribute("aria-invalid", errorMessage ? "true" : "false");
  }
}

// ==========================================
// 6. Sinkronisasi Navigasi Halaman Aktif
// ==========================================
function initNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");

  function updateActiveLink() {
    let currentId = "dashboard";
    const scrollPos = window.scrollY + 180;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      const targetHash = link.getAttribute("href");
      if (targetHash === `#${currentId}`) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });
  }

  window.addEventListener("scroll", updateActiveLink, { passive: true });
}

// Inisialisasi Utama saat DOM Selesai Dimuat
document.addEventListener("DOMContentLoaded", () => {
  // 1. Muat data inventaris toko musik
  loadData();

  // 2. Hubungkan event listener filter dan pengurutan
  document.getElementById("category-filter")?.addEventListener("change", applyFilters);
  document.getElementById("max-price")?.addEventListener("input", applyFilters);
  document.getElementById("sort-by")?.addEventListener("change", applyFilters);
  document.getElementById("btn-reset-filter")?.addEventListener("click", resetFilters);

  // 3. Hubungkan event listener pengalih tampilan (Challenge C)
  document.getElementById("btn-grid")?.addEventListener("click", () => setView("grid"));
  document.getElementById("btn-list")?.addEventListener("click", () => setView("list"));

  // 4. Inisialisasi formulir validasi kontak (Digit Z=6)
  initContactForm();

  // 5. Inisialisasi pemantau scroll navigasi
  initNavigation();
});
