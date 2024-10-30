import React, { useEffect, useRef, useState } from 'react'
import Sidebar from '../Component/Sidebar'
import { GlobalApi } from '../service/GlobalApi';
import { Admineditground, Getoneground } from '../service/APIrouter';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router';
import Lottie from 'lottie-react';
import loadingdata from '../Data/Playturf.json'
import { IoArrowBackCircle } from 'react-icons/io5';
import { FaCircleMinus } from "react-icons/fa6";
import { FaCirclePlus } from "react-icons/fa6";

const SingleeditGroundlist = () => {
    const [oldPhotos, setOldPhotos] = useState([]);
    const [newPhotos, setNewPhotos] = useState([]);
    const [userData, setUserData] = useState(null);
    const [loading, setloading] = useState(true);
    const navigate = useNavigate();
    const { userId } = useParams();
    const [formdata, setformdata] = useState({
        ownerid: '',
        groundname: '',
        ownername: '',
        description: '',
        state: '',
        location: '',
        country: '',
        address: '',
        rulesandregulation: '',
        facilities: [],
        sport_type: [],
        photos: [],
        baseprice: '',
        weekdayPrice: [
            { wd_starttime: '', wd_endtime: '', price: 0 }
        ],
        weekendPrice: [
            { wd_starttime: '', wd_endtime: '', price: 0 }
        ],
        eventPrices: [
            {
                date: '',
                timeSlot: [
                    { wd_starttime: '', wd_endtime: '', price: 0 }
                ]
            }
        ],
        starttime: '',
        endtime: ''
    });


    const handlechange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'photos') {
            const uploadedPhotos = Array.from(files).map(file =>
                URL.createObjectURL(file)
            );
            setNewPhotos(uploadedPhotos);

            setformdata(prevFormdata => ({
                ...prevFormdata,
                photos: Array.from(files)
            }));
        } else if (name === 'sport_type') {
            setformdata({
                ...formdata,
                [name]: value.split(',').map(type => type.trim())
            });
        } else if (name === 'facilities') {
            setformdata({
                ...formdata,
                [name]: value.split(',').map(type => type.trim())
            });
        } else {
            setformdata({
                ...formdata,
                [name]: value
            });
        }
    };

    const handlePriceChange = (e, index, type, timeSlotIndex = null) => {
        const { name, value } = e.target;

        if (type === 'weekday') {
            const updatedPrices = formdata.weekdayPrice.map((priceEntry, i) => {
                if (index === i) {
                    return { ...priceEntry, [name]: value };
                }
                return priceEntry;
            });

            setformdata(prevFormdata => ({
                ...prevFormdata,
                weekdayPrice: updatedPrices
            }));
        } else if (type === 'weekend') {
            const updatedPrices = formdata.weekendPrice.map((priceEntry1, i) => {
                if (index === i) {
                    return { ...priceEntry1, [name]: value };
                }
                return priceEntry1;
            });

            setformdata(prevFormdata => ({
                ...prevFormdata,
                weekendPrice: updatedPrices
            }));
        } else if (type === 'event') {
            const updatedEvents = formdata.eventPrices.map((event, i) => {
                if (index === i) {
                    const updatedTimeSlots = event.timeSlot.map((slot, j) => {
                        if (timeSlotIndex === j) {
                            return { ...slot, [name]: value };
                        }
                        return slot;
                    });
                    return { ...event, timeSlot: updatedTimeSlots };
                }
                return event;
            });

            setformdata(prevFormdata => ({
                ...prevFormdata,
                eventPrices: updatedEvents
            }));
        }
    };

    const handlesubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const formDataToSend = new FormData();
            console.log("formdatdata", formDataToSend);

            Object.keys(formdata).forEach(key => {
                if (Array.isArray(formdata[key])) {
                    if (key === 'photos') {
                        formdata[key].forEach(file => formDataToSend.append('photos', file));
                    } else {
                        formDataToSend.append(key, JSON.stringify(formdata[key]));
                    }
                } else {
                    formDataToSend.append(key, formdata[key]);
                }
            });

            console.log("Submitting form with ownerid:", formDataToSend);
            const response = await fetch(`${Admineditground}/${userId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formDataToSend
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

            if (response.status === 200) {
                notify();
            }
        } catch (error) {
            console.error("Error updating user data", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await GlobalApi(`${Getoneground}/${userId}`, 'GET', null, token);

                if (response.status === 200) {
                    const data = response.data;
                    console.log("data", data);

                    function convertToTimeFormat(time) {
                        console.log("time", time);
                        if (typeof time === 'string' && time.includes(':')) {
                            const [hours, minutes] = time.split(':');
                            return `${hours}:${minutes}`;
                        } else {
                            return '00:00';
                        }
                    }

                    function convertToDateFormat(dateStr) {
                        const [day, month, year] = dateStr.split(':');
                        return `${day}-${month}-${year}`;
                    }


                    setOldPhotos(data?.ground.photos || []);
                    setformdata({
                        ownerid: data?.ground.ownerid || '',
                        groundname: data?.ground.groundname || '',
                        ownername: data?.ground.ownername || '',
                        description: data?.ground.description || '',
                        state: data?.ground.state || '',
                        location: data?.ground.location || '',
                        country: data?.ground.country || '',
                        address: data?.ground.address || '',
                        rulesandregulation: data?.ground.rulesandregulation || '',
                        sport_type: data?.ground.sport_type || [],
                        facilities: data?.ground.facilities || [],
                        baseprice: data?.ground.baseprice || '',
                        photos: data?.ground.photos || [],

                        weekdayPrice: data?.ground?.weekdayPrice?.map(price => ({
                            wd_starttime: convertToTimeFormat(price.wd_starttime) || '',
                            wd_endtime: convertToTimeFormat(price.wd_endtime) || '',
                            price: price.price || 0
                        })) || [{ wd_starttime: '', wd_endtime: '', price: 0 }],

                        weekendPrice: data?.ground?.weekendPrice?.map(price1 => ({
                            wd_starttime: convertToTimeFormat(price1.wd_starttime) || '',
                            wd_endtime: convertToTimeFormat(price1.wd_endtime) || '',
                            price: price1.price || 0
                        })) || [{ wd_starttime: '', wd_endtime: '', price: 0 }],

                        eventPrices: data?.ground?.eventPrices?.map(event => ({
                            date: convertToDateFormat(event.date) || '',
                            timeSlot: event.timeSlot?.map(slot => ({
                                wd_starttime: convertToTimeFormat(slot.wd_starttime) || '',
                                wd_endtime: convertToTimeFormat(slot.wd_endtime) || '',
                                price: slot.price || 0
                            })) || [{ wd_starttime: '', wd_endtime: '', price: 0 }]
                        })) || [{
                            date: '',
                            timeSlot: [{ wd_starttime: '', wd_endtime: '', price: 0 }]
                        }],
                        starttime: convertToTimeFormat(data?.ground.starttime || '00:00'),
                        endtime: convertToTimeFormat(data?.ground.endtime || '00:00')
                    });
                    console.log("response", response);
                    setUserData(data);
                    console.log("Event Prices:", formdata.eventPrices);
                    console.log("weekday Prices:", formdata.weekdayPrice);
                    console.log("weekend Prices:", formdata.weekendPrice);
                    console.log("data", convertToTimeFormat(data?.ground.starttime || '00:00'),);
                } else {
                    console.error('failed to fetch');
                }
            } catch (error) {
                console.error("error", error);
            } finally {
                setloading(false);
            }
        };
        fetchData();
    }, [userId]);

    const notify = () => {
        toast.success("Data updated successfully", {
            onClose: () => navigate("/venue")
        });
    };

    const handlecancel = (() => {
        navigate('/venue');
    });

    const handleBackClick = () => {
        navigate(-1);
    };
    return (
        <>
            <ToastContainer autoClose={3000} closeOnClick />
            <Sidebar />
            <div className='back-grounddetails' onClick={handleBackClick}>
                <IoArrowBackCircle />
            </div>
            <div className="add-ground-main">
                <div className="addground-main">
                    <div className="addground-list">
                        <div className="addground-title">
                            <h1>Edit Ground</h1>
                        </div>

                        <div className="addground-des">
                            <div className="add-list">
                                <label>Ground Name</label>
                                <input type='text' placeholder='Enter Ground name' name='groundname' onChange={handlechange} value={formdata.groundname} />

                            </div>

                            {/* <div className="add-list">
                                <label htmlFor="mobile">Mobile Number</label>
                                <Select
                                    id="mobile"
                                    name="mobile"
                                    value={selectedOption || ''}
                                    onChange={handleChange}
                                    options={contacts}
                                    placeholder="Select a Contact"
                                ></Select>
                            </div> */}

                            <div className="add-list">
                                <label>Base Price</label>
                                <input type='number' placeholder='Enter price ' name='baseprice' onChange={handlechange} value={formdata.baseprice || ''} />
                            </div>
                        </div>

                        <div className="addground-des">
                            <div className="add-list-full">
                                <label>Address</label>
                                <textarea rows="3" cols="30" placeholder='Enter address' name='address' onChange={handlechange} value={formdata.address} />
                            </div>
                        </div>

                        <div className="addground-des">
                            <div className="add-list">
                                <label>Location</label>
                                <input type='text' placeholder='Enter location' name='location' onChange={handlechange} value={formdata.location} />
                            </div>

                            <div className="add-list">
                                <label>State</label>
                                <select id="state" name="state" onChange={handlechange} value={formdata.state}>
                                    <option value="" disabled>Select a state</option>
                                    <option value="Gujrat">Gujrat</option>
                                    <option value="Mumbai">Mumbai</option>
                                </select>
                            </div>

                            <div className="add-list">
                                <label>Country</label>
                                <select id="state" name="country" onChange={handlechange} value={formdata.country}>
                                    <option value="" disabled>Select a country</option>
                                    <option value="India">India</option>
                                    <option value="USA">USA</option>
                                    <option value="Canada">Canada</option>
                                </select>
                            </div>


                        </div>

                        <div className="addground-des">
                            <div className="add-list-full">
                                <label>Description</label>
                                <textarea rows="3" cols="30" placeholder='Enter description' name='description' onChange={handlechange} value={formdata.description} />
                            </div>

                            <div className="add-list-full">
                                <label>Rules And Regulation</label>
                                <textarea rows="3" cols="30" placeholder='Enter Rules and Regulation' name='rulesandregulation' onChange={handlechange} value={formdata.rulesandregulation} />
                            </div>
                        </div>

                        <div className="addground-des-flex">

                            <div className="add-list">
                                <label>Facilities</label>
                                <div className="add-list-box">
                                    <input type='text' placeholder='Enter facilities' name='facilities' onChange={handlechange} value={formdata.facilities || '-'} />
                                </div>
                            </div>

                            <div className="add-list">
                                <label>Sport Types</label>
                                <div className="add-list-flex">
                                    <input type="text" name="sport_type" onChange={handlechange} value={formdata.sport_type.join(', ')} />
                                </div>
                            </div>

                            <div className="add-list">
                                <label>Ground Start Time</label>
                                <input type="time" placeholder="Start_time" name='starttime' onChange={handlechange} value={formdata.starttime} />
                            </div>

                            <div className="add-list">
                                <label>Ground End Time</label>
                                <input type="time" name='endtime' onChange={handlechange} value={formdata.endtime} />
                            </div>
                        </div>
                        <div className="add-list">
                            <label>Ground Photos</label>


                            <button type="button" onClick={() => document.getElementById('fileInput').click()}>Choose Files</button>
                            <input
                                type="file"
                                id="fileInput"
                                name="photos"
                                onChange={handlechange}
                                multiple
                                style={{ display: 'none' }}
                            />
                        </div>
                        <div className="add-list">
                            {newPhotos.length > 0 ? (
                                <div className="photo-preview">
                                    {newPhotos.map((photo, index) => (
                                        <img key={index} src={photo} alt={`img${index}`} />
                                    ))}
                                </div>
                            ) : (
                                <div className="photo-preview">
                                    {oldPhotos.map((photo, index) => (
                                        <img key={index} src={photo.photourl} alt={`img${index}`} />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="addground-des-flex">
                            <div className="add-list">
                                {formdata.weekdayPrice.map((priceEntry, index) => (
                                    <div className="add-list" key={index}>
                                        <label>Weekday Price</label>

                                        <div className="add-list-flex">
                                            <div className="add-list" >
                                                <p>Start Time</p>
                                                <input
                                                    type="time" placeholder="Start time" name="wd_starttime" value={priceEntry.wd_starttime} onChange={(e) => handlePriceChange(e, index, 'weekday')}
                                                />
                                            </div>
                                            <div className="add-list" >
                                                <p>End Time</p>
                                                <input type="time" name="wd_endtime" value={priceEntry.wd_endtime} onChange={(e) => handlePriceChange(e, index, 'weekday')}
                                                />
                                            </div>
                                            <div className="add-list" >
                                                <p>Price</p>
                                                <input type="number" name="price" placeholder="Enter price" value={priceEntry.price} onChange={(e) => handlePriceChange(e, index, 'weekday')}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="add-list">
                                {formdata.weekendPrice.map((priceEntry1, index) => (
                                    <div className="add-list" key={index}>
                                        <label>Weekend Price</label>
                                        <div className="add-list-flex">
                                            <div className="add-list">
                                                <p>Start Time</p>
                                                <input
                                                    type="time"
                                                    placeholder="Start time"
                                                    name="wd_starttime"
                                                    value={priceEntry1.wd_starttime || ''}
                                                    onChange={(e) => handlePriceChange(e, index, 'weekend')}
                                                />
                                            </div>
                                            <div className="add-list">
                                                <p>End Time</p>
                                                <input
                                                    type="time"
                                                    name="wd_endtime"
                                                    value={priceEntry1.wd_endtime || ''}
                                                    onChange={(e) => handlePriceChange(e, index, 'weekend')}
                                                />
                                            </div>
                                            <div className="add-list">
                                                <p>Price</p>
                                                <input
                                                    type="number"
                                                    name="price"
                                                    placeholder="Enter price"
                                                    value={priceEntry1.price || ''}
                                                    onChange={(e) => handlePriceChange(e, index, 'weekend')}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="add-list">
                                <label>Event Prices</label>
                                {formdata.eventPrices.map((event, eventIndex) => (
                                    <div className="add-list-box" key={eventIndex}>
                                        <div className="add-list">
                                            <p>Date</p>
                                            <input
                                                type="date"
                                                className="date"
                                                name="date"
                                                value={event.date}
                                                onChange={(e) => {
                                                    const updatedEvents = formdata.eventPrices.map((ev, i) => {
                                                        if (i === eventIndex) {
                                                            return { ...ev, date: e.target.value };
                                                        }
                                                        return ev;
                                                    });
                                                    setformdata(prevFormdata => ({
                                                        ...prevFormdata,
                                                        eventPrices: updatedEvents
                                                    }));
                                                }}
                                            />
                                        </div>
                                        {event.timeSlot.map((slot, timeSlotIndex) => (
                                            <div className="add-list-flex" key={timeSlotIndex}>
                                                <div className="add-list">
                                                    <p>Start Time</p>
                                                    <input
                                                        type="time"
                                                        name="wd_starttime"
                                                        value={slot.wd_starttime}
                                                        onChange={(e) => handlePriceChange(e, eventIndex, 'event', timeSlotIndex)}
                                                    />
                                                </div>
                                                <div className="add-list">
                                                    <p>End Time</p>
                                                    <input
                                                        type="time"
                                                        name="wd_endtime"
                                                        value={slot.wd_endtime}
                                                        onChange={(e) => handlePriceChange(e, eventIndex, 'event', timeSlotIndex)}
                                                    />
                                                </div>
                                                <div className="add-list">
                                                    <p>Price</p>
                                                    <input
                                                        type="number"
                                                        name="price"
                                                        value={slot.price}
                                                        onChange={(e) => handlePriceChange(e, eventIndex, 'event', timeSlotIndex)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>


                        <div className="addground-submit">
                            <button onClick={handlesubmit} className='ground-update'>Update</button>
                            <button onClick={handlecancel} className='addground-cancel'>Cancel</button>
                        </div>
                    </div>
                </div >
            </div>
        </>
    );
}

export default SingleeditGroundlist;
