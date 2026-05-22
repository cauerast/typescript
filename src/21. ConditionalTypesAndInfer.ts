// Conditional Types & The "infer" Keyword
// Conditional types choose between two types based on a condition.
// Syntax: T extends U ? X : Y  (if T extends U, type = X, else Y)
// This is type-level programming — like ternary operators for types.

// --- Basic Conditional Types ---

type IsString<T> = T extends string ? "yes" : "no";

type Test1 = IsString<string>;  // "yes"
type Test2 = IsString<number>;  // "no"
type Test3 = IsString<"hello">; // "yes" ("hello" extends string)

// --- Filter from a union ---
// Conditional types distribute over unions (called "distributive conditional types")

type ExtractString<T> = T extends string ? T : never;

type Result1 = ExtractString<string | number | boolean | string[]>;
// string — never + never are removed, only string survives

// This is literally how the built-in Extract<T, U> utility type works

// --- Practical: Null check ---
type NonNull<T> = T extends null | undefined ? never : T;

type Value1 = NonNull<string | null>;       // string
type Value2 = NonNull<number | undefined>;  // number

function stripNull<T>(value: T): NonNull<T> {
    if (value === null || value === undefined) {
        throw new Error("Null value");
    }
    return value as NonNull<T>;
}

const cleaned = stripNull("hello" as string | null);
//    ^? type is string

// --- Chaining conditional types ---
// You can nest them for multiple conditions

type GradeResult<T> =
    T extends number
        ? T extends 0 | 1 | 2 ? "fail"
        : T extends 3 | 4 ? "pass"
        : T extends 5 ? "excellent"
        : "invalid grade"
    : "not a number";

type Grade1 = GradeResult<0>;    // "fail"
type Grade2 = GradeResult<4>;    // "pass"
type Grade3 = GradeResult<5>;    // "excellent"
type Grade4 = GradeResult<"A">;  // "not a number"

// --- The "infer" keyword ---
// infer lets you capture a type from within another type and use it.
// This is THE most advanced and most powerful TypeScript feature.

// Basic: Extract the element type of an array
type ArrayElement<T> = T extends (infer U)[] ? U : never;

type El1 = ArrayElement<string[]>;     // string
type El2 = ArrayElement<number[][]>;   // number[]
type El3 = ArrayElement<boolean>;      // never (not an array)

// Extract return type of a function (like ReturnType<T>)
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function greet(name: string): string {
    return `Hello ${name}`;
}

function fetchAge(): Promise<number> {
    return Promise.resolve(25);
}

type GreetReturn = MyReturnType<typeof greet>;         // string
type FetchReturn = MyReturnType<typeof fetchAge>;       // Promise<number>

// Extract parameter types (like Parameters<T>)
type MyParameters<T> = T extends (...args: infer P) => any ? P : never;

type GreetParams = MyParameters<typeof greet>;  // [name: string]
type FetchParams = MyParameters<typeof fetchAge>; // []

// Extract the first parameter type
type FirstParam<T> = T extends (first: infer F, ...args: any[]) => any ? F : never;

type FirstGreetParam = FirstParam<typeof greet>; // string

// --- Practical: Unwrap Promise (like Awaited<T>) ---
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type Prom1 = UnwrapPromise<Promise<string>>;     // string
type Prom2 = UnwrapPromise<Promise<number[]>>;   // number[]
type Prom3 = UnwrapPromise<string>;              // string (no promise, passthrough)

// Deep unwrap for nested promises
type DeepUnwrap<T> = T extends Promise<infer U> ? DeepUnwrap<U> : T;

type NestedProm = DeepUnwrap<Promise<Promise<Promise<string>>>>; // string

// --- Practical: Extract from React-like types ---
type Props = {
    onClick: () => void;
    children: React.ReactElement<any>;
    className?: string;
};

// Extract function types from an object
type FunctionProps<T> = {
    [K in keyof T as T[K] extends Function ? K : never]: T[K];
};

type EventHandlers = FunctionProps<Props>; // { onClick: () => void }

// Extract non-function (data) props
type DataProps<T> = {
    [K in keyof T as T[K] extends Function ? never : K]: T[K];
};

// --- Practical: Deep partial with conditional types ---
type DeepPartial<T> = T extends object
    ? T extends Function
        ? T
        : { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

interface AppConfig {
    server: {
        host: string;
        port: number;
        ssl: { enabled: boolean; certPath: string };
    };
    features: {
        darkMode: boolean;
        beta: boolean;
    };
}

type PartialConfig = DeepPartial<AppConfig>;
// Everything becomes optional, recursively

const partialConfig: PartialConfig = {
    server: { host: "localhost", ssl: { enabled: true } },
};
console.log("\n--- Conditional Types Demo ---");
console.log("Deep partial config:", partialConfig);

// --- Conditional + Mapped + Infer combo ---
// This is the "real world" — combining all three

// Extract all method signatures from a class/object
type Methods<T> = {
    [K in keyof T as T[K] extends (...args: any[]) => any ? K : never]: T[K];
};

// Extract all data properties
type Properties<T> = {
    [K in keyof T as T[K] extends (...args: any[]) => any ? never : K]: T[K];
};

class UserService {
    users: string[] = [];
    constructor(public dbUrl: string) {}
    async findUser(id: number): Promise<string> { return "user"; }
    async saveUser(user: string): Promise<void> {}
    clear(): void { this.users = []; }
}

type UserMethods = Methods<UserService>;
// { findUser: (id: number) => Promise<string>; saveUser: (user: string) => Promise<void>; clear: () => void }

type UserProps = Properties<UserService>;
// { users: string[]; dbUrl: string }

// Key takeaway:
// - Conditional types = "T extends U ? X : Y"
// - They distribute over unions automatically
// - "infer" captures types from within other types (arrays, functions, promises)
// - Combine with mapped types for real power