import React, { useEffect, useRef, useState } from 'react';
import Table, { Slice } from '../../model/Table';
import TableList from '../../model/TableList';
import { connect } from 'react-redux';
import { updateSlice } from '../../actions/buffer/slice';
import styled from 'styled-components';


const TableEditorArea = styled.div`
`;

const TableEditor = ({ children, tables, handleUpdate, isLoaded }: {
  children: JSX.Element; tables: TableList; handleUpdate: any; isLoaded: boolean;
}) => {
  const tableList = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [id, setId] = useState<string | undefined>(undefined);
  const [from, setFrom] = useState<number | undefined>(undefined);
  const [to, setTo] = useState<number | undefined>(undefined);
  /**
   * wavetable edit with mouse event
   */
  const normalize = (x_: number, width: number) => {
    const x = x_ / width;
    return x;
  };
  const calcSlice = (table: Table, { from_, to_ }: {from_: number; to_: number }): Slice => {
    const begin = Math.min(from_, to_);
    const end = Math.max(from_, to_);
    return { begin: begin, end: end };
  };

  useEffect(() => {
    const onMousedown = (e: MouseEvent) => {
      if (!isLoaded) {
        return;
      }
      setEditing(true);
      const target = e.target as HTMLElement;
      const rect = target?.getBoundingClientRect();
      const x_ = e.clientX - rect.left;
      // const y_ = e.clientY - rect.top;
      setFrom(normalize(x_, rect.width));
      setId(target.id);
    };
    tableList.current?.addEventListener('mousedown', onMousedown, false);
    return () => {
      tableList.current?.removeEventListener('mousedown', onMousedown, false);
    };
  }, [isLoaded, tables, id, editing]);
  useEffect(() => {
    const onMousemove = (e: MouseEvent) => {
      if (!isLoaded) {
        return;
      }
      if (editing) {
        const target: HTMLElement = e.target as HTMLElement;
        const rect = target?.getBoundingClientRect();
        const x_ = e.clientX - rect.left;
        // const y_ = e.clientY - rect.top;
        if (id) {
          const table = TableList.getTableById(tables, id);
          if (table && from) {
            setTo(normalize(x_, rect.width));
            if (to) {
              const newSlice = calcSlice(table, { from_: from, to_: to });
              handleUpdate(table, newSlice);
            }
          }
        }
      }
    };
    tableList.current?.addEventListener('mousemove', onMousemove, false);
    return () => {
      tableList.current?.removeEventListener('mousemove', onMousemove, false);
    };
  }, [isLoaded, tables, id, editing]);
  useEffect(() => {
    const onMouseup = () => {
      if (!isLoaded) {
        return;
      }
      setEditing(false);
      setId(undefined);
      // const target = e.target as HTMLElement;
      // console.log('mouseup', target.id);
    };
    tableList.current?.addEventListener('mouseup', onMouseup, false);
    return () => {
      tableList.current?.removeEventListener('mouseup', onMouseup, false);
    };
  }, [isLoaded, tables, id, editing]);
  return (
    <TableEditorArea ref={tableList}>
      {children}
    </TableEditorArea>
  );
};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch: any) {
  return {
    handleUpdate: (table: Table, slice: Slice) => dispatch(updateSlice(table, slice)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TableEditor);

