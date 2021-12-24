import React, { useEffect, useRef, useState, useCallback} from 'react';
import Table from '../../model/Table';
import { Slice } from '../../model/Table';
import styled from 'styled-components';

const width = 150;
const height = 60;

const GraphConatainer = styled.div`
  margin: 2px 0 2px 0;
  display: inline-table;
  background-color: #1C1C1C;
  width: ${width}px;
  height: ${height}px;
`;

const Graph = ({ id, bufferData, slice }: { id: string, bufferData: Float32Array, slice: Slice | undefined }): JSX.Element => {
  const [context, setContext] = useState<CanvasRenderingContext2D | null>()
  const [buffer, setBuffer] = useState<Float32Array>();
  const graphRef = useRef<HTMLCanvasElement>(null);

  const inRangeSlice = (x: number, slice: Slice) => {
    return (slice.begin * width < x) && (slice.end * width > x);
  }

  useEffect(() => {
    if (graphRef.current) {
      setBuffer(bufferData);
      const canvasContext = graphRef.current.getContext("2d");
      setContext(canvasContext);
    };
  }, []);
  useEffect(() => {
    if (buffer && context) {
      context.clearRect(0, 0, width, height);
      const pixcelParSample = width / buffer.length;
      buffer?.forEach((val, i) => {
        if (slice && inRangeSlice(i * pixcelParSample, slice)) {
          context.fillStyle = '#0ff';
        } else { 
          context.fillStyle = '#fff';
        }
        context.fillRect(
          i * pixcelParSample,
          height * 0.5,
          pixcelParSample,
          val * height * 0.5
        );
      })
    };
  }, [bufferData, context, slice]);

  return (
    <GraphConatainer>
      <canvas id={id} width={width} height={height} ref={graphRef}></canvas>
    </GraphConatainer>
  );
};

export default Graph;
