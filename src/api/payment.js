// Routes: payment.js
const express = require("express");
const router = express.Router();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/create-intent", async (req, res) => {
  try {
    const { name, email, amount } = req.body;
    if (!name || !email || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    let customer;
    const doesCustomerExist = await stripe.customers.list({ email });
    if (doesCustomerExist.data.length > 0) {
      customer = doesCustomerExist.data[0];
    } else {
      customer = await stripe.customers.create({ name, email });
    }
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2024-06-20" }
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount) * 100,
      currency: "usd",
      customer: customer.id,
      automatic_payment_methods: { enabled: true, allow_redirects: "never" },
    });
    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/confirm-payment", async (req, res) => {
  try {
    const { payment_method_id, payment_intent_id, customer_id } = req.body;
    if (!payment_method_id || !payment_intent_id || !customer_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const paymentMethod = await stripe.paymentMethods.attach(
      payment_method_id,
      { customer: customer_id }
    );
    const result = await stripe.paymentIntents.confirm(payment_intent_id, {
      payment_method: paymentMethod.id,
    });
    res.json({ success: true, message: "Payment successful", result });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
