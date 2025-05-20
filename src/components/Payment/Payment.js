// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from '../../contexts/CartContext';
// import './Payment.css';

// const Payment = () => {
//   const { cart, clearCart } = useCart();
//   const navigate = useNavigate();
  
//   const [paymentMethod, setPaymentMethod] = useState('creditcard');
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     street: '',
//     city: '',
//     postalCode: '',
//     cardNumber: '',
//     cardExpiry: '',
//     cardCVC: '',
//     swishNumber: ''
//   });
  
//   const [errors, setErrors] = useState({});
  
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
    
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors({ ...errors, [name]: '' });
//     }
//   };
  
//   const validateForm = () => {
//     const newErrors = {};
    
//     // Validate common fields
//     if (!formData.name.trim()) newErrors.name = 'Name is required';
//     if (!formData.email.trim()) newErrors.email = 'Email is required';
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
//     if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
//     else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
//       newErrors.phone = 'Phone number should have at least 10 digits';
//     }
    
//     if (!formData.street.trim()) newErrors.street = 'Street address is required';
//     if (!formData.city.trim()) newErrors.city = 'City is required';
//     if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    
//     // Validate payment method specific fields
//     if (paymentMethod === 'creditcard') {
//       if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
//       else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
//         newErrors.cardNumber = 'Card number should be 16 digits';
//       }
      
//       if (!formData.cardExpiry.trim()) newErrors.cardExpiry = 'Expiry date is required';
//       else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
//         newErrors.cardExpiry = 'Expiry date should be in MM/YY format';
//       }
      
//       if (!formData.cardCVC.trim()) newErrors.cardCVC = 'CVC is required';
//       else if (!/^\d{3,4}$/.test(formData.cardCVC)) {
//         newErrors.cardCVC = 'CVC should be 3 or 4 digits';
//       }
//     } else if (paymentMethod === 'swish') {
//       if (!formData.swishNumber.trim()) newErrors.swishNumber = 'Swish number is required';
//       else if (!/^\d{10}$/.test(formData.swishNumber.replace(/\D/g, ''))) {
//         newErrors.swishNumber = 'Swish number should be 10 digits';
//       }
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };
  
//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (validateForm()) {
      
//       // For now, simulate a successful order
//       setTimeout(() => {
//         // Store order details for confirmation page
//         const orderDetails = {
//           items: cart.items,
//           totalAmount: cart.totalPrice,
//           paymentMethod,
//           deliveryAddress: {
//             name: formData.name,
//             street: formData.street,
//             city: formData.city,
//             postalCode: formData.postalCode
//           },
//           orderId: 'ORD' + Math.floor(100000 + Math.random() * 900000), // Random order ID
//           estimatedDelivery: '30 minutes'
//         };
        
//         // Store in sessionStorage to access on confirmation page
//         sessionStorage.setItem('orderDetails', JSON.stringify(orderDetails));
        
//         // Clear cart and navigate to confirmation
//         clearCart();
//         navigate('/confirmation');
//       }, 1500); // Simulate processing delay
//     }
//   };
  
//   if (cart.items.length === 0) {
//     navigate('/cart');
//     return null;
//   }
  
//   return (
//     <div className="payment-page">
//       <h1>Checkout</h1>
      
//       <div className="payment-container">
//         <div className="order-summary">
//           <h2>Order Summary</h2>
//           <ul className="summary-items">
//             {cart.items.map(item => (
//               <li key={item.id} className="summary-item">
//                 <span>{item.quantity} × {item.name}</span>
//                 <span>${(item.price * item.quantity).toFixed(2)}</span>
//               </li>
//             ))}
//           </ul>
//           <div className="summary-total">
//             <span>Total:</span>
//             <span>${cart.totalPrice.toFixed(2)}</span>
//           </div>
//         </div>
        
//         <form onSubmit={handleSubmit} className="payment-form">
//           <h2>Delivery Details</h2>
          
