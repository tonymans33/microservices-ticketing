import request from "supertest";
import { app } from "../../app";

it("clears the cookie after signing out", async () => {
  const signupResponse = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const signupCookie = signupResponse.get("Set-Cookie");

  expect(signupCookie).toBeDefined();

  const signoutResponse = await request(app)
    .post("/api/users/signout")
    .set("Cookie", signupCookie!)
    .send({})
    .expect(200);

  const signoutCookie = signoutResponse.get("Set-Cookie");

  expect(signoutCookie).toBeDefined();

  const currentUserResponse = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", signoutCookie!)
    .send()
    .expect(200);

  expect(currentUserResponse.body.currentUser).toEqual(null);
});
