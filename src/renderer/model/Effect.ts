import { Record } from 'immutable';

export type EffectType = 'normal' | 'grain';

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
  type: EffectType;
  points: Array<GrainPoint>
};

export const DefaultEffect: EffectData = {
  id: '0',
  pan: 0,
  rate: 1,
  gain: 1,
  type: 'normal',
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
  getType() {
    return this.get('type');
  };
  getPoints() {
    return this.get('points');
  };
};
