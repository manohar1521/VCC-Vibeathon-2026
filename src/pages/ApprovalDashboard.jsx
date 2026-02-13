import React, { useState } from 'react';
import { useApp, ROLES, STATUS } from '../context/AppContext';
import { Check, X, Eye, MessageSquare, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ApprovalDashboard = () => {
    const { user, events, updateEventStatus } = useApp();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [rejectMode, setRejectMode] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const getPendingEvents = () => {
        switch (user.role) {
            case ROLES.HOD:
                return events.filter(e => e.status === STATUS.PENDING_HOD && e.department === user.department);
            case ROLES.DEAN:
                return events.filter(e => e.status === STATUS.PENDING_DEAN);
            case ROLES.INSTITUTIONAL_HEAD:
                return events.filter(e => e.status === STATUS.PENDING_HEAD);
            default:
                return [];
        }
    };

    const handleAction = (eventId, action) => {
        if (action === 'approve') {
            let nextStatus = STATUS.APPROVED;
            if (user.role === ROLES.HOD) nextStatus = STATUS.PENDING_DEAN;
            if (user.role === ROLES.DEAN) nextStatus = STATUS.PENDING_HEAD;

            updateEventStatus(eventId, nextStatus, `Approved by ${user.role}`);
            setSelectedEvent(null);
        } else {
            setRejectMode(true);
        }
    };

    const submitRejection = () => {
        updateEventStatus(selectedEvent.id, STATUS.REJECTED, `Rejected by ${user.role}`, rejectReason);
        setSelectedEvent(null);
        setRejectMode(false);
        setRejectReason('');
    };

    const pending = getPendingEvents();

    return (
        <div className="space-y-10">
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-4xl font-bold mb-2 tracking-tight">Governance Queue</h1>
                <p className="text-text-muted text-lg">Operational oversight and strategic approval workflows.</p>
            </motion.header>

            {pending.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-24 text-center flex flex-col items-center"
                >
                    <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mb-8 relative">
                        <ShieldCheck className="w-12 h-12 text-success" />
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 bg-success/5 rounded-full"
                        />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Governance Synchronized</h3>
                    <p className="text-text-muted max-w-md">All pending requests have been processed. System integrity is currently at 100%.</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <AnimatePresence>
                        {pending.map((ev, i) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                whileHover={{ y: -8 }}
                                key={ev.id}
                                className="glass p-8 glass-hover flex flex-col justify-between group"
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">{ev.title}</h3>
                                        <p className="text-sm font-semibold text-text-muted uppercase tracking-widest">{ev.department} Division</p>
                                    </div>
                                    <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold border border-primary/20 backdrop-blur-md">
                                        {ev.status.replace('_', ' ')}
                                    </div>
                                </div>

                                <div className="space-y-5 mb-10 bg-white/5 p-6 rounded-2xl border border-white/5">
                                    <div className="flex justify-between text-sm items-center">
                                        <span className="text-text-muted flex items-center gap-2"><Calendar className="w-4 h-4" /> Schedule</span>
                                        <span className="font-bold">{ev.date} • {ev.duration}</span>
                                    </div>
                                    <div className="flex justify-between text-sm items-center">
                                        <span className="text-text-muted flex items-center gap-2"><Eye className="w-4 h-4" /> Venue Allocated</span>
                                        <span className="font-bold text-primary">{ev.venueName}</span>
                                    </div>
                                    <div className="flex justify-between text-sm items-center">
                                        <span className="text-text-muted flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Resource Lock</span>
                                        <span className="font-bold truncate max-w-[200px]">{ev.resources.map(r => r.name).join(', ')}</span>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setSelectedEvent(ev)}
                                        className="btn btn-outline flex-1 gap-2 border-white/10 hover:bg-white/10"
                                    >
                                        Auditor <Eye className="w-4 h-4" />
                                    </button>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleAction(ev.id, 'approve')}
                                        className="holographic-btn btn text-white flex-1 gap-2 shadow-xl"
                                    >
                                        Validate <Check className="w-4 h-4" />
                                    </motion.button>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => { setSelectedEvent(ev); setRejectMode(true); }}
                                        className="btn btn-outline border-danger/30 text-danger hover:bg-danger/10 flex-1 gap-2"
                                    >
                                        Reject <X className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
            {/* Rejection Modal */}
            <AnimatePresence>
                {selectedEvent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-bg-deep/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass max-w-lg w-full p-8"
                        >
                            <h2 className="text-2xl font-bold mb-4">
                                {rejectMode ? 'Provide Rejection Reason' : 'Request Details'}
                            </h2>

                            {!rejectMode ? (
                                <div className="space-y-6">
                                    <div className="p-4 bg-bg-deep rounded-lg border border-border">
                                        <p className="text-sm text-text-muted mb-2 font-medium">Description</p>
                                        <p>{selectedEvent.description || 'No description provided.'}</p>
                                    </div>

                                    <div className="flex gap-4">
                                        <button onClick={() => setSelectedEvent(null)} className="btn btn-outline flex-1">Close</button>
                                        <button onClick={() => setRejectMode(true)} className="btn btn-outline border-danger text-danger flex-1">Reject Instead</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-muted">Reason for Rejection</label>
                                        <textarea
                                            className="input min-h-[120px]"
                                            placeholder="Explain why this request is being rejected..."
                                            value={rejectReason}
                                            onChange={e => setRejectReason(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <button onClick={() => { setRejectMode(false); setSelectedEvent(null); }} className="btn btn-outline flex-1">Cancel</button>
                                        <button
                                            onClick={submitRejection}
                                            disabled={!rejectReason}
                                            className="btn btn-primary bg-danger hover:bg-danger/90 flex-1"
                                        >
                                            Confirm Rejection
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ApprovalDashboard;
