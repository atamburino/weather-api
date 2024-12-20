import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

// This component gets the results from the server and 
// passes the results through the product card component.

function ProductList() {
  // We use useState to create a state variable called "products" to store the fetched data
  const [products, setProducts] = useState([]);

  // useEffect runs when the component first loads, like when the page is first displayed
  useEffect(() => {
    // This is the function that gets the products from the API we created
    async function fetchProducts() {
      try {
        // We send a GET request to the API to get the products data
        const response = await fetch("http://localhost:5001/products");
        
        // If the response is OK (status code 200-299), we process the data
        if (response.ok) {
          // Convert the response into JSON format, which is easier to work with in JS
          const data = await response.json();
          // Update the products state with the data we just fetched
          setProducts(data);
        } else {
          // If the request didn't work, log an error with the status code
          console.error("Failed to fetch products:", response.status);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    }
    // Call the function to actually fetch the data
    fetchProducts();
  }, 
  // Empty array means this effect runs only once, when the component first loads
  []); 

  return (
    <div className="product-list">
      {/* Loop through all the products and show a ProductCard for each one */}
      {products.map((product) => (
        // Unique "key" is product name here
        <ProductCard key={product.name} product={product} />
      ))}
    </div>
  );
}

export default ProductList;
