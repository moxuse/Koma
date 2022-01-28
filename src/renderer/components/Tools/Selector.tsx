import React, { useContext, useCallback } from 'react'
import styled from 'styled-components';
import { ToolsContext } from './Context';


const SelctorList = styled.li`
  width: 50px;
  display: inline-flex;
  height: 100%;
  flex-direction: column;
`;

const SelctorLabel = styled.div`
  color: #666;
  height: 30%;
  margin: 0;
`;

const SelctorEl = styled.select`
  width: 50px;
  color: #fff;
  height: 40%;
  background-color: #333;
`;

const Selector = () => { 
  const { resolution, setResolution } = useContext(ToolsContext);

  const onChange = useCallback((e: React.ChangeEvent) => { 
    const target: HTMLSelectElement = e.target as HTMLSelectElement;
    setResolution(parseInt(target.value));
  },[resolution])

  return (<SelctorList>
      <SelctorLabel>res</SelctorLabel>
      <SelctorEl onChange={onChange} name="resolution-selector">
        <option value="25">0.025</option>
        <option value="50">0.05</option>
        <option value="100">0.1</option>
        <option value="250">0.25</option>
      </SelctorEl>
  </SelctorList>)
}

export default Selector;
