import React from 'react';
import { GlobalApi } from '../service/GlobalApi';
import { Acceptproplan, Rejectproplan, Removeproplan } from '../service/APIrouter';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router';

const Singleownersendrequest = ({ proOwners, selectedFilter, updateOwnerStatus, updateOwnerStatusremove }) => {
    const navigate = useNavigate();

    const handleAcceptClick = async () => {
        try {
            const token = localStorage.getItem('token');
            const ownerId = proOwners.ownerId?._id;

            if (!ownerId) {
                console.error('Owner ID is undefined');
                return;
            }

            const data = { ownerid: ownerId };
            console.log("id", ownerId);

            const response = await GlobalApi(Acceptproplan, 'POST', data, token);
            if (response.status === 200) {
                // notify();
                updateOwnerStatus(ownerId);
            } else {
                console.error('Failed to accept request:', response.data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleRejectClick = async () => {
        try {
            const token = localStorage.getItem('token');
            const ownerId = proOwners.ownerId?._id;

            if (!ownerId) {
                console.error('Owner ID is undefined');
                return;
            }

            const data = { ownerid: ownerId };
            console.log("id", ownerId);

            const response = await GlobalApi(Rejectproplan, 'POST', data, token);
            if (response.status === 200) {
                console.log("rejected", ownerId)
                // notify();
                updateOwnerStatus(ownerId);
            } else {
                console.error('Failed to accept request:', response.data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleRemoveClick = async () => {
        try {
            const token = localStorage.getItem('token');
            const ownerId = proOwners?._id;

            if (!ownerId) {
                console.error('Owner ID is undefined');
                return;
            }

            const data = { ownerid: ownerId };
            console.log("id", ownerId);

            const response = await GlobalApi(Removeproplan, 'POST', data, token);
            if (response.status === 200) {
                console.log("remove", ownerId);
                updateOwnerStatusremove(ownerId); // Call the function to remove the owner
            } else {
                console.error('Failed to remove request:', response.data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };



    // const notify = () => {
    //     toast.success("Request Rejected successfully");
    //     navigate('/ownersendrequest');
    // };

    return (
        <>
            {/* <ToastContainer autoClose={3000} closeOnClick /> */}
            <tr>
                <td>{proOwners.first_name}</td>
                <td>{proOwners.last_name}</td>
                <td>{proOwners.mobile}</td>
                <td>{proOwners.email}</td>
                <td>{proOwners.usertype}</td>
                {selectedFilter === 'Pending' && (
                    <td className="requestaction">
                        <button onClick={handleAcceptClick} className='reqaccept'>Accept</button>
                        <button onClick={handleRejectClick} className='reqreject'>Reject</button>
                    </td>
                )}
                {selectedFilter === 'All' && (
                    <td className="requestaction">
                        <button onClick={handleRemoveClick} className="reqremove" >Remove</button>
                    </td>
                )}
            </tr>
        </>
    );
};

export default Singleownersendrequest;
