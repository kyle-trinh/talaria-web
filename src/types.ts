export interface I_Item {
  _id: string;
  createdAt: string;
  name: string;
  link: string;
  pricePerItem: string;
  actPricePerItem: string;
  quantity: string;
  tax: string;
  usShippingFee: string;
  extraShippingCost: string;
  estWgtPerItem: string;
  actWgtPerItem: string;
  actualCost: string;
  trackingLink: string;
  invoiceLink: string;
  orderDate: string;
  arrvlAtWarehouseDate: string;
  customerRcvDate: string;
  returnDate: string;
  returnArrvlDate: string;
  notes: string;
  status: string;
  website: string;
  commissionRate: string;
  itemType: string;
  orderAccount: string;
  warehouse: string;
  transaction: string;
  updatedAt: string;
}

export interface MoneyType {
  value: number;
  currency: string;
}

export interface Balance {
  amount: number;
  rating: number;
}

export interface I_Bill {
  createdAt?: number;
  updatedAt?: number;
  usdVndRate: number;
  status?: string;
  shippingRateToVn: MoneyType;
  customTax?: number;
  moneyReceived?: number;
  totalBillUsd?: number;
  actBillCost?: number;
  actCharge?: number;
  commission?: number;
  paymentReceipt?: string;
  notes?: string;
  customer: string;
  items: string[];
  affiliate: string;
  afterDiscount?: number;
  totalEstimatedWeight?: number;
}
