export interface order {
  orderTotal: number,
  orderDetails: orderItem[],
}

export const initialState = {
  orderTotal: 0,
  orderDetails: [],
};

export interface orderItem {
  key: string,
  name: string,
  price: number,
};

export interface boxSize {
  name: string,
  count: number,
  price: number,
};

export interface flavor {
  name: string,
  color: string,
};

export const boxSizes: boxSize[] = [{
    name: "Mini",
    count: 24,
    price: 12
  }, {
    name: "Regular",
    count: 12,
    price: 34
  }, {
    name: "Regular 4-pack",
    count: 12,
    price: 12
  }
];

export const cakeFlavors: flavor[] = [{
    name: "chocolate",
    color: "#333"
  }, {
    name: "vanilla",
    color: "#333"
  }, {
    name: "mocha",
    color: "#333"
  }, {
    name: "coffee",
    color: "#333"
  }, {
    name: "spice",
    color: "#333"
  }, {
    name: "carrot",
    color: "#333"
  }, {
    name: "red velvet",
    color: "#333"
  }, {
    name: "coconut",
    color: "#333"
  }, {
    name: "lemon",
    color: "#333"
  }
];

export const frostingFlavors: flavor[] = [{
    name: "cream cheese",
    color: "#333"
  }, {
    name: "vanilla buttercream",
    color: "#333"
  }, {
    name: "chocolate buttercream",
    color: "#333"
  }, {
    name: "cookies and cream",
    color: "#333"
  }, {
    name: "mint chocolate cookie",
    color: "#333"
  }, {
    name: "peanut butter",
    color: "#333"
  }, {
    name: "hazelnut",
    color: "#333"
  }, {
    name: "coconut",
    color: "#333"
  }, {
    name: "lemon",
    color: "#333"
  }, {
    name: "raspberry",
    color: "#333"
  }, {
    name: "strawberry",
    color: "#333"
  }
];