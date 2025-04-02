import React, { useRef, useState, KeyboardEvent } from 'react';
import { useQuery } from 'react-query';
import { useFormulaStore } from '@/store/formulaStore';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Tag } from './Tag';
import { Suggestion, FormulaElement } from '@/types/formula';

const fetchSuggestions = async (query: string): Promise<Suggestion[]> => {
    const res = await axios.get(`https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete?search=${query}`);
    return res.data;
};

const removeDuplicates = (data: Suggestion[]): Suggestion[] => {
    const seenIds = new Set();
    return data.filter((item) => {
        if (seenIds.has(item.id)) {
            return false;
        }
        seenIds.add(item.id);
        return true;
    });
};

const evaluateFormula = (formula: FormulaElement[]): string => {
    try {
        const expression = formula
          .map((el) => {
              if (typeof el === 'string') return el;
              return typeof el.value === 'string' ? `(${el.value})` : el.value;
          })
          .join(' ');
        const result = eval(expression);
        return `= ${result}`;
    } catch {
        return '= ❌ Error';
    }
};

const isOperator = (value: string) => ['+', '-', '*', '/', '^', '(', ')', '='].includes(value);

export const FormulaInput: React.FC = () => {
    const { formula: formula2, setFormula, deleteLastElement } = useFormulaStore();
    const [inputValue, setInputValue] = useState('');
    const [submittedFormulas, setSubmittedFormulas] = useState<FormulaElement[][]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const { data: suggestions = [] } = useQuery<Suggestion[]>(
      ['autocomplete', inputValue],
      () => fetchSuggestions(inputValue),
      { enabled: inputValue.length > 0, initialData: [] }
    );

    const filteredSuggestions = removeDuplicates(suggestions);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const trimmed = inputValue.trim();
            if (!trimmed) return;

            if (isOperator(trimmed)) {
                const last = formula2[formula2.length - 1];

                if (trimmed === '=') {
                    setSubmittedFormulas([...submittedFormulas, formula2]);
                    setFormula([]);
                } else if (trimmed === '(' || trimmed === ')') {
                    setFormula([...formula2, trimmed]);
                } else if (typeof last !== 'string' || !isOperator(last)) {
                    setFormula([...formula2, trimmed]);
                }
            } else if (!isNaN(Number(trimmed))) {
                setFormula([...formula2, trimmed]);
            } else {
                const matched = filteredSuggestions.find((s) => s.name.toLowerCase() === trimmed.toLowerCase());
                if (matched) {
                    setFormula([...formula2, matched]);
                } else {
                    setFormula([...formula2, trimmed]);
                }
            }

            setInputValue('');
        } else if (e.key === 'Backspace' && inputValue === '') {
            deleteLastElement();
        }
    };

    const handleSuggestionClick = (suggestion: Suggestion) => {
        const last = formula2[formula2.length - 1];
        if (typeof last === 'object' && last.name === suggestion.name) return;
        setFormula([...formula2, suggestion]);
        setInputValue('');
    };

    const handleReset = (index: number) => {
        const newList = [...submittedFormulas];
        newList.splice(index, 1);
        setSubmittedFormulas(newList);
    };

    return (
      <div className="w-full max-w-3xl mx-auto p-6 bg-white border rounded-xl shadow space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">🧪 Formula Builder</h2>

          {submittedFormulas.map((submittedFormula, idx) => (
            <div key={submittedFormula.map(tag => typeof tag === 'object' && 'key' in tag ? tag.key : uuidv4()).join('-')} className="bg-gray-50 p-4 border rounded-md shadow-sm">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                    {submittedFormula.map((tag, index) => (
                      <span key={typeof tag === 'object' && 'key' in tag ? tag.key : uuidv4()} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm font-medium">
          {typeof tag === 'string' ? tag : tag.name.toString()}
        </span>
                    ))}
                </div>
                <div className="text-right text-md text-gray-700 font-semibold">
                    {evaluateFormula(submittedFormula)}
                </div>
                <div className="mt-2 text-right">
                    <button
                      onClick={() => handleReset(idx)}
                      className="text-sm text-red-600 hover:underline"
                    >
                        ✖ Remove formula
                    </button>
                </div>
            </div>
          ))}


          <div className="flex flex-wrap items-center gap-2 border rounded-md px-3 py-2 shadow-inner bg-gray-100">
              {formula2.map((tag, index) => (
                <Tag key={typeof tag === 'object' && 'key' in tag ? tag.key : uuidv4()} tag={tag} index={index} />
              ))}
              <input
                ref={inputRef}
                className="flex-1 min-w-[150px] bg-white border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter number, variable or operator..."
              />
          </div>

          {filteredSuggestions.length > 0 && (
            <div className="border mt-2 p-2 rounded-md bg-white shadow-md divide-y divide-gray-200">
                {filteredSuggestions.map((sugg) => (
                  <div
                    key={sugg.id}
                    className="cursor-pointer hover:bg-indigo-50 px-2 py-1 text-sm text-gray-800"
                    onClick={() => handleSuggestionClick(sugg)}
                  >
                      <span className="font-medium">{sugg.name}</span>{' '}
                      {sugg.value !== '' && <span className="text-gray-500">({sugg.value})</span>}
                  </div>
                ))}
            </div>
          )}
      </div>
    );
};

export default FormulaInput;
