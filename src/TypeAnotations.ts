// -- TYPE ANOTATIONS -- 

// var varname:type = value;

const myString: string = "yolo";
const myNumber: number = 10;
const myBoolean: boolean = true;
const myVar: any = "any type";
const myNull: null = null;
const myUndefined: undefined = undefined;

function sum(a:number, b:number): number{
    return a + b;
}

// ? -> means that parameter is optional. Optional parameters aways need to be the last at the function
function greet(name:string, age?:number){
}

greet("yolo");

// typescript get the inference type

const animal = {
    name: "cat",
    age: 2
}

animal.age; // have autocomplete!

//

const filter = (value: number) => value < 0;

const numbers = [1, 2, 3, -1, -2, -3];

numbers.filter(filter);


