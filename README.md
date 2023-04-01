<div align="center"><img src="https://res.cloudinary.com/dhgmytqop/image/upload/v1680367017/solid-linter_fuhl1b.png" alt="Solid Linter" title="Solid Linter" width="400" height="400" /></div>

Introducing solid-linter - a powerful TypeScript linter designed to detect and report violations of the __SOLID principles__ in your TypeScript codebase. SOLID is an acronym representing a set of five design principles that, when adhered to, make software more understandable, flexible, and maintainable. These principles are:

- Single Responsibility Principle (SRP) [Todo]
- Open/Closed Principle (OCP)
- Liskov Substitution Principle (LSP)
- Interface Segregation Principle (ISP)
- Dependency Inversion Principle (DIP)

solid-linter seamlessly integrates with your existing TypeScript projects and provides customizable rules that help enforce SOLID principles in your code. By using this linter, you can ensure that your application follows best practices and remains maintainable as it grows in complexity.

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
yarn add -D solid-linter
or
npm i --save-dev solid-linter
```


## Usage

Create a .solidrc.json file in the root of your project and add the following:
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
  "solid-linter": "solidLint"
}
```

## Contributing

Please Feel free to contribute to this project by submitting a pull request. If you have any questions, please open an issue.
