import { Message } from "node-nats-streaming";
import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from "@tmticketing/common";
import { queueGroupName } from "./queue-group-names";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {

    const order = await Order.findByEvent(data);

    if (!order) {
      throw new Error("Order not found");
    }

    order.set({
      status: OrderStatus.Cancelled
    })
    await order.save();


    msg.ack();
  }
}
