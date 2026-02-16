import React, { useState } from 'react';
import { Supplier } from '../types';
import Modal from './Modal';
import { PlusIcon, EditIcon, DeleteIcon } from './icons/Icons';

interface SuppliersProps {
  suppliers: Supplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
}

const SupplierForm: React.FC<{ supplier?: Supplier; onSave: (supplier: Supplier) => void; onCancel: () => void }> = ({ supplier, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    contactPerson: supplier?.contactPerson || '',
    phone: supplier?.phone || '',
    address: supplier?.address || '',
  });

  const formInputStyle = "p-2 border border-slate-300 rounded-md w-full bg-slate-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500 focus:ring-1 text-right";


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ 
      ...formData, 
      id: supplier?.id || `sup_${Date.now()}` 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-bold text-slate-700 dark:text-gray-200">{supplier ? 'تعديل بيانات المورد' : 'إضافة مورد جديد'}</h3>
      <div className="space-y-3 text-right">
        <div>
          <label className="text-sm font-semibold text-slate-600 dark:text-gray-400">اسم الشركة/المستودع</label>
          <input name="name" value={formData.name} onChange={handleChange} placeholder="اسم المورد" className={formInputStyle} required />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-600 dark:text-gray-400">مسؤول التواصل</label>
          <input name="contactPerson" value={formData.contactPerson} onChange={handleChange} placeholder="الاسم" className={formInputStyle} />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-600 dark:text-gray-400">رقم الهاتف</label>
          <input name="phone" value={formData.phone} onChange={handleChange} placeholder="09xxxxxxx" className={formInputStyle} />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-600 dark:text-gray-400">العنوان</label>
          <input name="address" value={formData.address} onChange={handleChange} placeholder="عنوان الشركة" className={formInputStyle} />
        </div>
      </div>
      <div className="flex justify-end space-x-3 space-x-reverse pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500 transition-colors">إلغاء</button>
        <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">حفظ</button>
      </div>
    </form>
  );
};

const Suppliers: React.FC<SuppliersProps> = ({ suppliers, setSuppliers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>(undefined);

  const handleSave = (supplier: Supplier) => {
    setSuppliers(prev => {
      const exists = prev.some(s => s.id === supplier.id);
      if (exists) {
        return prev.map(s => s.id === supplier.id ? supplier : s);
      } else {
        return [...prev, supplier];
      }
    });
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المورد؟')) {
      setSuppliers(prev => prev.filter(s => s.id !== id));
    }
  };

  const openModalForNew = () => {
    setEditingSupplier(undefined);
    setIsModalOpen(true);
  };
  
  const openModalForEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSupplier(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-700 dark:text-gray-200">إدارة الموردين</h2>
        <button onClick={openModalForNew} className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition-colors">
          <PlusIcon className="w-5 h-5 me-2" />
          إضافة مورد
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md overflow-x-auto">
        <table className="w-full min-w-max text-right">
          <thead className="border-b-2 border-slate-200 dark:border-gray-700">
            <tr>
              <th className="p-3 text-sm font-semibold tracking-wide text-slate-600 dark:text-gray-300">اسم الشركة</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-slate-600 dark:text-gray-300">مسؤول التواصل</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-slate-600 dark:text-gray-300">رقم الهاتف</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-slate-600 dark:text-gray-300">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map(s => (
              <tr key={s.id} className="border-b border-slate-100 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700/50">
                <td className="p-3 text-sm font-medium text-slate-800 dark:text-gray-200">{s.name}</td>
                <td className="p-3 text-sm text-slate-700 dark:text-gray-300">{s.contactPerson}</td>
                <td className="p-3 text-sm text-slate-700 dark:text-gray-300">{s.phone}</td>
                <td className="p-3 flex space-x-2 space-x-reverse">
                  <button onClick={() => openModalForEdit(s)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-full dark:hover:bg-blue-900/50"><EditIcon className="w-5 h-5"/></button>
                  <button onClick={() => handleDelete(s.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full dark:hover:bg-red-900/50"><DeleteIcon className="w-5 h-5"/></button>
                </td>
              </tr>
            ))}
            {suppliers.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">لا يوجد موردون مسجلون حالياً</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <SupplierForm supplier={editingSupplier} onSave={handleSave} onCancel={closeModal} />
      </Modal>
    </div>
  );
};

export default Suppliers;
