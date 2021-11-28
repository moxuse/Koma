import fs from "fs";
import TableList from "../view/model/TableList";

const settings = require(__dirname + '\/../store.json');

type StoreData = TableList;

export const loadStore = (): Promise<StoreData> => {
  return new Promise((resolve, reject) => {
    // let json = settingsPath; //fs.readFileSync(settingsPath, 'utf8');
    if (settings) {
      return resolve(settings);    
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
