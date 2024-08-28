
import React, { useEffect, useState } from 'react'
import Sidebar from '../Component/Sidebar'
import loadingdata from '../Data/Playturf.json'
import { GlobalApi } from '../service/GlobalApi';
import { Adminreviewandrating, Topperforming, Totalground, Underperforming } from '../service/APIrouter';
import Singlegroundlist from '../Single/Singlegroundlist';
import Lottie from 'lottie-react';
import { IoIosAdd } from "react-icons/io";
import { useNavigate } from 'react-router';
import { format, startOfWeek } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
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
    const [interval, setInterval] = useState('day');
    const [itemsPerPage] = useState(5);
    const [currentPage, setcurrentpage] = useState(1);
    const [topPerformingMessage, setTopPerformingMessage] = useState("");
    const { filteredData, searchValue, setSearchValue, selectedDate, setSelectedDate } = useFilterData(totalground);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    useEffect(() => {
        const fetchdata = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await GlobalApi(Totalground, 'POST', null, token);

                if (response.status == 401) {
                    seterrormessage('Authentication error, please login again.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('userdata');
                } else if (Array.isArray(response.data.ground)) {
                    settotalground(response.data.ground);
                } else {
                    console.error('user data not fetch', response.data);
                }
            } catch (error) {
                console.error('error', error);
            } finally {
                setloading(false);
            }
        };
        fetchdata();
    }, []);
    console.log("totalground", totalground)


    useEffect(() => {
        const fetchdata = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await GlobalApi(Adminreviewandrating, 'POST', null, token);

                if (response.status == 401) {
                    seterrormessage('Authentication error, please login again.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('userdata');
                } else if (Array.isArray(response.data.reviews)) {
                    setadminreviewandrating(response.data.reviews);
                } else {
                    console.error('user data not fetch', response.data);
                }
            } catch (error) {
                console.error('error', error);
            } finally {
                setloading(false);
            }
        };
        fetchdata();
    }, [])
    console.log("Adminreviewandrating", totalground)


    useEffect(() => {
        const fetchdata = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await GlobalApi(Underperforming, 'POST', null, token);

                if (response.status == 401) {
                    seterrormessage('Authentication error, please login again.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('userdata');
                } else if (Array.isArray(response.data.underperformingGrounds)) {
                    setunderperforming(response.data.underperformingGrounds);
                } else {
                    console.error('user data not fetch', response.data);
                }
            } catch (error) {
                console.error('error', error);
            } finally {
                setloading(false);
            }
        };
        fetchdata();
    }, [])
    console.log("Underperforming", underperforming);

    useEffect(() => {
        const fetchdata = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await GlobalApi(Topperforming, 'POST', null, token);

                if (response.status == 401) {
                    seterrormessage('Authentication error, please login again.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('userdata');
                } else if (response.data.message === "No one ground in topperforming.") {
                    setTopPerformingMessage(response.data.message);
                } else if (Array.isArray(response.data)) {
                    settopperforming(response.data);
                } else {
                    console.error('User data not fetched', response.data);
                }
            } catch (error) {
                console.error('Error', error);
            } finally {
                setloading(false);
            }
        };
        fetchdata();
    }, []);
    console.log("topperforming", topperforming);


    const handleadd = (() => {
        navigate('/venue/addground');
    })


    const processUserData = (data, key) => {
        if (!Array.isArray(data)) {
            console.error("Data is not an array:", data);
            return {};
        }

        const intervals = {
            day: {},
            week: {},
            month: {},
            year: {}
        };

        data.forEach((item) => {
            const date = new Date(item.createdat || item.date);
            const dayKey = format(date, 'dd MMM yyyy');
            const weekKey = format(getStartOfWeek(date), 'dd MMM yyyy');
            const monthKey = format(date, 'MMM yyyy');
            const yearKey = format(date, 'yyyy');

            intervals.day[dayKey] = (intervals.day[dayKey] || 0) + (item.active || 1);
            intervals.week[weekKey] = (intervals.week[weekKey] || 0) + (item.active || 1);
            intervals.month[monthKey] = (intervals.month[monthKey] || 0) + (item.active || 1);
            intervals.year[yearKey] = (intervals.year[yearKey] || 0) + (item.active || 1);
        });
        return intervals[key];
    };

    if (errormessage) {
        return <div className='autherror'><h1>{errormessage}</h1></div>;
    }

    const getStartOfWeek = (date) => {
        return startOfWeek(date, { weekStartsOn: 1 });
    };

    const handleIntervalChange = (interval) => {
        setInterval(interval);
    };

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


    const topcount = (data) => {
        const counts = {};
        data.forEach(item => {
            counts[item.groundname] = (counts[item.groundname] || 0) + 1;
        });
        return Object.keys(counts).map(key => ({ groundname: key, topperforming: counts[key] }));
    };

    const topgroundcount = topcount(topperforming);


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
                        <div className="groundlist-main">
                            <div className="groundlist-title">
                                <h1>Ground List</h1>
                            </div>
                            <div className="groundlist-add">
                                <IoIosAdd onClick={handleadd} />
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

            <div className="user-chart-button">
                <button onClick={() => handleIntervalChange('day')} className={interval === 'day' ? 'active' : ''}>Day</button>
                <button onClick={() => handleIntervalChange('week')} className={interval === 'week' ? 'active' : ''}>Week</button>
                <button onClick={() => handleIntervalChange('month')} className={interval === 'month' ? 'active' : ''}>Month</button>
                <button onClick={() => handleIntervalChange('year')} className={interval === 'year' ? 'active' : ''}>Year</button>
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
                </div>


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
