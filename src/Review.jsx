import React from 'react';
import { TiStarFullOutline } from "react-icons/ti";

const Review = ({ rating }) => {
    const fullStars = Math.floor(rating);
    // console.log("fullstar", fullStars);
    const fractionalPart = rating - fullStars;
    // console.log("halfstar", fractionalPart);
    const emptyStars = 5 - Math.ceil(rating);
    // console.log("empty", emptyStars);

    const renderStars = () => {
        const stars = [];
        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={`full-${i}`} className="star filled"><TiStarFullOutline /></span>);
        }

        if (fractionalPart > 0) {
            stars.push(
                <span key="partial" className="star partial">
                    <span className="filled" style={{ width: `${fractionalPart * 100}%` }}><TiStarFullOutline /></span>
                    <span className="empty" ><TiStarFullOutline /></span>
                </span>
            );
        }

        for (let i = 0; i < emptyStars; i++) {
            stars.push(<span key={`empty-${i}`} className="star" ><TiStarFullOutline /></span>);
        }

        return stars;
    };

    return (
        <div className="star-rating">
            {renderStars()}
        </div>
    );
};

export default Review;










