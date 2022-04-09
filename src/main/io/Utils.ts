import fs from 'fs';

export const OMITTED_RATE = 24;
export const DETAILED_RATE = 8;

export const reduceAudioData = (data: Float32Array): { omitted: Float32Array; detailed: Float32Array } => {
  const omitted = data.filter((sample, i) => i % OMITTED_RATE === 0);
  const detailed = data.filter((sample, i) => i % DETAILED_RATE === 0);
  return { omitted: omitted, detailed: detailed };
};

export const readFile = (filepath: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, (err, buffer) => {
      if (err) {
        return reject(err);
      }
      return resolve(buffer);
    });
  });
};

export const restoreData = (filepath: string): Promise<Object> => {
  return new Promise((resolve, reject) => {
    try {
      const file = fs.readFileSync(filepath, 'utf8');
      const tables = JSON.parse(file);
      resolve(tables);
    } catch (err) {
      reject(err);
    }
  });
};

export const int8ArrayToBuffer = (arr: Int8Array): Buffer => {
  return ArrayBuffer.isView(arr)
    ? Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength)
    : Buffer.from(arr);
};
