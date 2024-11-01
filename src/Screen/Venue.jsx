
import React, { useEffect, useState } from 'react'
import Sidebar from '../Component/Sidebar'
import loadingdata from '../Data/Playturf.json'
import { GlobalApi } from '../service/GlobalApi';
import { Adminreviewandrating, Totalground, Underperforming } from '../service/APIrouter';
import Singlegroundlist from '../Single/Singlegroundlist';
import Lottie from 'lottie-react';
import { IoIosAdd } from "react-icons/io";
import { useNavigate } from 'react-router';
import { startOfWeek } from 'date-fns';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Pagination from '../Dialogbox/Pagination';
import Review from '../Review';
import SubHeader from '../Component/SubHeader';
import useFilterData from '../Authentication/Usefilterdata';

const Venue = () => {

    const [totalground, settotalground] = useState([]);
    const [adminreviewandrating, setadminreviewandrating] = useState([]);
    const [topperforming, settopperforming] = useState([]);
    const [underperforming, setunderperforming] = useState([]);
    const [errormessage, seterrormessage] = useState("");
    const [loading, setloading] = useState(true);
    const navigate = useNavigate();
    const [itemsPerPage] = useState(5);
    const [currentPage, setcurrentpage] = useState(1);
    const { filteredData, searchValue, setSearchValue, selectedDate, setSelectedDate } = useFilterData(totalground);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');

                const adminReviewResponse = await GlobalApi(Adminreviewandrating, 'POST', null, token);
                if (adminReviewResponse.status === 401) {
                    seterrormessage('Authentication error, please login again.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('userdata');
                    return;
                } else if (Array.isArray(adminReviewResponse.data.reviews)) {
                    setadminreviewandrating(adminReviewResponse.data.reviews);
                } else {
                    console.error('Failed to fetch admin reviews', adminReviewResponse.data);
                    return;
                }

                const underperformingResponse = await GlobalApi(Underperforming, 'POST', null, token);
                if (underperformingResponse.status === 401) {
                    seterrormessage('Authentication error, please login again.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('userdata');
                    return;
                } else if (Array.isArray(underperformingResponse.data.underperformingGrounds)) {
                    setunderperforming(underperformingResponse.data.underperformingGrounds);
                } else {
                    console.error('Failed to fetch underperforming grounds', underperformingResponse.data);
                    return;
                }

                const totalGroundResponse = await GlobalApi(Totalground, 'POST', null, token);
                if (totalGroundResponse.status === 401) {
                    seterrormessage('Authentication error, please login again.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('userdata');
                } else if (Array.isArray(totalGroundResponse.data.ground)) {
                    settotalground(totalGroundResponse.data.ground);
                } else {
                    console.error('Failed to fetch total ground data', totalGroundResponse.data);
                }

            } catch (error) {
                console.error('Error:', error);
            } finally {
                setloading(false);
            }
        };

        fetchData();
    }, []);


    const handleadd = (() => {
        navigate('/venue/addground');
    })

    if (errormessage) {
        return <div className='autherror'><h1>{errormessage}</h1></div>;
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentReviews = adminreviewandrating.slice(indexOfFirstItem, indexOfLastItem);


    const countGround = (data) => {
        const counts = {};
        data.forEach(item => {
            counts[item.groundname] = (counts[item.groundname] || 0) + 1;
        });
        return Object.keys(counts).map(key => ({ groundname: key, underperforming: counts[key] }));
    };
    const groundCounts = countGround(underperforming);


    return (
        <>
            <Sidebar />
            <SubHeader
                searchValue={searchValue}
                onSearchChange={(e) => setSearchValue(e.target.value)}
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
            />
            <div className="allground-div">
                {loading ? (
                    <div className="loader">
                        <div className="loading-icon">
                            <Lottie animationData={loadingdata} />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="ground-main">

                            <div className="groundlist-main">
                                <div className="groundlist-title">
                                    <h1>Ground List</h1>
                                </div>
                                <div className="groundlist-add">
                                    <IoIosAdd onClick={handleadd} />
                                </div>
                            </div>
                        </div>


                        <div className="allground-main">
                            {
                                filteredData.length > 0 ? (
                                    filteredData.map((ground) => (
                                        <Singlegroundlist key={ground._id} ground={ground} />
                                    ))
                                ) : (
                                    <div className="ground">
                                        <div className="no-booking">
                                            No grounds found.
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </>
                )}
            </div>
            <div className="user-chart-section">
                <div className="user-chart-content">
                    <p>Review And Rating</p>
                    {
                        currentReviews.length > 0 ? (
                            currentReviews.map((review, index) => (
                                <div key={index} className="review-rating-item">
                                    <p>{review.groundid?.groundname || 'Ground-name'}</p>
                                    <p><Review rating={review.rate} /></p>
                                </div>
                            ))
                        ) : (
                            <p>No reviews available.</p>
                        )
                    }

                    <Pagination
                        totalpost={adminreviewandrating.length}
                        postperpage={itemsPerPage}
                        currentpage={currentPage}
                        setcurrentpage={setcurrentpage}
                    />
                </div>

                <div className="user-chart-content">
                    <p>Review Trends (Line Chart) not yet</p>
                </div>
            </div>


            <div className="user-chart-section">
                {/* 
                <div className="user-chart-content">
                    {topPerformingMessage ? (
                        <div className='topperforming-message'>{topPerformingMessage}</div>
                    ) : (
                        <div className="user-chart-content">
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={topgroundcount}>
                                    <CartesianGrid strokeDasharray="2 2" />
                                    <XAxis dataKey="groundname" padding={{ left: 0, right: 0 }} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="topperforming" stroke="#F26835" fill='#F26835' />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div> */}


                <div className="user-chart-content">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={groundCounts}>
                            <CartesianGrid strokeDasharray="2 2" />
                            <XAxis dataKey="groundname" fill='#BDE038' padding={{ left: 0, right: 0 }} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="underperforming" stroke="#F26835" fill='#F26835' radius={[10, 10, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    )
}

export default Venue
