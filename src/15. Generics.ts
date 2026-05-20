// Generics
// In TypeScript, generics allow you to create reusable components that can work with a variety of types. Generics make it possible for you to define functions, classes, and interfaces that can work with different data types without having to duplicate

// Regular func
const printString = (x: string) => console.log(x);
const printNumber = (x: number) => console. log(x);
const printBoolean = (x: boolean) => console.log(x);

console.log(printString("hello")) ;
console.log(printNumber(2));
console.log(printBoolean(true)) ;

// Generic func
function printInfo<T>(x: T): T {
    return x;
}
const str = printInfo<string>("hello");
const num = printInfo<number>(2);
const bool = printInfo<boolean>(true);

