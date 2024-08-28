import React, { useEffect, useRef, useState } from 'react';
import Sidebar from '../Component/Sidebar';
import { GlobalApi } from '../service/GlobalApi';
import { Adminaddground, ShowOwnersAPI } from '../service/APIrouter';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import Select from 'react-select';
import { IoIosClose } from "react-icons/io";

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
        mobile: '',
        price: [
            { weekday: '', start_time: '', end_time: '', price: '' },
            { date: '', start_time: '', end_time: '', price: '' }
        ],
        baseprice: ''
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
        const updatedPrices = formdata.price.map((priceEntry, i) => {
            if (index === i) {
                return { ...priceEntry, [name]: value };
            }
            return priceEntry;
        });

        setFormdata(prevFormdata => ({
            ...prevFormdata,
            price: updatedPrices
        }));
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
            }

            console.log("Response Status:", response.status);
            console.log("Response Data:", responsedata);

            if (response.status === 201) {
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
        toast.success("Ground added successfully");
        navigate("/venue");
    };

    return (
        <>
            <ToastContainer autoClose={3000} closeOnClick />
            <Sidebar />
            <div className="addground-main">
                <div className="addground-list">
                    <div className="addground-title">
                        <h1>Add Ground</h1>
                    </div>

                    <div className="addground-des">
                        <div className="add-list-full">
                            <label>Owner Name</label>
                            <input type='text' placeholder='Enter Owner name' name='ownername' onChange={handlechange} value={formdata.ownername} />
                        </div>

                        <div className="add-list-full">
                            <label>Ground Name</label>
                            <input type='text' placeholder='Enter Ground name' name='groundname' onChange={handlechange} value={formdata.groundname} />
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

                        <div className="add-list">
                            <label htmlFor="state">Country</label>
                            <select id="state" name="country" onChange={handlechange} value={formdata.country}>
                                <option value="" disabled>Select a country</option>
                                <option value="India">India</option>
                                <option value="USA">USA</option>
                                <option value="Canada">Canada</option>
                            </select>
                        </div>

                        <div className="add-list1">
                            <label htmlFor="mobile">Mobile Number</label>
                            <Select
                                id="mobile"
                                name="mobile"
                                value={selectedOption}
                                onChange={handleChange}
                                options={contacts}
                                placeholder="Select a Contact"
                            ></Select>
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

                    </div>

                    <div className="addground-des-price">
                        {formdata.price.map((priceEntry, index) => (
                            <div className="add-list" key={index}>
                                <label>{index === 0 ? "Price Entry 1" : "Price Entry 2"}</label>
                                <div className="add-list-flex">
                                    <input type="number" name='price' onChange={(e) => handlePriceChange(e, index)} value={priceEntry.price} />
                                    {index === 0 && (
                                        <select name='weekday' onChange={(e) => handlePriceChange(e, index)} value={priceEntry.weekday}>
                                            <option value=''>Select Weekday</option>
                                            <option value='Sunday'>Sunday</option>
                                            <option value='Monday'>Monday</option>
                                            <option value='Tuesday'>Tuesday</option>
                                            <option value='Wednesday'>Wednesday</option>
                                            <option value='Thursday'>Thursday</option>
                                            <option value='Friday'>Friday</option>
                                            <option value='Saturday'>Saturday</option>
                                        </select>
                                    )}
                                    {index === 1 && (
                                        <>
                                            <input type="date" name='date' onChange={(e) => handlePriceChange(e, index)} value={priceEntry.date} />
                                        </>
                                    )}
                                    <input type="time" placeholder="Start_time" name='start_time' onChange={(e) => handlePriceChange(e, index)} value={priceEntry.start_time} />
                                    <input type="time" name='end_time' onChange={(e) => handlePriceChange(e, index)} value={priceEntry.end_time} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="addground-submit">
                        <button onClick={handleSubmit} disabled={loading} className='ground-update'>
                            {loading ? "Adding..." : "Add Ground"}
                        </button>
                    </div>
                </div>
            </div >
        </>
    );
}

export default AddGround;
