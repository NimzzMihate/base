import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handler = async (m, { isOwner, text, reply, usedPrefix, command }) => {
  try {
    if (!isOwner) return reply(mess.owner);

    if (!text || !m.quoted || !m.quoted.text) {
      return reply(`💢 *Baka!* Cara makenya gini:\n*${usedPrefix + command}* command/menu.js\n\n*terus reply kodenya ya senpai!* (｀へ´)`);
    }

    if (!text.endsWith(".js")) {
      return reply(`📛 *Hmmph!* Namanya harus pake .js dong!\nContoh: *${usedPrefix + command}* command/menu.js`);
    }

    const filePath = path.join(__dirname, "../../plugins", text.trim());
    const dirPath = path.dirname(filePath);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(filePath, m.quoted.text);

    return reply(`🌸 *Yatta!* Berhasil nyimpen plugin di:\n*${text.trim()}*\n\nSenpai keren deh! (◕‿◕)`);

  } catch (err) {
    console.error(err);
    reply("💥 *Doki doki...* Error pas nyimpen plugin. Coba lagi ya, jangan nyerah! (｡•́︿•̀｡)");
  }
};

handler.command = ["addp", "addplugin", "addplugins", "saveplugin", "saveplugins", "svp", "sp"];
export default handler;