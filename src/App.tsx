import * as React from "react";
import {
  initialState,
  order,
  orderItem,
  boxSize,
  boxSizes,
  flavor,
  cakeFlavors,
  defaultCakeFlavor,
} from "./Constants";
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
      cakeFlavor: defaultCakeFlavor,
      price: newItem.price,
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

  getCakeFlavorFromString(flavor: string) {
    return cakeFlavors.find(obj => obj.name == flavor);
  }

  updateCakeFlavor(e: any, keyToUpdate: string) {
    let currentOrder = this.getCurrentOrder();
    let thisOrderItem = currentOrder.find((obj: { key: string; }) => obj.key === keyToUpdate);
    thisOrderItem.cakeFlavor = this.getCakeFlavorFromString(e.target.value);
    this.updateOrderDetails(currentOrder);
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

  render() {
    return (
      <div>
        <h1>Cupcake Configurator</h1>
        <p>lorem ipsum instructions</p>
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
              <th>Cake Flavor</th>
              <th>Frosting Flavor (choose up to 2)</th>
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
                <td>{item.name}</td>
                <td>
                  <select value={item.cakeFlavor.name} onChange={e => this.updateCakeFlavor(e, item.key)}>
                    {Object.keys(cakeFlavors).map((thisFlavor, i) => (
                      <option key={i} value={cakeFlavors[i].name}>
                        {cakeFlavors[i].name}
                      </option>
                    ))}
                  </select>
                </td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" onClick={this.onStartOver}>
          Start Over
        </button>
      </div>
    );
  }
}

// todo:
//
// 1. select frosting flavors (up to 2 per dozen)
// 2. provide a message on cupcakes (custom disc color, letter color)
// 3. delivery (extra charge) or pick-up
// 4. send email on order quote submission, cc: to submitter
// https://sheelahb.com/blog/how-to-send-email-from-react-without-a-backend/
//

export default App;
