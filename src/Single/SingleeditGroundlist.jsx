import React, { useEffect, useRef, useState } from 'react'
import Sidebar from '../Component/Sidebar'
import { GlobalApi } from '../service/GlobalApi';
import { Admineditground, Getoneground } from '../service/APIrouter';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router';
import Lottie from 'lottie-react';
import loadingdata from '../Data/Playturf.json'

const SingleeditGroundlist = () => {
    const [oldPhotos, setOldPhotos] = useState([]);
    const [newPhotos, setNewPhotos] = useState([]);
    const [userData, setUserData] = useState(null);
    const [loading, setloading] = useState(true);
    const navigate = useNavigate();
    const { userId } = useParams();
    const fileInputRef = useRef(null);
    const [photoIndexToChange, setPhotoIndexToChange] = useState(null);
    const [formdata, setformdata] = useState({
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
        price: [
            { weekday: '', start_time: '', end_time: '', price: '' },
            { date: '', start_time: '', end_time: '', price: '' }
        ]
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

    const handlePriceChange = (e, index) => {
        const { name, value } = e.target;
        const updatedPrices = formdata.price.map((priceEntry, i) => {
            if (index === i) {
                return { ...priceEntry, [name]: value };
            }
            return priceEntry;
        });

        setformdata(prevFormdata => ({
            ...prevFormdata,
            price: updatedPrices
        }));
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
                    setOldPhotos(data?.ground.photos || []);
                    setformdata({
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
                        price: data?.ground.price || [
                            { weekday: '', start_time: '', end_time: '', price: '' },
                            { date: '', start_time: '', end_time: '', price: '' }
                        ],
                    });
                    console.log("response", response);
                    setUserData(data);

                    console.log("data", data);
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

    return (
        <>
            <Sidebar />
            <ToastContainer autoClose={1000} closeOnClick />
            {loading ? (
                <div className="loader">
                    <div className="loading-icon">
                        <Lottie animationData={loadingdata} />
                    </div>
                </div>
            ) : (
                <div className="addground-main">
                    <div className="addground-list">
                        <div className="addground-title">
                            <h1>Edit Ground</h1>
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
                                <label htmlFor="state">State</label>
                                <input type='text' placeholder='Enter state' name='state' onChange={handlechange} value={formdata.state} />
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

                        </div>

                        <div className="addground-des">
                            <div className="add-list-full">
                                <label>Description</label>
                                <textarea rows="3" cols="30" placeholder='Enter description' name='description' onChange={handlechange} value={formdata.description} />
                            </div>

                            <div className="add-list-full">
                                <label>Rules And Regulation</label>
                                <textarea rows="3" cols="30" placeholder='Enter Rules and Regulation' name='rulesandregulation' onChange={handlechange} value={formdata.rulesandregulation || '-'} />
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
                                <label>Location</label>
                                <input type='text' placeholder='Enter location' name='location' onChange={handlechange} value={formdata.location} />
                            </div>
                        </div>

                        <div className="addground-des-price">
                            {formdata.price.map((priceEntry, index) => (
                                <div className="add-list" key={index}>
                                    <label>{index === 0 ? "Price Entry 1" : "Price Entry 2"}</label>
                                    <div className="add-list-flex">
                                        <input type="number" name='price' onChange={(e) => handlePriceChange(e, index)} value={priceEntry.price} />
                                        {index === 0 && (
                                            <input type="text" name='weekday' onChange={(e) => handlePriceChange(e, index)} value={priceEntry.weekday} />
                                        )}
                                        {index === 1 && (
                                            <>
                                                <input type="date" name='date' onChange={(e) => handlePriceChange(e, index)} value={priceEntry.date} />
                                            </>
                                        )}
                                        <input type="time" name='start_time' onChange={(e) => handlePriceChange(e, index)} value={priceEntry.start_time} />
                                        <input type="time" name='end_time' onChange={(e) => handlePriceChange(e, index)} value={priceEntry.end_time} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="addground-submit">
                            <button onClick={handlesubmit} className='ground-update'>Update</button>
                            <button onClick={handlecancel} className='addground-cancel'>Cancel</button>
                        </div>
                    </div>
                </div >
            )}
        </>
    );
}

export default SingleeditGroundlist;
