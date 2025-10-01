'use client';

import * as maplibregl from 'maplibre-gl';
import { useEffect, useRef, useState } from 'react';

import 'maplibre-gl/dist/maplibre-gl.css';
import './Map.css';
import EarthquakeLayer, { Earthquake } from './EarthquakeLayer';
import EarthquakeHeatmapLayer from './EarthquakeHeatmapLayer';

interface MapProps {
    earthquakes: Earthquake[]
}

export default function Map({ earthquakes }: MapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsMobile(window.innerWidth < 768);
        }
    }, []);

    useEffect(() => {
        if (map.current) return;
        if (!mapContainer.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: {
                version: 8,
                sources: {
                    map: {
                        type: 'vector',
                        url: 'https://lb.exptech.dev/api/v1/map/tiles/tiles.json',
                    },
                },
                layers: [
                    {
                        id: 'background',
                        type: 'background',
                        paint: {
                            'background-color': '#1f2025',
                        },
                    },
                    {
                        'id': 'county',
                        'type': 'fill',
                        'source': 'map',
                        'source-layer': 'city',
                        'paint': {
                            'fill-color': '#3F4045',
                            'fill-opacity': 1,
                        },
                    },
                    {
                        'id': 'town',
                        'type': 'fill',
                        'source': 'map',
                        'source-layer': 'town',
                        'paint': {
                            'fill-color': '#3F4045',
                            'fill-opacity': 1,
                        },
                    },
                    {
                        'id': 'county-outline',
                        'source': 'map',
                        'source-layer': 'city',
                        'type': 'line',
                        'paint': {
                            'line-color': '#a9b4bc',
                        },
                    },
                    {
                        'id': 'global',
                        'type': 'fill',
                        'source': 'map',
                        'source-layer': 'global',
                        'paint': {
                            'fill-color': '#3F4045',
                            'fill-opacity': 1,
                        },
                    },
                ],
            },
            center: [121.6, 23.5],
            zoom: 6.8,
            minZoom: 4,
            maxZoom: 12,
            doubleClickZoom: false,
            keyboard: false,
            attributionControl: false,
        });

        // Add navigation controls
        map.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

        map.current.on('load', () => {
            setMapLoaded(true);
        });
    }, []);

    useEffect(() => {
        if (map.current) {
            if (isMobile) {
                map.current.fitBounds([[118, 21.2], [124, 25.8]], { padding: 20, duration: 0 });
            }
            else {
                map.current.fitBounds([[117, 20], [130, 28]], { padding: 20, duration: 0 });
            }
        }
    }, [isMobile]);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
            {/* {mapLoaded && map.current && <CableLayer ref={cableLayerRef} map={map.current} cableFilter={cableFilter} />} */}
            {mapLoaded && map.current && (
                <EarthquakeLayer map={map.current} earthquakes={earthquakes} />
            )}
            {mapLoaded && map.current && (
                <EarthquakeHeatmapLayer map={map.current} earthquakes={earthquakes} />
            )}
        </div>
    );
}