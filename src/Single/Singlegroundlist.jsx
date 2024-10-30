import React, { useState } from 'react'
import { MdOutlineEditNote } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { GlobalApi } from '../service/GlobalApi';
import { Admindeleteground, Admineditground, Getoneground } from '../service/APIrouter';
import { useNavigate } from 'react-router';
import Popup from '../Dialogbox/Popup';
import { ToastContainer, toast } from 'react-toastify';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const Singlegroundlist = ({ ground }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const Navigate = useNavigate();

    const handleedit = async (ground) => {
        try {
            const token = localStorage.getItem("token");
            console.log("ground", ground);
            const groundId = ground._id;
            const data = ground.ownerid;
            console.log("groundid", groundId);
            console.log("data", data);
            const response = await GlobalApi(`${Getoneground}/${groundId}`, 'GET', null, token);

            if (response.status === 200) {
                const userData = response.data;
                console.log(userData);
                Navigate(`/venue/edit/${groundId}`);
            }
            console.log("ID", groundId);
        } catch (error) {
            console.error('Error', error);
        }
    };

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    const handledelete = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await GlobalApi(`${Admindeleteground}/${userId}`, 'POST', null, token);
            notify();
            if (response.status === 200) {
            }
            console.log('delete', userId);
        } catch (error) {
            console.error('error', error);
        }
    };

    const notify = () => {
        toast.success("Data deleted successfully", {
            onClose: () => {
                window.location.reload();
            }
        });
    }

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        adaptiveHeight: true,
    };

    return (
        <div>
            <ToastContainer autoClose={1000} closeOnClick />
            <div className="main-allground">
                <Slider {...settings}>
                    {ground.photos.map((photo, index) => (
                        <img key={index} src={photo.photourl} alt={`img${index}`} />
                    ))}
                </Slider>
                <div className="allground-info-div">
                    <div className="allground-operation">
                        <div className="allground-flex">
                            <div className="allground-groundname">
                                <p>{ground.groundname}</p>
                            </div>

                            <div className="allground-edit">
                                <p><MdOutlineEditNote onClick={() => handleedit(ground)} /></p>
                            </div>


                            <div className="allground-delete">
                                <p onClick={() => {
                                    setIsOpen(true);
                                    setUserToDelete(ground)
                                }}><RiDeleteBin6Fill /></p>
                            </div>
                        </div>

                        <div className="allground-sport">
                            <p>{ground.sport_type.join(',   ')}</p>
                        </div>


                        <div className="allground-location">
                            <p>{ground.location}, {ground.state}</p>
                        </div>
                    </div>
                </div>

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
                                        onClick={() => handledelete(userToDelete._id)}
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

            </div>
        </div>

    )
}

export default Singlegroundlist