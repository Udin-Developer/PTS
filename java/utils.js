// utils.js - fungsi bantu murni untuk kalkulasi, pemformatan, dan validasi data.
// Seluruh fungsi bersifat murni tanpa ketergantungan DOM.

function formatPrice(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return "Rp 0";
  return `Rp ${num.toLocaleString("id-ID")}`;
}

function escapeHTML(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function hitungRataRataHarga(items) {
  if (!items || items.length === 0) return 0;
  const total = items.reduce((sum, item) => sum + Number(item.price || 0), 0);
  return Math.round(total / items.length);
}

function cariTermahal(items) {
  if (!items || items.length === 0) return null;
  return items.reduce((max, item) => (Number(item.price) > Number(max.price) ? item : max));
}

function cariTermurah(items) {
  if (!items || items.length === 0) return null;
  return items.reduce((min, item) => (Number(item.price) < Number(min.price) ? item : min));
}

function hitungJumlahKategori(items) {
  if (!items || items.length === 0) return 0;
  return new Set(items.map((item) => item.category)).size;
}

function validateNama(nama) {
  const value = String(nama || "").trim();
  if (value === "") {
    return "Nama lengkap wajib diisi.";
  }
  // Deteksi upaya injeksi skrip atau tag HTML
  if (/[<>]|script|alert\s*\(|javascript:/i.test(value)) {
    return "Nama tidak boleh mengandung tag HTML, kode skrip, atau karakter '<' dan '>'.";
  }
  if (value.length < 3) {
    return "Nama lengkap minimal terdiri dari 3 karakter.";
  }
  if (value.length > 50) {
    return "Nama lengkap maksimal 50 karakter.";
  }
  // Nama hanya boleh berisi huruf alfabet, spasi, tanda petik, titik, atau tanda hubung
  const nameRegex = /^[a-zA-Z\s'.-]+$/;
  if (!nameRegex.test(value)) {
    return "Nama hanya boleh berisi huruf alfabet, spasi, tanda petik ('), titik (.), atau tanda hubung (-). Angka dan simbol lain tidak diperbolehkan.";
  }
  return "";
}

function validateEmail(email) {
  const value = String(email || "").trim();
  if (value === "") {
    return "Alamat email wajib diisi.";
  }
  if (/[<>]|script|alert\s*\(|javascript:/i.test(value)) {
    return "Alamat email tidak boleh mengandung tag HTML atau kode skrip.";
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(value)) {
    return "Format email tidak valid. Gunakan format seperti: nama@domain.com";
  }
  return "";
}

function validateEmailConfirm(email, confirm) {
  const valEmail = String(email || "").trim();
  const valConfirm = String(confirm || "").trim();
  if (valConfirm === "") {
    return "Konfirmasi email wajib diisi.";
  }
  if (/[<>]|script|alert\s*\(|javascript:/i.test(valConfirm)) {
    return "Konfirmasi email tidak boleh mengandung tag HTML atau kode skrip.";
  }
  if (valEmail.toLowerCase() !== valConfirm.toLowerCase()) {
    return "Konfirmasi email tidak cocok dengan alamat email di atas.";
  }
  return "";
}

function validatePesan(pesan) {
  const value = String(pesan || "").trim();
  if (value === "") {
    return "Pesan konsultasi wajib diisi.";
  }
  // Deteksi upaya injeksi skrip atau tag HTML
  if (/[<>]|script|alert\s*\(|javascript:/i.test(value)) {
    return "Pesan tidak boleh mengandung tag HTML, kode skrip, atau karakter '<' dan '>'.";
  }
  if (value.length < 10) {
    return "Pesan konsultasi minimal terdiri dari 10 karakter.";
  }
  if (value.length > 500) {
    return "Pesan konsultasi maksimal 500 karakter.";
  }
  return "";
}

function validateMinLength(text, minLength, fieldName) {
  const value = String(text || "").trim();
  if (value.length < minLength) {
    return `${fieldName} minimal terdiri dari ${minLength} karakter.`;
  }
  return "";
}

