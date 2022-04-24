
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import Table, { Slice } from '../../model/Table';
import Sample, { SampleState } from '../../model/Sample';
import Effect from '../../model/Effect';
import { ResolutionContextProvider } from '../Tools/Context/Resolution';
import Graph from './Graph';
import GrainEditor from '../Tools/GrainEditor';
import Tools from '../Tools';
import styled, { css, keyframes } from 'styled-components';
import { allocReadBuffer } from '../../actions/buffer';
import { loadWaveTableByDialog } from '../../actions/waveTables/byDialog';
import { player as Player } from '../../actions/buffer/player';
import { deleteWaveTable, updateWaveTableByTable } from '../../actions/waveTables';
import { startRecord, stopRecord } from '../../actions/buffer/record';

const RECORD_SAMPLE_PATH = '/Users/moxuse/Desktop/';

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
    display: inline-flex;
    flex-direction: row;
    align-items: center
  }
`;

const WaveTableHeader = styled.div`
  max-width: 90px;
  p {
    margin: 4px 4px 0;
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
  flex-direction: row;
  font-size: 15px;
  color: #888;
  
  .button {
    color: #fff;
  }
`;

const RecordButton = styled.span`
  
  .button-item {
    color: #fff;
    margin-left: 4px;
  }
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
  margin-right: 3px;
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
  allocBuffer,
  handleLoadWaveTable,
  handleStartRecord,
  handleStopRecord,
  booted,
  sampleState,
  onMDIDReceiveAtChannel,
}: {
  channel: number;
  table: Table;
  sample: Sample;
  effect: Effect;
  bufferData: Float32Array | undefined;
  deleteHandler: any;
  allocBuffer: any;
  handleLoadWaveTable: any;
  booted: boolean;
  handlePlayer: any;
  handleUpdateTable: any;
  handleStartRecord: any;
  handleStopRecord: any;
  sampleState: SampleState;
  onMDIDReceiveAtChannel: number | undefined;

}): JSX.Element => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
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

  const toggleIsRecording = useCallback(() => {
    setIsRecording(!isRecording);
  }, [isRecording]);

  useEffect(() => {
    setCurrentBufnum(table.getBufnum());
    setSlice(table.getSlice());
  }, [table]);

  useEffect(() => {
    if (booted && sampleState === 'NOT_ALLOCATED') {
      allocBuffer(currentBufnum, sample);
    }
  }, [booted, sampleState, currentBufnum]);

  const composeGraph = useMemo(() => {
    return (
      <Graph id={table.getId()} bufferData={bufferData!} slice={table.getSlice()} sampleState={sampleState} />
    );
  }, [table, bufferData, sampleState]);

  const recordButtons = useMemo(() => {
    return (
      <RecordButton>
        {isRecording
          ? (<span className="button-item" onClick={() => { handleStopRecord(table, sample, `${RECORD_SAMPLE_PATH}${table.id}.wav`); toggleIsRecording(); }}>{'[■]'}</span>)
          : (<span className="button-item" onClick={() => { handleStartRecord(table, sample, `${RECORD_SAMPLE_PATH}${table.id}.wav`); toggleIsRecording(); }}>{'[●]'}</span>)
        }
      </RecordButton>
    );
  }, [isRecording, handleStartRecord, handleStopRecord, toggleIsRecording, sample, table]);

  const loadTaleButton = useMemo(() => {
    return (<span className={'button'} onClick={() => { handleLoadWaveTable(table); }} >{'[+]'}</span>);
  }, [table, handleLoadWaveTable]);

  return (
    <WaveTableContainer key={table.getId()}>
      <StyledButton isPlaying={playButtonActive} onClick={clickPlay}>
        {'[ > ]'}
      </StyledButton>
      <WaveTableHeader>
        <WaveTableChannel triggered={triggered}>{`ch${channel}`}</WaveTableChannel>
        <WaveTableName>
          {sampleState === 'EMPTY' || sampleState === 'UPDATING'
            ? (<div>{loadTaleButton}{recordButtons}</div>)
            : table.getName()
          }
        </WaveTableName>
        <WaveTableModeList>
          <WaveTableModeSelector onClick={setModeNormal} selected={table.getMode() === 'normal'}>[N]</WaveTableModeSelector>
          <WaveTableModeSelector onClick={setModeGrain} selected={table.getMode() === 'grain'}>[G]</WaveTableModeSelector>
        </WaveTableModeList>
      </WaveTableHeader>
      <ResolutionContextProvider>
        <div>
          {<GrainEditor table={table} effect={effect} isLoaded={sampleState === 'ALLOCATED'} />}
          {sampleState !== 'NOT_ALLOCATED' ?
            composeGraph
            : <div>{'drag'}</div>
          }
        </div>
        <Tools table={table} effect={effect} isLoaded={sampleState === 'ALLOCATED'} />
      </ResolutionContextProvider>
      <StyledButton isPlaying={playButtonActive} onClick={deleTable}>
        {'[ x ]'}
      </StyledButton>
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
    allocBuffer: (bufnum: number, sample: Sample) => dispatch(allocReadBuffer(bufnum, sample)),
    handleLoadWaveTable: (table: Table) => dispatch(loadWaveTableByDialog(table)),
    handleStartRecord: (table: Table, sample: Sample, writePath: string) => dispatch(startRecord(table, sample, writePath)),
    handleStopRecord: (table: Table, sample: Sample, writePath: string) => dispatch(stopRecord(table, sample, writePath)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WaveTable);
