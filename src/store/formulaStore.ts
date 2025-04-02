import { create } from 'zustand';
import { FormulaElement } from '@/types/formula';
import { v4 as uuidv4 } from 'uuid';

interface FormulaState {
    formula: FormulaElement[];
    setFormula: (newFormula: FormulaElement[]) => void;
    addElement: (element: FormulaElement) => void;
    deleteLastElement: () => void;
}

export const useFormulaStore = create<FormulaState>((set) => ({
    formula: [],

    setFormula: (newFormula) => {
        const formulaWithKeys: FormulaElement[] = newFormula.map((el) => {
            if (typeof el === 'object' && el !== null && 'id' in el) {
                return { ...el, key: `${el.id}-${uuidv4()}` };
            } else {
                return el;
            }
        });
        set({ formula: formulaWithKeys });
    },

    addElement: (element) => {
        let elementWithKey: FormulaElement;
        if (typeof element === 'object' && element !== null && 'id' in element) {
            elementWithKey = { ...element, key: `${element.id}-${uuidv4()}` };
        } else {
            elementWithKey = element;
        }
        set((state) => ({ formula: [...state.formula, elementWithKey] }));
    },

    deleteLastElement: () =>
      set((state) => ({ formula: state.formula.slice(0, -1) })),
}));
