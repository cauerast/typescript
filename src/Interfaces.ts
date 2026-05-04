// Interfaces
interface UserWallet {
    coins?: number,
    credits?: number;

}

interface User {
    name: string,
    createdAt: Date,
    wallet?: UserWallet
}

function createUser(name: string): User {
    return { name, createdAt: new Date() };
}

function updateWallet(user: User, wallet: UserWallet){
    user.wallet = { ...user.wallet, ...wallet}
}

const yolo = createUser("yolo");

updateWallet(yolo, {coins: 19})
