import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { FiChevronRight } from 'react-icons/fi';

export default function Edit({ client, roles, plants }) {

    const { data, setData, put, processing, errors } = useForm({
        name: client.name || '',
        email: client.email || '',
        password: '',
        status: client.status || '',
        mobile_number: client.mobile_number || '',
        role: client.role || 'Client',
        company_name: client.company_name || '',
        gstin_number: client.gstin_number || '',
        pan_card: client.pan_card || '',
        state_code: client.state_code || '',
        company_address: client.company_address || '',
        plant_assigned: client.plant_assigned || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('clients.update', client.id));
    };

    return (
        <AuthenticatedLayout


            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Client
                </h2>
            }
        >
            <Head title="Edit Client" />

            <div className="main-content-container sm:ml-52">
                <div className="mx-auto py-6 flex justify-between flex-col md:flex-row gap-2">
                    <p className='flex flex-wrap'><Link href={route('dashboard')}>Dashboard</Link>  <FiChevronRight size={24} color="black" /> <Link href={route('clients.index')}> Clients Management</Link> <FiChevronRight size={24} color="black" /> <span className='text-red'>Edit Client</span></p>
                    <Link
                        href={route('clients.index')}
                        className="border border-red py-1 px-14 text-red rounded max-w-max"
                    >
                        Back
                    </Link>
                </div>
                <div className="mx-auto py-6">
                    <div className=" bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 min-h-[80vh]">
                            <div className='top-search-bar-box flex py-4'>
                                <h2 className='font-semibold text-3xl mb-6'>Edit Client</h2>
                            </div>
                            <form onSubmit={handleSubmit} className='styled-form'>
                                <div className='theme-style-form grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>

                                    <div className="mb-4">
                                        <label className="block text-gray-700">Full Name*</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm" placeholder='Enter Full Name'
                                        />
                                        {errors.name && <div className="text-red-600">{errors.name}</div>}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Company Name*</label>
                                        <input
                                            type="text"
                                            value={data.company_name}
                                            onChange={(e) => setData('company_name', e.target.value)}
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                                            placeholder='Enter Full Name'
                                        />
                                        {errors.company_name && <div className="text-red-600">{errors.company_name}</div>}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Select Plant*</label>
                                        <select
                                            value={data.plant_assigned}
                                            onChange={(e) => setData('plant_assigned', e.target.value)}
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                                        >
                                            <option value="">Select Plant</option>
                                            {plants.map((plant) => (
                                                <option
                                                    key={plant.id}
                                                    value={plant.id}
                                                    selected={plant.id === data.plant_assigned} // Not necessary when using 'value'
                                                >
                                                    {plant.plant_name}
                                                </option>
                                            ))}
                                        </select>


                                        {errors.plant_assigned && <div className="text-red-600">{errors.plant_assigned}</div>}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">GSTIN Number*</label>
                                        <input
                                            type="text"
                                            value={data.gstin_number}
                                            onChange={(e) => setData('gstin_number', e.target.value)}
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm" placeholder='Enter GSTIN Number'
                                        />
                                        {errors.gstin_number && <div className="text-red-600">{errors.gstin_number}</div>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-700">Email Address*</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm" placeholder='Enter Email Address'
                                        />
                                        {errors.email && <div className="text-red-600">{errors.email}</div>}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Password</label>
                                        <input
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm" placeholder='Change Password'
                                        />
                                        {errors.password && <div className="text-red-600">{errors.password}</div>}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Mobile Number*</label>
                                        <input
                                            type="text"
                                            value={data.mobile_number}
                                            onChange={(e) => setData('mobile_number', e.target.value)}
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm" placeholder='Enter Mobile Number'
                                        />
                                        {errors.mobile_number && <div className="text-red-600">{errors.mobile_number}</div>}
                                    </div>


                                    <div className="mb-4">
                                        <label className="block text-gray-700">PAN Card No*</label>
                                        <input
                                            type="text"
                                            value={data.pan_card}
                                            onChange={(e) => setData('pan_card', e.target.value)}
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm" placeholder='Enter PAN Card'
                                        />
                                        {errors.pan_card && <div className="text-red-600">{errors.pan_card}</div>}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">State Code*</label>
                                        <input
                                            type="number" min={0}
                                            value={data.state_code}
                                            onChange={(e) => setData('state_code', e.target.value)}
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm" placeholder='Enter State Code'
                                        />
                                        {errors.state_code && <div className="text-red-600">{errors.state_code}</div>}
                                    </div>



                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="sm:col-span-1">
                                        <label className="block text-gray-700">Status</label>
                                        <select
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm text-gray-500"
                                        >
                                            <option value="pending_approval">Pending</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                        {errors.status && <div className="text-red-600">{errors.status}</div>}
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-black">Company Address*</label>
                                        <textarea
                                            value={data.company_address}
                                            onChange={(e) => setData('company_address', e.target.value)}
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm text-gray-500"
                                            placeholder="Enter Company Address"
                                        ></textarea>
                                        {errors.company_address && <div className="text-red-600">{errors.company_address}</div>}
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-red-800"
                                    >
                                        Update Client
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
