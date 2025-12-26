import { useState, useCallback } from 'react';

/**
 * useAsyncAction Hook
 * Handles async operations with loading, error, and success states.
 * 
 * @param {function} asyncFn - Async function to execute
 * @param {object} options - Options: { onSuccess, onError }
 * @returns {{ execute, loading, error, reset }}
 * 
 * @example
 * const { execute, loading, error } = useAsyncAction(
 *   (id) => api.members.kick(id),
 *   { onSuccess: () => refetch() }
 * );
 */
export function useAsyncAction(asyncFn, options = {}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const execute = useCallback(async (...args) => {
        setLoading(true);
        setError(null);
        try {
            const result = await asyncFn(...args);
            setData(result);
            options.onSuccess?.(result);
            return result;
        } catch (err) {
            const errorMessage = err.message || 'An error occurred';
            setError(errorMessage);
            options.onError?.(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [asyncFn, options.onSuccess, options.onError]);

    const reset = useCallback(() => {
        setLoading(false);
        setError(null);
        setData(null);
    }, []);

    return { execute, loading, error, data, reset };
}

/**
 * useSelection Hook
 * Handles multi-select logic for lists.
 * 
 * @param {array} items - Array of items with 'id' property
 * @returns {{ selected, selectMode, toggle, selectAll, clear, setSelectMode, isSelected }}
 * 
 * @example
 * const { selected, toggle, selectAll, clear, isSelected } = useSelection(files);
 */
export function useSelection(items = []) {
    const [selected, setSelected] = useState([]);
    const [selectMode, setSelectMode] = useState(false);

    const toggle = useCallback((id) => {
        setSelected(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    }, []);

    const selectAll = useCallback(() => {
        setSelected(items.map(item => item.id));
    }, [items]);

    const clear = useCallback(() => {
        setSelected([]);
        setSelectMode(false);
    }, []);

    const isSelected = useCallback((id) => selected.includes(id), [selected]);

    return {
        selected,
        selectMode,
        setSelectMode,
        toggle,
        selectAll,
        clear,
        isSelected,
        count: selected.length
    };
}

/**
 * useLongPress Hook
 * Detects long press gestures.
 * 
 * @param {function} onLongPress - Callback when long press detected
 * @param {number} delay - Delay in ms (default 500)
 * @returns {{ onMouseDown, onMouseUp, onMouseLeave, onTouchStart, onTouchEnd }}
 */
export function useLongPress(onLongPress, delay = 500) {
    const [timer, setTimer] = useState(null);
    const [triggered, setTriggered] = useState(false);

    const start = useCallback((e) => {
        setTriggered(false);
        const t = setTimeout(() => {
            setTriggered(true);
            onLongPress(e);
        }, delay);
        setTimer(t);
    }, [onLongPress, delay]);

    const stop = useCallback(() => {
        if (timer) {
            clearTimeout(timer);
            setTimer(null);
        }
    }, [timer]);

    const wasLongPress = useCallback(() => {
        const was = triggered;
        setTriggered(false);
        return was;
    }, [triggered]);

    return {
        onMouseDown: start,
        onMouseUp: stop,
        onMouseLeave: stop,
        onTouchStart: start,
        onTouchEnd: stop,
        wasLongPress
    };
}

export default { useAsyncAction, useSelection, useLongPress };
