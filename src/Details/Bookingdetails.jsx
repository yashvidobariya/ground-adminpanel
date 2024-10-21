import React, { useEffect, useState } from 'react'
import Sidebar from '../Component/Sidebar'
import { useParams } from 'react-router'
import { GlobalApi } from '../service/GlobalApi';
import { Totalbooking } from '../service/APIrouter';

const Bookingdetails = () => {
    // const { bookingid } = useParams();
    // console.log("bookingid", bookingid);
    // const [cookingdetails, setbookingdetails] = useState([]);
    // const [errormessage, seterrormessage] = useState("");
    // const [loading, setloading] = useState(true);
    // useEffect(() => {
    //     const fetchdata = async () => {
    //         try {
    //             const token = localStorage.getItem("token");
    //             const response = await GlobalApi(`${Totalbooking}/${bookingid}`, 'POST', null, token);

    //             if (response.status === 200) {
    //                 setbookingdetails(response.data.booking);
    //                 console.log("bookingdetails", response.data.booking);
    //             } else if (response.status === 401) {
    //                 seterrormessage("Authentication error. Please login as an Admin.");
    //                 localStorage.removeItem('token');
    //                 localStorage.removeItem('userdata');
    //             }
    //         } catch (error) {
    //             console.error('Error:', error);
    //             seterrormessage("An error occurred while fetching data.");
    //         }
    //         finally {
    //             setloading(false);
    //         }
    //     };
    //     fetchdata();
    // }, [])

    return (
        <div>
            <Sidebar />
            Bookingdetails
        </div>
    )
}

export default Bookingdetails
