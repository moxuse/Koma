import { List, Record } from 'immutable';
import Table from './Table';
import Sample from './Sample';
import Effect from './Effect';

const DefaultTableList = {
  tables: List<Table>(),
  samples: List<Sample>(),
  effects: List<Effect>(),
};

export default class TableList extends Record(DefaultTableList) {
  static getTableById(target: TableList, id: string): Table | undefined {
    return target.getTables().filter(table => {
      return table.getId() === id;
    }).get(0);
  }

  static getTableIndexById(target: TableList, id: string): number {
    let index = -1;
    target.getTables().forEach((table, i) => {
      if (table.getId() === id) { index = i; }
    });
    return index;
  }

  static getSampleById(target: TableList, id: string): Sample | undefined {
    return target.getSamples().filter(sample => {
      return sample.getId() === id;
    }).get(0);
  }

  static getSampleIndexById(target: TableList, id: string): number {
    let index = -1;
    target.getSamples().forEach((sample, i) => {
      if (sample.getId() === id) { index = i; }
    });
    return index;
  }

  static getEffectById(target: TableList, id: string): Effect | undefined {
    return target.getEffects().filter(effect => {
      return effect.getId() === id;
    }).get(0);
  }

  static getEffectIndexById(target: TableList, id: string): number {
    let index = -1;
    target.getEffects().forEach((effect, i) => {
      if (effect.getId() === id) { index = i; }
    });
    return index;
  }

  static getAllocatedSampleById(target: TableList, id: string): boolean {
    let alloc = false;
    target.getSamples().forEach((sample) => {
      if (sample.getId() === id) {
        alloc = sample.getAllocated();
      }
    });
    return alloc;
  }

  static newFromTableList(tables: List<Table>): TableList {
    return new TableList().set('tables', tables);
  }

  static newFromSampleList(samples: List<Sample>): TableList {
    return new TableList().set('samples', samples);
  }

  static appendTable(target: TableList, table: Table): TableList {
    return new TableList().set('tables', target.getTables().push(table)).set('samples', target.getSamples()).set('effects', target.getEffects());
  }

  static appendSample(target: TableList, sample: Sample): TableList {
    return new TableList().set('samples', target.getSamples().push(sample)).set('tables', target.getTables()).set('effects', target.getEffects());
  }

  static appendEffect(target: TableList, effect: Effect): TableList {
    return new TableList().set('effects', target.getEffects().push(effect)).set('tables', target.getTables()).set('samples', target.getSamples());
  }

  static deleteTable(target: TableList, targetId: string): TableList {
    const filtered = target.getTables().filter(t => t.getId() !== targetId);
    return TableList.newFromSampleList(target.getSamples()).set('tables', filtered).set('effects', target.getEffects());
  }

  static deleteSample(target: TableList, targetId: string): TableList {
    const filtered = target.getSamples().filter(s => s.getId() !== targetId);
    return TableList.newFromTableList(target.getTables()).set('samples', filtered).set('effects', target.getEffects());
  }

  static deleteEffect(target: TableList, targetId: string): TableList {
    const filtered = target.getEffects().filter(s => s.getId() !== targetId);
    return TableList.newFromTableList(target.getTables()).set('effects', filtered).set('samples', target.getSamples());
  }

  static updateTable(target: TableList, tableId: string, newTable: Table): TableList {
    const matchedIndex = TableList.getTableIndexById(target, tableId);
    if (matchedIndex >= 0) {
      const newTables = target.getTables().update(matchedIndex, () => newTable);
      return new TableList().set('samples', target.getSamples()).set('effects', target.getEffects()).set('tables', newTables);
    }
    return target;
  }

  static updateSample(target: TableList, sampleId: string, newSample: Sample): TableList {
    const matchedIndex = TableList.getSampleIndexById(target, sampleId);
    if (matchedIndex >= 0) {
      const newSamples = target.getSamples().update(matchedIndex, () => newSample);
      return new TableList().set('tables', target.getTables()).set('effects', target.getEffects()).set('samples', newSamples);
    }
    return target;
  }

  static updateEffect(target: TableList, effectId: string, newEffect: Effect): TableList {
    const matchedIndex = TableList.getEffectIndexById(target, effectId);
    if (matchedIndex >= 0) {
      const newEffects = target.getEffects().update(matchedIndex, () => newEffect);
      return new TableList().set('tables', target.getTables()).set('samples', target.getSamples()).set('effects', newEffects);
    }
    return target;
  }

  getTables(): List<Table> {
    return this.get('tables');
  }

  getSamples() {
    return this.get('samples');
  }

  getEffects() {
    return this.get('effects');
  }

  getBufferDataForSampleId(id?: string): Float32Array | undefined {
    const filtered = this.get('samples').filter(s => s.getId() === id);
    if (filtered) {
      return filtered.get(0)?.getBuffer();
    }
    return undefined;
  }
}
