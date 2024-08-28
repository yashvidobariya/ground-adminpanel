import React, { useEffect, useState } from "react";
import { MdOutlineDateRange } from "react-icons/md";
import { TfiLocationPin } from "react-icons/tfi";
import { Getownedgrounds } from "../service/APIrouter";
import { useNavigate, useParams } from "react-router";
import Sidebar from "../Component/Sidebar";
import { GlobalApi } from "../service/GlobalApi";
import loadingdata from '../Data/Playturf.json'
import Lottie from 'lottie-react'
import { StarRating } from "react-star-rating-input";
import Review from "../Review";

export default function Ground() {
    const navigate = useNavigate();
    const { userId } = useParams();
    console.log(userId);
    const [userData, setUserData] = useState([]);
    const [loading, setloading] = useState(true);


    useEffect(() => {
        const fetchdata = async () => {
            try {
                const response = await GlobalApi(`${Getownedgrounds}/${userId}`, 'GET');
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




    const handlegrounddetails = async (userId) => {

        navigate(`/owners/grounddetails/${userId}`);

    };


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
                    <h1 className="ground-title"> Owner Grounds</h1>
                    <div className="main-ground">
                        {userData.length > 0 ? (

                            userData.map((ground, index) => (

                                <div className="ground-content" key={index}>
                                    <div className="ground-image">
                                        <img
                                            className="ground-img"
                                            src={ground.img || "/image/ground.jpg"}
                                            alt={ground.ownername}
                                        />
                                    </div>

                                    <div className="ground">

                                        <div className="ground-detail">
                                            <div className="ground-sub-details">

                                                <h3>{ground.groundname}</h3>
                                                <div className="ground-location">
                                                    <p><TfiLocationPin size={"15px"} />
                                                    </p>
                                                    <p> {ground.location}</p>
                                                </div>

                                                <div className="ground-date">
                                                    <p>< MdOutlineDateRange size={"15px"} /> </p>
                                                    <p> {ground.createdat?.slice(0, 10)}{" "}</p>
                                                </div>
                                            </div>



                                            <div className="ground-more">
                                                <div className="ground-det">
                                                    <h5>Price</h5>
                                                    {/* <h6>{ground.price}</h6> */}
                                                </div>

                                                <div className="ground-det">
                                                    <h5>Rating</h5>
                                                    <Review rating={ground.rating} />
                                                </div>


                                                <div className="ground-det">
                                                    <h5>Timing</h5>
                                                    {/* <h6>{ground.starttime}</h6> */}
                                                </div>
                                            </div>


                                            <div className="ground-more-details">
                                                <button onClick={() => { handlegrounddetails(ground._id) }}>More Details</button>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            ))
                        ) : (
                            <div className="ground">

                                <div className="no-booking">
                                    {/* <div className="no-ground">
                                <RiFilterOffLine />
                            </div> */}

                                    {userData.error}...
                                </div>
                            </div>

                        )}
                    </div>
                </>
            )}
        </>

    );
}
