<div align="center">
  <img src="https://files.catbox.moe/qhi155.jpg" alt="Bot Logo" width="200"/>

Base Bot WhatsApp dengan Struktur ESM Modern

</div>

✨ FITUR UTAMA

Kategori Fitur
📁 File Manager Add/Get/Del Plugin, List File, Ganti File
👤 Owner Backup, Restart, Clear Session, Mode, Prefix, Eval
🛠️ Tools Sticker, To Image/Video/VN, Tourl, Get
👥 Group Antilink, Welcome (coming soon)
🍄 Lainnya Ping, Runtime, Owner Info, Sosial Media, Payment

🎮 DAFTAR COMMAND

📁 FILE MANAGER

Command Fungsi Contoh
.addplugin Tambah plugin baru (reply kode) .addplugin main/menu.js
.listplugin Lihat daftar plugin .listplugin
.delplugin Hapus plugin .delplugin main/menu.js
.getplugin Ambil kode plugin .getplugin main/menu.js
.gantifile Ganti file dengan reply dokumen .gantifile ./package.json
.getfile Ambil file tertentu .getfile ./settings.js
.listfile List semua file .listfile

👤 OWNER MENU

Command Fungsi Contoh
.backup Backup semua file (dikirim ke PC) .backup
.restart Restart bot .restart
.clearsesi Bersihkan file session & sampah .clearsesi
.mode Lihat/ganti mode bot .mode public / .mode self
.setprefix Ganti prefix .setprefix /
.prefix Aktif/nonaktifkan prefix .prefix on / .prefix off
.delprefix Reset prefix ke default .delprefix
.q / .eval Ambil isi quoted message / eval kode .q (reply pesan)
> Eksekusi kode JavaScript > 2 + 2
$ Eksekusi command shell $ ls -la

🛠️ TOOLS MENU

Command Fungsi Contoh
.sticker Buat sticker dari gambar/video Reply foto + .sticker
.toimage Ubah sticker ke gambar Reply sticker + .toimage
.tovid Ubah sticker animasi ke video Reply sticker + .tovid
.tovn Ubah video/audio ke voice note Reply video + .tovn
.tourl Upload media ke catbox.moe Reply media + .tourl
.get GET request ke URL .get https://api.example.com
.pinterest Cari gambar di Pinterest .pinterest minecraft wallpaper
.tiktokstalk Stalk akun TikTok .tiktokstalk username

👥 GROUP MENU

Command Fungsi Contoh
.antilink Aktifkan proteksi link grup .antilink on / .antilink off
.swgc Upload status grup (admin only) Reply media + .swgc

🍄 OTHER MENU

Command Fungsi Contoh
.menu Menampilkan menu utama .menu
.ping Cek kecepatan response bot .ping
.owner Lihat kontak owner .owner
.runtime Lihat lama bot aktif .runtime
.sosial Lihat sosial media .sosial
.payment Lihat list pembayaran .payment
.tqto Lihat credits & thanks to .tqto

⚙️ KONFIGURASI

Edit file settings.js untuk menyesuaikan:

```javascript
// ===== INFO OWNER =====
global.owner = ["6282137487477"]      // Nomor owner (bisa lebih dari satu)
global.nameOwner = "Nimzz"            // Nama owner
global.nameBot = "Base Bot"           // Nama bot
global.versi = "1.0.0"                // Versi bot

// ===== MEDIA =====
global.foto = "https://files.catbox.moe/qhi155.jpg"        // Foto profil
global.thumbnail = "https://files.catbox.moe/ck6mr8.jpg"   // Thumbnail menu
global.url = "https://nimzz-portfolio-web.vercel.app/"     // Website

// ===== SOCIAL MEDIA =====
global.sosial = {
  ig: "https://instagram.com/username",
  fb: "https://facebook.com/username",
  tt: "https://tiktok.com/@username",
  yt: "https://youtube.com/@username",
  gh: "https://github.com/username",
  tg: "https://t.me/username"
}

// ===== PAYMENT =====
global.payment = {
  dana: "082137487477",
  ovo: "-",
  gopay: "082137487477",
  qris: "https://example.com/qris.jpg"
}
```

