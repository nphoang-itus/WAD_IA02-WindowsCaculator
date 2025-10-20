// Import Calculator nếu đang trong môi trường module
// Nếu không, class sẽ được load từ Calculator.js qua <script> tag

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operator]');
const equalsButton = document.querySelector('[data-action="equals"]');
const deleteButton = document.querySelector('[data-action="backspace"]');
const allClearButton = document.querySelector('[data-action="clear"]');
const clearEntryButton = document.querySelector('[data-action="clear-entry"]');
const negateButton = document.querySelector('[data-action="negate"]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        const operation = button.dataset.operation || button.innerText;
        const binaryOperations = ['+', '−', '×', '÷'];
        const unaryOperations = ['sqrt', '2√x', '%', 'square', '1/x', '±'];

        if (binaryOperations.includes(operation)) {
            calculator.chooseOperation(operation);
        } else if (unaryOperations.includes(operation)) {
            calculator.handleSingleOperandOperation(operation);
        }
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay(true);
});

allClearButton.addEventListener('click', () => {
    calculator.clear();
});

clearEntryButton.addEventListener('click', () => {
    calculator.clearEntry();
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

negateButton.addEventListener('click', () => {
    calculator.handleSingleOperandOperation('±');
    calculator.updateDisplay();
});

// --- Công khai Class Calculator để file kiểm thử có thể truy cập ---
module.exports = Calculator;