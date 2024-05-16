class CalculatorBrain {
    constructor() {
        this.lastOperation = null;
        this.lastOperand = null;
        this.add = (a, b) => a + b;
        this.subtract = (a, b) => a - b;
        this.multiply = (a, b) => a * b;
        this.divide = (a, b) => {
            if (b === 0) {
                throw new Error("i/0");
            }
            return a / b;
        }
        this.modulus = (a, b) => a % b;
        this.pow = (a, b) => Math.pow(a, b);
        this.sqrt = a => {
            if (a < 0) {
                throw new Error("√-i");
            }
            return Math.sqrt(a);
        };
    }

    processOperations(values, ops, operators) {
        const val2 = values.pop();
        const val1 = values.pop();
        const op = ops.pop();
        this.lastOperation = operators[op];
        this.lastOperand = val2;
        values.push(operators[op](val1, val2));
    }

    calculate(expression) {
        const operators = {
            '+': this.add,
            '-': this.subtract,
            '*': this.multiply,
            '/': this.divide,
            '%': this.modulus,
            '^': this.pow,
            '√': this.sqrt
        };
        const precedence = {
            '+': 1,
            '-': 1,
            '*': 2,
            '/': 2,
            '%': 2,
            '^': 3,
            '√': 3
        };
        const expressionArray = this.parseExpression(expression);
        const values = [];
        const ops = [];
        for (let i = 0; i < expressionArray.length; i++) {
            const token = expressionArray[i];
            if (!operators.hasOwnProperty(token)) {
                values.push(token);
            } else {
                while (ops.length !== 0 && precedence[ops[ops.length - 1]] >= precedence[token]) {
                    const val2 = values.pop();
                    const val1 = values.pop();
                    const op = ops.pop();
                    values.push(operators[op](val1, val2));
                }
                ops.push(token);
            }
        }
        while (ops.length !== 0) {
            this.processOperations(values, ops, operators);
        }
        try {
            while (ops.length !== 0) {
                this.processOperations(values, ops, operators);
            }
        } catch (error) {
            return 'Error';
        }
        return values.pop();
    }

    parseExpression(expression) {
        const operators = ['+', '-', '*', '/', '%', '^', '√'];
        const expressionArray = [];
        let number = '';
        for (let i = 0; i < expression.length; i++) {
            const char = expression[i];
            if (char === ' ') continue;
            if (operators.includes(char)) {
                if (number) {
                    expressionArray.push(parseFloat(number));
                    number = '';
                }
                expressionArray.push(char);
                if (char === '√') {
                    let operand = '';
                    i++;
                    while (i < expression.length && !operators.includes(expression[i])) {
                        operand += expression[i];
                        i++;
                    }
                    if (operand !== '') {
                        expressionArray.push(parseFloat(operand));
                    }
                    i--;
                }
            } else {
                number += char;
                if (i === expression.length - 1 || operators.includes(expression[i + 1])) {
                    expressionArray.push(parseFloat(number));
                    number = '';
                }
            }
        }
        if (number !== '') {
            expressionArray.push(parseFloat(number));
        }
        return expressionArray;
    }

    clear = () => {
        this.lastOperation = null;
        this.lastOperand = null;
    }
}

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
            ['^', 'button-power'], ['√', 'button-square-root']
        ];
        buttons.forEach(([text, className]) => this.createCalculatorButton(calculatorButtons, text, className));
    }

    createCalculatorButton(parent, text, className) {
        const calculatorButton = this.creator.create('button', parent, `calculator-button ${className}`);
        calculatorButton.textContent = text;
        return calculatorButton;
    }
}

class CalculatorEvents {
    constructor(calculatorDom, calculatorBrain) {
        this.calculatorBrain = calculatorBrain;
        this.calculatorDom = calculatorDom;
        this.lastButton = null;
        this.addEvents();
    }

    addEvents() {
        this.addCalculatorButtonEvents();
        window.addEventListener('keydown', this.handleKeyboardInput.bind(this));
    }

