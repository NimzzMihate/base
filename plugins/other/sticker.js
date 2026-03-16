import fs from "fs";

const handler = async (m, { sock, command, reply, usedPrefix }) => {
  const qmsg = m.quoted ? m.quoted : m;
  const mime = qmsg.mimetype || qmsg.msg?.mimetype || "";

  if (!/image|video/.test(mime))
    return reply(`Kirim atau reply foto/video dengan caption *${usedPrefix + command}*`);

  if (/video/.test(mime)) {
    if ((qmsg.seconds || 0) > 15)
      return reply("Durasi video maksimal 15 detik!");
  }

  try {
    const mediaPath = await sock.downloadAndSaveMediaMessage(qmsg);

    await sock.sendImageAsSticker(
      m.chat,
      mediaPath,
      m,
      { 
        packname: global.nameBot,
        author: global.nameOwner
      }
    );

    fs.unlinkSync(mediaPath);
  } catch (err) {
    console.error(err);
    reply("❌ Gagal membuat sticker!");
  }
};

handler.command = ["sticker", "stiker", "sgif", "s"];
export default handler;