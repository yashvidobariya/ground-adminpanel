import React, { useEffect, useRef, useState } from 'react'
import Sidebar from '../Component/Sidebar'
import { GlobalApi } from '../service/GlobalApi';
import { Admingetticketdetails, Adminresolvedtime, Adminresponsetime } from '../service/APIrouter';
import { useParams } from 'react-router';
import JoditEditor from 'jodit-react';
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const Custmoredetails = () => {
    const [ticketdetails, setticketdetails] = useState([]);
    const [errormessage, seterrormessage] = useState("");
    const [loading, setloading] = useState(true);
    const { ticketId } = useParams();
    const editor = useRef(null);
    const [content, setcontent] = useState('');
    const [responsetime, setresponsetime] = useState({});
    const [resolvetime, setresolvetime] = useState({});
    const navigate = useNavigate();

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


    const handleresponsetime = async (userid) => {
        try {
            const token = localStorage.getItem("token");
            const strippedContent = content.replace(/<p>/g, '').replace(/<\/p>/g, '');
            const data = { id: userid, response: strippedContent };
            console.log("Data sent to API:", data);
            const response = await GlobalApi(Adminresponsetime, 'POST', data, token);
            console.log("API Response:", response);

            if (response.status === 200) {
                setresponsetime(prevState => ({
                    ...prevState,
                    [userid]: response.data
                }));
                console.log("Time data:", response.data);
            } else {
                console.error('Failed to fetch response time', response);
            }
        } catch (error) {
            console.error('Error fetching time data', error);
        }
    };



    const hanleresolvetime = async (userid) => {
        try {
            const token = localStorage.getItem("token");
            const data = { id: userid };
            console.log("Data sent to API:", data);
            const response = await GlobalApi(Adminresolvedtime, 'POST', data, token);
            console.log("API Response:", response);

            if (response.status === 200) {
                setresolvetime(prevState => ({
                    ...prevState,
                    [userid]: response.data
                }));
                console.log("Time data:", response.data);
            } else {
                console.error('Failed to fetch response time', response);
            }
        } catch (error) {
            console.error('Error fetching time data', error);
        }
    };


    const handleBackClick = () => {
        navigate(-1);
    };
    return (
        <div>
            <Sidebar />
            <div >
                <IoArrowBackCircleSharp className="back-ticket" onClick={handleBackClick} />
            </div>
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
                            <p>{ticketdetails.createdat}</p>
                        </div>

                        <div className="custmoredetails-title">
                            <h5>Resolve Time </h5>
                            <p>{ticketdetails.resolvetime}</p>
                        </div>

                        <div className="custmoredetails-title">
                            <h5>Response time</h5>
                            <p>{ticketdetails.responsetime}</p>
                        </div>

                        <JoditEditor ref={editor}
                            value={content}
                            onChange={newContent => { setcontent(newContent) }}
                            className='text-editor'
                        />
                    </div>
                    <div className="ticket-button">
                        <button className='resolve-button' onClick={() => hanleresolvetime(ticketdetails._id)} >Resolve</button>
                        <button className='response-button' onClick={() => handleresponsetime(ticketdetails._id)}>Response</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Custmoredetails
