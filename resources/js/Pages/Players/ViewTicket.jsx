import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function ViewTickets({ tickets, user }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold">View Tickets for {user.name}</h2>}
        >
            <Head title="Your Tickets" />

            <div className="w-4/5 mx-auto pt-[15vh] flex flex-col items-center gap-8">
                {tickets.length > 0 ? (
                    tickets.map(ticket => (
                        <div
                            key={ticket.id}
                            className="w-full max-w-md border rounded-lg shadow p-6 bg-white"
                        >
                            <h1 className="text-2xl font-bold mb-4">Lottery Ticket</h1>

                            <p className="mb-2">
                                <strong>Serial #:</strong>{' '}
                                <span className="font-mono">{ticket.serial_number}</span>
                            </p>

                            <p className="mb-2">
                                <strong>Amount:</strong>{' '}
                                ₹{Number(ticket.amount).toLocaleString()}
                            </p>

                            <p className="mb-4">
                                <strong>Card Name:</strong> {ticket.card_name}
                            </p>

                            <img
                                src={`${ticket.bar_code_scanner}`}
                                alt={`Barcode for ${ticket.serial_number}`}
                                className="mb-4"
                            />

                            <button
                                onClick={() => window.print()}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Print Ticket
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No tickets found.</p>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
