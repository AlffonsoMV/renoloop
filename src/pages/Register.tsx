import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { useAuthStore } from '../store/authStore';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'property-owner' as 'property-owner' | 'tenant' | 'administrator',
  });
  
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await register(
        formData.email,
        formData.password,
        formData.name,
        formData.role
      );
      
      // Redirect to dashboard on successful registration
      navigate('/dashboard');
    } catch {
      // Error is handled by the store
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Create an Account
          </h1>
          <p className="text-slate-400">Join RenoLoop and start your journey</p>
        </div>

        <Card>
          {error && <Alert type="error" message={error} />}

          <form onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              name="name"
              type="text"
              className="w-full"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              error={formErrors.name}
              required
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              className="w-full"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              className="w-full"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              required
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              className="w-full"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={formErrors.confirmPassword}
              required
            />

            <div className="mb-6">
              <label className="block text-white mb-2 font-medium">
                I am a:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label
                  className={`flex items-center justify-center p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.role === "property-owner"
                      ? "bg-orange-500/20 border-orange-500"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="property-owner"
                    checked={formData.role === "property-owner"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="text-white font-medium">Property Owner</span>
                </label>

                <label
                  className={`flex items-center justify-center p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.role === "tenant"
                      ? "bg-orange-500/20 border-orange-500"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="tenant"
                    checked={formData.role === "tenant"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="text-white font-medium">Tenant</span>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="mb-4"
            >
              Create Account
            </Button>

            <p className="text-center text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-orange-500 hover:text-orange-400 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
