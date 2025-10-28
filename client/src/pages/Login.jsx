import React, { useState } from "react";
import { login, register } from "../services/authService";
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from "react-router-dom";
import { Dumbbell, Mail, Lock, User } from "lucide-react";


const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login: setUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let data;
            if (isLogin) {
                data = await login({
                    email: formData.email,
                    password: formData.password
                });
            } else {
                data = await register(formData);
            }
            setUser(data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
                        <Dumbbell size={40} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">Fitness Tracker</h1>
                    <p className="text-gray-400">Track your fitness journey</p>
                </div>

                {/* Form Card */}
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl">
                    {/* Tabs */}
                    <div className="flex mb-8 bg-gray-900 rounded-xl p-1">
                        <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                            isLogin
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                        >
                        Login
                        </button>
                        <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                            !isLogin
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                              : 'text-gray-400 hover:text-white'
                        }`}
                        >
                        Register
                        </button>
                    </div>
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-xl mb-6">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                                    <input 
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value })}
                                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl pl-12 pr-4 py-3 
                                                focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"  
                                    placeholder="John Doe"
                                    required={!isLogin}
                                    />

                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                                <input 
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl pl-12 pr-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                                <input 
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl pl-12 pr-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;