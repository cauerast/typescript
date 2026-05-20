// -- TYPE ANOTATIONS -- 

// var varname:type = value;


// Annotations are used to specify the data type of a variable, parameter, function return value, and other types of values Annotations help developers catch errors early in development by allowing them to specify what types of values can be assigned to a given variable or passed as an argument to a function.

const myString: string = "yolo";
const myNumber: number = 10;
const myBoolean: boolean = true;
const myVar: any = "any type";
const myNull: null = null;
const myUndefined: undefined = undefined;

function neverUserd(msg: string): never {
    throw new Error(msg);
}
neverUserd("error");

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

