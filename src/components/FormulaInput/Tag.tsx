import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useFormulaStore } from '@/store/formulaStore';
import { FormulaElement, Suggestion } from '@/types/formula';
import { v4 as uuidv4 } from 'uuid';

function isSuggestion(tag: FormulaElement): tag is Suggestion {
  return typeof tag === 'object' && 'name' in tag && 'id' in tag;
}

interface TagProps {
  tag: FormulaElement;
  index: number;
}

export const Tag: React.FC<TagProps> = ({ tag, index }) => {
  const { formula, setFormula } = useFormulaStore();

  const display = isSuggestion(tag) ? tag.name : tag;

  const handleDelete = () => {
    const updated = [...formula];
    updated.splice(index, 1);
    setFormula(updated);
  };

  const handleRename = () => {
    if (!isSuggestion(tag)) return;
    const newName = prompt('Enter a new name for the tag:', tag.name);
    if (newName && newName.trim() !== '') {
      const updated = [...formula];
      updated[index] = {
        ...tag,
        name: newName.trim()
      };
      setFormula(updated);
    }
  };

  const handleDetails = () => {
    alert(`Tag information: "${display}"
(This can later include a description of the variable or its type)`);
  };

  const tagKey = `${isSuggestion(tag) ? tag.id : tag}-${index}-${uuidv4()}`;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <span
          key={tagKey}
          className="bg-indigo-200 text-indigo-800 px-2 py-1 rounded-full text-sm font-medium cursor-pointer"
        >
          {display}
        </span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        side="bottom"
        sideOffset={4}
        className="bg-white border rounded shadow-md p-2 z-50"
      >
        {isSuggestion(tag) && (
          <DropdownMenu.Item
            className="cursor-pointer p-1 hover:bg-gray-100"
            onSelect={handleRename}
          >
            ✏️ Rename
          </DropdownMenu.Item>
        )}
        <DropdownMenu.Item
          className="cursor-pointer p-1 hover:bg-gray-100"
          onSelect={handleDelete}
        >
          🗑️ Delete
        </DropdownMenu.Item>
        <DropdownMenu.Item
          className="cursor-pointer p-1 hover:bg-gray-100"
          onSelect={handleDetails}
        >
          ℹ️ Details
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
