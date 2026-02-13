import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Clock, User, FileText, Filter, Search, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AuditLogs = () => {
    const { showToast } = useApp();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/audit', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setLogs(data);
            }
        } catch (err) {
            showToast('Audit Log Retrieval Failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = logs.filter(log =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.event?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const item = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
    };

    return (
        <div className="space-y-10 pb-20">
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
            >
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/20 rounded-lg">
                            <Shield className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">Institutional Audit</h1>
                    </div>
                    <p className="text-text-muted text-lg tracking-tight">Chronological immutable record of all system operations and governance decisions.</p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Filter by action, user, or event..."
                            className="input pl-12 bg-white/5 border-white/10 w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn glass bg-white/5 border-white/10 px-5 gap-2 hover:bg-white/10 transition-all">
                        <Filter className="w-4 h-4" /> <span className="hidden sm:inline">Advanced</span>
                    </button>
                </div>
            </motion.header>

            {loading ? (
                <div className="h-64 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                </div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid gap-4"
                >
                    <AnimatePresence mode='popLayout'>
                        {filteredLogs.map((log) => (
                            <motion.div
                                key={log.id}
                                variants={item}
                                layout
                                className="glass group relative overflow-hidden glass-hover bg-white/[0.02]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                                    <div className="flex items-center gap-4 min-w-[200px]">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-text-muted group-hover:text-primary transition-colors">
                                            <Zap className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">Action Protocol</p>
                                            <h3 className="font-bold text-lg tracking-tight">{log.action.replace('_', ' ')}</h3>
                                        </div>
                                    </div>

                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-text-muted">
                                                <User className="w-3.5 h-3.5" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Authority</span>
                                            </div>
                                            <p className="text-sm font-bold">{log.user?.name || 'SYSTEM'}</p>
                                            <p className="text-[10px] text-text-muted opacity-60 font-medium uppercase tracking-tighter">{log.user?.role || 'CORE_SYSTEM'}</p>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-text-muted">
                                                <FileText className="w-3.5 h-3.5" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Target Context</span>
                                            </div>
                                            <p className="text-sm font-bold truncate max-w-[200px]">{log.event?.title || 'Global System'}</p>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-text-muted">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Timestamp</span>
                                            </div>
                                            <p className="text-sm font-bold">{new Date(log.timestamp).toLocaleDateString()}</p>
                                            <p className="text-[10px] text-text-muted opacity-60 font-medium">{new Date(log.timestamp).toLocaleTimeString()}</p>
                                        </div>
                                    </div>

                                    {(log.note || log.reason) && (
                                        <div className="w-full md:w-72 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-white/10 md:pl-6 flex flex-col justify-center">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Governance Note</p>
                                            <p className="text-xs text-text-muted leading-relaxed font-medium italic">"{log.note || log.reason}"</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredLogs.length === 0 && (
                        <div className="py-20 text-center glass">
                            <Search className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-20" />
                            <p className="text-text-muted text-lg">No audit records match your current search parameters.</p>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default AuditLogs;
