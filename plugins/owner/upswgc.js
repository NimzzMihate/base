import * as baileys from "@whiskeysockets/baileys";
import crypto from "crypto";

async function groupStatus(sock, jid, content) {
    const { backgroundColor } = content;
    delete content.backgroundColor;

    const inside = await baileys.generateWAMessageContent(content, {
        upload: sock.waUploadToServer,
        backgroundColor
    });

    const messageSecret = crypto.randomBytes(32);

    const m = baileys.generateWAMessageFromContent(
        jid, {
            messageContextInfo: {
                messageSecret
            },
            groupStatusMessageV2: {
                message: {
                    ...inside,
                    messageContextInfo: {
                        messageSecret
                    }
                }
            }
        }, {}
    );

    await sock.relayMessage(jid, m.message, {
        messageId: m.key.id
    });
    return m;
}

const handler = async (m, { sock, command, prefix, isAdmin, isOwner }) => {
    if (!m.isGroup) return m.reply(global.mess?.group || 'Fitur ini khusus grup!');
    if (!isAdmin && !isOwner) return m.reply(global.mess?.admin || 'Fitur ini khusus admin grup!');

    const quoted = m.quoted ? m.quoted : m;
    const mime = (quoted.msg || quoted).mimetype || "";
    const caption = m.text || "";

    try {
        if (!mime && !caption) {
            return m.reply(`💢 *Baka!* Reply media atau tambahin teks dulu!\nContoh: *${prefix + command}* (reply image/video/audio) Hai semuanya~`);
        }

        let payload = {};

        if (/image/.test(mime)) {
            const buffer = await sock.downloadAndSaveMediaMessage(quoted);
            payload = {
                image: { url: buffer },
                caption: caption
            };
        } else if (/video/.test(mime)) {
            const buffer = await sock.downloadAndSaveMediaMessage(quoted);
            payload = {
                video: { url: buffer },
                caption: caption
            };
        } else if (/audio/.test(mime)) {
            const buffer = await sock.downloadAndSaveMediaMessage(quoted);
            payload = {
                audio: { url: buffer },
                mimetype: "audio/mp4"
            };
        } else if (caption) {
            payload = {
                text: caption
            };
        } else {
            return m.reply(`💢 *Baka!* Reply media atau tambahin teks dulu!`);
        }

        await groupStatus(sock, m.chat, payload);

        await sock.sendMessage(m.chat, {
            react: {
                text: "✅",
                key: m.key
            }
        });

    } catch (err) {
        console.error("Error di .swgc:", err);
        m.reply("💥 *Duh error...* Gagal upload status grup. Coba lagi ya (｡•́︿•̀｡)");
    }
};

handler.command = ["swgc", "swgrup", "upswgc"];
handler.group = true;
handler.admin = true;

export default handler;