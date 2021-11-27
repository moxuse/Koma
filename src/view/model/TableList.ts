import { List, Record } from "immutable";
import Table from './Table';


const DefaultTableList = {
  tables: List<Table>()
}

export default class TableList extends Record(DefaultTableList) {
  constructor(arg: List<Table>) {
    super();
    return this.set('tables', List(arg))
  }

  getTables() {
    return this.get('tables');
  }

  static newFromTable(tables: List<Table>) {
    return new TableList(tables);
  }

  static getTableListById(target: TableList, id: string) {
    return new TableList(target.getTables().filter(table => {
      return table.getId() !== id
    }));
  }
}
