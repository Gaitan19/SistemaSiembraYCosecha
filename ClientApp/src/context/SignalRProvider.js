import React, { createContext, useContext, useEffect, useState } from 'react';
import signalRService from '../services/signalRService';

const SignalRContext = createContext();

export const useSignalR = () => {
    const context = useContext(SignalRContext);
    if (!context) {
        throw new Error('useSignalR must be used within a SignalRProvider');
    }
    return context;
};

export const SignalRProvider = ({ children }) => {
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Initialize SignalR connection
        const initSignalR = async () => {
            try {
                // Subscribe to connection status changes
                signalRService.subscribe('connectionStatus', (status) => {
                    setConnectionStatus(status);
                    if (status === 'connected') {
                        setIsReady(true);
                    }
                });

                // Start connection
                await signalRService.start();
            } catch (error) {
                console.error('Failed to initialize SignalR:', error);
                setConnectionStatus('error');
            }
        };

        initSignalR();

        // Cleanup on unmount
        return () => {
            signalRService.stop();
        };
    }, []);

    const subscribe = (eventName, callback) => {
        return signalRService.subscribe(eventName, callback);
    };

    const getConnectionStatus = () => {
        return signalRService.getConnectionStatus();
    };

    const value = {
        connectionStatus,
        isReady,
        subscribe,
        getConnectionStatus
    };

    return (
        <SignalRContext.Provider value={value}>
            {children}
        </SignalRContext.Provider>
    );
};

export default SignalRProvider;