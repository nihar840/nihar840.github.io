import React, { useState } from 'react';
import './Block.css'; // Ensure this is correctly imported

const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalBlocks = 5;

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => prevIndex === 0 ? totalBlocks - 1 : prevIndex - 1);
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => prevIndex === totalBlocks - 1 ? 0 : prevIndex + 1);
    };

    return (
        <div className="carousel-container">
            <div className="carousel-slide">
                {Array.from({ length: totalBlocks }).map((_, index) => (
                    <div key={index} className={`carousel-block ${index === currentIndex ? 'active' : ''}`}>
                        <div className="carousel-content">
                            Block {index + 1}
                        </div>
                        {index === currentIndex && (
                            <>
                                <button className="arrow left" onClick={goToPrevious}>&lt;</button>
                                <button className="arrow right" onClick={goToNext}>&gt;</button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Carousel;
