const handler = async (m, { sock, isOwner, reply }) => {
  if (!isOwner) return reply(mess.owner);

  async function getLidFromJid(id, sock) {
    if (id.endsWith('@lid')) return id;
    const res = await sock.onWhatsApp(id).catch(() => []);
    return res[0]?.lid || id;
  }
  
  global.getLidFromJid = getLidFromJid;

  let who;

  if (m.isGroup) {
    if (m.mentionedJid && m.mentionedJid[0]) {
      who = m.mentionedJid[0];
    } else if (m.quoted) {
      who = m.quoted.sender;
    } else {
      who = m.sender;
      reply("🔍 *Nggak ada yang ditag atau reply, jadi ambil LID kamu aja ya* (◕‿◕)");
    }
  } else {
    who = m.sender;
  }

  if (!who) {
    return reply("💢 *Baka!* Cara makenya: reply pesan, tag orang, atau di private chat aja (｀へ´)");
  }

  try {
    let lid = await global.getLidFromJid(who, sock);
    
    let teks = `╭─━━━━━━━━━━━━─╮\n`;
    teks += `│   *LID RESULT*   │\n`;
    teks += `╰─━━━━━━━━━━━━─╯\n\n`;
    teks += `👤 *JID:* \`${who}\`\n`;
    teks += `🔖 *LID:* \`${lid}\`\n\n`;
    teks += `✨ *Yatta!* Berhasil dapet LID nya~ (◕‿◕)`;
    
    reply(teks);
  } catch (e) {
    console.error(e);
    reply("💥 *Duh error...* Gagal ambil LID. Coba lagi ya (｡•́︿•̀｡)");
  }
};

handler.command = ["getlid", "tolid"];
export default handler;