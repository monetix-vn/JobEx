import type { PersonLook } from '@je/contracts';

/** Pixel art drawn as SVG rectangles: crisp, tiny, no image files. Nothing here reads or sends anything. */
const NS = 'http://www.w3.org/2000/svg';

function svg(width: number, height: number, className: string): SVGSVGElement {
  const node = document.createElementNS(NS, 'svg');
  node.setAttribute('viewBox', `0 0 ${width} ${height}`);
  node.setAttribute('class', className);
  node.setAttribute('shape-rendering', 'crispEdges');
  node.setAttribute('preserveAspectRatio', 'none');
  node.setAttribute('aria-hidden', 'true');
  return node;
}

function rect(parent: Element, x: number, y: number, w: number, h: number, fill: string): void {
  const r = document.createElementNS(NS, 'rect');
  r.setAttribute('x', String(x));
  r.setAttribute('y', String(y));
  r.setAttribute('width', String(w));
  r.setAttribute('height', String(h));
  r.setAttribute('fill', fill);
  parent.append(r);
}

/* ------------------------------------------------------------------ people */

const SKIN = ['#f3d2b3', '#e4b98f', '#c99468', '#a26c45', '#704427'];
const HAIR: Record<string, string> = {
  grey: '#b8b8c4',
  black: '#1d1d26',
  dark_brown: '#4a2f1b',
  brown: '#7a4a2a',
  dyed_red: '#c0392b',
  dyed_light: '#e8c872',
};
const SHIRTS = ['#4e7d4e', '#3d6fa8', '#a8573d', '#7a5aa8', '#a89a3d', '#3da89a'];
const DARK = '#14141f';

/** A look for a name when nothing is known about the person: stable, so the same name always draws the same face. */
export function lookFromName(name: string): PersonLook {
  let h = 7;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) | 0;
  const n = Math.abs(h);
  return {
    skin_tone: 1 + (n % 5),
    hair_style: ['short', 'bob', 'bun', 'long_straight', 'buzz', 'side_part'][(n >> 3) % 6]!,
    hair_colour: ['black', 'black', 'dark_brown', 'brown', 'grey'][(n >> 6) % 5]!,
    facial_hair: (n >> 9) % 7 === 0 ? 'stubble' : 'none',
    glasses: (n >> 12) % 4 === 0,
    build: ['slim', 'average', 'sturdy'][(n >> 14) % 3]!,
  };
}

/**
 * An 8 by 10 sprite of a person. Colours come from skin tone, hair, glasses, facial hair and build; shirt colour from the
 * name so colleagues are told apart. Appearance never says anything about character.
 */
export function portrait(
  look: PersonLook,
  shirtSeed: string,
  className = 'je-sprite',
): SVGSVGElement {
  const node = svg(8, 10, className);
  const skin = SKIN[Math.min(SKIN.length, Math.max(1, look.skin_tone)) - 1]!;
  const hair = HAIR[look.hair_colour] ?? HAIR.black!;
  let h = 3;
  for (const ch of shirtSeed) h = (h * 31 + ch.charCodeAt(0)) | 0;
  const shirt = SHIRTS[Math.abs(h) % SHIRTS.length]!;
  const style = look.hair_style;
  const bald = style === 'bald';
  const long = /long|shoulder|ponytail/.test(style);
  const buzz = /buzz|crop/.test(style);

  // hair behind and on top
  if (!bald) {
    rect(node, 2, buzz ? 1 : 0, 4, buzz ? 1 : 2, hair);
    rect(node, 1, 1, 6, 1, hair);
    if (!buzz) rect(node, 1, 2, 1, long ? 5 : 1, hair);
    if (!buzz) rect(node, 6, 2, 1, long ? 5 : 1, hair);
    if (/bun/.test(style)) rect(node, 3, -1, 2, 1, hair);
  }
  // face
  rect(node, 2, 2, 4, 4, skin);
  rect(node, 2, 3, 1, 1, look.glasses ? DARK : DARK);
  rect(node, 5, 3, 1, 1, DARK);
  if (look.glasses) {
    rect(node, 1, 3, 1, 1, DARK);
    rect(node, 6, 3, 1, 1, DARK);
    rect(node, 3, 3, 2, 1, DARK);
  }
  rect(node, 3, 5, 2, 1, look.facial_hair !== 'none' ? hair : '#a0504a');
  if (look.facial_hair === 'beard' || look.facial_hair === 'goatee') rect(node, 2, 5, 4, 1, hair);
  if (look.facial_hair === 'moustache') rect(node, 2, 4, 4, 1, hair);
  // body
  const wide = look.build === 'sturdy' || look.build === 'heavy';
  rect(node, wide ? 0 : 1, 6, wide ? 8 : 6, 3, shirt);
  rect(node, 1, 9, 2, 1, DARK);
  rect(node, 5, 9, 2, 1, DARK);
  return node;
}

