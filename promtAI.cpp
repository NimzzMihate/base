// kalo mau ngembangin tuh ada promt, tapi jgn keseringan pake ai juga sih dan jangan terlalu bergantungan ke ai nah mending kirim file ke ai biar tahu 
// rekomendasi ai untuk mengembangkan fitur deepseek, claude


📦 PROMPT LENGKAP SUPER DETAIL UNTUK DEVELOP BOT

╔══════════════════════════════════════════════════════════╗
║                 BOT WHATSAPP PLUGIN GENERATOR            ║
╚══════════════════════════════════════════════════════════╝

🧩 INFO BASE BOT

```
├─ Nama Bot : [BASE BOT ESM]
├─ Version : 1.0.0
├─ Database : SQLite3 (./data/database.db)
├─ Plugin Dir : /plugins/[kategori]/
├─ Main File : index.js, handler.js, plugins.js
├─ Settings : global variable di settings.js
└─ Response Style : Anime theme with cute reactions
```

📚 VARIABLE GLOBAL YANG TERSEDIA

```javascript
// ========== DARI SETTINGS.JS ==========
global.owner = ["628xxx"]              // Nomor owner
global.nameOwner = "Nimzz"             // Nama owner
global.nameBot = "Base Bot"             // Nama bot
global.versi = "1.0.0"                  // Versi bot
global.url = "https://..."              // Website
global.foto = "https://..."             // Foto profil
global.thumbnail = "https://..."        // Thumbnail
global.idCh = "120363...@newsletter"    // Newsletter ID

// ========== SOCIAL MEDIA ==========
global.sosial = {
  ig: "https://instagram.com/...",
  fb: "https://facebook.com/...",
  tt: "https://tiktok.com/@...",
  yt: "https://youtube.com/@...",
  gh: "https://github.com/...",
  tg: "https://t.me/..."
}

// ========== PAYMENT ==========
global.payment = {
  dana: "082137487477",
  ovo: "-",
  gopay: "082137487477",
  qris: "https://example.com/qris.jpg"
}

// ========== MESSAGES ==========
global.mess = {
  owner: "❌ Perintah ini hanya untuk owner bot!",
  admin: "❌ Perintah ini hanya untuk admin grup!",
  botAdmin: "❌ Bot harus menjadi admin!",
  group: "❌ Perintah ini hanya bisa digunakan di dalam grup!",
  premium: "❌ Fitur ini hanya untuk user premium!",
  private: "❌ Perintah ini hanya bisa digunakan di chat pribadi!"
}
```

🎯 PARAMETER YANG TERSEDIA DI HANDLER

```javascript
const handler = async (m, { 
    // ===== CORE =====
    sock,           // Object socket (buat kirim pesan, media, dll)
    reply,          // Fungsi reply (otomatis pake thumbnail)
    usedPrefix,     // Prefix yang dipake user (., !, #, dll)
    command,        // Nama command yang dipake (menu, ping, dll)
    
    // ===== TEXT PROCESSING =====
    text,           // Full text setelah command (string)
    args,           // Array dari text (split spasi)
    
    // ===== USER INFO =====
    sender,         // JID pengirim (628xxx@s.whatsapp.net)
    pushName,       // Nama yang tersimpan di kontak
    isOwner,        // Boolean: true kalo owner
    isPremium,      // Boolean: true kalo premium user
    isBan,          // Boolean: true kalo dibanned
    
    // ===== GROUP INFO =====
    isGroup,        // Boolean: true kalo di grup
    isAdmin,        // Boolean: true kalo admin grup
    isBotAdmin,     // Boolean: true kalo bot admin
    groupName,      // Nama grup
    groupMembers,   // Array anggota grup
    groupAdmins,    // Array admin grup
    
    // ===== QUOTED MESSAGE =====
    quoted,         // Pesan yang di-reply (objek lengkap)
    mime,           // Mimetype dari quoted message
    quotedMsg,      // Isi pesan yang di-reply
    quotedSender,   // Pengirim pesan yang di-reply
    
    // ===== DATABASE FUNCTIONS =====
    getUser,        // Function: getUser(jid, name) -> ambil data user
    getGroup,       // Function: getGroup(jid) -> ambil data grup
    updateData,     // Function: updateData(table, id, column, value)
    incrementData,  // Function: incrementData(table, id, column, value)
    getSettings,    // Function: getSettings() -> ambil settings bot
    
    // ===== UTILITY =====
    getPluginStats  // Function: getPluginStats() -> statistik plugin
}) => {
    // ISI PLUGIN DISINI
}
```

