
import React, { useState } from 'react';
import { BiLogoFacebookCircle } from "react-icons/bi";
import { AiOutlineTwitter, AiOutlineGoogle } from "react-icons/ai";
import { Adminsignup } from '../service/APIrouter';
import { useNavigate } from 'react-router-dom';
import { GlobalApi } from '../service/GlobalApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
    const naviage = useNavigate();
    const [formdata, setformdata] = useState({
        name: '',
        email: '',
        mobile: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setloading] = useState(false);

    const handlechange = (e) => {
        setformdata({ ...formdata, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' })
    }

    const handlesubmit = async (e) => {
        e.preventDefault();
        let errormsg = {};

        if (!formdata.name) {
            errormsg.name = "Name is required";
        }

        if (!formdata.email) {
            errormsg.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formdata.email)) {
            errormsg.email = "Invalid email format";
        }

        if (!formdata.mobile) {
            errormsg.mobile = "Mobile is required";
        } else if (!/^\d{10}$/.test(formdata.mobile)) {
            errormsg.mobile = "Mobile number must be 10 digits"
        }

        if (!formdata.password) {
            errormsg.password = "Password is required";
        }

        if (Object.keys(errormsg).length > 0) {
            setErrors(errormsg);
            return;
        }

        setloading(true);

        try {
            const { data } = await GlobalApi(Adminsignup, 'POST', formdata);
            console.log(data);


            if (data.error) {
                errormsg.email = "An account with this email already exists";
                setErrors(errormsg);
            } else {
                notify();
                console.log("Signup successful");
                console.log(data);

                // setformdata({
                //     name: '',
                //     email: '',
                //     mobile: '',
                //     password: ''
                // });
            }
        }
        catch (error) {
            console.error("Error:", error);
            toast.warn("Please try again...");
        } finally {
            setloading(false);
        }
    }

    const notify = () => {
        toast.success("singup successfully done", {
            onClose: () => naviage("/")
        });
    }

    return (
        <>
            <ToastContainer autoClose={3000} closeOnClick />
            <div className='login'>
                <div className="login-form">

                    <form >
                        <div className="login-main">
                            <div className="login-title">
                                <h1>Join us today</h1>
                                <div className="login-social">
                                    <div className="login-icon">
                                        <BiLogoFacebookCircle className='social-icon' />
                                    </div>
                                    <div className="login-icon">
                                        <AiOutlineGoogle className='social-icon' />
                                    </div>
                                    <div className="login-icon">
                                        <AiOutlineTwitter className='social-icon' />
                                    </div>
                                </div>
                            </div>


                        </div>

                        <div className="login-input">

                            <div className="login-text">
                                <input type="text" placeholder='Name' name="name" value={formdata.name} onChange={handlechange} />
                                {errors.name && <div className="error">{errors.name}</div>}
                            </div>

                            <div className="login-text">
                                <input type="text" placeholder='Email' name="email" value={formdata.email} onChange={handlechange} />
                                {errors.email && <div className="error">{errors.email}</div>}
                            </div>

                            <div className="login-text">
                                <input type="text" placeholder='mobile Number' name="mobile" value={formdata.mobile} onChange={handlechange} />
                                {errors.mobile && <div className="error">{errors.mobile}</div>}
                            </div>

                            <div className="login-text">
                                <input type="text" placeholder='Password' name="password" value={formdata.password} onChange={handlechange} />
                                {errors.password && <div className="error">{errors.password}</div>}
                            </div>
                        </div>

                        <div className="tearm-up">
                            <input type="checkbox" className="checkbox" />
                            I agree the Terms and Conditions
                        </div>
                        <div className="login-button">

                            <button onClick={handlesubmit}>{loading ? 'Submitting....' : 'Sign Up'}</button>

                        </div>

                    </form>
                </div>
            </div>
        </>
    )
}

export default Signup













