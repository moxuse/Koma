import React, { useEffect, useRef, useState } from 'react';
import Table from '../../model/Table';
import styled from 'styled-components';

const GraphConatainer = styled.div`
  margin: 2px;
  width: 180px;
  height: 80px;
`;

const Graph = ({ bufferData }: { bufferData: Float32Array }): JSX.Element => {
  const [context,setContext] = useState<CanvasRenderingContext2D>()
  const [buffer, setBuffer] = useState<Float32Array>();
  const graphRef = useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    if (graphRef.current) {
      setBuffer(bufferData);
      const canvasContext = graphRef.current.getContext("2d") as CanvasRenderingContext2D;
      setContext(canvasContext)
    }
  },[])
  useEffect(() => {
    if (buffer && context) {      
      context.fillStyle = 'green';
      buffer?.forEach((val, i) => context.fillRect(i * 0.125, 30, 0.125, val * 100));
    }
  }, [bufferData, context])
  return (
    <GraphConatainer>
      <canvas width="180" height="80" ref={graphRef}></canvas>
    </GraphConatainer>
  )
}

export default Graph;
