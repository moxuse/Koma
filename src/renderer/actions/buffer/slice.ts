import { Dispatch } from 'redux';
import Table, { Slice } from '../../model/Table';
import { updateWaveTableByTable } from '../waveTables';

export type UpdateSlicePayload = {
  id: string | undefined,
  error: Error | undefined
};

export const updateSliceFailed = (
  payload: UpdateSlicePayload
) => ({
  type: 'ADD_SLICE_FAILED',
  payload 
});

export type UpdateSliceAction = ReturnType<typeof updateSliceFailed>

export const updateSlice = (table: Table, slice: Slice) => {  
  return (dispatch: Dispatch<UpdateSliceAction | any>) => {
    if (table !== undefined && slice) {
      const newTable = new Table({
        id: table.getId(),
        mode:  table.getMode(),
        name: table.getName(),
        bufnum: table.getBufnum(),
        sample: table.getSample(),
        effect: table.getEffect(),
        slice: slice
      });
      dispatch(updateWaveTableByTable(newTable));    
    }
  };
};

export const updateSliceFail = (id: string) => {
  return (dispatch: Dispatch<UpdateSliceAction | any>) => {
    if (id != undefined) {
      dispatch(updateSliceFailed({
        id,
        error: new Error('Add Slice Fail id: ' + id),
      }));
    }
  }
}
