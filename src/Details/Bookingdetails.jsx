import React from 'react'
import Sidebar from '../Component/Sidebar'
import { useParams } from 'react-router'

const Bookingdetails = () => {
    const { bookingid } = useParams();
    console.log("bookingid", bookingid);
    return (
        <div>
            <Sidebar />
            Bookingdetails
        </div>
    )
}

export default Bookingdetails
