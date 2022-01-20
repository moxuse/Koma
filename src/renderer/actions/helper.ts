import { GrainPoint } from '../model/Effect';
import { GrainEditorSize } from '../components/Tools/GrainEditor';

const Buffer = require('buffer').Buffer;

export function getNewId(): string {
  return Buffer.from('' + Math.random(), 'utf-8').toString('base64');
};

export function ommitFileName(pathName: string) {
  const sp = pathName.split('/');
  const sp2 = sp[sp.length - 1];
  return sp2.split('.')[0];
};

export const normalizeInt8Points = (points: GrainPoint[]): GrainPoint[] => {
  return points.map(p => {
    let x_ = Math.floor(p.x / GrainEditorSize.width * 256) - 128;
    if (x_ === 0) { x_ = 1 };
    let y_ = Math.floor(p.y / GrainEditorSize.height * 256) - 128;
    if (y_ === 0) { y_ = 1 };
    return { x: x_, y: y_ };
  });
}