import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Store } from 'lucide-react';

export default function MerchantLogin() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => navigate('/merchant/dashboard'), 800);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-muted/20 px-4">
            <Card className="w-full max-w-sm rounded-[2rem] border-none shadow-2xl shadow-black/5 bg-white">
                <CardContent className="px-8 pt-10 pb-8">
                    <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                        <Store size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-center mb-1">Shop Admin</h2>
                    <p className="text-muted-foreground text-center text-sm mb-8">Enter your credentials to manage your store.</p>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input type="email" placeholder="mail@littlepaws.com" defaultValue="admin@littlepaws.com"
                            className="h-14 rounded-xl bg-muted/30 border-none shadow-inner" required />
                        <Input type="password" placeholder="Password" defaultValue="password"
                            className="h-14 rounded-xl bg-muted/30 border-none shadow-inner" required />
                        <Button className="w-full h-14 rounded-xl text-lg font-bold shadow-xl shadow-primary/30" type="submit" disabled={loading}>
                            {loading ? "Authenticating..." : "Sign In"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
