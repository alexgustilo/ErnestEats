import { useEffect, useState } from "react";
import { getProducts } from "../../features/products/productsApi";


function CustomerHome(){
    const [products, setProducts] = useState([]);

    useEffect(()=>{
        async function loadProducts() {
            try{
                const data = await getProducts()
                console.log(data)
                setProducts(data)
            }catch(error){
                console.error(error.message) 
            }
        }
        loadProducts()
    },[])

    return(
        <div>
            <h1>Customer Home</h1>
            <p>Welcome Users!</p><br />

            <h2>Products</h2>
            {products.map((product)=>(
                <div key={product.id}>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <p>₱{product.price}</p>
                </div>
            ))}
        </div>
    );
}

export default CustomerHome;