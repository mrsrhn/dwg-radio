import { parseISO, format, Locale, isSameDay } from 'date-fns';
import { de, cs, ru } from 'date-fns/locale';
import { DwgProgramItem } from '../api/program';
import { language } from '../stores/rootStore';

const DATE_FORMAT = 'd. MMM';
let locale: Locale;

switch (language) {
  case 'de':
    locale = de;
    break;
  case 'cz':
    locale = cs;
    break;
  case 'ru':
    locale = ru;
    break;
  default:
    locale = de;
}

export function splitAndSortItemsByDate(
  items: DwgProgramItem[],
  programDays: Date[]
): DwgProgramItem[][] {
  const daysWithItems = programDays.map((day) => {
    const filteredItems = items.filter((item) => {
      const itemDate = parseISO(item.program_timestamp);
      return isSameDay(day, itemDate);
    });
    return filteredItems.sort((a, b) => {
      const aDate = parseISO(a.program_timestamp);
      const bDate = parseISO(b.program_timestamp);
      return aDate.getTime() - bDate.getTime();
    });
  });

  return daysWithItems;
}

export function getStringsForProgramHeader(
  selectedDayIndex: number,
  programDays: Date[]
) {
  const formattedDays = programDays.map((day) =>
    format(day, DATE_FORMAT, { locale })
  );

  const previousDayString = formattedDays[selectedDayIndex - 1];
  const nextDayString = formattedDays[selectedDayIndex + 1];
  const selectedDayString = formattedDays[selectedDayIndex];

  return { previousDayString, selectedDayString, nextDayString };
}
