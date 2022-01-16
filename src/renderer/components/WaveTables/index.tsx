import React, { useEffect, useCallback } from 'react';
import WaveTable from '../WaveTable';
import DropSection from '../DropSection';
import TableEditor from '../TableEditor';
import ToolsEditor from '../Tools/Editor';
import TableList from '../../model/TableList';
import Table from '../../model/Table';
import { loadSetting, booted } from '../../actions/setting';
import { connect } from 'react-redux';
import { loadWaveTableByDialog } from '../../actions/waveTables/ByDialog';
import { openStore } from '../../actions/waveTables/openStore';

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

const Button = styled.button`
  color: white;
  border: 0px solid #111;
  background: #2C2C2C;
  box-shadow: inset 0px 0px 0px #0C0C0C;
`;

const WaveTables = ({
  booted,
  isFetching,
  tables,
  onceLiestenBooted,
  loadSetting,
  handleOpenButton,
  handlePlusButton
}: {
  booted: boolean,
  isFetching: boolean,
  tables: TableList,
  onceLiestenBooted: any,
  loadSetting: any,
  handleOpenButton: any,
  handlePlusButton: any
}): JSX.Element => {
    // const [isAllocated, setIsAllocated] = useState<boolean>(false);
  useEffect(() => {
    onceLiestenBooted();
    loadSetting();
  }, []);

  const onClickeOpenButton = useCallback(() => handleOpenButton(), []);
  const onClickeSaveButton = useCallback(() => window.api.saveStore(), []);

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

  const getEffect = (tables: TableList, table: Table) => {
    return TableList.getEffectById(tables, table.getEffect()!)
  };

  const getTables = () => {
    return (
      (tables) ? tables.getTables().map((table: Table) => {
        return (<WaveTable
          key={table.getId()}
          table={table}
          sample={getSample(tables, table)!}
          effect={getEffect(tables, table)!}
          bufferData={getBufferData(tables, table)}
          isAllocated={isAllocated(tables, table)}
          booted={booted} />
        );
      }) : <p>{`loading...`}</p>
    );
  };

  return (
    <WaveTableContainer>
      {booted ? (<>
        <Button onClick={onClickeSaveButton}>{`[ _ ]`}</Button>
        <Button onClick={onClickeOpenButton}>{`[ ^ ]`}</Button>
        </>
      ) : <></>}
      <DropSection booted={booted}>
        <TableEditor tables={tables}>
          <ToolsEditor tables={tables}>
            <WaveTableList>        
              {getTables()} 
            </WaveTableList>
          </ToolsEditor>
        </TableEditor>
        {booted ? (<Button onClick={onClickePlusButton}>{'[ + ]'}</Button>) : `synth server not booted`}        
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
    handleOpenButton: () => dispatch(openStore()),
    handlePlusButton: () => dispatch(loadWaveTableByDialog()),
    loadSetting: () => dispatch(loadSetting()),
    onceLiestenBooted: () => dispatch(booted()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WaveTables);
