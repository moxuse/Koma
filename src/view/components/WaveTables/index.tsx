import React, { useEffect } from 'react';
import WaveTable from '../WaveTable';

import styled from 'styled-components';

const WaveTableContainer = styled.div`
  width: 100%;
`;

export type WaveTableProps = {
  id: string
};

const WaveTables = ({ props }: { props: Array<WaveTableProps> }): JSX.Element => {
  return (
    <WaveTableContainer>
      <ul>
      { props.map(wave => {
          return (<WaveTable {...wave} key={ wave.id } />)
        }) }
      </ul>
    </WaveTableContainer>
  );
};

WaveTables.defaultProps = {
  props: [{ id: 'fooo' }],
};

export default WaveTables;
