import React, { useEffect, useState } from 'react'
import Sidebar from '../Component/Sidebar'
import { GlobalApi } from '../service/GlobalApi';
import { Faqs } from '../service/APIrouter';
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { useNavigate } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import { MdOutlineEditNote } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { CgMoreVerticalO } from 'react-icons/cg';
import loadingdata from '../Data/Playturf.json'
import Lottie from 'lottie-react';

const Faq = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setloading] = useState(true);
    const [errormessage, seterrormessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [createfaqs, setcreatefaqs] = useState({
        question: '',
        answer: ''
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await GlobalApi(Faqs, 'GET', null, token);

                if (response.status === 401) {
                    seterrormessage('Authentication error, please login again.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('userdata');
                } else if (Array.isArray(response.data)) {
                    setFaqs(response.data);
                    console.log("data", response.data)
                } else {
                    console.error('User data not fetched', response.data.coupon);
                }
            } catch (error) {
                console.error('Error fetching data', error);
            } finally {
                setloading(false);
            }
        };
        fetchData();
    }, []);

    const toggleFAQ = (index) => {
        setFaqs(faqs.map((faq, i) => {
            if (i === index) {
                return { ...faq, isOpen: !faq.isOpen };
            } else {
                return faq;
            }
        }));
    };

    const handleCreatefaqs = () => {
        setShowPopup(true);
        document.body.classList.add('popup-open');
    }

    const handleClosePopup = () => {
        setShowPopup(false);
        document.body.classList.remove('popup-open');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setcreatefaqs({ ...createfaqs, [name]: value });
    };


    const handlesubmitfaqs = async () => {
        const token = localStorage.getItem("token");
        const data = { ...createfaqs };
        console.log("data", data);

        try {
            const response = await GlobalApi(Faqs, 'POST', data, token);
            if (response.status === 201) {
                notify();
                console.log("FAQ created successfully", response.data);
                setFaqs([...faqs, response.data]);
            } else {
                toast.error(`Error: ${response.status}`);
            }
        } catch (error) {
            toast.error('Failed to create coupon. Please try again.');
        } finally {
            setcreatefaqs({
                question: '',
                answer: ''
            })
            handleClosePopup();
        }
    }

    const notify = () => {
        toast.success("Coupon added successfully");
    };

    const handleeditfaqs = () => {
        alert("sdfs");
    }
    const handledeletefaqs = () => {
        alert("sdfs");
    }

    return (
        <>
            <ToastContainer autoClose={3000} closeOnClick />
            <Sidebar />

            {loading ? (
                <div className="loader">
                    <div className="loading-icon">
                        <Lottie animationData={loadingdata} />
                    </div>
                </div>
            ) : (

                <div className="faq-container">
                    <div className="faq-question-title">
                        <h2>Frequently Asked Questions</h2>
                        <div className="add-faqs">
                            <button onClick={handleCreatefaqs}>Add</button>
                        </div>
                    </div>

                    <div className="faqs">
                        {faqs.map((faq, index) => (
                            <div key={index} className={`faq ${faq.isOpen ? "open" : ""}`}>
                                <div className="faq-header">
                                    <div className="faq-question">
                                        {faq.question}
                                        <Link to={`/faqs/faqsdetails/${faq._id}`} >
                                            <CgMoreVerticalO className='info-icon-faq' />
                                        </Link>
                                    </div>


                                    <div className="open-answer-faqs" onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFAQ(index);
                                    }}>
                                        {faq.isOpen ? <IoMdClose className="icon-add" /> : <IoMdAdd />}
                                    </div>

                                    <div onClick={(e) => {
                                        e.stopPropagation();
                                        handleeditfaqs(faq);
                                    }}>
                                        <MdOutlineEditNote className="edit-faqs" />
                                    </div>

                                    <div onClick={(e) => {
                                        e.stopPropagation();
                                        handledeletefaqs(faq.id);
                                    }}>
                                        <RiDeleteBin6Fill className='delete-faqs' />
                                    </div>
                                </div>


                                {faq.isOpen && (
                                    <div className="faq-answer">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>


                    {showPopup && (
                        <div className="popup">
                            <div className="popup-content-faqs">
                                <h2>Create FAQS</h2>
                                <div>
                                    <label>Question</label>
                                    <input
                                        type="text"
                                        name="question"
                                        value={createfaqs.question}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div>
                                    <label>Answer</label>
                                    <input
                                        type="text"
                                        name="answer"
                                        value={createfaqs.answer}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <button onClick={handlesubmitfaqs}>Submit Coupon</button>
                                <button onClick={handleClosePopup}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};


export default Faq
