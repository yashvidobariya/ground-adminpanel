import React, { useState } from 'react';
import { CgMoreVerticalO } from 'react-icons/cg';
import { Link } from 'react-router-dom';
import { GlobalApi } from '../service/GlobalApi';
import { Acceptbookingrequest, Rejectbooingrequest } from '../service/APIrouter';

const Singlebooking = ({ booking }) => {

    const [userdata, setuserdata] = useState(booking);

    const handleApprove = async () => {
        console.log("accept");

        const data = {
            status: "Accepted",
            bookingid: booking._id,
        };

        try {
            const token = localStorage.getItem('token');
            const response = await GlobalApi(Acceptbookingrequest, 'POST', data, token);
            console.log("data", response);
            if (response.status === 200) {
                setuserdata(prevData => ({
                    ...prevData,
                    status: "Accepted"
                }));
                // window.location.reload();
            } else {
                console.error("user not fetch", response.data)
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    const handleReject = async () => {
        console.log("rejected");

        const data = {
            status: "Rejected",
            bookingid: booking._id,
        };

        try {
            const token = localStorage.getItem('token');
            const response = await GlobalApi(Rejectbooingrequest, 'POST', data, token);
            console.log("data", userdata);
            if (response.status === 200) {
                setuserdata(prevData => ({
                    ...prevData,
                    status: "Rejected"
                }));
                // window.location.reload();
            } else {
                console.error("user not fetch", response.data)
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <tr key={userdata._id} className='user-row'>
                <td>
                    <img
                        className="user-profile-image"
                        src={"/image/avatar.png"}
                        alt=""
                    />
                    <span>{userdata.bookedby && userdata.bookedby.first_name ? `${userdata.bookedby.first_name} ${userdata.bookedby.last_name}` : "-"}</span>
                </td>

                <td className='user-div'>{userdata.groundid?.groundname ? userdata.groundid.groundname : "-"}</td>
                <td className='user-div'>
                    <Link to={`/bookings/Bookingdetails/${userdata._id}`} >
                        <CgMoreVerticalO className='info-icon' />
                    </Link>

                </td>
                <td className="approved-reject-btn">
                    {userdata.status === "Accepted" || userdata.status === "Rejected" ? (
                        <button className={userdata.status === "Accepted" ? "accepted-btn" : "rejected-btn"}>
                            {userdata.status === "Accepted" ? "Accepted" : "Rejected"}
                        </button>
                    ) : (
                        <>
                            <button className="approved-btn" onClick={() => handleApprove(userdata)}>
                                Accept
                            </button>
                            <button className="reject-btn" onClick={() => handleReject(userdata)} >
                                Reject
                            </button>
                        </>
                    )}
                </td>

                <td className='user-div'>
                    {userdata.createdat.slice(0, 10)}{" "}
                </td>
                <td className='user-div'>
                    {userdata.starttime?.slice(11, 19)}{" "}
                </td>
                <td className='user-div'>
                    {userdata.endtime?.slice(11, 19)}{" "}
                </td>
                <td>
                </td>
            </tr>
        </>
    );
}

export default Singlebooking;







