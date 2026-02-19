import React, { useState, useMemo } from 'react';
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

  // --- MOCK DATA / STATE ---
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'income', amount: 4500, desc: 'Daily Sales', category: 'business', method: 'mpesa', date: new Date().toISOString() },
    { id: 2, type: 'expense', amount: 1200, desc: 'Restock Flour', category: 'business', method: 'mpesa', date: new Date().toISOString() },
    { id: 3, type: 'expense', amount: 500, desc: 'Lunch (Personal)', category: 'personal', method: 'cash', date: new Date().toISOString() },
    { id: 4, type: 'income', amount: 1500, desc: 'M-Pesa Till', category: 'business', method: 'mpesa', date: new Date().toISOString() },
  ]);

  const [inventory, setInventory] = useState([
    { id: 1, name: 'Maize Flour (2kg)', stock: 12, price: 200 },
    { id: 2, name: 'Cooking Oil (1L)', stock: 4, price: 350 }, // Low stock
    { id: 3, name: 'Sugar (1kg)', stock: 20, price: 180 },
  ]);

  const [debts, setDebts] = useState([
    { id: 1, type: 'receivable', person: 'Mama Njoroge', amount: 800, desc: 'Groceries' },
    { id: 2, type: 'payable', person: 'Supplier X', amount: 3500, desc: 'Pending invoice' },
  ]);

  // --- CALCULATIONS ---
  const stats = useMemo(() => {
    let bizIncome = 0;
    let bizExpense = 0;
    let personalExpense = 0;
    let mpesaBalance = 0;
    let cashBalance = 0;

    transactions.forEach(t => {
      if (t.category === 'business') {
        if (t.type === 'income') bizIncome += t.amount;
        if (t.type === 'expense') bizExpense += t.amount;
      } else if (t.category === 'personal' && t.type === 'expense') {
        personalExpense += t.amount;
      }

      // Track balances regardless of business/personal to match real-world pockets
      if (t.method === 'mpesa') {
        mpesaBalance += t.type === 'income' ? t.amount : -t.amount;
      } else {
        cashBalance += t.type === 'income' ? t.amount : -t.amount;
      }
    });

    return {
      bizIncome,
      bizExpense,
      bizProfit: bizIncome - bizExpense,
      personalExpense,
      mpesaBalance,
      cashBalance,
      totTax: bizIncome * 0.015 // 1.5% KRA Turnover Tax
    };
  }, [transactions]);


  // --- HANDLERS ---
  const handleAddTransaction = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newTx = {
      id: Date.now(),
      type: formData.get('type'),
      amount: parseFloat(formData.get('amount')),
      desc: formData.get('desc'),
      category: formData.get('category'),
      method: formData.get('method'),
      date: new Date().toISOString()
    };
    setTransactions([newTx, ...transactions]);
    setIsAddModalOpen(false);
  };


  // --- VIEWS ---
  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Biashara Summary</h1>
          <p className="text-sm text-gray-500">Today's Overview</p>
        </div>
        <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
          BS
        </div>
      </div>

      {/* Main Profit Card */}
      <div className="bg-gray-900 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <TrendingUp size={100} />
        </div>
        <p className="text-gray-400 text-sm font-medium mb-1">Real Business Profit</p>
        <h2 className="text-4xl font-extrabold mb-4">
          <span className="text-lg font-normal text-gray-400 mr-1">KES</span>
          {stats.bizProfit.toLocaleString()}
        </h2>

        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-700">
          <div>
            <p className="text-gray-400 text-xs">Sales In</p>
            <p className="text-green-400 font-semibold flex items-center">
              <ArrowUpRight size={14} className="mr-1" /> {stats.bizIncome.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Biz Expenses</p>
            <p className="text-red-400 font-semibold flex items-center">
              <ArrowDownRight size={14} className="mr-1" /> {stats.bizExpense.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* The "Stop Mixing Money" Warning */}
      {stats.personalExpense > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start space-x-3">
          <AlertCircle className="text-orange-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-semibold text-orange-800">Personal Spending Alert</p>
            <p className="text-xs text-orange-700 mt-1">
              You spent <strong>KES {stats.personalExpense.toLocaleString()}</strong> of business money on personal items. This eats your capital!
            </p>
          </div>
        </div>
      )}

      {/* Wallets */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center text-green-600 mb-2">
            <Smartphone size={18} className="mr-2" />
            <span className="text-xs font-semibold uppercase tracking-wider">M-Pesa</span>
          </div>
          <p className="text-xl font-bold text-gray-800">KES {stats.mpesaBalance.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center text-blue-600 mb-2">
            <Banknote size={18} className="mr-2" />
            <span className="text-xs font-semibold uppercase tracking-wider">Cash Till</span>
          </div>
          <p className="text-xl font-bold text-gray-800">KES {stats.cashBalance.toLocaleString()}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-md font-bold text-gray-800 mb-3">Recent Transactions</h3>
        <div className="space-y-3">
          {transactions.slice(0, 4).map(tx => (
            <div key={tx.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${tx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {tx.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{tx.desc}</p>
                  <p className="text-xs text-gray-500 flex items-center">
                    {tx.category === 'business' ? '🏢 Biz' : '👤 Personal'} • {tx.method}
                  </p>
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
      <h2 className="text-xl font-bold text-gray-900 mb-4">Inventory Tracker</h2>
      {inventory.map(item => (
        <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
          <div>
            <p className="font-semibold text-gray-800">{item.name}</p>
            <p className="text-xs text-gray-500">Selling Price: KES {item.price}</p>
          </div>
          <div className="text-right">
            <p className={`text-xl font-bold ${item.stock < 5 ? 'text-red-500' : 'text-green-600'}`}>
              {item.stock}
            </p>
            <p className="text-xs text-gray-400">In Stock</p>
          </div>
        </div>
      ))}
      <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-semibold hover:bg-gray-50 transition">
        + Add New Product
      </button>
    </div>
  );

  const renderDebts = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h2 className="text-xl font-bold text-gray-900">Debt Manager</h2>

      <div>
        <h3 className="text-sm font-semibold text-green-600 mb-3 uppercase tracking-wider">People Owe Me (Collect)</h3>
        {debts.filter(d => d.type === 'receivable').map(debt => (
          <div key={debt.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center mb-3">
            <div>
              <p className="font-semibold text-gray-800">{debt.person}</p>
              <p className="text-xs text-gray-500">{debt.desc}</p>
            </div>
            <p className="font-bold text-green-600">KES {debt.amount}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-red-500 mb-3 uppercase tracking-wider">I Owe People (Pay)</h3>
        {debts.filter(d => d.type === 'payable').map(debt => (
          <div key={debt.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center mb-3">
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
      <h2 className="text-xl font-bold text-gray-900 mb-2">KRA Tax Estimator</h2>
      <p className="text-sm text-gray-600 mb-4">Don't get caught off guard. We estimate your Turnover Tax (TOT) which is currently 1.5% of your gross business sales.</p>

      <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl text-center">
        <p className="text-blue-800 text-sm font-medium mb-2">Estimated TOT to Pay</p>
        <h3 className="text-4xl font-extrabold text-blue-900 mb-2">KES {stats.totTax.toFixed(2)}</h3>
        <p className="text-xs text-blue-600">Based on KES {stats.bizIncome.toLocaleString()} gross sales</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mt-4">
        <h4 className="font-semibold text-gray-800 mb-2">How it works</h4>
        <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
          <li>TOT is filed and paid monthly.</li>
          <li>It applies to businesses making between KES 1M and 50M annually.</li>
          <li>It does not apply to rental income or professional services.</li>
        </ul>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gray-100 flex justify-center font-sans">
      {/* Mobile Container Simulator */}
      <div className="w-full max-w-md bg-gray-50 h-screen flex flex-col relative shadow-2xl overflow-hidden sm:border-x sm:border-gray-200">

        {/* Main Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-24 p-5 custom-scrollbar">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'inventory' && renderInventory()}
          {activeTab === 'debts' && renderDebts()}
          {activeTab === 'tax' && renderTax()}
        </div>

        {/* Floating Action Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="absolute bottom-24 right-5 w-14 h-14 bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-700 transition transform hover:scale-105 active:scale-95 z-10"
        >
          <Plus size={28} />
        </button>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 w-full bg-white border-t border-gray-200 flex justify-around items-center h-16 px-2 z-10">
          <NavItem icon={<Home />} label="Home" isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<Package />} label="Stock" isActive={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
          <NavItem icon={<Users />} label="Debts" isActive={activeTab === 'debts'} onClick={() => setActiveTab('debts')} />
          <NavItem icon={<Calculator />} label="Tax" isActive={activeTab === 'tax'} onClick={() => setActiveTab('tax')} />
        </div>

        {/* Add Transaction Modal */}
        {isAddModalOpen && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col justify-end animate-in fade-in duration-200">
            <div className="bg-white w-full rounded-t-3xl p-6 animate-in slide-in-from-bottom-10 duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add Record</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddTransaction} className="space-y-4">
                {/* IN / OUT Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <label className="flex-1 text-center cursor-pointer">
                    <input type="radio" name="type" value="income" className="peer sr-only" defaultChecked />
                    <div className="py-2 rounded-lg peer-checked:bg-white peer-checked:shadow-sm peer-checked:text-green-600 font-semibold text-gray-500 transition">
                      Money In
                    </div>
                  </label>
                  <label className="flex-1 text-center cursor-pointer">
                    <input type="radio" name="type" value="expense" className="peer sr-only" />
                    <div className="py-2 rounded-lg peer-checked:bg-white peer-checked:shadow-sm peer-checked:text-red-600 font-semibold text-gray-500 transition">
                      Money Out
                    </div>
                  </label>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Amount (KES)</label>
                  <input required type="number" name="amount" placeholder="0" className="w-full text-3xl font-bold bg-transparent border-b-2 border-gray-200 focus:border-green-500 outline-none py-2" />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">What was it for?</label>
                  <input required type="text" name="desc" placeholder="e.g. Sold 2 packets of Unga" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" />
                </div>

                {/* Crucial: Business vs Personal */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-2">Is this Business or Personal?</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="cursor-pointer">
                      <input type="radio" name="category" value="business" className="peer sr-only" defaultChecked />
                      <div className="border border-gray-200 rounded-xl p-3 text-center peer-checked:border-green-500 peer-checked:bg-green-50 text-gray-600 font-medium transition">
                        🏢 Business
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input type="radio" name="category" value="personal" className="peer sr-only" />
                      <div className="border border-gray-200 rounded-xl p-3 text-center peer-checked:border-orange-500 peer-checked:bg-orange-50 text-gray-600 font-medium transition">
                        👤 Personal
                      </div>
                    </label>
                  </div>
                </div>

                {/* Method */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-2">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="cursor-pointer">
                      <input type="radio" name="method" value="mpesa" className="peer sr-only" defaultChecked />
                      <div className="border border-gray-200 rounded-xl p-3 text-center peer-checked:border-blue-500 peer-checked:bg-blue-50 text-gray-600 font-medium transition">
                        📱 M-Pesa
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input type="radio" name="method" value="cash" className="peer sr-only" />
                      <div className="border border-gray-200 rounded-xl p-3 text-center peer-checked:border-blue-500 peer-checked:bg-blue-50 text-gray-600 font-medium transition">
                        💵 Cash
                      </div>
                    </label>
                  </div>
                </div>

                <button type="submit" className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl mt-4 hover:bg-gray-800 transition">
                  Save Transaction
                </button>
              </form>
            </div>
          </div>
        )}

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
      `}} />
    </div>
  );
}

// Helper Component for Navigation
function NavItem({ icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-16 h-full space-y-1 transition-colors ${isActive ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
    >
      <div className={`${isActive ? 'scale-110' : 'scale-100'} transition-transform duration-200`}>
        {React.cloneElement(icon, { size: 22, strokeWidth: isActive ? 2.5 : 2 })}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
