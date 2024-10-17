import React, { useEffect, useState } from 'react'
import Sidebar from '../Component/Sidebar'
import SubHeader from '../Component/SubHeader'
import useFilterData from '../Authentication/Usefilterdata';
import { GlobalApi } from '../service/GlobalApi';
import { Admingetalltickets, Adminshowaverageresolvedtime, Adminshowaverageresponsetime } from '../service/APIrouter';
import Pagination from '../Dialogbox/Pagination';
import Lottie from 'lottie-react';
import loadingdata from '../Data/Playturf.json'
import Singlecustomer from '../Single/Singlecustomer';

const Customer = () => {

    const [totalticket, settotalticket] = useState([]);
    const [totalresolvedata, settotalresolvedata] = useState([]);
    const [totalresponsetime, settotalresponsetime] = useState("");
    const [errormessage, seterrormessage] = useState("");
    const [loading, setloading] = useState(true);
    const [currentpage, setcurrentpage] = useState(1);
    const [postperpage] = useState(7);
    const [statusFilter, setStatusFilter] = useState('all');
    const { filteredData, searchValue, setSearchValue, selectedDate, setSelectedDate } = useFilterData(totalticket);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await GlobalApi(Admingetalltickets, 'POST', null, token);

                if (response.status === 401) {
                    seterrormessage('Authentication error, please login again.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('userdata');
                } else if (Array.isArray(response.data.ticket)) {
                    settotalticket(response.data.ticket);
                    console.log("totalticket", response.data.ticket);

                    // Call the other APIs only after successfully fetching the tickets
                    await fetchAverageResolvedTime(token);
                    await fetchAverageResponseTime(token);
                } else {
                    console.error('User data not fetched', response.data);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setloading(false);
            }
        };

        const fetchAverageResolvedTime = async (token) => {
            try {
                const response = await GlobalApi(Adminshowaverageresolvedtime, 'POST', null, token);
                if (response.status === 200) {
                    settotalresolvedata(response.data);
                    console.log("Adminshowaverageresolvedtime", response.data);
                } else if (response.status === 401) {
                    seterrormessage("Authentication error. Please login as an Admin.");
                    localStorage.removeItem('token');
                    localStorage.removeItem('userdata');
                } else if (response.status === 500) {
                    seterrormessage("Internet server down");
                }
            } catch (error) {
                console.error('Error:', error);
                seterrormessage("An error occurred while fetching data.");
            }
        };

        const fetchAverageResponseTime = async (token) => {
            try {
                const response = await GlobalApi(Adminshowaverageresponsetime, 'POST', null, token);
                if (response.status === 200) {
                    settotalresponsetime(response.data);
                    console.log("Adminshowaverageresponsetime", response.data);
                } else if (response.status === 401) {
                    seterrormessage("Authentication error. Please login as an Admin.");
                    localStorage.removeItem('token');
                    localStorage.removeItem('userdata');
                } else if (response.status === 500) {
                    seterrormessage("Internet server down");
                }
            } catch (error) {
                console.error('Error:', error);
                seterrormessage("An error occurred while fetching data.");
            }
        };

        fetchData();
    }, []);


    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const combinedFilteredTickets = filteredData.filter(ticket => {
        if (statusFilter === 'all') return true;
        return ticket.status === statusFilter;
    });

    const handleStatusFilter = (status) => {
        setStatusFilter(status);
    };

    console.log("combinefilter", combinedFilteredTickets);

    const lastpostindex = currentpage * postperpage;
    const firstpostindex = lastpostindex - postperpage;
    const currentpost = Array.isArray(combinedFilteredTickets) ? combinedFilteredTickets.slice(firstpostindex, lastpostindex) : [];

    return (
        <div>
            <Sidebar />
            <SubHeader
                searchValue={searchValue}
                onSearchChange={(e) => setSearchValue(e.target.value)}
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
            />
            <div className="customer-adminshow-time">
                <div className="resolvetime">
                    <p>Resolve time {totalresolvedata.averageResolveTime}</p>
                </div>
                <div className="response-time">
                    <p>Response time {totalresponsetime.averageResTime}</p>
                </div>
            </div>
            <div className='customer-ticket-button'>
                <button onClick={() => handleStatusFilter('all')} className={statusFilter === 'all' ? 'active' : ''}  >All</button>
                <button onClick={() => handleStatusFilter('Pending')} className={statusFilter === 'Pending' ? 'active' : ''} >Pending</button>
                <button onClick={() => handleStatusFilter('Resolved')} className={statusFilter === 'Resolved' ? 'active' : ''} >Resolve</button>
            </div>
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
                                    <tr >
                                        <th scope="col">first_name</th>
                                        {/* <th scope="col">last_name</th> */}
                                        <th scope="col">mobile</th>
                                        <th scope="col">Subject</th>
                                        <th scope="col">Status</th>
                                        {/* / <th scope="col">Subject</th> */}
                                        <th scope="col">Created Date</th>

                                    </tr>
                                </thead>
                                <tbody>

                                    {currentpost && currentpost.length > 0 ? (
                                        currentpost.map((ticket) => (
                                            <Singlecustomer key={ticket._id} ticket={ticket} />
                                        ))
                                    ) : (
                                        <div className="nodatafound">
                                            <p>no data found</p>
                                        </div>
                                    )}
                                </tbody>
                            </table >
                        </div>

                        {combinedFilteredTickets.length > 0 && (
                            <Pagination totalpost={combinedFilteredTickets.length} postperpage={postperpage} currentpage={currentpage} setcurrentpage={setcurrentpage} />
                        )}

                    </>
                )}
            </div>
        </div>
    )
}

export default Customer
