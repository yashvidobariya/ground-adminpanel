import React, { useEffect, useState } from 'react';
import { NotificationAPI } from '../service/APIrouter';
import { GlobalApi } from '../service/GlobalApi';
import Singlenotification from '../Single/Singlenotification';
import Sidebar from '../Component/Sidebar';
import SubHeader from '../Component/SubHeader';
import loadingdata from '../Data/Playturf.json'
import Lottie from 'lottie-react'
import useFilterData from '../Authentication/Usefilterdata';
import Pagination from '../Dialogbox/Pagination';

const Notification = () => {
    const [userdata, setuserdata] = useState([]);
    const [loading, setloading] = useState(true);
    const [currentpage, setcurrentpage] = useState(1);
    const [errormessage, seterrormessage] = useState("");
    const [postperpage] = useState(10);
    const handleDateChange = (data) => {
        setSelectedDate(data);
    }

    const {
        filteredData,
        searchValue,
        setSearchValue,
        selectedDate,
        setSelectedDate,
    } = useFilterData(userdata);

    useEffect(() => {
        const fetchdata = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await GlobalApi(NotificationAPI, 'POST', null, token);

                if (response.status === 401) {
                    seterrormessage('Authentication error, please login again.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('userdata');
                }
                else if (Array.isArray(response.data.notifications)) {
                    setuserdata(response.data.notifications);
                    console.log("data", userdata)
                } else {
                    console.error("user not fetch", response.data);
                }
            } catch (error) {
                console.error('error', error);
            }
            finally {
                setloading(false);
            }
        };
        fetchdata();
    }, []);


    if (errormessage) {
        return <div className='autherror'><h1>{errormessage}</h1></div>;
    }


    const lastpostindex = currentpage * postperpage;
    const firstpostindex = lastpostindex - postperpage;
    const currentpost = Array.isArray(filteredData) ? filteredData.slice(firstpostindex, lastpostindex) : [];

    return (
        <div>
            <Sidebar />
            <SubHeader
                searchValue={searchValue}
                onSearchChange={(e) => setSearchValue(e.target.value)}
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
            />
            {loading ? (
                <div className="loader">
                    <div className="loading-icon">
                        <Lottie animationData={loadingdata} />
                    </div>
                </div>
            ) : (
                <>
                    <table className='user-data'>
                        <tbody>
                            {currentpost && currentpost.length > 0 ? (
                                currentpost.map((notification) => (
                                    <Singlenotification key={notification._id} notification={notification} />
                                ))
                            ) : (
                                <div className="nodatafound">
                                    <p>no data found</p>
                                </div>
                            )}
                        </tbody>
                    </table>
                    {filteredData.length > 0 && (
                        <Pagination totalpost={filteredData.length}
                            postperpage={postperpage} currentpage={currentpage} setcurrentpage={setcurrentpage} />
                    )}


                </>
            )}
        </div>
    );
};

export default Notification;
