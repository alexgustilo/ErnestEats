import { useState } from "react";
import { useProducts } from "../../features/products/useProducts";

export default function ProductTest() {

    const {
        products,
        loading,
        error,
        fetchProducts,
        addProduct
    } = useProducts();

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        image_url: "",
        category_id: ""
    });

    async function handleCreateProduct(event) {

        event.preventDefault();

        await addProduct({
            ...form,
            price: Number(form.price),
            is_available: true
        });
    }

    return (
        <div>

            <h1>Products Test</h1>

            <h2>Create Product</h2>

            <form onSubmit={handleCreateProduct}>

                <input
                    type="text"
                    placeholder="Product name"
                    value={form.name}
                    onChange={(event) =>
                        setForm({
                            ...form,
                            name: event.target.value
                        })
                    }
                />

                <br />

                <input
                    type="text"
                    placeholder="Description"
                    value={form.description}
                    onChange={(event) =>
                        setForm({
                            ...form,
                            description: event.target.value
                        })
                    }
                />

                <br />

                <input
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    onChange={(event) =>
                        setForm({
                            ...form,
                            price: event.target.value
                        })
                    }
                />

                <br />

                <input
                    type="text"
                    placeholder="Image URL"
                    value={form.image_url}
                    onChange={(event) =>
                        setForm({
                            ...form,
                            image_url: event.target.value
                        })
                    }
                />

                <br />

                <input
                    type="text"
                    placeholder="Category ID"
                    value={form.category_id}
                    onChange={(event) =>
                        setForm({
                            ...form,
                            category_id: event.target.value
                        })
                    }
                />

                <br />

                <button type="submit">
                    Create Product
                </button>

            </form>

            <br />

            <button onClick={fetchProducts}>
                Load Products
            </button>

            {loading && <p>Loading...</p>}

            {error && <p>{error}</p>}

            <pre>
                {JSON.stringify(products, null, 2)}
            </pre>

        </div>
    );
}