import * as React from "react";
import emailjs from "emailjs-com";
import DatePicker from "react-datepicker";
import { format, addDays } from "date-fns";
import { config } from "./Config"
import {
  initialState,
  order,
  orderItem,
  boxSize,
  boxSizes,
  cakeFlavors,
  flavor,
  frostingFlavors,
  defaultCakeFlavor,
  defaultFrostingFlavor,
  defaultNullFrostingFlavor,
} from "./Constants";
import { generateUniqueKey } from "./Helpers";
import "react-datepicker/dist/react-datepicker.css";

class App extends React.Component<any, order> {
  constructor(props: any) {
    super(props);
    this.state = initialState;
  }

  onStartOver = () => {
    this.setState({ ...initialState });
  };

  updateOrderContactDetails = (event: { target: { name: any; value: any; } }) => {
    // generically updates state key based on form element name
    const newState = { 
      [event.target.name]: event.target.value 
    } as Pick<order, keyof order>;
    this.setState(newState);
  }

  canSubmitOrder = () => {
    // validate whether we can submit the form or not
    // 1. ensure user filled out all contact info
    // 2. ensure order has at least one item
    return (
      !this.state.fromName || 
      !this.state.fromEmail || // todo: check validity of email address 
      !this.state.fromPhone || 
      !this.state.orderDate || 
      this.state.orderTotal === 0
    );
  }

  summarizeOrder = () => {
    let summary = '';
    this.state.orderDetails.forEach(i => {
      summary = summary.concat(i.size.count + ' ' + i.size.name + ' ' + i.cakeFlavor.name + ' cupcakes ($' + i.size.price + ')<br />');
      i.frostingFlavor.forEach(f => {
        summary = summary.concat((f.name != '- none -') ? '-- ' + f.name + '<br />' : '');
      });
      summary = summary.concat('<br />');
    });
    return summary;
  }

  onSubmitOrderRequest = () => {
    var templateParams = {
      from_name: this.state.fromName,
      from_email: this.state.fromEmail,
      from_phone: this.state.fromPhone,
      order_date: format(this.state.orderDate, 'MMMM d YYYY', {
        useAdditionalWeekYearTokens: true,
        useAdditionalDayOfYearTokens: true,
      }),
      total: this.state.orderTotal,
      quote_details: this.summarizeOrder()
    };
   
    emailjs.send(config.emailjs.serviceID, config.emailjs.templateID, templateParams, config.emailjs.userID)
      .then(function(response) {
         console.log('SUCCESS!', response.status, response.text);
      }, function(error) {
         console.log('FAILED...', error);
      });
  }

  getCurrentOrder() {
    return JSON.parse(JSON.stringify(this.state.orderDetails));
  }

  getOrderItemFromKey(currentOrder: orderItem[], key: string): orderItem | undefined {
    return currentOrder.find((obj: { key: string }) => obj.key === key);
  }

  updateOrderDetails(orderDetails: orderItem[]) {
    this.setState({
      orderTotal: this.calculateTotal(orderDetails),
      orderDetails: orderDetails
    });
  }

  addToOrder(newItem: boxSize) {
    let currentOrder = this.getCurrentOrder();
    currentOrder.push({
      key: generateUniqueKey("CC"), // key is unique
      size: newItem,
      cakeFlavor: defaultCakeFlavor,
      frostingFlavor: [defaultFrostingFlavor, defaultNullFrostingFlavor],
      price: newItem.price
    });
    this.updateOrderDetails(currentOrder);
  }

  removeFromOrder(keyToRemove: string) {
    let currentOrder = this.getCurrentOrder();
    let currentOrderItemRemoved = currentOrder.filter(function(
      item: orderItem
    ) {
      return item.key !== keyToRemove;
    });
    this.updateOrderDetails(currentOrderItemRemoved);
  }

  getFlavorFromString(flavor: string, flavors: flavor[]) {
    return flavors.find(obj => obj.name == flavor);
  }

