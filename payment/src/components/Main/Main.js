// src/components/Main/Main.js

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './Main.css';
import BodyPartForm from '../routes/Landing/BodyPartForm/BodyPartForm';
import PaymentSuccess from '../routes/Landing/PaymentSuccess/PaymentSuccess';


export default function Main(){
    return (
    <>
        <Router>
            <div>
                <Routes>
                <Route path="/" element={<BodyPartForm />} />
                <Route path="/paymentsuccess" element={<PaymentSuccess />} />
                </Routes>
            </div>
        </Router>
    </>
    );
}    