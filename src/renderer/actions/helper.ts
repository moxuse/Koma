const Buffer = require('buffer').Buffer;

export function getNewId(): string {
  return Buffer.from('' + Math.random(), 'utf-8').toString('base64');
};

export function ommitFileName(pathName: string) {
  const sp = pathName.split('/');
  const sp2 = sp[sp.length - 1];
  return sp2.split('.')[0];
};
