import { createServer, Server as HTTPServer } from 'http';
import chalk from 'chalk';
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

    // todo all bellow is temporary
    const players: any = [];


    const field = {
      width: 18,
      height: 18,
      debug: true,
      restPlayers: players,
    };

    function generateRandomNumberRange(n: number) {
      return Math.round((Math.random() * (n - 1)) - ((n - 1) / 2));
    }

    function generatePosition() {
      let x: number;
      while (true) {
        x = generateRandomNumberRange(field.width);
        if (Math.abs(x) % 2 === 0 && !players.some((p: any) => p.position.x === x)) {
          break;
        }
      }

      let z: number;
      while (true) {
        z = generateRandomNumberRange(field.height);

        if (Math.abs(z) % 2 === 0 && !players.some((p: any) => p.position.z === z)) {
          break;
        }
      }

      return { x, z, y: 1 };
    }

    function generateRotation() {
      // let z = [Math.PI / 2, Math.PI, -Math.PI / 2, -Math.PI][~~(Math.random() * 4 + 1)];

      return { x: -Math.PI / 2, y: 0, z: 0 };
    }

    function createPlayer(socket: any) {
      return {
        id: socket.id,
        position: generatePosition(),
        rotation: generateRotation(),
      };
    }

    function addNewPlayer(socket: any) {
      const player = createPlayer(socket);
      players.push(player);

      return player;
    }

    this.io.on('connect', (socket: any) => {
      console.log(chalk.green(`Connected client ('${socket.id}')`));

      socket.emit('field', field);

      const player = addNewPlayer(socket);

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

        players.splice(players.indexOf(player), 1);

        console.log(chalk.yellow(`Players: [${players.length}]`));
      });
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}
