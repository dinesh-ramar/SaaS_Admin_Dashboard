// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import Users from './Users';

afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
});

it('shows distinct search results on page two and a zero range for an empty search', async () => {
    const matches = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1, firstName: 'Sam', lastName: String(i + 1), role: 'user'
    }));
    vi.stubGlobal('fetch', vi.fn(async url => {
        const { pathname, searchParams } = new URL(url);
        const users = pathname === '/users/search' && searchParams.get('q') === 'Sam' ? matches : [];
        const skip = Number(searchParams.get('skip'));
        const limit = Number(searchParams.get('limit') ?? 30);
        return { ok: true, json: async () => ({ users: users.slice(skip, skip + limit), total: users.length }) };
    }));

    const { container } = render(<Users />);
    const search = screen.getByPlaceholderText('Search users...');
    fireEvent.change(search, { target: { value: 'Sam' } });
    await screen.findByText('Sam 1');
    expect(screen.queryByText('Sam 11')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    await screen.findByText('Sam 11');
    expect(screen.queryByText('Sam 1')).toBeNull();
    expect(container.textContent).toContain('Showing 11 to 15 of 15 users');

    fireEvent.change(search, { target: { value: 'Missing' } });
    await screen.findByText('No data found');
    expect(container.textContent).toContain('Showing 0 to 0 of 0 users');
});
