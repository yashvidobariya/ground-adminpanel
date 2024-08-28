import React, { useEffect, useState } from 'react';
import '../style/Index.css';
import { ScatterChart, Scatter, LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { GlobalApi } from '../service/GlobalApi';
import { Adminshowuseractivity, Averagebookingvalue, Bookingvalue, Dailyusergrowth, Monthlyusergrowth, Revenuegrowth, ShowUsersAPI, Totalbooking, Totalrevenue, Usergrowth, Weeklyusergrowth, Yearlyusergrowth } from '../service/APIrouter';
import Sidebar from '../Component/Sidebar';
import loadingdata from '../Data/Playturf.json';
import Lottie from 'lottie-react';
import { format, startOfWeek } from 'date-fns';

const Dashboard = () => {
    const [dashboaddata, setdashboaddata] = useState(null);
    const [activeuser, setactiveuser] = useState(null);
    const [bookingvalue, setbookingvalue] = useState(null);
    const [totalbooking, settotalbooking] = useState(null);
    const [totalrevenue, settotalrevenue] = useState(null);
    const [averagebookingvalue, setaveragebookingvalue] = useState(null);
    const [revenuegrowth, setrevenuegrowth] = useState([]);
    const [loading, setloading] = useState(true);
    const [errormessage, seterrormessage] = useState("");
    const [interval, setInterval] = useState('day');
    const [usergrowth, setusergrowth] = useState([]);
    const [dayusergrowth, setdayusergrowth] = useState([]);
    const [weekusergrowth, setweekusergrowth] = useState([]);
    const [monthusergrowth, setmonthusergrowth] = useState([]);
    const [yearusergrowth, setyearusergrowth] = useState([]);
    const [selectedInterval, setSelectedInterval] = useState('day');
    const [start_date, setStartdate] = useState('');
    const [end_date, setEnddate] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const [
                    showUsersResponse,
                    revenueGrowthResponse,
                    adminShowUserActivityResponse,
                    bookingValueResponse,
                    totalBookingResponse,
                    totalRevenueResponse,
                    averageBookingValueResponse
                ] = await Promise.all([
                    GlobalApi(ShowUsersAPI, 'POST', null, token),
                    GlobalApi(Revenuegrowth, 'POST', null, token),
                    GlobalApi(Adminshowuseractivity, 'POST', null, token),
                    GlobalApi(Bookingvalue, 'POST', null, token),
                    GlobalApi(Totalbooking, 'POST', null, token),
                    GlobalApi(Totalrevenue, 'POST', null, token),
                    GlobalApi(Averagebookingvalue, 'POST', null, token)
                ]);

                if (showUsersResponse.status === 201) {
                    setdashboaddata(showUsersResponse.data);
                } else {
                    console.log("showusererorr");
                }
                if (revenueGrowthResponse.status === 200) {
                    setrevenuegrowth(revenueGrowthResponse.data?.dailyGrowth || []);
                } else {
                    console.log("revenueGrowthResponse");
                }
                if (adminShowUserActivityResponse.status === 200) {
                    setactiveuser(adminShowUserActivityResponse.data?.U_Active);
                } else {
                    console.log("adminShowUserActivityResponse");
                }
                if (bookingValueResponse.status === 200) {
                    setbookingvalue(bookingValueResponse.data?.BookingValue || []);
                } else {
                    console.log("bookingValueResponse");
                }
                if (totalBookingResponse.status === 200) {
                    settotalbooking(totalBookingResponse.data?.booking);
                } else {
                    console.log("totalBookingResponse");
                }
                if (totalRevenueResponse.status === 200) {
                    settotalrevenue(totalRevenueResponse.data?.totalRevenue);
                } else {
                    console.log("showusererorr");
                }
                if (averageBookingValueResponse.status === 200) {
                    setaveragebookingvalue(averageBookingValueResponse.data?.averageBookingValue || []);
                } else {
                    console.log("averageBookingValueResponse");
                }

            } catch (error) {
                console.error('Error fetching data:', error);
                seterrormessage("An error occurred while fetching data.");
            } finally {
                setloading(false);
            }
        };

        fetchData();
    }, []);



    const fetchUserGrowth = async (apiEndpoint, setterFunction, start_date = '', end_date = '') => {
        try {
            const token = localStorage.getItem("token");

            const requestData = start_date && end_date
                ? { startdate: start_date, enddate: end_date }
                : null;

            const response = await GlobalApi(apiEndpoint, 'POST', requestData, token);

            if (response.status === 200) {
                const responseData = response.data?.userGrowth;

                if (start_date && end_date) {
                    const transformedData = [{
                        Date: `${responseData.startDate.split('T')[0]} to ${responseData.endDate.split('T')[0]}`,
                        growth: responseData.growth
                    }];
                    setterFunction(transformedData);
                    setusergrowth(transformedData);
                } else {
                    setterFunction(responseData);
                }

            } else if (response.status === 401) {
                seterrormessage("Authentication error. Please login as an Admin.");
                localStorage.removeItem('token');
                localStorage.removeItem('userdata');
            }
        } catch (error) {
            console.error('Error:', error);
            seterrormessage("An error occurred while fetching data.");
        } finally {
            setloading(false);
        }
    };

    const handleIntervalClick = (interval) => {
        setStartdate('');
        setEnddate('');
        setSelectedInterval(interval);

        switch (interval) {
            case 'day':
                fetchUserGrowth(Dailyusergrowth, setdayusergrowth);
                break;
            case 'week':
                fetchUserGrowth(Weeklyusergrowth, setweekusergrowth);
                break;
            case 'month':
                fetchUserGrowth(Monthlyusergrowth, setmonthusergrowth);
                break;
            case 'year':
                fetchUserGrowth(Yearlyusergrowth, setyearusergrowth);
                break;
            default:
                fetchUserGrowth(Dailyusergrowth, setdayusergrowth);
        }
    };

    useEffect(() => {
        if (start_date && end_date) {
            fetchUserGrowth(Usergrowth, setusergrowth, start_date, end_date);
        }
    }, [start_date, end_date]);

    useEffect(() => {
        handleIntervalClick('day');
    }, []);

    const resetDateSelection = () => {
        setStartdate('');
        setEnddate('');
    };


    useEffect(() => {
        handleIntervalClick('week');
        handleIntervalClick('month');
        handleIntervalClick('year');
        handleIntervalClick('day');
    }, []);


    if (errormessage) {
        return (
            <div className="error-message">
                {errormessage}
            </div>
        );
    }

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
    ;

    if (errormessage) {
        return <div className='autherror'><h1>{errormessage}</h1></div>;
    }

    const getStartOfWeek = (date) => {
        return startOfWeek(date, { weekStartsOn: 1 });
    };

    const handleIntervalChange = (interval) => {
        setInterval(interval);
    };

    const handleStartDateChange = (e) => {
        setStartdate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEnddate(e.target.value);
    };

    const getCurrentData = () => {
        if (start_date && end_date) {
            return usergrowth;
        } else {
            switch (selectedInterval) {
                case 'day':
                    return dayusergrowth;
                case 'week':
                    return weekusergrowth;
                case 'month':
                    return monthusergrowth;
                case 'year':
                    return yearusergrowth;
                default:
                    return dayusergrowth;
            }
        }
    };


    const lineChartData = dashboaddata && Array.isArray(dashboaddata.users) ? processUserData(dashboaddata.users, interval) : {};
    const lineChartData2 = Revenuegrowth && Array.isArray(revenuegrowth) ? processUserData(revenuegrowth, interval) : {};
    const barChartData = activeuser && Array.isArray(activeuser) ? processUserData(activeuser, interval) : {};
    const bookingvaluechart = bookingvalue && Array.isArray(bookingvalue) ? processUserData(bookingvalue, interval) : {};
    const TinyAreaChart = totalbooking && Array.isArray(totalbooking) ? processUserData(totalbooking, interval) : {};
    const lineChartData1 = totalrevenue && Array.isArray(totalrevenue) ? processUserData(totalrevenue, interval) : {};
    const ScatterChartData1 = averagebookingvalue && Array.isArray(averagebookingvalue) ? processUserData(averagebookingvalue, interval) : {};

    return (
        <div>
            <Sidebar />
            <div className="main-home">
                {loading ? (
                    <div className="loader">
                        <div className="loading-icon">
                            <Lottie animationData={loadingdata} />
                        </div>
                    </div>
                ) : (
                    <div className='main-home'>
                        <div className="home-container">
                            <div className="home-total-data">
                                <div className="home-total-left">
                                    <div className="home-total-user">
                                        <p>Total Users</p>
                                        <div className="home-total-user-number">
                                            <p>{dashboaddata?.users?.length ?? 0}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="home-total-right">
                                    <div className="home-title-right-content">
                                        <div className="home-right-total-ground">
                                            <p>Total Active User</p>
                                            <div className="home-right-total-ground-number">
                                                <p>{activeuser?.length ?? 0}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="home-title-right-content">
                                        <div className="home-right-total-ground">
                                            <p>Total Booking</p>
                                            <div className="home-right-total-ground-number">
                                                <p>{totalbooking?.length ?? 0}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="home-title-right-content">
                                        <div className="home-right-total-ground">
                                            <p>Total Revenue</p>
                                            <div className="home-right-total-ground-number">
                                                <p>{totalrevenue?.length ?? 0}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="home-title-right-content">
                                        <div className="home-right-total-ground">
                                            <p>Averange booking value </p>
                                            <div className="home-right-total-ground-number">
                                                <p>{averagebookingvalue?.length ?? 0}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="home-chart-controls">
                            <div className="home-chart-button">
                                <button onClick={() => handleIntervalChange('day')} className={interval === 'day' ? 'active' : ''}>Day</button>
                                <button onClick={() => handleIntervalChange('week')} className={interval === 'week' ? 'active' : ''}>Week</button>
                                <button onClick={() => handleIntervalChange('month')} className={interval === 'month' ? 'active' : ''}>Month</button>
                                <button onClick={() => handleIntervalChange('year')} className={interval === 'year' ? 'active' : ''}>Year</button>
                            </div>
                        </div>
                        <div className="home-chart">
                            <div className="home-user">
                                <ResponsiveContainer width="100%" height={350}>
                                    <LineChart data={Object.keys(lineChartData).map(key => ({ interval: key, TotalUser: lineChartData[key] }))}>
                                        <CartesianGrid strokeDasharray="2 2" />
                                        <XAxis dataKey="interval" padding={{ left: 0, right: 0 }} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="TotalUser" stroke="#BDE038" fill='#F26835' />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="home-chart">
                            <div className="home-chart-user">
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={Object.keys(barChartData).map(key => ({ interval: key, ActiveUsers: barChartData[key] }))}>
                                        <CartesianGrid strokeDasharray="2 2" />
                                        <XAxis dataKey="interval" padding={{ left: 0, right: 0 }} />
                                        <YAxis tick={{ fontSize: 16 }} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="ActiveUsers" fill="#F26835" radius={[10, 10, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="home-chart-pie">
                                <ResponsiveContainer width="100%" height={350}>
                                    <LineChart data={Object.keys(bookingvaluechart).map(key => ({ interval: key, BookingVolume: bookingvaluechart[key] }))}>
                                        <CartesianGrid strokeDasharray="2 2" />
                                        <XAxis dataKey="interval" padding={{ left: 0, right: 0 }} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="BookingVolume" stroke="#BDE038" fill='#F26835' />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="home-chart">
                            <div className="home-chart-user">
                                <ResponsiveContainer width="100%" height={350}>
                                    <AreaChart data={Object.keys(TinyAreaChart).map(key => ({ interval: key, tootalbooking: TinyAreaChart[key] }))}>
                                        <CartesianGrid strokeDasharray="2 2" />
                                        <XAxis dataKey="interval" padding={{ left: 0, right: 0 }} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Area type="monotone" dataKey="tootalbooking" stroke="#F26835" fill='#BDE038' />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="home-chart-pie">
                                <ResponsiveContainer width="100%" height={350}>
                                    <LineChart data={Object.keys(lineChartData1).map(key => ({ interval: key, totalrevenue: lineChartData1[key] }))}>
                                        <CartesianGrid strokeDasharray="2 2" />
                                        <XAxis dataKey="interval" padding={{ left: 0, right: 0 }} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="totalrevenue" stroke="#BDE038" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="home-chart">
                            <div className="home-chart-user">
                                <ResponsiveContainer width="100%" height={350}>
                                    <ScatterChart>
                                        <CartesianGrid strokeDasharray="2 2" />
                                        <XAxis type="category" dataKey="interval" name="Date" padding={{ left: 0, right: 0 }} />
                                        <YAxis type="number" dataKey="AverageBookingvalue" name="AverageBookingvalue" />
                                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                        <Legend />
                                        <Scatter name="AverageBookingvalue" data={Object.keys(ScatterChartData1).map(key => ({ interval: key, AverageBookingvalue: ScatterChartData1[key] }))} fill="#F26835" />
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="home-chart-pie">
                                <ResponsiveContainer width="100%" height={350}>
                                    <LineChart data={Object.keys(lineChartData2).map(key => ({ interval: key, Revenuegrowth: lineChartData2[key] }))}>
                                        <CartesianGrid strokeDasharray="2 2" />
                                        <XAxis dataKey="interval" padding={{ left: 0, right: 0 }} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="Revenuegrowth" stroke="#BDE038" fill='#F26835' />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="home-chart">
                            <div className="home-user">
                                <input type='date' value={start_date} onChange={handleStartDateChange} className='startdate' />
                                <input type='date' value={end_date} onChange={handleEndDateChange} className='enddate' />

                                <button onClick={() => handleIntervalClick('day')} className={selectedInterval === 'day' ? 'active' : ''}>Day</button>
                                <button onClick={() => handleIntervalClick('week')} className={selectedInterval === 'week' ? 'active' : ''}>Week</button>
                                <button onClick={() => handleIntervalClick('month')} className={selectedInterval === 'month' ? 'active' : ''}>Month</button>
                                <button onClick={() => handleIntervalClick('year')} className={selectedInterval === 'year' ? 'active' : ''}>Year</button>

                                <ResponsiveContainer width="100%" height={350}>
                                    <LineChart data={getCurrentData()}>
                                        <CartesianGrid strokeDasharray="2 2" />
                                        <XAxis dataKey="Date" padding={{ left: 0, right: 0 }} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="growth" stroke="#BDE038" fill='#F26835' />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )
                }
            </div >
        </div >
    );

};

export default Dashboard;