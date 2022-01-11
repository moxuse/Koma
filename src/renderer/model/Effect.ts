import { Record } from 'immutable';

export type GrainPoint = {
  x: number;
  y: number;
}

export type EffectKeys = keyof EffectData;

export type EffectData = {
  id: string;
  pan: number;
  rate: number;
  gain: number;
  points: Array<GrainPoint>
  duration: number;
  trig: number;
};

export const DefaultEffect: EffectData = {
  id: '0',
  pan: 0,
  rate: 1,
  gain: 1,
  duration: 0.1,
  trig: 4,
  points: []
};

export default class Effect extends Record(DefaultEffect) {
  getId() {
    return this.get('id');
  };
  getPan() {
    return this.get('pan');
  };
  getRate() {
    return this.get('rate');
  };
  getGain() {
    return this.get('gain');
  };
  getDuration() {
    return this.get('duration');
  };
  getTrig() { 
    return this.get('trig');
  }
  getPoints() {
    return this.get('points');
  };
};
