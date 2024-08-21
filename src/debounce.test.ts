import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {debounce} from './debounce';

describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })
  
    afterEach(() => {
      vi.useRealTimers()
    })
    
    it('should not call the function immediately', () => {
        const func = vi.fn();
        const debouncedFunc = debounce(func, 1000);
    
        debouncedFunc();

        expect(func).not.toHaveBeenCalled();
    });
    
    it('should call the function after the wait period', () => {
        const func = vi.fn();
        const debouncedFunc = debounce(func, 1000);
    
        debouncedFunc();
        vi.advanceTimersByTime(1000);

        expect(func).toHaveBeenCalledTimes(1);
    });
    
    it('should ignore subsequent calls within the wait period', () => {
        const func = vi.fn();
        const debouncedFunc = debounce(func, 1000);
    
        debouncedFunc();
        debouncedFunc();
        debouncedFunc();
        vi.advanceTimersByTime(1000);

        expect(func).toHaveBeenCalledTimes(1);
    });
    
    it('should call the function with the latest arguments', () => {
        const func = vi.fn((a: number) => a);
        const debouncedFunc = debounce(func, 1000);
    
        debouncedFunc(1);
        debouncedFunc(2);
        vi.advanceTimersByTime(1000);
        
        expect(func).toHaveBeenCalledWith(2);
    });
    
    it('should maintain the correct context (this)', () => {
        const context = { value: 42 };
        const func = vi.fn(function (this: typeof context) {
            return this.value;
        });
        const debouncedFunc = debounce(func.bind(context), 1000);
    
        debouncedFunc();
        vi.advanceTimersByTime(1000);
    
        expect(func).toHaveReturnedWith(42);
    });
});