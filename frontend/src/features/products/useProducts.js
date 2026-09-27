import { useState } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct} from "./productsApi";

export  function useProducts(){
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


//hook for fetching products
    async function fetchProducts() {
        
        setLoading(true)
        setError(null)

        try{
            const data = await getProducts()
            setProducts(data)
        }catch(error){
            console.error(error.message)
            setError(error.message)
        }finally{
            setLoading(false)
        }
    }



//hook for add products
    async function addProduct(product) {
        setLoading(true)
        setError(null)

        try{
            const data = await createProduct(product)
            setProducts(prevProducts=>[...prevProducts,data])
            return data

        }catch(error){
            console.error(error.message)
            setError(error.message)
        }finally{
            setLoading(false)
        }
        
    }


//hook for editing the products
    async function editProduct(id,product) {
        setLoading(true)
        setError(null)

        try{
            const data = await updateProduct(id,product)
            setProducts(prevProducts => prevProducts.map(item => item.id === id ? data : item))
            return data
        }catch(error){
            console.error(error.message)
            setError(error.message)
        }finally{
            setLoading(false)
        }
    }


//hook for removing products
    async function removeProduct(id){
        setLoading(true)
        setError(null)

        try{
            const data = await deleteProduct(id)
            setProducts(prevProducts => prevProducts.filter(item => item.id !== id))
            return data
        }catch(error){
            console.error(error.message)
            setError(error.message)
        }finally{
            setLoading(false)
        }
    }

    return {products, fetchProducts, addProduct, editProduct, removeProduct, loading, error}

}




