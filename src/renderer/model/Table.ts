import { Record } from 'immutable';

export type Slice = {
  begin: number;
  end: number;
};

export type TableType = {
  id: string;
  mode: TableMode,
  name: string | undefined;
  bufnum: number | undefined;
  sample: string | undefined;
  slice: Slice | undefined;
  effect: string | undefined;
};

const DefaultTable: TableType = {
  id: 'id',
  mode: 'normal',
  name: 'default',
  bufnum: 600,
  sample: undefined,
  slice: undefined,
  effect: undefined,
};

export default class Table extends Record(DefaultTable) {
  getId() {
    return this.get('id');
  };
  getMode() { 
    return this.get('mode');
  }
  getName() {
    return this.get('name');
  };
  getBufnum() {
    return this.get('bufnum');
  };
  getSample() {
    return this.get('sample');
  };
  getSlice() {
    return this.get('slice');
  };
  getEffect() {
    return this.get('effect');
  }
};
