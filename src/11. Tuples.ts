// Tuples

// Tuple is a type that represents an array with a fixed number of elements, where each element can have a different type. The order of the types in the tuple definition corresponds to the order of the values in the actual array. Tuples are similar to arrays, but they have a specific structure and can be used to model finite sequences with known lengths.


let myTuple: [string, number] = ["hello", 10];
console.log(myTuple[0]); // "hello";
console.log(myTuple[1]); // 10

// Destructuring Individual Element
let [first, second] = myTuple;
console.log(first); // "hello"
console.log(second); // 10