🛠️ FUNGSI BAWAAN YANG BISA DIPAKE

```javascript
// ===== 1. FUNGSI REPLY =====
await reply("Halo guys!")  
// Output: Pesan dengan thumbnail otomatis

// ===== 2. KIRIM MEDIA =====
// Kirim gambar
await sock.sendMessage(m.chat, {
    image: { url: "https://..." },
    caption: "Captionnya"
}, { quoted: m })

// Kirim video
await sock.sendMessage(m.chat, {
    video: { url: "https://..." },
    caption: "Captionnya"
}, { quoted: m })

// Kirim audio sebagai VN
await sock.sendMessage(m.chat, {
    audio: { url: "https://..." },
    mimetype: "audio/ogg; codecs=opus",
    ptt: true
}, { quoted: m })

// Kirim sticker dari gambar
await sock.sendImageAsSticker(m.chat, "path/gambar.jpg", m, {
    packname: "Sticker By",
    author: global.nameOwner
})

// Kirim dokumen
await sock.sendMessage(m.chat, {
    document: fs.readFileSync("file.pdf"),
    fileName: "dokumen.pdf",
    mimetype: "application/pdf"
}, { quoted: m })

// Kirim kontak
await sock.sendContact(m.chat, [global.owner], global.nameOwner, "Developer", m)

// Kirim reaction
await sock.sendMessage(m.chat, {
    react: { text: "✅", key: m.key }
})

// ===== 3. DOWNLOAD MEDIA =====
// Download dan simpan ke file
const mediaPath = await sock.downloadAndSaveMediaMessage(quoted)
const buffer = fs.readFileSync(mediaPath)

// ===== 4. DATABASE OPERATIONS =====
// Ambil data user (otomatis buat kalo belum ada)
const user = await getUser(m.sender, m.pushName)
console.log(user.balance, user.limit_val, user.exp)

// Ambil data grup
const group = await getGroup(m.chat)
console.log(group.antilink, group.welcome)

// Update data
await updateData('users', m.sender, 'balance', 1000)
await updateData('groups', m.chat, 'antilink', 1)

// Increment data
await incrementData('users', m.sender, 'exp', 10)

// ===== 5. UTILITY FUNCTIONS =====
// Delay
await sleep(2000)  // tunggu 2 detik

// Download dari URL
const buffer = await getBuffer("https://...")

// Fetch JSON
const data = await fetchJson("https://api...")

// Format bytes
const size = global.bytesToSize(1024)  // "1 KB"

// Format runtime
const uptime = global.runtime(process.uptime())  // "1d 2h 3m"

// Format tanggal
const date = global.tanggal(Date.now())  // "Senin, 16/March/2026"

// Ucapan otomatis
const greet = global.ucapan()  // "Good morning 🌅"

// Random nama file
const filename = global.getRandom(".jpg")  // "1234.jpg"

// Capitalize
const text = global.capital("hello")  // "Hello"
```

📋 STRUKTUR PLUGIN WAJIB

