import React, { useState } from 'react';
import { useApp, ROLES } from '../context/AppContext';
import { Package, Plus, Settings2, Trash2, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const ResourceManagement = () => {
    const { user, resources, resetResource } = useApp();

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Institutional Resources</h1>
                    <p className="text-text-muted">Global inventory management and availability tracking.</p>
                </div>
                {user.role === ROLES.ADMIN && (
                    <button className="btn btn-primary gap-2">
                        <Plus className="w-5 h-5" /> Add Resource
                    </button>
                )}
            </header>

            <div className="glass overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 text-text-muted text-xs font-bold uppercase tracking-wider">
                            <th className="px-6 py-4">Resource Info</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Availability</th>
                            <th className="px-6 py-4 text-center">Utilization</th>
                            {user.role === ROLES.ADMIN && <th className="px-6 py-4 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {resources.map((res, i) => (
                            <motion.tr
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                                key={res.id}
                                className="hover:bg-white/5 transition-colors group"
                            >
                                <td className="px-6 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-bg-deep flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <Package className="w-5 h-5" />
                                        </div>
                                        <span className="font-semibold">{res.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-6 text-sm text-text-muted">{res.type}</td>
                                <td className="px-6 py-6 font-mono">
                                    <span className={res.available < 2 ? 'text-danger' : 'text-success'}>
                                        {res.available}
                                    </span>
                                    <span className="text-text-muted"> / {res.total}</span>
                                </td>
                                <td className="px-6 py-6">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-32 h-1.5 bg-bg-deep rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary"
                                                style={{ width: `${(1 - res.available / res.total) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-[10px] text-text-muted font-bold">
                                            {Math.round((1 - res.available / res.total) * 100)}% USE
                                        </span>
                                    </div>
                                </td>
                                {user.role === ROLES.ADMIN && (
                                    <td className="px-6 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => resetResource(res.id)}
                                                className="p-2 hover:bg-white/5 rounded-lg text-text-muted hover:text-primary transition-colors"
                                                title="Full Inventory Restock"
                                            >
                                                <RefreshCw className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-white/5 rounded-lg text-text-muted hover:text-danger">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="glass p-6 bg-warning/5 border-warning/20">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-warning/10 text-warning rounded-xl">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold mb-1">Low Inventory Alert</h4>
                            <p className="text-sm text-text-muted">Some resources are nearing zero availability. Consider reallocation.</p>
                        </div>
                    </div>
                </div>

                <div className="glass p-6 md:col-span-2">
                    <h4 className="font-bold mb-4 flex items-center gap-2">
                        <Settings2 className="w-5 h-5 text-primary" /> Resource Allocation Policy
                    </h4>
                    <p className="text-sm text-text-muted leading-relaxed">
                        Resources are allocated based on event priority and approval sequence.
                        Admins can manually override availability in case of hardware failures or maintenance.
                        All changes are logged for auditing purposes.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResourceManagement;
