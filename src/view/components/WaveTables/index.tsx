import React, { useEffect, useState } from 'react';
import WaveTable from '../WaveTable';
import DropSection from '../DropSection';
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
  
  return (
    <WaveTableContainer>
      <ul>
        {(!isFetching && tables) ? tables.getTables().map((table: Table) => {
          return (<WaveTable table={table} key={table.id} />)
        }) : <p>loading...</p>}
        <DropSection />
      </ul>
    </WaveTableContainer>
  );
};

function mapStateToProps({ loadStore: { isFetching, tables } }: {loadStore:{ isFetching: boolean, tables: TableList }}) {
  console.log('in wavetables', isFetching, tables);
  return {
    isFetching: isFetching,
    tables: tables,
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    handleReadTable: () => dispatch(readTable())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WaveTables)
