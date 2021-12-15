import React, { useEffect, useState, useCallback } from 'react';
import WaveTable from '../WaveTable';
import DropSection from '../DropSection';
import TableList from '../../model/TableList';
import Table from '../../model/Table';
import { loadSetting, booted } from '../../actions/setting';
import { connect } from 'react-redux';
import { loadWaveTableByDialog } from '../../actions/waveTables/ByDialog';

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

const WaveTables = ({ booted, isFetching, tables, onceLiestenBooted, loadSetting }: {
  booted: boolean,
  isFetching: boolean,
  tables: TableList,
  onceLiestenBooted: any,
  loadSetting: any
}): JSX.Element => {
    // const [isAllocated, setIsAllocated] = useState<boolean>(false);
  useEffect(() => {
    onceLiestenBooted();
    loadSetting();
  }, []);

  const isAllocated = useCallback((tables: TableList, table: Table): boolean => {
    return TableList.getAllocatedSampleById(tables, table.getSample()!);
  }, [isFetching, tables])

  const getBufferData = (tables: TableList, table: Table): Float32Array | undefined => {
    return tables.getBufferDataForSampleId(table.getSample());
  }
  
  const getSample = (tables: TableList, table: Table) => {
    return TableList.getSampleById(tables, table.getSample()!)
  }

    const getTables = () => {
      return (
        ((!isFetching) && tables) ? tables.tables.map((table: Table) => {
          return (<WaveTable
            table={table}
            sample={getSample(tables, table)!}
            bufferData={getBufferData(tables, table)}
            isAllocated={isAllocated(tables, table)}
            key={table.id} />
          )
        }) : <p>{`loading...`}</p>
      )
    };
  
  return (
    <WaveTableContainer>
      <DropSection booted={booted}>
        <WaveTableList>        
          {getTables()}        
        </WaveTableList>
      </DropSection>
    </WaveTableContainer>
  );
};

function mapStateToProps(
  { waveTables, loadSetting }: any
) {
  return {
    booted: loadSetting.booted,
    isFetching: waveTables.isFetching,
    tables: waveTables.tables,
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    handleLoadWaveTableByDialog: () => dispatch(loadWaveTableByDialog()),
    loadSetting: () => dispatch(loadSetting()),
    onceLiestenBooted: () => dispatch(booted()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WaveTables)
