import * as fsp from "fs/promises";
import * as fss from "fs";
import { fileURLToPath, pathToFileURL } from "url";

import { handleMessage, getPluginStats } from "./lib/plugins.js";
import { getGroup, updateData, getSettings } from "./lib/database.js";
import { colorize, printLog } from "./lib/logger.js";

process.on("uncaughtException", (err) => {
    printLog("error", `Unhandled Exception: ${err}`);
});

export async function caseHandler(sock, m, chatUpdate) {
    const msgBody = (
        m.mtype === "conversation" ? m.message.conversation :
        m.mtype === "imageMessage" ? m.message.imageMessage.caption :
        m.mtype === "videoMessage" ? m.message.videoMessage.caption :
        m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text :
        m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId :
        m.mtype === "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
        m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId :
        m.mtype === "interactiveResponseMessage" ? JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id :
        ""
    ) || "";

    try {
        const basePrefix = global.prefix || ".";
        const prefixRgx = /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#%^&.©^]/gi;
        const strictMode = global.multiprefix === true;

        let activePrefix = "";
        let hasCmd = false;

        if (strictMode) {
            if (msgBody.startsWith(basePrefix)) {
                activePrefix = basePrefix;
                hasCmd = true;
            }
        } else {
            const matched = msgBody.match(prefixRgx);
            if (matched) {
                activePrefix = matched[0];
                hasCmd = true;
            } else {
                activePrefix = "";
                hasCmd = true;
            }
        }

        const cmdName = hasCmd ? msgBody.slice(activePrefix.length).trim().split(" ").shift().toLowerCase() : "";
        const cmdArgs = hasCmd ? msgBody.slice(activePrefix.length).trim().split(/ +/).slice(1) : [];
        const cmdText = cmdArgs.join(" ");
        const quotedMsg = m.quoted ? m.quoted : m;
        const mimeType = quotedMsg?.msg?.mimetype || quotedMsg?.mimetype || null;
        const rawQuoted = m.quoted || m;
        const fullQuery = msgBody.trim().split(/ +/).slice(1).join(" ");
        const selfJid = await sock.decodeJid(sock.user.id);

        const isOwner = global.owner.includes(
            m.sender.replace(/@s\.whatsapp\.net$/, "")
        ) || m.fromMe;

        const groupMeta = m?.isGroup ? await sock.groupMetadata(m.chat).catch(() => ({})) : {};
        const groupTitle = m?.isGroup ? groupMeta.subject || "" : "";
        const memberList = m?.isGroup ? groupMeta.participants?.map(p => {
            let role = null;
            if (p.admin === "superadmin") role = "superadmin";
            else if (p.admin === "admin") role = "admin";
            return { id: p.id || null, jid: p.jid || null, role, raw: p };
        }) || [] : [];
        
        const groupCreator = m?.isGroup ? memberList.find(p => p.role === "superadmin")?.jid || "" : "";
        const adminList = memberList.filter(p => p.role === "admin" || p.role === "superadmin").map(p => p.jid || p.id);
        const botIsAdmin = adminList.includes(selfJid);
        const senderIsAdmin = adminList.includes(m.sender);

        const reply = m.reply = async (teks) => {
            return sock.sendMessage(m.chat, {
                text: `${teks}`,
                mentions: [m.sender],
                contextInfo: {
                    externalAdReply: {
                        title: global.nameBot,
                        body: global.ucapan(),
                        thumbnailUrl: global.foto,
                        sourceUrl: global.url,
                        mediaType: 1,
                        showAdAttribution: true,
                    }
                }
            }, { quoted: m });
        };

        const example = (teks) => {
            return `Cara pengguna:\n*${prefix + command}* ${teks}`;
        };

        const msgCtx = {
            text: cmdText,
            args: cmdArgs,
            isCmd: hasCmd,
            mime: mimeType,
            qmsg: rawQuoted,
            isOwner,
            command: cmdName,
            reply,
            example,
            prefix: activePrefix,
            isBotAdmin: botIsAdmin,
            getPluginStats,
            getGroup,
            updateData,
            getSettings,
        };

        if (hasCmd) {
            await handleMessage(m, sock, cmdName, msgCtx);
        }

        if (m.isGroup) {
            const groupData = await getGroup(m.chat);
            if (groupData.antilink === 1) {
                const linkPattern = /chat\.whatsapp\.com\/[A-Za-z0-9]{20,24}/i;
                if (linkPattern.test(m.text) && !isOwner && !senderIsAdmin) {
                    if (!botIsAdmin) return;
                    
                    await sock.sendMessage(m.chat, {
                        text: `⚠️ *GROUP SECURITY*\n\n@${m.sender.split("@")[0]}, dilarang mengirim link grup lain!`,
                        mentions: [m.sender]
                    }, { quoted: m });

                    await sock.sendMessage(m.chat, {
                        delete: {
                            remoteJid: m.chat,
                            id: m.key.id,
                            participant: m.key.participant || m.sender,
                            fromMe: false
                        }
                    });
                }
            }
        }

        if (hasCmd) {
            const origin = m.key.remoteJid;
            const chatKind = origin.endsWith("@g.us") ? "GROUP" : "PRIVATE";
            const fullCmd = `${activePrefix}${cmdName}`;

            printLog("cmd",
                colorize(fullCmd, "yellow") +
                colorize("  in ", "white") +
                colorize(chatKind, chatKind === "GROUP" ? "cyan" : "blue") +
                colorize("  from ", "white") +
                colorize(m.pushName || "Unknown", "orange") +
                colorize(`  (${m.sender})`, "purple")
            );
        }

    } catch (err) {
        printLog("error", colorize(err.toString(), "red"));
        await sock.sendMessage(
            `${global.owner}@s.whatsapp.net`,
            { text: err.toString() },
            { quoted: m }
        );
    }
}

const __filename = fileURLToPath(import.meta.url);
fss.watchFile(__filename, () => {
    fss.unwatchFile(__filename);
    printLog("system", colorize(`File diperbarui: ${__filename}`, "cyan"));
    import(`${pathToFileURL(__filename).href}?v=${Date.now()}`);
});