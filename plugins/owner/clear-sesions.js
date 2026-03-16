import fs from "fs";

const handler = async (m, { isOwner, reply }) => {
  if (!isOwner) return reply(mess.owner);

  const authPath = "./Auth";
  const trashPath = "./data/trash";

  if (!fs.existsSync(authPath)) fs.mkdirSync(authPath, { recursive: true });
  if (!fs.existsSync(trashPath)) fs.mkdirSync(trashPath, { recursive: true });

  const sessionFiles = fs.readdirSync(authPath).filter(f => f !== "creds.json");
  const trashFiles = fs.readdirSync(trashPath).filter(f => f !== "tmp");

  let deletedSessions = 0;
  let deletedTrash = 0;

  for (const file of sessionFiles) {
    try {
      fs.unlinkSync(`${authPath}/${file}`);
      deletedSessions++;
    } catch (e) {
      console.error(`Gagal hapus ${file}:`, e.message);
    }
  }

  for (const file of trashFiles) {
    try {
      fs.unlinkSync(`${trashPath}/${file}`);
      deletedTrash++;
    } catch (e) {
      console.error(`Gagal hapus ${file}:`, e.message);
    }
  }

  reply(`🧹 *Cleanup Complete!*
  
  • Session files: ${deletedSessions} terhapus
  • Trash files: ${deletedTrash} terhapus
  
  ${deletedSessions + deletedTrash > 0 ? '✅ Sukses' : '✨ Udah bersih senpai!'}`);
};

handler.command = ["clearsesi", "clsesi", "clearsession"];
export default handler;