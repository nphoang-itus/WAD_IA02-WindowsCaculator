// Import Calculator nếu đang trong môi trường module
// Nếu không, class sẽ được load từ Calculator.js qua <script> tag
const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operator]");
const equalsButton = document.querySelector('[data-action="equals"]');
const deleteButton = document.querySelector('[data-action="backspace"]');
const allClearButton = document.querySelector('[data-action="clear"]');
const clearEntryButton = document.querySelector('[data-action="clear-entry"]');
const negateButton = document.querySelector('[data-action="negate"]');
const previousOperandTextElement = document.querySelector(
  "[data-previous-operand]"
);
const currentOperandTextElement = document.querySelector(
  "[data-current-operand]"
);

const calculator = new Calculator(
  previousOperandTextElement,
  currentOperandTextElement
);

// History elements
const historyToggle = document.getElementById('historyToggle');
const historyPanel = document.getElementById('historyPanel');
const historyContent = document.getElementById('historyContent');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const operation = button.dataset.operation || button.innerText;
    const binaryOperations = ["+", "−", "×", "÷"];
    const unaryOperations = ["sqrt", "2√x", "%", "square", "1/x", "±"];

    if (binaryOperations.includes(operation)) {
      calculator.chooseOperation(operation);
    } else if (unaryOperations.includes(operation)) {
      calculator.handleSingleOperandOperation(operation);
    }
    calculator.updateDisplay();
  });
});

equalsButton.addEventListener("click", () => {
  calculator.compute();
  calculator.updateDisplay(true);
});

allClearButton.addEventListener("click", () => {
  calculator.clear();
});

clearEntryButton.addEventListener("click", () => {
  calculator.clearEntry();
});

deleteButton.addEventListener("click", () => {
  calculator.delete();
  calculator.updateDisplay();
});

negateButton.addEventListener("click", () => {
  calculator.handleSingleOperandOperation("±");
  calculator.updateDisplay();
});

// --- Hỗ trợ nhập liệu từ bàn phím ---
window.addEventListener("keydown", handleKeyboardInput);

function handleKeyboardInput(e) {
  const key = e.key;

  if ((key >= 0 && key <= 9) || key === ".") {
    // Nếu là các phím số hoặc dấu chấm
    e.preventDefault(); // Ngăn hành vi mặc định của trình duyệt
    calculator.appendNumber(key);
    calculator.updateDisplay();
  } else if (key === "+" || key === "-") {
    // Nếu là phím + hoặc -
    e.preventDefault();
    // JavaScript key cho phép trừ là "-", nhưng nút của chúng ta là "−"
    // Cần chuyển đổi để khớp với logic
    const operation = key === "-" ? "−" : key;
    calculator.chooseOperation(operation);
    calculator.updateDisplay();
  } else if (key === "*" || key === "x") {
    // Nếu là phím * hoặc x
    e.preventDefault();
    calculator.chooseOperation("×");
    calculator.updateDisplay();
  } else if (key === "/") {
    // Nếu là phím /
    e.preventDefault();
    calculator.chooseOperation("÷");
    calculator.updateDisplay();
  } else if (key === "%") {
    e.preventDefault();
    calculator.handleSingleOperandOperation("%");
    calculator.updateDisplay();
  } else if (key === "Enter" || key === "=") {
    // Nếu là phím Enter hoặc =
    e.preventDefault();
    calculator.compute();
    calculator.updateDisplay(true);
  } else if (key === "Backspace") {
    // Nếu là phím Backspace
    e.preventDefault();
    calculator.delete();
    calculator.updateDisplay();
  } else if (key === "Escape" || key.toLowerCase() === "c") {
    // Nếu là phím Escape hoặc C
    e.preventDefault();
    calculator.clear();
    calculator.updateDisplay();
  }
}

// History functionality
function updateHistoryDisplay() {
  const history = calculator.getHistory();
  
  if (history.length === 0) {
    historyContent.innerHTML = '<div class="no-history">No history yet</div>';
    return;
  }

  const historyHTML = history.map(item => `
    <div class="history-item" onclick="useHistoryResult('${item.result}')">
      <div class="history-expression">${item.expression}</div>
      <div class="history-result">${item.result}</div>
    </div>
  `).join('');

  historyContent.innerHTML = historyHTML;
}

function useHistoryResult(result) {
  calculator.currentOperand = result.replace(/,/g, ''); // Remove commas for calculation
  calculator.previousOperand = '';
  calculator.operation = null;
  calculator.updateDisplay();
  
  // Hide history panel on mobile after selection
  if (window.innerWidth < 768) {
    historyPanel.classList.remove('show');
  }
}

function toggleHistory() {
  historyPanel.classList.toggle('show');
}

// Event listeners
historyToggle.addEventListener('click', toggleHistory);

clearHistoryBtn.addEventListener('click', () => {
  calculator.clearHistory();
});

// Close history panel when clicking outside on mobile
document.addEventListener('click', (e) => {
  if (window.innerWidth < 768 && 
      historyPanel.classList.contains('show') && 
      !historyPanel.contains(e.target) && 
      !historyToggle.contains(e.target)) {
    historyPanel.classList.remove('show');
  }
});

// Close history panel with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && historyPanel.classList.contains('show')) {
    historyPanel.classList.remove('show');
  }
});

// --- Công khai Class Calculator để file kiểm thử có thể truy cập ---
if (typeof module !== "undefined" && module.exports) {
  module.exports = Calculator;
}
