
import React from 'react';  
import { WaveTableProps } from '../WaveTables';

import styled from 'styled-components';

const WaveTableContainer = styled.div`
  width: 100%;
`;

const WaveTable = (props: WaveTableProps): JSX.Element =>  {
  return (
    <WaveTableContainer>
      { props.id }
    </WaveTableContainer>
  )
}

WaveTable.defaultProps = {
  props: { id: 'fooo' },
};

export default WaveTable;
