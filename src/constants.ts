const BASE_URL = "http://localhost:4444/api/v1";

const ITEM_FIELD_MAP_2 = {
  _id: {
    type: "internalLink",
    full: "id",
  },
  createdAt: {
    type: "string",
    full: "created at",
  },
  name: {
    type: "string",
    full: "name",
  },
  link: {
    type: "externalLink",
    full: "link",
  },
  pricePerItem: {
    type: "string",
    full: "price / item",
  },
  actPricePerItem: {
    type: "string",
    full: "actual price / item",
  },
  quantity: {
    type: "number",
    full: "quantity",
  },
  tax: {
    type: "string",
    full: "tax",
  },
  usShippingFee: {
    type: "string",
    full: "us shipping fee",
  },

  extraShippingCost: {
    type: "string",
    full: "extra shipping cost",
  },

  estWgtPerItem: {
    type: "string",
    full: "estimated weight / item",
  },
  actWgtPerItem: {
    type: "string",
    full: "actual weight / item",
  },
  actualCost: {
    type: "string",
    full: "actual cost",
  },
  trackingLink: {
    type: "externalLink",
    full: "tracking link",
  },
  invoiceLink: {
    type: "string",
    full: "invoice link",
  },

  orderDate: {
    type: "string",
    full: "order date",
  },
  arrvlAtWarehouseDate: {
    type: "string",
    full: "arrived at warehouse",
  },

  customerRcvDate: {
    type: "string",
    full: "customer received",
  },
  returnDate: {
    type: "string",
    full: "return date",
  },
  returnArrvlDate: {
    type: "string",
    full: "return arrival",
  },
  notes: {
    type: "string",
    full: "notes",
  },
  status: {
    type: "string",
    full: "status",
  },
  website: {
    type: "string",
    full: "website",
  },
  commissionRate: {
    type: "string",
    full: "commission rate",
  },
  itemType: {
    type: "string",
    full: "item type",
  },
  orderAccount: {
    type: "string",
    full: "order account",
  },
  warehouse: {
    type: "string",
    full: "warehouse",
  },
  transaction: {
    type: "string",
    full: "transaction",
  },
  updatedAt: {
    type: "string",
    full: "updated at",
  },
};

const ITEM_FIELD_MAP = {
  _id: "id",
  createdAt: "created at",
  name: "name",
  link: "link",
  pricePerItem: "price per item",
  actPricePerItem: "actual price per item",
  quantity: "quantity",
  tax: "tax",
  usShippingFee: "us shipping fee",
  extraShippingCost: "extra shipping cost",
  estWgtPerItem: "estimated weight/item",
  actWgtPerItem: "actual weight/item",
  actualCost: "actual cost",
  trackingLink: "tracking link",
  invoiceLink: "invoice link",
  orderDate: "order date",
  arrvlAtWarehouseDate: "arrived at warehouse",
  customerRcvDate: "customer reception",
  returnDate: "return date",
  returnArrvlDate: "return arrival",
  notes: "notes",
  status: "status",
  website: "website",
  commissionRate: "comission rate",
  itemType: "item type",
  orderAccount: "order account",
  warehouse: "warehouse",
  transaction: "transaction",
  updatedAt: "updated at",
};

const SELECT_STYLE = {
  border: "1px solid var(--chakra-colors-gray-200)",
  width: "100%",
  display: "block",
  padding: "8px 8px",
  borderRadius: "6px",
  textTransform: "capitalize",
};

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

const ITEM_FIELDS = [
  "_id",
  "createdAt",
  "name",
  "link",
  "pricePerItem",
  "actPricePerItem",
  "quantity",
  "tax",
  "usShippingFee",
  "extraShippingCost",
  "estWgtPerItem",
  "actWgtPerItem",
  "actualCost",
  "trackingLink",
  "invoiceLink",
  "orderDate",
  "arrvlAtWarehouseDate",
  "customerRcvDate",
  "returnDate",
  "returnArrvlDate",
  "notes",
  "status",
  "website",
  "commissionRate",
  "itemType",
  "orderAccount",
  "warehouse",
  "transaction",
  "updatedAt",
];

const ITEM_SORTABLE = [
  "_id",
  "createdAt",
  "pricePerItem",
  "updatedAt",
  "orderDate",
];

const ITEM_DEFAULT = [
  "_id",
  "createdAt",
  "name",
  "link",
  "pricePerItem",
  "quantity",
  "tax",
  "website",
];

const ACCOUNTS = [
  {
    _id: "604fdc268b219f0715099180",
    website: "others",
    name: "trinhthaibinh.ecom@gmail.com",
    currency: "btc",
  },
  {
    _id: "604fd95ca213d706709c716a",
    website: "amazon",
    name: "trinhthaibinh.ecom@gmail.com",
    currency: "usd",
  },
  {
    _id: "604fd95ca213d706709c716b",
    website: "others",
    name: "VND_ACCOUNT",
    currency: "vnd",
  },
  {
    _id: "604fd95ca213d706709c716c",
    website: "others",
    name: "USD_ACCOUNT",
    currency: "usd",
  },
  {
    _id: "604fd95ca213d706709c716d",
    website: "amazon",
    name: "thaibinh.trinh@student.csulb.edu",
    currency: "usd",
  },
  {
    _id: "604fd95ca213d706709c716e",
    website: "amazon",
    name: "btrinh27@student.cccd.edu",
    currency: "usd",
  },
  {
    _id: "604fd95ca213d706709c716f",
    website: "walmart",
    name: "trinhthaibinh.ecom@gmail.com",
    currency: "usd",
  },
];

export {
  BASE_URL,
  ITEM_FIELD_MAP,
  SELECT_STYLE,
  ITEM_SORTABLE,
  ITEM_FIELD_MAP_2,
  ITEM_FIELDS,
  ITEM_DEFAULT,
  ACCOUNTS,
};
