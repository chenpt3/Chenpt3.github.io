class CalculatorDom {
    constructor(calculatorScreen, creator) {
        this.creator = creator;
        this.createCalculator(calculatorScreen);
    }
    createCalculator(calculatorScreen) {
        const calculatorDiv = this.creator.create('div', calculatorScreen.screen, 'calculator-container');
        this.calculatorOutput = this.createCalculatorOutput(calculatorDiv);
        this.calculatorInput = this.createCalculatorInput(calculatorDiv);
    }
    createCalculatorOutput(parent) {
        const calculatorOutput = this.creator.create('div', parent, 'calculator-output');
        calculatorOutput.textContent = '0';
        return calculatorOutput;
    }
    createCalculatorInput(parent) {
        const calculatorControls = this.creator.create('div', parent, 'calculator-controls');
        this.createCalculatorButtons(calculatorControls);
        return calculatorControls;
    }
    createCalculatorButtons(parent) {
        const calculatorButtons = this.creator.create('div', parent, 'calculator-buttons');
        const buttons = [
            ['C', 'button-clear'], ['(', 'button-open-parenthesis'], [')', 'button-close-parenthesis'], ['%', 'button-modulus'],
            ['7', 'button-seven'], ['8', 'button-eight'], ['9', 'button-nine'], ['/', 'button-divide'],
            ['4', 'button-four'], ['5', 'button-five'], ['6', 'button-six'], ['*', 'button-multiply'],
            ['1', 'button-one'], ['2', 'button-two'], ['3', 'button-three'], ['-', 'button-subtract'],
            ['0', 'button-zero'], ['.', 'button-decimal'], ['=', 'button-equals'], ['+', 'button-add'],
            ['^', 'button-power'], ['√', 'button-square-root'], ['DEL', 'button-delete']
        ];
        buttons.forEach(([text, className]) => this.createCalculatorButton(calculatorButtons, text, className));
    }
    createCalculatorButton(parent, text, className) {
        const calculatorButton = this.creator.create('button', parent, `calculator-button ${className}`);
        calculatorButton.textContent = text;
        return calculatorButton;
    }
}
class ExpressionParser {
    constructor() {
        this.operators = ['+', '-', '*', '/', '%', '^', '√'];
    }

    isOperator(char) {
        return this.operators.includes(char);
    }

    parseExpression(expression) {
        // Split the expression into numbers, operators, and parentheses
        let expressionArray = expression.split(/([\+\-\*\/\%\^\√\(\)])/).filter(Boolean);

        // Convert numbers from strings to actual numbers
        expressionArray = expressionArray.map(token => this.isOperator(token) || token === '(' || token === ')' ? token : Number(token));

        // Insert multiplication operators between numbers and parentheses where necessary
        expressionArray = expressionArray.reduce((result, token, i) => {
            if (Number.isFinite(token) && expressionArray[i + 1] === '(') {
                result.push(token, '*');
            } else if (token === ')' && Number.isFinite(expressionArray[i + 1])) {
                result.push(token, '*');
            } else {
                result.push(token);
            }
            return result;
        }, []);

        return expressionArray;
    }
}
class CalculatorBrain {
    constructor() {
        this.parser = new ExpressionParser();
        this.lastOperation = null;
        this.lastOperand = null;
        this.operators = {
            '+': this.add,
            '-': this.subtract,
            '*': this.multiply,
            '/': this.divide,
            '%': this.modulus,
            '^': this.pow,
            '√': this.sqrt
        };
        this.precedence = {
            '+': 1,
            '-': 1,
            '*': 2,
            '/': 2,
            '%': 2,
            '^': 3,
            '√': 3
        };
    }

