// The Type Hierarchy: unknown, any, never & Top/Bottom Types
// Understanding how TypeScript's type system is structured is crucial.
// These three types — unknown, any, never — sit at the extremes.

// --- The Type Hierarchy (simplified) ---
//
//                    any              <- the "opt-out" type (disables checking)
//                     |
//                  unknown            <- the "top" type (every type is assignable to it)
//                /    |    \
//           string  number  boolean   <- your normal types
//                \    |    /
//                  never              <- the "bottom" type (assignable to everything)
//
// Key rules:
// 1. unknown is the "safe any" — you CAN assign anything TO it, but can't USE it without narrowing
// 2. any is the "escape hatch" — completely disables type checking
// 3. never is "the impossible type" — a value that can never exist

// --- any: The Escape Hatch ---
// Avoid whenever possible. It disables ALL type checking.

let anything: any = "hello";
anything = 42;
anything = { complex: true };
anything.toUpperCase(); // no error at compile time (may fail at runtime)
anything.nonexistent.deeply.nested; // no error! (but will crash at runtime)

// When you'd actually use any:
// 1. Migration from JS (temporary)
// 2. Third-party lib without types (use unknown instead if possible)
// 3. Very tricky generics (but try unknown first)

// --- unknown: The Type-Safe Top Type ---
// The REAL "top type" of TypeScript. Use this instead of any.

function processUnknown(value: unknown): void {
    // Can't do anything with it without narrowing — that's the point!
    // value.toUpperCase();  // error! Object is of type 'unknown'
    // value + 1;            // error!

    // You MUST narrow it first
    if (typeof value === "string") {
        console.log(value.toUpperCase()); // ok
    } else if (typeof value === "number") {
        console.log(value.toFixed(2)); // ok
    } else if (value && typeof value === "object") {
        console.log("It's an object");
    }
}

// --- unknown vs any in practice ---

// BAD: any accepts everything silently
function badParse(data: any): any {
    return JSON.parse(data);
}
const badResult = badParse('{"name": "Alice"}');
console.log(badResult.nonexistent.prop); // no error
// Program crashes at runtime with TypeError

// GOOD: unknown forces you to validate
function goodParse(data: string): unknown {
    return JSON.parse(data);
}

interface User {
    name: string;
    age: number;
}

function isUser(value: unknown): value is User {
    if (!value || typeof value !== "object") return false;
    const obj = value as Record<string, unknown>;
    return typeof obj.name === "string" && typeof obj.age === "number";
}

const result = goodParse('{"name": "Alice", "age": 30}');
if (isUser(result)) {
    console.log(result.name); // safe!
}

// --- never: The Impossible Type ---
// never represents values that can NEVER occur.
// It's the bottom type — assignable TO everything, but nothing is assignable TO it.

function throwError(message: string): never {
    throw new Error(message);
}

function infiniteLoop(): never {
    while (true) {
        // never returns
    }
}

// Practical: Exhaustive switch checking
type Animal = "cat" | "dog" | "bird";

function makeSound2(animal: Animal): string {
    switch (animal) {
        case "cat": return "meow";
        case "dog": return "woof";
        case "bird": return "tweet";
        default:
            // If someone adds "fish" to Animal, this will error!
            // You're forced to handle the new case
            return assertNever(animal);
    }
}

function assertNever(value: never): never {
    throw new Error(`Unhandled case: ${value}`);
}

// Practical: Filtering with never in conditional types
// Conditional types distribute over unions. When some members resolve to never,
// those are automatically removed.

type FilterStrings<T> = T extends string ? T : never;

type OnlyStrings = FilterStrings<"a" | 1 | "b" | true | "c">;
// "a" | "b" | "c" (numbers and booleans are filtered out as never)

// --- Practical: Branded types (nominal typing) ---
// TypeScript has structural typing (duck typing). But sometimes you need
// nominal typing — two types with the same shape should be DIFFERENT types.

// The trick: add a phantom never property that only exists at the type level
type Brand<T, B> = T & { __brand: B };

type UserId = Brand<number, "UserId">;
type ProductId = Brand<number, "ProductId">;

function findUser(id: UserId): void {
    console.log(`Finding user with id: ${id}`);
}

function findProduct(id: ProductId): void {
    console.log(`Finding product with id: ${id}`);
}

const uid = 1 as UserId;
const pid = 100 as ProductId;

findUser(uid);
// findUser(pid); // error! Type 'ProductId' not assignable to 'UserId'
findProduct(pid);
// findUser(1); // error! number is not assignable to UserId

console.log("\n--- Branded types ---");
console.log("User ID and Product ID are distinct at the type level");

// --- Practical: Type-safe API with unknown at the boundary ---
// The "unknown then narrow" pattern is the gold standard

interface SafeResponse<T> {
    data: T;
    status: number;
}

async function safeFetch<T>(url: string): Promise<SafeResponse<T>> {
    const response = await fetch(url);
    const raw: unknown = await response.json();

    // At the system boundary, validate the data
    const { data, status } = raw as { data: unknown; status: number };

    return {
        data: data as T, // cast here, but in practice validate w/ zod or similar
        status,
    };
}

// --- Practical: Union exhaustiveness in generics ---
// TypeScript can track which union members have been "consumed"
// and will make the final case resolve to never

type RequestState<T> =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; data: T }
    | { status: "error"; error: string };

function renderRequestState<T>(state: RequestState<T>): string {
    switch (state.status) {
        case "idle":
            return "Waiting...";
        case "loading":
            return "Loading...";
        case "success":
            return `Data: ${state.data}`;
        case "error":
            return `Error: ${state.error}`;
        // If we added a new status value and forgot a case,
        // the default below catches it at compile time
    }
}

// Summary:
// - any: avoid it. It's the "I give up" switch.
// - unknown: use at system boundaries (API responses, user input, JSON parse).
//   Forces you to validate before using.
// - never: represents impossible states. Use for:
//   1. Functions that throw or infinite loop
//   2. Exhaustive switch checking
//   3. Filtering types in conditional types
//   4. Branded types for nominal typing