import { downloadContentFromMessage } from "@whiskeysockets/baileys";
import fs from "fs";
import path from "path";

const handler = async (m, { isOwner, text, reply, example, usedPrefix }) => {
  if (!isOwner) return reply(mess.owner);
  if (!m.quoted || m.quoted.mtype !== "documentMessage") 
    return reply("⚠️ Reply document yang mau diganti!");
  if (!text || !text.includes("./")) 
    return reply(example(`filenya mana?\nContoh: ${usedPrefix + command} ./package.json`));

  const filePath = text.trim();
  const targetDir = path.dirname(filePath);
  
  if (!fs.existsSync(targetDir)) 
    return reply(`❌ Folder ${targetDir} gak ada!`);
  if (!fs.existsSync(filePath)) 
    return reply(`❌ File ${filePath} gak ditemukan!`);

  try {
    await reply("⏳ Lagi proses...");
    
    const media = await downloadContentFromMessage(m.quoted, "document");
    let buffer = Buffer.from([]);
    for await (const chunk of media) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    
    fs.writeFileSync(filePath, buffer);
    reply(`✅ Berhasil replace file *${path.basename(filePath)}*`);
    
  } catch (err) {
    console.error(err);
    reply("❌ Gagal: " + err.message);
  }
};

handler.command = ["gfl", "gantifile", "ubahfile"];
export default handler;