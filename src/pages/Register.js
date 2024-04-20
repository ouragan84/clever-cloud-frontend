import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';

// function RegistrationForm() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     termsAgreed: false
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === 'checkbox' ? checked : value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Check if passwords match
//     if (formData.password !== formData.confirmPassword) {
//       alert('Passwords do not match!');
//       return; // Do not submit form data
//     }
  
//     // Check if terms and conditions are agreed
//     if (!formData.termsAgreed) {
//       alert('You must agree to the terms and conditions.');
//       return; // Do not submit form data
//     }
  
//     // Since formData will be mutated to remove confirmPassword, create a copy to avoid side effects
//     let submitData = {
//       ...formData,
//       password: CryptoJS.SHA256(formData.password).toString(),
//       // confirmPassword is not needed for submission, so it's omitted
//     };
  
//     // Remove confirmPassword from submitData before sending it to the server
//     delete submitData.confirmPassword;
  
//     console.log('Submitted Credentials:', submitData);
  
//     // TODO: Send `submitData` to your backend server
//     try {
//       const response = await fetch('http://127.0.0.1:5000/register', { // Use the correct endpoint for registration
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(submitData),
//       });
//       const data = await response.json();
//       console.log(data);
//       // Handle the response appropriately
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };
  

//   return (
//     <form onSubmit={handleSubmit} style={{ width: '300px', margin: 'auto', display: 'flex', flexDirection: 'column' }}>
//       <h2>Register</h2>
//       <input 
//         type="text" 
//         name="name" 
//         value={formData.name} 
//         onChange={handleChange}
//         placeholder="Name" 
//         required
//         style={{ width: '100%', padding: '10px', margin: '5px 0' }}
//       />
//       <input 
//         type="email" 
//         name="email" 
//         value={formData.email} 
//         onChange={handleChange}
//         placeholder="Email Address" 
//         required 
//         style={{ width: '100%', padding: '10px', margin: '5px 0' }}
//       />
//       <input 
//         type="password" 
//         name="password" 
//         value={formData.password} 
//         onChange={handleChange}
//         placeholder="Password" 
//         required
//         style={{ width: '100%', padding: '10px', margin: '5px 0' }}
//       />
//       <input 
//         type="password" 
//         name="confirmPassword" 
//         value={formData.confirmPassword} 
//         onChange={handleChange}
//         placeholder="Re-type Password" 
//         required
//         style={{ width: '100%', padding: '10px', margin: '5px 0' }} 
//       />
//       <label style={{ width: '100%', padding: '10px', margin: '5px 0' }}>
//         <input 
//           type="checkbox" 
//           name="termsAgreed" 
//           checked={formData.termsAgreed} 
//           onChange={handleChange}
//         />
//         Agree our Terms and Conditions
//       </label>
//       <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#8e44ad', color: 'white', border: 'none', borderRadius: '4px' }}>
//         Register
//       </button>
//       <p>Have an account? <a href="/login">Login</a></p>
//     </form>
//   );
// }

// export default RegistrationForm;

function RegistrationForm(props) {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsAgreed: false
    });

    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      if (!formData.termsAgreed) {
        alert('You must agree to the terms and conditions.');
        return;
      }
      const hashedPassword = CryptoJS.SHA256(formData.password).toString();
  
      try {
        const response = await fetch('http://127.0.0.1:5000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: hashedPassword,
            termsAgreed: formData.termsAgreed
          }),
        });
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          localStorage.setItem('token', data.access_token);  // Save the token
          // Redirect the user to another page or handle logged in status
          props.setToken(data.access_token);  // Update the authToken state in App
          navigate('/');
        } else {
          // Handle errors or show an error message
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
          ...formData,
          [name]: type === 'checkbox' ? checked : value
        });
      };
  
    return (
        <form onSubmit={handleSubmit} style={{ width: '300px', margin: 'auto', display: 'flex', flexDirection: 'column' }}>
        <h2>Register</h2>
        <input 
          type="text" 
          name="name" 
          value={formData.name} 
          onChange={handleChange}
          placeholder="Name" 
          required
          style={{ width: '100%', padding: '10px', margin: '5px 0' }}
        />
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange}
          placeholder="Email Address" 
          required 
          style={{ width: '100%', padding: '10px', margin: '5px 0' }}
        />
        <input 
          type="password" 
          name="password" 
          value={formData.password} 
          onChange={handleChange}
          placeholder="Password" 
          required
          style={{ width: '100%', padding: '10px', margin: '5px 0' }}
        />
        <input 
          type="password" 
          name="confirmPassword" 
          value={formData.confirmPassword} 
          onChange={handleChange}
          placeholder="Re-type Password" 
          required
          style={{ width: '100%', padding: '10px', margin: '5px 0' }} 
        />
        <label style={{ width: '100%', padding: '10px', margin: '5px 0' }}>
          <input 
            type="checkbox" 
            name="termsAgreed" 
            checked={formData.termsAgreed} 
            onChange={handleChange}
          />
          Agree our Terms and Conditions
        </label>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#8e44ad', color: 'white', border: 'none', borderRadius: '4px' }}>
          Register
        </button>
        <p>Have an account? <a href="/login">Login</a></p>
      </form>
    );
  }

  export default RegistrationForm;