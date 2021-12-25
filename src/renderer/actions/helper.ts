import md5 from 'md5';

export function getNewId() {
  return md5('' + Math.random(), { asString: true });
};

export function ommitFileName(pathName: string) {
  const sp = pathName.split('/');
  const sp2 = sp[sp.length - 1];
  return sp2.split('.')[0];
};
