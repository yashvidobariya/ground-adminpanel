import React, { useEffect, useState } from 'react'
import Sidebar from '../Component/Sidebar'
import { useParams } from 'react-router';
import { GlobalApi } from '../service/GlobalApi';
import { Faqs } from '../service/APIrouter';
import Lottie from 'lottie-react';
import loadingdata from '../Data/Playturf.json'

const Singlefaqsdetails = () => {
    const { faqid } = useParams();
    const [faqDetails, setFaqDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

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


    return (
        <div>
            <Sidebar />
            <div className="single-faq-details">

                {loading ? (
                    <div className="loader">
                        <div className="loading-icon">
                            <Lottie animationData={loadingdata} />
                        </div>
                    </div>
                ) : (
                    faqDetails && (
                        <>
                            <h2>FAQ Details</h2>
                            <h3>Question: {faqDetails.question}</h3>
                            <p>Answer: {faqDetails.answer}</p>
                        </>
                    )
                )
                }
            </div>
        </div>
    )
}

export default Singlefaqsdetails
