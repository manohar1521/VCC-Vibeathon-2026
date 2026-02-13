import React from 'react';
import { useApp, ROLES } from '../context/AppContext';
import { MapPin, Users, CheckCircle, AlertTriangle, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';

const VenueOccupancy = () => {
    const { user, venues, events } = useApp();

    const getVisibility = () => {
        switch (user.role) {
            case ROLES.COORDINATOR:
                return 'limited'; // Can only see their own venue
            case ROLES.HOD:
                return 'departmental'; // Can see department venues
            default:
                return 'full'; // Dean, Head, Admin see all
        }
    };

    const filteredVenues = venues.filter(v => {
        const visibility = getVisibility();
        if (visibility === 'full') return true;
        if (visibility === 'departmental') return v.dept === user.department || v.dept === null;
        return false;
    });

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-10">
            <motion.header
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-between items-end"
            >
                <div>
                    <h1 className="text-4xl font-bold mb-2 tracking-tight">Premises Log</h1>
                    <p className="text-text-muted text-lg">Institutional venue mapping and live occupancy telemetry.</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold px-4 py-2 glass bg-success/10 text-success rounded-xl border border-success/20">
                        <CheckCircle className="w-3 h-3" /> System Synchronized
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold px-4 py-2 glass bg-primary/10 text-primary rounded-xl border border-primary/20">
                        <Monitor className="w-3 h-3" /> {filteredVenues.length} Terminals
                    </div>
                </div>
            </motion.header>

            {user.role === ROLES.COORDINATOR ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-24 text-center flex flex-col items-center max-w-2xl mx-auto"
                >
                    <div className="w-20 h-20 bg-warning/10 rounded-full flex items-center justify-center mb-8">
                        <AlertTriangle className="w-10 h-10 text-warning" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 tracking-tight">Security Restriction</h3>
                    <p className="text-text-muted text-lg leading-relaxed">
                        Global occupancy metrics are restricted to Governance roles.
                        Individual venue status is visible within your specific event requests.
                    </p>
                </motion.div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                    {filteredVenues.map((venue, i) => {
                        const currentBooking = events.find(e => e.venueId === venue.id && (e.status === 'RUNNING' || e.status === 'APPROVED'));
                        const isOccupied = venue.state !== 'Available' || currentBooking;

                        return (
                            <motion.div
                                key={venue.id}
                                variants={item}
                                whileHover={{ y: -5 }}
                                className="glass relative overflow-hidden group glass-hover"
                            >
                                <div className={`h-1.5 w-full absolute top-0 left-0 ${isOccupied ? 'bg-warning shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-success shadow-[0_0_15px_rgba(16,185,129,0.5)]'}`} />
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <h3 className="text-2xl font-bold mb-1 tracking-tight">{venue.name}</h3>
                                            <p className="text-xs font-bold text-text-muted uppercase tracking-widest">{venue.type}</p>
                                        </div>
                                        {user.role === ROLES.ADMIN && (
                                            <button className="p-2 hover:bg-white/10 rounded-xl text-text-muted hover:text-primary transition-all">
                                                <Monitor className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-4 mb-10 bg-white/5 p-5 rounded-2xl border border-white/5">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2 text-text-muted font-medium">
                                                <Users className="w-4 h-4" /> Capacity Limit
                                            </div>
                                            <span className="font-bold font-mono">{venue.capacity} PAX</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2 text-text-muted font-medium">
                                                <MapPin className="w-4 h-4" /> Jurisdiction
                                            </div>
                                            <span className="font-bold underline decoration-primary/30 underline-offset-4">{venue.dept || 'Institutional Core'}</span>
                                        </div>
                                    </div>

                                    <div className={`p-5 rounded-2xl border transition-all duration-500 ${isOccupied ? 'bg-warning/10 border-warning/20' : 'bg-success/10 border-success/20'}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`text-[10px] font-black uppercase tracking-tighter ${isOccupied ? 'text-warning' : 'text-success'}`}>
                                                {isOccupied ? 'State: Occupied / Reserved' : 'State: Operational Ready'}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium leading-tight">
                                            {isOccupied
                                                ? (currentBooking?.title || 'System Reserved for Block Schedule')
                                                : 'Institutional slot available for allocation.'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}
        </div>
    );
};

export default VenueOccupancy;
