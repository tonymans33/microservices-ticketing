import mongoose from "mongoose";
import { OrderStatus } from "@tmticketing/common";

interface OrderAttrs {
  id: string;
  version: number;
  userId: string;
  status: OrderStatus;
  price: number;
}

export { OrderStatus };

interface OrderDoc extends mongoose.Document {
  id: string;
  userId: string;
  version: number;
  status: OrderStatus;
  price: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
  findByEvent(event: { id: string; version: number }): Promise<OrderDoc | null>;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        const { _id, __v, ...rest } = ret;

        return {
          ...rest,
          id: _id.toString(),
        };
      },
    },
  }
);

orderSchema.set("versionKey", "version");
orderSchema.set("optimisticConcurrency", true);

orderSchema.statics.findByEvent = (event: { id: string; version: number }) => {
    return Order.findOne({
      _id: event.id,
      version: event.version - 1,
    });
  };
  
orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    userId: attrs.userId,
    status: attrs.status,
    price: attrs.price,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
