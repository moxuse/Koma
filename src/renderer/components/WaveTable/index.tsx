
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import Table, { Slice } from '../../model/Table';
import Sample from '../../model/Sample';
import Effect from '../../model/Effect';
import { ToolsContextProvider } from '../Tools/Context/';
import Graph from './Graph';
import GrainEditor from '../Tools/GrainEditor';
import Tools from '../Tools';
import styled from 'styled-components';
import { allocReadBuffer } from '../../actions/buffer';
import { player } from '../../actions/buffer/palyer';
import { deleteWaveTable, updateWaveTableByTable } from '../../actions/waveTables';

const WaveTableContainer = styled.li`
  user-select: none;
  display: flex;
  flex-direction: row;
  color: white;
  -webkit-app-region: none;
  margin: 4px 0px 4px 0px;
  width: 100%;
  p {
    width: 80px;
    height: 40%;
    display: inline-block;
    margin: 4px;
  }
`;

const WaveTableHeader = styled.div`
  p {
    word-wrap: break-word;
  }
  ul {
    height: 30%;
    decolation: none;
  }
`;

const WaveTableModeSelector = styled.li`
  cursor: pointer;
  color: ${(props: { selected: boolean }) => props.selected ? '#aaa' : '#666'};
  display: inline-block;
  margin-right: 4px;
`;

const StyledButton = styled.button`
  color: white; 
  background-color: ${(props: { isPlaying: boolean }) => props.isPlaying ? 'white' : 'gray'};
  border: 0px solid #111;
  background: #2C2C2C;
  box-shadow: inset 0px 0px 0px #0C0C0C;
`;

const WaveTable = ({
  table,
  sample,
  effect,
  bufferData,
  handlePlayer,
  handleUpdateTable,
  deleteHandler,
  allocBuffer,
  booted,
  isAllocated,
  isPlaying,
  playerBufnum,
  error
  }:{
    table: Table,
    sample: Sample,
    effect: Effect,
    bufferData: Float32Array | undefined,
    deleteHandler: any,
    allocBuffer: any,
    booted: boolean,
    handlePlayer: any,
    handleUpdateTable : any,
    isPlaying: boolean,
    isAllocated: boolean,
    playerBufnum: number,
    error: Error
  }): JSX.Element => {
  const [currentBufnum, setCurrentBufnum] = useState<number | undefined>(undefined);
  const [slice , setSlice] = useState<Slice | undefined>(undefined);
  const [playButtonActive, setPlayButtonActive] = useState<boolean>(false);
  
  const clickPlay = useCallback(() => {
    handlePlayer(currentBufnum, slice, effect);
  }, [currentBufnum, slice, effect]);

  const deleTable = useCallback(() => {
    deleteHandler(table, sample, effect)
  }, []);

  const setModeNormal = useCallback(() => {
    const newTable = table.set('mode', 'normal');
    handleUpdateTable(newTable);
  }, [table]);

  const setModeGrain = useCallback(() => {
    const newTable = table.set('mode', 'grain');
    handleUpdateTable(newTable);
  }, [table]);

  useEffect(() => {
    setCurrentBufnum(table.getBufnum());
    setSlice(table.getSlice());
  }, [table])

  useEffect(() => {
    if (booted && !isAllocated) {
      allocBuffer(currentBufnum, sample);
    }
  }, [booted, isAllocated, currentBufnum]);

  const composeGraph = useMemo(() => {
    return (
      <Graph id={table.getId()} bufferData={bufferData!} slice={table.getSlice()} />
    )
  }, [table, bufferData]);

  return (    
    <WaveTableContainer key={table.getId()}>
      {/* <p>{table.getId()}</p> */}
      <StyledButton isPlaying={playButtonActive} onClick={clickPlay}>
        {`[ > ]`}
      </StyledButton>
      <WaveTableHeader>
        <p>{table.getName()}</p>
        <ul>
          <WaveTableModeSelector onClick={setModeNormal} selected={table.getMode() === 'normal'}>[N]</WaveTableModeSelector>
          <WaveTableModeSelector onClick={setModeGrain} selected={table.getMode() === 'grain'}>[G]</WaveTableModeSelector>
        </ul>
      </WaveTableHeader>      
      {/* <p>{sample.getFilePath()}</p> */}
      <ToolsContextProvider>
        <div>
          {<GrainEditor table={table} effect={effect}></GrainEditor>}
          {bufferData ?
            composeGraph
            : <div>{`drag`}</div>
          }
        </div>
        <Tools table={table} effect={effect}></Tools>
      </ToolsContextProvider>
      <StyledButton isPlaying={playButtonActive} onClick={deleTable}>      
        {`[ x ]`}
      </StyledButton>
      {isAllocated ? (<></>) : (<p>{`not allocated yet..`}</p>)}
    </WaveTableContainer>
  );
};

function mapStateToProps(
  { player } : any
) {
  return {
    isPlaying: player.isPlaying,
    playerBufnum: player.bufnum,
    error: player.error,
  };
};

function mapDispatchToProps(dispatch: any) {
  return {
    handlePlayer: (bufnum: number, slice: Slice, effect: Effect) => dispatch(player(bufnum, slice, effect)),
    deleteHandler: (table: Table, sample: Sample, effect: Effect) => dispatch(deleteWaveTable(table, sample, effect)),
    handleUpdateTable: (table: Table) => dispatch(updateWaveTableByTable(table)),
    allocBuffer: (bufnum: number, sample: Sample) => dispatch(allocReadBuffer(bufnum, sample))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WaveTable);
