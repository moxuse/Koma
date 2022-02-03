import React, { useEffect } from 'react';
import Knob from '../Tools/Knob';
import ResolutionSelector from './ResolitionSelector';
import { AxisYContext } from './Context/AxisY';
import AxisYSelector from './AxisYSelector';
import { updateWaveTableByEffect } from '../../actions/waveTables';
import Table from '../../model/Table';
import Effect from '../../model/Effect';
import { connect } from 'react-redux';
import styled from 'styled-components';

const SelectorList = styled.ul`
`;

export interface Spec {
  type: 'linear' | 'exp';
  default: number;
  min: number;
  max: number;
}
export const RateSpec: Spec = {
  type: 'linear',
  default: 1,
  min: -3,
  max: 3,
};
export const PanSpec: Spec = {
  type: 'linear',
  default: 0,
  min: -1,
  max: 1,
};
export const GainSpec: Spec = {
  type: 'exp',
  default: 0,
  min: 0,
  max: 8,
};
export const DurSpec: Spec = {
  type: 'linear',
  default: 0.1,
  min: 0.01,
  max: 2,
};
export const TrigSpec: Spec = {
  type: 'exp',
  default: 4,
  min: 0.5,
  max: 40,
};

const ToolsList = styled.ul`
`;

const Tools = ({ table, effect, handleUpdateAxisY }: {
  table: Table; effect: Effect; handleUpdateAxisY: any;
}) => {
  const { axisY } = React.useContext(AxisYContext);
  const getMode = () => {
    return table.getMode();
  };

  useEffect(() => {
    console.log('change axisY', axisY);
    const newEff = effect.set('axisY', axisY);
    handleUpdateAxisY(table, newEff);
  }, [table, effect, axisY]);

  return (
    <>
      {getMode() === 'normal' ? (
        <ToolsList key={`tools-normal-${ table.getId()}`}>
          <Knob
            id={`${table.getEffect() }-rate`}
            label="rate"
            value={effect.getRate()}
            spec={RateSpec}
          />
          <Knob
            id={`${table.getEffect() }-pan`}
            label="pan"
            value={effect.getPan()}
            spec={PanSpec}
          />
          <Knob
            id={`${table.getEffect() }-gain`}
            label="gain"
            value={effect.getGain()}
            spec={GainSpec}
          />
        </ToolsList>)
        :
        (
          <ToolsList key={`tool-grain-${table.getId()}`}>
            <li>
              <SelectorList>
                <ResolutionSelector />
                <AxisYSelector />
              </SelectorList>
            </li>
            <Knob
              id={`${table.getEffect() }-trig`}
              label="trig"
              value={effect.getTrig()}
              spec={TrigSpec}
            />
            <Knob
              id={`${table.getEffect() }-duration`}
              label="dur"
              value={effect.getDuration()}
              spec={DurSpec}
            />
          </ToolsList>
        )
      }
    </>
  );
};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch: any) {
  return {
    handleUpdateAxisY: (table: Table, effect: Effect) => dispatch(updateWaveTableByEffect(table, effect)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Tools);

