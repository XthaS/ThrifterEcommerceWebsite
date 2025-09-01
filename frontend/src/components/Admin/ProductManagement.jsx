import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminProducts, deleteProduct } from '../../redux/slices/adminProductSlice';
import { toast } from 'sonner';

const ProductManagement = () => {
    const dispatch = useDispatch();
    const {products, loading, error} = useSelector((state) => state.adminProducts);
    const { user, loading: authLoading } = useSelector((state) => state.auth);

    useEffect(()=>{
        if (authLoading) return;
        if (user && user.role === 'admin') {
            dispatch(fetchAdminProducts());
        }
    },[dispatch, user, authLoading]);

   
const handleDelete =(id) =>{
    if(window.confirm("Are you sure you want to delete the Product?")){
        dispatch(deleteProduct(id))
          .unwrap()
          .then(() => toast.success('Product deleted successfully!'))
          .catch(() => toast.error('Failed to delete product.'));
    }
};

if(loading){
    return <p>Loading...</p>;
}
if(error){
    const errorMsg = typeof error === 'object' && error !== null ? error.message || JSON.stringify(error) : error;
    return <p>Error: {errorMsg}</p>;
}

  return (
    <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Product Management</h2>
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
            <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Action</th>
                </tr>
            </thead>
            <tbody>
                {products.length > 0 ? (
                    products.map((product) => 
                    <tr key={product._id}
                    className="border-b hover:bg-gray-50 cursor-pointer">
                        <td className="p-4 font-medium text0gray-900 whitespace-nowrap">
                            {product.name}
                        </td>
                        <td className="p-4">${product.price}</td>
                        <td className="p-4">
                            <Link to={`/admin/products/${product._id}/edit`} 
                            className="bg-yellow-500 text-white px-2 py-1 rounded mr-2
                            hover:bg-yellow-600">
                            Edit
                            </Link>
                            <button onClick={()=>handleDelete(product._id)}
                             className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"   >
                            Delete</button>
                        </td> 
                    </tr>
                )): (
                <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">
                        No Products found.
                    </td>
                </tr>
            )}
            </tbody>
        </table>
        </div>

      
    </div>
  )
}

export default ProductManagement
