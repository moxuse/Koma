import React, { useContext, useCallback } from 'react';
import styled from 'styled-components';
import { AxisYContext } from './Context/AxisY';
import { AxisYType } from '../../model/Effect';


const AxisYSelectorList = styled.li`
  width: 50px;
  display: inline-flex;
  height: 100%;
  flex-direction: column;
`;

const AxisYSelectorLabel = styled.div`
  color: #666;
  height: 30%;
  margin: 0;
`;

const AxisYSelectorEl = styled.select`
  width: 50px;
  color: #fff;
  height: 40%;
  background-color: #333;
`;

const AxisYSelector = () => {
  const { axisY, setAxisY } = useContext(AxisYContext);

  const onChange = useCallback((e: React.ChangeEvent) => {
    const target: HTMLSelectElement = e.target as HTMLSelectElement;
    setAxisY(target.value as AxisYType);
  }, [axisY]);

  return (
    <AxisYSelectorList>
      <AxisYSelectorLabel>y-axis</AxisYSelectorLabel>
      <AxisYSelectorEl onChange={onChange} name="axis-y-selector">
        <option value="rate">rate</option>
        <option value="dur">dur</option>
      </AxisYSelectorEl>
    </AxisYSelectorList>
  );
};

export default AxisYSelector;
