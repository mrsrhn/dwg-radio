import { useMemo } from 'react';
import useProgram from '../api/program';
import { splitAndSortItemsByDate } from '../utils/splitItemsByDate';
import getTimeFromIsoDate from '../utils/getTimeFromIsoDate';
import useCurrentTime from './useCurrentTime';
import { indexForToday } from '../stores/programStore';
import useProgramDatesToShow from './useProgramDatesToShow';

type ProgramItem = {
  id: string;
  title: string;
  artist: string;
  time: string;
  url: string;
  hasBeenPlayed: boolean;
};

const useRadioProgram = (
  selectedProgramIndex: number
): {
  programItems: ProgramItem[];
  currentlyPlaying?: number;
  programDatesToShow: Date[];
} => {
  const history = useProgram();
  const currentTime = useCurrentTime();
  const programDatesToShow = useProgramDatesToShow();

  const isShowingProgramForToday = selectedProgramIndex === indexForToday;

  const splittedProgramItems = useMemo(
    () =>
      splitAndSortItemsByDate(history?.data?.items ?? [], programDatesToShow),
    [history?.data?.items, programDatesToShow]
  );

  const currentlyPlaying = isShowingProgramForToday
    ? splittedProgramItems[selectedProgramIndex].findLastIndex(
      (item) => item.program_timestamp < currentTime.toISOString()
    )
    : undefined;

  const dataToDisplay = useMemo(
    () =>
      splittedProgramItems[selectedProgramIndex].map((item) => ({
        id: item.program_id,
        title: item.program_title,
        artist: item.program_author,
        time: getTimeFromIsoDate(item.program_timestamp),
        url: item.program_download,
        hasBeenPlayed: item.program_timestamp < currentTime.toISOString(),
      })),
    [splittedProgramItems, selectedProgramIndex, currentTime]
  );

  return { programItems: dataToDisplay, currentlyPlaying, programDatesToShow };
};

export default useRadioProgram;
