// src/components/routes/LandingPage/PaymentSuccess/PaymentSuccess.js


import React from 'react';
import { useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {

    const searchQuery = useSearchParams()[0]

    const referenceNum = searchQuery.get("reference")
    return (
        <div>
            <h1>Order Successfull</h1>
            <h3>Reference No.{referenceNum}</h3>
            <p>Your payment has been processed successfully.</p>
        </div>
    );
};

export default PaymentSuccess;




