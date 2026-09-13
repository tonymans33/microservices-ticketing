import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("returns a 404 if the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "concert",
      price: 20,
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "concert",
      price: 20,
    })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId: "different-user",
  });
  await ticket.save();

  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "new title",
      price: 30,
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const userId = "123456789";
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId,
  });
  await ticket.save();

  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set("Cookie", global.signin(userId))
    .send({
      title: "",
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set("Cookie", global.signin(userId))
    .send({
      title: "concert",
      price: -10,
    })
    .expect(400);
});

it("updates the ticket if the user owns it and inputs are valid", async () => {
  const userId = "123456789";
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId,
  });
  await ticket.save();

  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set("Cookie", global.signin(userId))
    .send({
      title: "new title",
      price: 30,
    })
    .expect(200);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual("new title");
  expect(updatedTicket!.price).toEqual(30);
  expect(updatedTicket!.userId).toEqual(userId);
});


it("rejects updates if the ticket is reserved", async () => {
  const userId = "123456789";
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId,
  });
  ticket.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket.save();

  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set("Cookie", global.signin(userId))
    .send({
      title: "new title",
      price: 30,
    })
    .expect(400);

  const unchangedTicket = await Ticket.findById(ticket.id);

  expect(unchangedTicket!.title).toEqual("concert");
  expect(unchangedTicket!.price).toEqual(20);
});