  updateCakeFlavor(e: any, orderItemToUpdate: string) {
    let currentOrder = this.getCurrentOrder();
    let thisOrderItem = this.getOrderItemFromKey(currentOrder, orderItemToUpdate);
    let cakeFlavor = this.getFlavorFromString(e.target.value, cakeFlavors);
    if (thisOrderItem && cakeFlavor) {
      thisOrderItem.cakeFlavor = cakeFlavor;
      this.updateOrderDetails(currentOrder);
    }
  }

  updateFrostingFlavor(e: any, orderItemToUpdate: string, flavorIndex: number) {
    let currentOrder = this.getCurrentOrder();
    let thisOrderItem = this.getOrderItemFromKey(currentOrder, orderItemToUpdate);
    let frostingFlavor = this.getFlavorFromString(e.target.value, frostingFlavors);
    if (thisOrderItem && frostingFlavor) {
      thisOrderItem.frostingFlavor[flavorIndex] = frostingFlavor;
      this.updateOrderDetails(currentOrder);
    }
  }

  calculateTotal(orderDetails: orderItem[]) {
    var totalPrice = orderDetails.reduce(function(
      accumulator: number,
      order: orderItem
    ) {
      return accumulator + order.price;
    },
    0);
    return totalPrice;
  }

  updateOrderDate = (date: Date | null) => {
    if (date) {
      this.setState({
        orderDate: date
      });
    }
  };

  render() {
    return (
      <div>
        <h1>Cupcake Configurator</h1>

        <b>When would you like your order?</b><br />
        You may submit a quote request for delivery 48 hours in advance or more. Before requesting a quote, please check my <a href="https://emoticakes.com/" target='_blank'>availability calendar</a>.<br />
        
        <DatePicker
          selected={this.state.orderDate}
          minDate={addDays(new Date(), 2)}
          onChange={date => this.updateOrderDate(date)}
          monthsShown={2}
        />

        <h4>Add to Order</h4>
        <ul>
          {Object.keys(boxSizes).map((item, i) => (
            <li onClick={e => this.addToOrder(boxSizes[i])} key={i}>
              {boxSizes[i].name} ({boxSizes[i].count})
            </li>
          ))}
        </ul>
        <h4>Your Order</h4>
        <h5>Order Total: ${this.state.orderTotal}</h5>
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
            {this.state.orderDetails.map(item => (
              <tr key={item.key}>
                <td>
                  <button
                    type="button"
                    onClick={e => this.removeFromOrder(item.key)}
                  >
                    remove
                  </button>
                </td>
                <td>{item.size.name}</td>
                <td>
                  <select
                    value={item.cakeFlavor && item.cakeFlavor.name}
                    onChange={e => this.updateCakeFlavor(e, item.key)}
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
                    onChange={e => this.updateFrostingFlavor(e, item.key, 0)}
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
                    value={
                      item.frostingFlavor[1] && item.frostingFlavor[1].name
                    }
                    onChange={e => this.updateFrostingFlavor(e, item.key, 1)}
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
            <input type="text" name="fromName" value={this.state.fromName} onChange={this.updateOrderContactDetails} />
          </label>
          <label>
            Email:
            <input type="email" name="fromEmail" value={this.state.fromEmail} onChange={this.updateOrderContactDetails} />
          </label>
          <label>
            Phone:
            <input type="phone" name="fromPhone" value={this.state.fromPhone} onChange={this.updateOrderContactDetails} />
          </label>
        </form>
        <button type="button" disabled={this.canSubmitOrder()} onClick={this.onSubmitOrderRequest}>
          Submit Quote Request
        </button>
        <hr />
        <button type="button" onClick={this.onStartOver}>
          Start Over
        </button>
      </div>
    );
  }
}

// todo:
//
// 1. provide a message on cupcakes (custom disc color, letter color)
// 2. delivery (extra charge) or pick-up
// 3. variable pricing based on flavor
// 

export default App;
