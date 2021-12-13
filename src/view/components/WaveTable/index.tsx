
import React, { useCallback, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Table from '../../model/Table';
import Graph from './Graph';
import styled from 'styled-components';
import { player } from '../../actions/palyer';

const WaveTableContainer = styled.li`
  color: white;
  -webkit-app-region: none;
  margin: 4px 0px 4px 0px;
  width: 100%;
  p {
    display: inline-block;
    margin: 4px;
    width: 30%;
  }
`;

const PlayButton = styled.button`
  color: white;
  background-color: ${(props: { isPlaying: boolean }) => props.isPlaying ? 'white' : 'gray'};
  border: 1px solid #111;
  background: #2C2C2C;
  box-shadow: inset 1px 1px 1px #0C0C0C;
`;

const WaveTable = ({ table, bufferData, handlePlayer, isAllocated, isPlaying, playerBufnum, error }:
  {
    table: Table, bufferData: Float32Array | undefined, handlePlayer: any, isPlaying: boolean, isAllocated: boolean, playerBufnum: number, error: Error
  }): JSX.Element => {
  const [currentBufnum, setCurrentBufnum] = useState<number | undefined>(undefined);
  const [playButtonActive, setPlayButtonActive] = useState<boolean>(false);
  
  const clickPlay = useCallback(() => {
    handlePlayer(table.getBufnum());
  }, []);
  
  useEffect(() => {
    setCurrentBufnum(table.getBufnum());
  }, [table])

  /* 
  TODO buttonstyling
  useEffect(() => {
    setPlayButtonActive(isPlaying && (currentBufnum === playerBufnum));
  }, [isPlaying, playerBufnum, currentBufnum]);
  console.log('playButtonActive', playButtonActive)
  */
  return (
    <WaveTableContainer key={table.getId()}>
      {/* <p>{table.getId()}</p> */}
      <PlayButton isPlaying={playButtonActive} onClick={clickPlay}>
        {`>`}
      </PlayButton>
      <p>{table.getName()}</p>
      <p>{table.getBufnum()}</p>
      {bufferData ?
        <Graph bufferData={bufferData} />
        : <div>{`drag`}</div>
      }
      { isAllocated ? (<></>) : (<p>{`not allocated yet..`}</p>)}
    </WaveTableContainer>
  )
};

function mapStateToProps(
  { player } : any
) {  return {
    isPlaying: player.isPlaying,
    playerBufnum: player.bufnum,
    error: player.error
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    handlePlayer: (bufnum: number) => dispatch(player(bufnum))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WaveTable)

