import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../Component/Sidebar';
import { GlobalApi } from '../service/GlobalApi';
import { Bookingdetails } from '../service/APIrouter';
import { MdOutlineDateRange } from 'react-icons/md';
import { TfiLocationPin } from 'react-icons/tfi';
import Lottie from 'lottie-react';
import loadingdata from '../Data/Playturf.json';

const UserBooking = () => {
    const [totalbooking, setTotalBooking] = useState([]);
    const [errormessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const { userId } = useParams();
    const navigate = useNavigate();

    const handleGround = (userId) => {
        navigate(`/owners/grounds/${userId}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await GlobalApi(Bookingdetails, 'POST', null, token);
                if (response.data) {
                    if (response.status === 401) {
                        setErrorMessage('Authentication error, please login again.');
                    } else if (Array.isArray(response.data.bookingDetails)) {
                        console.log('Response data:', response.data.bookingDetails);
                        console.log('userId from useParams:', userId);

                        const filterdata = response.data.bookingDetails.filter(booking => {
                            return booking.userid === userId;
                        });

                        console.log("Filtered data:", filterdata);
                        setTotalBooking(filterdata);
                    } else {
                        setTotalBooking(response.data);
                    }
                } else {
                    console.error('No data found');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setErrorMessage('Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    if (errormessage) {
        return <div className='autherror'><h1>{errormessage}</h1></div>;
    }

    return (
        <>
            <Sidebar />

            {loading ? (
                <div className="loader">
                    <div className="loading-icon">
                        <Lottie animationData={loadingdata} />
                    </div>
                </div>
            ) : (
                <>
                    <h1 className="ground-title">User Booking</h1>
                    <div className="main-ground">
                        {totalbooking.length > 0 ? (
                            totalbooking.map((ground, index) => (
                                <div className="ground-content" key={index}>
                                    <div className="ground-image">
                                        {/* <img
                                            className="ground-img"
                                            src={ground.img || "/image/ground.jpg"}
                                            alt={ground.ownername}
                                        /> */}
                                    </div>
                                    <div className="ground">
                                        <div className="ground-detail">
                                            <div className="ground-sub-details">
                                                <h3>{ground.groundname}</h3>
                                                <div className="ground-location">
                                                    <p><TfiLocationPin size={"15px"} /></p>
                                                    <p> {ground.location}</p>
                                                </div>
                                                <div className="ground-date">
                                                    <p><MdOutlineDateRange size={"15px"} /></p>
                                                    <p> {ground.date?.slice(0, 10)}{" "}</p>
                                                </div>
                                            </div>
                                            <div className="ground-more-details">
                                                <button onClick={() => handleGround(ground.userId)}>More Details</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="ground">
                                <div className="no-booking">
                                    <p>No bookings available...</p>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default UserBooking;
