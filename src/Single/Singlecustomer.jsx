import React from 'react'
import { useNavigate } from 'react-router-dom';
import { CgMoreVerticalO } from 'react-icons/cg';
import { GlobalApi } from '../service/GlobalApi';
import { UpdateTicketStatus } from '../service/APIrouter';

const Singlecustomer = ({ ticket }) => {
    const navigate = useNavigate();

    const handlecustmoredetails = async (ticketId) => {
        navigate(`/customer/customerdetails/${ticketId}`);
    }

    // const handleStatusChange = async (ticketId, currentStatus) => {
    //     const newstatus = currentStatus === 'Pending' ? 'Resolve' : 'Pending';
    //     console.log("newstatus", newstatus);

    //     try {
    //         const token = localStorage.getItem("token");
    //         await GlobalApi(UpdateTicketStatus, 'POST', { ticketId, status: newstatus }, token);
    //     } catch (error) {
    //         console.error('Error updating ticket status', error);
    //     }
    // };

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
                <td className='user-div'>USA</td>
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
                    {ticket.createdat?.slice(1, 10)}{" "}
                </td>
            </tr >
        </>
    )
}

export default Singlecustomer