    handleKeyboardInput(e) {
        const validKeys = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/', '%', '^', '(', ')', 'Enter', '=', 'Backspace', 'Escape']);
        const output = this.calculatorDom.calculatorOutput.textContent;
        if (!validKeys.has(e.key)) {
            return;
        }
        switch (e.key) {
            case '=':
            case 'Enter':
                if (this.lastButton === '=' || this.lastButton === 'Enter') {
                    if (output == 'NaN' || output == 'Infinity' || output == 'Error' || output === 'i/0' || output === '√-i') {
                        this.clearCalculatorOutput();
                    } else {
                        this.repeatLastOperation();
                    }
                } else {
                    this.calculate();
                }
                break;
            case 'Backspace':
                this.calculatorDom.calculatorOutput.textContent = this.calculatorDom.calculatorOutput.textContent.slice(0, -1);
                break;
            case 'Escape':
                this.clearCalculatorOutput();
                break;
            default:
                this.updateCalculatorOutput(e.key);
                break;
        }
        this.lastButton = e.key;
    }

    addCalculatorButtonEvents() {
        const calculatorButtons = this.calculatorDom.calculatorInput;
        calculatorButtons.addEventListener('click', this.handleCalculatorButtonClick.bind(this));
    }

    handleCalculatorButtonClick(e) {
        const button = e.target;
        const output = this.calculatorDom.calculatorOutput.textContent;
        if (button.tagName !== 'BUTTON') {
            return;
        }
        const validButtons = new Set(['C', '(', ')', '%', '7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+', '^', '√']);
        if (!validButtons.has(button.textContent)) {
            return;
        }
        switch (button.textContent) {
            case 'C':
                this.clearCalculatorOutput();
                break;
            case '=':
                this.lastButton === '=' ? this.repeatLastOperation() : this.calculate();
                break;
            case '√':
                if (output.match(/[+\-*/%^]/) || output === '0') {
                    this.updateCalculatorOutput(button.textContent);
                } else {
                    const result = this.calculatorBrain.sqrt(parseFloat(output));
                    this.calculatorDom.calculatorOutput.textContent = result;
                }
                break;
            default:
                if (this.lastButton === '=' && !isNaN(button.textContent)) {
                    this.clearCalculatorOutput();
                }
                this.updateCalculatorOutput(button.textContent);
                break;
        }
        this.lastButton = button.textContent;
    }

    clearCalculatorOutput() {
        this.calculatorDom.calculatorOutput.textContent = '0';
        this.lastButton = null;
        this.calculatorBrain.clear();
    }

    updateCalculatorOutput(value) {
        const output = this.calculatorDom.calculatorOutput;
        if (output.textContent === '0') {
            output.textContent = value;
        } else {
            output.textContent += value;
        }
    }

    repeatLastOperation() {
        if (this.calculatorBrain.lastOperation && this.calculatorBrain.lastOperand !== null) {
            const output = this.calculatorBrain.lastOperation(parseFloat(this.calculatorDom.calculatorOutput.textContent), this.calculatorBrain.lastOperand);
            this.calculatorDom.calculatorOutput.textContent = output;
        }
    }

    calculate() {
        try {
            const output = this.calculatorDom.calculatorOutput.textContent;
            if (output.includes('√')) {
                const number = parseFloat(output.split('√')[1]);
                const sqrt = this.calculatorBrain.sqrt(number);
                output = output.replace(`√${number}`, sqrt.toString());
            }
            const result = this.calculatorBrain.calculate(output);
            this.calculatorDom.calculatorOutput.textContent = result;
        } catch (error) {
            this.calculatorDom.calculatorOutput.textContent = error.message;
        }
    }
}

export default class Calculator {
    constructor(calculatorScreen) {
        this.creator = calculatorScreen.domManager.creator;
        this.CalculatorBrain = new CalculatorBrain();
        this.CalculatorDom = new CalculatorDom(calculatorScreen, this.creator);
        this.CalculatorEvents = new CalculatorEvents(this.CalculatorDom, this.CalculatorBrain);
    }
}