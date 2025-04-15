import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { FiChevronRight } from 'react-icons/fi';

export default function Edit({ game, message }) {
    // Populate initial form data from the passed game prop.
    // Adjust the keys based on your mapping (e.g., game_spin_time, min_bet, maximum_bet)
    const { data, setData, put, processing, errors } = useForm({
        material_code: game.game_spin_time || '', // Field mapped from store method
        material_name: game.min_bet || '',
        hsn_sac_code: game.maximum_bet || '',
        game_name: game.game_name || '',
        game_type: game.game_type || '',
        game_category: game.game_category || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Send a PUT request to update the game record.
        put(route('games.update', game.id));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Edit Game</h2>}
        >
            <Head title="Edit Game" />

            <div className="main-content-container sm:ml-52">
                <div className="mx-auto py-6 flex justify-between flex-col md:flex-row gap-2">
                    <p className="flex flex-wrap">
                        <Link href={route('dashboard')}>Dashboard</Link>
                        <FiChevronRight size={24} color="black" />
                        <Link href={route('games.index')}>Games Management</Link>
                        <FiChevronRight size={24} color="black" />
                        <span className="text-red">Edit Game</span>
                    </p>
                    <Link
                        href={route('games.index')}
                        className="border border-red py-1 px-14 text-red rounded max-w-max"
                    >
                        Back
                    </Link>
                </div>

                <div className="mx-auto py-6">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="mb-6 text-2xl font-bold text-gray-800">
                                Edit Game Details
                            </h1>
                            {message && (
                                <div className="mb-4 text-green-600">{message}</div>
                            )}
                            <form onSubmit={handleSubmit} className="styled-form">
                                <div className="theme-style-form grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="mb-4">
                                        <label className="block text-gray-700">
                                            Game Spin Time*
                                        </label>
                                        <input
                                            type="text"
                                            value={data.material_code}
                                            onChange={(e) =>
                                                setData('material_code', e.target.value)
                                            }
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                                            placeholder="Enter Game Spin Time"
                                        />
                                        {errors.material_code && (
                                            <div className="text-errorRed text-sm">
                                                {errors.material_code}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">
                                            Max Bet *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.material_name}
                                            onChange={(e) =>
                                                setData('material_name', e.target.value)
                                            }
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                                            placeholder="Enter Max Bet"
                                        />
                                        {errors.material_name && (
                                            <div className="text-errorRed text-sm">
                                                {errors.material_name}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">
                                            Min Bet*
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            value={data.hsn_sac_code}
                                            onChange={(e) =>
                                                setData('hsn_sac_code', e.target.value)
                                            }
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                                            placeholder="Enter Min Bet"
                                        />
                                        {errors.hsn_sac_code && (
                                            <div className="text-errorRed text-sm">
                                                {errors.hsn_sac_code}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">
                                            Game Name*
                                        </label>
                                        <input
                                            type="text"
                                            value={data.game_name}
                                            onChange={(e) =>
                                                setData('game_name', e.target.value)
                                            }
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                                            placeholder="Enter Game Name"
                                        />
                                        {errors.game_name && (
                                            <div className="text-errorRed text-sm">
                                                {errors.game_name}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">
                                            Game Type*
                                        </label>
                                        <input
                                            type="text"
                                            value={data.game_type}
                                            onChange={(e) =>
                                                setData('game_type', e.target.value)
                                            }
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                                            placeholder="Enter Game Type"
                                        />
                                        {errors.game_type && (
                                            <div className="text-errorRed text-sm">
                                                {errors.game_type}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">
                                            Game Category*
                                        </label>
                                        <input
                                            type="text"
                                            value={data.game_category}
                                            onChange={(e) =>
                                                setData('game_category', e.target.value)
                                            }
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                                            placeholder="Enter Game Category"
                                        />
                                        {errors.game_category && (
                                            <div className="text-errorRed text-sm">
                                                {errors.game_category}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-red-800"
                                    >
                                        Update Game
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
