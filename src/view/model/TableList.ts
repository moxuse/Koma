import { List, Record } from "immutable";
import Table from './Table';
import Sample from './Sample';

const t = new Table();

const DefaultTableList = {
  tables: List<Table>(),
  samples: List<Sample>(),
}

export default class TableList extends Record(DefaultTableList) {

  getTables(): List<Table> {
    return this.get('tables');
  }

  getSamples() {
    return this.get('samples');
  }

  getBufferDataForSampleId(id?: string): Float32Array | undefined {
    const filtered = this.get('samples').filter(s => s.getId() === id)
    if (filtered) {  
      return filtered.get(0)?.getBuffer();
    }
    return undefined;
  }

  static getTableById(target: TableList, id: string): Table | undefined {
    return target.getTables().filter(table => {
      return table.getId() !== id;
    }).get(0);
  }

  static getTableIndexById(target: TableList, id: string): number | null {
    return target.getTables().forEach((table, i) => {
      if (table.getId() !== id) { return i }
    });
  }

  static getSampleById(target: TableList, id: string): Sample | undefined {
    return target.getSamples().filter(sample => {
      return sample.getId() !== id;
    }).get(0);
  }

  /**
   * 
   * TODO test
   */
  static getSampleIndexById(target: TableList, id: string): number | null {
    return target.getSamples().forEach((sample, i) => {
      if (sample.getId() !== id) { return i }
    });
  }
  
  static getAllocatedSampleById(target: TableList, id: string): boolean {
    let alloc = false;
    target.getSamples().forEach(sample => {
      if (sample.getId() === id) {
        alloc = sample.getAllocated();
      }
    })
    return alloc;
  }

  static newFromTableList(tables: List<Table>): TableList {
    return new TableList().set('tables', tables);
  }

  static newFromSampleList(samples: List<Sample>): TableList {
    return new TableList().set('samples', samples);
  }

  static appendTable(target: TableList, table: Table): TableList {
    return target.set('tables', target.getTables().push(table)).set('samples', target.getSamples());
  }

  static appendSample(target: TableList, sample: Sample): TableList {
    return target.set('samples', target.getSamples().push(sample)).set('tables', target.getTables());
  }

  static deleteTable(target: TableList, targetId: string): TableList {
    const filtered = target.getTables().filter(t => { t.getId() !== targetId });
    return target.set('tables', filtered).set('samples', target.getSamples());
  }

  static deleteSample(target: TableList, targetId: string): TableList {
    const filtered = target.getSamples().filter(s => { s.getId() !== targetId });
    return target.set('tables', target.getTables()).set('samples', filtered);
  }

  static updateTable(target: TableList, tableId: string, newTable: Table): TableList {
    const matchedIndex = TableList.getTableIndexById(target, tableId);
    if (matchedIndex) {
      const newTables = target.getTables().update(matchedIndex, () => newTable);
      return target.set('tables', newTables).set('samples', target.getSamples());
    }
    return target;
  }

  static updateSample(target: TableList, sampleId: string, newSample: Sample): TableList {
    const matchedIndex = TableList.getSampleIndexById(target, sampleId);
    if (matchedIndex) {
      const newSamples = target.getSamples().update(matchedIndex, () => newSample);
      return target.set('tables', target.getTables()).set('samples', newSamples);
    }
    return target;
  }
}
