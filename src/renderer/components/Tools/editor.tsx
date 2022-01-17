
import React, { useEffect, useRef, useState } from 'react';
import Table from '../../model/Table';
import Effect from '../../model/Effect';
import { EffectKeys } from '../../model/Effect';
import TableList from '../../model/TableList';
import { Spec, PanSpec, RateSpec, GainSpec, DurSpec, TrigSpec } from '.';
import { connect } from 'react-redux';
import { updateWaveTableByEffect } from '../../actions/waveTables';
import styled from 'styled-components';


const ToolsErea = styled.div`
`;

const calcSpac = (val: number, add: number, key: string): number => {
  const clip = (value: number,  add: number, spec: Spec): number => {    
    switch (spec.type) { 
      case 'linear':
        value = value + add;
        break;
      case 'exp':
        value = value + (add * value + add);
        break;
    }
    if (value < spec.min) { value = spec.min };
    if (value > spec.max) { value = spec.max };
    return value;
  }
  let val_ = val;
  switch (key) {
    case 'rate':
      val_ = clip(val_, add, RateSpec);
      break;
    case 'pan':
      val_ = clip(val_, add, PanSpec);
      break;
    case 'gain':
      val_ = clip(val_, add, GainSpec);
      break;
    case 'duration':
      val_ = clip(val_, add, DurSpec);
      break;
    case 'trig':
      val_ = clip(val_, add, TrigSpec);
      break;
  }
  return val_;
}

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
    window.addEventListener("mousedown", onMousedown, false);
    return () => { 
      window.removeEventListener("mousedown", onMousedown, false);
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
            const neweffect = eff.set(key, calcSpac(val, e.movementY * -0.025, key));
            handleUpdate(tables, neweffect);
          }
        }        
      }
    };
    window.addEventListener("mousemove", onMousemove, false);
    return () => { 
      window.removeEventListener("mousemove", onMousemove, false);
    }
  }, [tables, id, type, editting]);
  useEffect(() => {
    const onMouseup = (e: MouseEvent) => {
      setEditting(false);
      setId(undefined);
      setType(undefined);
    };        
    window.addEventListener("mouseup", onMouseup, false);
     return () => {              
      window.removeEventListener("mouseup", onMouseup, false);      
     }
  }, [tables, id, type, editting]);

  // useEffect(() => {
  //   const onMouseout = (e: MouseEvent) => {
  //     setEditting(false);
  //     setId(undefined);
  //     setType(undefined);
  //   };        
  //   window.addEventListener("mouseout", onMouseout, false);
  //    return () => {              
  //     window.removeEventListener("mouseout", onMouseout, false);      
  //    }
  // }, [tables, id, type, editting]);
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

