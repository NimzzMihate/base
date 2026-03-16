const rgb = (r, g, b) => `\x1b[38;2;${r};${g};${b}m`;
const RESET = "\x1b[0m";
const BOLD  = "\x1b[1m";

export function colorize(text, color) {
    const palette = {
        red:    rgb(255, 85,  85),
        green:  rgb(85,  255, 85),
        blue:   rgb(85,  85,  255),
        cyan:   rgb(85,  255, 255),
        yellow: rgb(255, 255, 85),
        white:  rgb(220, 220, 220),
        pink:   rgb(255, 105, 180),
        orange: rgb(255, 165, 0),
        purple: rgb(180, 85,  255),
    };
    return `${BOLD}${palette[color] || palette.white}${text}${RESET}`;
}

export function rgbGradient(text, startRGB, endRGB) {
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

export function printLog(level, msg) {
    const tags = {
        info:   colorize("INFO", "cyan"),
        ok:     colorize(" OK ", "green"),
        warn:   colorize("WARN", "yellow"),
        error:  colorize(" ERR", "red"),
        system: colorize(" SYS", "purple"),
        cmd:    colorize(" CMD", "pink"),
        connect:colorize("CONN", "blue"),
    };
    const tag = tags[level] || tags.info;
    const ts  = new Date().toLocaleTimeString("id-ID", { hour12: false });
    console.log(`${colorize(`[${ts}]`, "white")} ${colorize("[", "white")}${tag}${colorize("]", "white")} ${colorize("›", "pink")} ${msg}`);
}
