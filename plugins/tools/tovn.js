import fs from "fs";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handler = async (m, { sock, reply, usedPrefix, command }) => {
  const quoted = m.quoted ? m.quoted : m;
  const mime = (quoted.msg || quoted).mimetype || "";

  if (!/audio|video/.test(mime)) {
    return reply(`💢 *Baka!* Reply audio/video yang mau dijadikan VN!\nContoh: *${usedPrefix + command}* (sambil reply audio/video)`);
  }

  reply("⏳ *Ehehe~* Lagi ngubah jadi VN, tunggu bentar ya (◕‿◕)");

  try {
    const mediaPath = await sock.downloadAndSaveMediaMessage(quoted);
    const outPath = path.join(__dirname, `../data/trash/vn_${Date.now()}.ogg`);

    if (!fs.existsSync("./data/trash")) {
      fs.mkdirSync("./data/trash", { recursive: true });
    }

    await new Promise((resolve, reject) => {
      exec(
        `ffmpeg -y -i "${mediaPath}" -vn -c:a libopus -b:a 64k -ac 1 -ar 48000 -map_metadata -1 "${outPath}"`,
        (err) => {
          fs.unlinkSync(mediaPath);
          if (err) return reject(err);
          resolve();
        }
      );
    });

    await sock.sendMessage(
      m.chat,
      {
        audio: fs.readFileSync(outPath),
        mimetype: "audio/ogg; codecs=opus",
        ptt: true
      },
      { quoted: m }
    );

    fs.unlinkSync(outPath);
    
    reply("✨ *Yatta!* Berhasil jadi VN~\nUdah siap didengerin (◕‿◕)");

  } catch (err) {
    console.error(err);
    reply("💥 *Duh error...* Gagal konversi ke VN. Coba lagi ya (｡•́︿•̀｡)");
  }
};

handler.command = ["toptt", "tovn", "tovoicenote"];
export default handler;