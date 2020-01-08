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
  referralSource: string;
}

export interface orderItem {
  key: string;
  size: boxSize;
  cakeFlavor: flavor[];
  frostingFlavor: flavor[];
  fillingFlavor: flavor;
  basePrice: number;
  totalPrice: number;
  message: string;
}

export interface boxSize {
  id: string;
  name: string;
  count: number;
  flavorMultiplier: number; // used for flavor price variance for minis
  price: number;
  messagePrice: number;
  cupcakesPerRow: number;
  hasFilling: boolean;
  hasTwoFrostings: boolean;
}

export interface flavor {
  name: string;
  image?: string;
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
    name: "Deliver to Trumansburg Village (free)",
    price: 0,
  }, {
    key: 3,
    name: "Deliver to Ithaca area",
    price: 6,
  }, {
    key: 4,
    name: "Other delivery area (confirm price w/ me)",
    price: 0,
  }
];

export const boxSizes: boxSize[] = [{
    id: "24MINI",
    name: "Mini Cupcakes",
    count: 24,
    flavorMultiplier: 1/3, // mini flavor increments are 3:1
    price: .85,
    messagePrice: 6,
    cupcakesPerRow: 6,
    hasFilling: false,
    hasTwoFrostings: false,
  }, {
    id: "12REG",
    name: "Regular Cupcakes",
    count: 12,
    flavorMultiplier: 1,
    price: 1.75,
    messagePrice: 3,
    cupcakesPerRow: 4,
    hasFilling: false,
    hasTwoFrostings: true,
  }, {
    id: "24REG",
    name: "Regular Cupcakes",
    count: 24,
    flavorMultiplier: 1,
    price: 1.75,
    messagePrice: 6,
    cupcakesPerRow: 6,
    hasFilling: false,
    hasTwoFrostings: true,
  }, {
    id: "8LAYER",
    name: "8\" Layer Cake",
    count: 1,
    flavorMultiplier: 1,
    price: 33,
    messagePrice: 0,
    cupcakesPerRow: 0,
    hasFilling: true,
    hasTwoFrostings: false,
  }, {
    id: "QUARTER",
    name: "1/4 Sheet Cake (no filling)",
    count: 1,
    flavorMultiplier: 1,
    price: 28,
    messagePrice: 0,
    cupcakesPerRow: 0,
    hasFilling: false,
    hasTwoFrostings: false,
  }, {
    id: "QUARTERFILLED",
    name: "1/4 Sheet Cake (with filling)",
    count: 1,
    flavorMultiplier: 1,
    price: 33,
    messagePrice: 0,
    cupcakesPerRow: 0,
    hasFilling: true,
    hasTwoFrostings: false,
  }, {
    id: "HALF",
    name: "1/2 Sheet Cake (no filling)",
    count: 1,
    flavorMultiplier: 1,
    price: 48,
    messagePrice: 0,
    cupcakesPerRow: 0,
    hasFilling: false,
    hasTwoFrostings: false,
  }, {
    id: "HALFFILLED",
    name: "1/2 Sheet Cake (with filling)",
    count: 1,
    flavorMultiplier: 1,
    price: 55,
    messagePrice: 0,
    cupcakesPerRow: 0,
    hasFilling: true,
    hasTwoFrostings: false,
  },
];

const cakeDarkBrown = "cake_dark_brown";
const cakeLightBrown = "cake_light_brown";
const cakeWhite = "cake_white";
const cakeRed = "cake_red";
const cakePink = "cake_pink";

export const cakeFlavors: flavor[] = [{
    image: cakeLightBrown,
    name: "almond",
    upCharge: 0,
  }, {
    image: cakeLightBrown,
    name: "carrot",
    upCharge: .25,
  }, {
    image: cakeDarkBrown,
    name: "chocolate",
    upCharge: 0,
  }, {
    image: cakeDarkBrown,
    name: "chocolate + vanilla",
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
    image: cakeLightBrown,
    name: "marble",
    upCharge: 0,
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
    upCharge: .25,
  }, {
    image: cakeLightBrown,
    name: "spice",
    upCharge: 0,
  }, {
    image: cakePink,
    name: "strawberry",
    upCharge: .25,
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
    name: "coconut buttercream",
    upCharge: 0,
  }, {
    image: "cookies_and_cream",
    name: "chocolate cookies and cream buttercream",
    upCharge: 0,
  }, {
    image: "cream_cheese",
    name: "cream cheese frosting",
    upCharge: 0,
  }, {
    image: "hazelnut",
    name: "hazelnut buttercream",
    upCharge: .25,
  }, {
    image: "lemon",
    name: "lemon buttercream",
    upCharge: .25,
  }, {
    image: "mint_chocolate_cookie",
    name: "mint chocolate cookie buttercream",
    upCharge: 0,
  }, {
    image: "peanut_butter",
    name: "peanut butter",
    upCharge: 0,
  }, {
    image: "pistachio",
    name: "pistachio buttercream",
    upCharge: .25,
  }, {
    image: "raspberry",
    name: "raspberry buttercream",
    upCharge: .25,
  }, {
    image: "strawberry",
    name: "strawberry buttercream",
    upCharge: .25,
  }, {
    image: "vanilla_buttercream",
    name: "vanilla buttercream",
    upCharge: 0,
  }
];

export const fillingFlavors: flavor[] = [{
    name: "banana mousse",
    upCharge: 0,
  }, {
    name: "cherry filling",
    upCharge: 0,
  }, {
    name: "chocolate buttercream",
    upCharge: 0,
  }, {
    name: "chocolate cookies and cream buttercream",
    upCharge: 0,
  }, {
    name: "coconut buttercream",
    upCharge: 0,
  }, {
    name: "cream cheese frosting",
    upCharge: 0,
  }, {
    name: "hazelnut buttercream",
    upCharge: 0,
  }, {
    name: "heath bar filling",
    upCharge: 0,
  }, {
    name: "lemon buttercream",
    upCharge: 0,
  }, {
    name: "lemon cream",
    upCharge: 0,
  }, {
    name: "mint chocolate cookie buttercream",
    upCharge: 0,
  }, {
    name: "pistachio buttercream",
    upCharge: 0,
  }, {
    name: "raspberry buttercream",
    upCharge: 0,
  }, {
    name: "raspberry filling",
    upCharge: 0,
  }, {
    name: "strawberry buttercream",
    upCharge: 0,
  }, {
    name: "strawberry filling",
    upCharge: 0,
  }, {
    name: "vanilla buttercream",
    upCharge: 0,
  }, {
    name: "vanilla cookies and cream buttercream",
    upCharge: 0,
  }
];

export const referralSources: string[] = [
  "Friend", 
  "Internet Search", 
  "Repeat Customer", 
  "Phone Book", 
  "Advertisement", 
  "Facebook"
];

export const defaultCakeFlavor = cakeFlavors[cakeFlavors.length-1];
export const defaultFrostingFlavor = frostingFlavors[frostingFlavors.length-1];
export const defaultNullFrostingFlavor = frostingFlavors[0];
export const defaultFillingFlavor = fillingFlavors[0];

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
  referralSource: referralSources[0],
};