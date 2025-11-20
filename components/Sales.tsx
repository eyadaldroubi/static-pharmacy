import React, { useState, useMemo } from 'react';
import { Sale, Medicine, Customer, SaleItem } from '../types';
import { SearchIcon, PlusIcon, DeleteIcon } from './icons/Icons';

interface SalesProps {
  sales: Sale[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  medicines: Medicine[];
  setMedicines: React.Dispatch<React.SetStateAction<Medicine[]>>;
  customers: Customer[];
}

const Sales: React.FC<SalesProps> = ({ sales, setSales, medicines, setMedicines, customers }) => {
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredMedicines = useMemo(() => {
    return medicines.filter(med => 
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) && med.quantity > 0
    );
  }, [medicines, searchTerm]);
  
  const addToCart = (medicine: Medicine) => {
    const existingItem = cart.find(item => item.medicineId === medicine.id);
    if (existingItem) {
      if (existingItem.quantity < medicine.quantity) {
        setCart(cart.map(item => item.medicineId === medicine.id ? { ...item, quantity: item.quantity + 1 } : item));
      } else {
        alert('لا يمكن إضافة كمية أكبر من المتوفر بالمخزون');
      }
    } else {
      setCart([...cart, { medicineId: medicine.id, quantity: 1, unitPrice: medicine.price }]);
    }
  };

  const removeFromCart = (medicineId: string) => {
    setCart(cart.filter(item => item.medicineId !== medicineId));
  };
  
  const updateCartQuantity = (medicineId: string, quantity: number) => {
    const medicine = medicines.find(m => m.id === medicineId);
    if (medicine && quantity > 0 && quantity <= medicine.quantity) {
      setCart(cart.map(item => item.medicineId === medicineId ? { ...item, quantity } : item));
    } else if (quantity > medicine!.quantity) {
        alert('لا يمكن إضافة كمية أكبر من المتوفر بالمخزون');
    }
  };
  
  const totalAmount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
  }, [cart]);

  const completeSale = () => {
    if (cart.length === 0) {
      alert('السلة فارغة!');
      return;
    }
    
    // Create new sale
    const newSale: Sale = {
      id: `S${Date.now()}`,
      items: cart,
      totalAmount,
      // FIX: Corrected typo from 'new new Date()' to 'new Date()'
      date: new Date().toISOString(),
    };
    setSales(prev => [newSale, ...prev]);
    
    // Update stock
    let updatedMedicines = [...medicines];
    cart.forEach(item => {
      updatedMedicines = updatedMedicines.map(med => 
        med.id === item.medicineId ? { ...med, quantity: med.quantity - item.quantity } : med
      );
    });
    setMedicines(updatedMedicines);
    
    // Clear cart
    setCart([]);
    alert('تمت عملية البيع بنجاح!');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-700 dark:text-gray-200">نقطة البيع</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Medicines List */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
          <div className="relative mb-4">
            <input 
              type="text" 
              placeholder="ابحث عن دواء..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 dark:border-gray-600"
            />
            <SearchIcon className="w-5 h-5 absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" />
          </div>
          <div className="h-96 overflow-y-auto">
            <table className="w-full text-right">
              <thead className="sticky top-0 bg-slate-50 dark:bg-gray-700/50">
                <tr>
                  <th className="p-2 text-sm font-semibold text-slate-600 dark:text-gray-300">الدواء</th>
                  <th className="p-2 text-sm font-semibold text-slate-600 dark:text-gray-300">الكمية المتوفرة</th>
                  <th className="p-2 text-sm font-semibold text-slate-600 dark:text-gray-300">السعر</th>
                  <th className="p-2 text-sm font-semibold text-slate-600 dark:text-gray-300"></th>
                </tr>
              </thead>
              <tbody>
                {filteredMedicines.map(med => (
                  <tr key={med.id} className="border-b border-slate-100 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700/50">
                    <td className="p-2 text-slate-800 dark:text-gray-200">{med.name}</td>
                    <td className="p-2 text-slate-700 dark:text-gray-300">{med.quantity}</td>
                    <td className="p-2 text-slate-700 dark:text-gray-300">{med.price.toFixed(2)}</td>
                    <td className="p-2 text-left">
                      <button onClick={() => addToCart(med)} className="p-2 text-teal-500 hover:bg-teal-100 dark:hover:bg-teal-900/50 rounded-full">
                        <PlusIcon className="w-5 h-5"/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-col">
          <h3 className="text-xl font-bold mb-4 border-b border-slate-200 dark:border-gray-700 pb-2 text-slate-700 dark:text-gray-200">سلة المبيعات</h3>
          <div className="flex-grow space-y-2 overflow-y-auto">
            {cart.map(item => {
              const medicine = medicines.find(m => m.id === item.medicineId);
              if (!medicine) return null;
              return (
                <div key={item.medicineId} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-gray-700/50 rounded-md">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-gray-200">{medicine.name}</p>
                    <p className="text-sm text-slate-500 dark:text-gray-400">{(item.unitPrice * item.quantity).toFixed(2)} س.ل</p>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input 
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateCartQuantity(item.medicineId, parseInt(e.target.value, 10))}
                      className="w-16 p-1 border border-slate-300 rounded bg-white dark:bg-gray-600 dark:border-gray-500"
                      min="1"
                      max={medicine.quantity}
                    />
                    <button onClick={() => removeFromCart(item.medicineId)} className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full">
                      <DeleteIcon className="w-5 h-5"/>
                    </button>
                  </div>
                </div>
              );
            })}
             {cart.length === 0 && <p className="text-center text-slate-500 py-8">السلة فارغة</p>}
          </div>
          <div className="border-t border-slate-200 dark:border-gray-700 mt-4 pt-4">
            <div className="flex justify-between items-center text-xl font-bold text-slate-800 dark:text-gray-200">
              <span>الإجمالي</span>
              <span>{totalAmount.toFixed(2)} ل.س</span>
            </div>
            <button onClick={completeSale} className="w-full mt-4 p-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors">
              إتمام البيع
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;