/* ------------------------------------------------------------------ places */

type Block = [x: number, y: number, w: number, h: number, colour: string];

const WALL = '#2b2b4a';
const FLOOR = '#3a3a55';
const WOOD = '#8a5a2b';
const STEEL = '#6c7a89';
const WIN = '#9ad1ff';

/** Furniture per place, on a 32 by 10 grid whose floor starts at row 6. Hand-placed first drafts of the art. */
const PLACES: Record<string, Block[]> = {
  meeting_room: [
    [10, 1, 12, 3, '#e8e8f0'],
    [12, 2, 3, 1, '#c0392b'],
    [17, 2, 3, 1, '#3d6fa8'],
    [6, 6, 20, 1, WOOD],
    [7, 7, 1, 2, WOOD],
    [24, 7, 1, 2, WOOD],
    [3, 5, 2, 3, '#555577'],
    [27, 5, 2, 3, '#555577'],
  ],
  qc_lab: [
    [2, 5, 12, 1, STEEL],
    [3, 6, 1, 3, STEEL],
    [12, 6, 1, 3, STEEL],
    [4, 3, 1, 2, '#8fe388'],
    [6, 4, 1, 1, '#ff6b6b'],
    [9, 2, 2, 3, '#ddd'],
    [18, 1, 12, 1, STEEL],
    [19, 2, 2, 1, '#9ad1ff'],
    [24, 2, 3, 1, '#ffd166'],
    [20, 6, 9, 1, STEEL],
  ],
  sales_office: [
    [3, 5, 8, 1, WOOD],
    [5, 3, 3, 2, '#111'],
    [6, 4, 1, 1, '#9ad1ff'],
    [14, 1, 9, 4, '#33557a'],
    [15, 2, 3, 2, '#4e7d4e'],
    [19, 2, 3, 2, '#4e7d4e'],
    [22, 5, 8, 1, WOOD],
    [25, 3, 3, 2, '#111'],
  ],
  factory_floor: [
    [2, 2, 8, 5, '#7d7d8c'],
    [3, 3, 2, 2, '#ffd166'],
    [14, 6, 16, 1, '#444'],
    [16, 4, 3, 2, WOOD],
    [22, 4, 3, 2, WOOD],
    [28, 0, 2, 5, '#55556a'],
    [0, 6, 32, 1, '#4a4a2a'],
  ],
  finance_office: [
    [3, 5, 9, 1, WOOD],
    [4, 3, 2, 2, '#ddd'],
    [8, 4, 2, 1, '#8fe388'],
    [20, 2, 6, 5, '#556'],
    [21, 3, 4, 3, '#ffd166'],
    [14, 1, 4, 3, WIN],
  ],
};
const DEFAULT_PLACE: Block[] = [
  [13, 1, 6, 4, WIN],
  [15, 2, 2, 2, '#ffd166'],
  [3, 5, 4, 3, '#555577'],
  [25, 5, 4, 3, '#555577'],
];

/**
 * The room a scene happens in, with the people in it standing on the floor. A flat picture of 32 by 10 pixels, scaled up by
 * the page. Places the art does not know get a plain room; the scene's text is the story, this is only the stage.
 */
export function stage(
  place: string,
  people: { name: string; look?: PersonLook }[],
  className = 'je-stage',
): SVGSVGElement {
  const node = svg(32, 10, className);
  rect(node, 0, 0, 32, 6, WALL);
  rect(node, 0, 6, 32, 4, FLOOR);
  rect(node, 0, 6, 32, 1, '#2a2a40');
  const key = place.replace(/^loc\./, '');
  for (const [x, y, w, h, c] of PLACES[key] ?? DEFAULT_PLACE) rect(node, x, y, w, h, c);
  const shown = people.slice(0, 4);
  const slots = shown.length === 1 ? [13] : shown.length === 2 ? [8, 18] : [3, 11, 19, 26];
  shown.forEach((p, i) => {
    const sprite = portrait(p.look ?? lookFromName(p.name), p.name, 'je-actor');
    sprite.setAttribute('x', String(slots[i] ?? 0));
    // Smaller than the room is tall, standing on the floor line.
    sprite.setAttribute('y', '2.5');
    sprite.setAttribute('width', '6');
    sprite.setAttribute('height', '7.5');
    node.append(sprite);
  });
  return node;
}

/** A row of tiny cells, filled up to a share: used for the year, and as the shape of a segmented bar. */
export function cells(total: number, filled: number, className: string): SVGSVGElement {
  const node = svg(total * 2, 2, className);
  for (let i = 0; i < total; i++)
    rect(node, i * 2, 0, 1, 2, i < filled ? 'currentColor' : '#2a2a40');
  return node;
}
