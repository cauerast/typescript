// Classes

// You can annotate class properties with a type. This allows you to define the data type of the property and ensure that it is always consistent.

class Person {
    name: string;
    age: number;

    constructor(name: string, age: number){
        this.name = name;
        this.age = age;
    }
}

// Access Modifiers
// In TypeScript, you can use access modifiers to control the visibility of class members (properties and methods). Access modifiers determine the ways in which class members can be accessed from within and outside the class.

class Animal {
    public name: string;
    private age:number;
    protected species:string;

    constructor(name:string, age:number, species:string){
        this.name = name;
        this.age = age;
        this.species = species;
    }

    getName():string {
        return this.name;
    }

    getAge():number {
        return this.age;
    }

    getSpecies():string {
        return this.species;
    }

    setName(name:string):void {
        this.name = name;
    }

    setAge(age:number): void {
        this.age = age;
    }

    setSpecies(species:string):void {
        this.species = species;
    }

    toString(): string {
        return "animal: \n" + 
                "\n\t name: " + this.name +
                "\n\t age: " + this.age +
                "\n\t species: " + this.species;
    }
}

class Dog extends Animal {
    constructor(name: string, age:number){
        super(name, age, "canine");
    }
}

// Public: Members marked as public can be accessed from anywhere, both inside and outside the class.
// Private: Members marked as private can only be accessed from within the class they are defined in.
// Protected: Members marked as protected can be accessed from within the class they are defined in, as well as any subclasses that extend the class.