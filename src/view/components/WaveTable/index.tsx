
import React from 'react';
import Table from '../../model/Table';
import Graph from './Graph';
import styled from 'styled-components';

const WaveTableContainer = styled.div`
  width: 100%;
  p {
    display: inline-block;
    margin: 4px;
    width: 30%;
  }
`;

const WaveTable = ({ table }: { table: Table }): JSX.Element =>  {
  return (
    <WaveTableContainer>
      <p>{ table.id }</p>
      <p>{ table.filePath }</p>
      <Graph table={table} />
    </WaveTableContainer>
  )
}

export default WaveTable;
