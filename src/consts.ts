import { GameSquare } from "./types";

export const KEYBOARD_DISPLAY: string[] = [
  'Q',
  'W',
  'E',
  'R',
  'T',
  'Y',
  'U',
  'I',
  'O',
  'P',
  'A',
  'S',
  'D',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  'Z',
  'X',
  'C',
  'V',
  'B',
  'N',
  'M',
];

export const MAX_TURNS = 6;

export const LOCAL_STORAGE_KEY = 'nickname';

export const createNewBoard = (): GameSquare[][] => {
  return Array.from({ length: 6 }, () =>
    Array.from({ length: 5 }, () => ({ value: '', bgColor: '' }))
  );
}
