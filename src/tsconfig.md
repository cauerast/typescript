## 1. Initialize the Project
Generate the base configuration file.

npm init -y
Note: This creates package.json, not node_modules.


## 2. Install Dependencies
Install TypeScript, Node types, and a fast execution tool.

npm install -D typescript @types/node tsx

## 3. Configure package.json
Open package.json and update the fields. Ensure the name is unique.

{
  "name": "my-ts-app",
  "type": "module",
  "main": "./build/index.js",
  "scripts": {
    "build": "tsc",
    "dev": "tsx src/index.ts",
    "start": "node build/index.js"
  }
}

## 4. Configure tsconfig.json
Create a tsconfig.json file in the root folder. Paste your optimized configuration:

{
  "compilerOptions": {
    "target": "ESNext",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ESNext", "DOM"],
    "rootDir": "src",
    "outDir": "build",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}

## 5. Build and Run
Create your source file at src/index.ts. Use these commands to manage your workflow:

* Development: npm run dev (Runs code instantly without saving build files)
* Production Build: npm run build (Compiles TS down to the build folder)
* Production Run: npm run start (Executes the compiled JavaScript)

