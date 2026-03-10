import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function UserLogin() {
    const navigate = useNavigate();
    const login = useAuthStore(state => state.login);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        // Mock login
        setTimeout(() => {
            login({ email, name: 'Pyae', avatar: '' });
            setLoading(false);
            navigate('/user/profile');
        }, 800);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2rem] shadow-2xl shadow-black/5 border border-border/50">
                <div className="text-center">
                    <Heart className="mx-auto h-12 w-12 text-primary fill-primary/10" />
                    <h2 className="mt-6 text-3xl font-black text-foreground">Welcome Back</h2>
                    <p className="mt-2 text-sm text-muted-foreground font-medium">
                        Log in to manage your pets, orders, and wishlist
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="font-bold">Email address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <Input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="h-12 pl-10 rounded-xl bg-muted/30 border-none shadow-inner text-base"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="font-bold">Password</Label>
                                <a href="#" className="font-medium text-primary hover:text-primary/80 text-xs">
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <Input
                                    type="password"
                                    required
                                    className="h-12 pl-10 rounded-xl bg-muted/30 border-none shadow-inner text-base"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Signing in...' : 'Sign In'} <ArrowRight size={20} />
                    </Button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-muted-foreground font-medium">
                        Don't have an account?{' '}
                        <a href="#" className="font-bold text-primary hover:underline">
                            Sign up freely
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
