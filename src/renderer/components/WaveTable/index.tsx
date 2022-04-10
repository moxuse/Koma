
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import Table, { Slice } from '../../model/Table';
import Sample from '../../model/Sample';
import Effect from '../../model/Effect';
import { ResolutionContextProvider } from '../Tools/Context/Resolution';
import Graph from './Graph';
import GrainEditor from '../Tools/GrainEditor';
import Tools from '../Tools';
import styled, { css, keyframes } from 'styled-components';
// import { allocReadBuffer } from '../../actions/buffer';
import { player as Player } from '../../actions/buffer/player';
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
    decoration: none;
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

const WaveTableModeList = styled.ul`
  display: flex;
  align-items: center;
  padding: 0 4px 0 4px;
  list-style-type: none;
`;

const WaveTableModeSelector = styled.li`
  cursor: pointer;
  color: ${(props: { selected: boolean }) => (props.selected ? '#aaa' : '#666')};
  display: inline-block;
  margin-right: 4px;
`;

const StyledButton = styled.button`
  color: white; 
  background-color: ${(props: { isPlaying: boolean }) => (props.isPlaying ? 'white' : 'gray')};
  border: 0px solid #111;
  background: #000;
  box-shadow: inset 0px 0px 0px #0C0C0C;
`;

const fadeOut = keyframes`
  from {
    background-color: #f80;
  }
  to {
    background-color: #000;
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
  // allocBuffer,
  booted,
  isAllocated,
  onMDIDReceiveAtChannel,
}: {
  channel: number;
  table: Table;
  sample: Sample;
  effect: Effect;
  bufferData: Float32Array | undefined;
  deleteHandler: any;
  // allocBuffer: any;
  booted: boolean;
  handlePlayer: any;
  handleUpdateTable: any;
  isAllocated: boolean;
  onMDIDReceiveAtChannel: number | undefined;
}): JSX.Element => {
  const [currentBufnum, setCurrentBufnum] = useState<number | undefined>(undefined);
  const [slice, setSlice] = useState<Slice | undefined>(undefined);
  const [triggered, setTriggered] = useState<boolean>(false);
  const [playButtonActive] = useState<boolean>(false);
  useEffect(() => {
    const b = onMDIDReceiveAtChannel === channel;
    if (b) {
      setTriggered(b);
    }
    setTimeout(() => {
      setTriggered(false);
    }, 250);
  }, [channel, onMDIDReceiveAtChannel]);

  const clickPlay = useCallback(() => {
    handlePlayer(table.getMode(), currentBufnum, slice, effect);
  }, [table, currentBufnum, slice, effect]);

  const deleTable = useCallback(() => {
    deleteHandler(table, sample, effect);
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
  }, [table]);

  useEffect(() => {
    if (booted && !isAllocated) {
      // allocBuffer(currentBufnum, sample);
    }
  }, [booted, isAllocated, currentBufnum]);

  const composeGraph = useMemo(() => {
    return (
      <Graph id={table.getId()} bufferData={bufferData!} slice={table.getSlice()} />
    );
  }, [table, bufferData]);
  console.log('~~~~~~~~~~~****', bufferData, table, sample, effect);
  return (
    <WaveTableContainer key={table.getId()}>
      <StyledButton isPlaying={playButtonActive} onClick={clickPlay}>
        {'[ > ]'}
      </StyledButton>
      <WaveTableHeader>
        <WaveTableChannel triggered={triggered}>{`ch${ channel}`}</WaveTableChannel>
        <WaveTableName>{table.getName()}</WaveTableName>
        <WaveTableModeList>
          <WaveTableModeSelector onClick={setModeNormal} selected={table.getMode() === 'normal'}>[N]</WaveTableModeSelector>
          <WaveTableModeSelector onClick={setModeGrain} selected={table.getMode() === 'grain'}>[G]</WaveTableModeSelector>
        </WaveTableModeList>
      </WaveTableHeader>
      <ResolutionContextProvider>
        <div>
          {<GrainEditor table={table} effect={effect} isLoaded={sample.getAllocated()} />}
          {bufferData ?
            composeGraph
            : <div>{'drag'}</div>
          }
        </div>
        <Tools table={table} effect={effect} isLoaded={sample.getAllocated()} />
      </ResolutionContextProvider>
      <StyledButton isPlaying={playButtonActive} onClick={deleTable}>
        {'[ x ]'}
      </StyledButton>
      {isAllocated ? (<></>) : (<p>{'not allocated yet..'}</p>)}
    </WaveTableContainer>
  );
};

function mapStateToProps(
  { player, midiAssign }: any,
) {
  return {
    isPlaying: player.isPlaying,
    playerBufnum: player.bufnum,
    error: player.error,
    onMDIDReceiveAtChannel: midiAssign.channel,
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    handlePlayer: (mode: TableMode, bufnum: number, slice: Slice, effect: Effect) => dispatch(Player(mode, bufnum, slice, effect)),
    deleteHandler: (table: Table, sample: Sample, effect: Effect) => dispatch(deleteWaveTable(table, sample, effect)),
    handleUpdateTable: (table: Table) => dispatch(updateWaveTableByTable(table)),
    // allocBuffer: (bufnum: number, sample: Sample) => dispatch(allocReadBuffer(bufnum, sample)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WaveTable);
