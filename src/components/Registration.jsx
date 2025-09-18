import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import toast from 'react-hot-toast';
import { validationCheck } from "./utilities/utilitiesFunction";

const Registration = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [skills, setSkills] = useState("");
  const navigate = useNavigate();

  const skillsArray = skills.split(/[, ]+/).filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/register", {
        username: userName, email, password, skills: skillsArray
      });

      if (res.data.code === 'Already_Match_Found') {
        toast.error("Email Already Exists");
      } else if (res.data.code === 'VALIDATION_MSG_CODE_400') {
        validationCheck(res.data);
      } else {
        toast.success("Registration Successful");
        setUserName("");
        setEmail("");
        setPassword("");
        setSkills("");
        navigate("/");
      }
    } catch (err) {
      toast.error("Registration Failed");
    }
  };

  const removeElement = (index) => {
    const updatedSkills = skillsArray.filter((_, i) => i !== index);
    setSkills(updatedSkills.join(', '));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: "url('public/image.png')" }}>
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl font-bold">Register</h2>
          <p className="text-center text-sm text-base-content/60 mb-4">
            Create a new account to get started.
          </p>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">User Name</span>
              </label>
              <input
                type="text"
                value={userName}
                placeholder="Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={e => setUserName(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">skills</span>
              </label>
              <input
                type="text"
                value={skills}
                placeholder="🤹‍♀️"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={e => setSkills(e.target.value)}
              />
              <div>
                {skillsArray.map((skill, index) => (
                  <span key={index} className="btn btn-square rounded-lg ml-1 mt-1 w-auto inline-flex items-center">
                    <FontAwesomeIcon icon={faTimes} onClick={() => removeElement(index)} />
                    <span className="mr-2">{skill}</span>
                  </span>
                ))}
              </div>
            </div>
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
                onChange={e => setEmail(e.target.value)}
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
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button className="btn btn-primary w-full mt-2">Sign Up</button>
          </form>
          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link to="/" className="link link-primary">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;
