import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';

// Reusable Input Component with animation
function Input({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    icon: Icon,
    iconPrefix,
    showToggle,
    showPassword,
    onTogglePassword,
    hint,
    className = ''
}) {
    return (
        <div className={`animate-in fade-in slide-in-from-bottom-2 duration-300 ${className}`}>
            {label && <label className="block text-sm font-bold text-gray-700 mb-1.5">{label}</label>}
            <div className="relative">
                {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />}
                {iconPrefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">{iconPrefix}</span>}
                <input
                    type={showToggle ? (showPassword ? 'text' : 'password') : type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full ${Icon || iconPrefix ? 'pl-10' : 'pl-4'} ${showToggle ? 'pr-12' : 'pr-4'} py-3 rounded-xl border-2 border-black focus:outline-none focus:ring-2 focus:ring-pink-300 font-medium transition-all duration-200`}
                />
                {showToggle && (
                    <button
                        type="button"
                        onClick={onTogglePassword}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
            {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
        </div>
    );
}

export default function AuthPage({ onLogin, onRegister, loading, error }) {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Form fields
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [formError, setFormError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (isLogin) {
            if (!email || !password) {
                setFormError('Please fill in all fields');
                return;
            }
            await onLogin(email, password);
        } else {
            if (!name || !username || !email || !password || !confirmPassword) {
                setFormError('Please fill in all fields');
                return;
            }
            if (password !== confirmPassword) {
                setFormError('Passwords do not match');
                return;
            }
            if (password.length < 6) {
                setFormError('Password must be at least 6 characters');
                return;
            }
            if (!/^[a-z0-9_]{3,20}$/.test(username)) {
                setFormError('Username: 3-20 chars, lowercase, numbers, underscores');
                return;
            }
            await onRegister(name, username, email, password);
        }
    };

    const switchMode = () => {
        setFormError('');
        setIsTransitioning(true);

        setTimeout(() => {
            setIsLogin(!isLogin);
            setName('');
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setIsTransitioning(false);
        }, 150);
    };

    return (
        <div className="min-h-screen bg-[#FFFDF5] flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-50 transition-all duration-700"
                    style={{ transform: isLogin ? 'translateX(0)' : 'translateX(-50px)' }}></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-200 rounded-full blur-3xl opacity-50 transition-all duration-700"
                    style={{ transform: isLogin ? 'translateX(0)' : 'translateX(50px)' }}></div>
            </div>

            <div className="relative w-full max-w-lg">
                {/* Logo/Brand */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-black rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(236,72,153,1)] mb-3 transition-transform duration-300 hover:rotate-12">
                        <Sparkles className="text-yellow-300" size={28} />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900">CollabSpace</h1>
                </div>

                {/* Auth Card */}
                <div className={`bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 transition-all duration-200 ${isTransitioning ? 'scale-[0.98]' : 'scale-100'}`}>
                    {/* Tabs */}
                    <div className="flex p-1 bg-gray-100 rounded-xl border-2 border-black mb-5 relative overflow-hidden">
                        {/* Sliding background */}
                        <div
                            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-yellow-300 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 ease-out"
                            style={{ left: isLogin ? '4px' : 'calc(50% + 2px)' }}
                        ></div>
                        <button
                            onClick={() => !isLogin && switchMode()}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200 relative z-10 ${isLogin ? 'text-black' : 'text-gray-500 hover:text-gray-800'
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => isLogin && switchMode()}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200 relative z-10 ${!isLogin ? 'text-black' : 'text-gray-500 hover:text-gray-800'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Error Message */}
                    {(error || formError) && (
                        <div className="bg-red-50 border-2 border-red-400 text-red-700 px-4 py-2.5 rounded-xl mb-4 text-sm font-medium animate-in fade-in shake duration-300">
                            {formError || error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} key={isLogin ? 'login' : 'signup'}>
                        <div className="space-y-4">
                            {/* Sign Up Fields - Two columns */}
                            {!isLogin && (
                                <div className="grid grid-cols-2 gap-3">
                                    <Input
                                        label="Full Name"
                                        icon={User}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="John Doe"
                                    />
                                    <Input
                                        label="Username"
                                        iconPrefix="@"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                        placeholder="johndoe"
                                    />
                                </div>
                            )}

                            {/* Email */}
                            <Input
                                label="Email"
                                type="email"
                                icon={Mail}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                            />

                            {/* Password fields - Two columns for signup */}
                            {!isLogin ? (
                                <div className="grid grid-cols-2 gap-3">
                                    <Input
                                        label="Password"
                                        icon={Lock}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        showToggle
                                        showPassword={showPassword}
                                        onTogglePassword={() => setShowPassword(!showPassword)}
                                    />
                                    <Input
                                        label="Confirm"
                                        icon={Lock}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        showToggle
                                        showPassword={showPassword}
                                        onTogglePassword={() => setShowPassword(!showPassword)}
                                    />
                                </div>
                            ) : (
                                <Input
                                    label="Password"
                                    icon={Lock}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    showToggle
                                    showPassword={showPassword}
                                    onTogglePassword={() => setShowPassword(!showPassword)}
                                />
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-black text-white font-bold rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(236,72,153,1)] hover:shadow-[6px_6px_0px_0px_rgba(236,72,153,1)] hover:-translate-y-0.5 transition-all active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        {isLogin ? 'Sign In' : 'Create Account'}
                                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-sm text-gray-500 mt-5">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button onClick={switchMode} className="font-bold text-pink-600 hover:underline transition-all">
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </div>

                {/* Demo hint */}
                <p className="mt-3 text-center text-xs text-gray-400">
                    Demo: john@example.com / password123
                </p>
            </div>
        </div>
    );
}
