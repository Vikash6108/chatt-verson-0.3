const Payment = require("../models/pay.model");
const Razorpay = require("razorpay");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

module.exports.payViewController = (req, res) => {
  res.render("razorpay");
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
// module.exports.payUserController = async (req, res) => {

//   const options = {
//     amount: req.body.amount * 100, // amount in smallest currency unit
//     currency: "INR",
//   };

//   try {
//     const order = await razorpay.orders.create(options);
//     const newPayment = await Payment.create({
//       orderId: order.id,
//       amount: order.amount,
//       currency: order.currency,
//       status: "pending",
//     });

//     res.json(order); // Send response to frontend
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error creating order" });
//   }
// };

module.exports.payUserController = async (req, res) => {
  try {
    // console.log("Received order request:", req.body);

    const { amount, razorpayPaymentId } = req.body;

    if (!amount || !razorpayPaymentId) {
      return res.status(400).json({ error: "Missing payment details" });
    }

    // Store the payment details in the database
    const newPayment = await Payment.create({
      amount: amount * 100,
      paymentId: razorpayPaymentId,

      status: "completed",
    });

    res.json({ success: true, order: newPayment });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Error creating order" });
  }
};

module.exports.payUserController= async (req,res)=>{

    // red.body.amount
    const options = {
        amount: req.body.amount * 100, // amount in smallest currency unit
        currency: "INR",
      };
      try {
        const order = await razorpay.orders.create(options);
        // res.send(order);

        const newPayment = await Payment.create({        // new payment create
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          status: 'pending',
        });

      } catch (error) {
        res.status(500).send('Error creating order');
      }
};

module.exports.verifyPayController = async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET;

  try {
    const {
      validatePaymentVerification,
    } = require("../node_modules/razorpay/dist/utils/razorpay-utils.js");

    const result = validatePaymentVerification(
      {
        order_id: razorpayOrderId,
        payment_id: razorpayPaymentId,
      },
      signature,
      secret
    );

    if (result) {
      const payment = await Payment.findOne({
        orderId: razorpayOrderId,
      }); // payment successfully

      payment.paymentId = razorpayPaymentId;
      payment.signature = signature;
      payment.status = "completed";
      await payment.save();

      res.json({
        status: "success",
      });
    } else {
      res.status(400).send("Invalid signature");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error verifying payment");
  }
};
