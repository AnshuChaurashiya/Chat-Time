import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function RegisterPage() {
  const [step, setStep] = useState("signup");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    if (fullName && email && password) {
      setStep("bio");
    } else {
      alert("Please fill all the fields");
    }
  };

  const handleSubmitBio = async () => {
    try {
      await login("signup", { 
        fullname: fullName, 
        email, 
        password, 
        bio,
        profileImg: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" // Default profile image
      });
      navigate("/"); // redirect to home or dashboard
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden w-full max-w-6xl flex flex-col md:flex-row">
        
        {/* Left Side */}
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white md:w-1/2 p-10 flex flex-col justify-center">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to ChatTime</h1>
            <p className="text-md mb-6 text-center">
              Connect with people in real-time.<br />
              Create your account and start chatting instantly.
            </p>
            <img
              src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
              alt="Chat Illustration"
              className="w-48"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="md:w-1/2 p-10 flex items-center justify-center">
          <div className="w-full max-w-md">
            {step === "signup" ? (
              <>
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Create an Account</h2>
                <form className="space-y-4" onSubmit={handleSignup}>
                  <div>
                    <label className="block text-sm text-gray-600 font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 font-medium mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 font-medium mb-1">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="w-full flex justify-center">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white py-3 px-6 rounded-full hover:bg-blue-700 transition"
                    >
                      Continue
                    </button>
                  </div>
                </form>
                <p className="text-sm text-center text-gray-500 mt-4">
                  Already have an account?{' '}
                  <a href="/login" className="text-blue-600 hover:underline">
                    Login
                  </a>
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Tell us about yourself</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 font-medium mb-1">Short Bio</label>
                    <textarea
                      placeholder="I'm a web developer who loves chatting..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={5}
                      className="w-full px-4 py-3 bg-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                    />
                  </div>
                  <div className="w-full flex justify-center">
                    <button
                      type="button"
                      onClick={handleSubmitBio}
                      className="bg-blue-600 text-white py-3 px-6 rounded-full hover:bg-blue-700 transition"
                    >
                      Submit Bio
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
