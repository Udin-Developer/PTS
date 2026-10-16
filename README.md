# Music For Living: Katalog Toko Musik & Studio Audio Gear

Dokumentasi Mini Project Front-End Individual: Penilaian Tengah Semester (PTS)  
Mata Kuliah: Pemrograman Web (Kode: 26TJ453127)  
Program Studi Teknik Komputer, Fakultas Teknik, Universitas Borneo Tarakan.

---

## 1. Identitas Mahasiswa
- **Nama Lengkap:** Reza Randika Putra
- **NPM / NIM:** 2440304016 (Digit X=0, Digit Y=1, Digit Z=6, Challenge C=3)
- **Program Studi:** Teknik Komputer
- **Semester:** 5
- **Tahun Akademik:** 2026/2027

---

## 2. Nama Aplikasi dan Deskripsi Singkat
- **Nama Aplikasi:** Music For Living
- **Tagline:** 🎻 *"Beethoven pernah beli di sini"*
- **Deskripsi:** Penyedia alat-alat yang mendukung musikalitas Anda
- **Konteks Penggunaan:**  
  Music For Living adalah platform web katalog interaktif untuk toko musik dan peralatan rekaman audio studio profesional. Aplikasi ini menyediakan informasi inventaris instrumen (gitar elektrik, piano digital, drum akustik/elektrik, mikrofon studio, monitor rekaman, dan aksesoris audio) yang dapat disaring dan dianalisis secara dinamis berbasis data REST/JSON lokal.
- **Rancangan Visual & Desain Sederhana:**  
  Sesuai arahan tugas PTS, aplikasi dirancang dengan lembar gaya CSS yang bersih, terstruktur, dan sederhana tanpa fitur dark mode yang berlebihan agar kode mudah dipelajari dan dinilai. Menggunakan warna primer **Rosewood** (`#721820` / `#8F222B`), aksen sekunder **Warm Sand** (`#E5D3AF`), latar kanvas **Warm Ivory** (`#FAF7F2`), dan teks utama **Deep Charcoal** (`#1F1A1B`). Desain mematuhi rasio kontras WCAG AAA (> 14:1) serta tata letak responsif menggunakan CSS Grid dan Flexbox.
- **Struktur Berkas Single-Page (SPA):**  
  Aplikasi disatukan ke dalam satu berkas HTML terpadu (`index.html`) di mana katalog produk dan analisis filter terintegrasi langsung ke dalam Dashboard, didampingi bagian Kontak Konsultasi:
  ```text
  ├── index.html          # Satu berkas HTML terpadu: Dashboard (termasuk Katalog Grid/List & Filter) dan Kontak
  ├── css/
  │   └── style.css       # Lembar gaya CSS terpadu, bersih, sederhana, responsif & WCAG AAA
  ├── java/
  │   ├── apps.js         # Pengontrol DOM, pemanggilan REST/JSON, event listener, validasi form & localStorage
  │   └── utils.js        # Fungsi murni (pure functions) kalkulasi array & validasi data
  ├── data/
  │   └── products.json   # Basis data lokal katalog alat musik
  └── assets/
      ├── logo.jpg        # Logo toko musik
      └── images/         # Aset foto instrumen musik
  ```

---

## 3. Perhitungan Variasi Soal Berdasarkan NIM
Tiga digit terakhir NIM yang digunakan: **016**

| Komponen Soal | Rumus / Digit | Nilai Digit | Hasil Variasi Resmi |
|---|---|---|---|
| **Digit X (Dataset)** | Digit pertama dari 016 | X = 0 | **Products** (Tema: Dashboard Produk / UMKM Toko Musik "Music For Living") |
| **Digit Y (Fitur Utama)** | Digit kedua dari 016 | Y = 1 | **Filter data + statistik sederhana** |
| **Digit Z (Validasi Form)** | Digit ketiga dari 016 | Z = 6 | **Email valid + konfirmasi email** |
| **Challenge Individual C** | S = X + Y + Z = 0 + 1 + 6 = 7<br>C = 7 mod 4 | C = 3 | **Toggle Grid/List; pilihan pengguna disimpan pada localStorage** |

---

