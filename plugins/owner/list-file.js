import fs from "fs";
import path from "path";

const ignoredFolders = [
  "sessions", "session", "auth", "Auth", ".sessions",
  "node_modules", "npm", ".npm", "_npm", ".git", "tmp", "temp"
];

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  for (let file of files) {
    const fullPath = path.join(dir, file);
    const relPath = path.relative(process.cwd(), fullPath);
    
    if (ignoredFolders.some(folder => relPath.startsWith(folder))) continue;

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }

  return fileList;
}

const handler = async (m, { isOwner, reply, usedPrefix }) => {
  if (!isOwner) return reply(mess.owner);

  try {
    await reply("🔍 *Ngetik...* Lagi nyari file satu-satu, jangan kemana-mana ya (◕‿◕)");

    const root = process.cwd();
    const allFiles = getAllFiles(root);

    if (allFiles.length === 0) {
      return reply("💢 *Hmmph!* Gak ada file satupun? Beneran? (｀へ´)");
    }

    let text = `📂 *── LIST FILE ──* ✨\n\n`;
    text += `📊 *Total: ${allFiles.length} file*\n`;
    text += `╭─━━━━━━━━━━━━─╮\n\n`;

    // Kasih 20 file pertama aja biar gak kepanjangan
    const maxShow = 20;
    const showFiles = allFiles.slice(0, maxShow);
    
    showFiles.forEach((f, i) => {
      const fileName = path.basename(f);
      const filePath = f.replace(root + "/", "");
      const icon = i === showFiles.length - 1 ? "└" : "├";
      text += `${icon} 📄 ${fileName}\n  ↳ *${filePath}*\n\n`;
    });

    if (allFiles.length > maxShow) {
      text += `└ *...dan ${allFiles.length - maxShow} file lainnya*\n\n`;
    }

    text += `╰─━━━━━━━━━━━━─╯\n\n`;
    text += `⚙️ *Command*\n`;
    text += `├ ${usedPrefix}gantifile\n`;
    text += `└ ${usedPrefix}getfile\n\n`;
    text += `✨ *Yossha!* Udah keluar semua~ (◕‿◕)`;

    reply(text);

  } catch (err) {
    console.log(err);
    reply("💥 *Waduh error...* Gagal baca file. Coba lagi ya (｡•́︿•̀｡)");
  }
};

handler.command = ["listfile", "lf", "listfiles"];
export default handler;