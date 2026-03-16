import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const handler = async (m, { sock, isOwner, reply, botNumber }) => {
  const sender = m.sender.split("@")[0];
  
  // Cek owner pake global.mess yang udah ada
  if (sender !== global.owner && m.sender !== botNumber) {
    return reply(mess.owner);
  }

  const d = new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const date = `${day}-${month}-${year}`;

  function jam(tz = "Asia/Jakarta") {
    return new Date().toLocaleTimeString("id-ID", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }
  
  try {
    // Bersihin folder sampah dulu biar rapi ✨
    const tmpDir = "./data/trash";
    if (fs.existsSync(tmpDir)) {
      const files = fs.readdirSync(tmpDir).filter(f => !f.endsWith(".js"));
      let deleted = 0;
      for (let file of files) {
        try {
          fs.unlinkSync(`${tmpDir}/${file}`);
          deleted++;
        } catch (e) {}
      }
      if (deleted > 0) console.log(`🧹 Bersihin ${deleted} file sampah~`);
    }

    await reply("⏳ *Ehehe~* Lagi backup bentar ya, jangan kemana-mana (◕‿◕)");

    const name = `backup-${date}`;
    const exclude = ["node_modules", "Auth", "package-lock.json", "yarn.lock", ".npm", ".cache"];
    const filesToZip = fs.readdirSync(".").filter(f => !exclude.includes(f) && f !== "");

    if (!filesToZip.length) {
      return reply("💢 *Baka!* Gak ada file yang bisa di-backup nih! (｀へ´)");
    }

    execSync(`zip -r ${name}.zip ${filesToZip.join(" ")}`);

    await sock.sendMessage(m.sender, {
      document: fs.readFileSync(`./${name}.zip`),
      fileName: `${name}.zip`,
      caption: `🌸 *Backup Berhasil!* 🌸
      
📅 *Tanggal:* ${global.tanggal(Date.now())}
⏰ *Waktu:* ${jam("Asia/Jakarta")} WIB
📦 *Size:* ${global.bytesToSize(fs.statSync(`./${name}.zip`).size)}

✨ *Yatta!* Source code aman terkendali~
💬 *Jangan lupa disimpen baik-baik ya senpai!* (◕‿◕)`,
      mimetype: "application/zip"
    }, { quoted: m });

    fs.unlinkSync(`./${name}.zip`);

    if (m.chat !== m.sender) {
      await reply("📬 *Nyar!* File backup udah dikirim ke private chat, cek aja (｡•̀ᴗ-)✧");
    }

  } catch (err) {
    console.error("Backup Error:", err);
    reply("💥 *Duh error...* Gagal backup, coba lagi ya (｡•́︿•̀｡)");
  }
};

handler.command = ["backup", "bck", "backupsc"];
export default handler;