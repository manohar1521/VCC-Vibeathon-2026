import React from 'react';
import { Bell, User, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

const Header = () => {
    const { user, notifications } = useApp();
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-20 bg-bg-surface/50 backdrop-blur-md border-b border-border px-8 flex items-center justify-between sticky top-0 z-10"
        >
            <div className="flex items-center gap-4 bg-bg-deep/50 px-4 py-2 rounded-2xl border border-border w-96 group focus-within:border-primary/50 transition-all focus-within:shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                <Search className="w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                <input
                    type="text"
                    placeholder="Search events, venues..."
                    className="bg-transparent border-none outline-none text-sm w-full placeholder:text-text-muted/50"
                />
            </div>

            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-success/5 border border-success/10">
                <div className="w-2 h-2 bg-success rounded-full animate-ping"></div>
                <span className="text-[10px] font-black uppercase text-success tracking-tighter">Live Systems Active</span>
            </div>

            <div className="flex items-center gap-6">
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors"
                >
                    <Bell className="w-5 h-5 text-text-muted" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-danger text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-bg-surface">
                            {unreadCount}
                        </span>
                    )}
                </motion.div>

                <motion.div
                    whileHover={{ x: -4 }}
                    className="flex items-center gap-3 pl-6 border-l border-border cursor-pointer group"
                >
                    <div className="text-right">
                        <p className="text-sm font-bold group-hover:text-primary transition-colors">{user.name}</p>
                        <p className="text-[10px] font-black uppercase text-text-muted tracking-tight">{user.role.replace('_', ' ')} • {user.department || 'GLOBAL'}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
                        {user.name.charAt(0)}
                    </div>
                </motion.div>
            </div>
        </motion.header>
    );
};

export default Header;
