// objects in ts
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