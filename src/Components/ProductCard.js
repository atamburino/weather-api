import React, { useState, useEffect } from "react";

function ProductCard({ product: { name, price, description, companyName } }) {
    return (
        <div className="product-card">
            <h2 className="product-name">{name}</h2>
            <p className="product-price">${price}</p>
            <p className="product-description">{description}</p>
            <p className="product-company">{companyName}</p>
        </div>
    )
};

export default ProductCard;