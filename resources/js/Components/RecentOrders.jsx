import React, { useState, useEffect } from "react";
import { Link, usePage } from '@inertiajs/react';
import { getStatusText, getStatusClass } from './../../utils/statusUtils';
import { filterByDate, filterOptions } from '@/Components/filterUtils';

const RecentOrders = ({ orders }) => {
  const plantIds = Object.keys(orders);
  const [selectedPlant, setSelectedPlant] = useState(plantIds.length ? plantIds[0] : null);
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Apply plant and date filters
  const selectedOrders = selectedPlant
    ? orders[selectedPlant].filter(order => filterByDate(order.created_at, selectedFilter))
    : [];

  const { auth } = usePage().props;
  const userRoles = auth?.user?.roles || [];

  return (
    <div className="bg-white shadow-md rounded-lg p-6 min-w-[68%] sm:max-w-[68%] overflow-x-auto sm:[overflow-x-scroll]">
      <div className="flex justify-between items-center mb-4 flex-wrap">
        <h2 className="text-lg font-semibold">
          {userRoles[0] !== 'Plant Head' ? "Recent Purchase Orders" : "Purchase Order Requests from Client"}
        </h2>

        {/* Date Filter Dropdown */}
        <select
          className="border border-gray-300 rounded pe-8 py-1 text-sm"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          {filterOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {/* Plant Filter Buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {plantIds.map((plantId) => {
          const plantName = orders[plantId][0]?.plant.plant_name || `Plant ${plantId}`;
          return (
            <button
              key={plantId}
              className={`px-3 py-2 rounded text-sm ${selectedPlant === plantId ? "bg-red text-white" : "bg-gray-100 text-gray-600"}`}
              onClick={() => setSelectedPlant(plantId)}
            >
              {plantName}
            </button>
          );
        })}
      </div>

      {/* Table for Orders */}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-sm text-red">
            <th className="p-2 border-b">PO Number</th>
            <th className="p-2 border-b">Client Name</th>
            <th className="p-2 border-b">PO Date</th>
            <th className="p-2 border-b">Status</th>
            <th className="p-2 border-b">Delivery Date</th>
            <th className="p-2 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {selectedOrders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50 text-sm">
              <td className="p-2 border-b">{order.po_number}</td>
              <td className="p-2 border-b">{order.client.name}</td>
              <td className="p-2 border-b">
                {order.po_date ? new Date(order.po_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }).replace(/\s/g, "-") : "N/A"}
              </td>
              <td className="p-2 border-b">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusClass(order.order_status)}`}>
                  {order.order_status}
                </span>
              </td>
              <td className="p-2 border-b">
                {order.expected_delivery_date ? new Date(order.expected_delivery_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }).replace(/\s/g, "-") : "N/A"}
              </td>
              <td className="p-2 border-b text-gray-600 cursor-pointer">
                <Link href={route('client-purchase-orders.view', order.id)} className="text-black hover:underline">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrders;
