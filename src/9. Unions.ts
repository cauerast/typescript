
let myVar: number | string;
myVar = "yolo";
myVar = 10;

// union in functions
function foo(str:string | string[]): void {
    // params
}

// objects using union

type UserInfo = {
    first: string,
    last: string,
    age: number
};

type AccountDetails = {
    email: string,
    password: string
}

const yolo: UserInfo | AccountDetails = {
    first: "yolo",
    last: "WebDev",
    age: 20
}