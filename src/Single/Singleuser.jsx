import React, { useState } from 'react';
import { Admindeactivateuser, Adminreactivateuser, DeleteAPI, getUserAPI, useractivity } from '../service/APIrouter';
import { Link, useNavigate } from 'react-router-dom';
import { RiDeleteBin6Fill, RiH1 } from "react-icons/ri";
import Popup from '../Dialogbox/Popup';
import { MdOutlineEditNote } from "react-icons/md";
import { GlobalApi } from '../service/GlobalApi';
import { ToastContainer, toast } from 'react-toastify';
import { MdHistory } from "react-icons/md";
import { GrClose } from "react-icons/gr";

const Singleuser = ({ user: initialUser }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const navigate = useNavigate();
    const [user, setUser] = useState(initialUser);
    const [isOpen1, setIsOpen1] = useState(false);
    const [histroy, sethistroy] = useState([]);

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

    const togglePopup1 = () => {
        setIsOpen1(!isOpen1);
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
            console.log("deactivated", userId);
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
            console.log("reactivated", userId);
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

    const handlehistroy = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await GlobalApi(`${useractivity}/${userId}`, 'POST', null, token);
            if (response.status === 200) {
                sethistroy(response.data.activities);
                setIsOpen1(true);
            }
            console.log("history", response.data.activities);
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
                        alt="profile"
                    />
                    <span>{user.first_name ? user.first_name + ' ' + user.last_name : "-"}</span>
                </td>
                <td className='user-div'>{user.email ? user.email : "-"}</td>
                <td className='user-div'>{user.mobile ? user.mobile : "-"}</td>
                <td className='user-div'>{user.lasttimeloggedout ? user.lasttimeloggedout.slice(0, 10) : "not logout"}</td>

                <td className='user-div'>
                    <button
                        className={user.status === "Active" ? "status-button green-button" : "status-button red-button"}
                        onClick={() => {
                            if (user.status === 'Active') {
                                handledeactivebutton(user._id);
                            } else {
                                handlereactivebutton(user._id);
                            }
                        }}
                    >
                        {user.status === "Active" ? "Deactivate" : "Activate"}
                    </button>
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
                    <i className="histroy-icon">
                        <MdHistory onClick={() => handlehistroy(user._id)} />
                    </i>
                </td>
            </tr>

            {isOpen && (
                <Popup
                    content={
                        <div>
                            <p style={{ marginTop: "20px", fontSize: "18px" }}> Are you sure you want to delete {userToDelete.name} data?</p>
                            <button onClick={togglePopup} className="btn btn-style popup-cancel">Cancel</button>
                            <button onClick={() => handleDelete(userToDelete._id)} className="btn btn-style popup-delete">SAVE</button>
                        </div>
                    }
                    handleClose={togglePopup}
                />
            )}

            {isOpen1 && (
                <div className="popup">
                    <div className="popup-content-history">
                        <div className="popup-display-main">
                            <h1>User Activity</h1>
                            <GrClose onClick={togglePopup1} />
                        </div>

                        <div className='user-activity'>
                            {histroy.length > 0 ? (
                                histroy.map((item, index) => (
                                    <div key={index}>
                                        <p>{item.date}</p>
                                        <p>{item.description}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No user history found.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Singleuser;
