import * as React from "react";
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
      name: newItem.name,
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
                <td>{item.name}</td>
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
// 3. send email on order quote submission, cc: to submitter
// https://sheelahb.com/blog/how-to-send-email-from-react-without-a-backend/
//

export default App;
