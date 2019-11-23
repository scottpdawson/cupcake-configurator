import { addDays } from 'date-fns';

export interface order {
  orderTotal: number;
  orderDetails: orderItem[];
  fromName: string;
  fromEmail: string;
  fromPhone: string;
  orderDate: Date;
}

export const initialState = {
  orderTotal: 0,
  orderDetails: [],
  fromName: '',
  fromEmail: '',
  fromPhone: '',
  orderDate: addDays(new Date(), 2),
};

export interface orderItem {
  key: string;
  size: boxSize;
  cakeFlavor: flavor;
  frostingFlavor: flavor[]; 
  price: number;
}

export interface boxSize {
  name: string;
  count: number;
  price: number;
}

export interface flavor {
  name: string;
  color: string;
}

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
    color: "#333",
    name: "carrot"
  }, {
    color: "#333",
    name: "chocolate"
  }, {
    color: "#333",
    name: "coconut"
  }, {
    color: "#333",
    name: "coffee"
  }, {
    color: "#333",
    name: "lemon"
  }, {
    color: "#333",
    name: "mocha"
  }, {
    color: "#333",
    name: "red velvet"
  }, {
    color: "#333",
    name: "spice"
  }, {
    color: "#333",
    name: "vanilla"
  }
];

export const frostingFlavors: flavor[] = [{
    color: "#000",
    name: "- none -"
  },{
    color: "#333",
    name: "chocolate buttercream"
  }, {
    color: "#333",
    name: "coconut"
  }, {
    color: "#333",
    name: "cookies and cream"
  }, {
    color: "#333",
    name: "cream cheese"
  }, {
    color: "#333",
    name: "hazelnut"
  }, {
    color: "#333",
    name: "lemon"
  }, {
    color: "#333",
    name: "mint chocolate cookie"
  }, {
    color: "#333",
    name: "peanut butter"
  }, {
    color: "#333",
    name: "raspberry"
  }, {
    color: "#333",
    name: "strawberry"
  }, {
    color: "#333",
    name: "vanilla buttercream"
  }
];

export const defaultCakeFlavor = cakeFlavors[cakeFlavors.length-1];
export const defaultFrostingFlavor = frostingFlavors[frostingFlavors.length-1];
export const defaultNullFrostingFlavor = frostingFlavors[0];