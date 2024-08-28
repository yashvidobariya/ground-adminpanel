// SubHeader.jsx
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { ImCalendar } from "react-icons/im";
import 'react-datepicker/dist/react-datepicker.css';

const SubHeader = ({
    searchValue,
    onSearchChange,
    selectedDate,
    onDateChange,
}) => {

    const handleDateChange = (date) => {
        onDateChange(date);
    }

    const [isScrolled, setIsScrolled] = useState(false);


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
        <div className={`sub-header-content ${isScrolled ? 'scrolled' : ''}`}>
            <div className="date-picker">
                <DatePicker
                    className="datepiker"
                    format="dd MMM yyyy"
                    placeholderText='DD-MM-YY'
                    selected={selectedDate}
                    onChange={handleDateChange}
                />
                <ImCalendar className="calendar-icon" />
            </div>
            <div className="navbar-search">
                <input
                    type='search'
                    placeholder='Search here'
                    value={searchValue}
                    onChange={onSearchChange}
                />
            </div>
        </div>
    );
}

export default SubHeader;
