import React, { useEffect, useState } from 'react'
import Sidebar from '../Component/Sidebar'
import { GlobalApi } from '../service/GlobalApi';
import { Faqs } from '../service/APIrouter';
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { toast, ToastContainer } from 'react-toastify';
import { MdOutlineEditNote } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { CgMoreVerticalO } from 'react-icons/cg';
import loadingdata from '../Data/Playturf.json'
import Lottie from 'lottie-react';

const Faq = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [Errormessage, setErrormessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [editFaq, setEditFaq] = useState(null);
    const [createFaqs, setCreateFaqs] = useState({ question: '', answer: '' });
    const [refresh, setRefresh] = useState(false);

    const toggleFAQ = (index) => {
        setFaqs(faqs.map((faq, i) => {
            if (i === index) {
                return { ...faq, isOpen: !faq.isOpen };
            } else {
                return faq;
            }
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await GlobalApi(Faqs, 'GET', null, token);

                if (response.status === 401) {
                    setErrormessage('Authentication error, please login again.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('userdata');
                } else if (Array.isArray(response.data)) {
                    setFaqs(response.data.map(faq => ({ ...faq, isOpen: false })));
                } else {
                    console.error('FAQ data not fetched', response.data);
                }
            } catch (error) {
                console.error('Error fetching data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [refresh]);

    const handleCreateFaqs = () => {
        setEditFaq(null);
        setCreateFaqs({ question: '', answer: '' });
        setShowPopup(true);
        document.body.classList.add('popup-open');
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        document.body.classList.remove('popup-open');
    };

    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setCreateFaqs({ ...createFaqs, [name]: value });
    // };


    const handleSubmitFaqs = async () => {
        const token = localStorage.getItem("token");
        const data = { ...createFaqs };

        try {
            const response = await GlobalApi(Faqs, 'POST', data, token);
            if (response.status === 201) {
                toast.success("FAQ created successfully");
                setCreateFaqs({ question: '', answer: '' });
                setRefresh(!refresh);
            } else {
                toast.error(`Error: ${response.status}`);
            }
        } catch (error) {
            toast.error('Failed to create FAQ. Please try again.');
        } finally {
            handleClosePopup();
        }
    };

    // const notify = () => {
    //     toast.success("Coupon added successfully");
    // };

    const handleEditFaqs = (faq) => {
        setEditFaq(faq);
        setShowPopup(true);
        document.body.classList.add('popup-open');
    };


    const handleDeleteFaqs = async (faqid) => {
        try {
            const token = localStorage.getItem("token");
            const response = await GlobalApi(`${Faqs}/${faqid}`, 'DELETE', null, token);
            if (response.status === 200) {
                toast.success("FAQ deleted successfully");
                setRefresh(!refresh);
            } else {
                toast.error(`Error deleting FAQ: ${response.status}`);
            }
        } catch (error) {
            toast.error('Failed to delete FAQ. Please try again.');
        }
    };

    const handleEditSubmit = async () => {
        const token = localStorage.getItem("token");
        const data = { ...editFaq };

        try {
            const response = await GlobalApi(`${Faqs}/${data._id}`, 'POST', data, token);
            if (response.status === 200) {
                toast.success("FAQ updated successfully");
                setRefresh(!refresh);
                handleClosePopup();
            } else {
                toast.error(`Error updating FAQ: ${response.status}`);
            }
        } catch (error) {
            toast.error('Failed to update FAQ. Please try again.');
        }
    };

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
                            <button onClick={handleCreateFaqs}>Add</button>
                        </div>
                    </div>

                    <div className="faqs">
                        {faqs.map((faq, index) => (
                            <div key={faq._id} className={`faq ${faq.isOpen ? "open" : ""}`}>
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
                                        handleEditFaqs(faq);
                                    }}>
                                        <MdOutlineEditNote className="edit-faqs" />
                                    </div>


                                    <div onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteFaqs(faq._id);
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
                                <h2>{editFaq ? "Edit FAQ" : "Create FAQ"}</h2>
                                <div>
                                    <label>Question</label>
                                    <input
                                        type="text"
                                        name="question"
                                        value={editFaq ? editFaq.question : createFaqs.question}
                                        onChange={(e) => {
                                            const { name, value } = e.target;
                                            if (editFaq) {
                                                setEditFaq({ ...editFaq, [name]: value });
                                            } else {
                                                setCreateFaqs({ ...createFaqs, [name]: value });
                                            }
                                        }}
                                    />
                                </div>

                                <div>
                                    <label>Answer</label>
                                    <input
                                        type="text"
                                        name="answer"
                                        value={editFaq ? editFaq.answer : createFaqs.answer}
                                        onChange={(e) => {
                                            const { name, value } = e.target;
                                            if (editFaq) {
                                                setEditFaq({ ...editFaq, [name]: value });
                                            } else {
                                                setCreateFaqs({ ...createFaqs, [name]: value });
                                            }
                                        }}
                                    />
                                </div>

                                <button onClick={editFaq ? handleEditSubmit : handleSubmitFaqs}>
                                    {editFaq ? "Update FAQ" : "Submit FAQ"}
                                </button>
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
