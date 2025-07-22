const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Event } = require('./schema');

const generateCheckoutSession = async (eventId, email) => {
    const price = await Event.findById(eventId).populate('price');
    if (!price) {
        throw new Error("Price not found");
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: email,
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: price.title,
                        description: price.description,
                    },
                    unit_amount: price.price * 100, 
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${process.env.URL}/success`,
        cancel_url: `${process.env.URL}/cancel`,
    });

    return session;    
} 

module.exports = { generateCheckoutSession };