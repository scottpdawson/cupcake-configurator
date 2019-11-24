import React, { useReducer } from "react";
import DatePicker from "react-datepicker";
import { addDays } from "date-fns";
import {
  defaultState,
  order,
  orderItem,
  boxSize,
  boxSizes,
  cakeFlavors,
  frostingFlavors,
  defaultCakeFlavor,
  defaultFrostingFlavor,
  defaultNullFrostingFlavor
} from "./Constants";
import {
  canSubmitOrder,
  onSubmitOrderRequest,
  calculateTotal,
  getFlavorFromString,
  getCurrentOrder,
  getOrderItemFromKey,
} from "./OrderUtils";
import { generateUniqueKey } from "./Helpers";
import "react-datepicker/dist/react-datepicker.css";

function App() {

  const reducer = (state: any, newState: any) => ({
    ...state,
    ...newState
  });
  const [state, setState] = useReducer(reducer, defaultState);

  const onStartOver = () => {
    setState(defaultState);
  };

  const updateOrderContactDetails = (event: {
    target: { name: any; value: any };
  }) => {
    // generically updates state key based on form element name
    const newState = {
      [event.target.name]: event.target.value
    } as Pick<order, keyof order>;
    setState(newState);
  };

  const updateOrderDetails = (orderDetails: orderItem[]) => {
    setState({
      orderTotal: calculateTotal(orderDetails),
      orderDetails: orderDetails
    });
  };

  const addToOrder = (newItem: boxSize) => {
    let currentOrder = getCurrentOrder(state);
    currentOrder.push({
      key: generateUniqueKey("CC"), // key is unique
      size: newItem,
      cakeFlavor: defaultCakeFlavor,
      frostingFlavor: [defaultFrostingFlavor, defaultNullFrostingFlavor],
      price: newItem.price
    });
    updateOrderDetails(currentOrder);
  };

  const removeFromOrder = (keyToRemove: string) => {
    let currentOrder = getCurrentOrder(state);
    let currentOrderItemRemoved = currentOrder.filter(function(
      item: orderItem
    ) {
      return item.key !== keyToRemove;
    });
    updateOrderDetails(currentOrderItemRemoved);
  };

  const updateCakeFlavor = (e: any, orderItemToUpdate: string) => {
    let currentOrder = getCurrentOrder(state);
    let thisOrderItem = getOrderItemFromKey(currentOrder, orderItemToUpdate);
    let cakeFlavor = getFlavorFromString(e.target.value, cakeFlavors);
    if (thisOrderItem && cakeFlavor) {
      thisOrderItem.cakeFlavor = cakeFlavor;
      updateOrderDetails(currentOrder);
    }
  };

  const updateFrostingFlavor = (
    e: any,
    orderItemToUpdate: string,
    flavorIndex: number
  ) => {
    let currentOrder = getCurrentOrder(state);
    let thisOrderItem = getOrderItemFromKey(currentOrder, orderItemToUpdate);
    let frostingFlavor = getFlavorFromString(e.target.value, frostingFlavors);
    if (thisOrderItem && frostingFlavor) {
      thisOrderItem.frostingFlavor[flavorIndex] = frostingFlavor;
      updateOrderDetails(currentOrder);
    }
  };

  const updateOrderDate = (date: Date | null) => {
    if (date) {
      setState({
        orderDate: date
      });
    }
  };

  return (
    <div>
      <h1>Cupcake Configurator</h1>
      <b>When would you like your order?</b>
      <br />
      You may submit a quote request for delivery 48 hours in advance or more.
      Before requesting a quote, please check my{" "}
      <a href="https://emoticakes.com/" target="_blank">
        availability calendar
      </a>
      .<br />
      <DatePicker
        selected={state.orderDate}
        minDate={addDays(new Date(), 2)}
        onChange={date => updateOrderDate(date)}
        monthsShown={2}
      />
      <h4>Add to Order</h4>
      <ul>
        {Object.keys(boxSizes).map((item, i) => (
          <li onClick={e => addToOrder(boxSizes[i])} key={i}>
            {boxSizes[i].name} ({boxSizes[i].count})
          </li>
        ))}
      </ul>
      <h4>Your Order</h4>
      <h5>Order Total: ${state.orderTotal}</h5>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Item</th>
            <th>Cake</th>
            <th>Frosting</th>
            <th>2nd Frosting (optional)</th>
          </tr>
        </thead>
        <tbody>
          {state.orderDetails.map((item: orderItem) => (
            <tr key={item.key}>
              <td>
                <button type="button" onClick={e => removeFromOrder(item.key)}>
                  remove
                </button>
              </td>
              <td>{item.size.name}</td>
              <td>
                <select
                  value={item.cakeFlavor && item.cakeFlavor.name}
                  onChange={e => updateCakeFlavor(e, item.key)}
                >
                  {Object.keys(cakeFlavors).map((thisFlavor, i) => (
                    <option key={i} value={cakeFlavors[i].name}>
                      {cakeFlavors[i].name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  value={item.frostingFlavor && item.frostingFlavor[0].name}
                  onChange={e => updateFrostingFlavor(e, item.key, 0)}
                >
                  {Object.keys(frostingFlavors).map((thisFlavor, i) => (
                    <option key={i} value={frostingFlavors[i].name}>
                      {frostingFlavors[i].name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  value={item.frostingFlavor[1] && item.frostingFlavor[1].name}
                  onChange={e => updateFrostingFlavor(e, item.key, 1)}
                >
                  {Object.keys(frostingFlavors).map((thisFlavor, i) => (
                    <option
                      key={i}
                      value={frostingFlavors[i] && frostingFlavors[i].name}
                    >
                      {frostingFlavors[i].name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
      <h2>Ready to Request a Quote?</h2>
      <form>
        <label>
          Name:
          <input
            type="text"
            name="fromName"
            value={state.fromName}
            onChange={updateOrderContactDetails}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="fromEmail"
            value={state.fromEmail}
            onChange={updateOrderContactDetails}
          />
        </label>
        <label>
          Phone:
          <input
            type="phone"
            name="fromPhone"
            value={state.fromPhone}
            onChange={updateOrderContactDetails}
          />
        </label>
      </form>
      <button
        type="button"
        disabled={canSubmitOrder(state)}
        onClick={(e) => onSubmitOrderRequest(state)}
      >
        Submit Quote Request
      </button>
      <hr />
      <button type="button" onClick={onStartOver}>
        Start Over
      </button>
    </div>
  );
}

// todo:
//
// 1. provide a message on cupcakes (custom disc color, letter color)
// 2. delivery (extra charge) or pick-up
// 3. variable pricing based on flavor
//

export default App;
