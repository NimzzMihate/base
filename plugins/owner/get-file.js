import fs from "fs";
import path from "path";

const handler = async (m, { sock, isOwner, text, reply, usedPrefix, command }) => {
  if (!isOwner) return reply(mess.owner);

  const botNumber = sock.user.id;

  if (!text) {
    return reply(`💢 *Baka!* Cara makenya gini:\n\n` +
      `📝 *${usedPrefix + command} ./path/file.js*\n` +
      `📝 *${usedPrefix + command} ./folder/file.js*\n\n` +
      `✨ *Contoh:*\n` +
      `› ${usedPrefix + command} ./package.json\n` +
      `› ${usedPrefix + command} ./data/settings.js`);
  }

  let filePath = text.trim();

  if (!fs.existsSync(filePath)) {
    return reply(`🔍 *Uwaa...* File *${filePath}* gak ditemukan! ༼;´༎ຶ ۝ ༎ຶ༽`);
  }

  if (!fs.statSync(filePath).isFile()) {
    return reply(`📁 *Ehh...* Itu folder, bukan file!\nCoba pake *${usedPrefix}listfile* buat liat daftarnya ya~`);
  }

  try {
    await reply("⏳ *Ehehe~* Lagi ambil file bentar, tunggu ya (◕‿◕)");

    let buffer = fs.readFileSync(filePath);
    let fileName = path.basename(filePath);
    let fileSize = global.bytesToSize ? global.bytesToSize(buffer.length) : `${buffer.length} bytes`;

    await sock.sendMessage(botNumber, {
      document: buffer,
      fileName,
      mimetype: "application/octet-stream",
      caption: `📂 *Nih file-nya!*\n\n` +
        `📌 *Nama:* ${fileName}\n` +
        `📦 *Size:* ${fileSize}\n` +
        `📍 *Path:* ${filePath}\n\n` +
        `✨ *Yatta!* Udah dikirim ke private chat ya senpai~`
    }, { quoted: m });

    await reply(`📬 *Nyar!* File *${fileName}* udah dikirim ke private chat. Cek aja (｡•̀ᴗ-)✧`);

  } catch (err) {
    console.log(err);
    return reply("💥 *Duh error...* Gagal ngirim file. Coba lagi ya (｡•́︿•̀｡)");
  }
};

handler.command = ["getfile", "ambilfile", "file", "dlfile"];
export default handler;