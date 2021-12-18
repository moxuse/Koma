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

const PlusButton = styled.button`
  color: white;
  border: 1px solid #111;
  background: #2C2C2C;
  box-shadow: inset 1px 1px 1px #0C0C0C;
`;

const WaveTables = ({ booted, isFetching, tables, onceLiestenBooted, loadSetting, handlePlusButton }: {
  booted: boolean,
  isFetching: boolean,
  tables: TableList,
  onceLiestenBooted: any,
  loadSetting: any,
  handlePlusButton: any
}): JSX.Element => {
    // const [isAllocated, setIsAllocated] = useState<boolean>(false);
  useEffect(() => {
    onceLiestenBooted();
    loadSetting();
  }, []);

  const onClickePlusButton = useCallback(() => {
    handlePlusButton();
  }, []);

  const isAllocated = useCallback((tables: TableList, table: Table): boolean => {
    return TableList.getAllocatedSampleById(tables, table.getSample()!);
  }, [isFetching, tables]);

  const getBufferData = (tables: TableList, table: Table): Float32Array | undefined => {
    return tables.getBufferDataForSampleId(table.getSample());
  };
  
  const getSample = (tables: TableList, table: Table) => {
    return TableList.getSampleById(tables, table.getSample()!)
  };

  const getTables = () => {
    
    return (
      (tables) ? tables.tables.map((table: Table) => {
        return (<WaveTable
          table={table}
          sample={getSample(tables, table)!}
          bufferData={getBufferData(tables, table)}
          isAllocated={isAllocated(tables, table)}
          booted={booted}
          key={table.id} />
        );
      }) : <p>{`loading...`}</p>
    );
  };
  
  return (
    <WaveTableContainer>
      <DropSection booted={booted}>
        <WaveTableList>        
          {getTables()} 
        </WaveTableList>
        {booted ? (<PlusButton onClick={onClickePlusButton}>{'[ + ]'}</PlusButton>) : `synth server not booted`}
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
  };
};

function mapDispatchToProps(dispatch: any) {
  return {
    handlePlusButton: () => dispatch(loadWaveTableByDialog()),
    loadSetting: () => dispatch(loadSetting()),
    onceLiestenBooted: () => dispatch(booted()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WaveTables);
