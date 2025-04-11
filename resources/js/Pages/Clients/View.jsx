import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Link, usePage } from '@inertiajs/react';
import { FiChevronRight } from 'react-icons/fi';
import { FiMoreVertical } from "react-icons/fi";
import OptionsDropdown from '../../Components/styledComponents/optionsToggle';
import ItemInfoRedCard from '@/Components/ItemInfoRedCard';
import ItemInfoGreeCard from '@/Components/ItemInfoGreeCard';
import { clientUserIcon, activeClientIcon, clientAndVendorIcon, uploadFileIcon, searchFormIcon } from './../../../utils/svgIconContent';
import { ItemInfoBlueCard } from '@/Components/ItemInfoBlueCard';
import { useAutoHideFlash } from './../../../utils/useAutoHideFlash';
import { getStatusText, getStatusClass } from './../../../utils/statusUtils';
import { filterOptions, filterByDate } from '@/Components/FilterUtils';
import Pagination from '@/Components/Pagination';

export default function View({ users, statusCounts }) {
    const [search, setSearch] = useState('');
    const { flash = {} } = usePage().props;
    const [selectedMonth, setSelectedMonth] = useState('');
    const [openDropdown, setOpenDropdown] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const showFlash = useAutoHideFlash(flash.success);

    // Extract unique months from the `created_at` field
    const [selectedFilter, setSelectedFilter] = useState('all'); // Default: All Time

    // Filter clients based on search term and selected date filter
    const filteredClients = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase());
        const matchesDate = filterByDate(user.created_at, selectedFilter);
        return matchesSearch && matchesDate && user.status !== "deleted";
    });
    const currentRoute = route().current(); // Default to an empty string

    const { auth } = usePage().props; // Get user data from Inertia
    const userRoles = auth?.user?.roles || []; // Get roles or default to an empty array
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const userPermissions = auth.user.rolespermissions.flatMap(role => role.permissions);

    const toggleDropdown = (email) => {
        setOpenDropdown(openDropdown === email ? null : email);
    };

    const closeDropdown = () => {
        setOpenDropdown(null);
    };
    const handleRowsPerPageChange = (rows) => {
        setRowsPerPage(rows);
        setCurrentPage(1); // Reset to page 1 when rows change
    };

    // Pagination calculations
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentClients = filteredClients.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredClients.length / rowsPerPage);
    return (
        <AuthenticatedLayout
            header={
                <h3 className="text-md font-semibold leading-tight text-white w-full bg-red p-4 rounded-md text-center">
                    Clients
                </h3>
            } >
            <Head title="Clients" />
            <div className="main-content-container sm:ml-52">
                <div className="mx-auto py-6">
                    <div className=''>
                        <p className='flex flex-wrap'><Link href={route('dashboard')}>Dashboard</Link>  <FiChevronRight size={24} color="black" /> <Link href={route('clients.index')}> Clients Management</Link>  <FiChevronRight size={24} color="black" /> <span className='text-red'>Client List</span></p>
                        {/* Status Cards */}
                        <div className="flex space-x-8 my-6">
                            {/* total users */}
                            <ItemInfoRedCard svgIcon={clientUserIcon} cardHeading='Total Clients' description={statusCounts.allUsers} />
                            {/* Active Clients */}
                            <ItemInfoGreeCard svgIcon={activeClientIcon} cardHeading='Active Clients' description={statusCounts.active} />
                            {/* Inactive Clients */}
                            <ItemInfoBlueCard svgIcon={clientAndVendorIcon} cardHeading='Recent Clients Added' description={statusCounts.recentClients} />
                        </div>
                        {userPermissions.includes("create clients") && (
                            <Link className='text-right bg-red px-8 py-2 rounded-md text-white block max-w-max ml-auto mb-4'
                                href={route('clients.create')}>Create Client</Link>
                        )}

                    </div>
                    {/* Flash Message - visible for 3 seconds */}
                    {showFlash && flash.success && (
                        <div className="mb-4 p-4 bg-lightShadeGreen text-darkShadeGreen font-bold border border-green-200 rounded">
                            {flash.success}
                        </div>
                    )}
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className='top-search-bar-box flex py-4'>
                                <h2 className='font-bold text-2xl'>Clients List</h2>
                                <div className='flex items-center justify-end flex-1 gap-2'>
                                    <form className="flex items-center max-w-sm">
                                        <label htmlFor="simple-search" className="sr-only">Search by Name or Email</label>
                                        <div className="relative w-full">

                                            <input
                                                type="text"
                                                id="simple-search"
                                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pe-10 p-2.5 placeholder:text-black"
                                                placeholder="Search by Name or Email"
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)} // Set search state
                                            />
                                            <div className="absolute inset-y-0 end-4 flex items-center ps-3 pointer-events-none">
                                                {searchFormIcon}
                                            </div>
                                        </div>
                                    </form>
                                    <div className="">
                                        <select
                                            className="border border-gray-300 rounded-md px-8 py-2.5 text-sm"
                                            value={selectedFilter}
                                            onChange={(e) => setSelectedFilter(e.target.value)}
                                        >
                                            {filterOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr>
                                        <th className="px-2 py-3 border-b text-red text-left text-sm">Client Name</th>
                                        <th className="px-2 py-3 border-b text-red text-left text-sm">Email Address</th>
                                        <th className="px-2 py-3 border-b text-red text-left text-sm">Plant Name</th>
                                        <th className="px-2 py-3 border-b text-red text-left text-sm">Status</th>
                                        <th className="px-2 py-3 border-b text-red text-left text-sm">Mobile</th>
                                        <th className="px-2 py-3 border-b text-red text-left text-sm">State Code</th>
                                        <th className="px-2 py-3 border-b text-red text-left text-sm">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentClients.map((user) => (
                                        <tr key={user.id}>
                                            <td className="px-2 py-3 border-b text-sm font-bold">{user.company_name}</td>
                                            <td className="px-2 py-3 border-b text-sm">{user.email}</td>
                                            <td className="px-2 py-3 border-b text-sm">
                                                {user.plant && user.plant.plant_name ? user.plant.plant_name : 'No Plant Assigned'}
                                            </td>
                                            <td className="px-2 py-3 border-b text-sm">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusClass(user.status)}`}>
                                                    {getStatusText(user.status)}
                                                </span>
                                            </td>
                                            <td className="px-2 py-3 border-b text-sm">{user.mobile_number}</td>
                                            <td className="px-2 py-3 border-b text-sm">{user.state_code}</td>
                                            <td className="px-2 py-3 border-b text-sm relative">
                                                <button
                                                    type="button"
                                                    className="flex justify-center items-center size-9 text-sm font-semibold rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                                                    onClick={() => toggleDropdown(user.email)}
                                                    aria-haspopup="menu"
                                                    aria-expanded={openDropdown === user.email ? "true" : "false"}
                                                    aria-label="Dropdown"
                                                >
                                                    <FiMoreVertical className="size-4 text-gray-600" />
                                                </button>

                                                {openDropdown === user.email && (
                                                    <div
                                                        className="absolute right-0 mt-2 min-w-40 bg-slate-200 shadow-md rounded-lg transition-opacity duration-200 z-10"
                                                        role="menu"
                                                        aria-orientation="vertical"
                                                        onMouseLeave={closeDropdown}
                                                    >
                                                        <div className="space-y-0.5 flex flex-col p-2 gap-1">
                                                            <Link
                                                                href={route('clients.edit', user.id)}
                                                                className="text-blue-500 hover:underline"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <Link
                                                                href={route('clients.view', user.id)}
                                                                className="text-blue-500 hover:underline"
                                                            >
                                                                View
                                                            </Link>
                                                            {!user.roles.map((role) => role.name).includes('Super Admin') && (
                                                                <Link
                                                                    href={route('clients.suspend', user.id)}
                                                                    className="text-blue-500 hover:underline"
                                                                >
                                                                    Suspend
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                rowsPerPage={rowsPerPage}
                                setRowsPerPage={handleRowsPerPageChange}
                                setCurrentPage={setCurrentPage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
