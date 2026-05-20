//Type Narrowing
// Type narrowing is the process of refining a variable's type within a conditional block of code. This allows you to write more precise and type-safe code.




// Type guards -> Type guards are mechanisms that help TypeScript understand and narrow down the types more precisely. One common type guard is the typeof operator.
// Define a union type
type MyType = string | number;

// Example function with type guard
function exampleFunction(value: MyType): void {
    if(typeof value == "string"){ // typeof keyword
        // Within this block, TypeScript knows that 'value' is a string
        console.log(value.toUpperCase()) ;
    }
    else {
        // Within this block, TypeScript knows that 'value' is a number
        console.log(value.toFixed(2));
    }
}
// Example usage
exampleFunction("hello"); // Outputs: HELLO
exampleFunction(42); // Outputs: 42.00





//instanceof operator
//The instanceof operator is another type guard in TypeScript that allows you to check whether an object is an instance of a particular class or constructor function.

class Dog {
    bark(): void{
        console.log("Woof!")
    }
}

class Cat {
    meow(): void{
        console.log("Meow!")
    }
}

// Example function with * instanceof * type guard
function animalSound(animal: Dog | Cat): void {
    if(animal instanceof Dog){
        animal.bark();
    } else {
        animal.meow();
    }
}

const dog = new Dog();
const cat = new Cat();

animalSound(dog); // woof
animalSound(cat); // meow




// Intersection types
// Intersection types in TypeScript allow you to combine multiple types into a single type. The resulting type will have all the properties of each individual type. You create intersection types using the & operator.

//Intersection Types

// An intersection type is a way to combine multiple types into a single type that includes all the properties and methods of each constituent type. An intersection type is denoted by the & symbol.

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