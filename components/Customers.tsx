import React, { useState } from 'react';
import { Customer } from '../types';
import Modal from './Modal';
import { PlusIcon, EditIcon, DeleteIcon } from './icons/Icons';

interface CustomersProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

const CustomerForm: React.FC<{ customer?: Customer; onSave: (customer: Omit<Customer, 'id'> | Customer) => void; onCancel: () => void }> = ({ customer, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    phone: customer?.phone || '',
    address: customer?.address || '',
  });

  const formInputStyle = "p-2 border border-slate-300 rounded-md w-full bg-slate-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500 focus:ring-1";


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customer) {
      onSave({ ...customer, ...formData });
    } else {
      onSave({ ...formData, id: new Date().toISOString() });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-bold text-slate-700 dark:text-gray-200">{customer ? 'تعديل بيانات العميل' : 'إضافة عميل جديد'}</h3>
      <input name="name" value={formData.name} onChange={handleChange} placeholder="الاسم" className={formInputStyle} required />
      <input name="phone" value={formData.phone} onChange={handleChange} placeholder="رقم الهاتف" className={formInputStyle} />
      <input name="address" value={formData.address} onChange={handleChange} placeholder="العنوان" className={formInputStyle} />
      <div className="flex justify-end space-x-3 space-x-reverse pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500 transition-colors">إلغاء</button>
        <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">حفظ</button>
      </div>
    </form>
  );
};

const Customers: React.FC<CustomersProps> = ({ customers, setCustomers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(undefined);

  const handleSave = (customer: Omit<Customer, 'id'> | Customer) => {
    if ('id' in customer) {
      setCustomers(prev => prev.map(c => c.id === customer.id ? customer : c));
    } else {
      setCustomers(prev => [...prev, { ...customer, id: new Date().toISOString() }]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العميل؟')) {
      setCustomers(prev => prev.filter(c => c.id !== id));
    }
  };

  const openModalForNew = () => {
    setEditingCustomer(undefined);
    setIsModalOpen(true);
  };
  
  const openModalForEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-700 dark:text-gray-200">إدارة العملاء</h2>
        <button onClick={openModalForNew} className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition-colors">
          <PlusIcon className="w-5 h-5 me-2" />
          إضافة عميل
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md overflow-x-auto">
        <table className="w-full min-w-max text-right">
          <thead className="border-b-2 border-slate-200 dark:border-gray-700">
            <tr>
              <th className="p-3 text-sm font-semibold tracking-wide text-slate-600 dark:text-gray-300">الاسم</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-slate-600 dark:text-gray-300">رقم الهاتف</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-slate-600 dark:text-gray-300">العنوان</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-slate-600 dark:text-gray-300">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id} className="border-b border-slate-100 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700/50">
                <td className="p-3 text-sm font-medium text-slate-800 dark:text-gray-200">{c.name}</td>
                <td className="p-3 text-sm text-slate-700 dark:text-gray-300">{c.phone}</td>
                <td className="p-3 text-sm text-slate-700 dark:text-gray-300">{c.address}</td>
                <td className="p-3 flex space-x-2 space-x-reverse">
                  <button onClick={() => openModalForEdit(c)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-full dark:hover:bg-blue-900/50"><EditIcon className="w-5 h-5"/></button>
                  <button onClick={() => handleDelete(c.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full dark:hover:bg-red-900/50"><DeleteIcon className="w-5 h-5"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <CustomerForm customer={editingCustomer} onSave={handleSave} onCancel={closeModal} />
      </Modal>
    </div>
  );
};

export default Customers;