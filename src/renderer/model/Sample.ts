import { Record } from 'immutable';

export interface SampleType {
  id: string;
  allocated: boolean;
  filePath: string | undefined;
  buffer: Float32Array | undefined;
}

const DefaultSample: SampleType = {
  id: '0',
  allocated: false,
  filePath: undefined,
  buffer: undefined,
};

export default class Sample extends Record(DefaultSample) {
  getId() {
    return this.get('id');
  }
  getAllocated() {
    return this.get('allocated');
  }
  getFilePath() {
    return this.get('filePath');
  }
  getBuffer() {
    return this.get('buffer');
  }
}
