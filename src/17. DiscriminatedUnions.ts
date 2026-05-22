// Discriminated Unions
// Discriminated unions (also called "tagged unions") are a pattern where a union type
// shares a common literal property (the "discriminant") that TypeScript can use to
// narrow down which type you're working with inside a conditional block.
// This is THE most important TypeScript pattern for real-world React/SaaS apps.

// --- Basic Pattern ---

// Each type in the union has a common "kind" property (the discriminant)
type SuccessState = {
    kind: "success";
    data: string;
};

type ErrorState = {
    kind: "error";
    error: string;
};

type LoadingState = {
    kind: "loading";
};

// The discriminated union — three shapes, one discriminant field
type ApiState = SuccessState | ErrorState | LoadingState;

function handleApiState(state: ApiState): string {
    // TypeScript narrows based on the discriminant
    switch (state.kind) {
        case "loading":
            return "Loading...";
        case "success":
            // Here TypeScript knows state.data exists
            return `Success: ${state.data}`;
        case "error":
            // Here TypeScript knows state.error exists
            return `Error: ${state.error}`;
    }
}

console.log(handleApiState({ kind: "loading" }));
console.log(handleApiState({ kind: "success", data: "User fetched!" }));
console.log(handleApiState({ kind: "error", error: "Network failed" }));

// --- Practical: API Response with different payloads ---

type User = {
    id: number;
    name: string;
    email: string;
};

type Product = {
    id: number;
    title: string;
    price: number;
};

// Discriminated union for different API endpoints
type ApiResponse =
    | { kind: "user"; data: User }
    | { kind: "product"; data: Product }
    | { kind: "list"; data: User[] | Product[] }
    | { kind: "error"; message: string };

function handleResponse(response: ApiResponse): void {
    switch (response.kind) {
        case "user":
            console.log(`User: ${response.data.name} (${response.data.email})`);
            break;
        case "product":
            console.log(`Product: ${response.data.title} - $${response.data.price}`);
            break;
        case "list":
            console.log(`Items: ${response.data.length} results`);
            break;
        case "error":
            console.error(`Error: ${response.message}`);
            break;
    }
}

handleResponse({ kind: "user", data: { id: 1, name: "Alice", email: "alice@dev.com" } });
handleResponse({ kind: "list", data: [] });
handleResponse({ kind: "error", message: "Unauthorized" });

// --- Practical: React useReducer pattern ---
// This is exactly how useReducer works in React

type CartAction =
    | { type: "ADD_ITEM"; payload: { id: number; name: string; price: number } }
    | { type: "REMOVE_ITEM"; payload: { id: number } }
    | { type: "CLEAR_CART" }
    | { type: "APPLY_DISCOUNT"; payload: { code: string; percent: number } };

type CartItem = { id: number; name: string; price: number; quantity: number };

type CartState = {
    items: CartItem[];
    discount: number;
    discountCode: string | null;
};

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case "ADD_ITEM": {
            const existing = state.items.find(i => i.id === action.payload.id);
            if (existing) {
                return {
                    ...state,
                    items: state.items.map(i =>
                        i.id === action.payload.id
                            ? { ...i, quantity: i.quantity + 1 }
                            : i
                    ),
                };
            }
            return {
                ...state,
                items: [...state.items, { ...action.payload, quantity: 1 }],
            };
        }
        case "REMOVE_ITEM":
            return {
                ...state,
                items: state.items.filter(i => i.id !== action.payload.id),
            };
        case "CLEAR_CART":
            return { items: [], discount: 0, discountCode: null };
        case "APPLY_DISCOUNT":
            return {
                ...state,
                discount: action.payload.percent,
                discountCode: action.payload.code,
            };
    }
}

const cart1: CartState = { items: [], discount: 0, discountCode: null };
console.log("\n--- Cart Reducer Simulation ---");
console.log("Initial:", cart1);
const cart2 = cartReducer(cart1, { type: "ADD_ITEM", payload: { id: 1, name: "T-Shirt", price: 29.99 } });
console.log("After add:", cart2);
const cart3 = cartReducer(cart2, { type: "APPLY_DISCOUNT", payload: { code: "SAVE10", percent: 10 } });
console.log("After discount:", cart3);

// --- Practical: Form field validation ---

type FormField<T> =
    | { status: "idle"; value: T }
    | { status: "valid"; value: T }
    | { status: "invalid"; value: T; error: string }
    | { status: "submitting"; value: T };

function renderField(field: FormField<string>): string {
    switch (field.status) {
        case "idle":
            return `[Input] ${field.value}`;
        case "valid":
            return `[✓] ${field.value}`;
        case "invalid":
            return `[✗] ${field.value} — ${field.error}`;
        case "submitting":
            return `[⏳] Validating...`;
    }
}

console.log("\n--- Form Field States ---");
console.log(renderField({ status: "idle", value: "" }));
console.log(renderField({ status: "invalid", value: "bad@", error: "Invalid email format" }));
console.log(renderField({ status: "valid", value: "user@dev.com" }));

// --- Exhaustive checking with "never" ---
// If you add a new variant and forget to handle it, TypeScript will error.
// This is called exhaustive type checking — a huge safety net.

function assertNever(value: never): never {
    throw new Error(`Unhandled variant: ${value}`);
}

type PaymentMethod =
    | { kind: "credit"; cardNumber: string }
    | { kind: "paypal"; email: string }
    | { kind: "pix"; key: string }; // try commenting this out

function processPayment(method: PaymentMethod): string {
    switch (method.kind) {
        case "credit":
            return `Processing credit card ****${method.cardNumber.slice(-4)}`;
        case "paypal":
            return `Processing PayPal: ${method.email}`;
        case "pix":
            return `Processing PIX: ${method.key}`;
        default:
            // If you add a new kind to PaymentMethod but forget a case,
            // this line will error — forcing you to handle it
            return assertNever(method);
    }
}

console.log("\n--- Exhaustive Checking ---");
console.log(processPayment({ kind: "credit", cardNumber: "1234567890123456" }));
console.log(processPayment({ kind: "paypal", email: "user@paypal.com" }));
console.log(processPayment({ kind: "pix", key: "user@pix.com" }));

// Key takeaway: discriminated unions + switch = match expressions from Rust.
// Use this everywhere in React: reducers, API calls, form state, modals, etc.