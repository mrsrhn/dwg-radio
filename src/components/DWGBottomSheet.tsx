import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { observer } from 'mobx-react-lite';
import React, { useRef } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import PlayerControls from './PlayerControls';
import Title from './Title';
import ProgramView from './ProgramView';
import useConfig from '../hooks/useConfig';
import useStores from '../hooks/useStores';
import HistoryView from './HistoryView';

interface DWGBottomSheetProps {
  onInfoMenuButton: () => void;
}

const DWGBottomSheet: React.FC<DWGBottomSheetProps> = observer(
  ({ onInfoMenuButton }) => {
    const { configBase } = useConfig();
    const { playerStore } = useStores();

    const bottomSheetRef = useRef<BottomSheet>(null);

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        animateOnMount={false}
        snapPoints={['50%', '90%']}
      >
        <Title />
        <PlayerControls onInfoMenuButton={onInfoMenuButton} />
        <BottomSheetScrollView
          contentContainerStyle={styles.container}
          style={{
            maxHeight: Dimensions.get('window').height,
          }}
        >
          {configBase.showProgramForRadio &&
          playerStore.selectedChannelKey === 'radio' ? (
            <ProgramView />
          ) : (
            <HistoryView />
          )}
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingBottom: 20,
    minHeight: 1000,
  },
});

export default DWGBottomSheet;
