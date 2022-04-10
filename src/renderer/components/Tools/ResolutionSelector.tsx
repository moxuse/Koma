import React, { useContext, useCallback } from 'react';
import styled from 'styled-components';
import { ResolutionContext } from './Context/Resolution';


const SelectorList = styled.li`
  width: 50px;
  display: inline-flex;
  height: 100%;
  flex-direction: column;
`;

const SelectorLabel = styled.div`
  color: #666;
  height: 30%;
  margin: 0;
`;

const SelectorEl = styled.select`
  width: 50px;
  color: #fff;
  height: 40%;
  background-color: #333;
`;

const ResolutionSelector = () => {
  const { resolution, setResolution } = useContext(ResolutionContext);

  const onChange = useCallback((e: React.ChangeEvent) => {
    const target: HTMLSelectElement = e.target as HTMLSelectElement;
    setResolution(parseInt(target.value, 10));
  }, [resolution]);

  return (
    <SelectorList>
      <SelectorLabel>res</SelectorLabel>
      <SelectorEl onChange={onChange} name="resolution-selector">
        <option value="25">0.025</option>
        <option value="50">0.05</option>
        <option value="100">0.1</option>
        <option value="250">0.25</option>
      </SelectorEl>
    </SelectorList>
  );
};

export default ResolutionSelector;
