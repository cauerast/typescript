// Utility Types
// TypeScript provides built-in utility types that transform existing types.
// These are essential tools you'll use daily in real projects.

// --- Partial<T> ---
// Makes all properties optional. Great for updates.
interface User {
    id: number;
    name: string;
    email: string;
    age: number;
}

function updateUser(id: number, updates: Partial<User>): void {
    console.log(`Updating user ${id} with:`, updates);
    // In real code: fetch user, merge updates, save
}

updateUser(1, { name: "Alice" }); // Only update name
updateUser(1, { email: "alice@new.com", age: 31 }); // Update multiple

// --- Required<T> ---
// Makes all properties required (opposite of Partial).
type Config = {
    apiKey?: string;
    debug?: boolean;
    endpoint?: string;
};

// This would error if any prop is missing
function initApp(config: Required<Config>): void {
    console.log(`Starting with ${config.apiKey} at ${config.endpoint}`);
}

// --- Readonly<T> ---
// Makes all properties read-only. Can't reassign them.
type Todo = {
    title: string;
    completed: boolean;
};

function displayTodo(todo: Readonly<Todo>): void {
    console.log(todo.title);
    // todo.title = "new"; // error! Readonly
}

// --- Pick<T, K> ---
// Select specific properties from a type.
type UserPublic = Pick<User, "name" | "email">; // { name: string; email: string }
const publicProfile: UserPublic = { name: "Bob", email: "bob@dev.com" };

// --- Omit<T, K> ---
// Remove specific properties from a type. The opposite of Pick.
type UserWithoutId = Omit<User, "id">; // { name, email, age }
const newUser: UserWithoutId = { name: "Charlie", email: "c@dev.com", age: 25 };

// --- Record<K, T> ---
// Creates an object type with keys K and values T.
type PageName = "home" | "about" | "contact";
type PageData = { title: string; url: string };

const pages: Record<PageName, PageData> = {
    home: { title: "Home", url: "/" },
    about: { title: "About", url: "/about" },
    contact: { title: "Contact", url: "/contact" },
};

// Record is great for dictionaries / lookup maps
type UserCache = Record<number, User>; // key = userId, value = User
const cache: UserCache = {
    1: { id: 1, name: "Alice", email: "a@dev.com", age: 30 },
    2: { id: 2, name: "Bob", email: "b@dev.com", age: 25 },
};

// --- Exclude<T, U> ---
// Remove types from a union.
type Status = "active" | "inactive" | "banned" | "pending";
type ActiveStatus = Exclude<Status, "banned" | "pending">; // "active" | "inactive"

// --- Extract<T, U> ---
// Extract types that are in a union. Opposite of Exclude.
type NumbersOrStrings = string | number | boolean;
type JustNumbers = Extract<NumbersOrStrings, number>; // number

// --- NonNullable<T> ---
// Remove null and undefined from a type.
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>; // string

// --- ReturnType<T> ---
// Get the return type of a function.
function fetchUser(): User {
    return { id: 1, name: "Alice", email: "a@dev.com", age: 30 };
}
type FetchedUser = ReturnType<typeof fetchUser>; // User

// Extremely useful with async functions
async function getData(): Promise<User[]> {
    return [fetchUser()];
}
type DataType = ReturnType<typeof getData>; // Promise<User[]>

// --- Parameters<T> ---
// Get the parameter types of a function as a tuple.
type FetchParams = Parameters<typeof fetchUser>; // []

function greet(name: string, age: number): string {
    return `${name} is ${age}`;
}
type GreetParams = Parameters<typeof greet>; // [name: string, age: number]

// --- Awaited<T> ---
// Unwrap a Promise type. Useful with async APIs.
type Unwrapped = Awaited<ReturnType<typeof getData>>; // User[]

// --- Practical: Form state with utility types ---
interface FormFields {
    username: string;
    email: string;
    password: string;
    bio: string;
}

// Form state with all fields optional (user may not fill everything yet)
type FormState = Partial<FormFields>;

// Validation errors — keys match form fields, values are error messages
type FormErrors = Partial<Record<keyof FormFields, string>>;

// Submit payload — remove password/bio from the final submit
type SubmitPayload = Pick<FormFields, "username" | "email">;

const form: FormState = { username: "alice_dev" };
const errors: FormErrors = { username: "Already taken" };
const payload: SubmitPayload = { username: "alice_dev", email: "a@dev.com" };

console.log("\n--- Utility Types Demo ---");
console.log("Partial update:", form);
console.log("Pick example:", publicProfile);
console.log("Record lookup:", cache[1]);
console.log("ReturnType:", {} as FetchedUser);
console.log("Awaited unwrap:", {} as Unwrapped);