import React, { useEffect, useCallback } from 'react';
import WaveTable from '../WaveTable';
import DropSection from '../DropSection';
import TableEditor from '../TableEditor';
import ToolsEditor from '../Tools/Editor';
import TableList from '../../model/TableList';
import Table, { Slice } from '../../model/Table';
import Effect from '../../model/Effect';
import MIDIReceiver from '../../lib/midi';
import { loadSetting as LoadSetting, booted as Booted } from '../../actions/setting';
import { player } from '../../actions/buffer/player';
import { midiOnRecieve } from '../../actions/midi';
import { connect } from 'react-redux';
import { loadWaveTableByDialog } from '../../actions/waveTables/byDialog';
import { openStore } from '../../actions/waveTables/openStore';
import { useDebouncedCallback } from 'use-debounce';

import styled from 'styled-components';

const WaveTableContainer = styled.div`
  width: 100%;
  li {
    list-style: none;
  }
  select:focus {
    outline: none;
  }
`;

const WaveTableList = styled.ul`
  margin: 0;
  padding: 0px;
  padding: 4px;
`;

const Button = styled.button`
  margin-left: 4px;
  color: white;
  border: 0px solid #111;
  background: #000;
  box-shadow: inset 0px 0px 0px #0C0C0C;
`;

const midiratio = (input: number) => {
  return Math.pow(2.0, input * 0.083333333333);
};

const midi = new MIDIReceiver();

const WaveTables = ({
  booted,
  isFetching,
  tables,
  onceLiestenBooted,
  loadSetting,
  handleOpenButton,
  handlePlusButton,
  handlePlayer,
  handleMidiOnRecieve,
}: {
  booted: boolean;
  isFetching: boolean;
  tables: TableList;
  onceLiestenBooted: any;
  loadSetting: any;
  handleOpenButton: any;
  handlePlusButton: any;
  handlePlayer: any;
  handleMidiOnRecieve: any;
}): JSX.Element => {
  const debounced = useDebouncedCallback(
    (t: TableList) => assignMIDI(t),
    // delay in ms
    1000,
  );

  const assignMIDI = (t: TableList) => {
    const tables_ = t.getTables().toJS() as Table[];
    midi.unscbscribeAll();
    tables_.forEach((table: Table, i: number) => {
      const eff = TableList.getEffectById(tables, table.effect!);
      midi.subscribe(i, (e: WebMidi.MIDIMessageEvent) => {
        const midinote = e.data[1];
        const amp = e.data[2] * 0.0078125;
        const rate = midiratio(midinote - 60) * eff!.getRate();
        const replacedEff = new Effect(eff).set('rate', rate).set('amp', amp);
        handlePlayer(table.mode, table.bufnum, table.slice, replacedEff);
        handleMidiOnRecieve(i);
        setTimeout(() => {
          handleMidiOnRecieve(-1);
        }, 100);
      });
    });
  };

  useEffect(() => {
    onceLiestenBooted();
    loadSetting();
  }, []);

  useEffect(() => {
    if (!isFetching) {
      debounced(tables);
    }
  }, [tables, isFetching]);

  const onClickeOpenButton = useCallback(() => handleOpenButton(), []);
  const onClickeSaveButton = useCallback(() => window.api.saveStore(), []);

  const onClickePlusButton = useCallback(() => {
    handlePlusButton();
  }, []);

  const isAllocated = useCallback((tables_: TableList, table: Table): boolean => {
    return TableList.getAllocatedSampleById(tables, table.getSample()!);
  }, [isFetching, tables]);

  const getBufferData = (tables_: TableList, table: Table): Float32Array | undefined => {
    return tables.getBufferDataForSampleId(table.getSample());
  };

  const getSample = (tables_: TableList, table: Table) => {
    return TableList.getSampleById(tables, table.getSample()!);
  };

  const getEffect = (tables_: TableList, table: Table) => {
    return TableList.getEffectById(tables, table.getEffect()!);
  };

  const getTables = () => {
    let i = 0;
    return (
      (tables) ? tables.getTables().map((table: Table) => {
        const channel = i;
        i++;
        return (<WaveTable
          channel={channel}
          key={table.getId()}
          table={table}
          sample={getSample(tables, table)!}
          effect={getEffect(tables, table)!}
          bufferData={getBufferData(tables, table)}
          isAllocated={isAllocated(tables, table)}
          booted={booted}
        />
        );
      }) : <p>{'loading...'}</p>
    );
  };

  return (
    <WaveTableContainer>
      {booted ? (
        <>
          <Button onClick={onClickeSaveButton}>{'[ _ ]'}</Button>
          <Button onClick={onClickeOpenButton}>{'[ ^ ]'}</Button>
        </>
      ) : <></>}
      <DropSection booted={booted}>
        <TableEditor tables={tables}>
          <ToolsEditor tables={tables}>
            <WaveTableList>
              {getTables()}
            </WaveTableList>
          </ToolsEditor>
        </TableEditor>
        {booted ? (<Button onClick={onClickePlusButton}>{'[ + ]'}</Button>) : 'synth server not booted'}
      </DropSection>
    </WaveTableContainer>
  );
};

function mapStateToProps(
  { waveTables, loadSetting }: any,
) {
  return {
    booted: loadSetting.booted,
    isFetching: waveTables.isFetching,
    tables: waveTables.tables,
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    handleOpenButton: () => dispatch(openStore()),
    handlePlusButton: () => dispatch(loadWaveTableByDialog()),
    handlePlayer: (mode: TableMode, bufnum: number, slice: Slice, effect: Effect) => dispatch(player(mode, bufnum, slice, effect)),
    handleMidiOnRecieve: (channel: number) => dispatch(midiOnRecieve(channel)),
    loadSetting: () => dispatch(LoadSetting()),
    onceLiestenBooted: () => dispatch(Booted()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WaveTables);
