import fs from "fs";
import path from "path";

const handler = async (m, { sock, usedPrefix }) => {
  const pluginsDir = path.join(process.cwd(), "plugins");
  
  // Baca semua kategori (folder) di plugins
  const categories = fs.readdirSync(pluginsDir).filter(f => {
    const fullPath = path.join(pluginsDir, f);
    return fs.statSync(fullPath).isDirectory();
  });

  let menuByCategory = {};
  let totalPlugins = 0;

  // Loop setiap kategori
  for (const category of categories) {
    const categoryPath = path.join(pluginsDir, category);
    const pluginFiles = fs.readdirSync(categoryPath).filter(f => f.endsWith(".js"));
    
    menuByCategory[category] = [];
    
    // Baca setiap file plugin untuk ambil command-nya
    for (const file of pluginFiles) {
      try {
        const filePath = path.join(categoryPath, file);
        const fileContent = fs.readFileSync(filePath, "utf8");
        
        // Regex buat nyari handler.command
        const commandMatch = fileContent.match(/handler\.command\s*=\s*(\[.*?\]|\[[^\]]*\])/s);
        
        if (commandMatch) {
          // Parse array dari string
          const commandString = commandMatch[1]
            .replace(/\s+/g, ' ')
            .replace(/'/g, '"')
            .replace(/,(\s*])/g, '$1');
          
          try {
            // Evaluate array dengan aman
            const commands = eval(commandString);
            if (Array.isArray(commands)) {
              // Ambil command pertama sebagai wakil
              menuByCategory[category].push({
                file: file,
                cmd: commands[0],
                allCmds: commands
              });
            }
          } catch (e) {
            // Fallback pake nama file
            menuByCategory[category].push({
              file: file,
              cmd: file.replace('.js', ''),
              allCmds: [file.replace('.js', '')]
            });
          }
        } else {
          // Fallback pake nama file
          menuByCategory[category].push({
            file: file,
            cmd: file.replace('.js', ''),
            allCmds: [file.replace('.js', '')]
          });
        }
        totalPlugins++;
      } catch (e) {
        console.log(`Gagal baca ${file}:`, e.message);
      }
    }
  }

  // Bangun teks menu
  let teks = `Halo *${m.pushName}* 👋\n`;
  teks += `Aku *${global.nameBot}*\n\n`;
  teks += `📊 *STATISTIK*\n`;
  teks += `• Plugins: ${totalPlugins}\n`;
  teks += `• Kategori: ${categories.length}\n`;
  teks += `• Prefix: ${global.prefix || '.'}\n`;
  teks += `• Mode: ${global.public ? 'Public' : 'Self'}\n\n`;

  // Tampilkan per kategori
  for (const category of categories) {
    const catName = category.toUpperCase();
    teks += `╭─ *${catName}*\n`;
    
    const plugins = menuByCategory[category] || [];
    
    // Urutin berdasarkan nama
    plugins.sort((a, b) => a.cmd.localeCompare(b.cmd));
    
    // Bikin kolom 2 biar rapi
    for (let i = 0; i < plugins.length; i += 2) {
      const left = plugins[i];
      const right = plugins[i + 1];
      
      if (right) {
        teks += `│ • ${usedPrefix}${left.cmd.padEnd(15)} • ${usedPrefix}${right.cmd}\n`;
      } else {
        teks += `│ • ${usedPrefix}${left.cmd}\n`;
      }
    }
    teks += `╰────────────\n\n`;
  }

  teks += `✨ *Total ${totalPlugins} plugin siap dipake!*`;

  await sock.sendMessage(m.chat, {
    text: teks,
    contextInfo: {
      externalAdReply: {
        title: global.nameBot,
        body: `✨ Hallo ${m.pushName}`,
        thumbnailUrl: global.thumbnail,
        sourceUrl: global.url,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m });
}

handler.command = ["menu", "mani"];
export default handler;