    // Moved the operator functions here to make them more reusable
    add = (num1, num2) => num1 + num2;
    subtract = (num1, num2) => num1 - num2;
    multiply = (num1, num2) => num1 * num2;
    divide = (num1, num2) => {
        if (num2 === 0) throw new Error("i/0");
        return num1 / num2;
    }
    modulus = (num1, num2) => num1 % num2;
    pow = (num1, num2) => Math.pow(num1, num2);
    sqrt = num => {
        if (num < 0) throw new Error("√-i");
        return Math.sqrt(num);
    };

    processOperations(values, operations) {
        const operand2 = values.pop();
        const operand1 = values.pop();
        const operation = operations.pop();
        this.lastOperation = this.operators[operation];
        this.lastOperand = operand2;
        values.push(this.operators[operation](operand1, operand2));
    }

    calculate(expression) {
        const expressionArray = this.parser.parseExpression(expression);
        const values = [];
        const ops = [];
        for (let i = 0; i < expressionArray.length; i++) {
            const token = expressionArray[i];
            if (!Object.keys(this.operators).includes(token) && token !== '(' && token !== ')') {
                if (typeof token === 'number' || (typeof token === 'string' && !isNaN(token))) {
                    values.push(parseFloat(token));
                }
            } else if (token === '(') {
                ops.push(token);
            } else if (token === ')') {
                while (ops.length !== 0 && ops[ops.length - 1] !== '(') {
                    this.processOperations(values, ops);
                }
                ops.pop();
            } else {
                while (ops.length !== 0 && this.precedence[ops[ops.length - 1]] >= this.precedence[token] && ops[ops.length - 1] !== '(') {
                    this.processOperations(values, ops);
                }
                ops.push(token);
            }
        }
        while (ops.length !== 0) {
            this.processOperations(values, ops);
        }
        const result = values.pop();
        if (isNaN(result)) {
            throw new Error("Result is NaN");
        }
        return result;
    }

    clear = () => {
        this.lastOperation = null;
        this.lastOperand = null;
    }
}
class CalculatorEvents {
    constructor(calculatorDom, calculatorBrain) {
        this.calculatorBrain = calculatorBrain;
        this.calculatorDom = calculatorDom;
        this.lastButton = null;
        this.validKeys = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/', '%', '^', '(', ')', 'Enter', '=', 'Backspace', 'Escape']);
        this.validButtons = new Set(['C', '(', ')', '%', '7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+', '^', '√', 'DEL']);
        this.inputHandlers = {
            '-': this.handleMinusInput,
            'C': this.clearCalculatorOutput,
            'Escape': this.clearCalculatorOutput,
            '=': this.handleEqualsInput,
            'Enter': this.handleEqualsInput,
            '√': this.handleSqrtInput,
            'DEL': this.handleDelInput,
            'Backspace': this.handleDelInput,
            'default': this.handleDefaultInput
        };
        this.addEvents();
    }

    addEvents() {
        this.addCalculatorButtonEvents();
        window.addEventListener('keydown', this.handleKeyboardInput.bind(this));
    }

    handleKeyboardInput(e) {
        if (!this.validKeys.has(e.key)) {
            return;
        }
        this.handleInput(e.key);
    }

    handleInput(input) {
        const handler = this.inputHandlers[input] || this.inputHandlers['default'];
        handler.call(this, input);
        this.lastButton = input;
    }

    handleMinusInput(input) {
        const output = this.calculatorDom.calculatorOutput.textContent;
        const lastChar = output[output.length - 1];
        const operators = ['+', '-', '*', '/', '%', '^', '√'];
        if (operators.includes(lastChar) || lastChar === '(') {
            this.updateCalculatorOutput(input);
        } else {
            this.updateCalculatorOutput(` ${input}`);
        }
    }

    handleEqualsInput(input) {
        const output = this.calculatorDom.calculatorOutput.textContent;
        if (output.includes('Error')) {
            this.clearCalculatorOutput();
        } else if (this.lastButton === '=' || this.lastButton === 'Enter') {
            this.repeatLastOperation();
        } else {
            this.calculate();
        }
    }

