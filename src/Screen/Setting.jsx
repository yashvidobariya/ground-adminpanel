import React, { useRef, useState } from 'react';
import Sidebar from '../Component/Sidebar';
import { GlobalApi } from '../service/GlobalApi';
import { Adminaddground, ShowOwnersAPI } from '../service/APIrouter';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import Select from 'react-select';
import { IoArrowBackCircle } from 'react-icons/io5';
import { MdOutlineAddCircle } from "react-icons/md";
import { FaCircleMinus } from "react-icons/fa6";
import moment from 'moment';

const AddGround = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [owerndata, setownerdata] = useState([]);
    const [owerid, setownerid] = useState("");
    const fileInputRef = useRef(null);
    const [photoIndexToChange, setPhotoIndexToChange] = useState(null);
    const [formdata, setFormdata] = useState({
        ownerid: owerid,
        groundname: '',
        address: '',
        location: '',
        state: '',
        country: '',
        photos: [],
        description: '',
        rulesandregulation: '',
        facilities: '',
        sport_type: '',
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
        baseprice: '',
        starttime: '',
        endtime: ''
    });

    const [selectedOption, setSelectedOption] = useState(null);
    const contacts = [
        { value: '7861003128', label: '7861003128' },
        { value: '+917984066311', label: '+917984066311' },
        { value: '+919724283087', label: '+919724283087' }
    ];

    const handleChange = async (selectedOption) => {
        setSelectedOption(selectedOption);
        try {
            const token = localStorage.getItem("token");
            const response = await GlobalApi(ShowOwnersAPI, 'POST', null, token);

            if (response.status === 201) {
                setownerdata(response.data.owner);
                console.log("ownerdata", response.data.owners);
                console.log("mobile", selectedOption);

                const selectedowner = response.data.owners.find(owner => owner.mobile === selectedOption.value);

                if (selectedowner) {
                    const selectedownerid = selectedowner._id;
                    setownerid(selectedownerid);
                    setFormdata({
                        ...formdata,
                        ownerid: selectedownerid
                    });
                    console.log(selectedownerid);
                    console.log("selectedOwner", selectedowner);
                } else {
                    alert("Owner not found for mobile number:", selectedOption.value)
                    setownerid("");
                    setFormdata({
                        ...formdata,
                        ownerid: ""
                    });
                }
            } else {
                console.error('No data found in response');
            }
        } catch (error) {
            console.error('Error fetching data', error);
        } finally {
            setLoading(false);
        }
    };

    const handlechange = async (e) => {
        const { name, value, files } = e.target;

        if (name === 'photos') {
            const updatedPhotos = [...formdata.photos];
            console.log("updatedphoto", updatedPhotos);
            if (photoIndexToChange !== null) {
                updatedPhotos[photoIndexToChange] = files[0];
                setPhotoIndexToChange(null);
            } else {
                updatedPhotos.push(...Array.from(files));
            }
            setFormdata({
                ...formdata,
                photos: updatedPhotos
            });
        } else {
            setFormdata({
                ...formdata,
                [name]: value
            });
        }
    };

    const handlearray = (e, array) => {
        const { value } = e.target;
        setFormdata({
            ...formdata,
            [array]: value.split(',').map(item => item.trim())
        });
    };

    const handlePriceChange = (e, index) => {
        const { name, value } = e.target;
        const updatedWeekdayPrice = [...formdata.weekdayPrice];
        updatedWeekdayPrice[index] = {
            ...updatedWeekdayPrice[index],
            [name]: name === "price" ? Number(value) : value,
        };
        setFormdata({ ...formdata, weekdayPrice: updatedWeekdayPrice });
    };


    const handleEventPriceChange = (e, eventIndex, timeSlotIndex) => {
        const { name, value } = e.target;
        const updatedEventPrices = [...formdata.eventPrices];
        updatedEventPrices[eventIndex].timeSlot[timeSlotIndex] = {
            ...updatedEventPrices[eventIndex].timeSlot[timeSlotIndex],
            [name]: name === "price" ? Number(value) : value,
        };
        setFormdata({ ...formdata, eventPrices: updatedEventPrices });
    };


    const handleRemove = (index) => {
        const updatedPhotos = formdata.photos.filter((_, i) => i !== index);
        setFormdata({ ...formdata, photos: updatedPhotos });
    };

    const handleChangeimage = (index) => {
        setPhotoIndexToChange(index);
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const formDataToSend = new FormData();

            const convertToTimeFormat = (timeStr) => {
                const [hours, minutes] = timeStr.split(':');
                const date = new Date();
                date.setUTCHours(Number(hours));
                date.setUTCMinutes(Number(minutes));
                date.setUTCSeconds(0);
                date.setUTCMilliseconds(0);
                const formattedTime = date.toISOString();
                return formattedTime.split('T')[1];
            };


            function convertToUTCFormat(timeStr) {
                const [hours, minutes] = timeStr.split(':');
                const date = new Date();
                date.setUTCHours(hours);
                date.setUTCMinutes(minutes);
                date.setUTCMilliseconds(0);

                const year = date.getUTCFullYear();
                const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
                const day = date.getUTCDate().toString().padStart(2, '0');
                const formattedTime = `${year}-${month}-${day}T${hours}:${minutes}:00.000Z`;

                return formattedTime;
            }

            Object.keys(formdata).forEach(key => {
                if (Array.isArray(formdata[key])) {
                    if (key === 'photos') {
                        formdata[key].forEach(file => formDataToSend.append('photos', file));
                    } else {
                        const formattedArray = formdata[key].map(item => {
                            if (item.date) {
                                item.date = convertToUTCFormat(item.date);
                                console.log("date", item.date)
                            }
                            if (item.wd_starttime) {
                                item.wd_starttime = convertToTimeFormat(item.wd_starttime);
                            }
                            if (item.wd_endtime) {
                                item.wd_endtime = convertToTimeFormat(item.wd_endtime);
                            }
                            if (item.timeSlot) {
                                item.timeSlot = item.timeSlot.map(slot => ({
                                    ...slot,
                                    wd_starttime: convertToTimeFormat(slot.wd_starttime),
                                    wd_endtime: convertToTimeFormat(slot.wd_endtime)
                                }));
                            }
                            return item;
                        });
                        formDataToSend.append(key, JSON.stringify(formattedArray));
                    }
                } else if (key === 'starttime' || key === 'endtime') {
                    formDataToSend.append(key, convertToTimeFormat(formdata[key]));
                } else if (key === 'wd_starttime' || key === 'wd_endtime') {
                    formDataToSend.append(key, convertToTimeFormat(formdata[key]));
                } else if (key === 'date') {
                    formDataToSend.append(key, convertToUTCFormat(formdata[key]));
                } else {
                    formDataToSend.append(key, formdata[key]);
                }
            });

            console.log("formDataToSend", formDataToSend);

            const response = await fetch(Adminaddground, {
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
                console.log("Response Status:", response.status);
                console.log("Response Data:", responsedata);
            }

            if (response.status === 201) {
                console.log("success");
                notify();
            } else {
                toast.error(`Error: ${response.status}`);
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const notify = () => {
        console.log("notify");
        toast.success("Ground added successfully");
        setTimeout(() => {
            navigate("/venue");
        }, 3500);
    };


    const handlecancel = () => {
        navigate('/venue');
    }

    const handleBackClick = () => {
        navigate(-1);
    };


    const handleAddPrice = () => {
        setFormdata({
            ...formdata,
            weekdayPrice: [...formdata.weekdayPrice, { wd_starttime: '', wd_endtime: '', price: '' }],
        });
    };

    const handleRemovePrice = (index) => {
        const newWeekdayPrice = [...formdata.weekdayPrice];
        newWeekdayPrice.splice(index, 1);
        setFormdata({
            ...formdata,
            weekdayPrice: newWeekdayPrice,
        });
    };

    const handlePriceChangeWeekend = (e, index) => {
        const { name, value } = e.target;
        const updatedWeekendPrice = [...formdata.weekendPrice];
        updatedWeekendPrice[index] = {
            ...updatedWeekendPrice[index],
            [name]: name === "price" ? Number(value) : value, // Ensure price is a number
        };
        setFormdata({ ...formdata, weekendPrice: updatedWeekendPrice });
    };

    const handleAddWeekendPrice = () => {
        setFormdata({
            ...formdata,
            weekendPrice: [...formdata.weekendPrice, { wd_starttime: '', wd_endtime: '', price: '' }],
        });
    };

    const handleRemoveWeekendPrice = (index) => {
        const newWeekendPrice = [...formdata.weekendPrice];
        newWeekendPrice.splice(index, 1);
        setFormdata({
            ...formdata,
            weekendPrice: newWeekendPrice,
        });
    };

    const handleAddEventPrice = () => {
        setFormdata({
            ...formdata,
            eventPrices: [
                ...formdata.eventPrices,
                { date: '', timeSlot: [{ wd_starttime: '', wd_endtime: '', price: '' }] }
            ]
        });
    };

    const handleRemoveEventPrice = (eventIndex) => {
        if (formdata.eventPrices.length > 1) {
            const updatedEventPrices = [...formdata.eventPrices];
            updatedEventPrices.splice(eventIndex, 1);
            setFormdata({ ...formdata, eventPrices: updatedEventPrices });
        }
    };

    return (
        <>
            <ToastContainer autoClose={3000} closeOnClick />
            <Sidebar />
            <div className='back-grounddetails' onClick={handleBackClick}>
                <IoArrowBackCircle />
            </div>
            <div className="addground-main">
                <div className="addground-list">
                    <div className="addground-title">
                        <h1>Add Ground</h1>
                    </div>

                    <div className="addground-des">
                        <div className="add-list-full">
                            <label>Ground Name</label>
                            <input type='text' placeholder='Enter Ground name' name='groundname' onChange={handlechange} value={formdata.groundname} />
                        </div>

                        <div className="add-list-full">
                            <label htmlFor="mobile">Mobile Number</label>
                            <Select
                                id="mobile"
                                name="mobile"
                                value={selectedOption || ''}
                                onChange={handleChange}
                                options={contacts}
                                placeholder="Select a Contact"
                            ></Select>
                        </div>

                        <div className="add-list-full">
                            <label>Base Price</label>
                            <input type='number' placeholder='Enter price' name='baseprice' onChange={handlechange} value={formdata.baseprice} />
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

                        <div className="add-list1">
                            <label>State</label>
                            <select id="state" name="state" onChange={handlechange} value={formdata.state}>
                                <option value="" disabled>Select a state</option>
                                <option value="Gujrat">Gujrat</option>
                                <option value="Mumbai">Mumbai</option>
                            </select>
                        </div>

                        <div className="add-list1">
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
                                <input type='text' placeholder='Enter facilities (comma separated)' name='facilities' onChange={(e) => handlearray(e, 'facilities')} value={formdata.facilities} />
                            </div>
                        </div>

                        <div className="add-list">
                            <label>Sport Types</label>
                            <div className="add-list-flex">
                                <input type="text" placeholder='Enter sport types (comma separated)' name="sport_type" onChange={(e) => handlearray(e, 'sport_type')} value={formdata.sport_type} />
                            </div>
                        </div>

                        <div className="add-list">
                            <label>Photos</label>
                            <input
                                type='file'
                                placeholder='Enter ground photos'
                                name='photos'
                                onChange={handlechange}
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                            />
                            {formdata.photos.length === 0 ? (
                                <button type="button" onClick={() => fileInputRef.current.click()}>Add Photos</button>
                            ) : (
                                formdata.photos.map((photo, index) => (
                                    <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
                                        <img src={URL.createObjectURL(photo)} alt="Ground" width="100" height="100" />
                                        <div className="add-list-button-flex">
                                            <button type="button" onClick={() => handleRemove(index)}>Remove</button>
                                            <button type="button" onClick={() => handleChangeimage(index)}>Change</button>
                                        </div>
                                    </div>
                                ))
                            )}
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

                    <div className="addground-des-price">
                        {formdata.weekdayPrice.map((priceEntry, index) => (
                            <div className="add-list" key={index}>
                                <label>Weekday Price {index + 1}</label>

                                <div className="add-list-flex">
                                    <div className="add-list" >
                                        <label>Start Time</label>
                                        <input
                                            type="time"
                                            placeholder="Start time"
                                            name="wd_starttime"
                                            onChange={(e) => handlePriceChange(e, index)}
                                            value={priceEntry.wd_starttime}
                                        />
                                    </div>
                                    <div className="add-list" >
                                        <label>End Time</label>
                                        <input
                                            type="time"
                                            name="wd_endtime"
                                            onChange={(e) => handlePriceChange(e, index)}
                                            value={priceEntry.wd_endtime}
                                        />
                                    </div>
                                    <div className="add-list" >
                                        <label>Price</label>
                                        <input
                                            type="number"
                                            name="price"
                                            placeholder="Enter price"
                                            onChange={(e) => handlePriceChange(e, index)}
                                            value={priceEntry.price}
                                        />
                                    </div>
                                    {formdata.weekdayPrice.length > 1 && (
                                        <FaCircleMinus onClick={() => handleRemovePrice(index)} className='addground-icon' />
                                    )}

                                </div>
                            </div>
                        ))}
                        <MdOutlineAddCircle onClick={handleAddPrice} className='addground-icon' />
                    </div>

                    <div className="addground-des-price">
                        {formdata.weekendPrice.map((priceEntry1, index) => (
                            <div className="add-list" key={index}>
                                <label>Weekend Price {index + 1}</label>
                                <div className="add-list-flex">
                                    <input
                                        type="time"
                                        placeholder="Start time"
                                        name="wd_starttime"
                                        onChange={(e) => handlePriceChangeWeekend(e, index)}
                                        value={priceEntry1.wd_starttime}
                                    />
                                    <input
                                        type="time"
                                        name="wd_endtime"
                                        onChange={(e) => handlePriceChangeWeekend(e, index)}
                                        value={priceEntry1.wd_endtime}
                                    />
                                    <input
                                        type="number"
                                        name="price"
                                        placeholder="Enter price"
                                        onChange={(e) => handlePriceChangeWeekend(e, index)}
                                        value={priceEntry1.price}
                                    />

                                    {formdata.weekendPrice.length > 1 && (
                                        <FaCircleMinus onClick={() => handleRemoveWeekendPrice(index)} className='addground-icon' />
                                    )}
                                </div>
                            </div>
                        ))}
                        <MdOutlineAddCircle onClick={handleAddWeekendPrice} className='addground-icon' />

                    </div>

                    <div className="addground-des-price">
                        <label>Event Prices</label>
                        {formdata.eventPrices.map((event, eventIndex) => (
                            <div key={eventIndex} className="add-list-box">

                                <input
                                    type="date"
                                    className="date"
                                    value={event.date}
                                    onChange={(e) => handleEventPriceChange(e, eventIndex)}
                                />

                                <label>Time Slots</label>
                                {event.timeSlot.map((slot, timeSlotIndex) => (
                                    <div className="add-list-flex" key={timeSlotIndex}>
                                        <input
                                            type="time"
                                            name="wd_starttime"
                                            placeholder="Start Time"
                                            value={slot.wd_starttime}
                                            onChange={(e) => handleEventPriceChange(e, eventIndex, timeSlotIndex)}
                                        />
                                        <input
                                            type="time"
                                            name="wd_endtime"
                                            placeholder="End Time"
                                            value={slot.wd_endtime}
                                            onChange={(e) => handleEventPriceChange(e, eventIndex, timeSlotIndex)}
                                        />
                                        <input
                                            type="number"
                                            name="price"
                                            placeholder="Enter Price"
                                            value={slot.price}
                                            onChange={(e) => handleEventPriceChange(e, eventIndex, timeSlotIndex)}
                                        />
                                    </div>
                                ))}

                                {formdata.eventPrices.length > 1 && (
                                    <FaCircleMinus onClick={() => handleRemoveEventPrice(eventIndex)} className='addground-icon' />

                                )}
                            </div>
                        ))}
                        <MdOutlineAddCircle onClick={handleAddEventPrice} className='addground-icon' />
                    </div>


                    <div className="addground-submit">
                        <button onClick={handleSubmit} disabled={loading} className='ground-update'>
                            {loading ? "Adding..." : "Add Ground"}
                        </button>

                        <button onClick={handlecancel} className='cancel-addground'>
                            Cancel
                        </button>
                    </div>
                </div>
            </div >
        </>
    );
}

export default AddGround;
