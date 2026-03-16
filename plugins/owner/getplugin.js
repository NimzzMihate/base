import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handler = async (m, { isOwner, text, reply, usedPrefix, command }) => {
  try {
    if (!isOwner) return reply(mess.owner);

    const baseDir = path.join(__dirname, "../../plugins");

    if (!text || !text.endsWith(".js")) {
      return reply(`💢 *Baka!* Namanya harus pake .js!\nContoh: *${usedPrefix + command}* command/menu.js\n\nKetik *${usedPrefix}listplugin* buat liat daftarnya ya senpai! (｡•̀ᴗ-)✧`);
    }

    const targetPath = path.join(baseDir, text.trim());
    
    if (!fs.existsSync(targetPath)) {
      return reply(`🔍 *Uwaa...* Plugin *${text.trim()}* gak ditemukan! ༼;´༎ຶ ۝ ༎ຶ༽\nCek lagi pake *${usedPrefix}listplugin* ya~`);
    }

    const fileContent = fs.readFileSync(targetPath, "utf8");
    
    // Kalo kepanjangan nanti error, jadi dipotong aja
    if (fileContent.length > 4000) {
      return reply(`📜 *Wah panjang banget senpai!* (＞︿＜)\n\n${fileContent.substring(0, 3000)}\n\n... *[sisanya kepotong, soalnya kebanyakan]*`);
    }
    
    return reply(`📂 *Nih file pluginnya:*\n\n${fileContent}`);
    
  } catch (err) {
    console.error(err);
    return reply("💥 *Duh error...* Gagal baca plugin. Coba lagi ya (◡﹏◡✿)");
  }
};

handler.command = ["getp", "gp", "getplugin", "getplugins"];
export default handler;