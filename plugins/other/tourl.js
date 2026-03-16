import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import { fileTypeFromBuffer } from "file-type";
import { downloadContentFromMessage } from "@whiskeysockets/baileys";

async function uploadCatbox(buffer) {
  const type = await fileTypeFromBuffer(buffer);
  const ext = type?.ext || "bin";
  const form = new FormData();
  form.append("reqtype", "fileupload");
  form.append("fileToUpload", buffer, {
    filename: "file." + ext,
    contentType: type?.mime || "application/octet-stream"
  });

  const res = await axios.post(
    "https://catbox.moe/user/api.php",
    form,
    { headers: form.getHeaders() }
  );

  return res.data.trim();
}

async function downloadMedia(sock, message) {
  try {
    const stream = await downloadContentFromMessage(message.msg || message, message.mtype?.replace(/Message/i, '') || '');
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
  } catch (err) {
    console.error('Download error:', err);
    return null;
  }
}

const handler = async (m, { sock, reply }) => {
  let mediaPath = null;
  
  try {
    const q = m.quoted || m;
    const mime = (q.msg || q).mimetype || "";

    if (!/image|video|audio|application/.test(mime)) {
      return reply("💢 *Baka!* Reply media dulu (foto/video/audio/dokumen) (｀へ´)");
    }

    await reply("⏳ *Ehehe~* Lagi upload, tunggu bentar ya (◕‿◕)");

    const buffer = await downloadMedia(sock, q);
    if (!buffer) return reply("💥 Gagal download media!");

    const url = await uploadCatbox(buffer);
    
    reply(`✨ *Yatta!* Upload berhasil~\n\n📌 *URL:* ${url}\n\n📦 *Size:* ${global.bytesToSize ? global.bytesToSize(buffer.length) : buffer.length + ' bytes'}`);

  } catch (e) {
    console.error(e);
    reply("💥 *Duh error...* Gagal upload. Coba lagi ya (｡•́︿•̀｡)");
  }
};

handler.command = ["tourl", "reurl", "urlmaker"];
export default handler;