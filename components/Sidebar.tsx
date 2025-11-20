import React from 'react';
import { DashboardIcon, MedicineIcon, SalesIcon, PurchaseIcon, CustomerIcon, SupplierIcon, MoonIcon, SunIcon, SupportIcon } from './icons/Icons';

type View = 'dashboard' | 'medicines' | 'sales' | 'purchases' | 'customers' | 'suppliers';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, theme, toggleTheme }) => {
  const navItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: DashboardIcon },
    { id: 'medicines', label: 'الأدوية', icon: MedicineIcon },
    { id: 'sales', label: 'المبيعات', icon: SalesIcon },
    { id: 'purchases', label: 'المشتريات', icon: PurchaseIcon },
    { id: 'customers', label: 'العملاء', icon: CustomerIcon },
    { id: 'suppliers', label: 'الموردون', icon: SupplierIcon },
  ];

  return (
    <aside className="w-64 bg-white shadow-md flex-shrink-0 flex flex-col dark:bg-gray-800 border-r border-slate-200 dark:border-gray-700">
      <div className="p-6 border-b border-slate-200 dark:border-gray-700 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-teal-700 dark:text-teal-500">الصيدلية السورية</h1>
          <p className="text-sm text-slate-500 dark:text-gray-400">نظام الإدارة المتكامل</p>
        </div>
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          aria-label="Toggle dark mode"
        >
          {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
        </button>
      </div>
      <nav className="p-4 flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setView(item.id as View)}
                className={`w-full flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
                  currentView === item.id
                    ? 'bg-teal-600 text-white shadow'
                    : 'text-slate-600 hover:bg-teal-50 hover:text-teal-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-teal-400'
                }`}
              >
                <item.icon className="w-6 h-6 me-3" />
                <span className="font-semibold">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-slate-200 dark:border-gray-700">
        <a 
          href="mailto:support@syrian-pharmacy.com"
          className="w-full flex items-center p-3 my-1 rounded-lg transition-colors duration-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400"
        >
          <SupportIcon className="w-6 h-6 me-3" />
          <span className="font-semibold">خدمة العملاء</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;