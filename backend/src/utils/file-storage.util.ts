import * as fs from 'fs';
import * as path from 'path';

const USERS_FILE = path.join(__dirname, '../../data/users.json');
const KEYSTORE_PATH = path.join(__dirname, '../../blockchain/data/keystore');

export function getLocalUsers(): any[] {
    if (!fs.existsSync(USERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8') || '[]');
}

export function getKeystoreWallets(): { address: string; file: string }[] {
    if (!fs.existsSync(KEYSTORE_PATH)) return [];

    return fs.readdirSync(KEYSTORE_PATH)
        .filter((file) => file.startsWith('UTC--'))
        .map((file) => {
            const json = JSON.parse(fs.readFileSync(path.join(KEYSTORE_PATH, file), 'utf-8'));
            return {
                address: `0x${json.address.toLowerCase()}`,
                file,
            };
        });
}
export function overwriteLocalUsers(users: any[]) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}
export function saveLocalUser(user: { userId: string; walletAddress: string }) {
    const users = getLocalUsers();
    users.push(user);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

