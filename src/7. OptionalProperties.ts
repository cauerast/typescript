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

function greet(name: string, createdAt:Date | null): void{
    console.log(`hello ${name}! you've been created at ${createdAt} date!`)
}