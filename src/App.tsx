import React from 'react';
import { FormulaInput } from './components/FormulaInput';
import { QueryClient, QueryClientProvider } from 'react-query';
import './index.css';

const queryClient = new QueryClient();

const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="max-w-2xl mx-auto mt-10">
                <FormulaInput />
            </div>
        </QueryClientProvider>
    );
};

export default App;
