import util from 'util';
import { exec } from 'child_process';

let handler = async (m, { sock, reply, mess, isOwner, command, text, usedPrefix }) => { 
    if (!isOwner) return reply(mess.owner);
    
    const body = m.text.trim();
    const baseCommand = command.toLowerCase(); 
    let codeBody = text;
    
    if (baseCommand === '>' || baseCommand === '$') {
        codeBody = m.text.slice(usedPrefix.length + baseCommand.length).trim();
    }


    switch (baseCommand) {
        
        case 'ambilq':
        case 'q':
            try {
                if (!m.quoted) return reply(`Ex: ${usedPrefix}q (reply pesannya)`);
                const result = m.quoted;
                const output = util.inspect(result, { depth: 5 }); 
                await sock.sendMessage(m.chat, { text: output }, { quoted: m });
            } catch (err) {
                await sock.sendMessage(m.chat, { text: util.format(err) }, { quoted: m });
            }
            break;

        case 'eval':
            try {
                const code = codeBody;
                if (!code) return reply(`Ex: ${usedPrefix}eval kode yang mau di eval`);

                const AsyncFunction = Object.getPrototypeOf(async function() {}).constructor;
                const fn = new AsyncFunction("sock", "m", "reply", "text", "mess", "util", "usedPrefix", code); 
                const result = await fn(sock, m, reply, text, mess, util, usedPrefix);

                const output = typeof result === "string" ? result : util.inspect(result);
                await sock.sendMessage(m.chat, { text: output }, { quoted: m });
            } catch (err) {
                await sock.sendMessage(m.chat, { text: util.format(err) }, { quoted: m });
            }
            break;
            
        case '>':
            try {
                const code = codeBody;
                if (!code) return reply(`Ex: ${usedPrefix}> kodenya`);

                let result = await (async () => eval(code))();
                if (typeof result !== "string") result = util.inspect(result);
                
                await sock.sendMessage(m.chat, { text: result }, { quoted: m });
            } catch (err) {
                await sock.sendMessage(m.chat, { text: util.format(err) }, { quoted: m });
            }
            break;

        case '$':
            const shellCommand = codeBody;
            if (!shellCommand) return reply(`Ex: ${usedPrefix}$ command nya`);

            exec(shellCommand, (err, stdout, stderr) => {
                if (err) return sock.sendMessage(m.chat, { text: err.toString() }, { quoted: m });
                if (stdout) return sock.sendMessage(m.chat, { text: util.format(stdout) }, { quoted: m });
                if (stderr) return sock.sendMessage(m.chat, { text: util.format(stderr) }, { quoted: m });

                return sock.sendMessage(m.chat, { text: 'Done (No output)' }, { quoted: m });
            });
            break;
            
        default:
            break; 
    }
};

handler.command = ['ambilq', 'q', 'eval', '>', '$']; 
export default handler;