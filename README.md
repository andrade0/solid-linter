<div align="center"><img src="https://res.cloudinary.com/dhgmytqop/image/upload/v1680367017/solid-linter_fuhl1b.png" alt="Solid Linter" title="Solid Linter" width="400" height="400" /></div>

Introducing __ts-solid-linter__ - a powerful TypeScript linter designed to detect and report violations of the __SOLID principles__ in your TypeScript codebase. SOLID is an acronym representing a set of five design principles that, when adhered to, make software more understandable, flexible, and maintainable. These principles are:

- Single Responsibility Principle (SRP) [Todo]
- Open/Closed Principle (OCP)
- Liskov Substitution Principle (LSP)
- Interface Segregation Principle (ISP)
- Dependency Inversion Principle (DIP)

ts-solid-linter seamlessly integrates with your existing TypeScript projects and provides customizable rules that help enforce SOLID principles in your code. By using this linter, you can ensure that your application follows best practices and remains maintainable as it grows in complexity.

## Features:

Comprehensive rule set to check for SOLID principle violations
Easily integrable with existing TypeScript projects
Customizable rules to suit your team's coding standards and preferences
Supports reading configuration from JSON files, similar to ESLint
Clear, informative error messages with suggestions for resolving issues
Can be extended with additional custom rules
With ts-solid-linter, you can effortlessly maintain high-quality code and prevent the introduction of design issues that may hinder the scalability and maintainability of your TypeScript applications.

## Installation
```
yarn add -D ts-solid-linter
or
npm i --save-dev ts-solid-linter
```


## Usage

Create a .solidLint.json file in the root of your project and add the following:
```
{
  "src": "your-src-folder",
  "ocp": "on", // on/off
  "lsp": "on", // on/off
  "isp": "on", // on/off
  "dip": "on"  // on/off
}
```

### CLI

```
npx solidLint
or
./node_modules/.bin/solidLint
```

### SCRIPT

```
Add the following to your package.json file :
"scripts": {
  "solidLint": "solidLint"
}
```

## Contributing

Please Feel free to contribute to this project by submitting a pull request. If you have any questions, please open an issue.

<br />
<br />

<img src="https://png.pngtree.com/png-vector/20191024/ourmid/pngtree-online-donation-icon-outline-style-png-image_1855475.jpg" height="100" width="100">

# Donate <img width="20" height="20" src="https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/512/Ethereum-ETH-icon.png">

If you find this project useful, please consider donating to support further development in my <br />Ethereum wallet ( 0xAE89a36c5875781781cBD35f78EA7CE6506787D1 ) 

## Exemple of output

<img src="https://res.cloudinary.com/dhgmytqop/image/upload/v1680371829/Capture_d_e%CC%81cran_2023-04-01_a%CC%80_18.56.49_o6je1e.png">
<img src="https://res.cloudinary.com/dhgmytqop/image/upload/v1680371829/Capture_d_e%CC%81cran_2023-04-01_a%CC%80_18.56.18_rtfo6n.png">

## More about SOLID PRINCIPLES

The SOLID principles are a set of design principles that, when applied to your TypeScript code, can help make your software more maintainable, scalable, and easy to understand. Here's a brief explanation of each principle in the context of TypeScript:

- __Single Responsibility Principle (SRP)__: A class or module should have only one reason to change, meaning it should have only one responsibility. In TypeScript, you can achieve this by creating smaller, focused classes or modules that do one thing well. Avoid creating "god" classes or modules that are responsible for too many things.
```
// Bad practice
class User {
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = password;
  }
 
  register() {
    // enregistre l'utilisateur en base de données
    this.sendWelcomeEmail();
  }
 
  sendWelcomeEmail() {
    // envoie un email de bienvenue à l'utilisateur
  }
}
 
// Good pratique
class User {
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = password;
  }
 
  register() {
    // enregistre l'utilisateur en base de données
  }
}
 
class EmailService {
  constructor() {
    // ...
  }
 
  sendWelcomeEmail(user) {
    // envoie un email de bienvenue à l'utilisateur
  }
}
```

