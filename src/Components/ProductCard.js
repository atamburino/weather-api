import React, { useState, useEffect } from "react";

function ProductCard({ product: { name, price, description, companyName } }) {


    return (
        <div>
            <p>{name}</p>
            <p>{description}</p>
            <p>{companyName}</p>
        </div>
    )
};

export default ProductCard