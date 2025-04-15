import React, { useState } from "react";
import { usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { filterByDate, filterOptions } from '@/Components/filterUtils';

const View = ({ gameResults }) => {
    // Poll for gameResults update every 20 seconds.
    console.log(gameResults);

    const gameIds = Object.keys(gameResults);
    // Initialize with the first game ID, if available.
    const [selectedGame, setSelectedGame] = useState(gameIds.length ? gameIds[0] : null);

    // Get the game name using the selectedGame id, if available.
    // This will access the game object and read its `game_name` property.
    const selectedGameName = selectedGame && gameResults[selectedGame]
        ? gameResults[selectedGame].game_name
        : 'Select Game';

    // Optional date filter if your records include created_at.
    const [selectedFilter, setSelectedFilter] = useState("all");

    // State for column-specific search filters.
    const [columnFilters, setColumnFilters] = useState({
        winning_number: "",
        lose_number: "",
        bet: "",
        win_value: "",
        created_at: ""
    });

    // Sorting state: field and direction ('asc' or 'desc')
    // Now sorting is enabled for "bet", "win_value" and "created_at"
    const [sortConfig, setSortConfig] = useState({ field: "win_value", direction: "desc" });

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const rowsPerPageOptions = [20, 50, 100, 200, 500];

    // Filter the selected game group based on created_at filter if provided.
    const selectedGameResults = selectedGame
        ? gameResults[selectedGame].filter(record =>
            record.created_at ? filterByDate(record.created_at, selectedFilter) : true
        )
        : [];

    // Apply column filters on the selected game records.
    const filteredResults = selectedGameResults.filter(record => {
        const winningMatch = (record.winning_number ?? "")
            .toString()
            .toLowerCase()
            .includes(columnFilters.winning_number.toLowerCase());
        const loseMatch = (record.lose_number ?? "")
            .toString()
            .toLowerCase()
            .includes(columnFilters.lose_number.toLowerCase());
        const betMatch = (record.bet ?? "")
            .toString()
            .toLowerCase()
            .includes(columnFilters.bet.toLowerCase());
        const winValueMatch = (record.win_value ?? "")
            .toString()
            .toLowerCase()
            .includes(columnFilters.win_value.toLowerCase());
        const createdAtStr = record.created_at
            ? new Date(record.created_at).toLocaleDateString("en-GB", {
                day: "2-digit", month: "short", year: "numeric"
            })
            : "";
        const createdAtMatch = createdAtStr.toLowerCase()
            .includes(columnFilters.created_at.toLowerCase());
        return winningMatch && loseMatch && betMatch && winValueMatch && createdAtMatch;
    });

    // Apply sorting to filteredResults based on sortConfig.
    const sortedResults = React.useMemo(() => {
        if (!sortConfig.field) return filteredResults;
        return filteredResults.slice().sort((a, b) => {
            let aValue = a[sortConfig.field];
            let bValue = b[sortConfig.field];

            // For numeric sorting on "bet" and "win_value"
            if (sortConfig.field === "bet" || sortConfig.field === "win_value") {
                aValue = Number(aValue);
                bValue = Number(bValue);
            }
            // For date sorting on "created_at"
            if (sortConfig.field === "created_at") {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }

            if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredResults, sortConfig]);

    // Pagination logic: calculate total pages and slice the sorted records.
    const totalPages = Math.ceil(sortedResults.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedResults = sortedResults.slice(startIndex, startIndex + rowsPerPage);

    // Handler for each column filter.
    const handleFilterChange = (e, field) => {
        setColumnFilters({
            ...columnFilters,
            [field]: e.target.value
        });
        setCurrentPage(1);
    };

    // Sorting handler.
    const handleSort = (field) => {
        setSortConfig(prev => {
            if (prev.field === field) {
                // Toggle sort direction.
                return { field, direction: prev.direction === "asc" ? "desc" : "asc" };
            }
            return { field, direction: "asc" };
        });
    };

    // Pagination handlers.
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    // Calculate aggregated sums (from the unpaginated results).
    const totalBet = selectedGameResults.reduce((sum, record) => sum + Number(record.bet), 0);
    const totalWinValue = selectedGameResults.reduce((sum, record) => sum + Number(record.win_value), 0);

    const { auth } = usePage().props;

    // Helper to display sort indicators.
    const SortIndicator = ({ field }) => {
        if (sortConfig.field !== field) return null;
        return sortConfig.direction === "asc" ? " ↑" : " ↓";
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Recent Game Results
                </h2>
            }
        >
            <div className="py-12">
                <div className="bg-white shadow-md rounded-lg p-6 min-w-[85%] sm:max-w-[85%] overflow-x-auto sm:[overflow-x-scroll] ml-auto">

                    <div className="flex justify-between items-center mb-4 flex-wrap">
                        <h2 className="text-lg font-semibold">Recent Game Results</h2>
                        {/* Date Filter Dropdown */}
                        <select
                            className="border border-gray-300 rounded pe-8 py-1 text-sm"
                            value={selectedFilter}
                            onChange={(e) => { setSelectedFilter(e.target.value); setCurrentPage(1); }}
                        >
                            {filterOptions.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Game Filter Buttons */}
                    <div className="flex gap-2 mb-4 flex-wrap">
                        {gameIds.map((gameId) => {
                            // Extract the game name from the gameResults object.
                            const gameName = gameResults[gameId]?.game_name || `Game ${gameId}`;
                            return (
                                <button
                                    key={gameId}
                                    className={`px-3 py-2 rounded text-sm ${selectedGame === gameId ? "bg-red text-white" : "bg-gray-100 text-gray-600"}`}
                                    onClick={() => {
                                        setSelectedGame(gameId);
                                        setCurrentPage(1);
                                    }}
                                >
                                    {gameName}
                                </button>
                            );
                        })}
                    </div>

                    {/* Summary Section */}
                    <div className="mb-4 p-4 bg-gray-50 rounded border">
                        <h3 className="text-md font-bold mb-2">Summary for Game {selectedGame}</h3>
                        <p className="text-sm">
                            <span className="font-medium">Total Bet:</span> {totalBet}
                        </p>
                        <p className="text-sm">
                            <span className="font-medium">Total Win Value:</span> {totalWinValue}
                        </p>
                    </div>

                    {/* Table for Individual Game Result Rows */}
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-sm text-red">
                                <th className="p-2 border-b">Game ID</th>
                                <th className="p-2 border-b">Player Name</th>
                                <th className="p-2 border-b cursor-pointer" onClick={() => handleSort("bet")}>
                                    Bet<SortIndicator field="bet" />
                                </th>
                                <th className="p-2 border-b cursor-pointer" onClick={() => handleSort("win_value")}>
                                    Win Value<SortIndicator field="win_value" />
                                </th>
                                <th className="p-2 border-b cursor-pointer" onClick={() => handleSort("created_at")}>
                                    Created At<SortIndicator field="created_at" />
                                </th>
                                <th className="p-2 border-b">Action</th>
                            </tr>
                            {/* Search inputs for each column */}
                            <tr className="text-xs">
                                <th className="p-2 border-b"></th>
                                <th className="p-2 border-b">
                                    <input
                                        type="text"
                                        value={columnFilters.lose_number}
                                        onChange={(e) => handleFilterChange(e, 'lose_number')}
                                        placeholder="Search"
                                        className="w-full border border-gray-300 rounded p-1 text-xs"
                                    />
                                </th>
                                <th className="p-2 border-b">
                                    <input
                                        type="text"
                                        value={columnFilters.bet}
                                        onChange={(e) => handleFilterChange(e, 'bet')}
                                        placeholder="Search"
                                        className="w-full border border-gray-300 rounded p-1 text-xs"
                                    />
                                </th>
                                <th className="p-2 border-b">
                                    <input
                                        type="text"
                                        value={columnFilters.win_value}
                                        onChange={(e) => handleFilterChange(e, 'win_value')}
                                        placeholder="Search"
                                        className="w-full border border-gray-300 rounded p-1 text-xs"
                                    />
                                </th>
                                <th className="p-2 border-b">
                                    <input
                                        type="text"
                                        value={columnFilters.created_at}
                                        onChange={(e) => handleFilterChange(e, 'created_at')}
                                        placeholder="Search"
                                        className="w-full border border-gray-300 rounded p-1 text-xs"
                                    />
                                </th>
                                <th className="p-2 border-b">-</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedResults.length ? (
                                paginatedResults.map((record, index) => (
                                    <tr key={index} className="hover:bg-gray-50 text-sm">
                                        <td className="p-2 border-b">{record.games.game_name}</td>
                                        <td className="p-2 border-b">
                                            {record.client.first_name ?? "---"} {record.client.last_name ?? "---"}
                                        </td>
                                        <td className="p-2 border-b">{record.bet ?? "N/A"}</td>
                                        <td className="p-2 border-b">{record.win_value ?? 0}</td>
                                        <td className="p-2 border-b">
                                            {record.created_at ? new Date(record.created_at).toLocaleDateString("en-GB", {
                                                day: "2-digit", month: "short", year: "numeric"
                                            }) : 'N/A'}
                                        </td>
                                        <td className="p-2 border-b text-gray-600 cursor-pointer">
                                            {/* Place action buttons or links here */}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="p-2 text-center text-sm">
                                        No records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-4">
                        <div>
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border rounded mr-2"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="px-3 py-1 border rounded"
                            >
                                Next
                            </button>
                        </div>
                        <div>
                            <span className="text-sm mr-2">
                                Page {currentPage} of {totalPages}
                            </span>
                            <select
                                className="border border-gray-300 rounded py-1 text-sm"
                                value={rowsPerPage}
                                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                            >
                                {rowsPerPageOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option} rows
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default View;
