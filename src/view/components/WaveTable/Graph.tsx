import React, { useEffect, useRef, useState } from 'react';
import Table from '../../model/Table';
import styled from 'styled-components';

const GraphConatainer = styled.div`
  margin: 2px;
  width: 180px;
  height: 80px;
`;

const Graph = ({ table }: { table: Table }): JSX.Element => {
  const [context,setContext] = useState<CanvasRenderingContext2D>()
  const [buffer, setBuffer] = useState<Float32Array>();
  const graphRef = useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    if (graphRef.current) {
      const canvasContext = graphRef.current.getContext("2d") as CanvasRenderingContext2D;
      setContext(canvasContext)
    }
  },[])
  useEffect(() => {
    if (table.buffer) {
      const current = table.buffer;
      if (current && context) {
        setBuffer(current);
        context.fillStyle = 'green';
        buffer?.forEach((val, i) => context.fillRect(i * 10, 60, 10, val * 10));
      }
    }
  }, [buffer, context])
  return (
    <GraphConatainer>
      <canvas width="180" height="80" ref={graphRef}></canvas>
    </GraphConatainer>
  )
}

export default Graph;
