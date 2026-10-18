# 📸 Dokumentasi Event Mini Soccer 2026

> **Warga Bojong Lio RW 028 — Kota Depok, Jawa Barat**
> Minggu, 18 Oktober 2026 • 07.00 – 13.00 WIB

Website dokumentasi resmi untuk event **Mini Soccer** yang diselenggarakan oleh
warga Bojong Lio RW 028. Website ini menyajikan galeri foto interaktif,
informasi acara, ruang komentar warga, serta fitur unduh dokumentasi —
dibangun dengan tampilan *Bootstrap classic* yang rapi, elegan, dan responsif
untuk desktop maupun mobile.

![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=flat-square&logo=bootstrap&logoColor=white)
![jQuery](https://img.shields.io/badge/jQuery-3.7-0769AD?style=flat-square&logo=jquery&logoColor=white)
![SweetAlert2](https://img.shields.io/badge/SweetAlert2-11-PaleVioletRed?style=flat-square)
![License](https://img.shields.io/badge/Copyright-Kafeinarts-yellow?style=flat-square)

---

## ✨ Daftar Isi

- [Ikhtisar Proyek](#-ikhtisar-proyek)
- [Fitur Unggulan](#-fitur-unggulan)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Struktur Direktori](#-struktur-direktori)
- [Panduan Instalasi](#-panduan-instalasi)
- [Cara Kerja Galeri & Optimasi Gambar](#-cara-kerja-galeri--optimasi-gambar)
- [Panduan Pengembang](#-panduan-pengembang)
- [Performa & Responsivitas](#-performa--responsivitas)
- [Aksesibilitas](#-aksesibilitas)
- [Rencana Pengembangan](#-rencana-pengembangan)
- [Kredit & Hak Cipta](#-kredit--hak-cipta)

---

## 🏟️ Ikhtisar Proyek

| Komponen | Keterangan |
| --- | --- |
| **Nama Event** | Mini Soccer Warga Bojong Lio |
| **Penyelenggara** | Warga Bojong Lio RW 028 |
| **Lokasi** | RW 028, Kota Depok, Jawa Barat |
| **Tanggal** | Minggu, 18 Oktober 2026 |
| **Waktu** | 07.00 – 13.00 WIB |
| **Total Dokumentasi** | 119 foto resolusi asli (4K) |
| **Sesi Acara** | 5 sesi (Persiapan → Penutupan) |

Proyek ini bersifat **static website** — tanpa backend, tanpa build step,
dan dapat langsung di-deploy ke layanan hosting statis apa pun
(GitHub Pages, Netlify, Vercel, dsb).

---

## ⚡ Fitur Unggulan

### 🖼️ Galeri Foto Interaktif
- **Grid gallery responsif** (1 kolom di mobile → 4 kolom di desktop XL) dengan efek *hover zoom* elegan.
- **Lazy loading** pada setiap gambar agar halaman tetap ringan meski ratusan foto.
- **Pagination "Muat Lebih Banyak"** — menampilkan 24 foto per batch agar tidak membebani browser.
- **Filter berdasarkan sesi acara** — Persiapan, Pembukaan, Babak 1, Babak 2, Penutupan (dengan badge jumlah foto).

### 🔍 Modal Detail Foto
Klik salah satu foto untuk membuka **modal detail** yang menampilkan:
- Gambar beresolusi menengah (1600px) dengan tombol **navigasi ◀ ▶** antar foto.
- **Panel info file** — kategori sesi, waktu pengambilan, dimensi (3840 × 2160 px), ukuran file, dan nama file.
- **Navigasi keyboard** — tombol `←` / `→` untuk berpindah foto saat modal terbuka.
- Tombol **Unduh Foto** (resolusi asli 4K), **Bagikan** (Web Share API + fallback salin tautan), dan **Tutup**.

### ⬇️ Sistem Download
- **Unduh per foto** — konfirmasi via SweetAlert2, file ditarik sebagai *blob* lalu disimpan otomatis ke perangkat (resolusi penuh).
- **Unduh semua foto** — proses *batch* berurutan dengan **progress bar** dan perhitungan jumlah file/total ukuran.
- **Request paket dokumentasi** — formulir (nama, nomor WhatsApp, jenis paket) dengan validasi via SweetAlert2, dilengkapi **kode request unik**.

### 💬 Komentar Warga
- Formulir komentar dengan **upload gambar** (validasi tipe & ukuran maksimal 5 MB).
- **Preview foto** sebelum kirim, dengan opsi hapus.
- Komentar tersimpan di **localStorage** browser (tanpa backend).
- Konfirmasi pengiriman elegan via SweetAlert2, daftar komentar tampil terbaru di atas, foto komentar dapat di-zoom.

### 📱 Desain Responsif
- Tampilan **rapi & elegan** mengikuti gaya *Bootstrap classic* dengan sentuhan tema olahraga (hijau lapangan + aksen kuning).
- **Sticky navbar** dengan efek *scroll*, highlight menu aktif otomatis, dan menu *hamburger* untuk mobile.
- **Tombol "Back to top"** yang muncul otomatis saat menggulir.
- Section statistik, rundown acara dalam bentuk tabel, serta footer lengkap dengan navigasi.

---

## 🛠️ Teknologi yang Digunakan

| Teknologi | Versi | Peran |
| --- | --- | --- |
| **HTML5** | — | Struktur halaman |
| **CSS3** | — | Tema kustom (`css/style.css`) |
| **Bootstrap** | 5.3.3 (CDN) | Grid, komponen UI, modal, navigasi |
| **Bootstrap Icons** | 1.11.3 (CDN) | Ikonografi |
| **jQuery** | 3.7.1 (CDN) | Manipulasi DOM, AJAX, event handling |
| **SweetAlert2** | 11.14.5 (CDN) | Dialog interaktif, toast, form request |
| **Google Fonts** | — | Poppins & Oswald |
| **Python + Pillow** | 3.x | Skrip generasi thumbnail/manifest |

> Semua pustaka diambil via **CDN** sehingga tidak memerlukan proses instalasi
> dependensi maupun *bundling*.

---

## 📁 Struktur Direktori

```
bojongliominisoccer2026/
├── index.html                 # Halaman utama (satu halaman / single page)
├── README.md                  # Dokumentasi proyek (file ini)
├── css/
│   └── style.css              # Tema kustom: variabel warna, hero, galeri, modal, responsif
├── js/
│   ├── gallery-data.js        # Manifest galeri (auto-generated, 119 entri foto)
│   └── main.js                # Logika utama: galeri, modal, download, komentar
└── assets/
    ├── *.jpg                  # Foto asli resolusi 4K (119 file, dipakai untuk unduh)
    ├── medium/                # Versi 1600px (dipakai di modal detail)
    └── thumb/                 # Thumbnail 640px (dipakai di grid galeri)
```

### 📊 Ringkasan Aset

| Jenis | Jumlah | Resolusi | Ukuran Total | Kegunaan |
| --- | --- | --- | --- | --- |
| `assets/*.jpg` | 119 | 3840 × 2160 | ~361 MB | Unduhan resolusi asli |
| `assets/medium/` | 119 | 1600px | ~43 MB | Tampilan modal detail |
| `assets/thumb/` | 119 | 640px | ~6.4 MB | Grid galeri (lazy load) |

---

## 🚀 Panduan Instalasi

### Prasyarat
- Web browser modern (Chrome, Firefox, Edge, Safari).
- (Opsional) Python 3 + Pillow — hanya diperlukan untuk mengatur ulang aset/galeri.
- (Opsional) Server lokal statis.

### Langkah Cepat

**1. Clone repositori**

```bash
git clone https://github.com/itsmebroarif/bojongliominisoccer2026.git
cd bojongliominisoccer2026
```

**2a. Buka langsung (paling cepat)**

Buka file `index.html` langsung di browser.

**2b. Jalankan lewat server lokal (disarankan untuk pengujian download)**

```bash
# Menggunakan Python
python3 -m http.server 8000

# atau menggunakan Node (npx)
npx serve .
```

Kemudian buka <http://localhost:8000>.

---

## 🎞️ Cara Kerja Galeri & Optimasi Gambar

Agar halaman tetap ringan meski berisi 119 foto beresolusi 4K, digunakan
strategi **tiga tingkat resolusi**:

| Tingkat | Ukuran | Lokasi | Digunakan Oleh |
| --- | --- | --- | --- |
| Thumbnail | 640px | `assets/thumb/` | Grid galeri (lazy load) |
| Medium | 1600px | `assets/medium/` | Modal detail & hero background |
| Original | 3840px | `assets/` | Proses unduh resolusi asli |

**Manifest galeri** (`js/gallery-data.js`) dibuat otomatis berisi metadata tiap foto:

```js
window.GALLERY_DATA = [
  {
    "id": 1,
    "file": "IMG_20261018_070753_111.jpg",
    "thumb":   "assets/thumb/IMG_20261018_070753_111.jpg",
    "medium":  "assets/medium/IMG_20261018_070753_111.jpg",
    "full":    "assets/IMG_20261018_070753_111.jpg",
    "time": "07:07:53",
    "cat": "persiapan",
    "catLabel": "Persiapan & Pendaftaran",
    "w": 3840, "h": 2160, "size": 3.89,
    "title": "Dokumentasi Mini Soccer — 07:07:53 WIB",
    "caption": "Persiapan & Pendaftaran • 18 Oktober 2026 • Bojong Lio RW 028, Kota Depok"
  },
  // ...119 entri
];
```

### 🗂️ Menambah / Mengatur Ulang Foto

Saat menambah foto baru ke `assets/`, jalankan ulang skrip berikut untuk
membuat versi thumbnail/medium dan memperbarui manifest:

```bash
python3 /tmp/gen_thumbs.py
```

> **Note:** Skrip tersebut mengelompokkan foto otomatis berdasarkan jam
> pengambilan ke dalam 5 sesi (`persiapan`, `pembukaan`, `pertandingan1`,
> `pertandingan2`, `penutupan`).

### 🔑 Kategori Sesi Otomatis

| Rentang Waktu | Kategori |
| --- | --- |
| sebelum 08.00 | Persiapan & Pendaftaran |
| 08.00 – 08.59 | Pembukaan & Pemanasan |
| 09.00 – 09.59 | Babak Pertama |
| 10.00 – 10.59 | Babak Kedua |
| 11.00 ke atas | Penutupan & Foto Bersama |

---

## 🧑‍💻 Panduan Pengembang

### Menyesuaikan Tema

Warna tema diatur melalui **variabel CSS** di bagian atas `css/style.css`:

```css
:root {
  --brand-green:   #14532d;   /* Hijau utama (tema lapangan) */
  --brand-green-2: #166534;   /* Hijau sekunder */
  --brand-accent:  #facc15;   /* Aksen kuning (sporty) */
  --brand-dark:    #0b1f17;   /* Gelap (navbar & footer) */
  --radius:        14px;      /* Radius sudut kartu */
}
```

### Memodifikasi Logika

Semua interaksi berada di `js/main.js`, dikelompokkan per blok:

| Blok | Fungsi |
| --- | --- |
| `NAVBAR` | Efek scroll, highlight menu aktif, back-to-top |
| `GALLERY` | Render grid, filter kategori, load more (24/batch) |
| `MODAL DETAIL` | Buka/tutup modal, navigasi prev/next & keyboard |
| `DOWNLOAD` | Unduh per foto (blob) & unduh semua (batch + progress) |
| `REQUEST PAKET` | Form request via SweetAlert2 + validasi |
| `KOMENTAR` | Upload gambar, preview, penyimpanan localStorage |

---

## ⚡ Performa & Responsivitas

| Aspek | Solusi |
| --- | --- |
| Beban awal halaman | Grid menampilkan 24 foto pertama + *lazy load* thumbnail |
| Ukuran transfer | Thumbnail 640px (~54 KB) untuk grid, 1600px hanya untuk modal |
| Navigasi banyak foto | Pagination "Muat Lebih Banyak" + filter sesi |
| Memori browser | Gambar modal dibersihkan saat ditutup |

**Uji responsivitas** pada breakpoint Bootstrap:
`xs (<576px)` • `sm (≥576px)` • `md (≥768px)` • `lg (≥992px)` • `xl (≥1200px)`

---

## ♿ Aksesibilitas

- Element `role="button"` + `tabindex="0"` pada kartu galeri agar dapat diakses lewat **keyboard**.
- Navigasi **keyboard** (`←` / `→`) untuk berpindah foto di dalam modal.
- Atribut `aria-label`, `aria-hidden`, dan `alt` deskriptif pada setiap gambar/ikon.
- Dukungan `prefers-reduced-motion` — animasi dinonaktifkan otomatis bagi pengguna yang memintanya.

---

## 🗺️ Rencana Pengembangan

Beberapa peningkatan yang memungkinkan dikembangkan lebih lanjut:

- [ ] Integrasi backend (Supabase / Firebase) untuk komentar & penyimpanan gambar permanen.
- [ ] Lightbox video (jika tersedia dokumentasi video).
- [ ] Papan skor / klasemen sementara antar tim warga.
- [ ] Ekspor album lengkap sebagai berkas ZIP terkompresi.
- [ ] Pencarian & pengurutan foto berdasarkan waktu.
- [ ] PWA (Progressive Web App) agar dapat diakses *offline*.

---

## 📜 Kredit & Hak Cipta

Website ini dirancang & dikembangkan oleh **Kafeinarts**.

🔗 **<https://kafeinarts-five.vercel.app/>**

```
Copyright © 2026 Dokumentasi Mini Soccer — Warga Bojong Lio RW 028, Kota Depok.
All rights reserved.
Design & Development by Kafeinarts.
```

Seluruh foto dokumentasi bersifat **terbuka untuk warga RW 028** dan
keperluan non-komersial. Dilarang menggunakan foto untuk kepentingan
komersial tanpa izin panitia.

---

<div align="center">

**Dibuat dengan ❤️ untuk Warga Bojong Lio RW 028**

*Jaga sportivitas, jaga kekompakan.*

</div>
