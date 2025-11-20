
export interface Medicine {
  id: string;
  name: string;
  scientificName: string;
  manufacturer: string;
  category: string;
  expiryDate: string; 
  quantity: number;
  price: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  address: string;
}

export interface SaleItem {
  medicineId: string;
  quantity: number;
  unitPrice: number;
}

export interface Sale {
  id: string;
  customerId?: string;
  items: SaleItem[];
  totalAmount: number;
  date: string; 
}

export interface PurchaseItem {
  medicineId: string;
  quantity: number;
  costPrice: number;
}

export interface Purchase {
  id: string;
  supplierId: string;
  items: PurchaseItem[];
  totalCost: number;
  date: string; 
}
