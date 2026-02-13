import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const ROLES = {
    COORDINATOR: 'COORDINATOR',
    HOD: 'HOD',
    DEAN: 'DEAN',
    INSTITUTIONAL_HEAD: 'INSTITUTIONAL_HEAD',
    ADMIN: 'ADMIN'
};

export const STATUS = {
    PENDING_HOD: 'PENDING_HOD',
    PENDING_DEAN: 'PENDING_DEAN',
    PENDING_HEAD: 'PENDING_HEAD',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    RUNNING: 'RUNNING',
    COMPLETED: 'COMPLETED'
};

const initialVenues = [
    { id: 'v1', name: 'Main Auditorium', type: 'Auditorium', capacity: 500, state: 'Available', dept: null },
    { id: 'v2', name: 'Conference Hall A', type: 'Seminar Hall', capacity: 100, state: 'Available', dept: 'CSE' },
    { id: 'v3', name: 'Digital Library Plaza', type: 'Open Space', capacity: 200, state: 'Available', dept: null },
    { id: 'v4', name: 'Block B Room 101', type: 'Classroom', capacity: 60, state: 'Available', dept: 'ECE' },
    { id: 'v5', name: 'Sports Arena', type: 'Stadium', capacity: 2000, state: 'Available', dept: null },
    { id: 'v6', name: 'Senate Chamber', type: 'Board Room', capacity: 40, state: 'Available', dept: 'ADMIN' }
];

const initialResources = [
    { id: 'r1', name: 'Wireless Mics', type: 'Equipment', total: 10, available: 10 },
    { id: 'r2', name: 'Projectors', type: 'Equipment', total: 8, available: 8 },
    { id: 'r3', name: 'Lunch Sets', type: 'Food', total: 1000, available: 1000 },
    { id: 'r4', name: 'Laptops', type: 'Equipment', total: 20, available: 20 },
    { id: 'r5', name: 'Volunteer Teams', type: 'Human Resource', total: 15, available: 15 },
    { id: 'r6', name: 'ITC Support Staff', type: 'Service', total: 5, available: 5 },
    { id: 'r7', name: 'Hostel Accommodation', type: 'Facility', total: 100, available: 100 }
];

const API_BASE = 'http://localhost:5000/api';

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [events, setEvents] = useState([]);
    const [venues, setVenues] = useState([]);
    const [resources, setResources] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [toasts, setToasts] = useState([]);
    const [systemLogs, setSystemLogs] = useState([
        { id: 1, action: 'SYSTEM_BOOT', message: 'Institutional Kernel Initialized', time: 'Just now', type: 'system' }
    ]);
    const [loading, setLoading] = useState(false);

    const showToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
    };

    const addLog = (message, type = 'action') => {
        setSystemLogs(prev => [{ id: Date.now(), message, action: type.toUpperCase(), time: 'Now' }, ...prev].slice(0, 10));
    };

    const token = localStorage.getItem('token');

    const fetchAllData = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const [evRes, venRes, resRes] = await Promise.all([
                fetch(`${API_BASE}/events`, { headers }),
                fetch(`${API_BASE}/venues`, { headers }),
                fetch(`${API_BASE}/resources`, { headers })
            ]);

            const [evData, venData, resData] = await Promise.all([
                evRes.json(), venRes.json(), resRes.json()
            ]);

            setEvents(evData);
            setVenues(venData);
            setResources(resData);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchAllData();
    }, [user]);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);
                showToast('Authentication Successful', 'success');
                addLog('User Session Initiated', 'auth');
                return true;
            } else {
                showToast(data.message, 'error');
                return false;
            }
        } catch (err) {
            showToast('Security Protocol Breach', 'error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        showToast('Logged Out Securely', 'info');
        addLog('User Session Terminated', 'auth');
    };

    const addEvent = async (eventData) => {
        try {
            const res = await fetch(`${API_BASE}/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(eventData)
            });
            const data = await res.json();
            if (res.ok) {
                setEvents(prev => [...prev, data]);
                showToast('Event Proposal Submitted', 'success');
                addLog(`Proposed: ${eventData.title}`, 'proposal');
                fetchAllData();
            } else {
                showToast(data.message, 'error');
            }
        } catch (err) {
            showToast('Submission Failed', 'error');
        }
    };

    const updateEventStatus = async (eventId, nextStatus, note, reason = '') => {
        try {
            const res = await fetch(`${API_BASE}/events/${eventId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: nextStatus, note, reason })
            });
            if (res.ok) {
                showToast(`Status updated: ${nextStatus}`, 'success');
                addLog(`Event ${eventId} transitioned to ${nextStatus}`, 'process');
                fetchAllData();
            } else {
                const data = await res.json();
                showToast(data.message, 'error');
            }
        } catch (err) {
            showToast('Connection Refused', 'error');
        }
    };

    const resetResource = async (resourceId) => {
        try {
            const res = await fetch(`${API_BASE}/resources/${resourceId}/reset`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                showToast('Resource Inventory Restored', 'success');
                addLog(`Resource ${resourceId} re-indexed to 100%`, 'inventory');
                fetchAllData();
            }
        } catch (err) {
            showToast('Restock failed', 'error');
        }
    };

    const addNotification = (message, targetRole) => {
        setNotifications(prev => [{ id: Date.now(), message, targetRole, read: false }, ...prev]);
        showToast(message, 'info');
    };

    return (
        <AppContext.Provider value={{
            user, setUser, login, logout,
            events, addEvent, updateEventStatus,
            venues, setVenues,
            resources, setResources, resetResource,
            notifications, loading, toasts, systemLogs, showToast, addLog
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
