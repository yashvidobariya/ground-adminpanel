import React, { useEffect, useState } from 'react'
import Sidebar from '../Component/Sidebar'
import { useNavigate, useParams } from 'react-router'
import { Admineditowners, getUserAPI } from '../service/APIrouter'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GlobalApi } from '../service/GlobalApi'
import loadingdata from '../Data/Playturf.json'
import Lottie from 'lottie-react'

const SingleeditOwner = () => {
    const [userData, setUserData] = useState(null);
    const { userId } = useParams();
    const navigate = useNavigate();
    const [loading, setloading] = useState(true);

    const [formdata, setformdata] = useState({
        first_name: '',
        last_name: '',
        mobile: '',
        email: '',
        usertype: '',
        status: '',
    });


    const handlechange = (e) => {
        setformdata({ ...formdata, [e.target.name]: e.target.value });
    }

    const handlesubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await GlobalApi(`${Admineditowners}/${userId}`, 'POST', formdata, token);
            console.log("edit response", response);
            if (response.status === 200) {
                notify();
                console.log(formdata);
            } else {
                console.error('failed');
            }
        } catch (error) {
            console.error("Error updating user data", error);
        }
    };


    const handlecancle = () => {
        navigate("/owners");
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await GlobalApi(`${getUserAPI}/${userId}`, 'GET', null, token);

                if (response.status === 200) {
                    const data = response.data;
                    console.log("response", response);
                    setUserData(data);
                    setformdata({
                        first_name: data?.first_name || '-',
                        last_name: data?.last_name || '-',
                        mobile: data?.mobile || '-',
                        email: data?.email || '-',
                        usertype: data?.usertype || '-',
                        status: data?.status || 'Inactive',
                    })
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
            onClose: () => navigate("/owners")
        });
    }

    return (
        <div>
            <Sidebar />
            <ToastContainer autoClose={1000} closeOnClick />

            {loading ? (
                <div className="loader">
                    <div className="loading-icon">
                        <Lottie animationData={loadingdata} />
                    </div>
                </div>
            ) : (
                <form onSubmit={handlesubmit}>
                    <div className="form-edit">
                        <div className="edit-div">
                            <h1>Edit Owner Data</h1>
                            <p>{userData?.first_name || '-'} {userData?.last_name || '-'}</p>

                            <div className="edit-flex">

                                <div className="edit-name">

                                    <div className="label">
                                        <div className="label-edit">
                                            <label>First Name</label>
                                        </div>

                                        <div className="label-edit">
                                            <input
                                                type="text"
                                                name="first_name"
                                                defaultValue={userData?.first_name || '-'}
                                                onChange={handlechange}
                                            />
                                        </div>

                                    </div>


                                    <div className="label">
                                        <div className="label-edit">
                                            <label>Last Name</label>
                                        </div>

                                        <div className="label-edit">
                                            <input
                                                type="text"
                                                name="last_name"
                                                defaultValue={userData?.last_name || '-'} onChange={handlechange}
                                            />
                                        </div>

                                    </div>
                                </div>


                                <div className="edit-name">

                                    <div className="label">
                                        <div className="label-edit-number">
                                            <label>Mobile Number</label>
                                        </div>

                                        <div className="label-edit-number">
                                            <input
                                                type="tel"
                                                name="mobile"
                                                defaultValue={userData?.mobile || '-'}
                                                onChange={handlechange}
                                            />
                                        </div>

                                    </div>
                                </div>


                                <div className="edit-name">

                                    <div className="label">
                                        <div className="label-edit-number">
                                            <label>Email</label>
                                        </div>

                                        <div className="label-edit-number">

                                            <input
                                                type="text"
                                                name="email"
                                                defaultValue={userData?.email || '-'}
                                                onChange={handlechange}
                                            />

                                        </div>

                                    </div>

                                </div>

                                <div className="edit-name">

                                    <div className="label">
                                        <div className="label-edit">
                                            <label>UserType</label>
                                        </div>

                                        <div className="label-edit">
                                            <select name="usertype" id="usertype" defaultValue={userData?.usertype || ''} onChange={handlechange} >
                                                <option value="user">user</option>
                                                <option value="owner">owner</option>
                                            </select>
                                        </div>

                                    </div>



                                    <div className="label">
                                        <div className="label-edit">
                                            <label>Status</label>
                                        </div>

                                        <div className="label-edit">
                                            <select name="status" id="status" defaultValue={userData?.status || 'Inactive'} onChange={handlechange}>
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        </div>

                                    </div>
                                </div>


                                <div className="form-button">
                                    <div className="block-edit">
                                        <button>Block User</button>
                                    </div>

                                    <div className="action-edit">
                                        <div className="cancel-edit">
                                            <button onClick={handlecancle}>Cancle</button>
                                        </div>
                                        <div className="change-action">
                                            <button onClick={handlesubmit}> Update</button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </form>
            )}
        </div>
    )
}

export default SingleeditOwner










