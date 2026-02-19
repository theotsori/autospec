import React, { useMemo, useState } from 'react';
import {
  Home,
  Wallet,
  Package,
  Users,
  Calculator,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Smartphone,
  Banknote,
  AlertCircle,
  TrendingUp,
  X
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [error, setError] = useState('');

  const [transactions, setTransactions] = useState([
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Calculator,
  Home,
  Package,
  Plus,
  Smartphone,
  TrendingUp,
  Users,
  X
} from 'lucide-react';

type TabKey = 'dashboard' | 'inventory' | 'debts' | 'tax';
type TransactionType = 'income' | 'expense';
type TxCategory = 'business' | 'personal';
type TxMethod = 'mpesa' | 'cash';

type Transaction = {
  id: number;
  type: TransactionType;
  amount: number;
  desc: string;
  category: TxCategory;
  method: TxMethod;
  date: string;
};

type InventoryItem = { id: number; name: string; stock: number; price: number };
type Debt = { id: number; type: 'receivable' | 'payable'; person: string; amount: number; desc: string };

type NavItemProps = {
  icon: React.ReactElement;
  label: string;
  isActive: boolean;
  onClick: () => void;
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, type: 'income', amount: 4500, desc: 'Daily Sales', category: 'business', method: 'mpesa', date: new Date().toISOString() },
    { id: 2, type: 'expense', amount: 1200, desc: 'Restock Flour', category: 'business', method: 'mpesa', date: new Date().toISOString() },
    { id: 3, type: 'expense', amount: 500, desc: 'Lunch (Personal)', category: 'personal', method: 'cash', date: new Date().toISOString() },
    { id: 4, type: 'income', amount: 1500, desc: 'M-Pesa Till', category: 'business', method: 'mpesa', date: new Date().toISOString() }
  ]);

  const [inventory] = useState([
  const [inventory] = useState<InventoryItem[]>([
    { id: 1, name: 'Maize Flour (2kg)', stock: 12, price: 200 },
    { id: 2, name: 'Cooking Oil (1L)', stock: 4, price: 350 },
    { id: 3, name: 'Sugar (1kg)', stock: 20, price: 180 }
  ]);

  const [debts] = useState([
  const [debts] = useState<Debt[]>([
    { id: 1, type: 'receivable', person: 'Mama Njoroge', amount: 800, desc: 'Groceries' },
    { id: 2, type: 'payable', person: 'Supplier X', amount: 3500, desc: 'Pending invoice' }
  ]);

  const stats = useMemo(() => {
    let bizIncome = 0;
    let bizExpense = 0;
    let personalExpense = 0;
    let mpesaBalance = 0;
    let cashBalance = 0;

    transactions.forEach((t) => {
      if (t.category === 'business') {
        if (t.type === 'income') bizIncome += t.amount;
        if (t.type === 'expense') bizExpense += t.amount;
      } else if (t.category === 'personal' && t.type === 'expense') {
        personalExpense += t.amount;
      }

      if (t.method === 'mpesa') mpesaBalance += t.type === 'income' ? t.amount : -t.amount;
      else cashBalance += t.type === 'income' ? t.amount : -t.amount;
    });

    const stockValue = inventory.reduce((sum, item) => sum + item.stock * item.price, 0);
    const owedToMe = debts.filter((d) => d.type === 'receivable').reduce((sum, d) => sum + d.amount, 0);
    const iOwe = debts.filter((d) => d.type === 'payable').reduce((sum, d) => sum + d.amount, 0);
    const safetyColor = bizIncome - bizExpense >= 0 ? 'green' : 'red';

    return {
      bizIncome,
      bizExpense,
      bizProfit: bizIncome - bizExpense,
      personalExpense,
      mpesaBalance,
      cashBalance,
      stockValue,
      owedToMe,
      iOwe,
      safetyColor,
      totTax: bizIncome * 0.015
    };
  }, [transactions, inventory, debts]);

  const handleAddTransaction = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const amount = Number(formData.get('amount'));
    const desc = String(formData.get('desc') || '').trim();

    if (!amount || amount <= 0 || !desc) {
      setError('Please enter a valid amount and description.');
      return;
    }

    const newTx = {
      id: Date.now(),
      type: formData.get('type'),
      amount,
      desc,
      category: formData.get('category'),
      method: formData.get('method'),
      date: new Date().toISOString()
    };

    setTransactions([newTx, ...transactions]);
    setError('');
    setIsAddModalOpen(false);
    e.target.reset();
  };

  const renderDashboard = () => (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Biashara Summary</h1>
          <p className="text-sm text-gray-500">Did I make money today?</p>
        </div>
        <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">BS</div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-15"><TrendingUp size={88} /></div>
        <div className="flex items-center justify-between">
          <p className="text-gray-300 text-sm font-medium">Real Business Profit</p>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stats.safetyColor === 'green' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
            {stats.safetyColor === 'green' ? 'SAFE' : 'DANGER'}
          </span>
        </div>
        <h2 className="text-4xl font-extrabold mt-1">
          <span className="text-lg font-normal text-gray-400 mr-1">KES</span>
          {stats.bizProfit.toLocaleString()}
        </h2>

        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-700">
          <div>
            <p className="text-gray-400 text-xs">Sales In</p>
            <p className="text-green-400 font-semibold flex items-center"><ArrowUpRight size={14} className="mr-1" /> {stats.bizIncome.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Biz Expenses</p>
            <p className="text-red-400 font-semibold flex items-center"><ArrowDownRight size={14} className="mr-1" /> {stats.bizExpense.toLocaleString()}</p>
      totTax: bizIncome * 0.015
    };
  }, [transactions]);

  const handleAddTransaction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const amount = Number(formData.get('amount'));
    if (!Number.isFinite(amount) || amount <= 0) return;

    const newTx: Transaction = {
      id: Date.now(),
      type: (formData.get('type') as TransactionType) ?? 'income',
      amount,
      desc: String(formData.get('desc') ?? ''),
      category: (formData.get('category') as TxCategory) ?? 'business',
      method: (formData.get('method') as TxMethod) ?? 'mpesa',
      date: new Date().toISOString()
    };

    setTransactions((prev) => [newTx, ...prev]);
    setIsAddModalOpen(false);
    e.currentTarget.reset();
  };

  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Biashara Summary</h1>
          <p className="text-sm text-gray-500">Today&apos;s Overview</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">BS</div>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-gray-900 p-5 text-white shadow-lg">
        <div className="absolute right-0 top-0 p-4 opacity-10">
          <TrendingUp size={100} />
        </div>
        <p className="mb-1 text-sm font-medium text-gray-400">Real Business Profit</p>
        <h2 className="mb-4 text-4xl font-extrabold">
          <span className="mr-1 text-lg font-normal text-gray-400">KES</span>
          {stats.bizProfit.toLocaleString()}
        </h2>

        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-700 pt-4">
          <div>
            <p className="text-xs text-gray-400">Sales In</p>
            <p className="flex items-center font-semibold text-green-400">
              <ArrowUpRight size={14} className="mr-1" /> {stats.bizIncome.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Biz Expenses</p>
            <p className="flex items-center font-semibold text-red-400">
              <ArrowDownRight size={14} className="mr-1" /> {stats.bizExpense.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SummaryCard icon={<Smartphone size={16} />} label="M-Pesa" amount={stats.mpesaBalance} tone="green" />
        <SummaryCard icon={<Banknote size={16} />} label="Cash Till" amount={stats.cashBalance} tone="blue" />
        <SummaryCard icon={<Package size={16} />} label="Stock Value" amount={stats.stockValue} tone="amber" />
        <SummaryCard icon={<Wallet size={16} />} label="Net Debt" amount={stats.owedToMe - stats.iOwe} tone="purple" />
      </div>

      {stats.personalExpense > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start space-x-3">
          <AlertCircle className="text-orange-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-semibold text-orange-800">Personal Spending Alert</p>
            <p className="text-xs text-orange-700 mt-1">You spent <strong>KES {stats.personalExpense.toLocaleString()}</strong> from business money. Separate pockets to protect growth.</p>
      {stats.personalExpense > 0 && (
        <div className="flex items-start space-x-3 rounded-xl border border-orange-200 bg-orange-50 p-4">
          <AlertCircle className="mt-0.5 shrink-0 text-orange-500" size={20} />
          <div>
            <p className="text-sm font-semibold text-orange-800">Personal Spending Alert</p>
            <p className="mt-1 text-xs text-orange-700">
              You spent <strong>KES {stats.personalExpense.toLocaleString()}</strong> of business money on personal items. This eats your capital!
            </p>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-md font-bold text-gray-800 mb-3">Recent Transactions</h3>
        <div className="space-y-3">
          {transactions.slice(0, 5).map((tx) => (
            <div key={tx.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${tx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center text-green-600">
            <Smartphone size={18} className="mr-2" />
            <span className="text-xs font-semibold uppercase tracking-wider">M-Pesa</span>
          </div>
          <p className="text-xl font-bold text-gray-800">KES {stats.mpesaBalance.toLocaleString()}</p>
        </div>
        <div className="flex flex-col justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center text-blue-600">
            <Banknote size={18} className="mr-2" />
            <span className="text-xs font-semibold uppercase tracking-wider">Cash Till</span>
          </div>
          <p className="text-xl font-bold text-gray-800">KES {stats.cashBalance.toLocaleString()}</p>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-md font-bold text-gray-800">Recent Transactions</h3>
        <div className="space-y-3">
          {transactions.slice(0, 4).map((tx) => (
            <div key={tx.id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className={`rounded-lg p-2 ${tx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {tx.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{tx.desc}</p>
                  <p className="text-xs text-gray-500">{tx.category === 'business' ? '🏢 Business' : '👤 Personal'} • {tx.method}</p>
                </div>
              </div>
              <p className={`font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-gray-800'}`}>{tx.type === 'income' ? '+' : '-'} {tx.amount}</p>
                  <p className="flex items-center text-xs text-gray-500">{tx.category === 'business' ? '🏢 Biz' : '👤 Personal'} • {tx.method}</p>
                </div>
              </div>
              <p className={`font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-gray-800'}`}>
                {tx.type === 'income' ? '+' : '-'} {tx.amount}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h2 className="text-xl font-bold text-gray-900">Inventory Tracker</h2>
      {inventory.map((item) => (
        <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
      <h2 className="mb-4 text-xl font-bold text-gray-900">Inventory Tracker</h2>
      {inventory.map((item) => (
        <div key={item.id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div>
            <p className="font-semibold text-gray-800">{item.name}</p>
            <p className="text-xs text-gray-500">Selling Price: KES {item.price}</p>
          </div>
          <div className="text-right">
            <p className={`text-xl font-bold ${item.stock < 5 ? 'text-red-500' : 'text-green-600'}`}>{item.stock}</p>
            <p className="text-xs text-gray-400">{item.stock < 5 ? 'Low Stock' : 'In Stock'}</p>
          </div>
        </div>
      ))}
      <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-semibold hover:bg-gray-50 transition">+ Add New Product</button>
            <p className="text-xs text-gray-400">In Stock</p>
          </div>
        </div>
      ))}
      <button className="w-full rounded-xl border-2 border-dashed border-gray-300 py-3 font-semibold text-gray-500 transition hover:bg-gray-50">+ Add New Product</button>
    </div>
  );

  const renderDebts = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h2 className="text-xl font-bold text-gray-900">Debt Manager</h2>

      <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-sm text-green-800">Money owed to you: <strong>KES {stats.owedToMe.toLocaleString()}</strong></div>
      <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-800">Money you owe: <strong>KES {stats.iOwe.toLocaleString()}</strong></div>

      <div>
        <h3 className="text-sm font-semibold text-green-600 mb-3 uppercase tracking-wider">People Owe Me</h3>
        {debts.filter((d) => d.type === 'receivable').map((debt) => (
          <div key={debt.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center mb-3">
            <div><p className="font-semibold text-gray-800">{debt.person}</p><p className="text-xs text-gray-500">{debt.desc}</p></div>
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-green-600">People Owe Me (Collect)</h3>
        {debts.filter((d) => d.type === 'receivable').map((debt) => (
          <div key={debt.id} className="mb-3 flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div>
              <p className="font-semibold text-gray-800">{debt.person}</p>
              <p className="text-xs text-gray-500">{debt.desc}</p>
            </div>
            <p className="font-bold text-green-600">KES {debt.amount}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-red-500 mb-3 uppercase tracking-wider">I Owe People</h3>
        {debts.filter((d) => d.type === 'payable').map((debt) => (
          <div key={debt.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center mb-3">
            <div><p className="font-semibold text-gray-800">{debt.person}</p><p className="text-xs text-gray-500">{debt.desc}</p></div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-red-500">I Owe People (Pay)</h3>
        {debts.filter((d) => d.type === 'payable').map((debt) => (
          <div key={debt.id} className="mb-3 flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div>
              <p className="font-semibold text-gray-800">{debt.person}</p>
              <p className="text-xs text-gray-500">{debt.desc}</p>
            </div>
            <p className="font-bold text-red-500">KES {debt.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTax = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h2 className="text-xl font-bold text-gray-900">KRA Tax Estimator</h2>
      <p className="text-sm text-gray-600">Turnover Tax (TOT) estimate at 1.5% of gross business sales.</p>

      <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl text-center">
        <p className="text-blue-800 text-sm font-medium mb-2">Estimated TOT to Pay</p>
        <h3 className="text-4xl font-extrabold text-blue-900 mb-2">KES {stats.totTax.toFixed(2)}</h3>
        <p className="text-xs text-blue-600">Based on KES {stats.bizIncome.toLocaleString()} gross sales</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <h4 className="font-semibold text-gray-800 mb-2">Today action</h4>
        <p className="text-sm text-gray-600">Set aside <strong>KES {(stats.totTax / 30).toFixed(2)}</strong> today to avoid month-end tax pressure.</p>
      <h2 className="mb-2 text-xl font-bold text-gray-900">KRA Tax Estimator</h2>
      <p className="mb-4 text-sm text-gray-600">
        Don&apos;t get caught off guard. We estimate your Turnover Tax (TOT) which is currently 1.5% of your gross business sales.
      </p>

      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 text-center">
        <p className="mb-2 text-sm font-medium text-blue-800">Estimated TOT to Pay</p>
        <h3 className="mb-2 text-4xl font-extrabold text-blue-900">KES {stats.totTax.toFixed(2)}</h3>
        <p className="text-xs text-blue-600">Based on KES {stats.bizIncome.toLocaleString()} gross sales</p>
      </div>

      <div className="mt-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <h4 className="mb-2 font-semibold text-gray-800">How it works</h4>
        <ul className="list-disc space-y-2 pl-4 text-sm text-gray-600">
          <li>TOT is filed and paid monthly.</li>
          <li>It applies to businesses making between KES 1M and 50M annually.</li>
          <li>It does not apply to rental income or professional services.</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex justify-center font-sans">
      <div className="w-full max-w-md bg-gray-50 h-screen flex flex-col relative shadow-2xl overflow-hidden sm:border-x sm:border-gray-200">
        <div className="flex-1 overflow-y-auto pb-24 p-5 custom-scrollbar">
    <div className="flex min-h-screen justify-center bg-gray-100 font-sans">
      <div className="relative flex h-screen w-full max-w-md flex-col overflow-hidden bg-gray-50 shadow-2xl sm:border-x sm:border-gray-200">
        <div className="custom-scrollbar flex-1 overflow-y-auto p-5 pb-24">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'inventory' && renderInventory()}
          {activeTab === 'debts' && renderDebts()}
          {activeTab === 'tax' && renderTax()}
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="absolute bottom-24 right-5 w-14 h-14 bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-700 transition transform hover:scale-105 active:scale-95 z-10"
          className="absolute bottom-24 right-5 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition hover:scale-105 hover:bg-green-700 active:scale-95"
        >
          <Plus size={28} />
        </button>

        <div className="absolute bottom-0 w-full bg-white/95 backdrop-blur border-t border-gray-200 flex justify-around items-center h-16 px-2 z-10">
        <div className="absolute bottom-0 z-10 flex h-16 w-full items-center justify-around border-t border-gray-200 bg-white px-2">
          <NavItem icon={<Home />} label="Home" isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<Package />} label="Stock" isActive={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
          <NavItem icon={<Users />} label="Debts" isActive={activeTab === 'debts'} onClick={() => setActiveTab('debts')} />
          <NavItem icon={<Calculator />} label="Tax" isActive={activeTab === 'tax'} onClick={() => setActiveTab('tax')} />
        </div>

        {isAddModalOpen && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col justify-end animate-in fade-in duration-200">
            <div className="bg-white w-full rounded-t-3xl p-6 animate-in slide-in-from-bottom-10 duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add Record</h3>
                <button onClick={() => { setIsAddModalOpen(false); setError(''); }} className="p-2 bg-gray-100 rounded-full text-gray-500"><X size={20} /></button>
              </div>

              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <label className="flex-1 text-center cursor-pointer">
                    <input type="radio" name="type" value="income" className="peer sr-only" defaultChecked />
                    <div className="py-2 rounded-lg peer-checked:bg-white peer-checked:shadow-sm peer-checked:text-green-600 font-semibold text-gray-500 transition">Money In</div>
                  </label>
                  <label className="flex-1 text-center cursor-pointer">
                    <input type="radio" name="type" value="expense" className="peer sr-only" />
                    <div className="py-2 rounded-lg peer-checked:bg-white peer-checked:shadow-sm peer-checked:text-red-600 font-semibold text-gray-500 transition">Money Out</div>
          <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full rounded-t-3xl bg-white p-6 animate-in slide-in-from-bottom-10 duration-300">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Add Record</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="rounded-full bg-gray-100 p-2 text-gray-500">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div className="flex rounded-xl bg-gray-100 p-1">
                  <label className="flex-1 cursor-pointer text-center">
                    <input type="radio" name="type" value="income" className="peer sr-only" defaultChecked />
                    <div className="rounded-lg py-2 font-semibold text-gray-500 transition peer-checked:bg-white peer-checked:text-green-600 peer-checked:shadow-sm">Money In</div>
                  </label>
                  <label className="flex-1 cursor-pointer text-center">
                    <input type="radio" name="type" value="expense" className="peer sr-only" />
                    <div className="rounded-lg py-2 font-semibold text-gray-500 transition peer-checked:bg-white peer-checked:text-red-600 peer-checked:shadow-sm">Money Out</div>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Amount (KES)</label>
                  <input required type="number" min="1" name="amount" placeholder="0" className="w-full text-3xl font-bold bg-transparent border-b-2 border-gray-200 focus:border-green-500 outline-none py-2" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">What was it for?</label>
                  <input required type="text" name="desc" placeholder="e.g. Sold 2 packets of Unga" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-2">Is this Business or Personal?</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="cursor-pointer">
                      <input type="radio" name="category" value="business" className="peer sr-only" defaultChecked />
                      <div className="border border-gray-200 rounded-xl p-3 text-center peer-checked:border-green-500 peer-checked:bg-green-50 text-gray-600 font-medium transition">🏢 Business</div>
                    </label>
                    <label className="cursor-pointer">
                      <input type="radio" name="category" value="personal" className="peer sr-only" />
                      <div className="border border-gray-200 rounded-xl p-3 text-center peer-checked:border-orange-500 peer-checked:bg-orange-50 text-gray-600 font-medium transition">👤 Personal</div>
                  <label className="mb-1 block text-xs font-semibold text-gray-500">Amount (KES)</label>
                  <input required type="number" min="1" name="amount" placeholder="0" className="w-full border-b-2 border-gray-200 bg-transparent py-2 text-3xl font-bold outline-none focus:border-green-500" />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-500">What was it for?</label>
                  <input required type="text" name="desc" placeholder="e.g. Sold 2 packets of Unga" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20" />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-gray-500">Is this Business or Personal?</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="cursor-pointer">
                      <input type="radio" name="category" value="business" className="peer sr-only" defaultChecked />
                      <div className="rounded-xl border border-gray-200 p-3 text-center font-medium text-gray-600 transition peer-checked:border-green-500 peer-checked:bg-green-50">🏢 Business</div>
                    </label>
                    <label className="cursor-pointer">
                      <input type="radio" name="category" value="personal" className="peer sr-only" />
                      <div className="rounded-xl border border-gray-200 p-3 text-center font-medium text-gray-600 transition peer-checked:border-orange-500 peer-checked:bg-orange-50">👤 Personal</div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-2">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="cursor-pointer">
                      <input type="radio" name="method" value="mpesa" className="peer sr-only" defaultChecked />
                      <div className="border border-gray-200 rounded-xl p-3 text-center peer-checked:border-blue-500 peer-checked:bg-blue-50 text-gray-600 font-medium transition">📱 M-Pesa</div>
                    </label>
                    <label className="cursor-pointer">
                      <input type="radio" name="method" value="cash" className="peer sr-only" />
                      <div className="border border-gray-200 rounded-xl p-3 text-center peer-checked:border-blue-500 peer-checked:bg-blue-50 text-gray-600 font-medium transition">💵 Cash</div>
                  <label className="mb-2 block text-xs font-semibold text-gray-500">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="cursor-pointer">
                      <input type="radio" name="method" value="mpesa" className="peer sr-only" defaultChecked />
                      <div className="rounded-xl border border-gray-200 p-3 text-center font-medium text-gray-600 transition peer-checked:border-blue-500 peer-checked:bg-blue-50">📱 M-Pesa</div>
                    </label>
                    <label className="cursor-pointer">
                      <input type="radio" name="method" value="cash" className="peer sr-only" />
                      <div className="rounded-xl border border-gray-200 p-3 text-center font-medium text-gray-600 transition peer-checked:border-blue-500 peer-checked:bg-blue-50">💵 Cash</div>
                    </label>
                  </div>
                </div>

                {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

                <button type="submit" className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl mt-2 hover:bg-gray-800 transition">Save Transaction</button>
                <button type="submit" className="mt-4 w-full rounded-xl bg-gray-900 py-4 font-bold text-white transition hover:bg-gray-800">Save Transaction</button>
              </form>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `.custom-scrollbar::-webkit-scrollbar{width:0px;background:transparent;}` }} />
    </div>
  );
}

function SummaryCard({ icon, label, amount, tone }) {
  const tones = {
    green: 'text-green-700 bg-green-50 border-green-100',
    blue: 'text-blue-700 bg-blue-50 border-blue-100',
    amber: 'text-amber-700 bg-amber-50 border-amber-100',
    purple: 'text-purple-700 bg-purple-50 border-purple-100'
  };

  return (
    <div className={`rounded-xl border p-3 shadow-sm ${tones[tone]}`}>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide mb-2">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-base font-bold">KES {amount.toLocaleString()}</p>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .custom-scrollbar::-webkit-scrollbar { width: 0; background: transparent; }
        `
        }}
      />
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-16 h-full space-y-1 transition-colors ${isActive ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}>
function NavItem({ icon, label, isActive, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex h-full w-16 flex-col items-center justify-center space-y-1 transition-colors ${isActive ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
    >
      <div className={`${isActive ? 'scale-110' : 'scale-100'} transition-transform duration-200`}>
        {React.cloneElement(icon, { size: 22, strokeWidth: isActive ? 2.5 : 2 })}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
