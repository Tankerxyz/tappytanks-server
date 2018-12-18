import { createServer, Server as HTTPServer } from 'http';
import chalk from 'chalk';
import * as express from 'express';
import * as io from 'socket.io';
import Field from './entity/Field';
import PlayersCtrl from './controllers/PlayersCtrl';

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

    // todo all bellow is temporary
    const players: any = [];

    const field = new Field({
      width: 18,
      height: 18,
      debug: true,
      players,
    });

    const playersCtrl = new PlayersCtrl({ field, players });

    this.io.on('connect', (socket: any) => {
      console.log(chalk.green(`Connected client ('${socket.id}')`));

      socket.emit('field', field);

      const player = playersCtrl.addNewPlayer(socket);

      socket.emit('create-player-success', player);
      socket.broadcast.emit('player-joined', player);

      console.log(chalk.yellow(`Players: [${players.length}]`));

      socket.on('change-rotation', (newRotation: any) => {
        player.rotation = newRotation;

        socket.broadcast.emit('player-changed-rotation', player);
      });

      socket.on('change-position', (newPosition: any) => {
        // todo add collision checking
        player.position = newPosition;

        socket.broadcast.emit('player-changed-position', player);
      });

      socket.on('disconnect', () => {
        console.log(chalk.blue(`Disconnected client ('${socket.id}')`));

        this.io.emit('player-leaved', player.id);

        playersCtrl.removePlayer(player);

        console.log(chalk.yellow(`Players: [${playersCtrl.players.length}]`));
      });
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}
