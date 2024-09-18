import React from 'react';
import { GlobalApi } from '../service/GlobalApi';
import { AcceptPendingRequest, Acceptproplan } from '../service/APIrouter';

const Singleownersendrequest = ({ proOwners, selectedFilter }) => {
    const handleAcceptClick = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await GlobalApi(Acceptproplan, 'POST', { id: proOwners._id }, token);
            if (response.status === 200) {

                alert('Request accepted successfully');
            } else {
                console.error('Failed to accept request:', response.data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <tr>
            <td>{proOwners.first_name}</td>
            <td>{proOwners.last_name}</td>
            <td>{proOwners.mobile}</td>
            <td>{proOwners.email}</td>
            <td>{proOwners.usertype}</td>
            {selectedFilter === 'Pending' && (
                <td className="requestaction">
                    <button onClick={handleAcceptClick} className='reqaccept'>Accept</button>
                    <button className='reqreject' onClick={handleAcceptClick}>Reject</button>
                </td>
            )}
        </tr>
    );
};

export default Singleownersendrequest;