    handleSqrtInput(input) {
        const output = this.calculatorDom.calculatorOutput.textContent;
        if (output.match(/[+\-*/%^]/) || output === '0') {
            this.updateCalculatorOutput(input);
        } else {
            const result = this.calculatorBrain.sqrt(Number(output));
            this.calculatorDom.calculatorOutput.textContent = result;
        }
    }

    handleDelInput(input) {
        const output = this.calculatorDom.calculatorOutput.textContent;
        if (output === '0' || this.lastButton === '=' || this.lastButton === 'Enter') {
            return;
        }
        this.calculatorDom.calculatorOutput.textContent = this.calculatorDom.calculatorOutput.textContent.slice(0, -1);
        if (this.calculatorDom.calculatorOutput.textContent === '') {
            this.clearCalculatorOutput();
        }
    }

    handleDefaultInput(input) {
        if (this.lastButton === '=' && !isNaN(input)) {
            this.clearCalculatorOutput();
        }
        this.updateCalculatorOutput(input);
    }
    addCalculatorButtonEvents() {
        const calculatorButtons = this.calculatorDom.calculatorInput;
        calculatorButtons.addEventListener('click', this.handleCalculatorButtonClick.bind(this));
    }
    handleCalculatorButtonClick(e) {
        const button = e.target;
        if (button.tagName !== 'BUTTON') {
            return;
        }
        if (!this.validButtons.has(button.textContent)) {
            return;
        }
        this.handleInput(button.textContent);
    }
    clearCalculatorOutput() {
        this.calculatorDom.calculatorOutput.textContent = '0';
        this.lastButton = null;
        this.calculatorBrain.clear();
    }
    updateCalculatorOutput(value) {
        const output = this.calculatorDom.calculatorOutput;
        if (output.textContent === '0' && value !== '-') {
            output.textContent = value;
        } else {
            output.textContent += value;
        }
    }
    repeatLastOperation() {
        const output = this.calculatorDom.calculatorOutput;
        const lastOperation = this.calculatorBrain.lastOperation;
        const lastOperand = this.calculatorBrain.lastOperand;
        const result = lastOperation(Number(output.textContent), lastOperand);
        output.textContent = result;
    }
    calculate() {
        try {
            let output = this.calculatorDom.calculatorOutput.textContent;
            if (output.includes('√')) {
                const sqrtMatch = output.match(/√(\d+(\.\d+)?)/); // Match √ followed by a number (integer or decimal)
                if (sqrtMatch) {
                    const number = parseFloat(sqrtMatch[1]); // Extract the number from the match
                    const sqrt = this.calculatorBrain.sqrt(number);
                    output = output.replace(`√${number}`, sqrt.toString());
                } else {
                    throw new Error("Invalid square root operation"); // Throw an error if the square root operation is not properly formatted
                }
            }
            const result = this.calculatorBrain.calculate(output);
            this.calculatorDom.calculatorOutput.textContent = result;
        } catch (error) {
            if (error.message === "i/0") {
                this.calculatorDom.calculatorOutput.textContent = 'Error: Division by zero';
            } else if (error.message === "√-i") {
                this.calculatorDom.calculatorOutput.textContent = 'Error: Square root of negative number';
            } else if (error.message === "Invalid square root operation") {
                this.calculatorDom.calculatorOutput.textContent = 'Error: Invalid square root operation';
            } else {
                this.calculatorDom.calculatorOutput.textContent = 'Error: Invalid operation';
            }
        }
    }
}
export default class Calculator {
    constructor(calculatorScreen, state) {
        this.creator = calculatorScreen.domManager.creator;
        this.CalculatorBrain = new CalculatorBrain();
        this.CalculatorDom = new CalculatorDom(calculatorScreen, this.creator);
        this.CalculatorEvents = new CalculatorEvents(this.CalculatorDom, this.CalculatorBrain);
        if (state) {
            this.CalculatorDom.calculatorOutput.textContent = state.textContent;
        }
        this.state = this.CalculatorDom.calculatorOutput;
    }
}