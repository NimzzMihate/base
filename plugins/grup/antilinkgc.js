const handler = async (m, { args, command, usedPrefix, isAdmin, isBotAdmin, isOwner, updateData, reply }) => {
    
  if (!m.isGroup) {
    return reply(global.mess?.group || '✨ *Ehehe...* Ini mah buat di grup, bukan private chat! (◕‿◕)');
  }
  
  if (!isAdmin && !isOwner) {
    return reply(global.mess?.admin || '💢 *Baka!* Lu siapa? Ini cuma buat admin grup! (｀へ´)');
  }
  
  if (!isBotAdmin) {
    return reply(global.mess?.botAdmin || '📛 *Hmmph!* Jadiin bot admin dulu lah, masa gitu aja gak bisa~');
  }

  const text = args[0] ? args[0].toLowerCase() : '';

  if (text === 'on') {
    await updateData('groups', m.chat, 'antilink', 1);
    return reply(`🔒 *Yatta!* Fitur *Antilink* udah aktif!\nSekarang link WA bakal kehapus otomatis (◕‿◕)`);
  }

  if (text === 'off') {
    await updateData('groups', m.chat, 'antilink', 0);
    return reply(`🔓 *Nyaa~* Fitur *Antilink* udah dimatiin.\nSekarang bebas kirim link deh, tapi hati-hati ya~`);
  }

  let teks = `╭─━━━━━━━━━━━━─╮\n`;
  teks += `│   *ANTILINK*    │\n`;
  teks += `╰─━━━━━━━━━━━━─╯\n\n`;
  teks += `📋 *Cara pakai:*\n`;
  teks += `├ ${usedPrefix + command} on\n`;
  teks += `└ ${usedPrefix + command} off\n\n`;
  teks += `✨ *Mau diaktifin atau dimatiin?* (◕‿◕)`;
  
  return reply(teks);
};

handler.command = ['antilink', 'antilinkgc'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;