- __Open/Closed Principle (OCP):__ Software entities should be open for extension but closed for modification. In TypeScript, you can use inheritance, abstract classes, and interfaces to create new functionality without modifying existing code.
```
// Good practice
class PaymentProcessor {
  constructor(paymentMethod) {
    this.paymentMethod = paymentMethod;
  }
 
  processPayment(amount) {
    switch (this.paymentMethod) {
      case 'creditCard':
        // Traite le paiement par carte de crédit
        break;
      case 'paypal':
        // Traite le paiement par PayPal
        break;
      default:
        // Traitement par défaut
        break;
    }
  }
}
 
// Bad practice
class PaymentProcessor {
  constructor() {
    // ...
  }
 
  processPayment(amount) {
    // Traitement générique
  }
}
 
class CreditCardPaymentProcessor extends PaymentProcessor {
  constructor() {
    // ...
  }
 
  processPayment(amount) {
    // Traitement du paiement par carte de crédit
  }
}
 
class PaypalPaymentProcessor extends PaymentProcessor {
  constructor() {
    // ...
  }
 
  processPayment(amount) {
    // Traitement du paiement par PayPal
  }
}
```

- __Liskov Substitution Principle (LSP)__: Subtypes should be substitutable for their base types without affecting the correctness of the program. In TypeScript, you can use interfaces and ensure that derived classes follow the same contract as their base class or implemented interface.
```
// Bad practice
class Animal {
  constructor() {
    // ...
  }
 
  makeSound() {
    // ...
  }
}
 
class Bird extends Animal {
  constructor() {
    // ...
  }
 
  fly() {
    // ...
  }
}
 
// Utilisation incorrecte du principe LSP, car cela peut causer des erreurs
function makeAnimalSound(animal) {
  animal.makeSound();
}
 
makeAnimalSound(new Bird());
 
// Good practice
class Animal {
  constructor() {
    // ...
  }
 
  makeSound() {
    // ...
  }
}
 
class Bird extends Animal {
  constructor() {
    // ...
  }
 
  fly() {
    // ...
  }
 
  makeSound() {
    // ...
  }
}
 
function makeAnimalSound(animal) {
  animal.makeSound();
}
 
makeAnimalSound(new Bird());
```

- __Interface Segregation Principle (ISP)__: Clients should not be forced to implement interfaces they do not use. Instead, create smaller, more focused interfaces. In TypeScript, you can create smaller interfaces and use TypeScript's type system to enforce adherence to those interfaces.
```
// Bad practice
class PaymentProcessor {
  constructor() {
    // ...
  }
 
  processPayment(amount) {
    // ...
  }
 
  getPaymentHistory() {
    // Cette méthode n'est pas utilisée par tous les clients, donc elle ne devrait pas être dans l'interface
  }
}
 
class CreditCardPaymentProcessor extends PaymentProcessor {
  constructor() {
    // ...
  }
 
  processPayment(amount) {
    // ...
  }
}
 
// Good practice
class PaymentProcessor {
  constructor() {
    // ...
  }
 
  processPayment(amount) {
    // ...
  }
}
 
class CreditCardPaymentProcessor extends PaymentProcessor {
  constructor() {
    // ...
  }
 
  processPayment(amount) {
    // ...
  }
}
 
class PaymentProcessorClient {
  constructor(paymentProcessor) {
    this.paymentProcessor = paymentProcessor;
  }
 
  processPayment(amount) {
    this.paymentProcessor.processPayment(amount);
  }
}
```

- __Dependency Inversion Principle (DIP)__: High-level modules should not depend on low-level modules; both should depend on abstractions. In TypeScript, you can use interfaces and dependency injection to invert dependencies and create more flexible, testable code.
```
// Bad practice
class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }
 
  getUserById(id) {
    return this.userRepository.findById(id);
  }
}
 
class UserRepository {
  constructor() {
    // ...
  }
 
  findById(id) {
    // ...
  }
}
 
// Good practice
class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
 
  getUserById(id) {
    return this.userRepository.findById(id);
  }
}
 
class UserRepository {
  constructor() {
    // ...
  }
 
  findById(id) {
    // ...
  }
}
 
// Usage
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const user = userService.getUserById(123);
```
