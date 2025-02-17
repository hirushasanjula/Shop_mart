import stripe from 'stripe';

const Stripe = stripe(process.env.STRIP_SECRET_KEY)

export default Stripe;