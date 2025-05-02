'use client';

import { useState } from 'react';

type Transaction = {
  amount: number;
  tag: string;
  timestamp: string;
};

const tags = ['Food', 'Rent', 'Entertainment', 'Other'];
const amounts = [100, 50, 20, 10, 5, 2, 1, 0.5, 0.25, 0.1, 0.05, 0.01];

export default function Home() {
  const [currentAmount, setCurrentAmount] = useState(0);
  const [selectedTag, setSelectedTag] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<'week' | 'month'>('week');

  const handleAmountClick = (value: number) => {
    setCurrentAmount((prev) => parseFloat((prev + value).toFixed(2)));
  };

  const handleSave = () => {
    if (!selectedTag || currentAmount === 0) return;

    const newTransaction: Transaction = {
      amount: currentAmount,
      tag: selectedTag,
      timestamp: new Date().toISOString(),
    };

    setTransactions([newTransaction, ...transactions]);
    setCurrentAmount(0);
    setSelectedTag('');
  };

  const getFilteredTransactions = () => {
    const now = new Date();
    return transactions.filter((txn) => {
      const date = new Date(txn.timestamp);
      if (filter === 'week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return date >= oneWeekAgo;
      } else {
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      }
    });
  };

  const filteredTransactions = getFilteredTransactions();
  const balance = filteredTransactions.reduce((sum, txn) => sum + txn.amount, 0);

  return (
    <div className="max-w-xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-4">Expense Tracker</h1>

      <div className="text-2xl mb-2">Balance: ${balance.toFixed(2)}</div>

      <div className="grid grid-cols-2 gap-2 my-4">
        {amounts.map((amt) => (
          <button
            key={amt}
            onClick={() => handleAmountClick(amt)}
            className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
          >
            +${amt.toFixed(2)}
          </button>
        ))}
      </div>

      <div className="mb-2">
        <div className="text-lg mb-1">Tag:</div>
        <div className="flex gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded ${
                selectedTag === tag
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 hover:bg-gray-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Save Transaction (${currentAmount.toFixed(2)})
      </button>

      <div className="my-6">
        <h2 className="text-xl font-semibold mb-2">Filter:</h2>
        <div className="flex gap-2">
          {['week', 'month'].map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option as 'week' | 'month')}
              className={`px-3 py-1 rounded ${
                filter === option
                  ? 'bg-purple-500 text-white'
                  : 'bg-blue-500 hover:bg-gray-300'
              }`}
            >
              {option === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Transactions ({filteredTransactions.length})</h2>
        {filteredTransactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <ul className="space-y-2">
            {filteredTransactions.map((txn, idx) => (
              <li key={idx} className="bg-gray-100 p-2 rounded shadow text-black">
                <div>${txn.amount.toFixed(2)} - {txn.tag}</div>
                <div className="text-sm text-black">
                  {new Date(txn.timestamp).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
