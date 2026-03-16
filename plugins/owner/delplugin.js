import fs from "fs"
import path from "path"
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handler = async (m, { sock, isOwner, text, command, reply, usedPrefix }) => {
  try {
    if (!isOwner) return reply(mess.own);

    if (!text || !text.endsWith(".js"))
      return reply(`Contoh: *${usedPrefix + command}* command/menu.js`);

    const baseDir = path.join(__dirname, "../../plugins");
    const targetPath = path.join(baseDir, text.trim());

    if (!fs.existsSync(targetPath))
      return reply(`Plugin *${text}* tidak ditemukan di folder plugins.`);

    fs.unlinkSync(targetPath);
    return reply(`Berhasil menghapus plugin *${text.trim()}*`);
  } catch (err) {
    console.error(err);
    reply("Terjadi kesalahan saat menghapus plugin.");
  }
};

handler.command = ["delp", "dp", "delplugin", "delplugins"];
export default handler;