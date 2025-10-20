// Tạo một lớp Calculator để đóng gói toàn bộ logic
class Calculator {
    // Constructor nhận vào hai phần tử hiển thị text
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear(); // Khởi tạo máy tính về trạng thái ban đầu
    }

    // Xóa tất cả, reset máy tính (nút C)
    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        if (this.updateDisplay) this.updateDisplay();
    }

    // Chỉ xóa mục nhập hiện tại (nút CE)
    clearEntry() {
        this.currentOperand = '';
        if (this.updateDisplay) this.updateDisplay();
    }

    // Xóa ký tự cuối cùng (nút ⌫)
    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    // Đổi dấu của số hiện tại (nút ±)
    negate() {
        if (this.currentOperand === '') return;
        this.currentOperand = parseFloat(this.currentOperand) * -1;
    }

    // Nối số vào chuỗi hiện tại
    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
        this.lastOperation = null; // Xóa lịch sử khi bắt đầu nhập số mới
    }

    // Chọn một phép toán hai ngôi (+, −, ×, ÷)
    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.lastOperation = null; // Xóa lịch sử khi chọn phép toán mới
    }

    // Xử lý các phép toán một ngôi (√, %, x², 1/x) - tính toán ngay lập tức
    handleSingleOperandOperation(operation) {
        if (this.currentOperand === '') return;
        const current = parseFloat(this.currentOperand);
        let result;

        switch (operation) {
            case 'sqrt':  // hoặc '√'
                result = Math.sqrt(current);
                break;
            case '%':
                result = current / 100;
                break;
            case 'square':
                result = Math.pow(current, 2);
                break;
            case '1/x':
                result = 1 / current;
                break;
            case '±':
                result = current * -1;
                break;
            default:
                return;
        }
        this.currentOperand = result;
    }


    // Thực hiện tính toán (khi bấm =)
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        // Kiểm tra nếu không có phép toán hoặc không có số để tính toán
        if (this.operation == null || isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '−':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            default:
                return;
        }
        
        // Lưu lại phép toán để hiển thị sau khi tính toán
        this.lastOperation = this.operation;
        this.lastPreviousOperand = this.previousOperand;
        this.lastCurrentOperand = this.currentOperand;
        
        this.currentOperand = computation;
        this.previousOperand = '';
        this.operation = null;
    }

    // Helper function để định dạng số cho đẹp hơn
    getDisplayNumber(number) {
        if (number === null || number === undefined) return '';
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    // Cập nhật giao diện màn hình
    updateDisplay(showFullOperation = false) {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.currentOperand === '' && this.previousOperand === '') {
            this.currentOperandTextElement.innerText = '0';
        }

        if (showFullOperation && this.lastOperation != null) {
            // Hiển thị phép toán đầy đủ khi nhấn "="
            this.previousOperandTextElement.innerText =
                `${this.getDisplayNumber(this.lastPreviousOperand)} ${this.lastOperation} ${this.getDisplayNumber(this.lastCurrentOperand)} =`;
        } else if (this.operation != null) {
            // Hiển thị số thứ nhất và toán tử khi đang nhập
            this.previousOperandTextElement.innerText =
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

// Export cho cả Node.js (Jest) và Browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Calculator;
}
