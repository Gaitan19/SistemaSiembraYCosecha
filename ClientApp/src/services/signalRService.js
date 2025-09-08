import * as signalR from "@microsoft/signalr";

class SignalRService {
    constructor() {
        this.connection = null;
        this.connectionId = null;
        this.isConnected = false;
        this.listeners = new Map();
    }

    async start() {
        if (this.connection && this.isConnected) {
            return;
        }

        try {
            // Create connection
            this.connection = new signalR.HubConnectionBuilder()
                .withUrl("/notificationHub", {
                    transport: signalR.HttpTransportType.WebSockets | 
                              signalR.HttpTransportType.LongPolling
                })
                .withAutomaticReconnect([0, 2000, 10000, 30000])
                .configureLogging(signalR.LogLevel.Information)
                .build();

            // Set up connection event handlers
            this.connection.onreconnecting(() => {
                console.log("SignalR: Attempting to reconnect...");
                this.isConnected = false;
                this.notifyListeners('connectionStatus', 'reconnecting');
            });

            this.connection.onreconnected(() => {
                console.log("SignalR: Reconnected successfully");
                this.isConnected = true;
                this.notifyListeners('connectionStatus', 'connected');
            });

            this.connection.onclose(() => {
                console.log("SignalR: Connection closed");
                this.isConnected = false;
                this.notifyListeners('connectionStatus', 'disconnected');
            });

            // Start the connection
            await this.connection.start();
            this.isConnected = true;
            this.connectionId = this.connection.connectionId;
            
            console.log("SignalR: Connected successfully");
            this.notifyListeners('connectionStatus', 'connected');

            // Set up event listeners for real-time updates
            this.setupEventListeners();

        } catch (error) {
            console.error("SignalR: Connection failed", error);
            this.isConnected = false;
            this.notifyListeners('connectionStatus', 'error');
            
            // Retry connection after 5 seconds
            setTimeout(() => this.start(), 5000);
        }
    }

    setupEventListeners() {
        if (!this.connection) return;

        // Categories
        this.connection.on("CategoriaCreated", (categoria) => {
            this.notifyListeners('CategoriaCreated', categoria);
        });

        this.connection.on("CategoriaUpdated", (categoria) => {
            this.notifyListeners('CategoriaUpdated', categoria);
        });

        this.connection.on("CategoriaDeleted", (id) => {
            this.notifyListeners('CategoriaDeleted', id);
        });

        // Products
        this.connection.on("ProductoCreated", (producto) => {
            this.notifyListeners('ProductoCreated', producto);
        });

        this.connection.on("ProductoUpdated", (producto) => {
            this.notifyListeners('ProductoUpdated', producto);
        });

        this.connection.on("ProductoDeleted", (id) => {
            this.notifyListeners('ProductoDeleted', id);
        });

        // Users
        this.connection.on("UsuarioCreated", (usuario) => {
            this.notifyListeners('UsuarioCreated', usuario);
        });

        this.connection.on("UsuarioUpdated", (usuario) => {
            this.notifyListeners('UsuarioUpdated', usuario);
        });

        this.connection.on("UsuarioDeleted", (id) => {
            this.notifyListeners('UsuarioDeleted', id);
        });

        // Providers
        this.connection.on("ProveedorCreated", (proveedor) => {
            this.notifyListeners('ProveedorCreated', proveedor);
        });

        this.connection.on("ProveedorUpdated", (proveedor) => {
            this.notifyListeners('ProveedorUpdated', proveedor);
        });

        this.connection.on("ProveedorDeleted", (id) => {
            this.notifyListeners('ProveedorDeleted', id);
        });

        // Sales
        this.connection.on("VentaCreated", (venta) => {
            this.notifyListeners('VentaCreated', venta);
        });
    }

    subscribe(eventName, callback) {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, []);
        }
        this.listeners.get(eventName).push(callback);

        // Return unsubscribe function
        return () => {
            const callbacks = this.listeners.get(eventName);
            if (callbacks) {
                const index = callbacks.indexOf(callback);
                if (index > -1) {
                    callbacks.splice(index, 1);
                }
            }
        };
    }

    notifyListeners(eventName, data) {
        const callbacks = this.listeners.get(eventName);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in SignalR callback for ${eventName}:`, error);
                }
            });
        }
    }

    async stop() {
        if (this.connection) {
            await this.connection.stop();
            this.isConnected = false;
            this.connection = null;
            this.connectionId = null;
            console.log("SignalR: Connection stopped");
        }
    }

    getConnectionStatus() {
        return this.isConnected ? 'connected' : 'disconnected';
    }
}

// Create a singleton instance
const signalRService = new SignalRService();

export default signalRService;