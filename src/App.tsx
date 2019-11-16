import * as React from 'react';
import { initialState, order, orderItem, boxSize, boxSizes } from './Constants'
import { generateUniqueKey } from "./Helpers";



class App extends React.Component<any, order> {
  constructor(props: any) {
    super(props);
    this.state = initialState;
  }

  onStartOver = () => {
    this.setState({ ...initialState });
  };

  getCurrentOrder() {
    return JSON.parse(JSON.stringify(this.state.orderDetails));
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
      name: newItem.name,
      price: newItem.price
    });
    this.updateOrderDetails(currentOrder);
  }

  removeFromOrder(itemToRemove: string) {
    let currentOrder = this.getCurrentOrder();
    let currentOrderItemRemoved = currentOrder.filter(function(item: orderItem) {
      return item.key !== itemToRemove;
    });
    this.updateOrderDetails(currentOrderItemRemoved);
  }

  calculateTotal(orderDetails: orderItem[]) {
    var totalPrice = orderDetails.reduce(function(accumulator: number, order: orderItem) {
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
          {Object.keys(boxSizes).map((item, i) => (
            <li
              onClick={e => this.addToOrder(boxSizes[i])}
              key={i}
            >
              {boxSizes[i].name} ({boxSizes[i].count})
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
                onClick={e => this.removeFromOrder(item.key)}
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
