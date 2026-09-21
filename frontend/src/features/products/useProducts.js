import { useState } from "react";
import { getProducts } from "./productsApi";

export  function useProducts(){
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function fetchProducts() {
        
        setLoading(true)
        setError(null)

        try{
            const data = await getProducts()
            setProducts(data)
        }catch(error){
            console.error(error.message)
            setError(error.message)
        }
    }
    return {products, fetchProducts, loading, error}
}