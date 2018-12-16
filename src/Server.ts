import { createServer, Server as HTTPServer } from 'http';
import * as express from 'express';
import * as io from 'socket.io';

export default class Server {
    public static readonly PORT: number = 3000;
    private app: express.Application;
    private server: HTTPServer;
    private io: SocketIO.Server;
    private port: string | number;

    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }

    private createApp(): void {
        this.app = express();
    }

    private createServer(): void {
        this.server = createServer(this.app);
    }

    private config(): void {
        this.port = process.env.PORT || Server.PORT;
    }

    private sockets(): void {
        this.io = io(this.server);
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });

        this.io.on('connect', (socket: any) => {
            console.log(`Connected client ('${socket.id}')`);

            socket.on('disconnect', () => {
                console.log(`Disconnected client ('${socket.id}')`);
            });
        });
    }

    public getApp(): express.Application {
        return this.app;
    }
}
