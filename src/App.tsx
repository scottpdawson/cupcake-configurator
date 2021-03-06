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
  referralSources,
  deliveryOption,
  deliveryOptions,
  frostingFlavors,
  fillingFlavors,
  defaultCakeFlavor,
  defaultFrostingFlavor,
  defaultFillingFlavor,
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
      let cakeUpcharge = quantity * i.cakeFlavor[0].upCharge * i.size.flavorMultiplier;

      // recalculate cakeUpcharge if split box of 24
      if (i.size.id === '24REG') {
        cakeUpcharge = 
          ((quantity/2) * i.cakeFlavor[0].upCharge * i.size.flavorMultiplier) + 
          ((quantity/2) * i.cakeFlavor[1].upCharge * i.size.flavorMultiplier);
      }

      let messageCharge = i.message ? i.size.messagePrice : 0;
      let numberOfFlavors = 0;
      let frostingUpcharge = 0;
      i.frostingFlavor.forEach((f: flavor) => {
        numberOfFlavors += (f.name != "- none -") ? 1 : 0;
        frostingUpcharge += (f.name != "- none -") ? f.upCharge : 0;
      });

      // if it's a cake order, void upcharges
      if (!i.size.cupcakesPerRow) {
        frostingUpcharge = 0;
        cakeUpcharge = 0;
      }

      i.totalPrice = 
        basePrice + 
        cakeUpcharge + 
        messageCharge + 
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
      message: "",
      cakeFlavor: [defaultCakeFlavor, defaultCakeFlavor],
      fillingFlavor: defaultFillingFlavor,
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
      if (!boxSize.hasTwoFrostings) {
        // remove second frosting if item doesn't support it
        thisOrderItem.frostingFlavor[1] = defaultNullFrostingFlavor;
      }
      if (boxSize.id === '24REG') {
        // set second frosting to default
        thisOrderItem.frostingFlavor[1] = defaultFrostingFlavor;
      }
      thisOrderItem.basePrice = boxSize.price * boxSize.count,
      updateOrderDetails(currentOrder);
    }
  };

  const updateCakeFlavor = (e: any, orderItemToUpdate: string, flavorIndex: number) => {
    let currentOrder = getCurrentOrder(state);
    let thisOrderItem = getOrderItemFromKey(currentOrder, orderItemToUpdate);
    let cakeFlavor = getFlavorFromString(e.target.value, cakeFlavors);
    if (thisOrderItem && cakeFlavor) {
      thisOrderItem.cakeFlavor[flavorIndex] = cakeFlavor;
      updateOrderDetails(currentOrder);
    }
  };

  const updateCakeMessage = (e: any, orderItemToUpdate: string, maxCount: number) => {
    let currentOrder = getCurrentOrder(state);
    let thisOrderItem = getOrderItemFromKey(currentOrder, orderItemToUpdate);
    let thisMessage = e.target.value;
    let canUpdateMessage = true;
    if (thisOrderItem && thisOrderItem.size.cupcakesPerRow && thisMessage.length > maxCount) {
      // can't update message for cupcakes if beyond threshold
      canUpdateMessage = false;
    } 
    if (thisOrderItem && canUpdateMessage) {
      thisOrderItem.message = thisMessage;
      updateOrderDetails(currentOrder);
    }
  };

  const updateFillingFlavor = (e: any, orderItemToUpdate: string) => {
    let currentOrder = getCurrentOrder(state);
    let thisOrderItem = getOrderItemFromKey(currentOrder, orderItemToUpdate);
    let fillingFlavor = getFlavorFromString(e.target.value, fillingFlavors);
    if (thisOrderItem && fillingFlavor) {
      thisOrderItem.fillingFlavor = fillingFlavor;
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
          <p><b style={{ fontWeight: 'bold' }}>First, tell me when you'd like your order. My <a href="https://calendar.google.com/calendar/embed?src=mrc68tpj38rb49bj6ghuqh8v70@group.calendar.google.com&ctz=America/New_York" target='_blank'>availability calendar</a> will tell you if I'm booked on a specific date. Then, you'll be able to put in your order details.</b><br />Please try to submit a quote request for delivery 48 hours in advance or more. I'll do my best to accommodate your request based on my availability.</p>
          <DatePicker
            selected={state.orderDate}
            minDate={addDays(new Date(), 2)}
            onChange={date => updateOrderDate(date)}
            placeholderText='mm/dd/yyyy'
            monthsShown={1}
          />
        </div>
      </Expand>
    </div>;
  }

  const orderDetailsSection = () => {
    return state.orderDate !== '' && <div>
      {headerForSection('yourOrder', 'Order Details', state.orderTotal ? "$" + state.orderTotal.toFixed(2) : '')}
      <Expand duration={animDuration} open={state.isEditingSection === 'yourOrder'}>
        <p className="bypassInstructions">This interactive section is here to help make choices fun. I have the most popular flavors in the choices. If you don’t see what you are looking for, just skip to "Request a Quote" and tell me what you’re looking for in the notes. See the <a href="https://emoticakes.com/" target="_blank">Emoticakes</a> inspiration section for examples and ideas. If you prefer to order by email, there is a link at the <a href="https://emoticakes.com/order">bottom of the order page</a> where you can email your request.</p>
        <div className="padded orderCarousel">
          {state.orderDetails.map((item: orderItem) => (
            <div key={item.key} className="orderItem orderCard">
              {!(state.isEditingItemKey === item.key) && <div>
                <div className="edit" title="Edit" onClick={(e) => { setIsEditingItemKey(item.key) }}><FaEllipsisH /></div>
                <span className="orderQuantity">{item.size.count}</span> 
                <span className="orderBoxSize">{item.size.name}</span>
                <span className="orderDetails">
                  <div className="cupcakeDescription">
                    {item.cakeFlavor[0].name} w/ {item.size.hasFilling && <span>{item.fillingFlavor.name} filling and </span>} 
                    {item.frostingFlavor && item.frostingFlavor[0].name} frosting 
                    {item.size.id === '24REG' && <span>, {item.cakeFlavor[1].name} w/ </span>}
                    {item.size.id !== '24REG' && (item.frostingFlavor && item.frostingFlavor[1].name != '- none -') && <span> &amp; </span>}
                    {(item.frostingFlavor && item.frostingFlavor[1].name != '- none -') && <span> {item.frostingFlavor[1].name} frosting </span> }
                  </div>
                  {item.size.cupcakesPerRow > 0 && <div>
                    {(item.frostingFlavor && item.frostingFlavor[1].name === '- none -') && <div className="cupcakeContainer">
                        <img src={`./${item.cakeFlavor[0].image}.png`} />
                        <img src={`./${item.frostingFlavor[0].image}.png`} />
                    </div>}
                    {(item.frostingFlavor && item.frostingFlavor[1].name !== '- none -') && <div className="cupcakeContainer cupcakeContainerLeft">
                        <img src={`./${item.cakeFlavor[0].image}.png`} />
                        <img src={`./${item.frostingFlavor[0].image}.png`} />
                    </div>}
                    {(item.frostingFlavor && item.frostingFlavor[1].name !== '- none -') && <div className="cupcakeContainer cupcakeContainerRight">
                        {item.size.id === '24REG' && <img src={`./${item.cakeFlavor[1].image}.png`} />}
                        {item.size.id !== '24REG' && <img src={`./${item.cakeFlavor[0].image}.png`} />}
                        <img src={`./${item.frostingFlavor[1].image}.png`} />
                    </div>}
                  </div>}
                  {!item.size.cupcakesPerRow && 
                    item.frostingFlavor && 
                    <div className="cakeContainer" style={{background: `url(./${item.frostingFlavor[0].image}.png) -140px -50px  no-repeat`}}>
                  </div>}
                </span> 
                <span className="orderCostAndMessage">
                  <p>
                    Optional Message {item.size.messagePrice > 0 ? <span>(+${item.size.messagePrice})&nbsp; 
                      {item.size.id === '24MINI' && <a href="./24MINI.jpg" target="_blank">example</a>}
                      {item.size.id === '12REG' && <a href="./12REG.jpg" target="_blank">example</a>}
                      {item.size.id === '24REG' && <a href="./24REG.jpg" target="_blank">example</a>}
                    </span> : <span>(included)</span>}
                  </p>
                  <input
                    type="text"
                    value={item.message}
                    onChange={e => updateCakeMessage(e, item.key, item.size.count)}
                  />
                  <div className="letterContainerWrapper">
                    {item.size.cupcakesPerRow > 0 && <div>
                      {Object.keys(item.message.split('')).map((letter, i) => (
                        <span key={i}>
                          <div className="cupcakeLetter">
                            {item.message.split('')[i] != " " ? item.message.split('')[i] : "_"}
                          </div>
                          {(i+1) % item.size.cupcakesPerRow === 0 && <br />}
                        </span>
                      ))}
                    </div>}
                  </div>
                  <span className="cost">${item.totalPrice.toFixed(2)}</span>
                </span>
              </div>}
              {(state.isEditingItemKey === item.key) && <div className="editOrderItemBlock">
                <div className="trash" title="Delete" onClick={e => removeFromOrder(item.key)}><FaTrashAlt /></div>
                <span className="orderEditSectionTitle">Cake Size</span>
                <select
                      value={item.size && item.size.id}
                      onChange={e => updateBoxSize(e, item.key)}
                    >
                      {Object.keys(boxSizes).map((thisBoxSize, i) => (
                        <option key={i} value={boxSizes[i].id}>
                          {boxSizes[i].count > 1 ? boxSizes[i].count : ''} {boxSizes[i].name} (${boxSizes[i].price} ea)
                        </option>
                      ))}
                    </select>
                <span className="orderEditSectionTitle">
                  Cake {item.size.id === '24REG' && <span>(1st dozen)</span>}
                </span>
                <select
                    value={item.cakeFlavor[0] && item.cakeFlavor[0].name}
                    onChange={e => updateCakeFlavor(e, item.key, 0)}
                  >
                    {Object.keys(cakeFlavors).map((thisFlavor, i) => (
                        <option key={i} 
                          value={cakeFlavors[i].name} 
                        >
                          {cakeFlavors[i].name}
                          {cakeFlavors[i].upCharge && item.size.cupcakesPerRow ? " (+$" + (cakeFlavors[i].upCharge * item.size.flavorMultiplier).toFixed(2) + " ea)" : ""}
                        </option>
                    ))}
                  </select>
                  <span className="orderEditSectionTitle">
                    Frosting {item.size.id === '24REG' && <span>(1st dozen)</span>}
                  </span>
                  <select
                      value={item.frostingFlavor && item.frostingFlavor[0].name}
                      onChange={e => updateFrostingFlavor(e, item.key, 0)}
                    >
                      {Object.keys(frostingFlavors).map((thisFlavor, i) => (
                        <option key={i} value={frostingFlavors[i].name}>
                          {frostingFlavors[i].name}
                          {frostingFlavors[i].upCharge && item.size.cupcakesPerRow ? " (+$" + (frostingFlavors[i].upCharge * item.size.flavorMultiplier).toFixed(2) + " ea)" : ""}
                        </option>
                      ))}
                    </select>
                    {item.size.id === '24REG' && <div>
                      <span className="orderEditSectionTitle">Cake (2nd dozen)</span>
                      <select
                          value={item.cakeFlavor[1] && item.cakeFlavor[1].name}
                          onChange={e => updateCakeFlavor(e, item.key, 1)}
                        >
                          {Object.keys(cakeFlavors).map((thisFlavor, i) => (
                              <option key={i} 
                                value={cakeFlavors[i].name} 
                              >
                                {cakeFlavors[i].name}
                                {cakeFlavors[i].upCharge && item.size.cupcakesPerRow ? " (+$" + (cakeFlavors[i].upCharge * item.size.flavorMultiplier).toFixed(2) + " ea)" : ""}
                              </option>
                          ))}
                      </select>
                    </div>}
                    {item.size.hasTwoFrostings && <div>
                      <span className="orderEditSectionTitle">
                        {item.size.id !== '24REG' && <span>2nd Frosting (optional)</span>}
                        {item.size.id === '24REG' && <span>Frosting (2nd dozen)</span>}
                      </span>
                      <select
                        value={item.frostingFlavor[1] && item.frostingFlavor[1].name}
                        onChange={e => updateFrostingFlavor(e, item.key, 1)}
                      >
                        {Object.keys(frostingFlavors).map((thisFlavor, i) => (
                          <option key={i} value={frostingFlavors[i].name}>
                            {frostingFlavors[i].name}
                            {frostingFlavors[i].upCharge && item.size.cupcakesPerRow ? " (+$" + (frostingFlavors[i].upCharge * item.size.flavorMultiplier).toFixed(2) + " ea)" : ""}
                          </option>
                        ))}
                      </select>
                    </div>}
                    {item.size.hasFilling && <div>
                      <span className="orderEditSectionTitle">Filling</span>
                      <select
                        value={item.fillingFlavor && item.fillingFlavor.name}
                        onChange={e => updateFillingFlavor(e, item.key)}
                      >
                        {Object.keys(fillingFlavors).map((thisFlavor, i) => (
                          <option key={i} value={fillingFlavors[i].name}>
                            {fillingFlavors[i].name}
                            {fillingFlavors[i].upCharge ? " (+$" + (fillingFlavors[i].upCharge * item.size.flavorMultiplier).toFixed(2) + " ea)" : ""}
                          </option>
                        ))}
                      </select>
                    </div>}
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
    return state.orderDate !== '' && <div>
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

    let deliveryDetails = state.deliveryOption.name + " ($" + state.deliveryOption.price + ")";
    if (state.deliveryOption.key !== 1) {
      deliveryDetails += `<br />to ${state.recipientName} (${state.deliveryContactNumber})<br />${state.deliveryAddress}`;
    }

    var templateParams = {
      from_name: state.fromFirstName + ' ' + state.fromLastName,
      from_email: state.fromEmail,
      from_phone: state.fromPhone,
      referral_source: state.referralSource,
      special_requests: state.specialRequests,
      order_date: format(state.orderDate, "MMMM d yyyy", {
        useAdditionalWeekYearTokens: true,
        useAdditionalDayOfYearTokens: true,
      }),
      delivery: deliveryDetails,
      total: state.orderTotal.toFixed(2),
      quote_details: summarizeOrder(state)
    };

    config.emailjs.templateID && emailjs
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

  const deliveryDetailsSection = () => {
    return state.orderDate !== '' && <div>
      {headerForSection('deliveryDetails', 'Delivery Details', 'Delivery details required when order is placed')}
      <Expand duration={animDuration} open={state.isEditingSection === 'deliveryDetails'}>
        <div className="padded">
          <form className="quote-form">
            <p className="specialReqInstructions">
              Please enter the delivery details for the recipient.
            </p>
            <ul>
              <label>
                <span>Recipient's Name</span>
                <input
                  type="text"
                  name="recipientName"
                  value={state.recipientName}
                  onChange={updateOrderContactDetails}
                />
              </label>
              <label>
                <span>Delivery Address</span>
                <input
                  type="text"
                  name="deliveryAddress"
                  value={state.deliveryAddress}
                  onChange={updateOrderContactDetails}
                />
              </label>
              <label>
                <span>Delivery Contact Phone Number</span>
                <input
                  type="phone"
                  name="deliveryContactNumber"
                  value={state.deliveryContactNumber}
                  onChange={updateOrderContactDetails}
                />
              </label>
            </ul>
          </form>
        </div>
      </Expand>
    </div>;
  }

  const requestQuoteSection = () => {
    return state.orderDate !== '' && <div>
      {headerForSection('requestQuote', 'Request a Quote', '')}
      <Expand duration={animDuration} open={state.isEditingSection === 'requestQuote'}>
        <div className="padded">
          <form className="quote-form">
            <ul>
            <label>
                <span>Special Notes or Custom Cakes</span>
                <p className="specialReqInstructions">
                  Did you select "custom" above, or do you have additional preferences for colors, gluten free or vegan flavors (available for some combinations), or specific design guidance? Please put those details here so I can best prepare a quote for you.
                </p>
                <input
                  type="text"
                  name="specialRequests"
                  value={state.specialRequests}
                  onChange={updateOrderContactDetails}
                />
              </label>
              <label>
                <span>Your First Name</span>
                <input
                  type="text"
                  name="fromFirstName"
                  value={state.fromFirstName}
                  onChange={updateOrderContactDetails}
                />
              </label>
              <label>
                <span>Your Last Name</span>
                <input
                  type="text"
                  name="fromLastName"
                  value={state.fromLastName}
                  onChange={updateOrderContactDetails}
                />
              </label>
              <label>
                <span>Your Email Address</span>
                <input
                  type="email"
                  name="fromEmail"
                  value={state.fromEmail}
                  onChange={updateOrderContactDetails}
                />
              </label>
              <label>
                <span>Your Phone Number</span>
                <input
                  type="phone"
                  name="fromPhone"
                  value={state.fromPhone}
                  onChange={updateOrderContactDetails}
                />
              </label>
              <label>
                <span>How did you hear about Emoticakes?</span>
                <select
                    name="referralSource"
                    value={state.referralSource}
                    onChange={e => updateOrderContactDetails(e)}
                  >
                    {Object.keys(referralSources).map((thisSource, i) => (
                      <option key={i} value={referralSources[i]}>{referralSources[i]}</option>
                    ))}
                  </select>
              </label>
            </ul>
            {!canSubmitOrder(state) && <p className="specialReqInstructions">To submit, fill our your contact information and either add an item in Order Details OR a special note above. If you chose delivery, those details are also due at time of ordering.</p>}
            <button
              type="button"
              disabled={!canSubmitOrder(state)}
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
        <h1>Order Quote</h1>
      </div>
      {!state.emailSubmitted && <div>
        {orderDateSection()}
        {orderDetailsSection()}
        {deliveryOptionsSection()}
        {state.deliveryOption.key !== 1 && deliveryDetailsSection()}
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
