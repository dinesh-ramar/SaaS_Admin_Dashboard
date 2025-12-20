import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Login = () => {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('admin');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Please enter both username and password');
            return;
        }

        setLoading(true);
        try {
            await login(username, password);
            // Redirect to the page they were trying to visit
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-app-bg px-4 transition-colors duration-200">
            <div className="max-w-md w-full">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold font-heading text-primary mb-2">SaaS Admin</h1>
                    <p className="text-textMuted">Secure Production-Ready Dashboard</p>
                </div>

                <Card className="shadow-xl">
                    <h2 className="text-xl font-semibold font-heading text-textPrimary mb-6">Login to your account</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 text-error text-sm rounded-md">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Username"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="admin"
                            required
                        />

                        <Input
                            label="Password"
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />

                        <div className="flex items-center justify-between text-sm py-1">
                            <label className="flex items-center text-textMuted cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 mr-2 rounded border-border text-primary focus:ring-primary cursor-pointer" />
                                <span>Remember me</span>
                            </label>
                            <button
                                type="button"
                                className="text-primary hover:underline font-medium focus:outline-none"
                                onClick={() => alert('Forgot password clicked')}
                            >
                                Forgot password?
                            </button>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={loading}
                        >
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-border text-center">
                        <p className="text-sm text-textMuted">
                            Demo Credentials: <span className="font-mono text-textPrimary">admin / admin</span>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};


export default Login;
