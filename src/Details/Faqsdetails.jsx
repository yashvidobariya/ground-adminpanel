import React, { useEffect, useState } from 'react'
import Sidebar from '../Component/Sidebar'
import { useParams } from 'react-router';
import { GlobalApi } from '../service/GlobalApi';
import { Faqs } from '../service/APIrouter';
import Lottie from 'lottie-react';
import loadingdata from '../Data/Playturf.json'
import { IoArrowBackCircle } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const Faqsdetails = () => {
    const { faqid } = useParams();
    const [faqDetails, setFaqDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFaqDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await GlobalApi(`${Faqs}/${faqid}`, 'GET', null, token);

                if (response.status === 200) {
                    setFaqDetails(response.data);
                    console.log("response", response.data)
                } else if (response.status === 401) {
                    setErrorMessage('Authentication error, please login again.');
                    localStorage.removeItem('token');
                } else {
                    setErrorMessage('Failed to fetch FAQ details.');
                }
            } catch (error) {
                setErrorMessage('Error fetching FAQ details.');
            } finally {
                setLoading(false);
            }
        };

        fetchFaqDetails();
    }, [faqid]);


    if (errorMessage) {
        return <div>{errorMessage}</div>;
    }
    const handleBackClick = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
        <div>
            <Sidebar />


            {loading ? (
                <div className="loader">
                    <div className="loading-icon">
                        <Lottie animationData={loadingdata} />
                    </div>
                </div>
            ) : (
                faqDetails && (
                    <>
                        <div className='back-faqsdetails' onClick={handleBackClick}>
                            <IoArrowBackCircle />
                        </div>
                        <div className="single-faq-details">
                            <div className="faqs-div">

                                <div className="faq-question-details">

                                    <div className="faqsdetails-title">
                                        <h2>FAQs Details</h2>
                                        <p>{faqDetails.createdat.slice(0, 10)}</p>
                                    </div>

                                    <h3>Question: {faqDetails.question}</h3>
                                    <p>Answer: {faqDetails.answer}</p>
                                </div>
                            </div>
                        </div >
                    </>
                )
            )
            }
        </div>

    )
}

export default Faqsdetails
