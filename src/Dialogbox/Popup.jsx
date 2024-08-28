import React from "react";
import { IoMdClose } from "react-icons/io";

const Popup = (props) => {
    return (
        <div className="popup-box">
            <div className="box">
                <div className="box-uper">
                    <div className="delete-title">
                        <p>Delete this Item</p>
                    </div>
                    <span className="close-icon" onClick={props.handleClose}>
                        <IoMdClose />
                    </span>
                </div>
                {props.content}
            </div>
        </div>
    );
};

export default Popup;
