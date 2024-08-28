// Header.jsx
import React, { useEffect, useState } from 'react';
import { IoHomeSharp } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sidebardata } from './Sidebardata';
import '../style/Index.css'

const Header = () => {
    const location = useLocation();

    const [isScrolled, setIsScrolled] = useState(false);
    const activeLink = Sidebardata.find(item => item.link === location.pathname);

    const navigate = useNavigate();

    const handleprofile = () => {
        navigate('/profile')
    }

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    return (
        <div className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="header-content">
                <div className="navbar-icon">
                    {activeLink && activeLink.link !== '/dashboard' && (
                        <Link to={"/dashboard"}><IoHomeSharp /> / </Link>
                    )}
                </div>
                <div className="navbar-path">
                    <h3>{activeLink ? activeLink.title : ''}</h3>
                </div>
            </div>
            <img className="header-profile-image" src="/image/avatar.png" alt="" onClick={handleprofile} />
        </div>
    );
}

export default Header;
