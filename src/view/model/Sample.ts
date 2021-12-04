import { Record } from 'immutable';

export type SampleType = {
  id: string;
  filePath: string | undefined;
  buffer: Float32Array | undefined;
}

const DefaultSample: SampleType = {
  id: '0',
  filePath: undefined,
  buffer: undefined,
}

export default class Sample extends Record(DefaultSample) {
  getId() {
    return this.get('id');
  }
  getFilePath() {
    return this.get('filePath');
  }
  getBuffer() {
    return this.get('buffer');
  }
}