## 4. Dataset dan API yang Digunakan
- **Format Data:** Berkas JSON lokal terstruktur pada direktori `data/products.json`.
- **Alasan Pemilihan JSON Lokal:**  
  Sesuai arahan tugas untuk menyediakan katalog toko musik mandiri tanpa sistem login, data disajikan dalam format JSON lokal dengan skema standar REST (`products` array of objects) yang memiliki atribut `id`, `title`, `category`, `brand`, `price`, `rating`, `stock`, `description`, dan `thumbnail`. Sistem juga dilengkapi cadangan data *fallback* di memori sehingga aplikasi tetap dapat berjalan secara luring.

---

## 5. Fitur Utama dan Challenge Individual

### A. Fitur Utama (Digit Y = 1): Filter Data + Statistik Sederhana
1. **Filter Kategori:** Dropdown dinamis yang mengambil daftar unik kategori instrumen musik (`Gitar & Bass`, `Keyboard & Piano`, `Drum & Perkusi`, `Audio & Studio`, `Aksesoris Musik`).
2. **Filter Harga Maksimum:** Input numerik real-time yang menyaring instrumen dengan harga di bawah atau sama dengan batas anggaran yang ditentukan pengguna.
3. **Pengurutan (Sorting):** Pengurutan berdasarkan harga termurah, termahal, rating tertinggi, atau nama A-Z.
4. **Statistik Sederhana Dinamis:** Dihitung langsung menggunakan metode array JavaScript (`reduce`, `Set`, `map`) dari data yang sedang aktif tampil di layar:
   - Rata-rata harga produk terfilter.
   - Produk dengan harga termahal saat ini.
   - Produk dengan harga termurah saat ini.
   - Jumlah kategori aktif saat ini.
5. **Tombol Reset Filter:** Mengembalikan filter ke kondisi awal dengan satu klik.

### B. Validasi Form (Digit Z = 6): Email Valid + Konfirmasi Email
1. **Validasi Format Email:** Memeriksa keberadaan karakter teks, simbol `@`, domain, dan ekstensi domain menggunakan ekspresi reguler (regex).
2. **Validasi Konfirmasi Email:** Memastikan teks konfirmasi sama persis (case-insensitive) dengan email utama.
3. **Pesan Kesalahan Aksesibel:** Pesan kesalahan ditampilkan langsung di bawah input dengan atribut `aria-describedby` dan `aria-invalid`, tidak semata-mata mengandalkan perubahan warna border.
4. **Status Berhasil:** Notifikasi visual dengan status sukses yang menyebutkan nama pengguna dan alamat email penerima serta mereset form.

### C. Challenge Individual (C = 3): Toggle Grid/List dengan localStorage
1. **Pengalih Tampilan:** Tombol dengan status semantik `aria-pressed` untuk beralih antara tampilan kartu kisi (*grid view*) dan daftar horizontal ringkas (*list view*).
2. **Penyimpanan Lokal:** Nilai preferensi disimpan pada `localStorage` dengan kunci `melodia_view_mode`. Saat pengguna memuat ulang halaman, tampilan yang terakhir dipilih akan langsung diterapkan secara otomatis.

---

## 6. Cara Menjalankan Project

### Opsi 1: Menggunakan Live Server di Visual Studio Code (Sangat Direkomendasikan)
1. Buka folder project di VS Code.
2. Pasang ekstensi **Live Server** (oleh Ritwick Dey) jika belum terpasang.
3. Klik kanan pada berkas `index.html` lalu pilih **Open with Live Server**.
4. Browser akan otomatis terbuka pada alamat `http://127.0.0.1:5500/index.html`.

### Opsi 2: Menggunakan Server Lokal Python
1. Buka terminal atau PowerShell pada direktori project ini.
2. Jalankan perintah:
   ```bash
   python -m http.server 8000
   ```
3. Buka peramban dan akses: `http://localhost:8000`.

### Opsi 3: Membuka Langsung Berkas HTML
Aplikasi telah dilengkapi penanganan pengecualian (*error handling*) dan tombol pemulihan cadangan data otomatis (*offline fallback*) jika dibuka langsung melalui skema `file:///` di peramban yang membatasi pembacaan fetch lokal.

---

## 7. Endpoint REST API
- `GET data/products.json` (Berkas JSON basis data lokal katalog toko musik)

---

## 8. Jawaban 10 Pertanyaan Penjelasan Kode

