import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import sendMail from "../config/mail.js";
// import * as paypal from "@paypal/paypal-server-sdk";

// Global variables
const currency = "USD";
const deliveryCharge = 10;

// Gateway initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// const environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
// const paypalClient = new paypal.core.PayPalHttpClient(environment);

// const initPayment = async (req, res) => {
//     try {
//         res.json({ success: true, message: "Gateway Initialized" });
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// }

// Placing Orders using COD Method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            status: "Order Placed",
            date: new Date()
        }

        const newOrder = new orderModel(orderData); // Creates a new order
        await newOrder.save(); // Save to DB

        await userModel.findByIdAndUpdate(userId, {cartData:{}}); // Clearing user cart

        const user = await userModel.findById(userId)
        // Sending order confirmation email
        await sendMail(user.email, "Order Confirmation", `
            <h1>Hi ${user.name},</h1>
            <p>Your order has been placed successfully. Order ID: ${newOrder._id}</p>
            <p>Amount: $${amount}</p>
            <p>Delivery Address: ${address.address}</p>
            <p>City: ${address.city}</p>
            <p>State: ${address.state}</p>
            <p>Country: ${address.country}</p>
        `);

        // Order processing logic...
        res.json({ success: true, message: "Order Placed Successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Placing Orders using Stripe Method
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "Stripe",
            payment: false,
            status: "Order Placed",
            date: new Date()
        }

        const newOrder = new orderModel(orderData); // Creates a new order
        await newOrder.save(); // Save to DB

        let totalAmount = 0;
        const line_items = items.map((item) => {
            const itemTotal = item.price * item.quantity
            totalAmount += itemTotal; // Add item total to the overall amount
            return {
                price_data: {
                    currency:currency,
                    product_data: {
                        name: item.name
                    },
                    unit_amount: item.price * 100
                },
                quantity: item.quantity
            }
        })

        totalAmount += deliveryCharge;

        line_items.push({
            price_data: {
                currency:currency,
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        // Amount consistency check
        if (totalAmount !== amount) {
            return res.status(400).json({ success: false, message: "Amount Mismatch" });
        }

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: "payment",
        })

        const user = await userModel.findById(userId)
        // Sending order confirmation email
        await sendMail(user.email, "Order Confirmation", `
            <h1>Hi ${user.name},</h1>
            <p>Your order has been placed successfully. Order ID: ${newOrder._id}</p>
            <p>Amount: $${amount}</p>
            <p>Delivery Address: ${address.street}</p>
            <p>City: ${address.city}, ${address.state}</p>
            <p>State: ${address.state}</p>
            <p>Country: ${address.country}</p>
        `);

        // Order processing logic...
        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Verify Stripe
const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body;

    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true});
            await userModel.findByIdAndUpdate(userId, {cartData:{}});
            res.json({ success: true, message: "Order Delivered" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Order Canceled" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Placing Orders using Paypal Method
// const placeOrderPaypal = async (req, res) => {
//     try {
//         const { userId, items, amount, address } = req.body;
//         const { origin } = req.headers;

//         // Save order in DB
//         const orderData = {
//             userId,
//             items,
//             amount,
//             address,
//             paymentMethod: "Paypal",
//             payment: false,
//             status: "Order Placed",
//             date: new Date(),
//             orderId: response.result.id
//         }

//         const newOrder = new orderModel(orderData); // Creates a new order
//         await newOrder.save(); // Save to DB
//         await userModel.findByIdAndUpdate(userId, {cartData:{}}); // Clearing user cart

//         // Build order data for Paypal
//         const request = new paypal.orders.OrdersCreateRequest();
//         request.prefer("return=representation");
//         request.requestBody({
//             intent: "CAPTURE",
//             purchase_units: [{
//                 amount: {
//                   currency_code: currency,
//                   value: (amount + deliveryCharge).toString(),
//                 }
//               }],
//             application_context: {
//                 return_url: `${origin}/verify?success=true&orderId=${newOrder._id}&paypalOrderId=${response.result.id}`,
//                 cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
//             }
//         });

//         // Create order with Paypal
//         const response = await paypalClient.execute(request);
//         request.requestBody().application_context.return_url = `${origin}/verify?success=true&orderId=${newOrder._id}&paypalOrderId=${response.result.id}`
//         request.requestBody().application_context.cancel_url = `${origin}/verify?success=false&orderId=${newOrder._id}`

//         // Return Paypal approval link to frontend
//         const approveLink = response.result.links.find((link) => link.rel === "approve").href;
       
//         // Order processing logic...
//         res.json({ success: true, url: approveLink });
//     } catch (error) {
//         console.error(error);
//         res.json({ success: false, message: error.message });
//     }
// }

// // Verify Paypal
// const verifyPaypal = async (req, res) => {
//   const { orderId, success, userId, paypalOrderId } = req.body;

//   try {
//     if (success === "true") {
//       // Capture the PayPal payment
//       const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
//       request.requestBody({});

//       const capture = await paypalClient.execute(request);

//       if (capture.result.status === "COMPLETED") {
//         await orderModel.findByIdAndUpdate(orderId, { payment: true });
//         await userModel.findByIdAndUpdate(userId, { cartData: {} });

//         return res.json({ success: true, message: "Order Paid & Confirmed" });
//       } else {
//         return res.status(400).json({ success: false, message: "Payment not completed" });
//       }
//     } else {
//       await orderModel.findByIdAndDelete(orderId);
//       return res.json({ success: false, message: "Order Canceled" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// All Orders data for Admin Panel

async function allOrders(req, res) {
    try {
        const orders = await orderModel.find({});

        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// User Order data for Frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId });
        res.json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// Update Order status from Admin Panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const validStatus = ["Order Placed", "Out For Delivery", "Shipped", "Packing", "Delivered", "Canceled"];
        if (!validStatus.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid Status" });
        }

        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export {
    // verifyPaypal,
    verifyStripe,
    placeOrder,
    placeOrderStripe,
    // placeOrderPaypal, 
    allOrders,
    userOrders,
    updateStatus
}