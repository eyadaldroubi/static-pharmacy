
import { Medicine, Sale, Purchase, Customer, Supplier } from './types';

export const initialMedicines: Medicine[] = [
  { id: 'med1', name: 'بنادول أدفانس', scientificName: 'Paracetamol', manufacturer: 'GSK', category: 'مسكنات', expiryDate: '2025-12-31', quantity: 150, price: 15500 },
  { id: 'med2', name: 'فولتارين 50 مجم', scientificName: 'Diclofenac Sodium', manufacturer: 'Novartis', category: 'مضادات التهاب', expiryDate: '2028-08-15', quantity: 80, price: 2500 },
  { id: 'med3', name: 'أموكسيل 500 مجم', scientificName: 'Amoxicillin', manufacturer: 'Hikma', category: 'مضادات حيوية', expiryDate: '2030-05-20', quantity: 45, price: 3500 },
  { id: 'med4', name: 'زيرتك', scientificName: 'Cetirizine', manufacturer: 'UCB', category: 'مضادات حساسية', expiryDate: '2029-01-10', quantity: 120, price: 22000 },
  { id: 'med5', name: 'جلوكوفاج 850 مجم', scientificName: 'Metformin', manufacturer: 'Merck', category: 'أدوية سكري', expiryDate: '2024-11-30', quantity: 10, price: 45000 },
];

export const initialCustomers: Customer[] = [
  { id: 'cust1', name: 'أحمد القاطمي', phone: '0501234567', address: 'الرياض, حي الغدير ' },
  { id: 'cust2', name: 'سعود القحطاني', phone: '0501260817', address: 'الرياض, حي الوادي ' },
  { id: 'cust3', name: 'فاطمة علي', phone: '09437535411', address: 'حمص, حي المحطة' },
];

export const initialSuppliers: Supplier[] = [
  { id: 'sup1', name: 'الشركة السورية للأدوية', contactPerson: 'محمد إياد الدروبي', phone: '0951264556', address: 'دمشق, الصناعية الأولى' },
  { id: 'sup2', name:' مستودع أدوية دار الدواء', contactPerson: 'عبد الله الشمالي', phone: '0932165892', address: 'حمص, المنطقة الصناعية' },
];

export const initialSales: Sale[] = [
  { id: 'sale1', customerId: 'cust1', items: [{ medicineId: 'med1', quantity: 2, unitPrice: 15500 }], totalAmount: 31000, date: '2025-10-26T10:00:00Z' },
  { id: 'sale2', items: [{ medicineId: 'med2', quantity: 1, unitPrice: 25000 }, { medicineId: 'med4', quantity: 1, unitPrice: 22000 }], totalAmount: 47000, date: '2025-10-27T14:30:00Z' },
];

export const initialPurchases: Purchase[] = [
  { id: 'pur1', supplierId: 'sup1', items: [{ medicineId: 'med1', quantity: 100, costPrice: 10000 }], totalCost: 1000.00, date: '2025-09-01T09:00:00Z' },
  { id: 'pur2', supplierId: 'sup2', items: [{ medicineId: 'med3', quantity: 50, costPrice: 25000 }], totalCost: 1250.00, date: '2025-09-15T11:00:00Z' },
];
