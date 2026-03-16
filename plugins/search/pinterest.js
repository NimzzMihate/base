import axios from "axios";

const handler = async (m, { text, usedPrefix, command, reply }) => {
  if (!text) return reply(`💢 *Baka!* Mau cari apa?\nContoh: *${usedPrefix + command}* Minecraft wallpaper`);

  try {
    const query = encodeURIComponent(text);
    const response = await axios.get(`https://api.siputzx.my.id/api/s/pinterest?query=${query}&type=image`);
    
    if (!response.data.status || !response.data.data.length) {
      return reply("💔 *Yah...* Gambar yang lu cari gak ketemu. Coba kata kunci lain deh (｡•́︿•̀｡)");
    }

    const results = response.data.data.slice(0, 5);
    
    for (let i = 0; i < results.length; i++) {
      const item = results[i];
      const caption = `✨ *Hasil ${i + 1} dari ${results.length}*\n\n` +
        `📌 *Judul:* ${item.grid_title || 'Gak ada judul'}\n` +
        `📝 *Deskripsi:* ${item.description || 'Gak ada deskripsi'}\n` +
        `👤 *Pinner:* ${item.pinner?.full_name || 'Unknown'} (@${item.pinner?.username || 'unknown'})\n` +
        `📊 *Reaksi:* ${item.reaction_counts?.['1'] || 0} ❤️\n` +
        `🔗 *Link:* ${item.pin || 'Gak ada link'}`;

      await sock.sendMessage(m.chat, {
        image: { url: item.image_url },
        caption: caption
      }, { quoted: m });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    await reply(`✨ *Yatta!* Udah dapet ${results.length} gambar. Happy window shopping~ (◕‿◕)`);

  } catch (err) {
    console.error(err);
    reply("💥 *Duh error...* Gagal nyari gambar. Coba lagi nanti ya (｡•́︿•̀｡)");
  }
};

handler.command = ["pinterest", "pin", "pt"];
export default handler;