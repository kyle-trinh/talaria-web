const BASE_URL = "http://localhost:4444/api/v1";

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

export { BASE_URL, ITEM_FIELD_MAP, SELECT_STYLE };
