import React, { useEffect, useState, useMemo } from 'react';
import { GlobalApi } from '../service/GlobalApi';
import { Adminshowuseractivity, Allchurnrate, Churnrate, ShowUsersAPI } from '../service/APIrouter';
import Singleuser from '../Single/Singleuser';
import Sidebar from '../Component/Sidebar';
import SubHeader from '../Component/SubHeader';
import loadingdata from '../Data/Playturf.json';
import Lottie from 'lottie-react';
import useFilterData from '../Authentication/Usefilterdata';
import Pagination from '../Dialogbox/Pagination';
import { format, startOfWeek } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Users = () => {
    const [userdata, setuserdata] = useState([]);
    const [loading, setloading] = useState(true);
    const [churnrate, setchurnrate] = useState([]);
    const [allchurnrate, setallchurnrate] = useState([]);
    const [errormessage, seterrormessage] = useState("");
    const [currentpage, setcurrentpage] = useState(1);
    const [postperpage] = useState(7);
    const [dashboaddata, setdashboaddata] = useState(null);
    const [interval, setInterval] = useState('day');
    const [startdate, setStartdate] = useState('');
    const [enddate, setEnddate] = useState('');

    const { filteredData, searchValue, setSearchValue, selectedDate, setSelectedDate } = useFilterData(userdata);

    const lastpostindex = useMemo(() => currentpage * postperpage, [currentpage, postperpage]);
    const firstpostindex = useMemo(() => lastpostindex - postperpage, [lastpostindex, postperpage]);
    const currentpost = useMemo(() => {
        return Array.isArray(filteredData) ? filteredData.slice(firstpostindex, lastpostindex) : [];
    }, [filteredData, firstpostindex, lastpostindex]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleStartDateChange = (e) => {
        setStartdate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEnddate(e.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await GlobalApi(ShowUsersAPI, 'POST', null, token);

                if (response.status === 201) {
                    setuserdata(response.data.users);
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
        fetchData();
    }, []);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await GlobalApi(Adminshowuseractivity, 'POST', null, token);

                if (response.status === 200) {
                    setdashboaddata(response.data.U_Active);
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
        fetchData();
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await GlobalApi(Allchurnrate, 'POST', null, token);

                if (response.status === 200) {
                    setallchurnrate(response.data.allChurnRate);
                    console.log("allchurnrate", response.data.allChurnRate);
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
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await GlobalApi(Churnrate, 'POST', {
                    periodStart: startdate,
                    periodEnd: enddate
                }, token);

                if (response.status === 200) {
                    setchurnrate([{ interval: 'ChurnRate', churnrate: parseFloat(response.data.churnRate) }]);
                    console.log("churnrate", response.data.churnRate);
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

        if (startdate && enddate) {
            fetchData();
        } else {
            setchurnrate(allchurnrate.map(item => ({
                interval: format(new Date(item.date), 'dd MMM yyyy'),
                churnrate: item.churnRate
            })));
        }
    }, [startdate, enddate, allchurnrate]);


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
            const periodStart = new Date(item.periodStart || date);
            const periodEnd = new Date(item.periodEnd || date);

            const dayKey = format(date, 'dd MMM yyyy');
            const weekKey = format(getStartOfWeek(date), 'dd MMM yyyy');
            const monthKey = format(date, 'MMM yyyy');
            const yearKey = format(date, 'yyyy');

            const activeCount = item.active || 1;

            intervals.day[dayKey] = (intervals.day[dayKey] || 0) + activeCount;
            intervals.week[weekKey] = (intervals.week[weekKey] || 0) + activeCount;
            intervals.month[monthKey] = (intervals.month[monthKey] || 0) + activeCount;
            intervals.year[yearKey] = (intervals.year[yearKey] || 0) + activeCount;
        });

        return intervals[key];
    };

    const getStartOfWeek = (date) => {
        return startOfWeek(date, { weekStartsOn: 1 });
    };

    const handleIntervalChange = (interval) => {
        setInterval(interval);
    };

    const lineChartData = dashboaddata && Array.isArray(dashboaddata) ? processUserData(dashboaddata, interval) : {};
    const lineuserdata = userdata && Array.isArray(userdata) ? processUserData(userdata, interval) : {};

    const handleresetdate = () => {
        setStartdate("");
        setEnddate("");
    }
    return (
        <>
            <Sidebar />
            <SubHeader
                searchValue={searchValue}
                onSearchChange={(e) => setSearchValue(e.target.value)}
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
            />

            <div className="main-user">
                {loading ? (
                    <div className="loader">
                        <div className="loading-icon">
                            <Lottie animationData={loadingdata} />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="table-container">
                            <table className='user-data'>
                                <thead>
                                    <tr>
                                        <th scope="col">User Name</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Phone No.</th>
                                        <th>last time loggedout</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">User Since</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentpost && currentpost.length > 0 ? (
                                        currentpost.map((user) => (
                                            <Singleuser key={user._id} user={user} />
                                        ))
                                    ) : (

                                        <div className="nodatafound">
                                            <p>No data found</p>
                                        </div>
                                    )
                                    }
                                </tbody>
                            </table>
                        </div>

                        {filteredData.length > 0 && (
                            <Pagination totalpost={filteredData.length} postperpage={postperpage} currentpage={currentpage} setcurrentpage={setcurrentpage} />
                        )}

                        <div className="user-chart-button">
                            <button onClick={() => handleIntervalChange('day')} className={interval === 'day' ? 'active' : ''}>Day</button>
                            <button onClick={() => handleIntervalChange('week')} className={interval === 'week' ? 'active' : ''}>Week</button>
                            <button onClick={() => handleIntervalChange('month')} className={interval === 'month' ? 'active' : ''}>Month</button>
                            <button onClick={() => handleIntervalChange('year')} className={interval === 'year' ? 'active' : ''}>Year</button>
                        </div>

                        <div className="user-chart-section">
                            <div className="user-chart-content">
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={Object.keys(lineChartData).map(key => ({ interval: key, ActiveUsers: lineChartData[key] }))}>
                                        <CartesianGrid strokeDasharray="2 2" />
                                        <XAxis dataKey="interval" padding={{ left: 0, right: 0 }} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="ActiveUsers" fill='#F26835' radius={[10, 10, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="user-chart-content">
                                <ResponsiveContainer width="100%" height={350}>
                                    <LineChart data={Object.keys(lineuserdata).map(key => ({ interval: key, Signupuser: lineuserdata[key] }))}>
                                        <CartesianGrid strokeDasharray="2 2" />
                                        <XAxis dataKey="interval" padding={{ left: 0, right: 0 }} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line dataKey="Signupuser" stroke="#BDE038" fill='#F26835' />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="user-chart-section">
                            <div className="user-chart-content">
                                <input type='date' value={startdate} onChange={handleStartDateChange} className='startdate' />
                                <input type='date' value={enddate} onChange={handleEndDateChange} className='enddate' />
                                <button className='resetchurnrate' onClick={handleresetdate}>Reset</button>
                                <ResponsiveContainer width="100%" height={350}>
                                    <LineChart data={churnrate}>
                                        <CartesianGrid strokeDasharray="2 2" />
                                        <XAxis dataKey="interval" padding={{ left: 0, right: 0 }} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line dataKey="churnrate" stroke="#BDE038" fill='#F26835' />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="user-chart-content">
                                {/* User Demographics (Pie Chart) */}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Users;
