import React, { useEffect, useRef, useState } from 'react';
import { Slice } from '../../model/Table';
import styled from 'styled-components';
import { SampleState } from '../../model/Sample';

const width = 150;
const height = 60;

const GraphContainer = styled.div`
  z-index: 1;
  margin: 2px 0 2px 0;
  display: inline-table;
  width: ${width}px;
  height: ${height}px;
  canvas {
    background-color: #222;
  }
`;

const Graph = ({ id, bufferData, slice, sampleState }: {
  id: string; bufferData: Float32Array; slice: Slice | undefined; sampleState: SampleState;
}): JSX.Element => {
  const [context, setContext] = useState<CanvasRenderingContext2D | null>();
  const [buffer, setBuffer] = useState<Float32Array>();
  const graphRef = useRef<HTMLCanvasElement>(null);

  const inRangeSlice = (x: number, slice_: Slice) => {
    return (slice_.begin * width < x) && (slice_.end * width > x);
  };

  useEffect(() => {
    if (graphRef.current) {
      setBuffer(bufferData);
      const canvasContext = graphRef.current.getContext('2d');
      setContext(canvasContext);
    }
  }, []);
  useEffect(() => {
    if (sampleState === 'ALLOCATED') {
      setBuffer(bufferData);
    }
  }, [sampleState]);
  useEffect(() => {
    if (buffer && context) {
      const pixelParSample = width / buffer.length;
      context.clearRect(0, 0, width, height);
      if (slice) {
        context.fillStyle = '#333';
        context.fillRect(
          slice.begin * width, 0, ((slice.end - slice.begin) * width), height,
        );
      }
      buffer?.forEach((val, i) => {
        if (slice && inRangeSlice(i * pixelParSample, slice)) {
          context.fillStyle = '#0ff';
        } else {
          context.fillStyle = '#fff';
        }
        context.fillRect(
          i * pixelParSample,
          height * 0.5,
          pixelParSample,
          val * height * 0.5,
        );
      });
    }
  }, [buffer, bufferData, context, slice]);
  return (
    <GraphContainer>
      <canvas id={id} width={width} height={height} ref={graphRef} />
    </GraphContainer>
  );
};

export default Graph;
