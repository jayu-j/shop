import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryBar.css';

const categories = [
    { name: 'Top Offers', icon: 'https://rukminim1.flixcart.com/flap/128/128/image/f15c02bfeb02d15d.png?q=100' },
    { name: 'Mobiles', icon: 'https://rukminim1.flixcart.com/flap/128/128/image/22fddf3c7da4c4f4.png?q=100' },
    { name: 'Electronics', icon: 'https://rukminim1.flixcart.com/flap/128/128/image/69c6589653afdb9a.png?q=100' },
    { name: 'Fashion', icon: 'https://rukminim1.flixcart.com/flap/128/128/image/82b3ca5fb2301045.png?q=100' },
    { name: 'Home', icon: 'https://rukminim1.flixcart.com/flap/128/128/image/ab7e2b022a4587dd.jpg?q=100' },
    { name: 'Appliances', icon: 'https://rukminim1.flixcart.com/flap/128/128/image/0ff199d1bd27eb98.png?q=100' },
];

const CategoryBar = () => {
    return (
        <div className="category-bar">
            <div className="category-container">
                {categories.map((cat, index) => (
                    <Link to={`/products?category=${cat.name}`} key={index} className="category-item">
                        <span className="category-name">{cat.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoryBar;
