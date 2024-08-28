import React, { useState } from 'react'
import { BiLogoFacebookCircle } from "react-icons/bi";
import { AiOutlineTwitter, AiOutlineGoogle } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { Adminlogin } from '../service/APIrouter';
import { GlobalApi } from '../service/GlobalApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const nagivate = useNavigate();
    const [formdata, setformdata] = useState({
        email: '',
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

        if (!formdata.email) {
            errormsg.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formdata.email)) {
            errormsg.email = "Invalid email format";
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

            const { data } = await GlobalApi(Adminlogin, 'POST', formdata);
            console.log(data);

            if (data.error === ('There is no account with given email address. Please register first to login !')) {
                errormsg.email = "There is no account with given email address. Please register first to login !";
                setErrors(errormsg);
            }

            else if (data.error === 'The entered password is incorrect') {
                errormsg.password = "The entered password is incorrect";
                setErrors(errormsg);
            }
            else {
                console.log(data);
                localStorage.setItem('token', data.token);
                localStorage.setItem('userdata', JSON.stringify(data));

                notify();
                console.log("login", data);

                // setformdata({
                //     email: '',
                //     password: ''
                // });
            }

        } catch (error) {
            console.error("Error:", error);
            toast.warn("Failed to login. Please try again...");
        } finally {
            setloading(false);
        }
    };


    const notify = () => {
        toast.success("Login successfully done", {
            onClose: () => nagivate("/dashboard")
        });
    }


    return (
        <>
            <ToastContainer autoClose={3000} closeOnClick />
            <div className='login'>
                <div className="login-form">
                    <form action="">
                        <div className="login-main">
                            <div className="login-title">
                                <h1>Sign in</h1>
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
                                <input type="text" placeholder='Email' name="email" onChange={handlechange} value={formdata.email} />
                                {errors.email && <div className="error">{errors.email}</div>}
                            </div>

                            <div className="login-text">
                                <input type="text" placeholder='Password' name="password" onChange={handlechange} value={formdata.password} />
                                {errors.password && <div className="error">{errors.password}</div>}
                            </div>

                            <div className="login-con">
                                <div className="login-pass">
                                    <p>Forget password?</p>
                                </div>
                            </div>
                        </div>

                        <div className="login-button">

                            <button onClick={handlesubmit}>{loading ? "Loading..." : "Log In"}</button>

                        </div>
                        {/* <div className="login-singup">
                            <p>
                                Don't have an account? <Link to="/adminsignup">
                                    Sign up
                                </Link>
                            </p>
                        </div> */}

                    </form>
                </div>
            </div>
        </>
    )
}

export default Login













