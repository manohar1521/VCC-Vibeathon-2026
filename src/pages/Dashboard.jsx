import React from 'react';
import { useApp, ROLES, STATUS } from '../context/AppContext';
import {
    BarChart3,
    MapPin,
    Clock,
    CheckCircle2,
    XCircle,
    Zap,
    ChevronRight,
    Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color, delay }) => {
    const [rotate, setRotate] = React.useState({ x: 0, y: 0 });

    const onMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xc = rect.width / 2;
        const yc = rect.height / 2;
        const dx = (xc - x) / 20;
        const dy = (y - yc) / 20;
        setRotate({ x: dy, y: dx });
    };

    const onMouseLeave = () => setRotate({ x: 0, y: 0 });

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={{
                '--rx': `${rotate.x}deg`,
                '--ry': `${rotate.y}deg`
            }}
            className="glass p-6 group cursor-default rotate-3d perspective-1000"
        >
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-xl bg-${color}/10 text-${color} border border-${color}/20 flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className="text-[10px] text-text-muted font-black uppercase tracking-tighter bg-white/5 px-3 py-1 rounded-lg border border-white/5">Realtime</div>
            </div>
            <h3 className="text-4xl font-black mb-1 tracking-tighter stat-value relative z-10">{value}</h3>
            <p className="text-text-muted text-xs font-black uppercase tracking-[0.2em] opacity-60 relative z-10">{title}</p>
        </motion.div>
    );
};

const Dashboard = () => {
    const { user, events, venues, resources, systemLogs } = useApp();
    const navigate = useNavigate();

    const getStats = () => {
        // ... (existing switch case kept same)
        switch (user.role) {
            case ROLES.COORDINATOR:
                return [
                    { title: 'My Total Events', value: events.length, icon: BarChart3, color: 'primary' },
                    { title: 'Pending Approval', value: events.filter(e => e.status.startsWith('PENDING')).length, icon: Clock, color: 'warning' },
                    { title: 'Approved Events', value: events.filter(e => e.status === STATUS.APPROVED).length, icon: CheckCircle2, color: 'success' },
                    { title: 'Completed', value: events.filter(e => e.status === STATUS.COMPLETED).length, icon: Zap, color: 'info' },
                ];
            case ROLES.ADMIN:
                return [
                    { title: 'Available Venues', value: venues.filter(v => v.state === 'Available').length, icon: MapPin, color: 'success' },
                    { title: 'Occupied Venues', value: venues.filter(v => v.state !== 'Available').length, icon: XCircle, color: 'danger' },
                    { title: 'Resource Health', value: '98%', icon: Zap, color: 'primary' },
                    { title: 'Total Maintenance', value: 2, icon: Clock, color: 'warning' },
                ];
            default:
                return [
                    { title: 'Total Requests', value: events.length, icon: BarChart3, color: 'primary' },
                    { title: 'Awaiting Action', value: events.filter(e => e.status.includes(user.role)).length, icon: Clock, color: 'warning' },
                    { title: 'Success Rate', value: '92%', icon: CheckCircle2, color: 'success' },
                    { title: 'Conflicts Resolved', value: 14, icon: Zap, color: 'info' },
                ];
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <div className="space-y-10">
            <motion.header
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <h1 className="text-4xl font-bold mb-2 tracking-tight">Welcome back, {user.name.split(' ')[0]}!</h1>
                <p className="text-text-muted text-lg">Your {user.role.toLowerCase().replace('_', ' ')} portal is synchronized and active.</p>
            </motion.header>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {getStats().map((stat, i) => (
                    <motion.div variants={item} key={stat.title}>
                        <StatCard {...stat} />
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Recent Activity</h2>
                        <button
                            onClick={() => navigate('/audit')}
                            className="holographic-btn btn text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg"
                        >
                            View Audit Log <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="space-y-4"
                    >
                        {systemLogs.length === 0 ? ( // Changed condition to systemLogs.length
                            <div className="glass p-16 text-center text-text-muted flex flex-col items-center">
                                <BarChart3 className="w-16 h-16 mb-4 opacity-10 float" />
                                <p className="text-lg">No recent activity detected in your domain.</p>
                            </div>
                        ) : (
                            <div className="glass p-8 space-y-4 max-h-[600px] overflow-y-auto relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                                <AnimatePresence mode='popLayout'>
                                    {systemLogs.map((log) => (
                                        <motion.div
                                            key={log.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 border border-white/5 transition-all group"
                                        >
                                            <div className={`w-2 h-10 rounded-full ${log.action.includes('AUTH') ? 'bg-primary shadow-[0_0_10px_rgba(99,102,241,0.5)]' :
                                                log.action.includes('PROPOSAL') ? 'bg-accent shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-success shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                                                }`} />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-text-muted opacity-50">{log.action}</p>
                                                    <span className="text-[9px] font-bold text-text-muted">{log.time}</span>
                                                </div>
                                                <p className="text-sm font-bold tracking-tight group-hover:text-primary transition-colors">{log.message}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </motion.div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Resource Health</h2>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass p-8 space-y-8"
                    >
                        {resources.map((res) => (
                            <div key={res.id} className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="font-bold tracking-wide">{res.name}</span>
                                    <span className="text-text-muted font-mono">{res.available} / {res.total}</span>
                                </div>
                                <div className="h-3 bg-bg-deep rounded-full overflow-hidden p-0.5 border border-white/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(res.available / res.total) * 100}%` }}
                                        transition={{ duration: 1, ease: "circOut" }}
                                        className={`h-full rounded-full ${res.available < res.total * 0.2 ? 'bg-danger shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-primary shadow-[0_0_10px_rgba(99,102,241,0.5)]'}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
