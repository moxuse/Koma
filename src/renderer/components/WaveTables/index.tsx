import React, { useEffect, useCallback } from 'react';
import WaveTable from '../WaveTable';
import DropSection from '../DropSection';
import TableEditor from '../TableEditor';
import ToolsEditor from '../Tools/Editor';
import TableList from '../../model/TableList';
import Table, { Slice } from '../../model/Table';
import Effect from '../../model/Effect';
import { SampleState } from '../../model/Sample';
import MIDIReceiver from '../../lib/midi';
import { loadSetting as LoadSetting, booted as Booted } from '../../actions/setting';
import { player } from '../../actions/buffer/player';
import { midiOnReceive } from '../../actions/midi';
import { connect } from 'react-redux';
import { addEmptyWaveTable } from '../../actions/waveTables';
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

const FooterList = styled.ul`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 0;
  padding: 0;
  max-width: 500px;
`;

const MidiDeviceIndicator = styled.div`
  margin-right: 40px;
`;

const midiratio = (input: number) => {
  return Math.pow(2.0, input * 0.083333333333);
};

const midi = new MIDIReceiver();

const WaveTables = ({
  booted,
  isFetching,
  tables,
  onceListenBooted,
  loadSetting,
  handleOpenButton,
  handlePlusButton,
  handlePlayer,
  handleMidiOnReceive,
}: {
  booted: boolean;
  isFetching: boolean;
  tables: TableList;
  onceListenBooted: any;
  loadSetting: any;
  handleOpenButton: any;
  handlePlusButton: any;
  handlePlayer: any;
  handleMidiOnReceive: any;
}): JSX.Element => {
  const debounced = useDebouncedCallback(
    (t: TableList) => assignMIDI(t),
    // delay in ms
    1000,
  );

  const assignMIDI = (t: TableList) => {
    const tables_ = t.getTables().toJS() as Table[];
    midi.unsubscribeAll();
    tables_.forEach((table: Table, i: number) => {
      const eff = TableList.getEffectById(tables, table.effect!);
      midi.subscribe(i, (e: WebMidi.MIDIMessageEvent) => {
        const midiNote = e.data[1];
        const amp = e.data[2] * 0.0078125;
        const rate = midiratio(midiNote - 60) * eff!.getRate();
        const replacedEff = new Effect(eff).set('rate', rate).set('amp', amp);
        handlePlayer(table.mode, table.bufnum, table.slice, replacedEff);
        handleMidiOnReceive(i);
        setTimeout(() => {
          handleMidiOnReceive(-1);
        }, 100);
      });
    });
  };

  useEffect(() => {
    onceListenBooted();
    loadSetting();
  }, []);

  useEffect(() => {
    if (!isFetching) {
      debounced(tables);
    }
  }, [tables, isFetching]);

  const onClickOpenButton = useCallback(() => handleOpenButton(), []);
  const onClickSaveButton = useCallback(() => window.api.saveStore(), []);

  const onClickPlusButton = useCallback(() => {
    handlePlusButton();
  }, []);

  const sampleState = useCallback((tables_: TableList, table: Table): SampleState => {
    return TableList.getSampleStateById(tables_, table.getSample()!);
  }, [isFetching, tables]);

  const getBufferData = (tables_: TableList, table: Table): Float32Array | undefined => {
    return tables_.getBufferDataForSampleId(table.getSample());
  };

  const getSample = (tables_: TableList, table: Table) => {
    return TableList.getSampleById(tables_, table.getSample()!);
  };

  const getEffect = (tables_: TableList, table: Table) => {
    return TableList.getEffectById(tables_, table.getEffect()!);
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
          sampleState={sampleState(tables, table)}
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
          <Button onClick={onClickSaveButton}>{'[ _ ]'}</Button>
          <Button onClick={onClickOpenButton}>{'[ ^ ]'}</Button>
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
        <FooterList>
          <li>
            {booted ? (<Button onClick={onClickPlusButton}>{'[ + ]'}</Button>) : 'synth server not booted'}
          </li>
          <li>
            <MidiDeviceIndicator>{midi.devices}</MidiDeviceIndicator>
          </li>
        </FooterList>
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
    handlePlusButton: () => dispatch(addEmptyWaveTable()),
    handlePlayer: (mode: TableMode, bufnum: number, slice: Slice, effect: Effect) => dispatch(player(mode, bufnum, slice, effect)),
    handleMidiOnReceive: (channel: number) => dispatch(midiOnReceive(channel)),
    loadSetting: () => dispatch(LoadSetting()),
    onceListenBooted: () => dispatch(Booted()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WaveTables);
