// Mapped Types
// Mapped types let you create new types by iterating over keys of an existing type.
// Think of them like "map" for types — you transform each property.

// --- Basic Mapped Type ---
// Syntax: { [K in keyof T]: NewType }

type Point = {
    x: number;
    y: number;
    z: number;
};

// Make all properties read-only
type ReadonlyPoint = {
    readonly [K in keyof Point]: Point[K];
};
// Equivalent to: { readonly x: number; readonly y: number; readonly z: number }

// Make all properties optional
type OptionalPoint = {
    [K in keyof Point]?: Point[K];
};

// --- Key Remapping via "as" (TS 4.1+) ---
// You can rename keys with the "as" clause

interface Person {
    name: string;
    age: number;
    email: string;
}

// Add "get" prefix to every key
type GettersPerson = {
    [K in keyof Person as `get${Capitalize<string & K>}`]: () => Person[K];
};
// Equivalent to: { getName: () => string; getAge: () => number; getEmail: () => string }

// Remove keys by filtering with "as"
type WithoutEmail = {
    [K in keyof Person as K extends "email" ? never : K]: Person[K];
};
// { name: string; age: number }

// --- Practical: Making fields nullable ---
type Nullable<T> = {
    [K in keyof T]: T[K] | null;
};

type NullablePerson = Nullable<Person>;
// { name: string | null; age: number | null; email: string | null }

// --- Practical: String literal transformations ---
interface Product {
    title: string;
    price: number;
    description: string;
}

// Convert to CSS-like naming (kebab-case → it's actually just all keys)
// But more useful: make all string values
type Stringified<T> = {
    [K in keyof T]: string;
};
type StringifiedProduct = Stringified<Product>;
// { title: string; price: string; description: string }

// --- Practical: API response wrappers ---
// Wrap every field in an async getter
type Asyncify<T> = {
    [K in keyof T]: () => Promise<T[K]>;
};
type AsyncProduct = Asyncify<Product>;
// { title: () => Promise<string>; price: () => Promise<number>; ... }

// --- Filtering by value type ---
// Pick only keys whose values are strings
type StringKeys<T> = {
    [K in keyof T as T[K] extends string ? K : never]: T[K];
};

type PersonStrings = StringKeys<Person>; // { name: string; email: string }

// Pick only keys whose values are numbers
type NumberKeys<T> = {
    [K in keyof T as T[K] extends number ? K : never]: T[K];
};

type PersonNumbers = NumberKeys<Person>; // { age: number }

// --- Building the built-in utility types yourself ---
// Understanding mapped types means you know how the built-in ones work

type MyPartial<T> = {
    [K in keyof T]?: T[K];
};

type MyReadonly<T> = {
    readonly [K in keyof T]: T[K];
};

type MyPick<T, K extends keyof T> = {
    [P in K]: T[P];
};

type MyRecord<K extends string | number | symbol, V> = {
    [P in K]: V;
};

// --- Practical: Deep (recursive) mapped type ---
// A deep readonly that works on nested objects

type DeepReadonly<T> = {
    readonly [K in keyof T]: T[K] extends object
        ? T[K] extends Function
            ? T[K]
            : DeepReadonly<T[K]>
        : T[K];
};

type NestedConfig = {
    server: {
        host: string;
        port: number;
        ssl: {
            enabled: boolean;
            cert: string;
        };
    };
    database: {
        url: string;
        pool: number;
    };
};

type FrozenConfig = DeepReadonly<NestedConfig>;
// Everything is deeply readonly

const config: FrozenConfig = {
    server: { host: "localhost", port: 3000, ssl: { enabled: true, cert: "path" } },
    database: { url: "postgres://...", pool: 10 },
};

// config.server.host = "new"; // error! readonly
// config.database.url = "new"; // error! readonly

console.log("\n--- Mapped Types Demo ---");
console.log("Deep readonly config:", config.server);

// --- Practical: Data transfer object (DTO) transformer ---
// Strip fields and make everything optional at once

type DTO<T> = {
    [K in keyof T as T[K] extends Function ? never : K]?: T[K];
};

class UserEntity {
    constructor(
        public id: number,
        public name: string,
        public email: string,
        public password: string
    ) {}

    hashPassword(): void {
        console.log("hashing...");
    }

    validate(): boolean {
        return true;
    }
}

// DTO strips methods and makes data fields optional for partial updates
type UserDTO = DTO<UserEntity>;
// { id?: number; name?: string; email?: string; password?: string }

const updatePayload: UserDTO = { name: "New Name" }; // valid partial update
console.log("DTO update:", updatePayload);

// Key takeaway: mapped types = iterating over object keys to transform values.
// Combine with key remapping ("as") to filter or rename keys.
// Deep variants handle nested objects recursively.