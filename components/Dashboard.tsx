import React from 'react';
import { Medicine, Sale } from '../types';
import { ChartBarIcon, ClockIcon, ExclamationTriangleIcon, TagIcon } from './icons/Icons';

interface DashboardProps {
  medicines: Medicine[];
  sales: Sale[];
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; color: string }> = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center space-x-4 space-x-reverse">
    <div className={`p-4 rounded-full ${color}`}>
      <Icon className="w-8 h-8 text-white" />
    </div>
    <div>
      <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold text-slate-900 dark:text-gray-100">{value}</p>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ medicines, sales }) => {
  const totalMedicines = medicines.length;
  const lowStockMedicines = medicines.filter(m => m.quantity <= 20).length;
  
  const expiringSoonCount = medicines.filter(m => {
    const expiry = new Date(m.expiryDate);
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);
    return expiry > today && expiry <= threeMonthsFromNow;
  }).length;
  
  const totalSalesToday = sales
    .filter(s => new Date(s.date).toDateString() === new Date().toDateString())
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const recentSales = [...sales].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-slate-700 dark:text-gray-200">لوحة التحكم</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="إجمالي المبيعات اليوم" value={`${totalSalesToday.toFixed(2)} ل.س`} icon={ChartBarIcon} color="bg-blue-500" />
        <StatCard title="الأدوية المتوفرة" value={totalMedicines} icon={TagIcon} color="bg-teal-500" />
        <StatCard title="أدوية أوشكت على الانتهاء" value={lowStockMedicines} icon={ExclamationTriangleIcon} color="bg-yellow-500" />
        <StatCard title="أدوية تقترب من انتهاء الصلاحية" value={expiringSoonCount} icon={ClockIcon} color="bg-red-500" />
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-slate-700 dark:text-gray-200 mb-4">آخر المبيعات</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="border-b-2 border-slate-200 dark:border-gray-700">
              <tr>
                <th className="p-3 text-sm font-semibold tracking-wide text-slate-600 dark:text-gray-300">رقم الفاتورة</th>
                <th className="p-3 text-sm font-semibold tracking-wide text-slate-600 dark:text-gray-300">التاريخ</th>
                <th className="p-3 text-sm font-semibold tracking-wide text-slate-600 dark:text-gray-300">عدد الأصناف</th>
                <th className="p-3 text-sm font-semibold tracking-wide text-slate-600 dark:text-gray-300">الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.map(sale => (
                <tr key={sale.id} className="border-b border-slate-100 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700/50">
                  <td className="p-3 text-sm text-slate-700 dark:text-gray-300">{sale.id}</td>
                  <td className="p-3 text-sm text-slate-700 dark:text-gray-300">{new Date(sale.date).toLocaleString('ar-SA')}</td>
                  <td className="p-3 text-sm text-slate-700 dark:text-gray-300">{sale.items.length}</td>
                  <td className="p-3 text-sm text-green-600 dark:text-green-400 font-bold">{sale.totalAmount.toFixed(2)} ل.س</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;