import React, { useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components';
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

const AxisYSelector = ({ value, onChange }: { value: AxisYType; onChange: (value: string) => void }) => {
  console.log(value);
  // const { setAxisY } = useContext(AxisYContext);
  const selector = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (selector.current) {
      selector.current.selectedIndex = value === 'rate' ? 0 : 1;
    }
  }, []);

  const onHandleChange = useCallback((e: React.ChangeEvent) => {
    const target: HTMLSelectElement = e.target as HTMLSelectElement;
    console.log('===============react onChange change', target.value);
    onChange(target.value);
  }, []);

  return (
    <>
      <AxisYSelectorList>
        <AxisYSelectorLabel>y-axis</AxisYSelectorLabel>
        <AxisYSelectorEl ref={selector} onChange={onHandleChange} name="axis-y-selector">
          <option value="rate">rate</option>
          <option value="dur">dur</option>
        </AxisYSelectorEl>
      </AxisYSelectorList>
    </>
  );
};

export default AxisYSelector;
