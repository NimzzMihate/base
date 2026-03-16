process.on("uncaughtException", (err) => {
    console.error(colorize("\n[FATAL] Unhandled Exception:", "red"), err);
});

import "./settings.js"
import "./lib/function.js"
import {
    makeWASocket,
    useMultiFileAuthState,
    fetchLatestWaWebVersion,
    DisconnectReason,
    downloadContentFromMessage,
    makeInMemoryStore,
    jidDecode,
    Browsers
} from "@whiskeysockets/baileys"

import fs from "fs";
import chalk from "chalk";
import { fileURLToPath, pathToFileURL } from "url";
import pino from "pino";
import { Boom } from "@hapi/boom";
import path from "path";
import readline from "readline";
import qrcode from "qrcode-terminal";
import { fileTypeFromBuffer } from "file-type";
import os from "os";
import nou from "node-os-utils";
import now from "performance-now";

// ── Helpers ────────────────────────────────────────────────
const rgb = (r, g, b) => `\x1b[38;2;${r};${g};${b}m`;
const RESET = "\x1b[0m";
const BOLD  = "\x1b[1m";

function colorize(text, color) {
    const colors = {
        red:     rgb(255, 85,  85),
        green:   rgb(85,  255, 85),
        blue:    rgb(85,  85,  255),
        cyan:    rgb(85,  255, 255),
        magenta: rgb(255, 85,  255),
        yellow:  rgb(255, 255, 85),
        white:   rgb(220, 220, 220),
        pink:    rgb(255, 105, 180),
        orange:  rgb(255, 165, 0),
        purple:  rgb(180, 85,  255),
    };
    return `${BOLD}${colors[color] || colors.white}${text}${RESET}`;
}

function rgbGradient(text, startRGB, endRGB) {
    const [r1, g1, b1] = startRGB;
    const [r2, g2, b2] = endRGB;
    return text.split("").map((char, i, arr) => {
        const t = arr.length <= 1 ? 0 : i / (arr.length - 1);
        const r = Math.round(r1 + (r2 - r1) * t);
        const g = Math.round(g1 + (g2 - g1) * t);
        const b = Math.round(b1 + (b2 - b1) * t);
        return `${rgb(r, g, b)}${char}`;
    }).join("") + RESET;
}

function printLog(level, msg) {
    const levels = {
        info:    colorize("INFO",  "cyan"),
        ok:      colorize(" OK ", "green"),
        warn:    colorize("WARN",  "yellow"),
        error:   colorize(" ERR", "red"),
        system:  colorize(" SYS", "purple"),
        connect: colorize("CONN",  "blue"),
    };
    const tag = levels[level] || levels.info;
    const ts  = new Date().toLocaleTimeString("id-ID", { hour12: false });
    console.log(`${colorize(`[${ts}]`, "white")} ${colorize("[", "white")}${tag}${colorize("]", "white")} ${colorize("›", "pink")} ${msg}`);
}

// ── Init ───────────────────────────────────────────────────
const startupTime  = now();
const pingLatency  = now() - startupTime;
const systemOS     = nou.os.oos();
const diskInfo     = await nou.drive.info();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

import { caseHandler } from "./handler.js";
import { imageToWebp, videoToWebp, writeExifImg, writeExifVid } from "./lib/webp.js";
import ConfigBaileys from "./lib/config.js";
import { initDb, getSettings } from "./lib/database.js";

// ── Pairing Input ──────────────────────────────────────────
async function promptPhoneNumber(question) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => {
        rl.question(question, (ans) => { rl.close(); resolve(ans); });
    });
}

// ── Store ──────────────────────────────────────────────────
const waStore = makeInMemoryStore({
    logger: pino().child({ level: "silent", stream: "store" })
});

// ── Database ───────────────────────────────────────────────
printLog("system", colorize("Memuat database...", "yellow"));
await initDb();
printLog("ok", colorize("Database berhasil dimuat!", "green"));

const botConfig  = await getSettings();
global.public      = botConfig.public === 1;
global.prefix      = botConfig.prefix;
global.multiprefix = botConfig.multiprefix === 1;

// ── Main ───────────────────────────────────────────────────
const usePairingCode = true;

