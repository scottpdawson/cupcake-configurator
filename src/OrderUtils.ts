import React, { useReducer } from "react";
import emailjs from "emailjs-com";
import { format } from "date-fns";
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
import { config } from "./Config";

export const summarizeOrder = (state: order) => {
  let summary = "";
  state.orderDetails.forEach((i: orderItem) => {
    summary = summary.concat(
      i.size.count +
        " " +
        i.size.name +
        " " +
        i.cakeFlavor.name +
        " cupcakes ($" +
        i.totalPrice.toFixed(2) +
        ")<br />"
    );
    i.frostingFlavor.forEach((f: flavor) => {
      summary = summary.concat(
        f.name != "- none -" ? "-- " + f.name + "<br />" : ""
      );
    });
    summary = summary.concat("<br />");
  });
  return summary;
};

export const canSubmitOrder = (state: order) => {
    // validate whether we can submit the form or not
    // 1. ensure user filled out all contact info
    // 2. ensure order has at least one item
    return (
      !state.fromName ||
      !state.fromEmail || // todo: check validity of email address
      !state.fromPhone ||
      !state.orderDate ||
      state.orderTotal === 0
    );
  };

  export const onSubmitOrderRequest = (state: order) => {
    var templateParams = {
      from_name: state.fromName,
      from_email: state.fromEmail,
      from_phone: state.fromPhone,
      order_date: format(state.orderDate, "MMMM d YYYY", {
        useAdditionalWeekYearTokens: true,
        useAdditionalDayOfYearTokens: true
      }),
      delivery: state.deliveryOption.name + " ($" + state.deliveryOption.price + ")",
      total: state.orderTotal.toFixed(2),
      quote_details: summarizeOrder(state)
    };

    emailjs
      .send(
        config.emailjs.serviceID,
        config.emailjs.templateID,
        templateParams,
        config.emailjs.userID
      )
      .then(
        function(response) {
          console.log("SUCCESS!", response.status, response.text);
        },
        function(error) {
          console.log("FAILED...", error);
        }
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