import React, { useState } from 'react';
import { Admindeactivateuser, Adminreactivateuser, DeleteAPI, getUserAPI } from '../service/APIrouter';
import { Link, useNavigate } from 'react-router-dom';
import { RiDeleteBin6Fill } from "react-icons/ri";
import { CgMoreVerticalO } from "react-icons/cg";
import Popup from '../Dialogbox/Popup';
import { MdOutlineEditNote } from "react-icons/md";
import { GlobalApi } from '../service/GlobalApi';
import { ToastContainer, toast } from 'react-toastify';

const Singleuser = ({ user: initialUser }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const navigate = useNavigate();
    const [user, setUser] = useState(initialUser);

    const handleDelete = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await GlobalApi(`${DeleteAPI}/${userId}`, 'DELETE', null, token);
            notify();
            if (response.status === 200) {
            }
            console.log("deleted", userId);
        } catch (error) {
            console.error('Error', error);
        }
    };

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };


    const notify = () => {
        toast.success("Data deleted successfully", {
            onClose: () => {
                window.location.reload();
            }
        });
    }

    const handlereactivebutton = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await GlobalApi(`${Adminreactivateuser}/${userId}`, 'POST', null, token);
            if (response.status === 200) {
                setUser(prevUser => ({ ...prevUser, status: "Active" }));
            }
            console.log("deactive", userId);
        } catch (error) {
            console.error('Error', error);
        }
    };

    const handledeactivebutton = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await GlobalApi(`${Admindeactivateuser}/${userId}`, 'POST', null, token);
            if (response.status === 200) {
                setUser(prevUser => ({ ...prevUser, status: "Inactive" }));
            }
            console.log("reactive", userId);
        } catch (error) {
            console.error('Error', error);
        }
    }

    const handleedit = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await GlobalApi(`${getUserAPI}/${userId}`, 'GET', null, token);

            if (response.status === 200) {
                const userData = response.data;
                console.log(userData);
                navigate(`/users/edit/${userId}`);
            }
            console.log("ID", userId);
        } catch (error) {
            console.error('Error', error);
        }
    };

    return (
        <>
            <ToastContainer autoClose={1000} closeOnClick />
            <tr key={user._id} className='user-row'>
                <td>
                    <img
                        className="user-profile-image"
                        src={"/image/avatar.png"}
                        alt=""
                    />
                    <span>{user.first_name ? user.first_name + ' ' + user.last_name : "-"}</span>
                </td>
                <td className='user-div'>{user.email ? user.email : "-"}</td>
                <td className='user-div'>{user.mobile ? user.mobile : "-"}</td>
                <td className='user-div'>{user.lasttimeloggedout ? user.lasttimeloggedout.slice(0, 10) : "not logout"}</td>

                <td className='user-div'>
                    <button
                        className={
                            user.status === "Active"
                                ? "status-button green-button"
                                : "status-button red-button"
                        }
                        onClick={() => {
                            if (user.status === 'Active') {
                                handledeactivebutton(user._id);
                            } else {
                                handlereactivebutton(user._id);
                            }
                        }}
                    >{user.status === "Active" ? "Deactivate" : "Activate"}</button>
                </td>
                <td>
                    {user.createdat.slice(0, 10)}{" "}
                </td>
                <td>
                    <i className="edit-icon">

                        <MdOutlineEditNote onClick={() => handleedit(user._id)} />

                    </i>
                    <i
                        onClick={() => {
                            setIsOpen(true);
                            setUserToDelete(user);
                        }}
                        className="trash-icon"
                    ><RiDeleteBin6Fill /></i>
                </td>
            </tr>

            {isOpen && (
                <Popup
                    content={
                        <div>
                            <div>

                                <p style={{ marginTop: "20px", fontSize: "18px" }}> Are you sure you want to delete  {userToDelete.name} data?
                                </p>
                            </div>

                            <div>
                                <button
                                    onClick={togglePopup}
                                    className="btn btn-style popup-cancel"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(userToDelete._id)}
                                    className="btn btn-style popup-delete"
                                >
                                    SAVE
                                </button>
                            </div>

                        </div >
                    }
                    handleClose={togglePopup}
                />

            )}


        </>
    );


};

export default Singleuser;
