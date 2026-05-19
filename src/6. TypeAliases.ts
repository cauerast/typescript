type Person = {
    name:string,
    age:number
}

function printPerson(person: Person): void{
    console.log(`name: ${person.name} \nage: ${person.age}`);
}

const myPerson = {name: "luis", age: 41};
printPerson(myPerson);