```javascript
// ================================================
// PLUGIN: [Nama Fitur]
// COMMAND: [command1, command2]
// CATEGORY: [main/owner/tools/game/group]
// DESCRIPTION: [Deskripsi singkat]
// ================================================

// Import library yang diperlukan
import fs from "fs"
import axios from "axios"

// Handler utama (WAJIB)
const handler = async (m, { 
    sock, reply, usedPrefix, command, text, args, 
    isOwner, isAdmin, isBotAdmin, isGroup,
    quoted, mime, getUser, updateData 
}) => {
    
    // ===== 1. VALIDASI AWAL =====
    // Cek syarat khusus (owner/admin/group)
    if (command === "fitur-rahasia" && !isOwner) {
        return reply(mess.owner)
    }
    
    // Cek group
    if (!isGroup) {
        return reply("✨ Fitur ini buat di grup ya~")
    }
    
    // Cek text
    if (!text) {
        return reply(`💢 *Baka!* Cara makenya:\n${usedPrefix + command} [teks]\nContoh: ${usedPrefix + command} Halo`)
    }
    
    // Cek quoted
    if (!quoted) {
        return reply(`📛 Reply pesan yang mau diproses!`)
    }
    
    // Cek mime
    if (!/image/.test(mime)) {
        return reply(`💢 Itu bukan gambar! Reply foto dulu~`)
    }
    
    // Cek angka
    const angka = parseInt(text)
    if (isNaN(angka)) {
        return reply(`📛 Itu bukan angka!`)
    }
    
    // ===== 2. COOLDOWN SYSTEM =====
    // Cooldown per user (5 detik)
    const cooldown = new Map()
    if (cooldown.has(m.sender)) {
        const lastTime = cooldown.get(m.sender)
        if (Date.now() - lastTime < 5000) {
            const sisa = Math.ceil((5000 - (Date.now() - lastTime)) / 1000)
            return reply(`⏳ Sabar bang, ${sisa} detik lagi...`)
        }
    }
    cooldown.set(m.sender, Date.now())
    
    // ===== 3. LOGIKA UTAMA =====
    try {
        // Kasih response processing
        await reply("⏳ *Ehehe~* Lagi diproses, tunggu bentar ya (◕‿◕)")
        
        // Logic disini
        const result = await axios.get(`https://api.example.com?q=${encodeURIComponent(text)}`)
        
        if (!result.data.status) {
            return reply("💔 Waduh, datanya gak ada~")
        }
        
        // ===== 4. KIRIM RESPONSE =====
        // Format response sukses
        const caption = `✨ *HASILNYA* ✨\n\n` +
            `📌 *Judul:* ${result.data.title}\n` +
            `📝 *Deskripsi:* ${result.data.desc}\n` +
            `🔗 *Link:* ${result.data.url}\n\n` +
            `🎉 *Yatta!* Udah dapet~ (◕‿◕)`
        
        await reply(caption)
        
        // Kalo ada gambar
        if (result.data.image) {
            await sock.sendMessage(m.chat, {
                image: { url: result.data.image },
                caption: "Nih gambarnya~"
            }, { quoted: m })
        }
        
        // Kalo pake reaction
        await sock.sendMessage(m.chat, {
            react: { text: "✅", key: m.key }
        })
        
    } catch (err) {
        // ===== 5. ERROR HANDLING =====
        console.error(`Error di ${command}:`, err)
        
        if (err.code === 'ENOTFOUND') {
            return reply("🌐 *Duh error...* Koneksi internet bermasalah! (｡•́︿•̀｡)")
        }
        
        if (err.response?.status === 404) {
            return reply(`🔍 *Yah...* Data *${text}* gak ketemu. Coba kata kunci lain~`)
        }
        
        if (err.response?.status === 429) {
            return reply("⏱️ *Waduh...* Kebanyakan request, tunggu bentar lagi~")
        }
        
        reply("💥 *Duh error...* Gagal proses. Coba lagi nanti ya (｡•́︿•̀｡)")
    }
}

// ===== PROPERTIES PLUGIN =====
handler.command = ["command1", "command2", "alias"]  // WAJIB ARRAY
handler.tags = ["kategori1", "kategori2"]            // Untuk grouping
handler.desc = "Deskripsi fitur"                     // Deskripsi singkat
handler.example = "command teks"                      // Contoh penggunaan
handler.limit = false                                 // Pake limit?
handler.cooldown = 5000                               // Cooldown dalam ms

// Syarat khusus (opsional)
handler.group = true      // Hanya di grup
handler.admin = true      // Hanya admin
handler.botAdmin = true   // Bot harus admin
handler.owner = true      // Hanya owner
handler.premium = true    // Hanya premium

// ===== EXPORT =====
export default handler
```

🎨 RESPONSE STYLE GUIDE

```javascript
// ===== RESPONSE SUKSES =====
"✨ *Yatta!* [pesan sukses] (◕‿◕)"
"🎉 *Ehehe~* [pesan sukses]"
"🌸 Berhasil! [pesan sukses]"
"✅ Sukses! [pesan sukses]"

// ===== RESPONSE ERROR =====
"💢 *Baka!* [pesan error] (｀へ´)"
"💥 *Duh error...* [pesan error] (｡•́︿•̀｡)"
"📛 *Hmmph!* [pesan error]"
"❌ Yah error: [pesan error]"

// ===== RESPONSE PROCESSING =====
"⏳ *Ehehe~* [proses] tunggu bentar ya (◕‿◕)"
"🔍 *Ngetik...* Lagi [proses]..."
"⏪ Sabar ya, lagi [proses]..."

// ===== RESPONSE VALIDASI =====
"💢 *Baka!* Cara makenya:\n[contoh]"
"📛 Yang bener dong! [petunjuk]"
"✨ Gunakan: .[command] [argumen]"

