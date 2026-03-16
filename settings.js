import fs from "fs";
import chalk from "chalk";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);

//setting kepemilikan bot 
global.owner = ["6282137487477"]

//setting info bot 
global.url = "https://nimzz-portfolio-web.vercel.app/"
global.nameOwner = "Nimzz"
global.nameBot = "Base bot"
global.versi = "1.0.0"
global.idCh = "120363422841048901@newsletter"

//setting foto bot 
global.foto = "https://files.catbox.moe/qhi155.jpg"
global.thumbnail = "https://files.catbox.moe/ck6mr8.jpg"

//akun sosial media
global.sosial = {
  ig: "https://instagram.com/username",
  fb: "https://facebook.com/username",
  tt: "https://tiktok.com/@username",
  yt: "https://youtube.com/@username",
  gh: "https://github.com/username",
  tg: "https://t.me/username"
}

//payment
global.payment = {
  dana: "082137487477",
  ovo: "-",
  gopay: "082137487477",
  qris: "https://files.catbox.moe/mpbbvx.jpg"
}

global.mess = {
  owner: "❌ Perintah ini hanya untuk owner bot!",
  admin: "❌ Perintah ini hanya untuk admin grup!",
  botAdmin: "❌ Bot harus menjadi admin untuk menggunakan perintah ini!",
  group: "❌ Perintah ini hanya bisa digunakan di dalam grup!",
  premium: "❌ Fitur ini hanya untuk user premium!",
  vip: "❌ Fitur ini hanya untuk owner dan premium user!",
  private: "❌ Perintah ini hanya bisa digunakan di chat pribadi!"
}

fs.watchFile(__filename, () => {
    fs.unwatchFile(__filename);
    console.log(chalk.white.bold("~> Update File :"), chalk.green.bold(__filename));
    import(`${pathToFileURL(__filename).href}?update=${Date.now()}`);
});