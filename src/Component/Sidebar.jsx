import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Sidebardata } from './Sidebardata';

const Sidebar = () => {
    const location = useLocation();

    return (
        <div className='sidebar'>
            <ul className='sidebarlist'>
                <div className="sidebar-img">
                    <img src='/image/PlayTurfwhitelogocrop.png' /></div>
                {Sidebardata.map((val, key) => (
                    <NavLink
                        key={key}
                        to={val.link}
                        className={({ isActive }) => isActive ? "link active" : "link"}
                    >
                        <li className='row' id={location.pathname === val.link ? "active" : ""}>
                            <div id='icon'>{val.icon}</div>
                            <div id='title'>{val.title}</div>
                        </li>
                    </NavLink>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
