// 'use client'

// import { useState } from 'react';
// import { authService } from '@/services/authService';
// import { useRouter } from 'next/navigation';
// import { toast } from 'react-toastify';

// const FormContent = ({ onRegistrationSuccess }) => {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     password: ''
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       await authService.register(
//         formData.fullName,
//         formData.email,
//         formData.phone,
//         formData.password
//       );

//       console.log('Registration successful in FormContent.');
//       toast.success('Registration successful!');

//       if (onRegistrationSuccess) {
//         onRegistrationSuccess();
//       } else {
//         // Redirect to login page after successful registration (default behavior)
//         router.push('/login');
//       }
//     } catch (error) {
//       setError(error.message || 'Registration failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       {error && <div className="alert alert-danger">{error}</div>}
      
//       <div className="form-group">
//         <label>Full Name</label>
//         <input 
//           type="text" 
//           name="fullName" 
//           placeholder="Enter your full name" 
//           required 
//           value={formData.fullName}
//           onChange={handleChange}
//         />
//       </div>
//       {/* fullName */}

//       <div className="form-group">
//         <label>Email Address</label>
//         <input 
//           type="email" 
//           name="email" 
//           placeholder="Enter your email" 
//           required 
//           value={formData.email}
//           onChange={handleChange}
//         />
//       </div>
//       {/* email */}

//       <div className="form-group">
//         <label>Phone Number</label>
//         <input 
//           type="tel" 
//           name="phone" 
//           placeholder="Enter your phone number" 
//           required 
//           value={formData.phone}
//           onChange={handleChange}
//         />
//       </div>
//       {/* phone */}

//       <div className="form-group">
//         <label>Password</label>
//         <input
//           id="password-field"
//           type="password"
//           name="password"
//           placeholder="Enter your password"
//           required
//           value={formData.password}
//           onChange={handleChange}
//         />
//       </div>
//       {/* password */}

//       <div className="form-group">
//         <button 
//           className="theme-btn btn-style-one" 
//           type="submit"
//           disabled={loading}
//         >
//           {loading ? 'Registering...' : 'Register'}
//         </button>
//       </div>
//       {/* register button */}
//     </form>
//   );
// };

// export default FormContent;
'use client'

import { useState } from 'react';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const FormContent = ({ onRegistrationSuccess }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.register(
        formData.fullName,
        formData.email,
        formData.phone,
        formData.password
      );

      console.log('Registration successful in FormContent.');
      toast.success('Registration successful!');

      if (onRegistrationSuccess) {
        onRegistrationSuccess();
      } else {
        // Redirect to login page after successful registration (default behavior)
        router.push('/login');
      }
    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="form-group">
        <label>Full Name</label>
        <input 
          type="text" 
          name="fullName" 
          placeholder="Enter your full name" 
          required 
          value={formData.fullName}
          onChange={handleChange}
        />
      </div>
      {/* fullName */}

      <div className="form-group">
        <label>Email Address</label>
        <input 
          type="email" 
          name="email" 
          placeholder="Enter your email" 
          required 
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      {/* email */}

      <div className="form-group">
        <label>Phone Number</label>
        <input 
          type="tel" 
          name="phone" 
          placeholder="Enter your phone number" 
          required 
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      {/* phone */}

      <div className="form-group">
        <label>Password</label>
        <input
          id="password-field"
          type="password"
          name="password"
          placeholder="Enter your password"
          required
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      {/* password */}

      <div className="form-group">
        <button 
          className="theme-btn btn-style-one" 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </div>
      {/* register button */}
    </form>
  );
};

export default FormContent;