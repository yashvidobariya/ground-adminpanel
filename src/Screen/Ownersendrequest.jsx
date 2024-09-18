import React, { useEffect, useState } from 'react';
import Sidebar from '../Component/Sidebar';
import { GlobalApi } from '../service/GlobalApi';
import { Getallproowners, Pendingreqforproplan } from '../service/APIrouter';
import useFilterData from '../Authentication/Usefilterdata';
import SubHeader from '../Component/SubHeader';
import Lottie from 'lottie-react';
import loadingdata from '../Data/Playturf.json';
import Singleownersendrequest from '../Single/Singleownersendrequest';
import Pagination from '../Dialogbox/Pagination';

const Ownersendrequest = () => {
    const [userdata, setuserdata] = useState([]);
    const [loading, setloading] = useState(true);
    const [errormessage, seterrormessage] = useState('');
    const [currentpage, setcurrentpage] = useState(1);
    const [postperpage] = useState(10);
    const [selectedFilter, setSelectedFilter] = useState('All');

    const {
        filteredData,
        searchValue,
        setSearchValue,
        selectedDate,
        setSelectedDate,
    } = useFilterData(userdata);

    useEffect(() => {
        const fetchOwnersData = async () => {
            try {
                const token = localStorage.getItem('token');
                let response;

                if (selectedFilter === 'All') {
                    response = await GlobalApi(Getallproowners, 'POST', null, token);
                    if (response.status === 401) {
                        seterrormessage('Authentication error, please login again.');
                        localStorage.removeItem('token');
                        localStorage.removeItem('userdata');
                    } else if (Array.isArray(response.data.proOwners)) {
                        setuserdata(response.data.proOwners);
                    } else {
                        console.error('Data not fetched correctly:', response.data);
                    }
                } else if (selectedFilter === 'Pending') {
                    response = await GlobalApi(Pendingreqforproplan, 'POST', null, token);
                    if (response.status === 401) {
                        seterrormessage('Authentication error, please login again.');
                        localStorage.removeItem('token');
                        localStorage.removeItem('userdata');
                    } else if (Array.isArray(response.data.proOwners)) {
                        const normalizedData = response.data.proOwners.map(owner => ({
                            _id: owner._id,
                            first_name: owner.ownerId.first_name || '',
                            last_name: owner.ownerId.last_name || '',
                            mobile: owner.ownerId.mobile || '',
                            email: owner.ownerId.email || '',
                            usertype: owner.ownerId.usertype || '',
                        }));
                        setuserdata(normalizedData);
                    } else {
                        console.error('Data not fetched correctly:', response.data);
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setloading(false);
            }
        };

        setloading(true);
        fetchOwnersData();
    }, [selectedFilter]);

    const handleFilterClick = (filter) => {
        setSelectedFilter(filter);
        setloading(true);
    };

    const handleDateChange = (data) => {
        setSelectedDate(data);
    };

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
            <div className="bookingpage-button-control">
                <div className='customer-ticket-button'>
                    <button
                        className={selectedFilter === 'All' ? 'active' : ''}
                        onClick={() => handleFilterClick('All')}
                    >
                        All
                    </button>
                    <button
                        className={selectedFilter === 'Pending' ? 'active' : ''}
                        onClick={() => handleFilterClick('Pending')}
                    >
                        Pending
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loader">
                    <div className="loading-icon">
                        <Lottie animationData={loadingdata} />
                    </div>
                </div>
            ) : (
                <table className='user-data'>
                    <thead>
                        <tr>
                            <th scope="col">First Name</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">Mobile</th>
                            <th scope="col">Email</th>
                            <th scope="col">User Type</th>
                            {selectedFilter === 'Pending' && <th scope="col">Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {currentpost && currentpost.length > 0 ? (
                            currentpost.map((proOwners) => (
                                <Singleownersendrequest
                                    key={proOwners._id}
                                    proOwners={proOwners}
                                    selectedFilter={selectedFilter}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="nodatafound">
                                    No data found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
            {filteredData.length > 0 && (
                <Pagination
                    totalpost={filteredData.length}
                    postperpage={postperpage}
                    currentpage={currentpage}
                    setcurrentpage={setcurrentpage}
                />
            )}
        </div>
    );
};

export default Ownersendrequest;
