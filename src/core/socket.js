// @flow

import socket from 'socket.io';
import socketRedis from 'socket.io-redis';
import chalk from 'chalk';

import { REDIS_PORT, REDIS_HOST } from '~/env';
import server from '~/api';

export const io = socket.listen(server);

io.origins(['*:*']);
io.adapter(socketRedis({ host: REDIS_HOST, port: REDIS_PORT }));

// todo all bellow is temporary
const field = {
  width: 18,
  height: 18,
  debug: true,
};

const players = [];

function generateRandomNumberRange(n) {
  return Math.round(Math.random() * (n * 2) - n);
}

function generatePosition() {
  let x;
  while (true) {
    x = generateRandomNumberRange(field.width);
    if (Math.abs(x) % 2 === 0 && !players.some((p) => p.position.x !== x)) {
      break;
    }
  }

  let z;
  while (true) {
    z = generateRandomNumberRange(field.height);

    if (Math.abs(z) % 2 === 0 && !players.some((p) => p.position.z !== z)) {
      break;
    }
  }

  return { x, z, y: 1 };
}

function createPlayer(socket) {
  return {
    id: socket.id,
    position: generatePosition()
  };
}

function addNewPlayer(socket) {
  const player = createPlayer(socket);
  players.push(player);

  return player;
}

io.on('connection', (connSocket): void => {
  console.log(chalk.hex('#009688')(' [*] Socket: Connection Succeeded.'));

  connSocket.emit('field', field);

  const player = addNewPlayer(connSocket);

  connSocket.emit('create-player-success', player);
  connSocket.broadcast.emit('player-joined', player);

  connSocket.on('disconnect', (...args) => {

    io.emit('player-leaved', player.id);

    console.log(chalk.hex('#009688')(' [*] Socket: Disconnected.'))
  });
});
