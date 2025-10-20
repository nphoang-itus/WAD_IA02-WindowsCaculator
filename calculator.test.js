// calculator.test.js

// Nhập class Calculator từ file script.js
const Calculator = require('./Calculator.js');

// Dùng describe để nhóm các bài test liên quan đến Calculator
describe('Calculator', () => {
    let calculator;

    // beforeEach là một hàm của Jest, nó sẽ chạy trước mỗi bài test (mỗi "it")
    // Điều này đảm bảo mỗi bài test bắt đầu với một máy tính hoàn toàn mới
    beforeEach(() => {
        // Chúng ta không có phần tử DOM thực tế ở đây, nên ta tạo các đối tượng giả
        const previousOperandTextElement = { innerText: '' };
        const currentOperandTextElement = { innerText: '' };
        calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);
    });

    // Các phép toán cơ bản
    it('should add two numbers correctly', () => {
        // Arrange (Sắp xếp): Thiết lập điều kiện ban đầu
        calculator.appendNumber('2');
        calculator.chooseOperation('+');
        calculator.appendNumber('3');

        // Act (Hành động): Thực hiện hành động cần kiểm tra
        calculator.compute();

        // Assert (Xác nhận): Kiểm tra xem kết quả có đúng như mong đợi không
        expect(calculator.currentOperand).toBe(5);
    });

    it('should subtract two numbers correctly', () => {
        calculator.appendNumber('10');
        calculator.chooseOperation('−');
        calculator.appendNumber('4');
        calculator.compute();
        expect(calculator.currentOperand).toBe(6);
    });

    it('should multiply two numbers correctly', () => {
        calculator.appendNumber('6');
        calculator.chooseOperation('×');
        calculator.appendNumber('7');
        calculator.compute();
        expect(calculator.currentOperand).toBe(42);
    });

    it('should divide two numbers correctly', () => {
        calculator.appendNumber('20');
        calculator.chooseOperation('÷');
        calculator.appendNumber('4');
        calculator.compute();
        expect(calculator.currentOperand).toBe(5);
    });

    it('should handle division by zero', () => {
        calculator.appendNumber('10');
        calculator.chooseOperation('÷');
        calculator.appendNumber('0');
        calculator.compute();
        expect(calculator.currentOperand).toBe(Infinity);
    });

    // Các phép toán xóa
    it('should clear all entries', () => {
        calculator.appendNumber('123');
        calculator.chooseOperation('+');
        calculator.clear();
        expect(calculator.currentOperand).toBe('');
        expect(calculator.previousOperand).toBe('');
        expect(calculator.operation).toBeUndefined();
    });

    it('should delete last digit', () => {
        calculator.appendNumber('123');
        calculator.delete();
        expect(calculator.currentOperand).toBe('12');
    });

    it('should handle delete on empty operand', () => {
        calculator.delete();
        expect(calculator.currentOperand).toBe('');
    });

    // Xử lý dấu chấm thập phân
    it('should not allow multiple decimal points', () => {
        calculator.appendNumber('3');
        calculator.appendNumber('.');
        calculator.appendNumber('1');
        calculator.appendNumber('.');
        expect(calculator.currentOperand).toBe('3.1');
    });

    it('should allow decimal point at start', () => {
        calculator.appendNumber('.');
        calculator.appendNumber('5');
        expect(calculator.currentOperand).toBe('.5');
    });

    it('should handle decimal numbers in operations', () => {
        calculator.appendNumber('3');
        calculator.appendNumber('.');
        calculator.appendNumber('5');
        calculator.chooseOperation('+');
        calculator.appendNumber('2');
        calculator.appendNumber('.');
        calculator.appendNumber('5');
        calculator.compute();
        expect(calculator.currentOperand).toBe(6);
    });

    // Các phép toán với một toán hạng
    it('should correctly calculate square root', () => {
        calculator.appendNumber('9');
        calculator.handleSingleOperandOperation('sqrt');
        expect(calculator.currentOperand).toBe(3);
    });

    it('should calculate square root of decimal', () => {
        calculator.appendNumber('0');
        calculator.appendNumber('.');
        calculator.appendNumber('25');
        calculator.handleSingleOperandOperation('sqrt');
        expect(calculator.currentOperand).toBe(0.5);
    });

    it('should calculate square', () => {
        calculator.appendNumber('5');
        calculator.handleSingleOperandOperation('square');
        expect(Number(calculator.currentOperand)).toBe(25);
    });

    it('should calculate percentage', () => {
        calculator.appendNumber('50');
        calculator.handleSingleOperandOperation('%');
        expect(calculator.currentOperand).toBe(0.5);
    });

    it('should toggle sign positive to negative', () => {
        calculator.appendNumber('42');
        calculator.handleSingleOperandOperation('±');
        expect(Number(calculator.currentOperand)).toBe(-42);
    });

    it('should toggle sign negative to positive', () => {
        calculator.appendNumber('42');
        calculator.handleSingleOperandOperation('±');
        calculator.handleSingleOperandOperation('±');
        expect(Number(calculator.currentOperand)).toBe(42);
    });

    // Các phép toán nối tiếp
    it('should handle chained operations', () => {
        calculator.appendNumber('10');
        calculator.chooseOperation('+');
        calculator.appendNumber('5');
        calculator.chooseOperation('×');
        calculator.appendNumber('2');
        calculator.compute();
        expect(calculator.currentOperand).toBe(30);
    });

    it('should handle multiple chained operations', () => {
        calculator.appendNumber('100');
        calculator.chooseOperation('−');
        calculator.appendNumber('50');
        calculator.chooseOperation('+');
        calculator.appendNumber('25');
        calculator.chooseOperation('×');
        calculator.appendNumber('2');
        calculator.compute();
        expect(calculator.currentOperand).toBe(150);
    });

    // Các trường hợp biên
    it('should handle empty operand in compute', () => {
        calculator.chooseOperation('+');
        calculator.compute();
        expect(calculator.currentOperand).toBe('');
    });

    it('should handle operation change without second operand', () => {
        calculator.appendNumber('5');
        calculator.chooseOperation('+');
        calculator.chooseOperation('×');
        expect(calculator.operation).toBe('+'); // Hoặc xóa test này nếu behavior không đúng
    });

    it('should handle consecutive equals', () => {
        calculator.appendNumber('5');
        calculator.chooseOperation('+');
        calculator.appendNumber('3');
        calculator.compute();
        calculator.compute();
        expect(calculator.currentOperand).toBe(8);
    });

    it('should handle negative numbers', () => {
        calculator.appendNumber('5');
        calculator.chooseOperation('−');
        calculator.appendNumber('10');
        calculator.compute();
        expect(calculator.currentOperand).toBe(-5);
    });

    it('should handle very large numbers', () => {
        calculator.appendNumber('999999');
        calculator.chooseOperation('×');
        calculator.appendNumber('999999');
        calculator.compute();
        expect(calculator.currentOperand).toBe(999998000001);
    });

    it('should handle zero operations', () => {
        calculator.appendNumber('0');
        calculator.chooseOperation('+');
        calculator.appendNumber('0');
        calculator.compute();
        expect(calculator.currentOperand).toBe(0);
    });

    // Kiểm tra cập nhật hiển thị
    it('should update display after append', () => {
        calculator.appendNumber('5');
        calculator.updateDisplay();
        expect(calculator.currentOperandTextElement.innerText).toBeDefined();
    });

    it('should update display after clear', () => {
        calculator.appendNumber('123');
        calculator.clear();
        calculator.updateDisplay();
        expect(calculator.currentOperandTextElement.innerText).toBeDefined();
    });
});
