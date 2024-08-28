import React, { useEffect, useState } from 'react'
import Sidebar from '../Component/Sidebar';
import Header from '../Component/Header';
import { useParams } from 'react-router';
import { Getownergrounddetail } from '../service/APIrouter';
import { GlobalApi } from '../service/GlobalApi';
import loadingdata from '../Data/Playturf.json'
import Lottie from 'lottie-react'
import Review from '../Review';
const Grounddetails = () => {

    const { userId } = useParams();
    console.log(userId);
    const [userData, setUserData] = useState([]);
    const [loading, setloading] = useState(true);


    useEffect(() => {
        const fetchdata = async () => {
            try {
                const response = await GlobalApi(`${Getownergrounddetail}/${userId}`, 'GET');
                console.log("response", response);

                if (response.data) {
                    const userdata = response.data;
                    setUserData(userdata);
                    console.log(userdata);
                }
            } catch (error) {
                console.log("error", error)
            } finally {
                setloading(false);
            }
        }
        fetchdata();
    }, [userId])

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
                <div>
                    <div className="main-ground-event">
                        <div className="ground-event">

                            <div className="ground-head">


                                <div className="ground-event-content">

                                    <div className="ground-bg">
                                        <img
                                            className="ground-event-image"
                                            src={"/image/login-bg.png"}
                                            alt=""
                                        />
                                    </div>

                                    <div className="ground-event-details">
                                        <h1 className='details-title'>Ground Details</h1>
                                        <div className="ground-name">
                                            <h2>{userData.groundname}</h2>
                                        </div>


                                        <div className="ground-description">
                                            <p>{userData.description} <br />
                                                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Asperiores, sapiente! Tenetur voluptas minus in nam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis nulla blanditiis laudantium dolorem id veniam molestias tempora quasi laborum reprehenderit?
                                            </p>
                                        </div>

                                        <div className="ground-rating-status">
                                            <div className="ground-rating">
                                                <h4>Rating</h4>
                                                <Review rating={userData.rating} />

                                            </div>

                                            <div className="ground-status">
                                                <h4>Status</h4>
                                                <p>{userData.status}</p>
                                            </div>
                                        </div>

                                        <div className="ground-review">
                                            <div className="ground-rating">
                                                <h4>Reviews</h4>
                                                <p>{userData.review}</p>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>

    )
}

export default Grounddetails