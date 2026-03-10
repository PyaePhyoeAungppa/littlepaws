import React, { useState, useRef, useEffect } from 'react';
import { Heart, Search, PawPrint, ShoppingBag, Stethoscope, Hotel, X, SlidersHorizontal, User } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CartDrawer from '../cart/CartDrawer';
import { useAuthStore } from '../../lib/store';

const CATEGORIES = [
    { label: 'All', icon: null, color: 'bg-muted text-foreground' },
    { label: 'Pets', icon: <PawPrint size={14} />, color: 'bg-emerald-100 text-emerald-700' },
    { label: 'Supplies', icon: <ShoppingBag size={14} />, color: 'bg-blue-100 text-blue-700' },
    { label: 'Vets', icon: <Stethoscope size={14} />, color: 'bg-teal-100 text-teal-700' },
    { label: 'Hotels', icon: <Hotel size={14} />, color: 'bg-violet-100 text-violet-700' },
];

const PRICE_RANGES = ['Any Price', 'Under $25', '$25 – $100', '$100 – $500', 'Over $500'];
const DISTANCES = ['Any Distance', '< 1 km', '< 5 km', '< 15 km', '< 50 km'];

export default function Navbar() {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [category, setCategory] = useState('All');
    const [price, setPrice] = useState('Any Price');
    const [distance, setDistance] = useState('Any Distance');
    const inputRef = useRef(null);
    const panelRef = useRef(null);
    const navigate = useNavigate();
    const { user } = useAuthStore();

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        setOpen(false);
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        if (category !== 'All') params.set('category', category);
        if (price !== 'Any Price') params.set('price', price);
        if (distance !== 'Any Distance') params.set('distance', distance);

        const dest = category === 'Pets' ? '/pets' : category === 'Vets' || category === 'Hotels' ? '/discover' : '/marketplace';
        navigate(`${dest}?${params.toString()}`);
    };

    const clearSearch = () => {
        setQuery('');
        setCategory('All');
        setPrice('Any Price');
        setDistance('Any Distance');
        inputRef.current?.focus();
    };

    const hasFilters = category !== 'All' || price !== 'Any Price' || distance !== 'Any Distance';

    const navLinks = [
        { to: '/discover', label: 'Discover' },
        { to: '/pets', label: 'Pets' },
        { to: '/marketplace', label: 'Marketplace' },
    ];

    return (
        <nav className="hidden md:flex items-center justify-between px-8 py-4 sticky top-0 bg-background/80 backdrop-blur-md z-40 border-b gap-6">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-xl font-black text-primary shrink-0 transition-transform hover:scale-105">
                <Heart className="fill-current w-7 h-7" />
                LittlePaws
            </Link>

            {/* Search Bar */}
            <div ref={panelRef} className="relative flex-1 max-w-2xl">
                <form onSubmit={handleSearch}>
                    <div className={`flex items-center h-12 rounded-2xl border-2 bg-white transition-all duration-200 shadow-sm ${open ? 'border-primary shadow-primary/10 shadow-xl' : 'border-border'}`}>
                        <Search size={18} className={`ml-4 shrink-0 transition-colors ${open ? 'text-primary' : 'text-muted-foreground'}`} />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            onFocus={() => setOpen(true)}
                            placeholder="Search pets, supplies, vets, hotels…"
                            className="flex-1 px-3 bg-transparent outline-none text-sm font-medium placeholder:text-muted-foreground/60"
                        />
                        {/* Active filter badges */}
                        {hasFilters && !open && (
                            <div className="flex items-center gap-1.5 mr-2">
                                {category !== 'All' && <Badge className="rounded-full text-xs px-2 py-0 h-5 font-bold bg-primary/10 text-primary border-none">{category}</Badge>}
                                {price !== 'Any Price' && <Badge className="rounded-full text-xs px-2 py-0 h-5 font-bold bg-muted text-muted-foreground border-none">{price}</Badge>}
                                {distance !== 'Any Distance' && <Badge className="rounded-full text-xs px-2 py-0 h-5 font-bold bg-muted text-muted-foreground border-none">{distance}</Badge>}
                            </div>
                        )}
                        {(query || hasFilters) && (
                            <button type="button" onClick={clearSearch} className="mr-2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted">
                                <X size={14} />
                            </button>
                        )}
                        <button type="submit" className="mr-2 bg-primary text-white rounded-xl h-8 w-8 flex items-center justify-center hover:bg-primary/90 transition-colors shrink-0">
                            <Search size={14} />
                        </button>
                    </div>
                </form>

                {/* Filter Dropdown */}
                {open && (
                    <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-3xl border shadow-2xl shadow-black/10 p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* Category */}
                        <div className="mb-4">
                            <p className="text-[11px] uppercase tracking-widest font-black text-muted-foreground mb-3 flex items-center gap-2">
                                <SlidersHorizontal size={12} /> Category
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat.label}
                                        type="button"
                                        onClick={() => setCategory(cat.label)}
                                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${category === cat.label
                                            ? `${cat.color} border-current shadow-sm scale-105`
                                            : 'bg-muted/40 text-muted-foreground border-transparent hover:bg-muted'
                                            }`}
                                    >
                                        {cat.icon}{cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-border my-4" />

                        {/* Price & Distance Row */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-[11px] uppercase tracking-widest font-black text-muted-foreground mb-3">💰 Price Range</p>
                                <div className="flex flex-col gap-1.5">
                                    {PRICE_RANGES.map(p => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setPrice(p)}
                                            className={`text-left text-sm px-3 py-2 rounded-xl font-semibold transition-all ${price === p ? 'bg-primary/10 text-primary font-black' : 'hover:bg-muted text-muted-foreground'
                                                }`}
                                        >
                                            {price === p && <span className="mr-2">✓</span>}{p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-[11px] uppercase tracking-widest font-black text-muted-foreground mb-3">📍 Distance</p>
                                <div className="flex flex-col gap-1.5">
                                    {DISTANCES.map(d => (
                                        <button
                                            key={d}
                                            type="button"
                                            onClick={() => setDistance(d)}
                                            className={`text-left text-sm px-3 py-2 rounded-xl font-semibold transition-all ${distance === d ? 'bg-primary/10 text-primary font-black' : 'hover:bg-muted text-muted-foreground'
                                                }`}
                                        >
                                            {distance === d && <span className="mr-2">✓</span>}{d}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="h-px bg-border mt-4 mb-3" />
                        <div className="flex items-center justify-between">
                            <button type="button" onClick={clearSearch} className="text-sm text-muted-foreground hover:text-foreground font-bold underline transition-colors">
                                Clear all
                            </button>
                            <button
                                type="button"
                                onClick={handleSearch}
                                className="bg-primary text-white font-black px-6 py-2.5 rounded-2xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 text-sm"
                            >
                                Search {query && `"${query}"`}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Nav Links */}
            <div className="flex items-center gap-5 font-medium shrink-0">
                {navLinks.map(link => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.to === '/'}
                        className={({ isActive }) =>
                            `text-sm transition-colors hover:text-primary ${isActive ? 'text-primary font-bold' : 'text-muted-foreground'}`
                        }
                    >
                        {link.label}
                    </NavLink>
                ))}

                {/* Auth-dependent UI */}
                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted ml-2">
                                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                    <User size={18} />
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 z-50">
                            <DropdownMenuLabel className="font-bold">My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate('/user/profile')} className="cursor-pointer rounded-xl font-medium">
                                <span className="flex items-center gap-2"><User size={16} /> Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/user/wishlist')} className="cursor-pointer rounded-xl font-medium">
                                <span className="flex items-center gap-2 text-rose-500"><Heart size={16} /> Wishlist</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                                useAuthStore.getState().logout();
                                navigate('/');
                            }} className="cursor-pointer rounded-xl font-medium text-red-500 hover:text-red-600">
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <div className="flex items-center gap-2 ml-2">
                        <Link to="/merchant/login">
                            <Button variant="outline" className="rounded-full px-5 h-10 text-sm">
                                Shop Admin
                            </Button>
                        </Link>
                        <Link to="/user/login">
                            <Button className="rounded-full px-5 h-10 text-sm font-bold shadow-lg shadow-primary/20">
                                Log In
                            </Button>
                        </Link>
                    </div>
                )}

                <CartDrawer />
            </div>
        </nav>
    );
}
