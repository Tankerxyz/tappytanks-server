import Field from '../entity/Field';
import Wall from '../entity/Wall';

export function generateRandomNumberRange(n: number) {
  return Math.round((Math.random() * (n - 1)) - ((n - 1) / 2));
}

// todo refactor
export function generateWalls(field: Field, count: number): Array<Wall> {
  const walls: Array<Wall> = [];

  for (let i = 0; i < count; ++i) {
    let x: number, z: number, y: number = 1;
    while(true) {
      x = generateRandomNumberRange(field.width);

      if (Math.abs(x) % 2 === 0 && !field.players.some(p => p.position.x === x)) {
        break;
      }
    }

    while(true) {
      z = generateRandomNumberRange(field.height);

      if (Math.abs(z) % 2 === 0 && !field.players.some(p => p.position.z === z)) {
        break;
      }
    }

    walls.push(new Wall({
      position: { x, y, z }
    }))
  }

  return walls;
}
