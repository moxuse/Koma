import fs from "fs";
// import { AudioData } from 'wav-decoder';

export const OMMITED_RATE = 24;
export const DETAILED_RATE = 8;
// import TableList from "../view/model/TableList";
// const settings = require(__dirname + '\/../store.json');

// type StoreData = TableList;

// export const loadSetting = (): Promise<StoreData> => {
//   return new Promise((resolve, reject) => {
//     // let json = __dirname + '\/../store.json'; //fs.readFileSync(settingsPath, 'utf8');
//     if (settings) {
//       return resolve(settings);    
//     }    
//     return reject('couldn\'t load store.json...');
//     });
//}

// const amp2dB = (input: number) => {
//   return 100 + (20.0 * Math.log10(input));
// }

export const reduceAudioData = (data: Float32Array): { omitted: Float32Array, detailed: Float32Array } => {
  const omitted = data.filter((sample, i) => i % OMMITED_RATE === 0);
  const detailed = data.filter((sample, i) => i % DETAILED_RATE === 0);
  return { omitted, detailed }
};

export const readFile = (filepath: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, (err, buffer) => {
      if (err) {
        return reject(err);
      };
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
  })
}

export const int8ArrayToBuffer = (arr: Int8Array): Buffer => { 
  return ArrayBuffer.isView(arr)
    ? Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength)
    : Buffer.from(arr)
}
