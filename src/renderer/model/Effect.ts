import { Record } from 'immutable';

export interface GrainPoint {
  x: number;
  y: number;
}

export type AxisYType = 'rate' | 'dur';

export type EffectKeys = keyof EffectData;

export interface EffectData {
  id: string;
  pan: number;
  rate: number;
  gain: number;
  amp: number;
  points: GrainPoint[];
  duration: number;
  trig: number;
  axisY: AxisYType;
}

export const DefaultEffect: EffectData = {
  id: '0',
  pan: 0,
  rate: 1,
  gain: 0,
  amp: 1,
  duration: 0.1,
  trig: 4,
  points: [],
  axisY: 'rate',
};

export default class Effect extends Record(DefaultEffect) {
  getId() {
    return this.get('id');
  }
  getPan() {
    return this.get('pan');
  }
  getRate() {
    return this.get('rate');
  }
  getGain() {
    return this.get('gain');
  }
  getAmp() {
    return this.get('amp');
  }
  getDuration() {
    return this.get('duration');
  }
  getTrig() {
    return this.get('trig');
  }
  getPoints() {
    return this.get('points');
  }
  getAxisY() {
    return this.get('axisY');
  }
}
