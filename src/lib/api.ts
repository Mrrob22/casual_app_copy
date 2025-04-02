import axios from 'axios';
import { Suggestion } from '@/components/FormulaInput/types';

export const fetchSuggestions = async (query: string): Promise<Suggestion[]> => {
    const res = await axios.get(`https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete?search=${query}`);
    return res.data;
};
