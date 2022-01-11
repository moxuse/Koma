import React, { useEffect, useRef, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { ToolsContext } from '../Tools/Context';
import Effect, { GrainPoint } from '../../model/Effect';
import Table from '../../model/Table';
import { updateWaveTableByEffect } from '../../actions/waveTables';
import styled from 'styled-components';
import throttle from 'lodash.throttle';

const width = 150;
const height = 60;

const GraphConatainer = styled.div`
  visibility: ${(props: { isShown: boolean }) => (props.isShown) ? 'visible' : 'hidden'};
  position: absolute;
  z-index: 2;
  background-color: rgba(0,0,0,0.0);
  margin: 2px 0 2px 0;
  display: inline-table;
  width: ${width}px;
  height: ${height}px;
  canvas {
    background-color: rgba(0,0,0,0.3);
  }
`;

const GrainEditor = ({ table, effect, handleUpdate }: { table: Table, effect: Effect, handleUpdate: any }): JSX.Element => {
  const { resolution } = React.useContext(ToolsContext);
  const [points_, setPoints] = useState<Array<GrainPoint>>([]);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>()
  const [editting, setEditting] = useState<boolean>(false);
  const graphRef = useRef<HTMLCanvasElement>(null);
  const graphContainer = useRef<HTMLDivElement>(null);

  const onMouseDown = () => {
    setPoints((prev) => [])
    setEditting(prev => true);      
  };
  const onMouseUp =() => {
    setEditting(prev => false);
    const newEff = effect.set('points', points_);
    handleUpdate(table, newEff);
  };
  const onMouseOut = () => {
    setEditting(prev => false);
    const newEff = effect.set('points', points_);
    handleUpdate(table, newEff);
  }; 
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (editting) {
      setPoints(prev => [...prev, { x: e.offsetX, y: e.offsetY }]);
    }
  }, [editting, points_]);

  useEffect(() => {
    setPoints(effect.getPoints());
  },[effect])

  useEffect(() => {
    if (graphRef.current) {
      const canvasContext = graphRef.current.getContext("2d");
      setContext(canvasContext);
    };
    const throttleFn = throttle(onMouseMove, resolution);
    graphContainer.current?.addEventListener('mousedown', onMouseDown, false);
    graphContainer.current?.addEventListener('mouseup', onMouseUp, false);
    graphContainer.current?.addEventListener('mouseout', onMouseOut, false);
    graphContainer.current?.addEventListener('mousemove', throttleFn, false);    
    return () => {
      graphContainer.current?.removeEventListener('mousedown', onMouseDown, false);
      graphContainer.current?.removeEventListener('mouseup', onMouseUp, false);
      graphContainer.current?.removeEventListener('mouseout', onMouseOut, false);
      graphContainer.current?.removeEventListener('mousemove',  throttleFn, false);
    };
  }, [graphRef, graphContainer, editting, resolution]);

  useEffect(() => {
    if (context && editting && points_) {
      let prevPoint = { x: 0, y: 0 };
      if (points_.length === 0) {
        context.clearRect(0, 0, width, height);
      }
      context.strokeStyle = '#f80';
      context.beginPath();
      points_?.forEach((point, i) => {
        if (i > 0) {
          context.moveTo(prevPoint.x, prevPoint.y);
          context.lineTo(point.x, point.y);
          context.rect(point.x - 1, point.y - 1, 2, 2);
        }
        prevPoint = point;
      });
      context.stroke();
    };
  }, [context, graphRef, graphContainer, editting, points_]);

  return (
    <GraphConatainer isShown={table.getMode() === 'grain'} ref={graphContainer}>
      <canvas width={width} height={height} ref={graphRef}></canvas>
    </GraphConatainer>
  );
};

function mapStateToProps({}) {
  return {};
};

function mapDispatchToProps(dispatch: any) {
  return {
    handleUpdate: (table: Table, effect: Effect) => dispatch(updateWaveTableByEffect(table, effect))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GrainEditor);

