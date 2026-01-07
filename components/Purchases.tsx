
import React, { useState, useMemo } from 'react';
import { Purchase, PurchaseItem, Medicine, Supplier } from '../types';
import Modal from './Modal';
import { PlusIcon, DeleteIcon, PrinterIcon } from './icons/Icons';

interface PurchasesProps {
  purchases: Purchase[];
  setPurchases: React.Dispatch<React.SetStateAction<Purchase[]>>;
  medicines: Medicine[];
  setMedicines: React.Dispatch<React.SetStateAction<Medicine[]>>;
  suppliers: Supplier[];
}

const PurchaseInvoiceView: React.FC<{ purchase: Purchase, medicines: Medicine[], suppliers: Supplier[], onPrint: () => void }> = ({ purchase, medicines, suppliers, onPrint }) => {
    const supplier = suppliers.find(s => s.id === purchase.supplierId);
    
    return (
        <div className="p-8 bg-white text-slate-900 rounded-lg">
            <div id="printable-invoice" className="space-y-6">
                <div className="flex justify-between items-start border-b-2 border-slate-200 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-teal-700">الصيدلية السورية</h1>
                        <p className="text-slate-500">نظام إدارة الصيدلية المتكامل</p>
                    </div>
                    <div className="text-left">
                        <h2 className="text-xl font-bold">فاتورة مشتريات</h2>
                        <p className="text-sm">رقم الفاتورة: <span className="font-mono">{purchase.id}</span></p>
                        <p className="text-sm">التاريخ: {new Date(purchase.date).toLocaleString('ar-SA')}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <h3 className="font-bold mb-2 border-b border-slate-200 pb-1">معلومات المورد:</h3>
                        <p><span className="font-semibold">الاسم:</span> {supplier?.name || 'مورد غير معروف'}</p>
                        <p><span className="font-semibold">الهاتف:</span> {supplier?.phone || '-'}</p>
                        <p><span className="font-semibold">العنوان:</span> {supplier?.address || '-'}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg text-left">
                        <h3 className="font-bold mb-2 border-b border-slate-200 pb-1">تفاصيل الصيدلية:</h3>
                        <p>صيدلية المجتمع</p>
                        <p>دمشق، سوريا</p>
                        <p>هاتف: 011-1234567</p>
                    </div>
                </div>

                <table className="w-full text-right border-collapse">
                    <thead>
                        <tr className="bg-slate-100 text-slate-700">
                            <th className="p-3 border">الدواء</th>
                            <th className="p-3 border text-center">الكمية</th>
                            <th className="p-3 border text-center">السعر الإفرادي</th>
                            <th className="p-3 border text-center">الإجمالي</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchase.items.map((item, idx) => {
                            const medicine = medicines.find(m => m.id === item.medicineId);
                            return (
                                <tr key={idx} className="border-b">
                                    <td className="p-3 border">{medicine?.name || 'غير معروف'}</td>
                                    <td className="p-3 border text-center">{item.quantity}</td>
                                    <td className="p-3 border text-center font-mono">{item.costPrice.toLocaleString()} ل.س</td>
                                    <td className="p-3 border text-center font-bold font-mono">{(item.quantity * item.costPrice).toLocaleString()} ل.س</td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr className="bg-slate-50 font-bold">
                            <td colSpan={3} className="p-3 border text-left">إجمالي الفاتورة:</td>
                            <td className="p-3 border text-center text-teal-700 text-lg font-mono">{purchase.totalCost.toLocaleString()} ل.س</td>
                        </tr>
                    </tfoot>
                </table>

                <div className="pt-10 flex justify-between items-center text-xs text-slate-400">
                    <p>تم استخراج هذه الفاتورة آلياً بواسطة نظام الصيدلية.</p>
                    <p>توقيع المستلم: ...............................</p>
                </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3 space-x-reverse no-print">
                <button 
                    onClick={onPrint}
                    className="flex items-center px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 shadow-lg transition-all"
                >
                    <PrinterIcon className="w-5 h-5 me-2" />
                    طباعة الآن
                </button>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    body * { visibility: hidden; }
                    #printable-invoice, #printable-invoice * { visibility: visible; }
                    #printable-invoice { position: absolute; left: 0; top: 0; width: 100%; }
                    .no-print { display: none !important; }
                }
            `}} />
        </div>
    );
};

const PurchaseForm: React.FC<{
  onSave: (purchase: Omit<Purchase, 'id'>) => void;
  onCancel: () => void;
  medicines: Medicine[];
  suppliers: Supplier[];
}> = ({ onSave, onCancel, medicines, suppliers }) => {
  const [supplierId, setSupplierId] = useState<string>('');
  const [items, setItems] = useState<PurchaseItem[]>([]);
  
  const formInputStyle = "p-2 border border-slate-300 rounded-md w-full bg-slate-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500 focus:ring-1";

  const addPurchaseItem = () => {
    setItems([...items, { medicineId: '', quantity: 1, costPrice: 0 }]);
  };

  const updateItem = (index: number, field: keyof PurchaseItem, value: string | number) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };
  
  const totalCost = useMemo(() => items.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0), [items]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId || items.length === 0 || items.some(i => !i.medicineId)) {
        alert('الرجاء تعبئة جميع الحقول المطلوبة.');
        return;
    }
    onSave({
        supplierId,
        items,
        totalCost,
        date: new Date().toISOString()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-xl font-bold text-slate-700 dark:text-gray-200">إضافة فاتورة مشتريات</h3>
        <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">المورد</label>
            <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className={formInputStyle} required>
                <option value="">اختر المورد</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
        </div>

        <div className="border-t border-slate-200 dark:border-gray-600 pt-4">
            <h4 className="font-semibold mb-2 text-slate-800 dark:text-gray-200">الأصناف</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto p-1">
            {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <select value={item.medicineId} onChange={(e) => updateItem(index, 'medicineId', e.target.value)} className={`col-span-5 ${formInputStyle}`}>
                        <option value="">اختر الدواء</option>
                        {medicines.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                    <input type="number" placeholder="الكمية" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))} className={`col-span-3 ${formInputStyle}`} min="1" />
                    <input type="number" placeholder="سعر التكلفة" value={item.costPrice} onChange={(e) => updateItem(index, 'costPrice', parseFloat(e.target.value))} className={`col-span-3 ${formInputStyle}`} min="0" step="0.01" />
                    <button type="button" onClick={() => removeItem(index)} className="col-span-1 p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><DeleteIcon className="w-5 h-5"/></button>
                </div>
            ))}
            </div>
            <button type="button" onClick={addPurchaseItem} className="mt-2 text-teal-600 dark:text-teal-400 font-semibold flex items-center">
                <PlusIcon className="w-4 h-4 me-1"/> إضافة صنف
            </button>
        </div>
        
        <div className="text-xl font-bold pt-4 border-t border-slate-200 dark:border-gray-600 text-slate-800 dark:text-gray-200">
            الإجمالي: {totalCost.toLocaleString()} ل.س
        </div>

        <div className="flex justify-end space-x-3 space-x-reverse pt-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500 transition-colors">إلغاء</button>
            <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">حفظ الفاتورة</button>
        </div>
    </form>
  )
};

const Purchases: React.FC<PurchasesProps> = ({ purchases, setPurchases, medicines, setMedicines, suppliers }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [printingPurchase, setPrintingPurchase] = useState<Purchase | null>(null);

    const handleSave = (purchase: Omit<Purchase, 'id'>) => {
        const newPurchase: Purchase = {
            ...purchase,
            id: `P${Date.now()}`
        };
        setPurchases(prev => [newPurchase, ...prev]);

        let updatedMedicines = [...medicines];
        purchase.items.forEach(item => {
            updatedMedicines = updatedMedicines.map(med =>
                med.id === item.medicineId ? { ...med, quantity: med.quantity + item.quantity } : med
            );
        });
        setMedicines(updatedMedicines);
        setIsFormOpen(false);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-700 dark:text-gray-200">إدارة المشتريات</h2>
                <button onClick={() => setIsFormOpen(true)} className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition-colors">
                    <PlusIcon className="w-5 h-5 me-2" />
                    إضافة فاتورة مشتريات
                </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md overflow-x-auto">
                <table className="w-full min-w-max text-right">
                    <thead className="border-b-2 border-slate-200 dark:border-gray-700">
                        <tr>
                            <th className="p-3 text-sm font-semibold tracking-wide text-slate-600 dark:text-gray-300">رقم الفاتورة</th>
                            <th className="p-3 text-sm font-semibold tracking-wide text-slate-600 dark:text-gray-300">المورد</th>
                            <th className="p-3 text-sm font-semibold tracking-wide text-slate-600 dark:text-gray-300">التاريخ</th>
                            <th className="p-3 text-sm font-semibold tracking-wide text-slate-600 dark:text-gray-300">الإجمالي</th>
                            <th className="p-3 text-sm font-semibold tracking-wide text-slate-600 dark:text-gray-300 text-center">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchases.map(p => {
                            const supplier = suppliers.find(s => s.id === p.supplierId);
                            return (
                                <tr key={p.id} className="border-b border-slate-100 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700/50">
                                    <td className="p-3 text-sm font-medium text-slate-800 dark:text-gray-200">{p.id}</td>
                                    <td className="p-3 text-sm text-slate-700 dark:text-gray-300">{supplier?.name || 'غير معروف'}</td>
                                    <td className="p-3 text-sm text-slate-700 dark:text-gray-300">{new Date(p.date).toLocaleDateString('ar-SA')}</td>
                                    <td className="p-3 text-sm text-green-600 dark:text-green-400 font-bold">{p.totalCost.toLocaleString()} ل.س</td>
                                    <td className="p-3 text-center">
                                        <button 
                                            onClick={() => setPrintingPurchase(p)}
                                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                                            title="طباعة الفاتورة"
                                        >
                                            <PrinterIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                        {purchases.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-10 text-center text-slate-500">لا توجد فواتير مشتريات حالياً</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal for adding new purchase */}
            <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)}>
                <PurchaseForm onSave={handleSave} onCancel={() => setIsFormOpen(false)} medicines={medicines} suppliers={suppliers} />
            </Modal>

            {/* Modal for Invoice Printing Preview */}
            {printingPurchase && (
                <Modal isOpen={true} onClose={() => setPrintingPurchase(null)}>
                    <PurchaseInvoiceView 
                        purchase={printingPurchase} 
                        medicines={medicines} 
                        suppliers={suppliers} 
                        onPrint={handlePrint}
                    />
                </Modal>
            )}
        </div>
    );
};

export default Purchases;
