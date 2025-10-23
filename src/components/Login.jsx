import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { validationCheck } from "./utilities/utilitiesFunction";
import { useDispatch } from "react-redux";
import { loginUser } from "./AppStores/userSlice";
import { API_BASE_URL } from "./utilities/url";

const Login = () => {
  const [email, setEmail] = useState("keyurhalpati@gmail.com");
  const [password, setPassword] = useState("keyur123");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post(`${API_BASE_URL}/login`, { email, password })
      if (res.data.code === 'VALID_CREDENTIALS_200') {
        toast.success("Login Successful...");
        dispatch(loginUser({ user: res.data.user, token: res.headers.token }));
        navigate(`/chat/${res.data.user.id}`);
      } else if (res.data.code === 'VALIDATION_MSG_CODE_400') {
        validationCheck(res.data);
      } else {
        toast.error("Invalid Credentials");
      }
    } catch (error) {
      console.error(error);
      toast.error("Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative" style={{backgroundImage: "url('/image.png')"}}>
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl font-bold">
            Login
          </h2>
          <p className="text-center text-sm text-base-content/60 mb-4">
            Welcome back! Please enter your details.
          </p>

          {/* Form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                value={email}
                placeholder="you@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                value={password}
                placeholder="********"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <label className="label">
                <a href="#" className="label-text-alt link link-hover">
                  Forgot password?
                </a>
              </label>
            </div>

            <button className="btn btn-primary w-full mt-2">Login</button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm mt-4">
            Don’t have an account?{" "}
            <Link to="/registration" className="link link-primary">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
