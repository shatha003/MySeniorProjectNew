import { useState, useCallback } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Delete, RotateCcw, Divide, X, Minus, Plus, Equal, Percent } from 'lucide-react';

type Operator = '+' | '-' | '*' | '/' | null;

export default function Calculator() {
    const [display, setDisplay] = useState('0');
    const [previousValue, setPreviousValue] = useState<number | null>(null);
    const [operator, setOperator] = useState<Operator>(null);
    const [waitingForOperand, setWaitingForOperand] = useState(false);
    const [history, setHistory] = useState<string>('');

    const inputDigit = useCallback((digit: string) => {
        if (waitingForOperand) {
            setDisplay(digit);
            setWaitingForOperand(false);
        } else {
            setDisplay(display === '0' ? digit : display + digit);
        }
    }, [display, waitingForOperand]);

    const inputDecimal = useCallback(() => {
        if (waitingForOperand) {
            setDisplay('0.');
            setWaitingForOperand(false);
            return;
        }
        if (!display.includes('.')) {
            setDisplay(display + '.');
        }
    }, [display, waitingForOperand]);

    const clear = useCallback(() => {
        setDisplay('0');
        setPreviousValue(null);
        setOperator(null);
        setWaitingForOperand(false);
        setHistory('');
    }, []);

    const clearEntry = useCallback(() => {
        setDisplay('0');
    }, []);

    const backspace = useCallback(() => {
        if (display.length === 1 || (display.length === 2 && display.startsWith('-'))) {
            setDisplay('0');
        } else {
            setDisplay(display.slice(0, -1));
        }
    }, [display]);

    const toggleSign = useCallback(() => {
        const value = parseFloat(display);
        setDisplay(String(value * -1));
    }, [display]);

    const percentage = useCallback(() => {
        const value = parseFloat(display);
        setDisplay(String(value / 100));
    }, [display]);

    const performOperation = useCallback((nextOperator: Operator) => {
        const inputValue = parseFloat(display);

        if (previousValue === null) {
            setPreviousValue(inputValue);
            setHistory(`${inputValue} ${nextOperator}`);
        } else if (operator) {
            const currentValue = previousValue;
            let result: number;

            switch (operator) {
                case '+':
                    result = currentValue + inputValue;
                    break;
                case '-':
                    result = currentValue - inputValue;
                    break;
                case '*':
                    result = currentValue * inputValue;
                    break;
                case '/':
                    result = inputValue === 0 ? NaN : currentValue / inputValue;
                    break;
                default:
                    result = inputValue;
            }

            if (nextOperator === null) {
                setHistory(`${currentValue} ${operator} ${inputValue} =`);
            } else {
                setHistory(`${result} ${nextOperator}`);
            }

            const displayValue = isNaN(result) ? 'Error' : String(result);
            setDisplay(displayValue);
            setPreviousValue(isNaN(result) ? null : result);
        }

        setWaitingForOperand(true);
        setOperator(nextOperator);
    }, [display, operator, previousValue]);

    const calculate = useCallback(() => {
        performOperation(null);
        setOperator(null);
        setPreviousValue(null);
    }, [performOperation]);

    const CalcButton = ({ 
        children, 
        onClick, 
        className = '', 
        variant = 'default' 
    }: { 
        children: React.ReactNode; 
        onClick: () => void; 
        className?: string;
        variant?: 'default' | 'operator' | 'function' | 'equals';
    }) => {
        const baseStyles = 'h-14 sm:h-16 rounded-xl font-semibold text-lg transition-all duration-150 active:scale-95 hover:scale-[1.02] flex items-center justify-center';
        
        const variants = {
            default: 'bg-muted hover:bg-muted/80 text-foreground',
            operator: 'bg-primary/20 hover:bg-primary/30 text-primary',
            function: 'bg-secondary hover:bg-secondary/80 text-secondary-foreground',
            equals: 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25'
        };

        return (
            <button
                onClick={onClick}
                className={`${baseStyles} ${variants[variant]} ${className}`}
            >
                {children}
            </button>
        );
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 max-w-md mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Calculator</h1>
                <p className="text-muted-foreground">
                    Perform quick calculations with a clean interface.
                </p>
            </div>

            <Card className="border-primary/20 shadow-lg overflow-hidden">
                <CardContent className="p-0">
                    {/* Display */}
                    <div className="bg-card p-6 border-b border-border">
                        <div className="text-right">
                            <div className="text-sm text-muted-foreground h-5 truncate mb-1">
                                {history}
                            </div>
                            <div className="text-4xl sm:text-5xl font-bold font-mono tracking-tight truncate text-foreground">
                                {display}
                            </div>
                        </div>
                    </div>

                    {/* Keypad */}
                    <div className="p-4 grid grid-cols-4 gap-2 sm:gap-3 bg-muted/30">
                        {/* Row 1 */}
                        <CalcButton variant="function" onClick={clear}>AC</CalcButton>
                        <CalcButton variant="function" onClick={clearEntry}>CE</CalcButton>
                        <CalcButton variant="function" onClick={backspace}>
                            <Delete size={20} />
                        </CalcButton>
                        <CalcButton variant="operator" onClick={() => performOperation('/')}>
                            <Divide size={20} />
                        </CalcButton>

                        {/* Row 2 */}
                        <CalcButton onClick={() => inputDigit('7')}>7</CalcButton>
                        <CalcButton onClick={() => inputDigit('8')}>8</CalcButton>
                        <CalcButton onClick={() => inputDigit('9')}>9</CalcButton>
                        <CalcButton variant="operator" onClick={() => performOperation('*')}>
                            <X size={20} />
                        </CalcButton>

                        {/* Row 3 */}
                        <CalcButton onClick={() => inputDigit('4')}>4</CalcButton>
                        <CalcButton onClick={() => inputDigit('5')}>5</CalcButton>
                        <CalcButton onClick={() => inputDigit('6')}>6</CalcButton>
                        <CalcButton variant="operator" onClick={() => performOperation('-')}>
                            <Minus size={20} />
                        </CalcButton>

                        {/* Row 4 */}
                        <CalcButton onClick={() => inputDigit('1')}>1</CalcButton>
                        <CalcButton onClick={() => inputDigit('2')}>2</CalcButton>
                        <CalcButton onClick={() => inputDigit('3')}>3</CalcButton>
                        <CalcButton variant="operator" onClick={() => performOperation('+')}>
                            <Plus size={20} />
                        </CalcButton>

                        {/* Row 5 */}
                        <CalcButton onClick={percentage}>
                            <Percent size={18} />
                        </CalcButton>
                        <CalcButton onClick={() => inputDigit('0')}>0</CalcButton>
                        <CalcButton onClick={inputDecimal}>.</CalcButton>
                        <CalcButton variant="equals" onClick={calculate}>
                            <Equal size={20} />
                        </CalcButton>
                    </div>
                </CardContent>
            </Card>

            {/* Keyboard shortcuts hint */}
            <div className="text-center text-xs text-muted-foreground">
                Tip: Use your keyboard for quick input
            </div>
        </div>
    );
}
