import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    PlusCircle,
    CheckSquare,
    MapPin,
    Package,
    LogOut,
    Calendar,
    Shield
} from 'lucide-react';
import { useApp, ROLES } from '../context/AppContext';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const { user, logout } = useApp();

    const links = [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard', roles: Object.values(ROLES) },
        { to: '/requests', icon: PlusCircle, label: 'Event Requests', roles: [ROLES.COORDINATOR] },
        { to: '/approvals', icon: CheckSquare, label: 'Approvals', roles: [ROLES.HOD, ROLES.DEAN, ROLES.INSTITUTIONAL_HEAD] },
        { to: '/venues', icon: MapPin, label: 'Venues', roles: [ROLES.HOD, ROLES.DEAN, ROLES.INSTITUTIONAL_HEAD, ROLES.ADMIN] },
        { to: '/resources', icon: Package, label: 'Resources', roles: [ROLES.ADMIN, ROLES.DEAN, ROLES.INSTITUTIONAL_HEAD] },
        { to: '/audit', icon: Shield, label: 'Audit', roles: [ROLES.ADMIN, ROLES.INSTITUTIONAL_HEAD] },
    ];

    return (
        <aside className="w-64 bg-bg-surface border-r border-border flex flex-col h-full">
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <Calendar className="text-white w-6 h-6" />
                </div>
                <h1 className="text-xl font-bold tracking-tight">VCC Vibe</h1>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
                {links.filter(link => link.roles.includes(user.role)).map((link, i) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            `relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                ? 'text-white'
                                : 'text-text-muted hover:text-text-main hover:bg-white/5'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute inset-0 holographic-btn rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <link.icon className={`w-5 h-5 relative z-10 transition-all duration-500 ${isActive ? 'text-white scale-110' : 'group-hover:scale-125 text-text-muted group-hover:text-primary'}`} />
                                <span className={`font-black uppercase tracking-widest text-[10px] relative z-10 transition-all duration-500 ${isActive ? 'text-white' : 'text-text-muted group-hover:text-text-main'}`}>
                                    {link.label}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-border">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
