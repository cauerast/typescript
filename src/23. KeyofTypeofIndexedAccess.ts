// keyof, typeof & Indexed Access Types
// These three tools let you reflect on types at the type level:
// - keyof: get all keys of an object type as a union
// - typeof: get the type of a value (runtime → type level)
// - Indexed access: get the type of a specific property

// --- keyof ---
// Returns a union of all property keys of a type

interface Vehicle {
    make: string;
    model: string;
    year: number;
    electric: boolean;
}

type VehicleKeys = keyof Vehicle;
// "make" | "model" | "year" | "electric"

function getVehicleProperty(vehicle: Vehicle, key: keyof Vehicle): unknown {
    return vehicle[key];
}

// Generic version — preserves the value type
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

const car: Vehicle = { make: "Tesla", model: "Model 3", year: 2024, electric: true };
const model = getProperty(car, "model"); // string
const isElectric = getProperty(car, "electric"); // boolean
// getProperty(car, "color"); // error! "color" not in keyof Vehicle

console.log("\n--- keyof & getProperty ---");
console.log(`Model: ${model}, Electric: ${isElectric}`);

// keyof with arrays
type StringArray = string[];
type ArrayKeys = keyof StringArray;
// number | "length" | "push" | "pop" | ... (all array methods)

// keyof with functions
type FuncKeys = keyof (() => void);
// never (functions have no accessible keys via keyof)

// --- typeof ---
// Get the type of a runtime value. Bridge between runtime and type world.

const config = {
    apiUrl: "https://api.example.com",
    timeout: 5000,
    retries: 3,
    debug: false,
};

type ConfigType = typeof config;
// { apiUrl: string; timeout: number; retries: number; debug: boolean }

const anotherConfig: ConfigType = {
    apiUrl: "https://other.api.com",
    timeout: 10000,
    retries: 5,
    debug: true,
};

// typeof with function return types
function createUser(name: string, age: number) {
    return { id: Date.now(), name, age, createdAt: new Date() };
}

type CreatedUser = ReturnType<typeof createUser>;
// { id: number; name: string; age: number; createdAt: Date }

// --- Practical: Constants as types ---
// Most common real-world use: derive types from constant objects

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
} as const;

type StatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
// 200 | 201 | 400 | 401 | 403 | 404 | 500

function respond(status: StatusCode, body: unknown): void {
    console.log(`[${status}]`, body);
}

respond(200, { message: "OK" });
// respond(999, {}); // error! 999 not in StatusCode

// --- Indexed Access Types ---
// Look up the type of a specific property: T[K]

type VehicleMake = Vehicle["make"];     // string
type VehicleYear = Vehicle["year"];     // number
type Mixed = Vehicle["make" | "year"];  // string | number
type AllValues = Vehicle[keyof Vehicle]; // string | number | boolean

// Nested indexed access
interface Company {
    name: string;
    address: {
        street: string;
        city: string;
        zip: string;
        geo: { lat: number; lng: number };
    };
    employees: Employee[];
}

interface Employee {
    name: string;
    role: string;
    salary: number;
}

type CompanyAddress = Company["address"];             // { street: string; city: string; zip: string; geo: { lat: number; lng: number } }
type Street = Company["address"]["street"];            // string
type Geo = Company["address"]["geo"];                  // { lat: number; lng: number }
type EmployeeList = Company["employees"];              // Employee[]
type SingleEmployee = Company["employees"][number];    // Employee (element type of array)
type EmployeeNames = Company["employees"][number]["name"]; // string
type Salaries = Company["employees"][number]["salary"];    // number

// --- Practical: Type-safe event system ---
type EventMap = {
    click: { x: number; y: number; target: HTMLElement };
    focus: { element: HTMLElement };
    keydown: { key: string; ctrlKey: boolean };
    resize: { width: number; height: number };
};

function emitEvent<K extends keyof EventMap>(name: K, payload: EventMap[K]): void {
    console.log(`Event "${name}":`, payload);
}

emitEvent("click", { x: 100, y: 200, target: document.body });
emitEvent("resize", { width: 1920, height: 1080 });
// emitEvent("click", { x: 1, y: 2 }); // error! missing "target"

// --- Practical: Nested object type with dynamic paths ---
// A type-safe path lookup utility (simplified version)

type DeepValue<T, Path extends string> = Path extends keyof T
    ? T[Path]
    : Path extends `${infer K}.${infer R}`
        ? K extends keyof T
            ? T[K] extends object
                ? DeepValue<T[K], R>
                : never
            : never
        : never;

type CompanyName = DeepValue<Company, "name">;          // string
type CompanyLat = DeepValue<Company, "address.geo.lat">; // number

function getDeepValue<T, P extends string>(
    obj: T,
    path: P
): DeepValue<T, P> {
    const keys = path.split(".") as (keyof T)[];
    let current: any = obj;
    for (const key of keys) {
        current = current[key];
    }
    return current;
}

const myCompany: Company = {
    name: "Acme Inc",
    address: {
        street: "123 Main St",
        city: "Springfield",
        zip: "12345",
        geo: { lat: 40.7128, lng: -74.006 },
    },
    employees: [
        { name: "Alice", role: "Engineer", salary: 100000 },
    ],
};

console.log("\n--- Deep value access ---");
console.log("Name:", getDeepValue(myCompany, "name"));
console.log("Latitude:", getDeepValue(myCompany, "address.geo.lat"));

// --- Combining keyof, typeof, and indexed access ---
const ROLES = {
    ADMIN: "admin",
    USER: "user",
    GUEST: "guest",
} as const;

type RoleKeys = keyof typeof ROLES;         // "ADMIN" | "USER" | "GUEST"
type RoleValues = (typeof ROLES)[keyof typeof ROLES]; // "admin" | "user" | "guest"

function checkAccess(role: RoleValues): string {
    switch (role) {
        case "admin": return "Full access";
        case "user": return "Limited access";
        case "guest": return "Read-only";
    }
}

console.log("\n--- Role access ---");
console.log(checkAccess("admin"));
console.log(checkAccess("guest"));

// Key takeaway:
// - keyof = get all keys as a union. Use with generics for type-safe property access
// - typeof = go from runtime value to type. Use with "as const" for literal types
// - Indexed access = T[K] to get property types. Chain for nested access
// - (typeof X)[keyof typeof X] = "values of object as union" — extremely common pattern