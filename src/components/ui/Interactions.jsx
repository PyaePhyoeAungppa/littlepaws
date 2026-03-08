import React from 'react';
import { motion } from 'framer-motion';

export function ProductSlider({ items }) {
    return (
        <div className="slider-container">
            {items.map((item, idx) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="min-w-[200px] md:min-w-[250px] flex-shrink-0"
                >
                    <div className="card h-full p-0 overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-40 object-cover" />
                        <div className="p-4">
                            <h3 className="font-bold text-lg">{item.name}</h3>
                            <p className="text-secondary font-semibold">${item.price}</p>
                            <button className="btn btn-primary w-full mt-3 py-2 text-sm">Add to Cart</button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

export function ServiceTabs({ activeTab, onTabChange }) {
    const tabs = ['Cafe', 'Vet', 'Hotel'];
    return (
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={`px-6 py-2 rounded-full font-semibold transition-all ${activeTab === tab
                            ? 'bg-primary text-white shadow-lg'
                            : 'bg-white text-text-muted hover:bg-gray-50'
                        }`}
                >
                    {tab}s
                </button>
            ))}
        </div>
    );
}
