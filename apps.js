// apps.js - state, akses DOM, fetch, dan event listener.
// Bergantung pada fungsi di utils.js.

const API_URL = "https://dummyjson.com/products";
const VIEW_KEY = "viewMode"; // kunci localStorage untuk pilihan Grid/List

const statusEl = document.getElementById("status");
const listEl = document.getElementById("data-list");
const statsEl = document.getElementById("stats");
const categoryEl = document.getElementById("category-filter");
const maxPriceEl = document.getElementById("max-price");
const btnGrid = document.getElementById("btn-grid");
const btnList = document.getElementById("btn-list");
const formEl = document.getElementById("contact-form");
const formSuccessEl = document.getElementById("form-success");

let products = []; // data asli dari API; filter selalu mulai dari array ini

// ---- Status: loading / sukses / error ----
function showLoading() {
  statusEl.className = "";
  statusEl.textContent = "Memuat data...";
  listEl.innerHTML = "";
}

function showError(message) {
  statusEl.className = "error";
  statusEl.textContent = `Gagal memuat data: ${message}`;
}

function showSuccess(shown, total) {
  statusEl.className = "";
  statusEl.textContent = `Data berhasil dimuat. Menampilkan ${shown} dari ${total} produk.`;
}

// ---- Fetch ----
async function loadData() {
  try {
    showLoading();
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const data = await response.json();
    products = data.products;
    populateCategories();
    applyFilters();
  } catch (error) {
    showError(error.message);
  }
}

// ---- Render ----
function renderProducts(items) {
  listEl.innerHTML = items
    .map(
      (p) => `
      <article class="card">
        <img src="${escapeHTML(p.thumbnail)}" alt="${escapeHTML(p.title)}">
        <h3>${escapeHTML(p.title)}</h3>
        <p>${escapeHTML(p.category)}</p>
        <p>${formatPrice(p.price)}</p>
      </article>`
    )
    .join("");
}

// ---- Fitur Y: filter + statistik ----
function populateCategories() {
  const categories = [...new Set(products.map((p) => p.category))].sort();
  categoryEl.innerHTML =
    '<option value="all">Semua kategori</option>' +
    categories.map((c) => `<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join("");
}

function applyFilters() {
  const category = categoryEl.value;
  const maxPrice = parseFloat(maxPriceEl.value); // NaN jika kolom kosong

  const result = products.filter((p) => {
    const matchCategory = category === "all" || p.category === category;
    const matchPrice = Number.isNaN(maxPrice) || p.price <= maxPrice;
    return matchCategory && matchPrice;
  });

  renderProducts(result);
  renderStats(result);
  if (result.length === 0) {
    statusEl.className = "";
    statusEl.textContent = "Tidak ada produk yang cocok dengan filter. Ubah kategori atau harga maksimum.";
  } else {
    showSuccess(result.length, products.length);
  }
}

// Statistik dihitung dari data yang sedang tampil (hasil filter), bukan diketik manual.
function renderStats(items) {
  const termahal = cariTermahal(items);
  const stats = [
    ["Rata-rata harga", items.length ? formatPrice(hitungRataRataHarga(items)) : "-"],
    ["Produk termahal", termahal ? `${termahal.title} (${formatPrice(termahal.price)})` : "-"],
    ["Jumlah kategori", hitungJumlahKategori(items)],
  ];
  statsEl.innerHTML = stats
    .map(([label, value]) => `<div><dt>${label}</dt><dd>${escapeHTML(value)}</dd></div>`)
    .join("");
}

// ---- Challenge C: toggle Grid/List (disimpan di localStorage) ----
function setView(mode) {
  const isList = mode === "list";
  listEl.classList.toggle("list-view", isList);
  btnGrid.setAttribute("aria-pressed", String(!isList));
  btnList.setAttribute("aria-pressed", String(isList));
  try {
    localStorage.setItem(VIEW_KEY, isList ? "list" : "grid");
  } catch (error) {
    // localStorage bisa dinonaktifkan browser; tampilan tetap berubah, hanya tidak tersimpan.
  }
}

function loadSavedView() {
  let saved = "grid";
  try {
    saved = localStorage.getItem(VIEW_KEY) === "list" ? "list" : "grid";
  } catch (error) {
    // abaikan; pakai tampilan default
  }
  setView(saved);
}

// ---- Validasi Z: form email + konfirmasi email ----
function showFieldError(inputId, message) {
  document.getElementById(`${inputId}-error`).textContent = message;
  document.getElementById(inputId).setAttribute("aria-invalid", message ? "true" : "false");
}

function handleSubmit(event) {
  event.preventDefault(); // cegah browser mengirim form sebelum validasi selesai
  formSuccessEl.textContent = "";

  const email = document.getElementById("email").value;
  const confirm = document.getElementById("email-confirm").value;
  const emailError = validateEmail(email);
  const confirmError = validateEmailConfirm(email, confirm);

  showFieldError("email", emailError);
  showFieldError("email-confirm", confirmError);

  if (emailError || confirmError) {
    // Fokus ke input pertama yang salah agar pengguna keyboard/pembaca layar langsung tahu.
    document.getElementById(emailError ? "email" : "email-confirm").focus();
    return;
  }

  formSuccessEl.textContent = `Berhasil: email ${email.trim()} telah diterima.`;
  formEl.reset();
}

// ---- Event listener ----
function init() {
  categoryEl.addEventListener("change", applyFilters);
  maxPriceEl.addEventListener("input", applyFilters);
  btnGrid.addEventListener("click", () => setView("grid"));
  btnList.addEventListener("click", () => setView("list"));
  formEl.addEventListener("submit", handleSubmit);
  loadSavedView();
  loadData();
}

document.addEventListener("DOMContentLoaded", init);
