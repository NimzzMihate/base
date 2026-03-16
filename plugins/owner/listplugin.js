import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handler = async (m, { isOwner, reply, usedPrefix }) => {
  try {
    if (!isOwner) return reply(mess.owner);

    const baseDir = path.join(__dirname, "../../plugins");
    if (!fs.existsSync(baseDir)) {
      return reply("📁 *Ehh...* Folder plugins-nya gak ada? aneh deh (・・?)ゞ");
    }

    const categories = fs.readdirSync(baseDir).filter(f => {
      const fullPath = path.join(baseDir, f);
      return fs.statSync(fullPath).isDirectory();
    });

    let totalFiles = 0;
    let teks = "📚 *── LIST PLUGIN ──* ✨\n\n";
    teks += `╭─━━━━━━━━━━━━─╮\n`;

    for (const category of categories) {
      const catPath = path.join(baseDir, category);
      const files = fs.readdirSync(catPath).filter(f => f.endsWith(".js"));
      totalFiles += files.length;

      teks += `│ *${category.toUpperCase()}* │\n`;
      teks += `├─━━━━━━━━━━━━─┤\n`;
      
      files.forEach((file, i) => {
        const icon = i === files.length - 1 ? "└" : "├";
        teks += `${icon} 📄 ${file}\n`;
      });
      teks += `├─━━━━━━━━━━━━─┤\n`;
    }

    teks += `╰─━━━━━━━━━━━━─╯\n\n`;
    teks += `📊 *Statistik*\n`;
    teks += `├ Total Plugin: ${totalFiles}\n`;
    teks += `└ Total Kategori: ${categories.length}\n\n`;
    teks += `⚙️ *Command*\n`;
    teks += `├ ${usedPrefix}getplugin category/file.js\n`;
    teks += `└ ${usedPrefix}addplugin category/file.js (reply kode)\n\n`;
    teks += `✨ *Yossha!* Tinggal pilih mau diapain~ (◕‿◕)`;

    return reply(teks);
    
  } catch (err) {
    console.error(err);
    reply("💥 *Waduh error...* Gagal baca daftar plugin. Coba lagi ya (｡•́︿•̀｡)");
  }
};

handler.command = ["listplugin", "listp", "listplugins", "lp"];
export default handler;