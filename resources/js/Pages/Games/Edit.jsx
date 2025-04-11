import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { FiChevronRight } from 'react-icons/fi';
export default function Edit({ finishedGood, rawMaterials }) {
    const { data, setData, put, errors, processing } = useForm({
        material_code: finishedGood.material_code || '',
        material_name: finishedGood.material_name || '',
        hsn_sac_code: finishedGood.hsn_sac_code || '',
        initial_stock_quantity: finishedGood.initial_stock_quantity || '',
        unit_of_measurement: finishedGood.unit_of_measurement || '',
        date_of_entry: finishedGood.date_of_entry || '',
        status: finishedGood.status || '',
        reorder_level: finishedGood.reorder_level || '',
        buffer_stock: finishedGood.buffer_stock || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();



        // Submit the form if validation passes
        put(route('finished-goods.update', finishedGood.id));
    };

    return (
        <AuthenticatedLayout

            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Edit Finish Good</h2>}>
            <Head title="Edit Finished Good" />
            <div className="main-content-container sm:ml-52">
                <div className="mx-auto py-6 flex justify-between flex-col md:flex-row gap-2">
                    <p className='flex flex-wrap'>Dashboard  <FiChevronRight size={24} color="black" />  Inventory Management <FiChevronRight size={24} color="black" /> <span className='text-red'>Update Finish Goods</span></p>
                    <Link
                        href={route('finished-goods.index')}   // Use the correct path to navigate to the users page
                        className="border border-red py-1 px-14 text-red rounded max-w-max"
                    >
                        Back
                    </Link>
                </div>
                <div className="mx-auto py-6">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="mb-6 text-2xl font-bold text-gray-800">Update Item</h1>

                            <form onSubmit={handleSubmit} className="styled-form">
                                <div className="theme-style-form grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Material Code */}
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Item Code*</label>
                                        <input
                                            type="text"
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                                            placeholder="Material Code"
                                            value={data.material_code}
                                            onChange={(e) => setData('material_code', e.target.value)}
                                        />
                                        {errors.material_code && <div className="text-errorRed text-sm">{errors.material_code}</div>}
                                    </div>

                                    {/* Material Name */}
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Item Name*</label>
                                        <input
                                            type="text"
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                                            placeholder="Material Name"
                                            value={data.material_name}
                                            onChange={(e) => setData('material_name', e.target.value)}
                                        />
                                        {errors.material_name && <div className="text-errorRed text-sm">{errors.material_name}</div>}
                                    </div>

                                    {/* HSN/SAC Code */}
                                    {/* <div className="mb-4">
                                        <label className="block text-gray-700">HSN/SAC Code</label>
                                        <input
                                            type="text"
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                                            placeholder="HSN/SAC Code"
                                            value={data.hsn_sac_code}
                                            onChange={(e) => setData('hsn_sac_code', e.target.value)}
                                        />
                                        {errors.hsn_sac_code && <div className="text-errorRed text-sm">{errors.hsn_sac_code}</div>}
                                    </div> */}


                                    <div className="mb-4">
                                        <label className="block text-gray-700">Stock Quantity*</label>
                                        <input
                                            type="number" min={0}
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                                            placeholder="Stock Quantity"
                                            value={data.initial_stock_quantity}
                                            onChange={(e) => setData('initial_stock_quantity', e.target.value)}
                                        />
                                        {errors.initial_stock_quantity && <div className="text-errorRed text-sm">{errors.initial_stock_quantity}</div>}
                                    </div>

                                    {/* Unit of Measurement */}
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Unit of Measurement*</label>
                                        <select
                                            value={data.unit_of_measurement}
                                            onChange={(e) => setData('unit_of_measurement', e.target.value)}
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                                        >
                                            <option value="">Select Unit</option>


                                            <option value="pieces">Pieces</option>
                                        </select>
                                        {errors.unit_of_measurement && <div className="text-errorRed text-sm">{errors.unit_of_measurement}</div>}
                                    </div>

                                    {/* Status */}
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Status</label>
                                        <select
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                                        >
                                            <option value="">Select Status</option>
                                            <option value="available">Available</option>
                                            <option value="unavailable">Unavailable</option>

                                        </select>
                                        {errors.status && <div className="text-errorRed text-sm">{errors.status}</div>}
                                    </div>

                                    {/* Reorder Level */}
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Reorder Level</label>
                                        <input
                                            type="number" min={0}
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                                            placeholder="Reorder Level"
                                            value={data.reorder_level}
                                            onChange={(e) => setData('reorder_level', e.target.value)}
                                        />
                                        {errors.reorder_level && <div className="text-errorRed text-sm">{errors.reorder_level}</div>}
                                    </div>

                                    {/* Buffer Stock */}
                                    {/* <div className="mb-4">
                                        <label className="block text-gray-700">Buffer Stock</label>
                                        <input
                                            type="text"
                                            value={data.buffer_stock}
                                            onChange={(e) => setData('buffer_stock', e.target.value)}
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                                        />
                                        {errors.buffer_stock && <div className="text-errorRed text-sm">{errors.buffer_stock}</div>}
                                    </div>

                                    {/* Date of Entry */}
                                    {/* <div className="mb-4">
                                        <label className="block text-gray-700">Date of Entry</label>
                                        <input
                                            type="date"
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                                            placeholder="Date of Entry"
                                            value={data.date_of_entry}
                                            onChange={(e) => setData('date_of_entry', e.target.value)}
                                        />
                                        {errors.date_of_entry && <div className="text-errorRed text-sm">{errors.date_of_entry}</div>}
                                    </div>  */}

                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 font-bold text-white bg-red rounded hover:bg-red/85"
                                    >
                                        Update Item
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