// ===== RESPONSE COOLDOWN =====
"⏳ Sabar bang, [detik] detik lagi..."
"💢 Jangan spam! Tunggu [detik] detik~"
```

📂 CONTOH KATEGORI PLUGIN

```
📁 plugins/
├── 📁 main/           # Menu utama, ping, info
├── 📁 owner/          # Backup, restart, eval, clearsesi
├── 📁 tools/          # Sticker, toimage, tourl, tovid
├── 📁 group/          # Antilink, welcome, goodbye
├── 📁 game/           # Tebak gambar, suit, puzzle
├── 📁 downloader/     # TikTok, YouTube, IG
├── 📁 ai/             # ChatGPT, Gemini, AI image
├── 📁 islamic/        # Quran, jadwal sholat
├── 📁 random/         # Quotes, fakta, pantun
└── 📁 rpg/            # Inventory, battle, mining
```

🚀 TEMPLATE PROMPT SIAP PAKE

```
╔══════════════════════════════════════════════════════════╗
║                    PLUGIN REQUEST FORM                   ║
╚══════════════════════════════════════════════════════════╝

## 🎯 FITUR YANG DIMINTA
Nama Fitur: [isi]
Command: [isi, pisah pake koma]
Kategori: [main/owner/tools/game/group/downloader/ai]

## 📝 DESKRIPSI
[Penjelasan singkat tentang fitur ini]

## ⚙️ CARA PENGGUNAAN
Contoh 1: .[command] [argumen]
Contoh 2: .[command] (reply media)
Contoh 3: .[command] on/off

## 🔧 TEKNIS
Butuh API? [iya/tidak]
- Endpoint: [url]
- Method: [GET/POST]
- API Key: [ada/tidak]

Butuh Database? [iya/tidak]
- Tabel: [nama tabel]
- Kolom: [kolom yang diperlukan]

Library tambahan: [axios/fs/cheerio/dll]

## 🎨 RESPONSE YANG DIINGINKAN
- Kalo sukses: [contoh response]
- Kalo error: [contoh response]
- Kalo salah input: [contoh response]

## ✅ FITUR TAMBAHAN
- [ ] Cooldown [berapa detik]
- [ ] Limit usage
- [ ] Premium only
- [ ] Admin only
- [ ] Group only

## 📋 SYARAT & VALIDASI
- [ ] Cek argument kosong
- [ ] Cek reply (jika perlu)
- [ ] Cek mime type (jika media)
- [ ] Validasi URL (jika ada)
- [ ] Anti-spam

## 💡 FITUR SPESIAL (opsional)
[Tambahkan fitur khusus yang diinginkan]

---

Tolong buatkan plugin lengkap dengan:
1. Import statements
2. Handler dengan parameter lengkap
3. Validasi berantai
4. Cooldown system
5. Logic utama dengan try-catch
6. Response dengan gaya anime
7. Export default

Makasih! 🗿
```

🎮 CONTOH PROMPT REAL

```
╔══════════════════════════════════════════════════════════╗
║                    PLUGIN REQUEST FORM                   ║
╚══════════════════════════════════════════════════════════╝

## 🎯 FITUR YANG DIMINTA
Nama Fitur: TikTok Downloader
Command: tiktok, tt, downloadtt
Kategori: downloader

## 📝 DESKRIPSI
Download video TikTok tanpa watermark. User tinggal kirim link TikTok, bot akan download dan kirim videonya.

## ⚙️ CARA PENGGUNAAN
Contoh 1: .tiktok https://tiktok.com/@user/video/123456
Contoh 2: .tt https://vm.tiktok.com/abc123

## 🔧 TEKNIS
Butuh API? iya
- Endpoint: https://api.tikmate.io/api?url=
- Method: GET
- API Key: tidak ada

Butuh Database? tidak

Library tambahan: axios, fs

## 🎨 RESPONSE YANG DIINGINKAN
✅ Sukses: 
"✨ *Yatta!* Video berhasil didownload~
📥 *Ukuran:* [size]
⏱️ *Durasi:* [duration]
🎵 *Music:* [music title]
(◕‿◕)"

❌ Error:
"💢 *Baka!* Linknya gak valid atau video private (｀へ´)"

⚠️ Salah input:
"📛 Cara makenya: .tiktok [link]"

## ✅ FITUR TAMBAHAN
- [✅] Cooldown 10 detik
- [ ] Limit usage
- [ ] Premium only
- [ ] Admin only
- [ ] Group only

