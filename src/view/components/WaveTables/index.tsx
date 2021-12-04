import React, { useEffect, useState } from 'react';
import WaveTable from '../WaveTable';
import DropSection from '../DropSection';
import TableList from '../../model/TableList';
import Table from '../../model/Table';
import { connect } from 'react-redux';
import { loadWaveTableByDialog } from '../../actions/loadWaveTableByDialog';

import styled from 'styled-components';

const WaveTableContainer = styled.div`
  width: 100%;
  ul {
    padding: 4px;
  }
`;

const WaveTables = (
  { isFetching, tables, handleLoadWaveTableByDialog }: {
    isFetching?: boolean,
    tables: TableList,
    handleLoadWaveTableByDialog: any
  }): JSX.Element => {
  
  const getBufferData = (tables: TableList, table: Table): Float32Array | undefined => {
    return tables.getBufferDataForSampleId(table.getSample());
  }
  const getTables = () => {
    return (
      !isFetching && tables ? tables.getTables().map((table: Table) => {
        return (<WaveTable
          table={table}
          bufferData={getBufferData(tables, table)}
          key={table.id} />
        )
      }) : <p>{`loading...`}</p>
    )
  };

  return (
    <WaveTableContainer>
      <DropSection>
        <ul>        
          {getTables()}        
        </ul>
      </DropSection>
    </WaveTableContainer>
  );
};

function mapStateToProps(
  { waveTable } : any
) {
  return {
    isFetching: waveTable.isFetching,
    tables: waveTable.tables,
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    handleLoadWaveTableByDialog: () => dispatch(loadWaveTableByDialog())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WaveTables)
