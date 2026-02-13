import React, { useState } from 'react';
import { useApp, STATUS } from '../context/AppContext';
import { Plus, Calendar, Users, MapPin, Package, Info, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EventRequests = () => {
    const { addEvent, updateEventStatus, events, venues, resources } = useApp();
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        department: 'CSE',
        date: '',
        duration: '2 hours',
        participants: 50,
        venueId: '',
        selectedResources: []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            const eventResources = formData.selectedResources.map(id => {
                const res = resources.find(r => r.id === id);
                return { id: res.id, name: res.name, quantity: 1 };
            });

            addEvent({
                ...formData,
                resources: eventResources,
                venueName: venues.find(v => v.id === formData.venueId)?.name || 'N/A'
            });

            setShowForm(false);
            setFormData({
                title: '',
                description: '',
                department: 'CSE',
                date: '',
                duration: '2 hours',
                participants: 50,
                venueId: '',
                selectedResources: []
            });
        } catch (err) {
            alert(err.message);
        }
    };

    const toggleResource = (id) => {
        setFormData(prev => ({
            ...prev,
            selectedResources: prev.selectedResources.includes(id)
                ? prev.selectedResources.filter(rid => rid !== id)
                : [...prev.selectedResources, id]
        }));
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">My Event Requests</h1>
                    <p className="text-text-muted">Manage your event lifecycle and track approvals.</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn btn-primary gap-2"
                >
                    <Plus className="w-5 h-5" /> New Event Request
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {events.length === 0 ? (
                    <div className="glass p-20 text-center">
                        <Calendar className="w-16 h-16 mx-auto mb-4 opacity-10" />
                        <h3 className="text-xl font-bold mb-2">No Requests Yet</h3>
                        <p className="text-text-muted mb-6">You haven't submitted any event requests for this semester.</p>
                        <button onClick={() => setShowForm(true)} className="btn btn-outline">Submit Your First Request</button>
                    </div>
                ) : (
                    events.map(ev => (
                        <motion.div layout key={ev.id} className="glass p-6 gap-6 flex flex-col md:flex-row items-start md:items-center hover:bg-white/5 group">
                            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                <Calendar className="w-8 h-8" />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-xl font-bold">{ev.title}</h3>
                                    <span className={`badge badge-${ev.status.toLowerCase().replace('pending_', '')}`}>
                                        {ev.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-text-muted mt-2">
                                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {ev.venueName}</span>
                                    <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {ev.participants} Participants</span>
                                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(ev.date).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {ev.status === STATUS.APPROVED && (
                                    <button
                                        onClick={() => updateEventStatus(ev.id, STATUS.RUNNING, 'Coordinator started the event')}
                                        className="btn btn-primary text-xs h-9 bg-success hover:bg-success/90"
                                    >
                                        Start Event
                                    </button>
                                )}
                                {ev.status === STATUS.RUNNING && (
                                    <button
                                        onClick={() => updateEventStatus(ev.id, STATUS.COMPLETED, 'Coordinator marked event as completed')}
                                        className="btn btn-primary text-xs h-9 bg-info hover:bg-info/90"
                                    >
                                        Mark Completed
                                    </button>
                                )}
                                <button className="btn btn-outline text-xs h-9">View Timeline</button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Modal Form */}
            <AnimatePresence>
                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowForm(false)}
                            className="absolute inset-0 bg-bg-deep/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="glass max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 z-10"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold">New Event Proposal</h2>
                                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/5 rounded-lg">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-muted">Event Title</label>
                                    <input
                                        required
                                        className="input"
                                        placeholder="e.g. TechVibe Hackathon 2024"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-muted">Date</label>
                                        <input
                                            type="date"
                                            required
                                            className="input"
                                            value={formData.date}
                                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-muted">Expected Participants</label>
                                        <input
                                            type="number"
                                            required
                                            className="input"
                                            value={formData.participants}
                                            onChange={e => setFormData({ ...formData, participants: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-muted">Select Venue</label>
                                    <select
                                        required
                                        className="input appearance-none"
                                        value={formData.venueId}
                                        onChange={e => setFormData({ ...formData, venueId: e.target.value })}
                                    >
                                        <option value="">Choose a venue...</option>
                                        {venues.map(v => (
                                            <option key={v.id} value={v.id}>{v.name} (Cap: {v.capacity})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-muted mb-2 block">Required Resources</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {resources.map(res => (
                                            <div
                                                key={res.id}
                                                onClick={() => toggleResource(res.id)}
                                                className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${formData.selectedResources.includes(res.id)
                                                    ? 'bg-primary/20 border-primary text-primary'
                                                    : 'bg-bg-deep border-border hover:border-text-muted'
                                                    }`}
                                            >
                                                <span className="text-sm font-medium">{res.name}</span>
                                                {formData.selectedResources.includes(res.id) ? (
                                                    <CheckCircle className="w-4 h-4" />
                                                ) : (
                                                    <Plus className="w-4 h-4" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline flex-1">Cancel</button>
                                    <button type="submit" className="btn btn-primary flex-1">Submit Request</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EventRequests;
