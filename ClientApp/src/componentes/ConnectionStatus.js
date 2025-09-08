import React from 'react';
import { useSignalR } from '../context/SignalRProvider';

const ConnectionStatus = () => {
    const { connectionStatus } = useSignalR();

    const getStatusColor = () => {
        switch (connectionStatus) {
            case 'connected':
                return 'success';
            case 'reconnecting':
                return 'warning';
            case 'disconnected':
            case 'error':
                return 'danger';
            default:
                return 'secondary';
        }
    };

    const getStatusText = () => {
        switch (connectionStatus) {
            case 'connected':
                return 'En línea';
            case 'reconnecting':
                return 'Reconectando...';
            case 'disconnected':
                return 'Desconectado';
            case 'error':
                return 'Error de conexión';
            default:
                return 'Conectando...';
        }
    };

    const getStatusIcon = () => {
        switch (connectionStatus) {
            case 'connected':
                return '🟢';
            case 'reconnecting':
                return '🟡';
            case 'disconnected':
            case 'error':
                return '🔴';
            default:
                return '⚪';
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 9999,
            backgroundColor: 'white',
            border: '1px solid #dee2e6',
            borderRadius: '5px',
            padding: '8px 12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            fontSize: '12px',
            color: '#495057'
        }}>
            <span style={{ marginRight: '5px' }}>{getStatusIcon()}</span>
            <span className={`text-${getStatusColor()}`}>
                {getStatusText()}
            </span>
        </div>
    );
};

export default ConnectionStatus;