## 📋 SYARAT & VALIDASI
- [✅] Cek argument kosong
- [✅] Validasi URL TikTok
- [✅] Anti-spam

Tolong buatkan plugin lengkap! 🗿
```

📤 HASIL YANG DIHARAPKAN

```javascript
// ================================================
// PLUGIN: TikTok Downloader
// COMMAND: tiktok, tt, downloadtt
// CATEGORY: downloader
// ================================================

import axios from "axios"
import fs from "fs"

// Cooldown map
const cooldown = new Map()

const handler = async (m, { sock, reply, usedPrefix, command, text, args }) => {
    
    // Validasi input
    if (!text) {
        return reply(`💢 *Baka!* Linknya mana?\nContoh: ${usedPrefix + command} https://tiktok.com/@user/video/123`)
    }
    
    // Validasi URL TikTok
    const urlRegex = /(https?:\/\/)?(www\.)?(tiktok\.com|vm\.tiktok\.com)\/\S+/
    if (!urlRegex.test(text)) {
        return reply(`📛 *Hmmph!* Itu bukan link TikTok! (｀へ´)`)
    }
    
    // Cooldown check
    if (cooldown.has(m.sender)) {
        const lastTime = cooldown.get(m.sender)
        const timeLeft = 10000 - (Date.now() - lastTime)
        if (timeLeft > 0) {
            return reply(`⏳ Sabar bang, ${Math.ceil(timeLeft/1000)} detik lagi...`)
        }
    }
    
    try {
        await reply("⏳ *Ehehe~* Lagi download video, tunggu bentar ya (◕‿◕)")
        
        // Panggil API
        const apiUrl = `https://api.tikmate.io/api?url=${encodeURIComponent(text)}`
        const response = await axios.get(apiUrl)
        
        if (!response.data || !response.data.video_url) {
            return reply("💔 Waduh, videonya gak bisa di download~")
        }
        
        const videoUrl = response.data.video_url
        const videoData = await axios.get(videoUrl, { responseType: 'arraybuffer' })
        const buffer = Buffer.from(videoData.data)
        
        // Kirim video
        await sock.sendMessage(m.chat, {
            video: buffer,
            caption: `✨ *Yatta!* Video berhasil didownload~\n📥 *Ukuran:* ${global.bytesToSize(buffer.length)}\n\n(◕‿◕)`
        }, { quoted: m })
        
        // Set cooldown
        cooldown.set(m.sender, Date.now())
        
    } catch (err) {
        console.error("TikTok error:", err)
        reply("💥 *Duh error...* Gagal download. Coba lagi nanti ya (｡•́︿•̀｡)")
    }
}

handler.command = ["tiktok", "tt", "downloadtt"]
handler.tags = ["downloader"]
handler.desc = "Download video TikTok tanpa watermark"
handler.example = "tiktok https://tiktok.com/@user/video/123"
handler.cooldown = 10000

export default handler
```

🎯 TIPS MEMBUAT PROMPT

✅ DO's:

1. Sebutin command yang diinginkan - biar gak nebak-nebak
2. Kasih contoh penggunaan - biar jelas formatnya
3. Sebutin API endpoint - kalo pake API eksternal
4. Kasih sample response - biar sesuai ekspektasi
5. Sebutin fitur tambahan - cooldown, limit, dll

❌ DON'Ts:

1. Jangan ambigu - "bikin fitur keren" gak jelas
2. Jangan lupa kasih kategori
3. Jangan lupa validasi apa aja yang perlu dicek

📌 FORMAT PROMPT COPY-PASTE

```
Tolong buatkan plugin WhatsApp dengan spesifikasi:

FITUR: [nama fitur]
COMMAND: [command1, command2]
KATEGORI: [kategori]

DESKRIPSI:
[deskripsi singkat]

CARA PAKAI:
.[command] [argumen] - [penjelasan]
.[command] (reply media) - [penjelasan]

API (jika ada):
Endpoint: [url]
Method: [GET/POST]

VALIDASI:
- Cek argument kosong
- Cek reply (jika perlu)
- Cek mime type (jika media)
- Validasi URL

RESPONSE:
Sukses: "[response sukses dengan emoji]"
Error: "[response error dengan emoji]"
Salah input: "[response salah input]"

FITUR TAMBAHAN:
- Cooldown [detik] detik
- [fitur lain]

Buatkan dengan gaya coding rapi dan respon lucu ala anime. Makasih!
```