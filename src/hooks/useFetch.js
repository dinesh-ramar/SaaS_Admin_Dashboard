import { useState, useCallback, useRef, useEffect } from 'react';

export const useFetch = (apiFunction) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Use a ref to keep track of the latest apiFunction without triggering useCallback
    const apiRef = useRef(apiFunction);

    useEffect(() => {
        apiRef.current = apiFunction;
    }, [apiFunction]);

    const fetchData = useCallback(async (...args) => {
        setLoading(true);
        setError(null);
        try {
            const result = await apiRef.current(...args);
            setData(result);
            return result;
        } catch (err) {
            setError(err.message || 'An error occurred');
            // Graceful handling - already setting error state
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, error, fetchData };
};
