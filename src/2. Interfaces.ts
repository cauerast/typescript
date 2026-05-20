// Interfaces

// Type inference is a feature in TypeScript that allows the compiler to automatically determine the type of a variable based on its value. In other words, if you declare a variable without explicitly specifying its type, TypeScript will try to infer the type based on the value you assign to it.


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
