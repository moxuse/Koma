import { Record } from 'immutable';

export type Slice = {
  begin: number;
  end: number;
}

export type TableType = {
  id: string;
  name: string | undefined;
  bufnum: number | undefined;
  sample: string | undefined;
  slice: Slice | undefined;
}

const DefaultTable: TableType = {
  id: 'id',
  name: 'default',
  bufnum: 9000,
  sample: undefined,
  slice: undefined,
}

export default class Table extends Record(DefaultTable) {
  getId() {
    return this.get('id');
  }
  getName() {
    return this.get('name');
  }
  getBufnum() {
    return this.get('bufnum');
  }
  getSample() {
    return this.get('sample');
  }
  getSlice() {
    return this.get('slice');
  }

  updateSlice(slice: Slice) {
    this.set('slice', slice);
  }
  static updateSlice(target: Table, newSlice: Slice) {
    return target.updateSlice(newSlice);
  }
}