async function launchBot() {
    const { state, saveCreds }    = await useMultiFileAuthState("Auth");
    const { version }             = await fetchLatestWaWebVersion();

    const sock = makeWASocket({
        browser: Browsers.ubuntu("Firefox"),
        generateHighQualityLinkPreview: true,
        printQRInTerminal: !usePairingCode,
        auth: state,
        version,
        getMessage: async (key) => {
            if (waStore) {
                const cached = await waStore.loadMessage(key.remoteJid, key.id);
                return cached?.message || undefined;
            }
            return sock;
        },
        logger: pino({ level: "silent" })
    });

    waStore?.bind(sock.ev);
    console.clear();

    if (usePairingCode && !sock.authState.creds.registered) {
        let phoneInput = await promptPhoneNumber(
            colorize("[?] Masukkan nomor kamu (contoh 628xxx):\n› ", "cyan")
        );
        phoneInput = phoneInput.replace(/[^0-9]/g, "");

        setTimeout(async () => {
            const rawCode    = await sock.requestPairingCode(phoneInput);
            const prettyCode = rawCode.slice(0, 4) + "-" + rawCode.slice(4, 8);
            console.clear();
            console.log(
                "\n" +
                rgbGradient("  PAIRING CODE  ", [255, 85, 255], [85, 85, 255]) + "\n" +
                colorize(`  ${prettyCode}`, "yellow") + "\n"
            );
        }, 5000);
    }

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async ({ connection, lastDisconnect, qr }) => {
        if (!connection) return;

        if (connection === "connecting") {
            if (qr && !usePairingCode) {
                printLog("connect", colorize("Scan QR di bawah ini:", "cyan"));
                qrcode.generate(qr, { small: true });
            }
        }

        if (connection === "close") {
            const errCode = new Boom(lastDisconnect?.error)?.output?.statusCode;

            switch (errCode) {
                case DisconnectReason.badSession:
                    printLog("error", colorize("Sesi rusak. Hapus folder Auth lalu jalankan ulang.", "red"));
                    process.exit();

                case DisconnectReason.connectionClosed:
                    printLog("system", colorize("Koneksi tertutup. Mencoba ulang...", "yellow"));
                    await launchBot(); break;

                case DisconnectReason.connectionLost:
                    printLog("system", colorize("Koneksi terputus. Mencoba ulang...", "yellow"));
                    await launchBot(); break;

                case DisconnectReason.connectionReplaced:
                    printLog("warn", colorize("Sesi digantikan perangkat lain. Keluar...", "orange"));
                    await sock.logout(); break;

                case DisconnectReason.restartRequired:
                    printLog("system", colorize("Restart diperlukan. Memulai ulang...", "cyan"));
                    await launchBot(); break;

                case DisconnectReason.loggedOut:
                    printLog("warn", colorize("Perangkat logout. Scan ulang diperlukan.", "orange"));
                    await sock.logout(); break;

                case DisconnectReason.timedOut:
                    printLog("system", colorize("Koneksi timeout. Mencoba ulang...", "yellow"));
                    await launchBot(); break;

                default: {
                    const errMsg = lastDisconnect?.error?.message || "";
                    if (errMsg.includes("Stream Errored (unknown)")) {
                        printLog("system", colorize("Stream error. Mencoba ulang...", "yellow"));
                        await launchBot();
                    } else {
                        printLog("error", colorize(`Disconnect tidak diketahui [${errCode}]: ${errMsg}`, "red"));
                        await launchBot();
                    }
                }
            }

        } else if (connection === "open") {
            console.clear();

            const botNum  = sock?.user?.id?.split(":")[0]
                         || sock?.user?.jid?.replace("@s.whatsapp.net", "")
                         || "Unknown";
            const botName = sock?.user?.name || "Unknown";

            // ── Panel Info ─────────────────────────────────
            console.log(
                "\n" + colorize("  ✦ ", "pink") + rgbGradient("Bot Connected Successfully!", [85, 255, 255], [85, 255, 85])
            );

            const row = (label, value, color = "white") =>
                `  ${colorize("›", "pink")} ${colorize(label.padEnd(14), "purple")} ${colorize(":", "white")} ${colorize(value, color)}`;

            console.log("\n" + colorize("  👤 USER", "cyan"));
            console.log(row("Number", botNum,  "green"));
            console.log(row("Name",   botName, "green"));

            console.log("\n" + colorize("  🤖 SCRIPT", "cyan"));
            console.log(row("Bot Name",  global.nameBot,   "yellow"));
            console.log(row("Developer", global.nameOwner, "yellow"));
            console.log(row("Type",      "Plugins (ESM)",  "yellow"));
            console.log(row("Mode",      global.public ? "Public" : "Self", global.public ? "green" : "orange"));
            console.log(row("Prefix",    global.multiprefix ? (global.prefix || ".") : "No Prefix", "yellow"));

            console.log("\n" + colorize("  🌐 SERVER", "cyan"));
            console.log(row("Uptime VPS",  runtime(os.uptime()),        "blue"));
            console.log(row("Platform",    nou.os.type(),               "blue"));
            console.log(row("RAM",         formatp(os.totalmem()),      "blue"));
            console.log(row("Disk",        `${diskInfo.totalGb} GB`,    "blue"));
            console.log(row("CPU Cores",   `${os.cpus().length} Core`,  "blue"));

            console.log("");
        }
    });

    sock.ev.on("messages.upsert", async (chatUpdate) => {
        try {
            const rawMsg = chatUpdate.messages[0];
            if (!rawMsg.message) return;

            const parsedMsg = await ConfigBaileys(sock, rawMsg);
            const isOwner   = global.owner.includes(
                parsedMsg.sender.replace(/@s\.whatsapp\.net$/, "")
            );

            if (!global.public && !isOwner && !parsedMsg.key.fromMe) return;

            caseHandler(sock, parsedMsg, chatUpdate);
        } catch (err) {
            printLog("error", colorize(`Pesan gagal diproses: ${err.message}`, "red"));
        }
    });

    // ── Socket Utilities ───────────────────────────────────
    sock.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            const decoded = jidDecode(jid) || {};
            return decoded.user && decoded.server
                ? `${decoded.user}@${decoded.server}`
                : jid;
        }
        return jid;
    };

    sock.downloadAndSaveMedia = async (message, filename, withExt = true) => {
        try {
            const target      = message.msg ?? message;
            const mimeType    = (message.msg || message).mimetype || "";
            const mediaType   = message.mtype
                ? message.mtype.replace(/Message/gi, "")
                : mimeType.split("/")[0];

            const uniqueId    = Date.now();
            const trashDir    = "./data/trash";

            if (!fs.existsSync(trashDir)) fs.mkdirSync(trashDir, { recursive: true });

            const stream = await downloadContentFromMessage(target, mediaType);
            let buffer   = Buffer.from([]);
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

            const detected   = (await fileTypeFromBuffer(buffer)) || { ext: "bin", mime: "application/octet-stream" };
            const savePath   = withExt
                ? `${trashDir}/${uniqueId}.${detected.ext}`
                : filename || `${trashDir}/${uniqueId}.${detected.ext}`;

            fs.writeFileSync(savePath, buffer);
            return savePath;
        } catch (err) {
            printLog("error", colorize(`Gagal download media: ${err.message}`, "red"));
            return null;
        }
    };

    sock.fetchMediaBuffer = async (m, type, savePath = "") => {
        if (!m || !(m.url || m.directPath)) return Buffer.alloc(0);
        const stream = await downloadContentFromMessage(m, type);
        let buffer   = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
        if (savePath) await fs.promises.writeFile(savePath, buffer);
        return savePath && fs.existsSync(savePath) ? savePath : buffer;
    };

    sock.sendImageAsSticker = async (jid, filePath, quoted, options = {}) => {
        let buff = Buffer.isBuffer(filePath)
            ? filePath
            : /^data:.*?\/.*?;base64,/i.test(filePath)
            ? Buffer.from(filePath.split`, `[1], "base64")
            : /^https?:\/\//.test(filePath)
            ? await getBuffer(filePath)
            : fs.existsSync(filePath)
            ? fs.readFileSync(filePath)
            : Buffer.alloc(0);

        const stickerBuf = (options.packname || options.author)
            ? await writeExifImg(buff, options)
            : await imageToWebp(buff);

        await sock.sendMessage(jid, { sticker: { url: stickerBuf }, ...options }, { quoted });
        return stickerBuf;
    };

    sock.sendVideoAsSticker = async (jid, filePath, quoted, options = {}) => {
        let buff = Buffer.isBuffer(filePath)
            ? filePath
            : /^data:.*?\/.*?;base64,/i.test(filePath)
            ? Buffer.from(filePath.split`, `[1], "base64")
            : /^https?:\/\//.test(filePath)
            ? await getBuffer(filePath)
            : fs.existsSync(filePath)
            ? fs.readFileSync(filePath)
            : Buffer.alloc(0);

        const stickerBuf = (options.packname || options.author)
            ? await writeExifVid(buff, options)
            : await videoToWebp(buff);

        await sock.sendMessage(jid, { sticker: { url: stickerBuf }, ...options }, { quoted });
        return stickerBuf;
    };

    sock.resolveFile = async (filePath, save) => {
        let data = Buffer.isBuffer(filePath)
            ? filePath
            : /^data:.*?\/.*?;base64,/i.test(filePath)
            ? Buffer.from(filePath.split`,`[1], "base64")
            : /^https?:\/\//.test(filePath)
            ? await (await getBuffer(filePath))
            : fs.existsSync(filePath)
            ? fs.readFileSync(filePath)
            : typeof filePath === "string"
            ? filePath
            : Buffer.alloc(0);

        const fileType = (await fileTypeFromBuffer(data)) || { mime: "application/octet-stream", ext: "bin" };
        const outPath  = path.join(__filename, `./data/trash/${Date.now()}.${fileType.ext}`);

        if (data && save) await fs.promises.writeFile(outPath, data);

        return {
            filename: outPath,
            size: await getSizeMedia(data),
            ...fileType,
            data
        };
    };

    sock.sendFile = async (jid, filePath, filename = "", caption = "", quoted, ptt = false, options = {}) => {
        let resolved = await sock.resolveFile(filePath, true);
        let { data: fileData, filename: resolvedPath } = resolved;

        if (!fileData || fileData.length <= 65536) {
            try { throw { json: JSON.parse(fileData.toString()) }; }
            catch (e) { if (e.json) throw e.json; }
        }

        let mediaType = "";
        let mimeType  = resolved.mime;
        let converted;
        const opt     = { filename, ...(quoted ? { quoted } : {}) };

        if (/webp/.test(mimeType) || (/image/.test(mimeType) && options.asSticker))       mediaType = "sticker";
        else if (/image/.test(mimeType) || (/webp/.test(mimeType) && options.asImage))    mediaType = "image";
        else if (/video/.test(mimeType))                                                   mediaType = "video";
        else if (/audio/.test(mimeType)) {
            converted  = await (ptt ? toPTT : toAudio)(fileData, resolved.ext);
            fileData   = converted.data;
            resolvedPath = converted.filename;
            mediaType  = "audio";
            mimeType   = "audio/ogg; codecs=opus";
        } else mediaType = "document";

        if (options.asDocument) mediaType = "document";

        ["asSticker", "asLocation", "asVideo", "asDocument", "asImage"].forEach(k => delete options[k]);

        const payload = { ...options, caption, ptt, [mediaType]: { url: resolvedPath }, mimetype: mimeType };
        let result;

        try {
            result = await sock.sendMessage(jid, payload, { ...opt, ...options });
        } catch {
            result = null;
        } finally {
            if (!result) result = await sock.sendMessage(jid, { ...payload, [mediaType]: fileData }, { ...opt, ...options });
            return result;
        }
    };

    sock.sendContact = async (jid, numbers = [], displayName, desc = "Developer Bot", quoted = "", opts = {}) => {
        const contactList = numbers.map(num => ({
            displayName: displayName || "Unknown",
            vcard: [
                "BEGIN:VCARD",
                "VERSION:3.0",
                `N:;${displayName || "Unknown"};;;`,
                `FN:${displayName || "Unknown"}`,
                "ORG:Unknown",
                "TITLE:",
                `item1.TEL;waid=${num}:${num}`,
                "item1.X-ABLabel:Ponsel",
                `X-WA-BIZ-DESCRIPTION:${desc}`,
                `X-WA-BIZ-NAME:${displayName || "Unknown"}`,
                "END:VCARD"
            ].join("\n")
        }));

        await sock.sendMessage(
            jid,
            { contacts: { displayName: `${contactList.length} Kontak`, contacts: contactList }, ...opts },
            { quoted }
        );
    };
}

launchBot();

fs.watchFile(__filename, () => {
    fs.unwatchFile(__filename);
    printLog("system", colorize(`File diperbarui: ${__filename}`, "cyan"));
    import(`${pathToFileURL(__filename).href}?v=${Date.now()}`);
});
