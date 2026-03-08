import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { format } from "date-fns";
import { fetchFromMock, writeMock } from '../api/client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function ServiceDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [date, setDate] = useState();
    const [time, setTime] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchFromMock(`services/${id}`).then(data => data && setService(data));
    }, [id]);

    const handleBook = async () => {
        if (!date || !time) return alert("Please select date and time.");
        setLoading(true);
        const appointment = {
            id: Date.now().toString(),
            serviceId: id,
            serviceName: service.name,
            date: date.toISOString(),
            time,
            status: "Booked"
        };

        try {
            await writeMock('appointments', 'POST', appointment);
            alert("Appointment booked successfully!");
            navigate('/');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!service) return <div className="p-20 text-center flex justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

    const timeSlots = ["09:00 AM", "10:00 AM", "11:30 AM", "01:00 PM", "03:30 PM", "05:00 PM"];

    return (
        <div className="container max-w-6xl mx-auto py-12 px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div className="space-y-8">
                    <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-xl shadow-primary/5">
                        <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-2">
                            <span>{service.type} Service</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black mb-4 tracking-tight">{service.name}</h1>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-6">{service.description || "Premium pet service located in the heart of the city."}</p>
                        <div className="flex items-center gap-2 text-muted-foreground font-medium bg-muted/40 w-fit px-4 py-2 rounded-xl">
                            <MapPin className="text-primary" size={20} />
                            <span>{service.address}</span>
                        </div>
                    </div>
                </div>

                <Card className="border-none shadow-2xl shadow-black/5 rounded-[2rem] bg-white lg:sticky lg:top-24">
                    <CardContent className="p-8 md:p-10">
                        <h3 className="text-3xl font-black mb-2 tracking-tight">Book an Appointment</h3>
                        <p className="text-muted-foreground mb-8">Select your preferred date and time to visit.</p>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-foreground flex items-center gap-2">
                                    <CalendarIcon size={16} className="text-primary" /> Select Date
                                </label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full h-14 justify-start text-left font-normal rounded-xl border-border bg-muted/30 shadow-inner",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            {date ? <span className="font-bold text-foreground">{format(date, "PPP")}</span> : <span>Pick a day from the calendar</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-2xl" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                            className="rounded-2xl"
                                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-foreground flex items-center gap-2">
                                    <Clock size={16} className="text-primary" /> Select Time
                                </label>
                                <Select onValueChange={setTime}>
                                    <SelectTrigger className="w-full h-14 rounded-xl border-border bg-muted/30 shadow-inner">
                                        <SelectValue placeholder="Select an available time slot" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl shadow-xl border-none">
                                        {timeSlots.map(t => (
                                            <SelectItem key={t} value={t} className="rounded-lg font-medium">{t}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                className="w-full h-16 rounded-2xl text-lg font-black mt-8 shadow-xl shadow-primary/30 hover:-translate-y-1 transition-transform"
                                onClick={handleBook}
                                disabled={loading || !date || !time}
                            >
                                {loading ? "Confirming..." : "Confirm Booking"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
