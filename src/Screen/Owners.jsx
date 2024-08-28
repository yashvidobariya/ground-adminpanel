import React, { useEffect, useState } from 'react'
import { GlobalApi } from '../service/GlobalApi';
import { ShowOwnersAPI } from '../service/APIrouter';
import SingleOwner from '../Single/SingleOwner';
import Sidebar from '../Component/Sidebar';
import SubHeader from '../Component/SubHeader';
import loadingdata from '../Data/Playturf.json'
import Lottie from 'lottie-react'
import useFilterData from '../Authentication/Usefilterdata';
import Pagination from '../Dialogbox/Pagination';


const Owners = () => {
    const [userdata, setuserdata] = useState([]);
    const [loading, setloading] = useState(true);
    const [errormessage, seterrormessage] = useState("");
    const [currentpage, setcurrentpage] = useState(1);
    const [postperpage] = useState(7);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const { filteredData, searchValue, setSearchValue, selectedDate, setSelectedDate } = useFilterData(userdata);

    useEffect(() => {
        const fetchdata = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await GlobalApi(ShowOwnersAPI, 'POST', null, token);
                console.log("data", response);

                if (response.data) {
                    if (response.status === 401) {
                        seterrormessage('Authentication error, please login again.');
                    }
                    else if (Array.isArray(response.data?.owners)) {
                        setuserdata(response.data?.owners);
                    } else {
                        setuserdata(response.data);
                    }
                } else {
                    console.error('No data found in response');
                }
            }
            catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setloading(false);
            }
        };
        fetchdata();
    }, []);

    if (errormessage) {
        return <div className='autherror'><h1>{errormessage}</h1>
        </div>;
    }


    const lastpostindex = currentpage * postperpage;
    const firstpostindex = lastpostindex - postperpage;
    const currentpost = Array.isArray(filteredData) ? filteredData.slice(firstpostindex, lastpostindex) : [];

    return (
        <>
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
                    <div className="table-container">
                        <table className='user-data'>
                            <thead>
                                <tr>
                                    <th scope="col">Owner Name</th>
                                    <th scope="col">Country</th>
                                    <th scope="col">Phone No.</th>
                                    <th scope="col">Ground </th>
                                    <th scope="col">Status</th>
                                    <th scope="col">User Since</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentpost && currentpost.length > 0 ? (
                                    currentpost.map((user) => (
                                        <SingleOwner key={user._id} user={user} />
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


                </>
            )}
        </>
    )
}

export default Owners