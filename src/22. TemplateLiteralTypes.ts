// Template Literal Types (TS 4.1+)
// Template literal types are string types built from other types.
// They work like JavaScript template literals but at the type level.
// This is one of TypeScript's most creative and powerful features.

// --- Basic Template Literal Types ---
type Greeting = `Hello, ${string}!`;
// Any string that matches this pattern
const hi: Greeting = "Hello, world!"; // ok
// const wrong: Greeting = "Hi there"; // error! doesn't match pattern

type Endpoint = `/api/${string}`;
const apiCall: Endpoint = "/api/users"; // ok
// const wrong2: Endpoint = "/graphql"; // error!

// --- Combining with Union Types ---
// When you interpolate a union, it creates all possible combinations

type Size = "small" | "medium" | "large";
type Color = "red" | "blue" | "green";

type SizeColor = `${Size}-${Color}`;
// "small-red" | "small-blue" | "small-green"
// | "medium-red" | "medium-blue" | "medium-green"
// | "large-red" | "large-blue" | "large-green"

const shirt: SizeColor = "medium-blue"; // ok
const pants: SizeColor = "large-green";  // ok
// const invalid: SizeColor = "xl-red"; // error!

// --- Practical: CSS class combinations ---
type Breakpoint = "sm" | "md" | "lg";
type Utility = "flex" | "grid" | "hidden";
type Display = "block" | "inline" | "inline-block";

type ResponsiveClass = `${Breakpoint}:${Utility | Display}`;
// "sm:flex" | "md:flex" | "lg:flex" | "sm:grid" | ... (18 variants)
const className: ResponsiveClass = "md:flex"; // ok

// --- Practical: Event handlers (React-style) ---
type Element = "button" | "input" | "form" | "div";
type EventName = "Click" | "Focus" | "Change" | "Submit";

type EventHandler = `on${Capitalize<Element>}${EventName}`;
// "onButtonClick" | "onButtonFocus" | "onButtonChange"
// | "onInputClick" | "onInputFocus" | ... (16 variants)

// --- String Manipulation Utility Types ---
// TypeScript has built-in string transformers:

type LowerHello = Lowercase<"HELLO">;   // "hello"
type UpperHello = Uppercase<"hello">;   // "HELLO"
type CapitalHello = Capitalize<"hello">; // "Hello"
type UncapHello = Uncapitalize<"Hello">; // "hello"

// --- Practical: API endpoint builder ---
type Resource = "user" | "product" | "order";
type Action = "create" | "read" | "update" | "delete";

// RESTful API paths
type ApiPath = `/${Resource}/${Action | "list"}`;
// "/user/create" | "/user/read" | "/user/list" | "/product/create" | ...

// With ID parameter placeholder
type ApiPathWithId = `/${Resource}/${Action}/${string}`;
// "/user/update/abc123" | "/product/delete/xyz789"

// --- Practical: CSS property to camelCase converter ---
type CssProperty = "background-color" | "font-size" | "margin-top" | "border-radius";

// Transform kebab-case to camelCase
type KebabToCamel<S extends string> = S extends `${infer P}-${infer Q}`
    ? `${P}${Capitalize<KebabToCamel<Q>>}`
    : S;

type CamelProps = KebabToCamel<CssProperty>;
// "backgroundColor" | "fontSize" | "marginTop" | "borderRadius"

const style: Record<CamelProps, string> = {
    backgroundColor: "red",
    fontSize: "16px",
    marginTop: "10px",
    borderRadius: "4px",
};

console.log("\n--- Template Literal Types Demo ---");
console.log("CSS to camelCase:", style);

// --- Practical: State machine with template literals ---
type State = "idle" | "loading" | "success" | "error";
type Transition = `on${Capitalize<State>}${Capitalize<State>}`;
// "onIdleLoading" | "onIdleSuccess" | "onLoadingSuccess" | "onLoadingError" | ...

type StateMachineCallbacks = Partial<Record<Transition, () => void>>;

// --- Practical: Object key mapping with template literals ---
interface Person {
    name: string;
    age: number;
    email: string;
}

// Create getter/setter names from property names
type GettersSetters<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
} & {
    [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

type PersonAccessors = GettersSetters<Person>;
// { getName: () => string; setName: (value: string) => void;
//   getAge: () => number; setAge: (value: number) => void; ... }

// --- Practical: Database row type to API response ---
// Common pattern: DB columns are snake_case, API responses are camelCase
type SnakeCaseToCamel<S extends string> = S extends `${infer T}_${infer U}`
    ? `${T}${Capitalize<SnakeCaseToCamel<U>>}`
    : S;

type DbRow = {
    user_id: number;
    first_name: string;
    last_name: string;
    created_at: Date;
    updated_at: Date | null;
};

// Transform DB type to API response type
type ApiResponseType<T> = {
    [K in keyof T as SnakeCaseToCamel<string & K>]: T[K];
};

type UserApiResponse = ApiResponseType<DbRow>;
// { userId: number; firstName: string; lastName: string; createdAt: Date; updatedAt: Date | null }

const apiUser: UserApiResponse = {
    userId: 1,
    firstName: "Alice",
    lastName: "Smith",
    createdAt: new Date(),
    updatedAt: null,
};

console.log("\n--- DB to API transformation ---");
console.log("Snake to camel:", apiUser);

// Key takeaway:
// - Template literals create string pattern types
// - Unions in template literals expand to all combinations
// - Capitalize/Lowercase/Uppercase/Uncapitalize transform string types
// - Combine with infer + recursive types for powerful transformations
// - Real use: API paths, event handlers, CSS prop conversion, DB mapping