import React, { Component } from "react";
import * as Constants from "./Constants";
import { generateUniqueKey } from "./Helpers";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = Constants.initialState;
    this.addToOrder = this.addToOrder.bind(this);
    this.removeFromOrder = this.removeFromOrder.bind(this);
  }

  onStartOver = () => {
    this.setState({ ...Constants.initialState });
  };

  getCurrentOrder() {
    return JSON.parse(JSON.stringify(this.state.orderDetails));
  }

  updateOrderDetails(orderDetails) {
    this.setState({
      orderTotal: this.calculateTotal(orderDetails),
      orderDetails: orderDetails
    });
  }

  addToOrder(newItem) {
    let currentOrder = this.getCurrentOrder();
    currentOrder.push({
      key: generateUniqueKey("CC"), // key is unique
      name: newItem.name,
      price: newItem.price
    });
    this.updateOrderDetails(currentOrder);
  }

  removeFromOrder(itemToRemove) {
    let currentOrder = this.getCurrentOrder();
    let currentOrderItemRemoved = currentOrder.filter(function(item) {
      return item.key !== itemToRemove;
    });
    this.updateOrderDetails(currentOrderItemRemoved);
  }

  calculateTotal(orderDetails) {
    var totalPrice = orderDetails.reduce(function(accumulator, order) {
      return accumulator + order.price;
    }, 0);
    return totalPrice;
  }

  render() {
    return (
      <div>
        <h1>Cupcake Configurator</h1>
        <p>lorem ipsum instructions</p>
        <h4>Add to Order</h4>
        <ul>
          {Object.keys(Constants.boxSizes).map((item, i) => (
            <li
              onClick={e => this.addToOrder(Constants.boxSizes[item], e)}
              key={i}
            >
              {Constants.boxSizes[item].name} ({Constants.boxSizes[item].count})
            </li>
          ))}
        </ul>
        <h4>Your Order</h4>
        <h5>Order Total: ${this.state.orderTotal}</h5>
        <ul>
          {this.state.orderDetails.map(item => (
            <li key={item.key}>
              <button
                type="button"
                onClick={e => this.removeFromOrder(item.key, e)}
              >
                remove
              </button>
              {item.name}
            </li>
          ))}
        </ul>
        <button type="button" onClick={this.onStartOver}>
          Start Over
        </button>
      </div>
    );
  }
}

// todo:
//
// 1. select cake flavor (1 per dozen)
// 2. select frosting flavors (up to 2 per dozen)
// 3. provide a message on cupcakes (custom disc color, letter color)
// 4. delivery (extra charge) or pick-up
// 5. send email on order quote submission, cc: to submitter
// https://sheelahb.com/blog/how-to-send-email-from-react-without-a-backend/
//

export default App;
