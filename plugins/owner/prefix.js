const handler = async (m, { args, usedPrefix, command, isOwner, updateData, reply }) => {
    
    const saveDb = async (col, val) => {
        try {
            await updateData('settings', 'bot', col, val);
        } catch (e) {
            console.error("Db Error:", e);
        }
    };

    if (command === 'setprefix') {
        if (!isOwner) return reply(mess.owner);
        if (!args[0]) {
            return reply(`💢 *Baka!* Cara makenya gini:\n\n` +
                `📝 *${usedPrefix}setprefix [prefix baru]*\n\n` +
                `✨ *Contoh:*\n` +
                `› ${usedPrefix}setprefix /\n` +
                `› ${usedPrefix}setprefix #`);
        }

        const newPrefix = args[0];
        const oldPrefix = global.prefix || '.';

        global.prefix = newPrefix;
        await saveDb('prefix', newPrefix);

        return reply(`✨ *Yatta!* Prefix berhasil diganti~\n\n` +
            `📌 *Dari:* ${oldPrefix}\n` +
            `📌 *Jadi:* ${newPrefix}\n\n` +
            `Sekarang pake *${newPrefix}* ya senpai! (◕‿◕)`);
    }

    if (command === 'delprefix') {
        if (!isOwner) return reply(mess.owner);

        global.prefix = '.';
        await saveDb('prefix', '.');

        return reply(`🔄 *Reset prefix!*\nPrefix balik lagi ke default *.*\n\nMakasih udah reset ya senpai~ (｡•̀ᴗ-)✧`);
    }

    if (command === 'prefix') {
        if (!isOwner) return reply(mess.owner);
        const mode = args[0] ? args[0].toLowerCase() : '';

        if (mode === 'on') {
            if (global.multiprefix) {
                return reply(`✨ *Udah aktif kok!* Gausah diulang-ulang (￣▽￣*)ゞ`);
            }
            
            global.multiprefix = true;
            await saveDb('multiprefix', 1);
            
            return reply(`🔛 *Mode prefix: ON*\n\n` +
                `Sekarang pake prefix *${usedPrefix}* ya!\n` +
                `Kalo mau ganti prefix: *${usedPrefix}setprefix*\n\n` +
                `*Nyaa~* semangat ngodingnya! (◕‿◕)`);
        }

        if (mode === 'off') {
            if (!global.multiprefix) {
                return reply(`💢 *Udah mati!* Masa gak sadar sih (｀へ´)`);
            }

            global.multiprefix = false;
            await saveDb('multiprefix', 0);
            
            return reply(`🔛 *Mode prefix: OFF*\n\n` +
                `Sekarang bisa pake bot tanpa prefix~\n` +
                `Tapi hati-hati ya nanti kepencet command nya wkwk 🗿`);
        }

        let status = global.multiprefix ? "✅ ON" : "❌ OFF";
        let p = global.prefix || '.';
        
        let msg = `╭─━━━━━━━━━━━━─╮\n` +
                  `│   *PREFIX INFO*  │\n` +
                  `╰─━━━━━━━━━━━━─╯\n\n` +
                  `📌 *Mode:* ${status}\n` +
                  `📌 *Prefix:* ${p}\n\n` +
                  `⚙️ *Command:*\n` +
                  `├ ${usedPrefix}prefix on\n` +
                  `├ ${usedPrefix}prefix off\n` +
                  `└ ${usedPrefix}setprefix\n\n` +
                  `📋 *Penjelasan:*\n` +
                  `├ ✅ ON  : Pake prefix dulu baru command\n` +
                  `└ ❌ OFF : Langsung ketik command aja\n\n` +
                  `✨ *Mau pilih yang mana hayo?* (◕‿◕)`;
        
        return reply(msg);
    }
};

handler.command = ["prefix", "setprefix", "delprefix"];
export default handler;