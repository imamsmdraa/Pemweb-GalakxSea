# PEMBWEB-GALAXSEA

Website interaktif untuk menjelajahi kedalaman laut yang terinspirasi dari neal.fun/deep-sea. Scroll ke bawah untuk mengeksplorasi berbagai hewan laut di kedalaman yang berbeda.

## Fitur Utama

### Frontend
- **Scrolling Vertikal Interaktif**: Scroll untuk menyelami kedalaman laut hingga 11,000+ meter
- **Gradient Background Dinamis**: Warna berubah dari biru terang ke hitam pekat seiring kedalaman
- **Smooth Animations**: Menggunakan Framer Motion untuk animasi halus dan efek parallax
- **Hewan Laut Interaktif**: Klik hewan untuk melihat detail dalam modal pop-up
- **Indikator Kedalaman**: Menampilkan kedalaman real-time saat scroll
- **Efek Gelembung**: Animasi gelembung untuk suasana bawah laut yang immersive
- **Responsive Design**: Optimized untuk desktop dan mobile

### Backend & Admin Panel
- **Autentikasi Admin**: Login/logout dengan Supabase Auth
- **CRUD Lengkap**: 
  - Tambah hewan laut baru
  - Edit data hewan existing
  - Hapus hewan laut
  - Lihat semua hewan dalam database
- **Upload Gambar**: Support URL gambar untuk foto hewan
- **Setup Wizard**: Guided setup untuk membuat admin pertama dan seed data

## Teknologi

- **Frontend**: React.js + TypeScript
- **Styling**: Tailwind CSS v4
- **Animasi**: Framer Motion (Motion)
- **Backend**: Supabase
  - Database: PostgreSQL (Key-Value Store)
  - Auth: Supabase Authentication
  - API: Supabase Edge Functions (Hono)
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast)

## Cara Menggunakan

### Pertama Kali (Setup)
1. Aplikasi akan menampilkan Setup Wizard
2. Buat akun admin dengan:
   - Nama
   - Email
   - Password (minimal 6 karakter)
3. Pilih untuk menambah data sample atau mulai kosong
4. Selesai! Website siap digunakan

### Menjelajahi Laut
- Scroll ke bawah untuk menyelami kedalaman laut
- Perhatikan perubahan warna dari biru ke hitam
- Klik pada hewan laut untuk melihat detail:
  - Nama
  - Kedalaman habitat
  - Deskripsi lengkap
  - Foto

### Mengelola Data (Admin)
1. Klik tombol di pojok kanan bawah
2. Login dengan akun admin
3. Di Admin Panel:
   - Tambah hewan baru dengan form
   - Edit hewan existing dengan klik ikon pensil
   - Hapus hewan dengan klik ikon tempat sampah
   - Lihat semua hewan dalam list

## Struktur Data Hewan Laut

Setiap hewan laut memiliki:
- **Nama**: Nama spesies
- **Kedalaman**: Dalam meter (menentukan posisi di scroll)
- **Deskripsi**: Informasi tentang hewan
- **URL Gambar**: Link ke foto hewan

## Zona Kedalaman

- **0m**: Permukaan
- **0-200m**: Zona Epipelagik (Sinar matahari)
- **200-1000m**: Zona Mesopelagik (Twilight zone)
- **1000-4000m**: Zona Bathypelagik (Midnight zone)
- **4000-6000m**: Zona Abisopelagik (Abyssal zone)
- **6000m+**: Zona Hadal (Palung terdalam)

## API Endpoints

### Public
- `GET /creatures` - Ambil semua hewan laut

### Protected (Perlu autentikasi)
- `POST /creatures` - Tambah hewan baru
- `PUT /creatures/:id` - Update hewan
- `DELETE /creatures/:id` - Hapus hewan

### Auth
- `POST /admin/signup` - Daftar admin baru

## Deployment

Website ini berjalan di Figma Make environment dengan:
- Vite development server (auto-running)
- Supabase backend (sudah terkonfigurasi)
- Auto-reload saat ada perubahan code

## Credits

Dibuat dengan Claude Code untuk eksplorasi laut interaktif.
Terinspirasi dari neal.fun/deep-sea
