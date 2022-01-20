
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import Table, { Slice } from '../../model/Table';
import Sample from '../../model/Sample';
import Effect from '../../model/Effect';
import { ToolsContextProvider } from '../Tools/Context/';
import Graph from './Graph';
import GrainEditor from '../Tools/GrainEditor';
import Tools from '../Tools';
import styled, { css, keyframes } from 'styled-components';
import { allocReadBuffer } from '../../actions/buffer';
import { player } from '../../actions/buffer/player';
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
    max-height: 14px;
    overflow: hidden;
    display: inline-flex;
    flex-direction: column;
  }
`;

const WaveTableHeader = styled.div`
  max-width: 90px;
  p {
    word-wrap: break-word;
  }
  ul {
    height: 30%;
    decolation: none;
  }
`;

const WaveTableChannel = styled.p`
  
  font-size: 16px;
  color: #fff;

  ${(props: { triggered: boolean }) => props.triggered && css`
    animation: ${fadeOut} .125s ease-in-out;
  `}
`;

const WaveTableName = styled.p`
font-size: 13px;
  color: #888;
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

const fadeOut = keyframes`
  from {
    background-color: #f80;
  }
  to {
    background-color: #2C2C2C;
  }
`;

const WaveTable = ({
  channel,
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
  onMDIDRecieveAtChannel,
  error
}: {
    channel: number,
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
    onMDIDRecieveAtChannel: number | undefined,
    error: Error
  }): JSX.Element => {
  const [currentBufnum, setCurrentBufnum] = useState<number | undefined>(undefined);
  const [slice, setSlice] = useState<Slice | undefined>(undefined);
  const [triggered , setTriggered] = useState<boolean>(false);
  const [playButtonActive, setPlayButtonActive] = useState<boolean>(false);

  useEffect(() => {
    const b = onMDIDRecieveAtChannel === channel;
    if (b) {
      setTriggered(b);
    }
    setTimeout(() => {
      setTriggered(false);
    }, 250);
  }, [channel, onMDIDRecieveAtChannel]);
  
  const clickPlay = useCallback(() => {
    handlePlayer(table.getMode(), currentBufnum, slice, effect);
  }, [currentBufnum, slice, effect, table]);

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
        <WaveTableChannel triggered={triggered}>{channel + `ch`}</WaveTableChannel>
        <WaveTableName>{table.getName()}</WaveTableName>        
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
  { player, midiAssign } : any
) {
  return {
    isPlaying: player.isPlaying,
    playerBufnum: player.bufnum,
    error: player.error,
    onMDIDRecieveAtChannel: midiAssign.channel
  };
};

function mapDispatchToProps(dispatch: any) {
  return {
    handlePlayer: (mode: TableMode, bufnum: number, slice: Slice, effect: Effect) => dispatch(player(mode, bufnum, slice, effect)),
    deleteHandler: (table: Table, sample: Sample, effect: Effect) => dispatch(deleteWaveTable(table, sample, effect)),
    handleUpdateTable: (table: Table) => dispatch(updateWaveTableByTable(table)),
    allocBuffer: (bufnum: number, sample: Sample) => dispatch(allocReadBuffer(bufnum, sample))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WaveTable);
