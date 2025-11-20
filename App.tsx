import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Medicines from './components/Medicines';
import Sales from './components/Sales';
import Purchases from './components/Purchases';
import Customers from './components/Customers';
import Suppliers from './components/Suppliers';
import { Medicine, Sale, Purchase, Customer, Supplier } from './types';
import { initialMedicines, initialSales, initialPurchases, initialCustomers, initialSuppliers } from './data';

type View = 'dashboard' | 'medicines' | 'sales' | 'purchases' | 'customers' | 'suppliers';

export default function App() {
  const [view, setView] = useState<View>('dashboard');

  // This would typically be a global state management solution (like Context or Redux)
  // For simplicity, we manage state here and pass it down.
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedTheme = window.localStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };


  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard medicines={medicines} sales={sales} />;
      case 'medicines':
        return <Medicines medicines={medicines} setMedicines={setMedicines} />;
      case 'sales':
        return <Sales sales={sales} setSales={setSales} medicines={medicines} setMedicines={setMedicines} customers={customers} />;
      case 'purchases':
        return <Purchases purchases={purchases} setPurchases={setPurchases} medicines={medicines} setMedicines={setMedicines} suppliers={suppliers} />;
      case 'customers':
        return <Customers customers={customers} setCustomers={setCustomers} />;
      case 'suppliers':
        return <Suppliers suppliers={suppliers} setSuppliers={setSuppliers} />;
      default:
        return <Dashboard medicines={medicines} sales={sales} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800 dark:bg-gray-900 dark:text-gray-200">
      <Sidebar currentView={view} setView={setView} theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
}