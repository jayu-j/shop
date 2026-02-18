import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../services/api'; // Assuming you have this service
import './HeroSlider.css';

const HeroSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdProducts = async () => {
            try {
                // Fetch high rating or specific products for ads
                const products = await productsAPI.getAll({ sort: 'rating', limit: 5 });

                // Transform products to slides
                const adSlides = products.slice(0, 5).map(product => ({
                    id: product._id,
                    image: product.image,
                    title: product.name,
                    subtitle: product.description.substring(0, 80) + '...',
                    price: product.price,
                    link: `/product/${product._id}`,
                    category: product.category
                }));

                setSlides(adSlides);
            } catch (error) {
                console.error("Failed to load featured products", error);
                // Fallback slides if API fails
                setSlides([
                    {
                        id: 1,
                        image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3",
                        title: "Exclusive Collection",
                        subtitle: "Check out our premium range.",
                        price: 9999,
                        link: "/products",
                        category: "Fashion"
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchAdProducts();
    }, []);

    useEffect(() => {
        if (slides.length === 0) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000); // 6 seconds per slide
        return () => clearInterval(timer);
    }, [slides.length]);

    if (loading) return <div className="hero-slider skeleton-loader"></div>;
    if (slides.length === 0) return null;

    return (
        <div className="hero-slider">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`slide ${index === currentSlide ? 'active' : ''}`}
                >
                    <div className="slide-content">
                        <span className="ad-badge">Featured in {slide.category}</span>
                        <h2 className="ad-title">{slide.title}</h2>
                        <p className="ad-subtitle">{slide.subtitle}</p>

                        <div className="ad-price-row">
                            <span className="ad-price-main">₹{slide.price.toLocaleString('en-IN')}</span>
                            <span className="ad-price-original">₹{(slide.price * 1.2).toFixed(0)}</span>
                        </div>

                        <Link to={slide.link} className="ad-cta">
                            Check it Out
                        </Link>
                    </div>

                    <div className="slide-image-wrapper">
                        <img src={slide.image} alt={slide.title} />
                    </div>
                </div>
            ))}

            <div className="slider-dots">
                {slides.map((_, index) => (
                    <div
                        key={index}
                        className={`dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroSlider;
