import React, { useState } from 'react'
import { GlobalApi } from '../service/GlobalApi';
import { VerifiedGroundAPI } from '../service/APIrouter';
import { CgMoreVerticalO } from 'react-icons/cg';

const Singlenotification = ({ notification }) => {
    const [userdata, setuserdata] = useState(null);


    const handleApprove = async (notification) => {
        console.log(notification);
        const data = {
            status: "approved",
            ground: notification.data.ground._id,
            owner: notification.data.sender._id,
            _id: notification._id,
        };

        try {
            const token = localStorage.getItem("token");
            const response = await GlobalApi(VerifiedGroundAPI, 'POST', data, token);
            console.log("data", response);
            if (response.status === 200) {
                // window.location.reload();
            }

            if (Array.isArray(response.data.notifications)) {
                setuserdata(response.data.notifications);
                console.log("data", userdata)
            } else {
                console.error("user not fetch", response.data)
            }
        }

        catch (error) {
            console.error(error);
        }

    };

    const handleReject = async (notification) => {
        console.log(notification);
        const data = {
            status: "rejected",
            ground: notification.data.ground._id,
            owner: notification.data.sender._id,
            _id: notification._id,
        };

        try {
            const token = localStorage.getItem("token");
            const response = await GlobalApi(VerifiedGroundAPI, 'POST', data, token);
            console.log(response);

            if (response.status === 200) {
                // window.location.reload();
            }
            if (Array.isArray(response.data.notifications)) {
                setuserdata(response.data.notifications);
            } else {
                console.error("user not fetch", response.data)
            }
        }

        catch (error) {
            console.error(error);
        }

    };

    return (
        <>
            <tr key={notification._id}>
                <td>
                    <img
                        className="user-profile-image"
                        src="/image/avatar.png"
                        alt="kari"
                    />
                    <span>

                        {notification.data.message} <CgMoreVerticalO className="info-icon" />
                    </span>
                </td>
                {!notification.data.ground ? (
                    <td className="approved-reject-btn"></td>
                ) : (
                    <td className="approved-reject-btn">
                        {notification.status === "approved" ||
                            notification.status === "rejected" ? (
                            <button className="approved-btn">
                                {notification.status === "approved" ? "Approved" : "Rejected"}
                            </button>
                        ) : (
                            <>
                                <button className="approved-btn" onClick={() => handleApprove(notification)}>
                                    Approve
                                </button>
                                <button className="reject-btn" onClick={() => handleReject(notification)}>
                                    Reject
                                </button>
                            </>
                        )}
                    </td>
                )}
            </tr>
        </>
    )
}

export default Singlenotification