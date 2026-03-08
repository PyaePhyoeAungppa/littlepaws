import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, PawPrint, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
    const year = new Date().getFullYear();

    const links = {
        Explore: [
            { label: 'Home', to: '/' },
            { label: 'Discover Services', to: '/discover' },
            { label: 'Pets for Adoption', to: '/pets' },
            { label: 'Marketplace', to: '/marketplace' },
        ],
        Services: [
            { label: 'Pet Cafes', to: '/discover' },
            { label: 'Vet Clinics', to: '/discover' },
            { label: 'Pet Hotels', to: '/discover' },
            { label: 'Shop Admin', to: '/merchant/login' },
        ],
    };

    return (
        <footer className="bg-foreground text-background mt-16">
            <div className="max-w-6xl mx-auto px-6 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-white/10">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 text-2xl font-black text-white mb-4 hover:text-primary transition-colors">
                            <Heart className="fill-current text-primary w-7 h-7" />
                            LittlePaws
                        </Link>
                        <p className="text-white/60 leading-relaxed text-sm mb-6">
                            Your one-stop pet companion platform. Discover services, adopt pets, and shop premium supplies.
                        </p>
                        <div className="flex gap-3">
                            {[Instagram, Facebook, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 bg-white/10 hover:bg-primary rounded-xl flex items-center justify-center transition-colors">
                                    <Icon size={18} className="text-white" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Nav Links */}
                    {Object.entries(links).map(([title, items]) => (
                        <div key={title}>
                            <h4 className="font-black text-white mb-5 uppercase text-xs tracking-widest">{title}</h4>
                            <ul className="space-y-3">
                                {items.map(item => (
                                    <li key={item.label}>
                                        <Link to={item.to} className="text-white/60 hover:text-white transition-colors text-sm font-medium">
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact */}
                    <div>
                        <h4 className="font-black text-white mb-5 uppercase text-xs tracking-widest">Contact</h4>
                        <ul className="space-y-3">
                            {[
                                { Icon: Mail, text: 'hello@littlepaws.com' },
                                { Icon: Phone, text: '+1 (555) 123-4567' },
                                { Icon: MapPin, text: '123 Pet Lane, Paws City' },
                            ].map(({ Icon, text }) => (
                                <li key={text} className="flex items-start gap-3 text-white/60 text-sm">
                                    <Icon size={16} className="text-primary mt-0.5 shrink-0" />
                                    {text}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4 text-white/40 text-xs">
                    <p>© {year} LittlePaws. All rights reserved.</p>
                    <div className="flex items-center gap-1">
                        <span>Made with</span>
                        <Heart size={12} className="fill-current text-primary mx-1" />
                        <span>for pets everywhere</span>
                        <PawPrint size={12} className="ml-1 text-primary" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
