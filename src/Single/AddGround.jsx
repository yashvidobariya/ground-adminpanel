


import React, { useRef, useState } from 'react';
import Sidebar from '../Component/Sidebar';
import { GlobalApi } from '../service/GlobalApi';
import { Adminaddground, ShowOwnersAPI } from '../service/APIrouter';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import Select from 'react-select';
import { IoArrowBackCircle } from 'react-icons/io5';
import { FaCircleMinus } from "react-icons/fa6";
import { FaCirclePlus } from "react-icons/fa6";
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

            const convertToBase64 = (file) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = (error) => reject(error);
                });
            };

            if (photoIndexToChange !== null) {
                const base64Image = await convertToBase64(files[0]);
                updatedPhotos[photoIndexToChange] = base64Image;
                setPhotoIndexToChange(null);
            } else {
                for (let i = 0; i < files.length; i++) {
                    const base64Image = await convertToBase64(files[i]);
                    updatedPhotos.push(base64Image);
                }
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


    const handleChangeimage = (index) => {
        setPhotoIndexToChange(index);
        fileInputRef.current.click();
    };


    const handlearray = (e, array) => {
        const { value } = e.target;
        setFormdata({
            ...formdata,
            [array]: value.split(',').map(item => item.trim())
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");

            const convertToTimeFormat = (timeStr) => {
                if (!timeStr) return '';

                const timeParts = timeStr.split(':');
                if (timeParts.length !== 2) {
                    throw new Error(`Invalid time format: ${timeStr}`);
                }
                const [hours, minutes] = timeParts.map(Number);
                if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
                    throw new Error(`Invalid time value: ${timeStr}`);
                }
                const date = new Date();
                date.setUTCHours(hours);
                date.setUTCMinutes(minutes);
                date.setUTCSeconds(0);
                date.setUTCMilliseconds(0);
                const pad = (num) => String(num).padStart(2, '0');
                const isoString = `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}.000Z`;
                return isoString;
            };


            const dataToSend = {
                ownerid: formdata.ownerid,
                groundname: formdata.groundname,
                location: formdata.location,
                country: formdata.country,
                state: formdata.state,
                address: formdata.address,
                description: formdata.description,
                rulesandregulation: formdata.rulesandregulation,
                starttime: convertToTimeFormat(formdata.starttime),
                endtime: convertToTimeFormat(formdata.endtime),
                baseprice: formdata.baseprice,

                weekdayPrice: formdata.weekdayPrice.map(priceEntry => ({
                    wd_starttime: convertToTimeFormat(priceEntry.wd_starttime),
                    wd_endtime: convertToTimeFormat(priceEntry.wd_endtime),
                    price: priceEntry.price,
                })),
                weekendPrice: formdata.weekendPrice.map(priceEntry1 => ({
                    we_starttime: convertToTimeFormat(priceEntry1.wd_starttime),
                    we_endtime: convertToTimeFormat(priceEntry1.wd_endtime),
                    price: priceEntry1.price,
                })),
                eventPrices: formdata.eventPrices.map(event => ({
                    date: new Date(event.date).toISOString(),
                    timeSlot: event.timeSlot.map(slot => ({
                        e_starttime: convertToTimeFormat(slot.wd_starttime),
                        e_endtime: convertToTimeFormat(slot.wd_endtime),
                        price: slot.price,
                    })),
                })),
                facilities: formdata.facilities,
                sport_type: formdata.sport_type,
                photos: formdata.photos,
            };
            console.log("Data to send:", dataToSend);

            const response = await fetch(Adminaddground, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                notify();
            } else {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    toast.error(`Error: ${errorData.message || response.statusText}`);
                } else {
                    const errorText = await response.text();
                    toast.error(`Error: ${response.status} - ${errorText}`);
                }
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };


    // ====================Weekday Price============
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

    const handlePriceChange = (e, index) => {
        const { name, value } = e.target;
        const updatedWeekdayPrice = [...formdata.weekdayPrice];
        console.log("updateweekdayprice", updatedWeekdayPrice);
        updatedWeekdayPrice[index] = {
            ...updatedWeekdayPrice[index],
            [name]: name === "price" ? Number(value) : value,
        };
        setFormdata({ ...formdata, weekdayPrice: updatedWeekdayPrice });
    };


    // ====================Weekdend Price============
    const handlePriceChangeWeekend = (e, index) => {
        const { name, value } = e.target;
        const updatedWeekendPrice = [...formdata.weekendPrice];
        console.log("updatedWeekendPrice", updatedWeekendPrice);
        updatedWeekendPrice[index] = {
            ...updatedWeekendPrice[index],
            [name]: name === "price" ? Number(value) : value,
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

    // =======event price=============

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

    const handleEventPriceChange = (e, eventIndex, timeSlotIndex) => {
        const { name, value } = e.target;
        const updatedEventPrices = [...formdata.eventPrices];

        if (name === 'date') {
            updatedEventPrices[eventIndex][name] = value;
        } else {
            updatedEventPrices[eventIndex].timeSlot[timeSlotIndex] = {
                ...updatedEventPrices[eventIndex].timeSlot[timeSlotIndex],
                [name]: name === "price" ? Number(value) : value,
            };
        }

        setFormdata({ ...formdata, eventPrices: updatedEventPrices });
    };


    const handleRemove = (index) => {
        const updatedPhotos = formdata.photos.filter((_, i) => i !== index);
        setFormdata({ ...formdata, photos: updatedPhotos });
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
                            <h1>Add Ground</h1>
                        </div>

                        <div className="addground-des">
                            <div className="add-list">
                                <label>Ground Name</label>
                                <input type='text' placeholder='Enter Ground name' name='groundname' onChange={handlechange} value={formdata.groundname} />
                            </div>

                            <div className="add-list">
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

                            <div className="add-list">
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
                                <label>Ground Start Time</label>
                                <input type="time" placeholder="Start_time" name='starttime' onChange={handlechange} value={formdata.starttime} />
                            </div>

                            <div className="add-list">
                                <label>Ground End Time</label>
                                <input type="time" name='endtime' onChange={handlechange} value={formdata.endtime} />
                            </div>
                        </div>

                        <div className="addground-des-flex">
                            <div className="add-list">
                                {formdata.weekdayPrice.map((priceEntry, index) => (
                                    <div className="add-list" key={index}>
                                        <label>Weekday Price {index + 1}</label>

                                        <div className="add-list-flex">
                                            <div className="add-list" >
                                                <p>Start Time</p>
                                                <input
                                                    type="time"
                                                    placeholder="Start time"
                                                    name="wd_starttime"
                                                    onChange={(e) => handlePriceChange(e, index)}
                                                    value={priceEntry.wd_starttime}
                                                />
                                            </div>
                                            <div className="add-list" >
                                                <p>End Time</p>
                                                <input
                                                    type="time"
                                                    name="wd_endtime"
                                                    onChange={(e) => handlePriceChange(e, index)}
                                                    value={priceEntry.wd_endtime}
                                                />
                                            </div>
                                            <div className="add-list" >
                                                <p>Price</p>
                                                <input
                                                    type="number"
                                                    name="price"
                                                    value={priceEntry.price}
                                                    placeholder="Enter price"
                                                    onChange={(e) => handlePriceChange(e, index)}
                                                />
                                            </div>
                                            {formdata.weekdayPrice.length > 1 && (
                                                <FaCircleMinus onClick={() => handleRemovePrice(index)} className='addground-icon' />
                                            )}

                                        </div>
                                    </div>
                                ))}
                                <FaCirclePlus onClick={handleAddPrice} className='addground-icon' />
                            </div>

                            <div className="add-list">
                                {formdata.weekendPrice.map((priceEntry1, index) => (
                                    <div className="add-list" key={index}>
                                        <label>Weekend Price {index + 1}</label>
                                        <div className="add-list-flex">
                                            <div className="add-list" >
                                                <p>Start Time</p>
                                                <input
                                                    type="time"
                                                    placeholder="Start time"
                                                    name="wd_starttime"
                                                    onChange={(e) => handlePriceChangeWeekend(e, index)}
                                                    value={priceEntry1.wd_starttime}
                                                />
                                            </div>
                                            <div className="add-list" >
                                                <p>End Time</p>
                                                <input
                                                    type="time"
                                                    name="wd_endtime"
                                                    onChange={(e) => handlePriceChangeWeekend(e, index)}
                                                    value={priceEntry1.wd_endtime}
                                                />
                                            </div>

                                            <div className="add-list" >
                                                <p>Price</p>                                        <input
                                                    type="number"
                                                    name="price"
                                                    placeholder="Enter price"
                                                    onChange={(e) => handlePriceChangeWeekend(e, index)}
                                                    value={priceEntry1.price}
                                                />

                                            </div>

                                            {formdata.weekendPrice.length > 1 && (
                                                <FaCircleMinus onClick={() => handleRemoveWeekendPrice(index)} className='addground-icon' />
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <FaCirclePlus onClick={handleAddWeekendPrice} className='addground-icon' />

                            </div>
                            <div className="add-list">
                                <label>Event Prices</label>
                                {formdata.eventPrices.map((event, eventIndex) => (
                                    <div key={eventIndex} className="add-list-box">

                                        <div className="add-list" >
                                            <p>Date</p>
                                            <input
                                                type="date"
                                                className="date"
                                                name="date"
                                                value={event.date}
                                                onChange={(e) => handleEventPriceChange(e, eventIndex)}
                                            />
                                        </div>
                                        {event.timeSlot.map((slot, timeSlotIndex) => (
                                            <div className="add-list-flex" key={timeSlotIndex}>

                                                <div className="add-list" >
                                                    <p>Start Time</p>
                                                    <input
                                                        type="time"
                                                        name="wd_starttime"
                                                        placeholder="Start Time"
                                                        value={slot.wd_starttime}
                                                        onChange={(e) => handleEventPriceChange(e, eventIndex, timeSlotIndex)}
                                                    />
                                                </div>
                                                <div className="add-list" >
                                                    <p>End Time</p>
                                                    <input
                                                        type="time"
                                                        name="wd_endtime"
                                                        placeholder="End Time"
                                                        value={slot.wd_endtime}
                                                        onChange={(e) => handleEventPriceChange(e, eventIndex, timeSlotIndex)}
                                                    />
                                                </div>
                                                <div className="add-list" >
                                                    <p>Price</p>
                                                    <input
                                                        type="number"
                                                        name="price"
                                                        placeholder="Enter Price"
                                                        onChange={(e) => handleEventPriceChange(e, eventIndex, timeSlotIndex)}
                                                        value={slot.price}
                                                    />
                                                </div>
                                            </div>
                                        ))}

                                        {formdata.eventPrices.length > 1 && (
                                            <FaCircleMinus onClick={() => handleRemoveEventPrice(eventIndex)} className='addground-icon' />

                                        )}
                                    </div>
                                ))}
                                <FaCirclePlus onClick={handleAddEventPrice} className='addground-icon' />
                            </div>
                        </div>

                        <div className="addground-des-flex" style={{ marginTop: '-25px' }}>

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
                                    <div>
                                        {formdata.photos.map((photo, index) => (
                                            <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
                                                <img src={photo} alt="Ground" width="100" height="100" />
                                                <div className="add-list-button-flex">
                                                    <button type="button" onClick={() => handleRemove(index)}>Remove</button>
                                                    <button type="button" onClick={() => handleChangeimage(index)}>Change</button>
                                                </div>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => fileInputRef.current.click()}>Add Photos</button>
                                    </div>
                                )}
                            </div>
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
            </div>
        </>
    );
}

export default AddGround;

