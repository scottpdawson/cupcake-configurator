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
  image: string;
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

const cakeDarkBrown = "cake_dark_brown";
const cakeLightBrown = "cake_light_brown";
const cakeWhite = "cake_white";
const cakeRed = "cake_red";
const cakePink = "cake_pink";

export const cakeFlavors: flavor[] = [{
    image: cakeLightBrown,
    name: "carrot",
    upCharge: .25,
  }, {
    image: cakeDarkBrown,
    name: "chocolate",
    upCharge: 0,
  }, {
    image: cakeWhite,
    name: "coconut",
    upCharge: .25,
  }, {
    image: cakeLightBrown,
    name: "coffee",
    upCharge: 0,
  }, {
    image: cakeLightBrown,
    name: "hazelnut",
    upCharge: .25,
  }, {
    image: cakeWhite,
    name: "lemon",
    upCharge: .25,
  }, {
    image: cakeDarkBrown,
    name: "mocha",
    upCharge: 0,
  }, {
    image: cakeWhite,
    name: "pistachio",
    upCharge: .25,
  }, {
    image: cakeRed,
    name: "red velvet",
    upCharge: 0,
  }, {
    image: cakeLightBrown,
    name: "spice",
    upCharge: 0,
  }, {
    image: cakePink,
    name: "strawberry",
    upCharge: 0,
  }, {
    image: cakeWhite,
    name: "vanilla",
    upCharge: 0,
  }
];

export const frostingFlavors: flavor[] = [{
    image: "-",
    name: "- none -",
    upCharge: 0,
  },{
    image: "chocolate_buttercream",
    name: "chocolate buttercream",
    upCharge: 0,
  }, {
    image: "coconut",
    name: "coconut",
    upCharge: 0,
  }, {
    image: "cookies_and_cream",
    name: "cookies and cream",
    upCharge: 0,
  }, {
    image: "cream_cheese",
    name: "cream cheese",
    upCharge: 0,
  }, {
    image: "hazelnut",
    name: "hazelnut",
    upCharge: .25,
  }, {
    image: "lemon",
    name: "lemon",
    upCharge: .25,
  }, {
    image: "mint_chocolate_cookie",
    name: "mint chocolate cookie",
    upCharge: 0,
  }, {
    image: "peanut_butter",
    name: "peanut butter",
    upCharge: 0,
  }, {
    image: "pistachio",
    name: "pistachio",
    upCharge: .25,
  }, {
    image: "raspberry",
    name: "raspberry",
    upCharge: .25,
  }, {
    image: "strawberry",
    name: "strawberry",
    upCharge: .25,
  }, {
    image: "vanilla_buttercream",
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