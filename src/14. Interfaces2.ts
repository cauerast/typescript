// Interfaces
// Interface is a way to define a contract for the shape of an object. It specifies the properties and their types that an object must have. Interfaces are a powerful tool for enforcing a certain structure in your code.

// Interface definition 
interface Person {
    firstName:string,
    lastName:string,
    age:number
};

// to use ->
const exPerson: Person = {
    firstName: "yolo",
    lastName: "rast",
    age:333
};



// Interfaces for functions
interface MathOperation {
    (x:number, y:number): number;
}

const add: MathOperation = (a, b) => a + b;
const subtract: MathOperation = (a, b) => a - b;

console.log(add(2, 3)); // 5
console.log(subtract(6, 3)); // 3



// Declaration merging
// Once an interface is declared, it cannot be directly modified. however, TypeScript allows what is informally referred to as "declaration merging" or "interface extension," which is often misconstrued as "re-opening." Declaration merging in TypeScript refers to the ability to extend or augment an existing declaration, including interfaces. This can be useful when you want to add new properties or methods to an existing interface without modifying the original declaration.

// Declaration interface
interface Car {
    brand: string;
    start(): void;
};

// Declaration merging (interface extension)
interface Car {
    model: string;
    stop(): void;
}

// Usage of the extended interface
const myCar: Car = {
    brand: "Toyota",
    model: "Camry",
    start(){
        console.log("Car started");
    },
    stop(){
        console.log("Car stopped");
    }
}