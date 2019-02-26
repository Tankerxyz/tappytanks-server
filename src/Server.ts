import { createServer, Server as HTTPServer } from 'http';
import chalk from 'chalk';
import * as express from 'express';
import * as io from 'socket.io';
import Field from './entity/Field';
import PlayersCtrl from './controllers/PlayersCtrl';
import { Socket } from 'socket.io';
import SocketCtrl from './controllers/SocketCtrl';
import Player from './entity/Player';
import Wall from './entity/Wall';
import { generateWalls } from './utils';
import * as session from 'express-session';
import * as mongoose from 'mongoose';
import FieldModel, { IFieldModel } from './models/Field';

export default class Server {
  public static readonly PORT: string = "3000";
  private app: express.Application;
  private server: HTTPServer;
  private io: SocketIO.Server;
  private port: string | number;
  private db: any;
  private fieldModel: IFieldModel;
  private field: Field;

  constructor() {
    this.createApp();
    this.config();
    this.createServer();
    this.configureDb();
    this.configureRoutes();
    this.sockets();
  }

  private configureDb(): void {
    mongoose.connect('mongodb://localhost/tappytanks', {useNewUrlParser: true});
    this.db = mongoose.connection;
    this.db.on('error', console.error.bind(console, 'connection error:'));
    this.db.once('open', () => {
      this.listen();

      console.log('we are connected to tappytanks db!');
    });
  }

  private configureRoutes(): void {
    this.app.use(session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: true
      }
    }));
    this.app.use((req, res, next) => {
      console.log(req.session, req.sessionID);
      next();
    });
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

  private async getFieldModel(): Promise<IFieldModel> {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let field = await FieldModel.findOne({
      creation_date: {
        $gte: startOfToday
      }
    });

    if (!field) {
      field = new FieldModel();
      await field.save();
    }

    return field;
  }

  private async listen(): Promise<any> {
    this.fieldModel = await this.getFieldModel();
    this.field = new Field(this.fieldModel);
    if (!this.field.walls.length) {
      this.field.walls = generateWalls(this.field, 3);
      await this.field.save();
    }

    const playersCtrl = new PlayersCtrl({
      field: this.field,
      players: this.field.players
    });

    this.server.listen(this.port, () => {
      console.log('Running server on port %s', this.port);
    });

    this.io.on('connect', (socket: Socket) => {
      console.log(chalk.green(`Connected client ('${socket.id}')`));
      socket.emit('field', this.field.getNormalized());

      const player = playersCtrl.addNewPlayer(socket);
      let socketCtrl = new SocketCtrl(socket, player);

      socket.emit('create-player-success', player);
      socket.broadcast.emit('player-joined', player);

      console.log(chalk.yellow(`Players: [${playersCtrl.players.length}]`));

      socket.on('disconnect', () => {
        console.log(chalk.blue(`Disconnected client ('${socket.id}')`));

        this.io.emit('player-leaved', player.id);
        playersCtrl.removePlayer(player);

        // said the GC that you need to clean unused class
        socketCtrl = null;

        console.log(chalk.yellow(`Players: [${playersCtrl.players.length}]`));
      });
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}
