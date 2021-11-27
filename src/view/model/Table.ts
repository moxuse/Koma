import { Record } from 'immutable';

const DefaultTable = {
  id: 'id',
  filePath: '',
  // buffer: [0.0]
}

export default class Table extends Record(DefaultTable) {
  getId() {
    return this.get('id');
  }
  
  getFliePath() {
    return this.get('filePath');
  }
  // getBuffer() {
  //   return this.get('buffer')
  // }
}
