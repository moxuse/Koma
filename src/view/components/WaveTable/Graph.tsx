import React, { useEffect, useRef, useState } from 'react';
import Table from '../../model/Table';
import styled from 'styled-components';

const width = 200;
const height = 60;

const GraphConatainer = styled.div`
  margin: 2px;
  width: ${width}px;
  height: ${height}px;
`;

const Graph = ({ bufferData }: { bufferData: Float32Array }): JSX.Element => {
  const [context,setContext] = useState<CanvasRenderingContext2D | null>()
  const [buffer, setBuffer] = useState<Float32Array>();
  const graphRef = useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    if (graphRef.current) {
      setBuffer(bufferData);
      const canvasContext = graphRef.current.getContext("2d");
      setContext(canvasContext);

    }
  },[])
  useEffect(() => {
    if (buffer && context) {
      context.fillStyle = 'green';
      const pixcelParSample = width / buffer.length;
      console.log(buffer.length, pixcelParSample);
      buffer?.forEach((val, i) => context.fillRect(i * pixcelParSample, height * 0.5, pixcelParSample, val * height * 0.5));
    }
  }, [bufferData, context])
  return (
    <GraphConatainer>
      <canvas width={width} height={height} ref={graphRef}></canvas>
    </GraphConatainer>
  )
}

export default Graph;
