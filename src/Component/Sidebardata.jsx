import React from 'react'
import { IoHomeSharp } from "react-icons/io5";
import { FaUsers } from "react-icons/fa6";
import { RiCustomerService2Fill } from "react-icons/ri";
import { GoStarFill } from "react-icons/go";
import { IoNotifications } from "react-icons/io5";
import { GiReceiveMoney } from "react-icons/gi";
import { SiEventstore } from "react-icons/si";
import { SiHatenabookmark } from "react-icons/si";
import { GrDocumentPerformance } from "react-icons/gr";
import { SiBaremetrics } from "react-icons/si";
import { IoSettingsOutline } from "react-icons/io5";

export const Sidebardata = [
    {
        title: "Dashboard",
        icon: <IoHomeSharp />,
        link: "/dashboard"
    },
    {
        title: "User",
        icon: <FaUsers />,
        link: "/users"
    },
    {
        title: "Bookings",
        icon: <SiHatenabookmark />,
        link: "/bookings"
    },
    {
        title: "Venue",
        icon: <SiEventstore />,
        link: "/Venue"
    },
    // {
    //     title: "Owners",
    //     icon: <FaUserLarge />,
    //     link: "/owners"
    // },
    // {
    //     title: "Review and rating",
    //     icon: <GoStarFill />,
    //     link: "/reviewandrating"
    // },
    {
        title: "Financial Overview",
        icon: <GiReceiveMoney />,
        link: "/Financial"
    },
    {
        title: "Customer Support",
        icon: <RiCustomerService2Fill />,
        link: "/customer"
    },
    // {
    //     title: "Notification",
    //     icon: <IoNotifications />,
    //     link: "/notification"
    // },
    {
        title: "Marketing Performance",
        icon: <GrDocumentPerformance />,
        link: "/marketing"
    },

    // {
    //     title: "profile",
    //     icon: <PiSignInBold />,
    //     link: "/profile"
    // },
    {
        title: "Technical Metrics",
        icon: <SiBaremetrics />,
        link: "/technical"
    },
    {
        title: "Settings",
        icon: <IoSettingsOutline />,
        link: "/setting"
    }

]