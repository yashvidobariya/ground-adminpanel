import React from 'react'
import { useNavigate } from 'react-router-dom';

const Singlecustomer = ({ ticket }) => {
    const navigate = useNavigate();

    const handleStatusChange = async (ticketId) => {
        navigate(`/customer/customerdetails/${ticketId}`);
    }

    return (
        <>
            <tr key={ticket._id} className='user-row'>
                <td>
                    <img
                        className="user-profile-image"
                        src={"/image/avatar.png"}
                        alt=""
                    />
                    <span>{ticket.name}</span>
                </td>
                {/* <td className='user-div'>USA</td> */}
                <td className='user-div'>{ticket.mobile_no ? ticket.mobile_no : "-"}</td>
                <td className='user-div'>
                    {ticket.subject} &nbsp;
                    {/* <CgMoreVerticalO className='info-icon' onClick={() => handlecustmoredetails(ticket._id)} /> */}
                </td>
                <td className='user-div'>
                    <button
                        className={
                            ticket.status === "Resolved"
                                ? "status-button green-button"
                                : "status-button red-button"
                        }
                        onClick={() => {
                            if (ticket.status === "Pending") {
                                handleStatusChange(ticket._id, "Resolved");
                            }
                        }
                        }
                    >
                        {ticket.status === "Pending" ? "Pending" : "Resolve"}
                    </button>
                </td>
                <td className='user-div'>
                    {ticket.createdat?.slice(1, 27)}{" "}
                </td>
            </tr >
        </>
    )
}

export default Singlecustomer
