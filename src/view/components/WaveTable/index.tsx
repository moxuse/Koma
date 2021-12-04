
import React from 'react';
import Table from '../../model/Table';
import Graph from './Graph';
import styled from 'styled-components';

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

const WaveTable = ({ table, bufferData }: { table: Table, bufferData: Float32Array | undefined }): JSX.Element => {
  return (
    <WaveTableContainer>
      <p>{ table.getId() }</p>
      <p>{ table.getName() }</p>
      <p>{table.getBufnum()}</p>
      { bufferData ?
        <Graph bufferData={bufferData} />
        : <div>{`drag`}</div>
      }
    </WaveTableContainer>
  )
}

export default WaveTable;
