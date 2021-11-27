import fs from "fs";
import TableList from "../view/model/TableList";

const settingsPath = require(__dirname + '../store.json');

type StoreData = TableList;

export const loadStore = (): Promise<StoreData> => {
  return new Promise((resolve, reject) => {
    let json = fs.readFileSync(settingsPath, 'utf8');
    if (json) {
      return resolve(JSON.parse(json));    
    }    
    return reject('couldn\'t load store.json...');
    });
}

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
