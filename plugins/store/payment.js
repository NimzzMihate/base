const handler = async (m, { sock, reply }) => {
  const pay = global.payment;
  
  let teks = `💳 *LIST PAYMENT* 💳\n\n`;
  
  if (pay.dana && pay.dana !== '-') teks += `📱 *DANA:* ${pay.dana}\n`;
  if (pay.ovo && pay.ovo !== '-') teks += `📱 *OVO:* ${pay.ovo}\n`;
  if (pay.gopay && pay.gopay !== '-') teks += `📱 *GoPay:* ${pay.gopay}\n`;
  
  teks += `\n✨ *Makasih udah support!* (◕‿◕)`;

  // Kirim teks dulu
  await reply(teks);

  // Kalo ada qris, kirim gambarnya
  if (pay.qris && pay.qris !== '-' && pay.qris.startsWith('http')) {
    await sock.sendMessage(m.chat, {
      image: { url: pay.qris },
      caption: '📸 *QRIS -* Scan aja ya~'
    }, { quoted: m });
  }
};

handler.command = ["payment", "pay", "donasi"];
export default handler;