### 1. Jelaskan alur sejak halaman dibuka sampai data REST API tampil. Sebutkan nama fungsi pada project Anda.
**Jawaban:**  
Alur dimulai saat event `DOMContentLoaded` terpicu pada browser. Listener di baris akhir berkas `apps.js` memanggil fungsi `loadData()`. Di dalam `loadData()`, elemen `#status` menampilkan pesan memuat data dan kontainer `#data-list` disetel dengan `aria-busy="true"`. Selanjutnya, fungsi mengeksekusi `await fetch(API_URL)`. Setelah respons HTTP diterima dan divalidasi keberhasilannya lewat `response.ok`, data diuraikan menjadi objek JavaScript dengan `await response.json()`. Array produk disimpan ke variabel global `allProducts`. Kemudian, serangkaian fungsi dijalankan:
- `renderDashboardStats()` menghitung metrik toko untuk bagian dashboard.
- `populateCategories()` mengekstrak kategori unik dan mengisi dropdown `#category-filter`.
- `loadSavedView()` membaca preferensi tampilan Grid/List dari `localStorage`.
- `applyFilters()` menyaring data berdasarkan kategori dan harga, lalu memanggil `renderProducts()` untuk mencetak elemen kartu HTML ke kontainer `#data-list` serta memanggil `renderStats()` untuk memperbarui ringkasan statistik terpilih.

### 2. Mengapa setelah fetch() selesai Anda masih perlu memeriksa response.ok? Jelaskan dengan kasus pada aplikasi Anda.
**Jawaban:**  
Fungsi `fetch()` dalam JavaScript hanya melempar kesalahan (*reject promise*) apabila terjadi kegagalan tingkat jaringan (seperti kabel internet terputus atau nama host tidak ditemukan). Jika server merespons dengan status error HTTP seperti 404 (Not Found) atau 500 (Internal Server Error), `fetch()` tetap menganggap permintaan berhasil diselesaikan (*resolved*). Oleh karena itu, pemeriksaan `if (!response.ok)` mutlak diperlukan. Pada aplikasi Music For Living, jika berkas `data/products.json` tidak ditemukan (404), kode melempar error baru yang langsung ditangkap blok `catch` untuk menampilkan notifikasi gagal beserta tombol pemulihan "Coba Lagi" dan "Gunakan Cadangan Offline".

### 3. Pilih satu data JSON dari API dan jelaskan bagaimana data tersebut diubah menjadi elemen DOM yang terlihat.
**Jawaban:**  
Misalkan satu objek produk instrumen dalam JSON adalah:
```json
{
  "id": 1,
  "title": "Fender Player Stratocaster",
  "category": "Gitar & Bass",
  "brand": "Fender",
  "price": 12850000,
  "rating": 4.9,
  "stock": 8,
  "description": "Gitar elektrik ikonik dengan 3 pickup single-coil Player Series...",
  "thumbnail": "assets/images/fender-stratocaster.jpg"
}
```
Pada fungsi `renderProducts(items)`, array objek ini diproses menggunakan metode `items.map()`. Setiap properti diekstraksi dan diamankan dari potensi celah XSS menggunakan fungsi `escapeHTML()`, lalu disisipkan ke dalam template literal string HTML: properti `title` menjadi elemen `<h3>`, `category` menjadi `<span class="card-badge">`, `price` diformat menjadi mata uang Rupiah oleh fungsi `formatPrice()` menjadi `<span class="price-value">Rp 12.850.000</span>`, dan `thumbnail` dimasukkan ke atribut `src` elemen `<img>`. Kumpulan string kartu tersebut digabungkan dengan `.join("")` dan ditetapkan ke properti `innerHTML` dari elemen kontainer `#data-list` di DOM.

### 4. Apa yang terjadi jika internet terputus, endpoint salah, atau server mengembalikan HTTP 404/500? Jelaskan penanganannya.
**Jawaban:**  
Operasi asinkron dibungkus di dalam blok `try...catch` pada fungsi `loadData()`. Jika internet terputus, `fetch()` akan melempar TypeError. Jika URL salah atau mengembalikan 404/500, pemeriksaan `!response.ok` melempar Error. Saat error terjadi, blok `catch (error)` menangkap objek kesalahan dan memanggil fungsi `handleLoadError(error)`. Fungsi ini mengubah tampilan elemen notifikasi `#status` menjadi kotak peringatan berwarna tegas dengan teks deskripsi kegagalan, serta menyediakan dua tombol interaktif: tombol "Coba Lagi" (`#btn-retry`) untuk memanggil ulang `loadData()`, dan tombol "Gunakan Cadangan Offline" (`#btn-use-fallback`) yang mengisi array produk dengan dataset lokal di memori agar penguji tetap dapat mencoba seluruh fitur tanpa kendala.

