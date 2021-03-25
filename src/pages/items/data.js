const data = [
  {
    createdAt: "2021-03-18T04:55:47.831Z",
    quantity: 10,
    tax: 0,
    usShippingFee: 0,
    extraShippingCost: 0,
    actWgtPerItem: 0,
    status: "ordered",
    website: "amazon",
    itemType: "others",
    _id: "6052dd783de14606771428cf",
    name: "Lược màu tím",
    link:
      "https://www.amazon.com/dp/B01NA7KNTS/ref=twister_B01EY97QUE?_encoding=UTF8&th=",
    pricePerItem: 10.99,
    estWgtPerItem: 0.34,
    customId: "item-1",
    actualCost: 1425392.87794954,
    orderAccount: "604fd95ca213d706709c716a",
    orderDate: "2021-03-18T15:42:16.572Z",
    transaction: "605374d8cd74a8055229f4af",
  },
];

const fields = [
  "createdAt",
  "quantity",
  "tax",
  "usShippingFee",
  "extraShippingCost",
  "actWgtPerItem",
  "status",
  "website",
  "itemType",
  "_id",
  "name",
  "link",
  "pricePerItem",
  "estWgtPerItem",
  "customId",
  "actualCost",
  "orderAccount",
  "orderDate",
  "transaction",
];

const numberType = ["tax", "usShippingFee", "extraShippingCost"];

const newData = data.map((item) => {
  fields.forEach((field) => {});
});
