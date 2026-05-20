// Enums

// Enum is a way to define a set of named constants. Enums allow you to define a collection of related values that can be used interchangeably in your code.

// For example, let's say you're building a weather app and you want to define a set of possible weather conditions like:
//  "sunny" "cloudy", "rainy", and "snowy". 
// You could define an enum like this:

enum WeatherCondition { 
    Sunny,
    Cloudy,
    Rainy,
    Snowy
}

// In this example, WeatherConditions is the name of the enum, and each of the values (e.g. Sunny, Cloudy, etc.) is assigned an automatic numerical value starting from

// You can also assign specific values to each enum member like this:

enum WeatherCondition2 { 
    Sunny = "sunny",
    Cloudy = "cloudy",
    Rainy = "rainy",
    Snowy = "snowy" 
}

const currentWeather1 = WeatherCondition.Rainy;
const currentWeather2 = WeatherCondition2.Snowy;
console.log(`the current weather is ${currentWeather1}`) // the current weather is 2
console.log(`the current weather is ${currentWeather2}`) // the current weather is snowy