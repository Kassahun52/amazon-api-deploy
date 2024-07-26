
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res) => {
  logger.info("Received a request on /");
  res.status(200).json({
    message: "Success!",
  });
});

app.post("/payment/create", async (req, res) => {
  const total = parseInt(req.query.total, 10); // Ensure total is a number
  logger.info(`Received a payment creation request with total: ${total}`);

  if (total > 0) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "usd",
      });
      logger.info(`PaymentIntent created successfully: ${paymentIntent.id}`);
      res.status(201).json(paymentIntent);
      clientSecret: paymentIntent.client_secret;
    } catch (error) {
      logger.error("Error creating payment intent", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  } else {
    logger.warn("Invalid total amount received");
    res.status(403).json({
      message: "Total must be greater than 0",
    });
  }
});



app.listen(5000, (err)=>{
    if(err) throw err;
    console.log("Amazon Server Running on PORT:5000, http://localhost:5000")
})

