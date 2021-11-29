
import React from 'react';
import Table from '../../model/Table';
import styled from 'styled-components';

const WaveTableContainer = styled.div`
  width: 100%;
`;

const WaveTable = ({ table }: { table: Table }): JSX.Element =>  {
  return (
    <WaveTableContainer>
      <p>{ table.id }</p>
      <p>{ table.filePath }</p>
    </WaveTableContainer>
  )
}

export default WaveTable;
