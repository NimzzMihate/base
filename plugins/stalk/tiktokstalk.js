import axios from "axios";
import { createCanvas, loadImage } from "canvas";

async function buildProfileCard(user, stats) {
    const W = 520, H = 320;
    const canvas = createCanvas(W, H);
    const ctx    = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    roundRect(ctx, 0, 0, W, H, 24);
    ctx.fill();

    const topBar = ctx.createLinearGradient(0, 0, W, 0);
    topBar.addColorStop(0, "#f0f0f0");
    topBar.addColorStop(1, "#e8e8e8");
    ctx.fillStyle = topBar;
    ctx.beginPath();
    roundRect(ctx, 0, 0, W, 100, { tl: 24, tr: 24, bl: 0, br: 0 });
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.beginPath();
    roundRect(ctx, 0, 60, W, 40, 0);
    ctx.fill();

    ctx.font      = "bold 13px Sans";
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.textAlign = "right";
    ctx.fillText("TikTok", W - 20, 28);
    ctx.font      = "10px Sans";
    ctx.fillText("Profile Card", W - 20, 44);

    const avatarSize = 90;
    const avatarX    = 30;
    const avatarY    = 50;

    try {
        const avatarImg = await loadImage(user.avatarLarger);
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
        ctx.restore();

        ctx.strokeStyle = "#e0e0e0";
        ctx.lineWidth   = 3;
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
        ctx.stroke();
    } catch {
        ctx.fillStyle = "#dddddd";
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
        ctx.fill();
    }

    const textX = avatarX + avatarSize + 18;

    ctx.textAlign = "left";
    ctx.fillStyle = "#111111";
    ctx.font      = "bold 20px Sans";
    ctx.fillText(truncate(user.nickname, 22), textX, 85);

    ctx.fillStyle = "#888888";
    ctx.font      = "13px Sans";
    ctx.fillText("@" + user.uniqueId, textX, 106);

    if (user.verified) {
        const badgeCx = textX + ctx.measureText("@" + user.uniqueId).width + 14;
        ctx.fillStyle = "#20d5ec";
        ctx.beginPath();
        ctx.arc(badgeCx, 101, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font      = "bold 11px Sans";
        ctx.textAlign = "center";
        ctx.fillText("v", badgeCx, 105);
        ctx.textAlign = "left";
    }

    const bio = user.signature || "Tidak ada bio";
    ctx.fillStyle = "#555555";
    ctx.font      = "12px Sans";
    ctx.fillText(truncate(bio, 52), 30, 160);

    ctx.strokeStyle = "#eeeeee";
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.moveTo(30, 175);
    ctx.lineTo(W - 30, 175);
    ctx.stroke();

    const statItems = [
        { label: "Followers", value: fmtNum(stats.followerCount) },
        { label: "Following", value: fmtNum(stats.followingCount) },
        { label: "Likes",     value: fmtNum(stats.heartCount)    },
        { label: "Video",     value: fmtNum(stats.videoCount)    },
    ];

    const colW  = (W - 60) / statItems.length;
    const baseY = 205;

    statItems.forEach((s, i) => {
        const cx = 30 + colW * i + colW / 2;

        ctx.fillStyle = "rgba(240,240,240,0.7)";
        ctx.beginPath();
        roundRect(ctx, 30 + colW * i + 4, 182, colW - 8, 72, 12);
        ctx.fill();

        ctx.textAlign = "center";

        ctx.font      = "bold 15px Sans";
        ctx.fillStyle = "#111111";
        ctx.fillText(s.value, cx, baseY + 18);

        ctx.font      = "11px Sans";
        ctx.fillStyle = "#999999";
        ctx.fillText(s.label, cx, baseY + 36);
    });

    if (user.privateAccount) {
        ctx.fillStyle = "rgba(255,77,77,0.10)";
        ctx.beginPath();
        roundRect(ctx, W - 112, H - 44, 82, 24, 8);
        ctx.fill();
        ctx.fillStyle = "#ff4d4d";
        ctx.font      = "bold 11px Sans";
        ctx.textAlign = "right";
        ctx.fillText("[ Private ]", W - 20, H - 27);
    }

    ctx.textAlign = "left";
    ctx.font      = "11px Sans";
    ctx.fillStyle = "#bbbbbb";
    ctx.fillText("tiktok.com/@" + user.uniqueId, 30, H - 18);

    return canvas.toBuffer("image/png");
}

function roundRect(ctx, x, y, w, h, r) {
    if (typeof r === "number") r = { tl: r, tr: r, bl: r, br: r };
    ctx.moveTo(x + r.tl, y);
    ctx.lineTo(x + w - r.tr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
    ctx.lineTo(x + w, y + h - r.br);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
    ctx.lineTo(x + r.bl, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
    ctx.lineTo(x, y + r.tl);
    ctx.quadraticCurveTo(x, y, x + r.tl, y);
    ctx.closePath();
}

function fmtNum(n) {
    if (!n) return "0";
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000)     return (n / 1_000).toFixed(1) + "K";
    return String(n);
}

function truncate(str, max) {
    return str.length > max ? str.slice(0, max) + "..." : str;
}

const handler = async (m, { sock, text, usedPrefix, command, reply }) => {
    if (!text) return reply(`Mau stalk siapa?\nContoh: *${usedPrefix + command}* nimzz_bocil_pokemon`);

    try {
        const res = await axios.get(
            `https://api.siputzx.my.id/api/stalk/tiktok?username=${encodeURIComponent(text)}`
        );

        if (!res.data.status || !res.data.data) {
            return reply("Username tidak ditemukan. Coba cek lagi.");
        }

        const { user, stats } = res.data.data;
        const cardBuffer      = await buildProfileCard(user, stats);

        const caption =
            `*TikTok Profile*\n\n` +
            `*${user.nickname}*${user.verified ? " [Verified]" : ""}` +
            `${user.privateAccount ? " [Private]" : ""}\n` +
            `@${user.uniqueId}\n\n` +
            `${user.signature || ""}\n\n` +
            `Followers: ${fmtNum(stats.followerCount)}  |  ` +
            `Likes: ${fmtNum(stats.heartCount)}  |  ` +
            `Video: ${fmtNum(stats.videoCount)}`;

        await sock.sendMessage(m.chat, {
            image: cardBuffer,
            caption,
            mimetype: "image/png",
        }, { quoted: m });

    } catch (err) {
        console.error(err);
        reply("Gagal stalk. Coba lagi nanti.");
    }
};

handler.command = ["ttstalk", "tiktokstalk", "stalktt"];
export default handler;
