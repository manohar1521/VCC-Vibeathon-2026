import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, User as UserIcon, Lock, ArrowRight, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const { login, loading } = useApp();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <div className="min-h-screen bg-bg-deep flex items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full z-10"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-xl shadow-primary/30 mb-6">
                        <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-3 tracking-tight">Institutional Portal</h1>
                    <p className="text-text-muted">Sign in to manage your campus events</p>
                </div>

                <div className="glass p-10 space-y-8 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-text-muted tracking-widest pl-1">Operational ID</label>
                            <div className="relative">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/60" />
                                <input
                                    type="email"
                                    required
                                    className="input pl-12 bg-white/5 border-white/10 focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="name@university.edu"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-text-muted tracking-widest pl-1">Access Protocol</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/60" />
                                <input
                                    type="password"
                                    required
                                    className="input pl-12 bg-white/5 border-white/10 focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="holographic-btn btn w-full py-4 mt-6 group text-white font-black uppercase tracking-widest text-xs shadow-2xl"
                        >
                            {loading ? 'Decrypting Access...' : (
                                <span className="flex items-center justify-center gap-3">
                                    Initiate Session <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="p-4 bg-white/5 rounded-lg border border-border space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase">
                            <Info className="w-3 h-3" /> Demo Credentials
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px] text-text-muted">
                            <div>Coordinator:</div><div className="font-mono">coord@test.com</div>
                            <div>HOD:</div><div className="font-mono">hod@test.com</div>
                            <div>Admin:</div><div className="font-mono">admin@test.com</div>
                            <div>Password:</div><div className="font-mono">password123</div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center text-text-muted text-[10px] uppercase tracking-widest font-bold opacity-50">
                    Enterprise Institutional Portals &copy; 2024
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
