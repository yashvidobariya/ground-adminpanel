import React, { useState } from 'react';
import { DeleteAPI, getUserAPI } from '../service/APIrouter';
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { MdOutlineEditNote } from "react-icons/md";
import Popup from '../Dialogbox/Popup';
import { GlobalApi } from '../service/GlobalApi';
import { CgMoreVerticalO } from 'react-icons/cg';
import { ToastContainer, toast } from 'react-toastify';

const SingleOwner = ({ user }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const handledelete = async (userId) => {
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

    const handleedit = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await GlobalApi(`${getUserAPI}/${userId}`, 'GET', null, token);

            if (response.status === 200) {
                const userData = response.data;
                console.log(userData);
                navigate(`/owners/edit/${userId}`);
            }
            console.log("ID", userId);
        } catch (error) {
            console.error('Error', error);
        }
    };

    const handleground = async (userId) => {
        navigate(`/owners/grounds/${userId}`);
    };


    const notify = () => {
        toast.success("Data deleted successfully", {
            onClose: () => {
                window.location.reload();
            }
        });
    }


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
                <td className='user-div'>USA</td>
                <td className='user-div'>{user.mobile ? user.mobile : "-"}</td>
                <td className='user-div'>
                    {user.noofownedgrounds} &nbsp;
                    <CgMoreVerticalO className='info-icon' onClick={() => handleground(user._id)} />
                </td>
                <td className='user-div'>
                    <i
                        className={
                            user.status === "Active"
                                ? "fa-solid fa-circle circle-icon-active"
                                : "fa-solid fa-circle circle-icon-inactive"
                        }
                    ></i>
                    &nbsp;{user.status ? user.status : "Inactive"}
                </td>
                <td className='user-div'>
                    {user.createdat?.slice(0, 4)}{" "}
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
                                <p style={{ marginTop: "20px", fontSize: "18px" }}> Are you sure you want to delete  {userToDelete.name} data?</p>
                            </div>
                            <div>
                                <button
                                    onClick={togglePopup}
                                    className="btn btn-style popup-cancel"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handledelete(userToDelete._id)}
                                    className="btn btn-style popup-delete"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    }
                    handleClose={togglePopup}
                />
            )}
        </>
    )
}

export default SingleOwner;
