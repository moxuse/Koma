import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GrainPoint } from '../../model/Effect';
import styled from 'styled-components';
import throttle from 'lodash.throttle';

const width = 150;
const height = 60;

const GraphConatainer = styled.div`
  // visibility: hidden;
  position: absolute;
  z-index: 2;
  background-color: rgba(0,0,0,0);
  margin: 2px 0 2px 0;
  display: inline-table;
  width: ${width}px;
  height: ${height}px;
  canvas {
    background-color: rgba(0,0,0,0);
  }
`;

const GrainEditor = ({ id }: { id: string }): JSX.Element => {
  const [points, setPoints] = useState<Array<GrainPoint>>([]);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>()
  const [editting, setEditting] = useState<boolean>(false);
  const [delay, setDelay] = useState<number>(100);
  const graphRef = useRef<HTMLCanvasElement>(null);
  const graphContainer = useRef<HTMLDivElement>(null);

  const onMouseDown = () => {
    setPoints((prev) => [])
    setEditting(prev => true);      
  };
  const onMouseUp =() => {
    
    setEditting(prev => false);
  };
  const onMouseOut = () => {
    setEditting(false);
  }; 
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (editting) {
      setPoints(prev => [...prev, { x: e.offsetX, y: e.offsetY }]);
    }
  }, [editting, points]);

  useEffect(() => {  
    if (graphRef.current) {
      const canvasContext = graphRef.current.getContext("2d");
      setContext(canvasContext);
    };
    
    graphContainer.current?.addEventListener('mousedown', onMouseDown, false);
    graphContainer.current?.addEventListener('mouseup', onMouseUp, false);
    graphContainer.current?.addEventListener('mouseout', onMouseOut, false);
    graphContainer.current?.addEventListener('mousemove', throttle(onMouseMove, delay), false);
    
    return () => {
      graphContainer.current?.removeEventListener('mousedown', onMouseDown, false);
      graphContainer.current?.removeEventListener('mouseup', onMouseUp, false);
      graphContainer.current?.removeEventListener('mouseout', onMouseOut, false);
      graphContainer.current?.removeEventListener('mousemove',  onMouseMove, false);
    };
  }, [graphRef, graphContainer, editting, delay]);

  useEffect(() => {
    if (context && editting && points) {
      let prevPoint = { x: 0, y: 0 };
      if (points.length === 0) {
        context.clearRect(0, 0, width, height);
      }
      context.strokeStyle = '#fff';
      context.beginPath();
      points?.forEach((point, i) => {
        
        if (i > 0) {
          context.moveTo(prevPoint.x, prevPoint.y);
          context.lineTo(point.x, point.y);
          context.rect(point.x - 1, point.y - 1, 2, 2);
        }
        prevPoint = point;
      });
      context.stroke();
    };
  }, [context, graphRef, graphContainer, points, editting]);

  return (
    <GraphConatainer ref={graphContainer}>
      <canvas width={width} height={height} ref={graphRef}></canvas>
    </GraphConatainer>
  );
};

export default GrainEditor;
