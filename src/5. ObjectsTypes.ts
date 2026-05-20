// objects in ts

// An object in TypeScript is a structured data type that represents a collection of properties, each with a key and an associated value. The properties of an object can have specific types, and the object itself can be annotated with a type, often defined using an interface or a type alias. TypeScript uses structural typing, meaning that the shape of an object (its structure or properties) is what matters for type


const person: {name: string, age: number, location: string} = {
    name: "pedro",
    age: 19,
    location: "Sao paulo"
}

// object as function return value
function printUser(): {name:string, age:number, location:string} {
    return {
        name: "pedro",
        age: 19,
        location: "Sao paulo"
    }
}