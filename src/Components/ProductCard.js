import React, { useState, useEffect } from "react";
import './ProductCard.css'

function ProductCard({ product: { name, price, description, companyName } }) {
    return (
        <div className="product-card">
            <h2 className="product-name">{name}</h2>
            {/* Check if the price is available (not null or undefined). 
            If it is, render the price with a dollar sign. If not, render an empty string */}
            <p className="product-price">{price ? `$${price}` : ''}</p>
            <p className="product-description">{description}</p>
            <p className="product-company">{companyName}</p>
        </div>
    )
};

export default ProductCard;