### 5. Jelaskan bagaimana fitur berdasarkan digit Y bekerja. Cantumkan nama fungsi/event yang digunakan.
**Jawaban:**  
Fitur Y (NIM digit 1: Filter data + statistik sederhana) dikelola oleh fungsi utama `applyFilters()` di `apps.js`. Fungsi ini mendengarkan event `change` pada elemen dropdown `#category-filter`, event `input` pada kolom `#max-price`, dan event `change` pada `#sort-by`. Saat nilai kontrol berubah, `applyFilters()` mengambil nilai kategori yang dipilih dan harga maksimum. Menggunakan metode array murni `filter()`, sistem menyaring produk yang sesuai. Setelah itu, hasil filter diurutkan dengan `sort()`. Array hasil saringan kemudian diteruskan ke fungsi `renderStats(result)`. Di dalam `renderStats()`, fungsi bantu matematika di `utils.js` dipanggil: `hitungRataRataHarga(items)` yang memanfaatkan `reduce()` untuk menghitung rata-rata, `cariTermahal(items)` yang memanfaatkan `reduce()` untuk menemukan barang dengan harga tertinggi, `cariTermurah(items)` untuk barang termurah, dan `hitungJumlahKategori(items)` yang memanfaatkan `new Set()` untuk menghitung variasi kategori unik yang sedang tampil. Nilai statistik ini kemudian dirender ke elemen daftar definisi `<dl id="stats">`.

### 6. Jelaskan bagaimana validasi berdasarkan digit Z bekerja dan mengapa input tidak valid tidak boleh langsung diproses.
**Jawaban:**  
Validasi Z (NIM digit 6: Email valid + konfirmasi email) serta validasi keamanan form diterapkan secara komprehensif pada formulir konsultasi di bagian `#kontak` dan dikontrol oleh fungsi `initContactForm()` di `apps.js`. Validasi berjalan real-time saat pengguna mengetik (event `input`), saat input kehilangan fokus (event `blur`), dan saat formulir diserahkan (event `submit`):
1. **Validasi Nama (`validateNama`):** Memastikan nama terisi (minimal 3 karakter), menolak karakter angka atau simbol aneh dengan regex `/^[a-zA-Z\s'.-]+$/`, dan memblokir injeksi tag HTML/skrip.
2. **Validasi Email (`validateEmail`):** Memeriksa format standar email menggunakan pola regex `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`.
3. **Validasi Konfirmasi Email (`validateEmailConfirm`):** Memastikan kolom konfirmasi terisi dan memiliki teks yang cocok persis (case-insensitive) dengan email utama.
4. **Validasi Pesan (`validatePesan`):** Memeriksa panjang minimal 10 karakter dan memblokir tag HTML.

Jika terdapat ketidaksesuaian, teks pesan kesalahan spesifik disuntikkan ke elemen `<p id="...-error">` dan atribut `aria-invalid="true"` dipasang pada input yang salah, lalu kursor otomatis difokuskan ke field pertama yang bermasalah menggunakan method `.focus()`.  
Input tidak valid tidak boleh langsung diproses karena:
1. **Keamanan Aplikasi (Anti-XSS):** Mencegah potensi serangan Cross-Site Scripting (XSS) dari masukan pengguna.
2. **Integritas Data:** Mencegah kesalahan ketik alamat email yang mengakibatkan balasan konsultasi gagal sampai ke calon pelanggan.
3. **Pengalaman Pengguna (UX & Aksesibilitas):** Memberi umpan balik seketika yang jelas dan terarah kepada pengguna.

