import { useState, useCallback, useRef, useEffect } from 'react';

export const useFetch = (apiFunction) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Use a ref to keep track of the latest apiFunction without triggering useCallback
    const apiRef = useRef(apiFunction);
    // Monotonic id so only the latest in-flight request can update state
    const requestIdRef = useRef(0);

    useEffect(() => {
        apiRef.current = apiFunction;
    }, [apiFunction]);

    const fetchData = useCallback(async (...args) => {
        const requestId = ++requestIdRef.current;
        setLoading(true);
        setError(null);
        try {
            const result = await apiRef.current(...args);
            // Ignore stale responses when a newer request has started
            if (requestId !== requestIdRef.current) {
                return null;
            }
            setData(result);
            return result;
        } catch (err) {
            if (requestId !== requestIdRef.current) {
                return null;
            }
            setError(err.message || 'An error occurred');
            // Graceful handling - already setting error state
            return null;
        } finally {
            if (requestId === requestIdRef.current) {
                setLoading(false);
            }
        }
    }, []);

    return { data, loading, error, fetchData };
};
