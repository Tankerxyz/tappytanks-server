import Field from '../entity/Field';
import Wall from '../entity/Wall';

export const colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'
];

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
