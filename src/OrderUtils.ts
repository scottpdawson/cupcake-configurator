import React, { useReducer } from "react";
import {
  defaultState,
  order,
  orderItem,
  boxSize,
  boxSizes,
  cakeFlavors,
  flavor,
  deliveryOption,
  frostingFlavors,
  defaultCakeFlavor,
  defaultFrostingFlavor,
  defaultNullFrostingFlavor
} from "./Constants";
import { generateUniqueKey } from "./Helpers";

export const summarizeOrder = (state: order) => {
  let summary = "";
  state.orderDetails.forEach((i: orderItem) => {
    summary = summary.concat(
      i.size.count +
        " " +
        i.size.name +
        " ($" +
        i.totalPrice.toFixed(2) +
        ")<br />"
    );
    if (i.size.id === '24REG') {
      summary = summary.concat(
        "-- " + i.cakeFlavor[0].name + " w/ " + i.frostingFlavor[0].name + " frosting<br />"
      );
      summary = summary.concat(
        "-- " + i.cakeFlavor[1].name + " w/ " + i.frostingFlavor[1].name + " frosting<br />"
      );
    } else {
      i.frostingFlavor.forEach((f: flavor) => {
        summary = summary.concat(
          f.name != "- none -" ? "-- " + i.cakeFlavor[0].name + " w/ " + f.name + " frosting<br />" : ""
        );
      });
    }
    
    summary = summary.concat(
      i.size.hasFilling ? "-- " + i.fillingFlavor.name + " filling<br />" : ""
    );
    summary = summary.concat(
      i.message !== '' ? "-- Message: " + i.message + "<br />" : ""
    );
    summary = summary.concat("<br />");
  });
  return summary;
};

export const canSubmitOrder = (state: order) => {
    // validate whether we can submit the form or not
    // ensure user filled out all contact info
    const clearForDelivery = (
      state.deliveryOption.key === 1 || 
      (state.deliveryOption.key !== 1 && 
        state.recipientName && 
        state.deliveryAddress && 
        state.deliveryContactNumber
      )
    );

    return (
      state.fromFirstName &&
      state.fromLastName &&
      state.fromEmail &&
      state.fromPhone && 
      clearForDelivery &&
      (state.orderTotal > 0 || state.specialRequests)
    );
  };

  export const calculateTotal = (orderDetails: orderItem[]) => {
    var totalPrice = orderDetails.reduce(function(
      accumulator: number,
      order: orderItem
    ) {
      return accumulator + order.totalPrice;
    },
    0);
    return totalPrice;
  };

  export const getBoxSizeFromString = (boxSize: string, boxSizes: boxSize[]) => {
    return boxSizes.find(obj => obj.id == boxSize);
  };

  export const getFlavorFromString = (flavor: string, flavors: flavor[]) => {
    return flavors.find(obj => obj.name == flavor);
  };

  export const getDeliveryOptionFromKey = (key: number, deliveryOptions: deliveryOption[]) => {
    return deliveryOptions.find(obj => obj.key == key);
  };

  export const getCurrentOrder = (state: order) => {
    return JSON.parse(JSON.stringify(state.orderDetails));
  };

  export const getOrderItemFromKey = (
    currentOrder: orderItem[],
    key: string
  ): orderItem | undefined => {
    return currentOrder.find((obj: { key: string }) => obj.key === key);
  };