🗃️ STRUKTUR DATABASE

Bot menggunakan SQLite3 dengan 3 tabel utama:

📊 Tabel Users

Menyimpan data pengguna:

· id (PRIMARY KEY) - Nomor WhatsApp
· name - Nama pengguna
· limit_val - Limit penggunaan (default 20)
· balance - Saldo/koin (default 0)
· premium - Status premium (0/1)
· health, stamina - Untuk fitur RPG
· level, exp, role - Leveling system
· potion, iron, gold, diamond - Item RPG

👥 Tabel Groups

Menyimpan setting grup:

· id (PRIMARY KEY) - ID grup
· welcome - On/off welcome message
· goodbye - On/off goodbye message
· antilink - Proteksi link
· antidelete - Anti hapus pesan
· antiviewonce - Lihat pesan sekali
· antitoxic - Filter kata kasar
· antibot - Anti bot lain
· rpg_mode - Mode RPG di grup

⚙️ Tabel Settings

Menyimpan setting bot:

· id (PRIMARY KEY) - 'bot'
· prefix - Prefix yang digunakan
· multiprefix - Mode prefix (on/off)
· public - Mode bot (public/self)

📁 STRUKTUR FOLDER

```
📦 base-bot-whatsapp
├── 📂 plugins           # Folder plugin (fitur-fitur)
│   ├── 📂 main         # Menu utama, ping, owner
│   ├── 📂 tools        # Sticker, toimage, tourl
│   ├── 📂 group        # Antilink, dll
│   └── 📂 ...          # Kategori lain
├── 📂 lib              # Library internal
│   ├── database.js     # Koneksi & fungsi database
│   ├── plugins.js      # Plugin loader
│   ├── config.js       # Config message parser
│   ├── logger.js       # Logging system
│   └── webp.js         # Sticker maker
├── 📂 data             # Data & database
│   ├── database.db     # File SQLite
│   └── 📂 trash        # File sementara
├── 📂 Auth             # Session auth (auto generate)
├── index.js            # Main file
├── handler.js          # Message handler
├── settings.js         # Konfigurasi bot
└── package.json        # Dependencies
```

🎨 RESPONSE STYLE

Bot menggunakan gaya respon imut ala anime dengan variasi:

Sukses

```
✨ Yatta! Berhasil nyimpen plugin~
🌸 Yeay! Udah selesai~
🎉 Ehehe~ Berhasil!
```

Error

```
💢 Baka! Itu salah~
💥 Duh error... Coba lagi ya
📛 Hmmph! Gitu aja gak bisa~
```

Processing

```
⏳ Ehehe~ Lagi diproses...
🔍 Ngetik-ngetik dulu~
⏪ Sabar bentar ya~
```

🚀 FITUR YANG AKAN DATANG

· Sistem Level & XP - Naik level dengan aktif di grup
· RPG Game - Hunting, mining, battle
· Welcome/Goodbye - Custom message dengan media
· AI Chat - Integrasi Gemini/OpenAI
· Downloader - TikTok, YouTube, Instagram
· Image Editor - Resize, filter, meme maker
· Reminder - Pengingat otomatis
· Polling - Buat polling di grup

📝 LISENSI

Proyek ini dilisensikan di bawah MIT License - lihat file LICENSE untuk detail.

🙏 THANKS TO

· Allah SWT
· Kedua orang tua
· Nimzz - Penyedia base script
· WhiskeySockets - Baileys library
· Yang share ilmu dan code
· Para pengguna dan kontributor
· Semua yang udah support

---

<div align="center">
  <p>Made with ❤️ by <b>Nimzz</b></p>
  <p>✨ Happy Coding! ✨</p>
</div>