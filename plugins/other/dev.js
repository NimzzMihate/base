const handler = async (m, { sock }) => {
  await sock.sendContact(m.chat, [global.owner], global.nameOwner, "Developer", m);
  await sock.sendMessage(m.chat, { 
    text: `Halo *${m.pushName}*,\n\nIni kontak *${global.nameOwner}*.\nKalau ada error atau mau lapor sesuatu, langsung chat aja.` 
  }, { quoted: m });
};

handler.command = ["owner", "own"];
export default handler;