import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import * as cheerio from "cheerio";

async function webp2mp4File(path) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!fs.existsSync(path)) throw new Error("File gak ada bro!");

      const form = new FormData();
      form.append("new-image-url", "");
      form.append("new-image", fs.createReadStream(path));

      const upload = await axios({
        method: "post",
        url: "https://ezgif.com/webp-to-mp4",
        data: form,
        maxRedirects: 5,
        timeout: 60000,
        headers: {
          ...form.getHeaders(),
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      const $ = cheerio.load(upload.data);
      const file = $('input[name="file"]').attr("value");
      if (!file) throw new Error("Gagal upload ke ezgif");

      const form2 = new FormData();
      form2.append("file", file);
      form2.append("convert", "Convert WebP to MP4!");

      const convert = await axios({
        method: "post",
        url: "https://ezgif.com/webp-to-mp4/" + file,
        data: form2,
        maxRedirects: 5,
        timeout: 60000,
        headers: {
          ...form2.getHeaders(),
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      const $$ = cheerio.load(convert.data);
      const src = $$("#output > p.outfile > video > source").attr("src");
      if (!src) throw new Error("Gagal ambil link hasil!");

      resolve({
        status: true,
        result: "https:" + src,
      });
    } catch (err) {
      reject(err);
    }
  });
}

const handler = async (m, { sock, reply, usedPrefix, command }) => {
  const quoted = m.quoted ? m.quoted : m;
  const mime = (quoted.msg || quoted).mimetype || "";

  if (!/webp/.test(mime)) {
    return reply(`💢 *Baka!* Reply sticker animated nya dulu!\nContoh: *${usedPrefix + command}* (sambil reply sticker)`);
  }

  reply("⏳ *Ehehe~* Lagi ngubah sticker jadi video, tunggu bentar ya (◕‿◕)");

  try {
    const media = await sock.downloadAndSaveMediaMessage(quoted);
    const result = await webp2mp4File(media);

    await sock.sendMessage(m.chat, {
      video: { url: result.result },
      caption: "✨ *Yatta!* Berhasil jadi video~\nIni dia hasilnya (◕‿◕)",
    }, { quoted: m });

    fs.unlinkSync(media);
    
  } catch (err) {
    console.error(err);
    reply("💥 *Duh error...* Gagal konversi sticker. Coba lagi ya (｡•́︿•̀｡)");
  }
};

handler.command = ["tovid", "tovideo"];
export default handler;