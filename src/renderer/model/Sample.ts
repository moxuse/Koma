import { Record } from 'immutable';

export type SampleState = 'NOT_ALLOCATED' | 'EMPTY' | 'ALLOCATED';

export interface SampleType {
  id: string;
  state: SampleState;
  filePath: string | undefined;
  buffer: Float32Array | undefined;
}

const DefaultSample: SampleType = {
  id: '0',
  state: 'NOT_ALLOCATED',
  filePath: undefined,
  buffer: new Float32Array(),
};

export default class Sample extends Record(DefaultSample) {
  getId() {
    return this.get('id');
  }
  getState() {
    return this.get('state');
  }
  getFilePath() {
    return this.get('filePath');
  }
  getBuffer() {
    return this.get('buffer');
  }
}
