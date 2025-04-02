export interface Suggestion {
  id: string;
  name: string;
  category: string;
  value: string | number;
  key: string;
}

export type FormulaElement = Suggestion | string;
