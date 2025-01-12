const router = require("express").Router();
const Stripe = require("stripe");
require("dotenv").config();


const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/payment", async (req, res) => {
    const { amout } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amout,
            currency: "usd",
            payment_method_types: ["card"],
        });
        res.send({
            clientSecret: paymentIntent,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;