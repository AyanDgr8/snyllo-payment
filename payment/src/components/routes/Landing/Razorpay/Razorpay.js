// // src/components/routes/LandingPage/Razorpay/Razorpay.js


// import React from 'react';
// import axios from "axios";


// const Razorpay = () =>{
//     const checkoutHandler = async (amount) => {

//         const { data: { key } } = await axios.get("https://snyllo-payment.onrender.com/api/getkey")

//         const { data: { order } } = await axios.post("https://snyllo-payment.onrender.com/api/checkout", {
//             amount
//         })

//         const options = {
//             key,
//             amount: order.amount,
//             currency: "INR",
//             name: "Snyllo Éstetica Appointment",
//             description: "Tutorial of RazorPay",
//             image: "https://avatars.githubusercontent.com/u/25058652?v=4",
//             order_id: order.id,
//             callback_url: "https://snyllo-payment.onrender.com/api/paymentverification",
//             prefill: {
//                 name: "Ayan Khan",
//                 email: "ayan.khan@example.com",
//                 contact: "9999999999"
//             },
//             notes: {
//                 "address": "Snyllo Éstetica"
//             },
//             theme: {
//                 "color": "#121212"
//             }
//         };
//         const razor = new window.Razorpay(options);
//         razor.open();
//     }

//     return (
//         <div>

//         </div>
//     )
// }

// export default Razorpay;