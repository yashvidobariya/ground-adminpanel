import React, { useEffect, useRef, useState } from 'react'
import Sidebar from '../Component/Sidebar'
import { GlobalApi } from '../service/GlobalApi';
import { Admingetticketdetails } from '../service/APIrouter';
import { useParams } from 'react-router';
import JoditEditor from 'jodit-react';

const Custmoredetails = () => {
    const [ticketdetails, setticketdetails] = useState([]);
    const [errormessage, seterrormessage] = useState("");
    const [loading, setloading] = useState(true);
    const { ticketId } = useParams();
    console.log("ticket", ticketId);
    const editor = useRef(null);
    const [content, setcontent] = useState('');
    useEffect(() => {
        const fetchdata = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await GlobalApi(`${Admingetticketdetails}/${ticketId}`, 'POST', null, token);

                if (response.status === 200) {
                    setticketdetails(response.data.ticketDetails);
                    console.log("ticketdata", response.data.ticketDetails);
                } else if (response.status === 401) {
                    seterrormessage("Authentication error. Please login as an Admin.");
                    localStorage.removeItem('token');
                    localStorage.removeItem('userdata');
                }
            } catch (error) {
                console.error('Error:', error);
                seterrormessage("An error occurred while fetching data.");
            } finally {
                setloading(false);
            }
        };
        fetchdata();
    }, [])

    return (
        <div>
            <Sidebar />
            <div className="customer-ticket-details">
                <div className="customer-div">
                    <div className="ticket-title">
                        <p> Support Tickets</p>
                    </div>
                    <div className="customerdetails-ticket">
                        <div className="custmoredetails-title">
                            <h5>Name</h5>
                            <p>{ticketdetails.name}</p>
                        </div>


                        <div className="custmoredetails-title">
                            <h5>description</h5>
                            <p>{ticketdetails.discription}</p>
                        </div>

                        <div className="custmoredetails-title">
                            <h5>Create Date</h5>
                            <p>{ticketdetails.createdat?.slice(11, 19)}</p>
                        </div>

                        <JoditEditor ref={editor}
                            value={content}
                            onChange={newContent => { setcontent(newContent) }}
                            className='text-editor'
                        />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Custmoredetails
