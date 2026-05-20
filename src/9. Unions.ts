// Unions

// Unions are used to declare a type that can have one of several possible types. Unions are useful when we want to allow a variable or parameter to accept multiple types. The syntax for defining a union type in TypeScript uses the pipe symbol (|).


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