//           <div className="form-group">
//             <label htmlFor="name">Full Name</label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//               className={errors.name ? 'error' : ''}
//             />
//             {errors.name && <span className="error-message">{errors.name}</span>}
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="email">Email</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               className={errors.email ? 'error' : ''}
//             />
//             {errors.email && <span className="error-message">{errors.email}</span>}
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="phone">Phone Number</label>
//             <input
//               type="tel"
//               id="phone"
//               name="phone"
//               value={formData.phone}
//               onChange={handleInputChange}
//               className={errors.phone ? 'error' : ''}
//             />
//             {errors.phone && <span className="error-message">{errors.phone}</span>}
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="street">Street Address</label>
//             <input
//               type="text"
//               id="street"
//               name="street"
//               value={formData.street}
//               onChange={handleInputChange}
//               className={errors.street ? 'error' : ''}
//             />
//             {errors.street && <span className="error-message">{errors.street}</span>}
//           </div>
          
//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="city">City</label>
//               <input
//                 type="text"
//                 id="city"
//                 name="city"
//                 value={formData.city}
//                 onChange={handleInputChange}
//                 className={errors.city ? 'error' : ''}
//               />
//               {errors.city && <span className="error-message">{errors.city}</span>}
//             </div>
            
//             <div className="form-group">
//               <label htmlFor="postalCode">Postal Code</label>
//               <input
//                 type="text"
//                 id="postalCode"
//                 name="postalCode"
//                 value={formData.postalCode}
//                 onChange={handleInputChange}
//                 className={errors.postalCode ? 'error' : ''}
//               />
//               {errors.postalCode && <span className="error-message">{errors.postalCode}</span>}
//             </div>
//           </div>
          
//           <h2>Payment Method</h2>
          
//           <div className="payment-methods">
//             <div 
//               className={`payment-method-option ${paymentMethod === 'creditcard' ? 'selected' : ''}`}
//               onClick={() => setPaymentMethod('creditcard')}
//             >
//               <div className="radio-circle">
//                 <div className="radio-dot"></div>
//               </div>
//               <span>Credit Card</span>
//             </div>
            
//             <div 
//               className={`payment-method-option ${paymentMethod === 'swish' ? 'selected' : ''}`}
//               onClick={() => setPaymentMethod('swish')}
//             >
//               <div className="radio-circle">
//                 <div className="radio-dot"></div>
//               </div>
//               <span>Swish</span>
//             </div>
//           </div>
          
//           {paymentMethod === 'creditcard' && (
//             <div className="card-details">
//               <div className="form-group">
//                 <label htmlFor="cardNumber">Card Number</label>
//                 <input
//                   type="text"
//                   id="cardNumber"
//                   name="cardNumber"
//                   placeholder="1234 5678 9012 3456"
//                   value={formData.cardNumber}
//                   onChange={handleInputChange}
//                   className={errors.cardNumber ? 'error' : ''}
//                 />
//                 {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
//               </div>
              
//               <div className="form-row">
//                 <div className="form-group">
//                   <label htmlFor="cardExpiry">Expiry Date</label>
//                   <input
//                     type="text"
//                     id="cardExpiry"
//                     name="cardExpiry"
//                     placeholder="MM/YY"
//                     value={formData.cardExpiry}
//                     onChange={handleInputChange}
//                     className={errors.cardExpiry ? 'error' : ''}
//                   />
//                   {errors.cardExpiry && <span className="error-message">{errors.cardExpiry}</span>}
//                 </div>
                
//                 <div className="form-group">
//                   <label htmlFor="cardCVC">CVC</label>
//                   <input
//                     type="text"
//                     id="cardCVC"
//                     name="cardCVC"
//                     placeholder="123"
//                     value={formData.cardCVC}
//                     onChange={handleInputChange}
//                     className={errors.cardCVC ? 'error' : ''}
//                   />
//                   {errors.cardCVC && <span className="error-message">{errors.cardCVC}</span>}
//                 </div>
//               </div>
//             </div>
//           )}
          
//           {paymentMethod === 'swish' && (
//             <div className="swish-details">
//               <div className="form-group">
//                 <label htmlFor="swishNumber">Swish Number</label>
//                 <input
//                   type="text"
//                   id="swishNumber"
//                   name="swishNumber"
//                   placeholder="07X XXX XX XX"
//                   value={formData.swishNumber}
//                   onChange={handleInputChange}
//                   className={errors.swishNumber ? 'error' : ''}
//                 />
//                 {errors.swishNumber && <span className="error-message">{errors.swishNumber}</span>}
//               </div>
//             </div>
//           )}
          
//           <button type="submit" className="btn-place-order">Place Order</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Payment;