// utils.js - fungsi bantu "murni": menerima input, mengembalikan output, tidak menyentuh DOM.
// Harus dimuat SEBELUM apps.js.

function formatPrice(value) {
  return `$${Number(value).toFixed(2)}`;
}

// Mencegah teks dari API dibaca sebagai HTML saat dimasukkan ke innerHTML.
function escapeHTML(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ---- Fitur Y: statistik ----
// Input : items = array objek produk dari API
// Output: lihat tiap fungsi

// Output: number. Mengembalikan 0 untuk array kosong agar tidak terjadi pembagian dengan nol (NaN).
function hitungRataRataHarga(items) {
  if (items.length === 0) return 0;
  const total = items.reduce((sum, p) => sum + p.price, 0);
  return total / items.length;
}

// Output: objek produk dengan harga tertinggi, atau null jika array kosong.
function cariTermahal(items) {
  if (items.length === 0) return null;
  return items.reduce((max, p) => (p.price > max.price ? p : max));
}

// Output: number. Set hanya menyimpan nilai unik, jadi size = jumlah kategori berbeda.
function hitungJumlahKategori(items) {
  return new Set(items.map((p) => p.category)).size;
}

// ---- Validasi Z: email + konfirmasi email ----
// Output tiap fungsi: string pesan error, atau "" jika valid.

function validateEmail(email) {
  const value = email.trim();
  if (value === "") return "Email wajib diisi.";
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // ada teks, "@", teks, ".", teks; tanpa spasi
  if (!pattern.test(value)) return "Format email tidak valid. Contoh: nama@contoh.com.";
  return "";
}

function validateEmailConfirm(email, confirm) {
  const value = confirm.trim();
  if (value === "") return "Konfirmasi email wajib diisi.";
  if (value.toLowerCase() !== email.trim().toLowerCase()) {
    return "Konfirmasi email harus sama dengan email di atas.";
  }
  return "";
}
