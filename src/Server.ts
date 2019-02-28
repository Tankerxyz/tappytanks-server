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
import FieldModel, { IFieldModel } from './models/FieldModel';
import PlayerModel, { IPlayerModel } from './models/PlayerModel';
import * as cors from 'cors';
const MongoStore = require('connect-mongo')(session);

export default class Server {
  public static readonly PORT: string = "3000";
  private app: express.Application;
  private server: HTTPServer;
  private io: SocketIO.Server;
  private port: string | number;
  private db: any;
  private fieldModel: IFieldModel;
  private field: Field;
  private playersCtrl: PlayersCtrl;

  constructor() {
    this.createApp();
    this.configureDb();
    this.config();
    this.createServer();
    this.configureRoutes();
    this.sockets();
  }

  private configureDb(): void {
    mongoose.connect(process.env.DB_URI, {useNewUrlParser: true});
    this.db = mongoose.connection;
    this.db.on('error', console.error.bind(console, 'connection error:'));
    this.db.once('open', () => {
      this.listen();

      console.log('we are connected to tappytanks db!');
    });
  }

  private configureRoutes(): void {
    this.app.get('/session', (req, res, next) => {
      res.send({ userID: req.sessionID});
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
    const whitelist = ['http://localhost:3030', 'https://ttanks.tk'];
    const corsOptions = {
      origin: (origin: string, callback: (err: any, result?: any) => void) => {
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      },
      credentials: true
    };
    this.app.use(cors(corsOptions));
    this.app.use(session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 8*60*60*1000,
        httpOnly: false
      },
      store: new MongoStore({
        mongooseConnection: this.db,
        ttl: 24 * 60 * 60
      })
    }));
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

  private async getOrCreatePlayerModel(userID: string): Promise<IPlayerModel> {
    let player = await PlayerModel.findOne({ userID });

    if (!player) {
      player = new PlayerModel({
        userID,
        position: this.playersCtrl.generatePosition(),
        rotation: this.playersCtrl.generateRotation(),
        color: this.playersCtrl.generateColor()
      });
      await player.save();
    }

    return player;
  }

  private async listen(): Promise<any> {
    this.fieldModel = await this.getFieldModel();
    this.field = new Field(this.fieldModel);
    if (!this.field.walls.length) {
      this.field.walls = generateWalls(this.field, 3);
      await this.field.save();
    }

    this.playersCtrl = new PlayersCtrl({
      field: this.field,
      players: this.field.players
    });

    this.server.listen(this.port, () => {
      console.log('Running server on port %s', this.port);
    });

    this.io.on('connect', async (socket: Socket) => {
      console.log(chalk.green(`Connected client ('${socket.id}')`));
      socket.emit('field', this.field.getNormalized());

      const userID = socket.handshake.query.userID;

      const playerModel = await this.getOrCreatePlayerModel(userID);
      const player = this.playersCtrl.addNewPlayer(playerModel);

      let socketCtrl = new SocketCtrl(socket, player);

      const normalizedPlayer = player.getNormalized();

      socket.emit('create-player-success', normalizedPlayer);
      socket.broadcast.emit('player-joined', normalizedPlayer);

      console.log(chalk.yellow(`Players: [${this.playersCtrl.players.length}]`));

      socket.on('disconnect', () => {
        console.log(chalk.blue(`Disconnected client ('${socket.id}')`));

        this.io.emit('player-leaved', normalizedPlayer.userID);
        this.playersCtrl.removePlayer(player);

        // said the GC that you need to clean unused class
        socketCtrl = null;

        console.log(chalk.yellow(`Players: [${this.playersCtrl.players.length}]`));
      });
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}
