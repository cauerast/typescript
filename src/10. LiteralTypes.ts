// Literal Types

// Literal types allow you to specify a value that can only be one specific literal value. This means that a variable with a literal type can only have one specific value and no other.

let color: "red" | "blue" | "green";
color = "red"; // -> valid
// color = "yellow" -> invald

let number: 1 | 2 | 3;
number = 1;
// number = 19 -> invalid

let isTrue: true;
isTrue = true;
// isTrue = false; -> invalid