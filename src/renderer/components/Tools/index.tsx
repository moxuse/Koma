import React, { useEffect, useCallback, useRef, useState } from 'react';
import Knob from '../Tools/Knob';
import Table, { Slice } from '../../model/Table';
import Effect from '../../model/Effect';
import { connect } from 'react-redux';
import { updateSlice } from '../../actions/buffer/slice';
import styled from 'styled-components';


const ToolsList = styled.ul`
`;

const Tools = ({ table, effect }: {
  table: Table, effect: Effect
}) => {
  const [editting, setEditting] = useState<boolean>(false);
  
  return (
    <>
      <ToolsList key={'tools-' + table.getId()}>
        <Knob id={table.getEffect() +  '-rate'} label="rate" value={effect.getRate()}></Knob>
        <Knob id={table.getEffect() +  '-pan'} label="pan" value={effect.getPan()}></Knob>
        <Knob id={table.getEffect() +  '-gain'} label="gain" value={effect.getGain()}></Knob>
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

