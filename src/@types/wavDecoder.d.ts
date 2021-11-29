declare module 'wav-decoder';/* {
  export type AudioData = {
    numberOfChannels: number;
    length: number;
    sampleRate: number;
    channelData: [Float32Array];
  }
  export function decode(bffer: Buffer, opt: {}): (bffer: Buffer, opt: {}) => Promise<AudioData>;
}
*/