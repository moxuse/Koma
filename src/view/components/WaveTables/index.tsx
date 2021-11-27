import React, { useEffect } from 'react';
import WaveTable from '../WaveTable';
import TableList from '../../model/TableList';
import Table from '../../model/Table';
import { connect } from 'react-redux';
import { readTable, ReadTableAction } from '../../actions/readTable';

import styled from 'styled-components';

const WaveTableContainer = styled.div`
  width: 100%;
`;

const WaveTables = (
  { isFetching, tables, handleReadTable }: {
    isFetching?: boolean,
    tables: TableList,
    handleReadTable: any
  }): JSX.Element => {
    handleReadTable();
  return (
    <WaveTableContainer>
      <ul>
      { tables.getTables().map((table: Table) => {
        return (<WaveTable table={table} key={ table.id } />)
        }) }
      </ul>
    </WaveTableContainer>
  );
};

function mapStateToProps({ tables }: {tables: TableList}) {
  return {
    tables: tables,
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    handleReadTable: () => dispatch(readTable())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WaveTables)
