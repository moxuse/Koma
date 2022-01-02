
import React, { useEffect, useCallback, useRef, useState } from 'react';
import Knob from '../Tools/Knob';
import Table, { Slice } from '../../model/Table';
import Effect from '../../model/Effect';
import { EffectKeys } from '../../model/Effect';
import TableList from '../../model/TableList';
import { connect } from 'react-redux';
import { updateWaveTableByEffect } from '../../actions/waveTables';
import styled from 'styled-components';


const ToolsErea = styled.div`
`;

const ToolsEditor = ({ children, tables, handleUpdate }: {
  children: JSX.Element, tables: TableList, handleUpdate: any
}) => {
  const toolsEl = useRef<HTMLDivElement>(null);
  const [editting, setEditting] = useState<boolean>(false);
  const [id, setId] = useState<string | undefined>(undefined);
  const [type, setType] = useState<string | undefined>(undefined);
  /**
   * tools edit with mouse event
   */
  const parseId = (id: string): { id: string, type: string } | false => { 
    const splitted = id.split('-');
    if (id && splitted.length > 1) { 
      return { id: splitted[0], type: splitted[1] };
    }
    return false;
  }

  const getEffect = (tables: TableList, id: string): Effect | undefined => { 
    return TableList.getEffectById(tables, id);
  }

  useEffect(() => {    
    const onMousedown = (e: MouseEvent) => {          
      const target: HTMLElement = e.target as HTMLElement;
      const parsed = parseId(target.id);
      if (parsed) {
        setEditting(true);
        setId(parsed.id);
        setType(parsed.type);
      } else {  
        setEditting(false);
      }
    };
    toolsEl.current?.addEventListener("mousedown", onMousedown, false);
    return () => { 
      toolsEl.current?.removeEventListener("mousedown", onMousedown, false);
    }
  }, [tables, id, type, editting]);
  useEffect(() => {
    const onMousemove = (e: MouseEvent) => {
      if (editting  && id  && type) {        
        const key: EffectKeys = type as EffectKeys;
        const eff = getEffect(tables, id);
        let val;
        if (eff && key) {
          val = eff.get(key);
          if (typeof val === 'number') {
            val += e.movementY  * -0.002;
            const neweffect = eff.set(key, val);
            handleUpdate(tables, neweffect);
          }
        }        
      }
    };
    toolsEl.current?.addEventListener("mousemove", onMousemove, false);
    return () => { 
      toolsEl.current?.removeEventListener("mousemove", onMousemove, false);
    }
  }, [tables, id, type, editting]);
  useEffect(() => {
    const onMouseup = (e: MouseEvent) => {
      setEditting(false);
      setId(undefined);
      setType(undefined);
    };        
    toolsEl.current?.addEventListener("mouseup", onMouseup, false);
     return () => {              
      toolsEl.current?.removeEventListener("mouseup", onMouseup, false);      
     }
  }, [tables, id, type, editting]);

  useEffect(() => {
    const onMouseout = (e: MouseEvent) => {
      setEditting(false);
      setId(undefined);
      setType(undefined);
    };        
    toolsEl.current?.addEventListener("mouseout", onMouseout, false);
     return () => {              
      toolsEl.current?.removeEventListener("mouseout", onMouseout, false);      
     }
  }, [tables, id, type, editting]);

  return (
    <ToolsErea ref={toolsEl}>
      {children}
    </ToolsErea>
  )
}

function mapStateToProps({}) {
  return {};
};

function mapDispatchToProps(dispatch: any) {
  return {
    handleUpdate: (table: Table, effect: Effect) => dispatch(updateWaveTableByEffect(table, effect))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ToolsEditor);

