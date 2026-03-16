import fs from "fs";
import { exec } from "child_process";
import path from "path";

const handler = async (m, { sock, command, usedPrefix, reply }) => {
  const quoted = m.quoted || m;
  const mime = quoted.mimetype || "";

  if (!quoted) {
    return reply(`💢 *Baka!* Reply sticker nya dulu dong!\nContoh: *${usedPrefix + command}* (sambil reply sticker)`);
  }

  if (!/webp/.test(mime)) {
    return reply(`📛 *Hmmph!* Itu bukan sticker! Reply sticker yang bener ya senpai (｀へ´)`);
  }

  reply("⏳ *Ehehe~* Lagi ngubah sticker jadi gambar, tunggu bentar ya (◕‿◕)");

  try {
    const mediaPath = await sock.downloadAndSaveMediaMessage(quoted);
    const outputPath = `./data/trash/toimage_${Date.now()}.png`;

    if (!fs.existsSync("./data/trash")) {
      fs.mkdirSync("./data/trash", { recursive: true });
    }

    exec(`ffmpeg -i "${mediaPath}" "${outputPath}"`, async (err) => {
      fs.unlinkSync(mediaPath);

      if (err) {
        console.error(err);
        return reply("💥 *Duh error...* Gagal konversi sticker. Coba lagi ya (｡•́︿•̀｡)");
      }

      try {
        const buffer = fs.readFileSync(outputPath);
        
        await sock.sendMessage(m.chat, { 
          image: buffer, 
          caption: "✨ *Yatta!* Berhasil diubah ke gambar~\nIni dia hasilnya (◕‿◕)" 
        }, { quoted: m });

      } catch (e) {
        console.error(e);
        reply("💥 *Waduh...* Gagal ngirim gambar. Coba lagi ya!");
      } finally {
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }
      }
    });

  } catch (err) {
    console.error(err);
    reply("💥 *Error!* Gagal download sticker. Coba lagi ya senpai (｡•́︿•̀｡)");
  }
};

handler.command = ["toimage", "toimg"];
export default handler;