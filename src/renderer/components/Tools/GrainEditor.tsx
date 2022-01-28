import React, { useEffect, useRef, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { ToolsContext } from '../Tools/Context';
import Effect, { GrainPoint } from '../../model/Effect';
import Table from '../../model/Table';
import { updateWaveTableByEffect } from '../../actions/waveTables';
import styled from 'styled-components';
import throttle from 'lodash.throttle';

export const GrainEditorSize = {
  width: 150,
  height: 60
}

const GraphConatainer = styled.div`
  visibility: ${(props: { isShown: boolean }) => (props.isShown) ? 'visible' : 'hidden'};
  position: absolute;
  z-index: 2;
  background-color: rgba(0,0,0,0.0);
  margin: 2px 0 2px 0;
  display: inline-table;
  width: ${GrainEditorSize.width}px;
  height: ${GrainEditorSize.height}px;
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

  useEffect(() => {
    if (points_.length === 0) {
      setPoints(effect.getPoints());
    }
  }, [effect]);

  useEffect(() => {
    if (context && points_) {
      let prevPoint = { x: 0, y: 0 };
      if (points_.length === 0) {
        context.clearRect(0, 0, GrainEditorSize.width, GrainEditorSize.height);
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

  const onMouseDown = (e: MouseEvent) => {
    const firstPoint = { x: e.offsetX, y: e.offsetY };
    setPoints((prev) => []);
    setEditting(prev => true);
    setPoints(prev => [...prev, firstPoint]);
  };
  const onMouseUp = useCallback(() => {
    setEditting(prev => false);
    const newEff = effect.set('points', points_);
    handleUpdate(table, newEff);
  }, [table, effect, points_]);
  const onMouseOut = useCallback(() => {    
    setEditting(prev => false);
    const newEff = effect.set('points', points_);
    handleUpdate(table, newEff);    
  }, [table, effect, points_]); 
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (editting) {
      setPoints(prev => [...prev, { x: e.offsetX, y: e.offsetY }]);
    }
  }, [editting]);
  
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
  }, [effect, table, graphRef, graphContainer, editting, resolution]);

  return (
    <GraphConatainer isShown={table.getMode() === 'grain'} ref={graphContainer}>
      <canvas width={GrainEditorSize.width} height={GrainEditorSize.height} ref={graphRef}></canvas>
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
