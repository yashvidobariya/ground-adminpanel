// Profile.jsx
import React from 'react';
import Sidebar from '../Component/Sidebar';
import { FiEdit } from "react-icons/fi";
import { MdAddAPhoto } from "react-icons/md";
import { GlobalApi } from '../service/GlobalApi';
import { Adminlogout } from '../service/APIrouter';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router';
import { RiLogoutCircleLine } from "react-icons/ri";

const Profile = () => {
    const userdata = JSON.parse(localStorage.getItem('userdata'));
    const { admin } = userdata || {};
    const { email, name, mobile } = admin || {};
    const navigate = useNavigate();

    const handleEdit = () => {
        alert("edit");
    }

    const handlelogout = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log(token);
            const response = await GlobalApi(Adminlogout, 'GET', null, token);
            if (response.status === 200) {
                localStorage.removeItem('token');
                localStorage.removeItem('userdata');
            }
            console.log("response", response)
            notify();
        }
        catch (error) {
            console.error('error:', error);
        }
    }

    const notify = () => {
        toast.success("Logout successful", {
            onClose: () => navigate('/')
        });
    }

    return (
        <>
            <ToastContainer autoClose={3000} closeOnClick />
            <Sidebar />
            {/* <Header doNotShowSearch={true} donotcal={true} /> */}
            <div className="main-profile">
                <div className="profile-div">
                    <div className="profile-img-div">
                        <div className="profile-img-container">
                            <div className="profile-img">
                                <img
                                    className="profile-image"
                                    src={"/image/avatar.png"}
                                    alt=""
                                />
                            </div>
                            <div className="profile-add">
                                <MdAddAPhoto />
                            </div>
                        </div>
                        <div className="profile-name">
                            <h4>{name}</h4>
                            <p>{email}</p>
                        </div>
                    </div>
                    <div className="profile-details">
                        <div className="profile-main-title">
                            <div className="profile-header">
                                <h1>Profile</h1>
                            </div>
                            <div className='profile-edit-button'>
                                <FiEdit onClick={handleEdit} />
                            </div>
                        </div>
                        <div className="profile-info">
                            <div className="name">
                                <p>Name</p>
                            </div>
                            <div className="profile-input-name">
                                <input type='text' placeholder='name' defaultValue={name} />
                            </div>
                        </div>
                        <div className="profile-info">
                            <div className="name">
                                <p>Email</p>
                            </div>
                            <div className="profile-input-name">
                                <input type='email' placeholder='email' defaultValue={email} />
                            </div>
                        </div>
                        <div className="profile-info">
                            <div className="name">
                                <p>Mobile</p>
                            </div>
                            <div className="profile-input-name">
                                <input type='text' placeholder='mobile' defaultValue={mobile} />
                            </div>
                        </div>
                        <div className="profile-logout" onClick={handlelogout} >
                            <RiLogoutCircleLine />
                            <div className="logout-font">
                                <p>Logout</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile;
