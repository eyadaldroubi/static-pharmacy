import React, { useState, useMemo } from 'react';
import { Medicine } from '../types';
import Modal from './Modal';
import { PlusIcon, EditIcon, DeleteIcon, SearchIcon } from './icons/Icons';

interface MedicinesProps {
  medicines: Medicine[];
  setMedicines: React.Dispatch<React.SetStateAction<Medicine[]>>;
}

const MedicineForm: React.FC<{ medicine?: Medicine; onSave: (medicine: Omit<Medicine, 'id'> | Medicine) => void; onCancel: () => void }> = ({ medicine, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: medicine?.name || '',
    scientificName: medicine?.scientificName || '',
    manufacturer: medicine?.manufacturer || '',
    category: medicine?.category || '',
    expiryDate: medicine?.expiryDate || '',
    quantity: medicine?.quantity || 0,
    price: medicine?.price || 0,
  });
  
  const formInputStyle = "p-2 border border-slate-300 rounded-md w-full bg-slate-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500 focus:ring-1";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (medicine) {
      onSave({ ...medicine, ...formData });
    } else {
      onSave({ ...formData, id: new Date().toISOString() });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-bold text-slate-700 dark:text-gray-200">{medicine ? 'تعديل الدواء' : 'إضافة دواء جديد'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="الاسم التجاري" className={formInputStyle} required />
        <input name="scientificName" value={formData.scientificName} onChange={handleChange} placeholder="الاسم العلمي" className={formInputStyle} required />
        <input name="manufacturer" value={formData.manufacturer} onChange={handleChange} placeholder="الشركة المصنعة" className={formInputStyle} />
        <input name="category" value={formData.category} onChange={handleChange} placeholder="الفئة" className={formInputStyle} />
        <input name="quantity" type="number" value={formData.quantity} onChange={handleChange} placeholder="الكمية" className={formInputStyle} required min="0" />
        <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="السعر" className={formInputStyle} required min="0" step="0.01" />
        <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">تاريخ انتهاء الصلاحية</label>
            <input name="expiryDate" type="date" value={formData.expiryDate} onChange={handleChange} className={formInputStyle} required />
        </div>
      </div>
      <div className="flex justify-end space-x-3 space-x-reverse pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500 transition-colors">إلغاء</button>
        <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">حفظ</button>
      </div>
    </form>
  );
};


const Medicines: React.FC<MedicinesProps> = ({ medicines, setMedicines }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSave = (medicine: Omit<Medicine, 'id'> | Medicine) => {
    if ('id' in medicine) {
      setMedicines(prev => prev.map(m => m.id === medicine.id ? medicine : m));
    } else {
      setMedicines(prev => [...prev, { ...medicine, id: new Date().toISOString() }]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الدواء؟')) {
      setMedicines(prev => prev.filter(m => m.id !== id));
    }
  };
  
  const openModalForNew = () => {
    setEditingMedicine(undefined);
    setIsModalOpen(true);
  };
  
  const openModalForEdit = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMedicine(undefined);
  };

  const filteredMedicines = useMemo(() => {
    return medicines.filter(med => 
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.scientificName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [medicines, searchTerm]);

  const getStatus = (med: Medicine) => {
    const expiry = new Date(med.expiryDate);
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);

    if (expiry < today) return { text: 'منتهي الصلاحية', color: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' };
    if (expiry <= threeMonthsFromNow) return { text: 'قرب الانتهاء', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/40 dark:text-yellow-300' };
    if (med.quantity <= 20) return { text: 'كمية منخفضة', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300' };
    return { text: 'متوفر', color: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-700 dark:text-gray-200">إدارة الأدوية</h2>
        <button onClick={openModalForNew} className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition-colors">
          <PlusIcon className="w-5 h-5 me-2" />
          إضافة دواء
        </button>
      </div>
      
      <div className="relative">
        <input 
          type="text" 
          placeholder="ابحث عن دواء بالاسم التجاري أو العلمي..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-800 dark:border-gray-600"
        />
        <SearchIcon className="w-5 h-5 absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" />
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md overflow-x-auto">
        <table className="w-full min-w-max text-right">
          <thead className="border-b-2 border-slate-200 dark:border-gray-700">
            <tr>
              <th className="p-3 text-sm font-semibold tracking-wide text-slate-600 dark:text-gray-300">الاسم التجاري</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-slate-600 dark:text-gray-300">الكمية</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-slate-600 dark:text-gray-300">السعر</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-slate-600 dark:text-gray-300">تاريخ الانتهاء</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-slate-600 dark:text-gray-300">الحالة</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-slate-600 dark:text-gray-300">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.map(med => {
              const status = getStatus(med);
              return (
                <tr key={med.id} className="border-b border-slate-100 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700/50">
                  <td className="p-3 text-sm font-medium text-slate-800 dark:text-gray-200">{med.name}<br/><span className="text-xs text-slate-500 dark:text-gray-400">{med.scientificName}</span></td>
                  <td className="p-3 text-sm text-slate-700 dark:text-gray-300">{med.quantity}</td>
                  <td className="p-3 text-sm text-green-600 dark:text-green-400 font-bold">{med.price.toFixed(2)} ل.س</td>
                  <td className="p-3 text-sm text-slate-700 dark:text-gray-300">{med.expiryDate}</td>
                  <td className="p-3"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}>{status.text}</span></td>
                  <td className="p-3 flex space-x-2 space-x-reverse">
                    <button onClick={() => openModalForEdit(med)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-full dark:hover:bg-blue-900/50"><EditIcon className="w-5 h-5"/></button>
                    <button onClick={() => handleDelete(med.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full dark:hover:bg-red-900/50"><DeleteIcon className="w-5 h-5"/></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <MedicineForm medicine={editingMedicine} onSave={handleSave} onCancel={closeModal} />
      </Modal>
    </div>
  );
};

export default Medicines;