import React, { useEffect, useCallback, useRef, useState } from 'react';
import Table from '../../model/Table';
import { connect } from 'react-redux';
import { loadWaveTable, LoadWaveTableAction } from '../../actions/loadWaveTable';

import styled from 'styled-components';

const DropSectionContainer = styled.li`
  width: 100%;
  background-color: ${(props: {dragging: boolean}) => props.dragging ? "#F6A900" : "#FFFFFF"}
`;

const DropSection = ({ handleDrop }: { handleDrop: any }): JSX.Element => {
  let ref = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const onDragOver = useCallback((e: DragEvent) => {
    setDragging(true);
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      return false;
    }
  }, []);
  const onDragReave = useCallback((_) => {
    setDragging(false);
  }, []);
  const onDrop = useCallback((e: DragEvent) => {
    e.stopPropagation();
    if (e.preventDefault) {      
      e.preventDefault();
    } else {
      return false;
    }
    const files = e.dataTransfer?.files;
    if (files && files.length >= 1) {
      handleDrop(files[0].path);  
    }
    setDragging(false);    
  }, []);
  useEffect(() => {
    ref.current!.addEventListener('drop', onDrop, false)
    ref.current!.addEventListener("dragover", onDragOver, false);
    ref.current!.addEventListener("dragleave" , onDragReave, false);
    return () => {
      ref.current!.removeEventListener('drop', onDrop, false);
      ref.current!.removeEventListener('dragover', onDragOver, false);
      ref.current!.addEventListener("dragleave" , onDragReave, false);
    }
  },[])
  
  return (
    <>
      <DropSectionContainer dragging={ dragging }>
        <div ref={ref}>
          {'+'}
        </div>
      </DropSectionContainer>
    </>
  );
};

// function mapStateToProps({ loadWaveTable: { isFetching } }: {loadWaveTable:{ isFetching: boolean }}) {
//   console.log('in wavetables', isFetching);
//   return {
//     isFetching: isFetching,
//     // tables: table,
//   }
// }

function mapDispatchToProps(dispatch: any) {
  return {
    handleDrop: (filePath: string) => dispatch(loadWaveTable(filePath))
  }
}

export default connect(null, mapDispatchToProps)(DropSection)
