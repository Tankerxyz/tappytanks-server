import { Socket } from 'socket.io';
import Player from '../entity/Player';

export default class SocketCtrl {
  private socket: Socket;
  private readonly player: Player;

  constructor(socket: Socket, player: Player) {
    this.socket = socket;
    this.player = player;

    this.initHandlers();
  }

  private initHandlers(): void {

    this.socket.on('change-rotation', (newRotation: any) => {
      this.player.rotation = newRotation;

      this.socket.broadcast.emit('player-changed-rotation', this.player);
    });

    this.socket.on('change-position', (newPosition: any) => {
      // todo add collision checking
      this.player.position = newPosition;

      this.socket.broadcast.emit('player-changed-position', this.player);
    });
  }
}
