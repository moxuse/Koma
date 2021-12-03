import { Record } from 'immutable';

export type TableType = {
  id: string;
  filePath: string | undefined;
  buffer: Float32Array | undefined;
}

const DefaultTable: TableType = {
  id: 'id',
  filePath: '',
  buffer: undefined
}

export default class Table extends Record(DefaultTable) {
  getId() {
    return this.get('id');
  }
  getFliePath() {
    return this.get('filePath');
  }
  getBuffer() {
    return this.get('buffer')
  }
}
