
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import Table, { Slice } from '../../model/Table';
import Sample from '../../model/Sample';
import Effect from '../../model/Effect';
import Graph from './Graph';
import Tools from '../Tools';
import styled from 'styled-components';
import { allocReadBuffer } from '../../actions/buffer';
import { player } from '../../actions/buffer/palyer';
import { deleteWaveTable } from '../../actions/waveTables';

const WaveTableContainer = styled.li`
  user-select: none;
  display: flex;
  flex-direction: row;
  color: white;
  -webkit-app-region: none;
  margin: 4px 0px 4px 0px;
  width: 100%;
  p {
    width: 40px;
    display: inline-block;
    margin: 4px;
  }
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
    isPlaying: boolean,
    isAllocated: boolean,
    playerBufnum: number,
    error: Error
  }): JSX.Element => {
  const [currentBufnum, setCurrentBufnum] = useState<number | undefined>(undefined);
  const [slice , setSlice] = useState<Slice | undefined>(undefined);
  const [playButtonActive, setPlayButtonActive] = useState<boolean>(false);
  
  const clickPlay = useCallback(() => {
    console.log(effect);
    handlePlayer(currentBufnum, slice, effect);
  }, [currentBufnum, slice, effect]);

  const deleTable = useCallback(() => { 
    deleteHandler(table, sample, effect)
  }, [])

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
      <p>{table.getName()}</p>
      {/* <p>{sample.getFilePath()}</p> */}
      {bufferData ?
        composeGraph
        : <div>{`drag`}</div>
      }
      <Tools table={table} effect={effect}></Tools>
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
    allocBuffer: (bufnum: number, sample: Sample) => dispatch(allocReadBuffer(bufnum, sample))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WaveTable);