### 7. Jika project Anda menggunakan localStorage, jelaskan data apa yang disimpan, kapan data dibaca/diubah, dan alasan penggunaannya.
**Jawaban:**  
Project ini mengimplementasikan Challenge C (NIM C = 3: Toggle Grid/List yang disimpan di localStorage). Data yang disimpan adalah kunci string bernama `melodia_view_mode` dengan nilai `"grid"` atau `"list"`. Data ini diubah saat pengguna mengklik tombol Grid (`#btn-grid`) atau tombol List (`#btn-list`), di mana fungsi `setView(mode)` akan memperbarui kelas CSS `.list-view` pada kontainer `#data-list`, menyetel atribut aksesibilitas `aria-pressed`, dan mengeksekusi `localStorage.setItem(VIEW_KEY, mode)`. Data ini dibaca saat aplikasi pertama kali dimuat melalui fungsi `loadSavedView()`, yang memanggil `localStorage.getItem(VIEW_KEY)` di dalam blok `try...catch`. Alasan penggunaannya adalah untuk memberikan persistensi kenyamanan tampilan (*user experience*), sehingga pengguna yang lebih menyukai tata letak daftar (list) tidak perlu menyetel ulang pilihannya setiap kali me-refresh peramban.

### 8. Pilih satu fungsi JavaScript penting, lampirkan potongan maksimal 15 baris, lalu jelaskan input, proses, dan output.
**Jawaban:**  
Potongan fungsi dari berkas `utils.js`:
```javascript
function hitungRataRataHarga(items) {
  if (!items || items.length === 0) return 0;
  const total = items.reduce((sum, item) => sum + Number(item.price || 0), 0);
  return Math.round(total / items.length);
}
```
- **Input:** Parameter `items`, yaitu array objek produk instrumen musik yang lolos penyaringan filter.
- **Proses:** Memeriksa apakah array kosong untuk mencegah pembagian dengan nol (`NaN`). Jika ada data, metode `reduce()` menjumlahkan seluruh nilai numerik properti `price` dari setiap item menjadi nilai akumulator `total`. Nilai total tersebut kemudian dibagi dengan jumlah elemen `items.length` dan dibulatkan dengan `Math.round()`.
- **Output:** Sebuah nilai angka (*number*) yang merepresentasikan nilai rata-rata harga instrumen yang sedang tampil.

### 9. Sebutkan bug/error paling sulit selama PTS, penyebabnya, cara menemukannya, dan cara memperbaikinya.
**Jawaban:**  
**Bug yang Dihadapi:** Terjadi kesalahan CORS (*Cross-Origin Request Blocked*) saat mencoba memuat berkas `data/products.json` menggunakan fungsi `fetch()` ketika file HTML dibuka langsung dari media penyimpanan lokal melalui klik dua kali (protokol URL `file:///`).  
**Penyebab:** Kebijakan keamanan baku peramban modern (seperti Chrome dan Edge) memblokir pembacaan sumber daya asinkron antar-file lokal pada protokol `file://` karena ketiadaan origin HTTP yang valid.  
**Cara Menemukan:** Membuka Developer Tools (tombol F12) pada peramban, memeriksa tab *Console*, dan menemukan pesan galat bertuliskan `Fetch API cannot load file:///... URL scheme must be "http" or "https" for CORS request`.  
**Cara Memperbaiki:**  
1. Menambahkan petunjuk resmi di README untuk menjalankan aplikasi melalui server lokal seperti Visual Studio Code Live Server atau modul `http.server` Python.
2. Memperkuat fungsi `loadData()` dengan penanganan error yang menangkap kegagalan tersebut dan menyediakan tombol interaktif "Gunakan Cadangan Offline" (`#btn-use-fallback`) yang secara otomatis menyuplai data cadangan di memori agar penguji tetap dapat menguji fungsionalitas UI, filter, dan statistik secara luring tanpa hambatan.

### 10. Jika diberi satu minggu lagi, sebutkan dua perbaikan teknis yang akan Anda lakukan dan alasannya.
**Jawaban:**  
1. **Implementasi Pagination Terintegrasi URL Hash/Query Strings:**  
   *Alasan:* Jika jumlah inventaris instrumen musik bertambah hingga ratusan item, memuat seluruh data ke DOM sekaligus akan memperlambat waktu render pada perangkat berspesifikasi rendah. Dengan menambahkan pagination dan merefleksikan filter ke dalam URL hash, pengguna dapat membagikan tautan hasil pencarian spesifik kepada orang lain.
2. **Penambahan Fitur Komparasi Spesifikasi Alat Musik Berbasis LocalStorage:**  
   *Alasan:* Dalam konteks toko musik nyata, pembeli sering bingung membandingkan dua instrumen serupa (misalnya antara Fender Player Stratocaster dan Yamaha Pacifica 112V). Menambahkan fitur perbandingan berdampingan (*side-by-side comparison*) akan mempermudah calon musisi membuat keputusan pembelian.
