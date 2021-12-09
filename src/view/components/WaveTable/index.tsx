
import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import Table from '../../model/Table';
import Graph from './Graph';
import styled from 'styled-components';
import { player } from '../../actions/palyer';

const WaveTableContainer = styled.li`
  background-color: gray;
  margin: 4px 0px 4px 0px;
  width: 100%;
  p {
    display: inline-block;
    margin: 4px;
    width: 30%;
  }
`;

const PlayButton = styled.button`
  background-color: ${(props: {isPlaying: boolean}) => props.isPlaying ? 'white': 'gray'};
`;

const WaveTable = ({ table, bufferData, handlePlayer, isPlaying, playerBufnum, error }:
  {
    table: Table, bufferData: Float32Array | undefined, handlePlayer: any, isPlaying: boolean, playerBufnum: number, error: Error
  }): JSX.Element => {
  
  const clickPlay = useCallback(() => {
    handlePlayer(table.getBufnum());
  },[]);

  return (
    <WaveTableContainer>
      <p>{table.getId()}</p>
      <p>{table.getName()}</p>
      <p>{table.getBufnum()}</p>
      {bufferData ?
        <Graph bufferData={bufferData} />
        : <div>{`drag`}</div>
      }
      <PlayButton isPlaying={isPlaying} onClick={clickPlay}>
        {`Play`}
      </PlayButton>
    </WaveTableContainer>
  )
};

function mapStateToProps(
  { player } : any
) {
  return {
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

