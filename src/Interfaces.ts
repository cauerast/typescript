// Interfaces
interface UserWallet {
    coins?: number,
    credits?: number;

}

interface User {
    name: string,
    createdAt: Date,
    wallet?: UserWallet,
}

interface User {
    talk(): void;
}

function createUser(name: string): User {
    return { name, createdAt: new Date(), talk(){ console.log("Eu sou  : ", name) }};
}

function updateWallet(user: User, wallet: UserWallet){
    user.wallet = { ...user.wallet, ...wallet}
}

const yolo = createUser("yolo");

yolo.talk();
updateWallet(yolo, {coins: 19})
