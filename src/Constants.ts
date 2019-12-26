import { addDays } from 'date-fns';

export interface order {
  orderTotal: number;
  orderDetails: orderItem[];
  deliveryOption: deliveryOption;
  fromName: string;
  fromEmail: string;
  fromPhone: string;
  orderDate: Date;
  specialRequests: string;
  isEditingSection: string;
  isEditingItemKey: string;
  emailSubmitted: boolean;
  emailError: string;
}

export interface orderItem {
  key: string;
  size: boxSize;
  cakeFlavor: flavor;
  frostingFlavor: flavor[];
  basePrice: number;
  totalPrice: number;
}

export interface boxSize {
  name: string;
  count: number;
  flavorMultiplier: number; // used for flavor price variance for minis
  price: number;
}

export interface flavor {
  name: string;
  color: string;
  upCharge: number;
}

export interface deliveryOption {
  key: number;
  name: string;
  price: number;
}

export const deliveryOptions: deliveryOption[] = [{
    key: 1,
    name: "Pick up in Trumansburg, NY (free)",
    price: 0,
  }, {
    key: 2,
    name: "Deliver to Trumansburg",
    price: 5,
  }, {
    key: 3,
    name: "Deliver to Ithaca area",
    price: 5,
  }
];

export const boxSizes: boxSize[] = [{
    name: "Mini",
    count: 24,
    flavorMultiplier: 1/3, // mini flavor increments are 3:1
    price: .85,
  }, {
    name: "Regular",
    count: 12,
    flavorMultiplier: 1,
    price: 1.75
  },
];

export const cakeFlavors: flavor[] = [{
    color: "#333",
    name: "carrot",
    upCharge: .25,
  }, {
    color: "#333",
    name: "chocolate",
    upCharge: 0,
  }, {
    color: "#333",
    name: "coconut",
    upCharge: .25,
  }, {
    color: "#333",
    name: "coffee",
    upCharge: 0,
  }, {
    color: "#333",
    name: "hazelnut",
    upCharge: .25,
  }, {
    color: "#333",
    name: "lemon",
    upCharge: .25,
  }, {
    color: "#333",
    name: "mocha",
    upCharge: 0,
  }, {
    color: "#333",
    name: "pistachio",
    upCharge: .25,
  }, {
    color: "#333",
    name: "red velvet",
    upCharge: 0,
  }, {
    color: "#333",
    name: "spice",
    upCharge: 0,
  }, {
    color: "#333",
    name: "vanilla",
    upCharge: 0,
  }
];

export const frostingFlavors: flavor[] = [{
    color: "#000",
    name: "- none -",
    upCharge: 0,
  },{
    color: "#333",
    name: "chocolate buttercream",
    upCharge: 0,
  }, {
    color: "#333",
    name: "coconut",
    upCharge: 0,
  }, {
    color: "#333",
    name: "cookies and cream",
    upCharge: 0,
  }, {
    color: "#333",
    name: "cream cheese",
    upCharge: 0,
  }, {
    color: "#333",
    name: "hazelnut",
    upCharge: .25,
  }, {
    color: "#333",
    name: "lemon",
    upCharge: .25,
  }, {
    color: "#333",
    name: "mint chocolate cookie",
    upCharge: 0,
  }, {
    color: "#333",
    name: "peanut butter",
    upCharge: 0,
  }, {
    color: "#333",
    name: "pistachio",
    upCharge: .25,
  }, {
    color: "#333",
    name: "raspberry",
    upCharge: .25,
  }, {
    color: "#333",
    name: "strawberry",
    upCharge: .25,
  }, {
    color: "#333",
    name: "vanilla buttercream",
    upCharge: 0,
  }
];

export const defaultCakeFlavor = cakeFlavors[cakeFlavors.length-1];
export const defaultFrostingFlavor = frostingFlavors[frostingFlavors.length-1];
export const defaultNullFrostingFlavor = frostingFlavors[0];

export const defaultState = {
  orderTotal: 0,
  orderDetails: [],
  deliveryOption: deliveryOptions[0],
  fromName: '',
  fromEmail: '',
  fromPhone: '',
  specialRequests: '',
  orderDate: addDays(new Date(), 2),
  isEditingSection: 'orderDate', 
  isEditingItemKey: '',
  emailSubmitted: false,
  emailError: '',
};