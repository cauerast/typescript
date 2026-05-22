// Type Guards & Type Predicates
// Type guards are functions or expressions that tell TypeScript "if this returns true,
// narrow the type to this specific shape." They let you write runtime checks that
// the compiler understands.

// --- typeof type guard (built-in) ---
function process(value: string | number): string {
    if (typeof value === "string") {
        // TypeScript knows: value is string
        return value.toUpperCase();
    }
    // TypeScript knows: value is number
    return value.toFixed(2);
}

// --- instanceof type guard (built-in) ---
class APIError extends Error {
    constructor(public statusCode: number, message: string) {
        super(message);
    }
}

function handleError(err: Error | APIError): void {
    if (err instanceof APIError) {
        console.error(`API Error ${err.statusCode}: ${err.message}`);
    } else {
        console.error(`Generic Error: ${err.message}`);
    }
}

// --- Custom Type Guard with "is" ---
// This is where the REAL power is. The "is" keyword creates a type predicate.
// It tells TypeScript: "if this returns true, treat the value as this type."

interface Cat {
    type: "cat";
    meow(): void;
}

interface Dog {
    type: "dog";
    bark(): void;
}

type Animal = Cat | Dog;

// Type predicate: the return type "animal is Cat" is the magic part
function isCat(animal: Animal): animal is Cat {
    return animal.type === "cat";
}

function makeSound(animal: Animal): void {
    if (isCat(animal)) {
        animal.meow(); // TypeScript knows it's Cat
    } else {
        animal.bark(); // TypeScript knows it's Dog
    }
}

// --- Practical: Filtering arrays with type predicates ---
// Without a type predicate, filter() doesn't narrow types:
const mixed: (string | null)[] = ["hello", null, "world", null];
const strings1 = mixed.filter(item => item !== null);
//    ^? type is still (string | null)[] — TypeScript doesn't narrow

// With a type predicate, it DOES narrow:
function isNotNull<T>(value: T | null): value is T {
    return value !== null;
}

const strings2 = mixed.filter(isNotNull);
//    ^? type is string[] — correctly narrowed!

console.log("\n--- Filtering with type predicates ---");
console.log("Filtered:", strings2);

// Generic version — works with any type
function isDefined<T>(value: T | undefined | null): value is T {
    return value !== null && value !== undefined;
}

const maybeNumbers: (number | undefined)[] = [1, undefined, 3, undefined, 5];
const numbers = maybeNumbers.filter(isDefined); // number[]
console.log("Defined numbers:", numbers);

// --- Practical: Discriminated union type guard ---
type Shape =
    | { kind: "circle"; radius: number }
    | { kind: "rectangle"; width: number; height: number }
    | { kind: "triangle"; base: number; height: number };

function isCircle(shape: Shape): shape is Shape & { kind: "circle" } {
    return shape.kind === "circle";
}

function calculateArea(shape: Shape): number {
    if (isCircle(shape)) {
        return Math.PI * shape.radius ** 2;
    }
    // Can still switch on other types
    switch (shape.kind) {
        case "rectangle":
            return shape.width * shape.height;
        case "triangle":
            return (shape.base * shape.height) / 2;
    }
}

console.log("\n--- Area calculations ---");
console.log("Circle area:", calculateArea({ kind: "circle", radius: 5 }));
console.log("Rectangle area:", calculateArea({ kind: "rectangle", width: 4, height: 6 }));

// --- "asserts" keyword (assertion functions) ---
// Instead of returning boolean, asserts throws if the condition fails.
// After the call, TypeScript narrows the type unconditionally.

function assertIsString(value: unknown): asserts value is string {
    if (typeof value !== "string") {
        throw new Error("Expected string!");
    }
}

function processUnknown(input: unknown): void {
    assertIsString(input); // After this line, input is string
    console.log(input.toUpperCase()); // Safe!
}

try {
    processUnknown("hello");
    // processUnknown(42); // would throw
} catch (e) {
    console.error(e);
}

// --- Practical: Asserting object shape ---
interface APIResponse {
    data: unknown;
    status: number;
}

function assertHasData<T>(response: APIResponse): asserts response is APIResponse & { data: T } {
    if (response.data === undefined || response.data === null) {
        throw new Error("Response missing data");
    }
}

function handleResponse(response: APIResponse): void {
    // Assert that response has data, and it's a User type
    assertHasData<User>(response);
    // Now TypeScript knows response.data is User
    console.log(response.data.name);
}

type User = { id: number; name: string };
handleResponse({ data: { id: 1, name: "Alice" }, status: 200 });

// --- "in" operator narrowing ---
// TypeScript also narrows with the built-in "in" operator:
interface A { a: number; }
interface B { b: number; }

function example(x: A | B): void {
    if ("a" in x) {
        console.log(x.a); // narrowed
    } else {
        console.log(x.b); // narrowed
    }
}

// Key takeaway:
// - typeof/instanceof for primitive/class checks
// - "is" for reusable custom type guards (especially with array.filter!)
// - "asserts" for validation functions that throw
// - "in" for simple property checks