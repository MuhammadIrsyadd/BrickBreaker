# 🕹️ Retro Bounce: The 25th Chamber

**Retro Bounce: The 25th Chamber** adalah game arkade klasik *brick breaker* yang dibangun dengan teknologi modern (React + TypeScript + HTML5 Canvas) namun tetap mempertahankan estetika visual dan audio era 8-bit tahun 1980-an.

Hancurkan jalanmu melalui 25 level yang menantang, hadapi brick dengan ketahanan tinggi, dan taklukkan *The Ultimate Glitch Boss* di level terakhir!

---

## 🚀 Fitur Utama

- **25 Level Bertingkat:** Dari zona pemula yang santai hingga "Arcade Hell" yang sangat cepat.
- **Sistem Durabilitas Brick (HP):** Tidak semua brick hancur dalam satu kali pukul!
  - 🟥 **Neon Red:** 1 HP (Sekali pukul hancur)
  - 🟩 **Neon Green:** 2 HP
  - 🟦 **Electric Blue:** 3 HP
  - 🟨 **Retro Yellow:** 4 HP (Menyebabkan efek guncangan layar!)
  - ⬜ **Steel Grey:** *Indestructible* (Gunakan sebagai sudut pantul strategis).
- **Efek Visual Retro:** Filter CRT *scanlines*, guncangan layar (*screen shake*), dan partikel piksel dinamis.
- **Audio Chiptune:** Sintesis suara 8-bit real-time yang dihasilkan via Web Audio API.
- **High Score System:** Skor tertinggi Anda akan tersimpan secara otomatis di browser.

---

## 🎮 Cara Bermain

Tujuan Anda adalah menghancurkan semua brick yang dapat dihancurkan di layar untuk maju ke level berikutnya tanpa kehabisan nyawa.

### Kontrol:
- **Mouse / Touch:** Gerakkan kursor ke kiri dan kanan untuk menggerakkan Paddle.
- **Sudut Pantul:** Pantulan bola bersifat dinamis! 
  - Jika mengenai ujung kiri paddle, bola akan memantul tajam ke arah kiri.
  - Jika mengenai bagian tengah paddle, bola akan memantul lurus ke atas.
  - Gunakan ini untuk mengarahkan bola ke celah-celah sempit!

### Tips:
- Brick kuning memberikan poin besar tetapi memantulkan bola dengan sangat kuat.
- Jangan biarkan bola jatuh ke batas bawah layar, atau Anda akan kehilangan satu nyawa (❤).
- Anda memulai dengan 3 nyawa. Gunakan dengan bijak!

---

## 🛠️ Teknologi yang Digunakan

- **Frontend:** React.js, TypeScript
- **Rendering:** HTML5 Canvas API
- **Build Tool:** Vite
- **Audio:** Web Audio API (Chiptune Synthesis)
- **Styling:** Vanilla CSS (Neon Retro Aesthetic)

---

## 📦 Instalasi Lokal

Jika Anda ingin menjalankan game ini di mesin lokal Anda:

1. **Clone repository:**
   ```bash
   git clone https://github.com/MuhammadIrsyadd/BrickBreaker.git
   cd BrickBreaker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Jalankan aplikasi:**
   ```bash
   npm run dev
   ```

4. **Buka di browser:**
   Akses `http://localhost:5173` (atau port yang tertera di terminal).

---

## 📜 Lisensi

Proyek ini dibuat untuk tujuan pembelajaran dan hiburan. Bebas untuk dimodifikasi dan dikembangkan lebih lanjut!

---

**Dibuat dengan ❤️ oleh Gemini CLI.**
