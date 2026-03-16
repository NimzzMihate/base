import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Waduh gagal mbukak database:', err.message);
});

const initDb = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY, name TEXT, limit_val INTEGER DEFAULT 20,
                balance INTEGER DEFAULT 0, premium INTEGER DEFAULT 0,
                health INTEGER DEFAULT 100, stamina INTEGER DEFAULT 100,
                level INTEGER DEFAULT 1, exp INTEGER DEFAULT 0, role TEXT DEFAULT 'Warga',
                potion INTEGER DEFAULT 0, iron INTEGER DEFAULT 0, gold INTEGER DEFAULT 0,
                diamond INTEGER DEFAULT 0, common_crate INTEGER DEFAULT 0, sword INTEGER DEFAULT 0
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS groups (
                id TEXT PRIMARY KEY, welcome INTEGER DEFAULT 0, goodbye INTEGER DEFAULT 0,
                antilink INTEGER DEFAULT 0, antidelete INTEGER DEFAULT 0, antiviewonce INTEGER DEFAULT 0,
                antitoxic INTEGER DEFAULT 0, antibot INTEGER DEFAULT 0, antisticker INTEGER DEFAULT 0,
                rpg_mode INTEGER DEFAULT 1
            )`);
            
            db.run(`CREATE TABLE IF NOT EXISTS settings (
                id TEXT PRIMARY KEY, prefix TEXT DEFAULT '.',
                multiprefix INTEGER DEFAULT 0, public INTEGER DEFAULT 1
            )`);

            db.get(`SELECT id FROM settings WHERE id = 'bot'`, (err, row) => {
                if (err) return reject(err);
                
                if (!row) {
                    db.run(`INSERT INTO settings (id, prefix, multiprefix, public) VALUES ('bot', '.', 0, 1)`, (err) => {
                        if (err) reject(err);
                        else resolve(); 
                    });
                } else {
                    resolve();
                }
            });
        });
    });
};

const getUser = (jid, name) => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE id = ?`, [jid], (err, row) => {
            if (err) return reject(err);
            if (!row) {
                const sql = `INSERT INTO users (id, name, limit_val, balance, health, stamina) VALUES (?, ?, 20, 1000, 100, 100)`;
                db.run(sql, [jid, name], (err) => {
                    if (err) return reject(err);
                    resolve({ id: jid, name, limit_val: 20, balance: 1000, health: 100, stamina: 100, level: 1, exp: 0, role: 'Warga', potion: 0, iron: 0, gold: 0 });
                });
            } else {
                resolve(row);
            }
        });
    });
};

const getGroup = (jid) => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM groups WHERE id = ?`, [jid], (err, row) => {
            if (err) return reject(err);
            if (!row) {
                db.run(`INSERT INTO groups (id) VALUES (?)`, [jid], (err) => {
                    if (err) return reject(err);
                    resolve({ id: jid, welcome: 0, antilink: 0, antidelete: 0, antiviewonce: 0, antitoxic: 0, antibot: 0 });
                });
            } else {
                resolve(row);
            }
        });
    });
};

const updateData = (table, id, column, value) => {
    return new Promise((resolve, reject) => {
        if (!['users', 'groups', 'settings'].includes(table)) return reject("Tabel ora onok cuk");
        
        db.run(`UPDATE ${table} SET ${column} = ? WHERE id = ?`, [value, id], function(err) {
            if (err) reject(err); else resolve(this.changes);
        });
    });
};

const incrementData = (table, id, column, value) => {
    return new Promise((resolve, reject) => {
        if (!['users', 'groups'].includes(table)) return reject("Tabel ra onok");
        db.run(`UPDATE ${table} SET ${column} = ${column} + ? WHERE id = ?`, [value, id], function(err) {
            if (err) reject(err); else resolve(this.changes);
        });
    });
};

const getSettings = () => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM settings WHERE id = 'bot'`, (err, row) => {
            if (err) reject(err);
            resolve(row || { prefix: '.', multiprefix: 0, public: 1 });
        });
    });
};

export { initDb, getUser, getGroup, updateData, incrementData, getSettings };