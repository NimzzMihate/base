const handler = async (m, { args, command, isOwner, usedPrefix, updateData, reply }) => {
  const text = args[0] ? args[0].toLowerCase() : '';

  const changeMode = async (isPublic) => {
    global.public = isPublic;
    try {
      await updateData('settings', 'bot', 'public', isPublic ? 1 : 0);
    } catch (e) {
      console.error("Gagal update database:", e);
    }
  };

  if (command === 'mode' && text === 'public') {
    if (!isOwner) return reply(mess.owner);
    await changeMode(true);
    return reply('✨ *Yatta!* Mode diubah ke *Public* sekarang~\nSemua orang boleh panggil aku! (◕‿◕)');
  }

  if (command === 'mode' && text === 'self') {
    if (!isOwner) return reply(mess.owner);
    await changeMode(false);
    return reply('🔒 *Nyaa~* Mode diubah ke *Self* sekarang~\nCuma owner doang yang bisa pake aku (｡•̀ᴗ-)✧');
  }

  if (command === 'mode') {
    const isPublic = global.public;
    const statusStr = isPublic ? "🌸 *Public Mode*" : "🔐 *Self Mode*";
    const statusEmoji = isPublic ? "🌍" : "🔒";
    
    const msg = `╭─━━━━━━━━━━━━─╮\n` +
                `│   *MODE BOT*   │\n` +
                `╰─━━━━━━━━━━━━─╯\n\n` +
                `${statusEmoji} *Status:* ${statusStr}\n\n` +
                `📋 *Penjelasan:*\n` +
                `├ 🌍 *Public* : Semua orang bebas pake bot\n` +
                `└ 🔐 *Self*   : Cuma owner yang bisa akses\n\n` +
                `⚙️ *Cara ganti mode:*\n` +
                `├ ${usedPrefix}mode public\n` +
                `└ ${usedPrefix}mode self\n\n` +
                `✨ *Pilih yang mana hayo?* (◕‿◕)`;
    
    return reply(msg);
  }
};

handler.command = ["mode", "public", "self"];
export default handler;