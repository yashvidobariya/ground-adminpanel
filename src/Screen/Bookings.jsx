import React, { useEffect, useState } from 'react'
import Sidebar from '../Component/Sidebar'
import { Averagebookingvalue, Bookingvalue, ShowOwnersAPI, Totalbooking } from '../service/APIrouter';
import { GlobalApi } from '../service/GlobalApi';
import SubHeader from '../Component/SubHeader';
import useFilterData from '../Authentication/Usefilterdata';
import Lottie from 'lottie-react';
import Pagination from '../Dialogbox/Pagination';
import Singlebooking from '../Single/Singlebooking';
import loadingdata from '../Data/Playturf.json'
import { format, startOfWeek } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Select from 'react-select';
import { all } from 'axios';


const Bookings = () => {
    const [totalbooking, settotalbooking] = useState([]);
    const [totalavebooking, settotalavebooking] = useState([]);
    const [bookingvolume, setbookingvolume] = useState([]);
    const [errormessage, seterrormessage] = useState("");
    const [loading, setloading] = useState(true);
    const [currentpage, setcurrentpage] = useState(1);
    const [postperpage] = useState(7);
    const { filteredData, searchValue, setSearchValue, selectedDate, setSelectedDate } = useFilterData(totalbooking);
    const [owerid, setownerid] = useState("");
    const [interval, setInterval] = useState('day');
    const [filterbooking, setfilterbooking] = useState('all');
    const [selectedOption, setSelectedOption] = useState(null);
    const [Filternumberdata, settfilternumberdata] = useState([]);
    const contacts = [
        { value: '7861003128', label: '7861003128' },
        { value: '+917984066311', label: '+917984066311' },
        { value: '+917861003128', label: '+917861003128' }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await GlobalApi(Totalbooking, 'POST', null, token);

                if (response.status === 200) {
                    settotalbooking(response.data.booking);
                    console.log("totalbooking", response.data.booking);
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
                const response = await GlobalApi(Averagebookingvalue, 'POST', null, token);

                if (response.status === 200) {
                    settotalavebooking(response.data.averageBookingValue);
                    console.log("bookingtreds", response.data.averageBookingValue);
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
                const response = await GlobalApi(Bookingvalue, 'POST', null, token);

                if (response.status === 200) {
                    setbookingvolume(response.data.BookingValue);
                    console.log("bookingvolume", response.data.BookingValue);
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

    const handleChange = async (selectedOption) => {
        setSelectedOption(selectedOption);
        try {
            const token = localStorage.getItem("token");
            const response = await GlobalApi(ShowOwnersAPI, 'POST', null, token);

            if (response.status === 201) {
                const owners = response.data.owners;
                setbookingvolume(owners);
                console.log("ShowOwnersAPI", owners);

                if (owners) {
                    const selectedOwner = owners.find(owner => owner.mobile === selectedOption.value);
                    if (selectedOwner) {
                        const selectedOwnerId = selectedOwner._id;
                        setownerid(selectedOwnerId);
                        console.log("selectedOwnerId", selectedOwnerId);
                        console.log("selectedOwner", selectedOwner);

                        if (Array.isArray(totalbooking)) {
                            const filteredNumber = totalbooking.filter(number =>
                                number.ownerid === selectedOwnerId
                            );
                            console.log("filteredNumber", filteredNumber);
                            settfilternumberdata(filteredNumber);

                            if (filteredNumber.length === 0) {
                                seterrormessage("No records found for the selected owner.");
                            } else {
                                seterrormessage("");
                            }
                        } else {
                            console.warn("totalBooking is not an array or is undefined");
                        }
                    } else {
                        console.warn("Selected owner not found in owners");
                    }
                } else if (response.status === 401) {
                    seterrormessage("Authentication error. Please login as an Admin.");
                    localStorage.removeItem('token');
                    localStorage.removeItem('userdata');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            seterrormessage("An error occurred while fetching data.");
        } finally {
            setloading(false);
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

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

    const handlefilterbooking = (status) => {
        setfilterbooking(status)
    }

    const combinefilterdata = [
        ...(
            Filternumberdata.length > 0
                ? Filternumberdata
                : filteredData.filter(booking => {
                    if (filterbooking === 'all') return true;
                    return booking.status === filterbooking;
                })
        )
    ];

    const handlereset = () => {
        setSelectedOption(null);
        setownerid("");
        settfilternumberdata([]);
    };


    const lastpostindex = currentpage * postperpage;
    const firstpostindex = lastpostindex - postperpage;
    const currentpost = Array.isArray(combinefilterdata) ? combinefilterdata.slice(firstpostindex, lastpostindex) : [];

    console.log('Current Post Data:', currentpost);
    const lineChartData = totalbooking && Array.isArray(totalbooking) ? processUserData(totalbooking, interval) : {};
    const barchartavebooking = totalavebooking && Array.isArray(totalavebooking) ? processUserData(totalavebooking, interval) : {};
    const linechartvolume = bookingvolume && Array.isArray(bookingvolume) ? processUserData(bookingvolume, interval) : {};

    return (
        <div>
            <Sidebar />
            <SubHeader
                searchValue={searchValue}
                onSearchChange={(e) => setSearchValue(e.target.value)}
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
            />
            <div className="bookingpage-button-control">
                <div className='customer-ticket-button'>
                    <button onClick={() => handlefilterbooking('all')} className={filterbooking === 'all' ? 'active' : ''}>All</button>
                    <button onClick={() => handlefilterbooking('Accepted')} className={filterbooking === 'Accepted' ? 'active' : ''}>Accepted</button>
                    <button onClick={() => handlefilterbooking('Pending')} className={filterbooking === 'Pending' ? 'active' : ''}>Pending</button>
                    <button onClick={() => handlefilterbooking('Rejected')} className={filterbooking === 'Rejected' ? 'active' : ''}>Rejected</button>

                    <div className="mobile-filter">
                        <Select
                            id="mobile"
                            name="mobile"
                            value={selectedOption}
                            onChange={handleChange}
                            options={contacts}
                            placeholder="Select a Contact"
                        ></Select>
                        <button className='reset-mobilefilter' onClick={handlereset}>Reset</button>
                    </div>
                </div>
            </div>


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
                                    <th scope="col">user Name</th>
                                    <th scope="col">Ground Name</th>
                                    <th scope="col">Details </th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Start time</th>
                                    <th scope="col">end time</th>
                                </tr>
                            </thead>
                            <tbody>

                                {currentpost && currentpost.length > 0 ? (
                                    currentpost.map((booking) => (
                                        <Singlebooking key={booking._id} booking={booking} />
                                    ))) : (
                                    <div className="nodatafound">
                                        <p>no data found</p>
                                    </div>
                                )
                                }
                            </tbody>
                        </table>
                    </div>

                    {filteredData.length > 0 && (
                        <Pagination totalpost={filteredData.length}
                            postperpage={postperpage} currentpage={currentpage} setcurrentpage={setcurrentpage} />
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
                                <LineChart data={Object.keys(lineChartData).map(key => ({ interval: key, TotalBooking: lineChartData[key] }))}>
                                    <CartesianGrid strokeDasharray="2 2" />
                                    <XAxis dataKey="interval" padding={{ left: 0, right: 0 }} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line dataKey="TotalBooking" stroke="#BDE038" fill='#F26835' />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="user-chart-content">
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={Object.keys(barchartavebooking).map(key => ({ interval: key, averagebooking: barchartavebooking[key] }))}>
                                    <CartesianGrid strokeDasharray="2 2" />
                                    <XAxis dataKey="interval" padding={{ left: 0, right: 0 }} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="averagebooking" stroke="#F26835" fill='#F26835' radius={[10, 10, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="user-chart-section">
                        <div className="user-chart-content">
                            <ResponsiveContainer width="100%" height={350}>
                                <LineChart data={Object.keys(linechartvolume).map(key => ({ interval: key, bookingtrends: linechartvolume[key] }))}>
                                    <CartesianGrid strokeDasharray="2 2" />
                                    <XAxis dataKey="interval" padding={{ left: 0, right: 0 }} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line dataKey="bookingtrends" stroke="#BDE038" fill='#F26835' />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </>
            )}
        </div>
    )
}

export default Bookings
