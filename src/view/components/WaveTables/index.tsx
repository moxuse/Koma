import React, { useEffect, useState } from 'react';
import WaveTable from '../WaveTable';
import DropSection from '../DropSection';
import TableList from '../../model/TableList';
import Table from '../../model/Table';
import { connect } from 'react-redux';
// import { loadWaveTableByDialog } from '../../actions/loadWaveTable/ByDialog';

import styled from 'styled-components';

const WaveTableContainer = styled.div`
  width: 100%;
  ul {
    padding: 4px;
  }
`;

const WaveTableList = styled.ul`
  margin: 0;
  padding: 0px;
`;

const WaveTables = (
  { isFetching, tables }: {
    isFetching?: boolean,
    tables: TableList,
  }): JSX.Element => {
  
  const getBufferData = (tables: TableList, table: Table): Float32Array | undefined => {
    return tables.getBufferDataForSampleId(table.getSample());
  }
  const getTables = () => {
    return (
      (!isFetching) && tables ? tables.getTables()?.map((table: Table) => {
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
        <WaveTableList>        
          {getTables()}        
        </WaveTableList>
      </DropSection>
    </WaveTableContainer>
  );
};

function mapStateToProps(
  { waveTables } : any
) {
  return {
    isFetching: waveTables.isFetching,
    tables: waveTables.tables,
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    // handleLoadWaveTableByDialog: () => dispatch(loadWaveTableByDialog())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WaveTables)
