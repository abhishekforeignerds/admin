import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Ticket() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Ticket
                </h2>
            }
        >
            <Head title="Ticket" />

            <div id="grid-outer">
                <div id="card-grid">
                    {/* Top header row */}
                    <div className="grid-header empty" data-index="12">
                        <div id="withdraw-time" style={{ fontSize: '15px' }} />
                    </div>
                    <div
                        className="grid-header"
                        id="suitIcon1"
                        style={{ color: 'black' }}
                        data-index="13"
                    >
                        ♠
                    </div>
                    <div
                        className="grid-header"
                        id="suitIcon2"
                        style={{ color: 'red' }}
                        data-index="14"
                    >
                        ♦
                    </div>
                    <div
                        className="grid-header"
                        id="suitIcon3"
                        style={{ color: 'black' }}
                        data-index="15"
                    >
                        ♣
                    </div>
                    <div
                        className="grid-header"
                        id="suitIcon4"
                        style={{ color: 'red' }}
                        data-index="16"
                    >
                        ♥
                    </div>

                    {/* King Row */}
                    <div className="grid-label" id="grid-label-1" data-index="17">
                        <img
                            className="card"
                            src="/assets-normal/img/k-removebg-preview.png"
                            alt="King of Spades"
                        />
                    </div>
                    {['KS', 'KD', 'KC', 'KH'].map((code, idx) => (
                        <div className="grid-card" key={idx} data-index={idx}>
                            <img
                                src={`https://deckofcardsapi.com/static/img/${code}.png`}
                                alt={`King of ${code[1]}`}
                            />
                        </div>
                    ))}

                    {/* Queen Row */}
                    <div className="grid-label" id="grid-label-2" data-index="21">
                        <img
                            className="card"
                            src="/assets-normal/img/q.png"
                            alt="Queen of Diamonds"
                        />
                    </div>
                    {['QS', 'QD', 'QC', 'QH'].map((code, idx) => (
                        <div className="grid-card" key={idx + 4} data-index={idx + 4}>
                            <img
                                src={`https://deckofcardsapi.com/static/img/${code}.png`}
                                alt={`Queen of ${code[1]}`}
                            />
                        </div>
                    ))}

                    {/* Jack Row */}
                    <div className="grid-label" id="grid-label-3" data-index="25">
                        <img
                            className="card"
                            src="/assets-normal/img/j-removebg-preview.png"
                            alt="Jack of Diamonds"
                        />
                    </div>
                    {['JS', 'JD', 'JC', 'JH'].map((code, idx) => (
                        <div className="grid-card" key={idx + 8} data-index={idx + 8}>
                            <img
                                src={`https://deckofcardsapi.com/static/img/${code}.png`}
                                alt={`Jack of ${code[1]}`}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
