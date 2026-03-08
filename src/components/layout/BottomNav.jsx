import React from 'react';
import { Home, Search, ShoppingBag, PawPrint, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function BottomNav() {
    const navItems = [
        { icon: <Home size={22} />, label: 'Home', path: '/' },
        { icon: <Search size={22} />, label: 'Discover', path: '/discover' },
        { icon: <PawPrint size={22} />, label: 'Pets', path: '/pets' },
        { icon: <ShoppingBag size={22} />, label: 'Shop', path: '/marketplace' },
        { icon: <User size={22} />, label: 'Admin', path: '/merchant/login' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-lg border-t px-2 flex justify-around items-center md:hidden z-50">
            {navItems.map((item) => (
                <NavLink
                    key={item.label}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 transition-all duration-200 ${isActive ? 'text-primary scale-110 font-bold' : 'text-muted-foreground hover:text-primary'
                        }`
                    }
                >
                    {item.icon}
                    <span className="text-[10px] leading-none uppercase tracking-widest">{item.label}</span>
                </NavLink>
            ))}
        </nav>
    );
}
