import React, { useEffect, useRef } from 'react';

const TYPE_COLORS = {
    Cafe: '#f97316',
    Vet: '#14b8a6',
    Hotel: '#8b5cf6',
};

const BASE_LAT = 13.752;
const BASE_LNG = 100.502;
const OFFSETS = [
    [0, 0], [0.005, 0.007], [-0.006, 0.009], [0.008, -0.005],
    [-0.004, -0.008], [0.010, 0.003], [-0.009, 0.006],
];

export default function ServiceMapView({ services }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        // Only initialise once, and only in the browser
        if (!mapRef.current || mapInstanceRef.current) return;

        // Dynamically import leaflet so it is never loaded server-side
        import('leaflet').then((L) => {
            const Leaflet = L.default || L;

            // Fix broken default icon paths that bundlers produce
            delete Leaflet.Icon.Default.prototype._getIconUrl;
            Leaflet.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            const map = Leaflet.map(mapRef.current, {
                center: [BASE_LAT, BASE_LNG],
                zoom: 14,
                zoomControl: true,
            });
            mapInstanceRef.current = map;

            Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(map);

            services.forEach((service, idx) => {
                const [dLat, dLng] = OFFSETS[idx % OFFSETS.length];
                const color = TYPE_COLORS[service.type] || '#888';

                const icon = Leaflet.divIcon({
                    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 52" width="36" height="48">
                        <path fill="${color}" stroke="white" stroke-width="1.5" d="M20 2C10.6 2 3 9.6 3 19c0 13 17 31 17 31s17-18 17-31C37 9.6 29.4 2 20 2z"/>
                        <circle fill="white" cx="20" cy="19" r="8"/>
                    </svg>`,
                    iconSize: [36, 48],
                    iconAnchor: [18, 48],
                    popupAnchor: [0, -50],
                    className: '',
                });

                const actionLabel = service.type === 'Vet' ? '📅 Book Appointment' : '→ View Details';
                const popup = Leaflet.popup({ maxWidth: 260, className: 'custom-lp-popup' }).setContent(`
                    <div style="font-family:system-ui,sans-serif;padding:4px">
                        <img src="${service.image}" style="width:100%;height:110px;object-fit:cover;border-radius:12px;margin-bottom:10px" />
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px">
                            <strong style="font-size:15px;line-height:1.2;flex:1">${service.name}</strong>
                            <span style="color:#d97706;font-weight:700;font-size:12px;margin-left:6px">★ ${service.rating}</span>
                        </div>
                        <span style="background:${color};color:white;border-radius:999px;padding:2px 10px;font-size:11px;font-weight:700;display:inline-block;margin-bottom:8px">${service.type}</span>
                        <p style="font-size:12px;color:#666;margin-bottom:10px">${service.address}</p>
                        <a href="/discover" style="display:block;text-align:center;padding:8px;border-radius:10px;background:#f97316;color:white;font-weight:700;font-size:13px;text-decoration:none">${actionLabel}</a>
                    </div>
                `);

                Leaflet.marker([BASE_LAT + dLat, BASE_LNG + dLng], { icon })
                    .bindPopup(popup)
                    .addTo(map);
            });
        });

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []); // Run only once on mount

    return (
        <div className="relative rounded-[2rem] overflow-hidden border shadow-2xl shadow-black/10">
            {/* The map container — must have explicit pixel height */}
            <div ref={mapRef} style={{ height: '600px', width: '100%' }} />

            {/* Legend overlay */}
            <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2.5 shadow-xl border flex items-center gap-4">
                {Object.entries(TYPE_COLORS).map(([type, color]) => (
                    <div key={type} className="flex items-center gap-2 text-xs font-bold">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                        {type}
                    </div>
                ))}
            </div>
        </div>
    );
}
