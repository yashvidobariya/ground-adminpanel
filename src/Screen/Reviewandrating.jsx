import React, { useEffect, useState } from 'react'
import Sidebar from '../Component/Sidebar'
import SubHeader from '../Component/SubHeader'
import { GlobalApi } from '../service/GlobalApi'
import { Adminreviewandrating } from '../service/APIrouter'
import Lottie from 'lottie-react'
import loadingdata from '../Data/Playturf.json'
import useFilterData from '../Authentication/Usefilterdata'
import Pagination from '../Dialogbox/Pagination'
import Review from '../Review'

const Reviewandrating = () => {
    const [userdata, setuserdata] = useState([]);
    const [loading, setloading] = useState(true);
    const [errormessage, seterrormessage] = useState("");
    const [currentpage, setcurrentpage] = useState(1);
    const [postperpage] = useState(10)


    const { filteredData, selectedDate, setSearchValue, searchValue, setSelectedDate } = useFilterData(userdata);


    useEffect(() => {

        const fetchdata = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await GlobalApi(Adminreviewandrating, 'Post', null, token);
                if (response.status === 401) {
                    seterrormessage('Authentication error, please login again.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('userdata');
                } else if (Array.isArray(response.data?.reviews)) {
                    setuserdata(response.data?.reviews);
                } else {
                    console.log('no data found in response');
                }
            }
            catch (error) {
                console.error('error fetching data', error);
            } finally {
                setloading(false);
            }
        };
        fetchdata();
    }, [])

    if (errormessage) {
        return <div className='autherror'><h1>{errormessage}</h1>
        </div>;
    }


    const handleDateChange = (date) => {
        setSelectedDate(date);
    };


    const lastpostindex = currentpage * postperpage;
    const firstpostindex = lastpostindex - postperpage;
    const currentpost = Array.isArray(filteredData) ? filteredData.slice(firstpostindex, lastpostindex) : [];
    console.log("currentpost", currentpost);
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
                <div className='review-container'>
                    {currentpost && currentpost.length > 0 ? (

                        currentpost.map((review, index) => (

                            <div className="review-main" key={index}>
                                <div className="review-title">
                                    <p>{review.groundid?.ownername}</p>

                                    <div className="rating-star-div">
                                        <div className="rating-number">
                                            <h5> {review.rate}</h5>
                                        </div>
                                        <div className="rating-star">
                                            <h5> <Review rating={review.rate} /></h5>
                                        </div>
                                    </div>
                                </div>

                                <div className="review-info">
                                    <div className="review-ground">
                                        <p>{review.groundid?.groundname}</p>
                                    </div>

                                    <div className="review-date">
                                        <p>   {review.createdat.slice(0, 10)}{" "}</p>
                                    </div>

                                    <div className="review-booking">
                                        <p> {review.groundid?.nooftimebooked} Booking</p>
                                    </div>
                                </div>
                                <div className="review-des">
                                    <p>{review?.review}</p>
                                </div>
                            </div>

                        ))
                    ) : (
                        <div className="nodatafound">
                            <p>no data found</p>
                        </div>
                    )}
                </div>

            )}
        </div>
    )
}

export default Reviewandrating