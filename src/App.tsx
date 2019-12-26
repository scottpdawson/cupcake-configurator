import React, { useReducer } from "react";
import DatePicker from "react-datepicker";
import { addDays } from "date-fns";
import {
  defaultState,
  order,
  orderItem,
  boxSize,
  boxSizes,
  flavor,
  cakeFlavors,
  deliveryOption,
  deliveryOptions,
  frostingFlavors,
  defaultCakeFlavor,
  defaultFrostingFlavor,
  defaultNullFrostingFlavor
} from "./Constants";
import {
  canSubmitOrder,
  calculateTotal,
  getBoxSizeFromString,
  getFlavorFromString,
  getCurrentOrder,
  getOrderItemFromKey,
  getDeliveryOptionFromKey,
  summarizeOrder,
} from "./OrderUtils";
import { generateUniqueKey, getChevron } from "./Helpers";
import "react-datepicker/dist/react-datepicker.css";
import { FaPlusCircle, FaEllipsisH, FaTrashAlt, FaRedoAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import moment from 'moment';
// @ts-ignore
import Expand from 'react-expand-animated';
import RadioButton from "./RadioButton/RadioButton";
import emailjs from "emailjs-com";
import { format } from "date-fns";
import { config } from "./Config";

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
    // calculate price for each orderItem in orderDetails
    orderDetails.forEach((i: orderItem) => {
      let basePrice = i.basePrice;
      let quantity = i.size.count;
      let cakeUpcharge = quantity * i.cakeFlavor.upCharge * i.size.flavorMultiplier;
      let numberOfFlavors = 0;
      let frostingUpcharge = 0;
      i.frostingFlavor.forEach((f: flavor) => {
        numberOfFlavors += (f.name != "- none -") ? 1 : 0;
        frostingUpcharge += (f.name != "- none -") ? f.upCharge : 0;
      });
      i.totalPrice = 
        basePrice + 
        cakeUpcharge + 
        (((frostingUpcharge * quantity) / numberOfFlavors) * i.size.flavorMultiplier);
    });

    setState({
      orderTotal: calculateTotal(orderDetails) + state.deliveryOption.price,
      orderDetails: orderDetails
    });
  };

  const addToOrder = (newItem: boxSize) => {
    let currentOrder = getCurrentOrder(state);
    let newItemKey = generateUniqueKey("CC"); // key is unique
    currentOrder.push({
      key: newItemKey,
      size: newItem,
      cakeFlavor: defaultCakeFlavor,
      frostingFlavor: [defaultFrostingFlavor, defaultNullFrostingFlavor],
      flavorMultiplier: newItem.flavorMultiplier,
      basePrice: newItem.price * newItem.count,
    });
    updateOrderDetails(currentOrder);
    setIsEditingItemKey(newItemKey); // set new item to is editing
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

  const updateBoxSize = (e: any, orderItemToUpdate: string) => {
    let currentOrder = getCurrentOrder(state);
    let thisOrderItem = getOrderItemFromKey(currentOrder, orderItemToUpdate);
    let boxSize = getBoxSizeFromString(e.target.value, boxSizes);
    if (thisOrderItem && boxSize) {
      thisOrderItem.size = boxSize;
      thisOrderItem.basePrice = boxSize.price * boxSize.count,
      updateOrderDetails(currentOrder);
    }
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

  const toggleIsEditingSection = (thisSection: string) => {
    setState({
      isEditingSection: thisSection,
    });
  }

  const setIsEditingItemKey = (thisItemKey: string) => {
    setState({
      isEditingItemKey: thisItemKey,
    });
  }

  const updateDeliveryOption = (
    e: any,
  ) => {
    let newDeliveryOption = getDeliveryOptionFromKey(e.target.value, deliveryOptions);
    if (newDeliveryOption) {
      setState({
        orderTotal: calculateTotal(state.orderDetails) + newDeliveryOption.price,
        deliveryOption: newDeliveryOption,
      });
    }
  };

  const headerForSection = (className: string, title: string, subTitle: string) => {
    let sectionIsExpanded = state.isEditingSection === className;
    return  <h4 className={className} 
              onClick={(e) => toggleIsEditingSection(className)}>
              {getChevron(sectionIsExpanded)}
              <span>{title}</span>
              {!sectionIsExpanded && <span className="subTitle">{subTitle}</span>}
            </h4>
  }

  const orderDateSection = () => {
    return <div>
      {headerForSection('orderDate', 'When would you like your order?', moment(state.orderDate).format('LL'))}
      <Expand duration={animDuration} open={state.isEditingSection === 'orderDate'}>
        <div className="padded">
          <p>You may submit a quote request for delivery 48 hours in advance or more. Before requesting a quote, please check my <a href="https://emoticakes.com/" target="_blank">availability calendar</a>.</p>
          <DatePicker
            selected={state.orderDate}
            minDate={addDays(new Date(), 2)}
            onChange={date => updateOrderDate(date)}
            monthsShown={1}
          />
        </div>
      </Expand>
    </div>;
  }

  const orderDetailsSection = () => {
    return <div>
      {headerForSection('yourOrder', 'Order Details', state.orderTotal ? "$" + state.orderTotal.toFixed(2) : '')}
      <Expand duration={animDuration} open={state.isEditingSection === 'yourOrder'}>
        <div className="padded orderCarousel">
          {state.orderDetails.map((item: orderItem) => (
            <div key={item.key} className="orderItem orderCard">
              {!(state.isEditingItemKey === item.key) && <div>
                <div className="edit" title="Edit" onClick={(e) => { setIsEditingItemKey(item.key) }}><FaEllipsisH /></div>
                <span className="orderQuantity">{item.size.count}</span> 
                <span className="orderBoxSize">{item.size.name}</span>
                <span className="orderDetails">
                  {item.cakeFlavor.name} cupcakes w/<br />
                  {item.frostingFlavor && item.frostingFlavor[0].name}<br />
                  {(item.frostingFlavor && item.frostingFlavor[1].name != '- none -') && <span> and {item.frostingFlavor[1].name} </span> }
                  frosting
                </span> 
                <span className="orderCost">${item.totalPrice.toFixed(2)}</span>
              </div>}
              {(state.isEditingItemKey === item.key) && <div className="editOrderItemBlock">
                <div className="trash" title="Delete" onClick={e => removeFromOrder(item.key)}><FaTrashAlt /></div>
                <span className="orderEditSectionTitle">Cupcake Size</span>
                <select
                      value={item.size && item.size.name}
                      onChange={e => updateBoxSize(e, item.key)}
                    >
                      {Object.keys(boxSizes).map((thisBoxSize, i) => (
                        <option key={i} value={boxSizes[i].name}>
                          {boxSizes[i].count} {boxSizes[i].name} (${boxSizes[i].price} ea)
                        </option>
                      ))}
                    </select>
                <span className="orderEditSectionTitle">Cake</span>
                <select
                    value={item.cakeFlavor && item.cakeFlavor.name}
                    onChange={e => updateCakeFlavor(e, item.key)}
                  >
                    {Object.keys(cakeFlavors).map((thisFlavor, i) => (
                      <option key={i} value={cakeFlavors[i].name}>
                        {cakeFlavors[i].name}
                        {cakeFlavors[i].upCharge ? " (+$" + (cakeFlavors[i].upCharge * item.size.flavorMultiplier).toFixed(2) + " ea)" : ""}
                      </option>
                    ))}
                  </select>
                  <span className="orderEditSectionTitle">Frosting</span>
                  <select
                      value={item.frostingFlavor && item.frostingFlavor[0].name}
                      onChange={e => updateFrostingFlavor(e, item.key, 0)}
                    >
                      {Object.keys(frostingFlavors).map((thisFlavor, i) => (
                        <option key={i} value={frostingFlavors[i].name}>
                          {frostingFlavors[i].name}
                          {frostingFlavors[i].upCharge ? " (+$" + (frostingFlavors[i].upCharge * item.size.flavorMultiplier).toFixed(2) + " ea)" : ""}
                        </option>
                      ))}
                    </select>
                    <span className="orderEditSectionTitle">2nd Frosting (optional)</span>
                    <select
                      value={item.frostingFlavor[1] && item.frostingFlavor[1].name}
                      onChange={e => updateFrostingFlavor(e, item.key, 1)}
                    >
                      {Object.keys(frostingFlavors).map((thisFlavor, i) => (
                        <option key={i} value={frostingFlavors[i].name}>
                          {frostingFlavors[i].name}
                          {frostingFlavors[i].upCharge ? " (+$" + (frostingFlavors[i].upCharge * item.size.flavorMultiplier).toFixed(2) + " ea)" : ""}
                        </option>
                      ))}
                    </select>
                <span className="done" onClick={(e) => { setIsEditingItemKey('') }}>Done</span>
              </div>}
            </div>
          ))}
          <div className="addItemToOrder orderCard" title="Add to Order" onClick={e => addToOrder(boxSizes[1])}>
            <FaPlusCircle size="50" />
          </div>
        </div>        
      </Expand>
    </div>;
  }

  const deliveryOptionsSection = () => {
    return <div>
      {headerForSection('deliveryOption', 'Delivery Option', state.deliveryOption.name)}
      <Expand duration={animDuration} open={state.isEditingSection === 'deliveryOption'}>
        <div className="padded">
          {Object.keys(deliveryOptions).map((deliveryOption, i) => (
            <RadioButton 
              changed={updateDeliveryOption} 
              id={i} 
              key={i}
              isSelected={state.deliveryOption.key === deliveryOptions[i].key} 
              label={deliveryOptions[i].price ? deliveryOptions[i].name + " (+$" + deliveryOptions[i].price + ")" : deliveryOptions[i].name}
              value={deliveryOptions[i].key}
            />  
          ))}
        </div>
      </Expand>
    </div>;
  }

  const emailOrderRequest = (state: order) => {
    var templateParams = {
      from_name: state.fromName,
      from_email: state.fromEmail,
      from_phone: state.fromPhone,
      special_requests: state.specialRequests,
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
          setState({
            emailSubmitted: true,
          });
        },
        function(error) {
          setState({
            emailSubmitted: true,
            emailError: error,
          });
        }
      );
  };

  const requestQuoteSection = () => {
    return <div>
      {headerForSection('requestQuote', 'Request a Quote', '')}
      <Expand duration={animDuration} open={state.isEditingSection === 'requestQuote'}>
        <div className="padded">
          <form className="quote-form">
            <ul>
              <label>
                <span>Name</span>
                <input
                  type="text"
                  name="fromName"
                  value={state.fromName}
                  onChange={updateOrderContactDetails}
                />
              </label>
              <label>
                <span>Email</span>
                <input
                  type="email"
                  name="fromEmail"
                  value={state.fromEmail}
                  onChange={updateOrderContactDetails}
                />
              </label>
              <label>
                <span>Phone</span>
                <input
                  type="phone"
                  name="fromPhone"
                  value={state.fromPhone}
                  onChange={updateOrderContactDetails}
                />
              </label>
              <label>
                <span>Special Requests (message, design?)</span>
                <input
                  type="text"
                  name="specialRequests"
                  value={state.specialRequests}
                  onChange={updateOrderContactDetails}
                />
              </label>
            </ul>
            <button
              type="button"
              disabled={canSubmitOrder(state)}
              onClick={(e) => emailOrderRequest(state)}
            >
              Submit Quote Request
            </button>
          </form>
        </div>
      </Expand>
    </div>;
  }

  const animDuration = 300;

  return (
    <div>
      <div className="header">
        <span className="hed">
          emoticakes
          <span className="startOver" onClick={onStartOver} title="Start Over">
            <FaRedoAlt className="startOverIcon" />
          </span>
        </span>
        <h1>Cupcake Quote</h1>
      </div>
      {!state.emailSubmitted && <div>
        {orderDateSection()}
        {orderDetailsSection()}
        {deliveryOptionsSection()}
        {requestQuoteSection()}
      </div>}
      {(state.emailSubmitted && state.emailError === '') && <div className="emailResult">
        <FaCheckCircle className="emailStatusIcon" />
        <h3>Thank you.</h3>
        <p>I received your email request for a quote confirmation.</p>
        <p>Your order is not yet confirmed, so please give me 24 hours to get back to you with a confirmation. Thank you!</p>

        <p>You may also start over and <a href="javascript:void(0)" onClick={onStartOver} style={{ color: '#3399CC' }}>request a new quote</a>, too.</p>
      </div>}
      {(state.emailSubmitted && state.emailError != '') && <div className="emailResult">
      <FaExclamationTriangle className="emailStatusIcon" />
        <h3>Oops.</h3>
        <p>There was a problem sending your email request for a quote confirmation.</p>
        <p>You can try to <a href="javascript:void(0)" onClick={onStartOver} style={{ color: '#3399CC' }}>start over</a>, or just give me a call at (607) 387-7031.</p>
      </div>}
    </div>
  );
}

export default App;
