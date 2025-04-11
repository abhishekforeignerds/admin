import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { FiChevronRight } from 'react-icons/fi';

export default function Create({ message, rawMaterials }) {
    const { data, setData, post, processing, errors } = useForm({
        material_code: '',
        material_name: '',
        hsn_sac_code: '',
        game_name: '',
        game_type: '',
        game_category: '',

    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate raw materials used field


        post(route('finished-goods.store'));
    };

    return (
        <AuthenticatedLayout


            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Create FG</h2>}
        >
            <Head title="Create Finished Good" />
            <div className="main-content-container sm:ml-52">
                <div className="mx-auto py-6 flex justify-between flex-col md:flex-row gap-2">
                    <p className='flex flex-wrap'><Link href={route('dashboard')}>Dashboard</Link>  <FiChevronRight size={24} color="black" /> <Link href={route('finished-goods.index')}>Inventory Management</Link>  <FiChevronRight size={24} color="black" /> <span className='text-red'>Add New Game</span></p>
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
                            <h1 className="mb-6 text-2xl font-bold text-gray-800">Add New Game</h1>

                            {message && <div className="mb-4 text-green-600">{message}</div>}
                            <form onSubmit={handleSubmit} className="styled-form">
                                <div className="theme-style-form grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Game Spin Time*</label>
                                        <input
                                            type="text"
                                            value={data.material_code}
                                            onChange={(e) => setData('material_code', e.target.value)}
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                                            placeholder="Enter Material Code"
                                        />
                                        {errors.material_code && <div className="text-errorRed text-sm">{errors.material_code}</div>}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Max Bet *</label>
                                        <input
                                            type="text"
                                            value={data.material_name}
                                            onChange={(e) => setData('material_name', e.target.value)}
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                                            placeholder="Enter Material Name"
                                        />
                                        {errors.material_name && <div className="text-errorRed text-sm">{errors.material_name}</div>}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Min Bet*</label>
                                        <input
                                            type="number" min={0}
                                            value={data.hsn_sac_code}
                                            onChange={(e) => setData('hsn_sac_code', e.target.value)}
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                                            placeholder="Enter Stock Quantity"
                                        />
                                        {errors.hsn_sac_code && <div className="text-errorRed text-sm">{errors.hsn_sac_code}</div>}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Game Name*</label>
                                        <input
                                            type="text"
                                            value={data.game_name}
                                            onChange={(e) => setData('game_name', e.target.value)}
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                                            placeholder="Enter Stock Quantity"
                                        />
                                        {errors.game_name && <div className="text-errorRed text-sm">{errors.game_name}</div>}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Game Type*</label>
                                        <input
                                            type="text"
                                            value={data.game_type}
                                            onChange={(e) => setData('game_type', e.target.value)}
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                                            placeholder="Enter Stock Quantity"
                                        />
                                        {errors.game_type && <div className="text-errorRed text-sm">{errors.game_type}</div>}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Game Category*</label>
                                        <input
                                            type="text"
                                            value={data.game_category}
                                            onChange={(e) => setData('game_category', e.target.value)}
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                                            placeholder="Enter Stock Quantity"
                                        />
                                        {errors.game_category && <div className="text-errorRed text-sm">{errors.game_category}</div>}
                                    </div>


                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-red-800"
                                    >
                                        Create Finish Good
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
