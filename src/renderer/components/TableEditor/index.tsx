import React, { useEffect, useCallback, useRef, useState } from 'react';
import Table, { Slice } from '../../model/Table';
import TableList from '../../model/TableList';
import { connect } from 'react-redux';
import { updateSlice } from '../../actions/buffer/slice';
import styled from 'styled-components';


const TableEditorErea = styled.div`
`;

const TableEditor = ({ children, tables, handleUpdate }: {
  children: JSX.Element, tables: TableList, handleUpdate: any
}) => {
  const tableList = useRef<HTMLDivElement>(null);
  const [editting, setEditting] = useState<boolean>(false);
  const [id, setId] = useState<string | undefined>(undefined);
  const [from, setFrom] = useState<number | undefined>(undefined);
  const [to, setTo] = useState<number | undefined>(undefined);
  /**
   * wavetable edit with mouse event
   */
  const normalize = (x_: number,  width: number) => { 
    const x = x_ / width;
    return x
  }
  const calcSlice = (table: Table, { from, to }: {from: number, to: number }): Slice => { 
    const begin = Math.min(from, to);
    const end = Math.max(from, to);
    return { begin, end };
  }  

  useEffect(() => {    
    const onMousedown = (e: MouseEvent) => {
      setEditting(true);
      const target = e.target as HTMLElement;
      const rect = target?.getBoundingClientRect();
      const x_ = e.clientX - rect.left;
      const y_ = e.clientY - rect.top;
      setFrom(normalize(x_, rect.width));
      setId(target.id);
    };
    tableList.current?.addEventListener("mousedown", onMousedown, false);
    return () => { 
      tableList.current?.removeEventListener("mousedown", onMousedown, false);
    }
  }, [tables, id, editting]);
  useEffect(() => {
    const onMousemove = (e: MouseEvent) => {
      if (editting) {
        const target: HTMLElement = e.target as HTMLElement;
        const rect = target?.getBoundingClientRect();
        const x_ = e.clientX - rect.left;
        const y_ = e.clientY - rect.top;        
        if (id) {
          const table = TableList.getTableById(tables, id);
          if (table && from) {
            setTo(normalize(x_, rect.width));
            if (to) {
              const newSlice = calcSlice(table, { from, to });
              handleUpdate(table, newSlice);
            }
          }
        }
      }
    };
    tableList.current?.addEventListener("mousemove", onMousemove, false);
    return () => { 
      tableList.current?.removeEventListener("mousemove", onMousemove, false);
    }
  }, [tables,id, editting]);
  useEffect(() => {
    const onMouseup = (e: MouseEvent) => {
      setEditting(false);
      setId(undefined);
      const target = e.target as HTMLElement;
      // console.log('mouseup', target.id);
    };        
     tableList.current?.addEventListener("mouseup", onMouseup, false);
     return () => {              
       tableList.current?.removeEventListener("mouseup", onMouseup, false);      
     }
   }, [tables, id, editting]);
  return (
    <TableEditorErea ref={tableList}>
      {children}
    </TableEditorErea>
  )
}

function mapStateToProps({}) {
  return {};
};

function mapDispatchToProps(dispatch: any) {
  return {
    handleUpdate: (table: Table, slice: Slice) => dispatch(updateSlice(table, slice))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableEditor);

