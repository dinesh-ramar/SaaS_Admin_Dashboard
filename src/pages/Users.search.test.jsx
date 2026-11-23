import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Users from './Users';

const deferred = () => {
    let resolve;
    const promise = new Promise((r) => {
        resolve = r;
    });
    return { promise, resolve };
};

vi.mock('../services/api', () => ({
    userService: {
        getAll: vi.fn(),
        search: vi.fn(),
    },
}));

import { userService } from '../services/api';

describe('Users search race condition', () => {
    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        userService.getAll.mockReset();
        userService.search.mockReset();
        userService.getAll.mockResolvedValue({ users: [], total: 0 });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('keeps "alex" results when the earlier "a" request finishes last', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

        const requestA = deferred();
        const requestAlex = deferred();

        userService.search.mockImplementation((query) => {
            if (query === 'a') return requestA.promise;
            if (query === 'alex') return requestAlex.promise;
            return Promise.resolve({ users: [], total: 0 });
        });

        render(<Users />);

        await waitFor(() => {
            expect(userService.getAll).toHaveBeenCalled();
        });

        const input = screen.getByPlaceholderText('Search users...');

        await user.type(input, 'a');
        await act(async () => {
            vi.advanceTimersByTime(500);
        });

        await waitFor(() => {
            expect(userService.search).toHaveBeenCalledWith('a');
        });

        await user.type(input, 'lex');
        await act(async () => {
            vi.advanceTimersByTime(500);
        });

        await waitFor(() => {
            expect(userService.search).toHaveBeenCalledWith('alex');
        });

        // Newer "alex" request finishes first
        await act(async () => {
            requestAlex.resolve({
                users: [
                    {
                        id: 2,
                        firstName: 'Alex',
                        lastName: 'Smith',
                        email: 'alex@example.com',
                        image: '',
                        role: 'user',
                        company: { name: 'Acme' },
                    },
                ],
                total: 1,
            });
        });

        await waitFor(() => {
            expect(screen.getByText('Alex Smith')).toBeInTheDocument();
        });

        // Stale "a" request finishes last — must not overwrite the table
        await act(async () => {
            requestA.resolve({
                users: [
                    {
                        id: 1,
                        firstName: 'Alice',
                        lastName: 'Wonder',
                        email: 'alice@example.com',
                        image: '',
                        role: 'user',
                        company: { name: 'Wonderland' },
                    },
                ],
                total: 1,
            });
        });

        await act(async () => {
            await Promise.resolve();
        });

        expect(screen.getByText('Alex Smith')).toBeInTheDocument();
        expect(screen.queryByText('Alice Wonder')).not.toBeInTheDocument();
    });
});
