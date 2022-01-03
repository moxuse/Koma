import React, { useEffect, useCallback, useRef, useState } from 'react';
import Knob from '../Tools/Knob';
import Table, { Slice } from '../../model/Table';
import Effect from '../../model/Effect';
import { connect } from 'react-redux';
import { updateSlice } from '../../actions/buffer/slice';
import styled from 'styled-components';

export type Spec = {
  type: 'linear' | 'exp'; 
  default: number;
  min: number;
  max: number;
}
export const RateSpec: Spec = {
  type: 'linear',
  default: 1,
  min: -3,
  max: 3
};
export const PanSpec: Spec = {
  type: 'linear',
  default: 0,
  min: -1,
  max: 1
};
export const GainSpec: Spec = {
  type: 'exp',
  default: 0,
  min: 0,
  max: 8
};

const ToolsList = styled.ul`
`;

const Tools = ({ table, effect }: {
  table: Table, effect: Effect
}) => {
  const [editting, setEditting] = useState<boolean>(false);
  
  return (
    <>
      <ToolsList key={'tools-' + table.getId()}>
        <Knob id={table.getEffect() + '-rate'}
          label="rate" value={effect.getRate()}
          spec={RateSpec}
        />
        <Knob id={table.getEffect() + '-pan'}
          label="pan"
          value={effect.getPan()}
          spec={PanSpec}
        />
        <Knob id={table.getEffect() + '-gain'}
          label="gain"
          value={effect.getGain()}
          spec={GainSpec}
        />
      </ToolsList>
    </>
  )
}

function mapStateToProps({}) {
  return {};
};

function mapDispatchToProps(dispatch: any) {
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tools);

