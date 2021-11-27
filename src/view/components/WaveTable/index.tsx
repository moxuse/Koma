
import React from 'react';
import Table from '../../model/Table';
import styled from 'styled-components';

const WaveTableContainer = styled.div`
  width: 100%;
`;

const WaveTable = ({ table }: { table: Table }): JSX.Element =>  {
  return (
    <WaveTableContainer>
      { table.getId() }
    </WaveTableContainer>
  )
}

export default WaveTable;
