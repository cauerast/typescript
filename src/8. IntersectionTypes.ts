type Person = {
    name: string,
    age: number
};

type Employee = {
    id: number, 
    title: string
};

type PersonEmployee = Person & Employee;

const alice: PersonEmployee = {
    name: "Alice",
    age: 30,
    id: 1,
    title: "Manager"
};

//

type UserInfo = {
    first: string,
    last: string,
    age: number
};

type AccountDetails = {
    email: string,
    password: string
}

type User = UserInfo & AccountDetails;

const yolo: User = {
    first: "yolo",
    last: "WebDev",
    age: 20,
    email: "yolo@gmail.com",
    password: "password12"
}

console.log(yolo);