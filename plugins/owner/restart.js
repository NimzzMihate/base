import { spawn } from "child_process";

const handler = async (m, { isOwner, reply }) => {
  if (!isOwner) return reply(mess.owner);
  
  await reply('🔄 *Restarting bot...*');
  
  setTimeout(() => {
    const newProcess = spawn(process.argv[0], process.argv.slice(1), {
      detached: true,
      stdio: "inherit"
    });
    process.exit(0);
  }, 2000);
};

handler.command = ["rst", "restart"];
export default handler;