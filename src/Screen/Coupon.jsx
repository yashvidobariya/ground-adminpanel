import React, { useEffect, useState } from 'react';
import Sidebar from '../Component/Sidebar';
import { GlobalApi } from '../service/GlobalApi';
import { Createcoupon, Getallcoupon } from '../service/APIrouter';
import { toast, ToastContainer } from 'react-toastify';
import { IoAddCircleSharp } from "react-icons/io5";
import Lottie from 'lottie-react';
import loadingdata from '../Data/Playturf.json'

const Coupon = () => {
    const [coupondata, setcoupondata] = useState([]);
    const [loading, setloading] = useState(true);
    const [errormessage, seterrormessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [selectedGrounds, setSelectedGrounds] = useState([]);
    const [newCoupon, setNewCoupon] = useState({
        code: '',
        discountType: 'Percentage',
        discountValue: '',
        maxDiscount: '',
        usageLimit: '',
        expiryDate: '',
        applicableTo: 'all'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await GlobalApi(Getallcoupon, 'POST', null, token);

                if (response.status === 401) {
                    seterrormessage('Authentication error, please login again.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('userdata');
                } else if (Array.isArray(response.data.coupon)) {
                    setcoupondata(response.data.coupon);
                } else {
                    console.error('User data not fetched', response.data.coupon);
                }
            } catch (error) {
                console.error('Error fetching data', error);
            } finally {
                setloading(false);  // Set loading to false after fetching is done
            }
        };
        fetchData();
    }, []);

    const handleCreateButton = () => {
        setShowPopup(true);
        document.body.classList.add('popup-open');
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        document.body.classList.remove('popup-open');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCoupon({ ...newCoupon, [name]: value });
    };

    const handleGroundChange = (e) => {
        const { value, checked } = e.target;
        setSelectedGrounds(prevSelectedGrounds =>
            checked ? [...prevSelectedGrounds, value] : prevSelectedGrounds.filter(id => id !== value)
        );
    };

    const handleSubmitCoupon = async () => {
        if (newCoupon.applicableTo === 'specific' && selectedGrounds.length === 0) {
            toast.error('Please select at least one ground when applicable to specific.');
            return;
        }

        const token = localStorage.getItem("token");
        const couponData = {
            ...newCoupon,
            groundIds: newCoupon.applicableTo === 'specific' ? selectedGrounds : []
        };

        try {
            const response = await fetch(Createcoupon, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(couponData)
            });

            const contentType = response.headers.get('Content-Type');
            let responsedata;

            if (contentType && contentType.includes('application/json')) {
                responsedata = await response.json();
            } else {
                responsedata = await response.text();
            }

            console.log("Response Status:", response.status);
            console.log("Response Data:", responsedata);

            if (response.status === 201) {
                notify();
                setcoupondata([...coupondata, responsedata.coupon]);
            } else {
                toast.error(`Error: ${response.status}`);
            }
        } catch (error) {
            console.error('Error creating coupon:', error);
            toast.error('Failed to create coupon. Please try again.');
        } finally {
            setNewCoupon({
                code: '',
                discountType: 'Percentage',
                discountValue: '',
                maxDiscount: '',
                usageLimit: '',
                expiryDate: '',
                applicableTo: 'specific'
            });
            setSelectedGrounds([]);
            handleClosePopup();
        }
    };

    const notify = () => {
        toast.success("Coupon added successfully");
    };

    return (
        <div>
            <ToastContainer autoClose={3000} closeOnClick />
            <Sidebar />
            {loading ? (
                <div className="loader">
                    <div className="loading-icon">
                        <Lottie animationData={loadingdata} />
                    </div>
                </div>
            ) : (
                <div>
                    <div className="create-coupan-button">
                        <p>Create Coupan</p>
                        <div>
                            <IoAddCircleSharp onClick={handleCreateButton} className='create-icon' />
                        </div>
                    </div>

                    <div className="coupon-div">
                        {
                            coupondata.length > 0 ? (
                                coupondata.map((coupon, index) => (
                                    <div key={index} className="coupon">
                                        <div className="left">
                                            <div>{coupon.code} - coupon code</div>
                                        </div>
                                        <div className="center">
                                            <div>
                                                <h2>{coupon.discountValue}{coupon.discountType === 'Percentage' ? '%' : ' Fixed'}</h2>
                                                <h4>{coupon.usedCount} / {coupon.usageLimit} Usage Limit</h4>
                                                <small>Valid until {coupon.expiryDate.slice(0, 10)}</small>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div>No coupons available</div>
                            )
                        }
                    </div>

                    {showPopup && (
                        <div className="popup">
                            <div className="popup-content">
                                <h2>Create a New Coupon</h2>
                                <div className="coupon-specifice">
                                    <div>
                                        <label>Coupon Code:</label>
                                        <input
                                            type="text"
                                            name="code"
                                            value={newCoupon.code}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Discount Type:</label>
                                        <select
                                            name="discountType"
                                            value={newCoupon.discountType}
                                            onChange={handleInputChange}
                                        >
                                            <option value="Percentage">Percentage</option>
                                            <option value="Fixed">Fixed</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="coupon-specifice">
                                    <div>
                                        <label>Discount Value:</label>
                                        <input
                                            type="number"
                                            name="discountValue"
                                            value={newCoupon.discountValue}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Max Discount:</label>
                                        <input
                                            type="number"
                                            name="maxDiscount"
                                            value={newCoupon.maxDiscount}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="coupon-specifice">
                                    <div>
                                        <label>Usage Limit:</label>
                                        <input
                                            type="number"
                                            name="usageLimit"
                                            value={newCoupon.usageLimit}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Expiry Date:</label>
                                        <input
                                            type="date"
                                            name="expiryDate"
                                            value={newCoupon.expiryDate}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label>Applicable To:</label>
                                    <select
                                        name="applicableTo"
                                        value={newCoupon.applicableTo}
                                        onChange={handleInputChange}
                                    >
                                        <option value="All">All</option>
                                        <option value="specific">Specific</option>
                                    </select>
                                </div>
                                <label>Select Grounds:</label>
                                {newCoupon.applicableTo === 'specific' && (
                                    <div className='coupon-specifice'>
                                        <div className='coupon-specifice-div'>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    value="668514d6abfe0168a36e17fd"
                                                    checked={selectedGrounds.includes('668514d6abfe0168a36e17fd')}
                                                    onChange={handleGroundChange}
                                                />
                                                Ground 1
                                            </label>
                                        </div>
                                        <div className='coupon-specifice-div'>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    value="6683a50435f8bfb0e2aef702"
                                                    checked={selectedGrounds.includes('6683a50435f8bfb0e2aef702')}
                                                    onChange={handleGroundChange}
                                                />
                                                Ground 2
                                            </label>
                                        </div>
                                        <div className='coupon-specifice-div'>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    value="668622c735f8bfb0e2aef706"
                                                    checked={selectedGrounds.includes('668622c735f8bfb0e2aef706')}
                                                    onChange={handleGroundChange}
                                                />
                                                Ground 3
                                            </label>
                                        </div>
                                    </div>
                                )}
                                <button onClick={handleSubmitCoupon}>Create Coupon</button>
                                <button onClick={handleClosePopup}>Close</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
};

export default Coupon;
