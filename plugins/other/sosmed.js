const handler = async (m, { reply }) => {
  const sosial = global.sosial;
  
  let teks = `🌐 *SOCIAL MEDIA* 🌐\n\n`;
  
  if (sosial.ig) teks += `📷 *Instagram:* ${sosial.ig}\n`;
  if (sosial.fb) teks += `📘 *Facebook:* ${sosial.fb}\n`;
  if (sosial.tt) teks += `🎵 *TikTok:* ${sosial.tt}\n`;
  if (sosial.yt) teks += `📺 *YouTube:* ${sosial.yt}\n`;
  if (sosial.gh) teks += `🐙 *GitHub:* ${sosial.gh}\n`;
  if (sosial.tg) teks += `✈️ *Telegram:* ${sosial.tg}\n`;
  
  teks += `\n✨ *Jangan lupa follow ya!*`;

  reply(teks);
};

handler.command = ["sosial", "sosmed", "social"];
export default handler;