'use client';

import { useEffect } from 'react';
import * as maplibregl from 'maplibre-gl';
import { earthquakesToGeoJSON } from '@/lib/earthquakes';

export interface Earthquake {
    id: number;
    origin_time: string;
    magnitude: number;
    depth: number;
    location: string; // stringified GeoJSON { type: "Point", coordinates: [lng, lat] }
}

interface EarthquakeLayerProps {
    map: maplibregl.Map | null;
    earthquakes: Earthquake[];
}

export default function EarthquakeHeatmapLayer({
    map,
    earthquakes,
}: EarthquakeLayerProps) {
    useEffect(() => {
        if (!map) return;

        const sourceId = 'earthquakes';
        const featureCollection = earthquakesToGeoJSON(earthquakes);

        if (map.getSource(sourceId)) {
            (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(featureCollection);
        } else {
            map.addSource(sourceId, {
                type: 'geojson',
                data: featureCollection,
            });
        }

        if (!map.getLayer('earthquake-heatmap')) {
            map.addLayer({
                id: 'earthquake-heatmap',
                type: 'heatmap',
                source: sourceId,
                maxzoom: 9,
                paint: {
                    'heatmap-weight': ['interpolate', ['linear'], ['get', 'magnitude'], 0, 0, 8, 1],
                    'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
                    'heatmap-color': [
                        'interpolate',
                        ['linear'],
                        ['heatmap-density'],
                        0, 'rgba(0,0,0,0)',
                        0.2, 'rgba(34,197,94,0.4)',
                        0.4, '#4ade80',
                        0.6, '#facc15',
                        0.9, '#f97316',
                        1, '#ef4444',
                    ],
                    'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
                    'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0],
                },
            });
        }
    }, [map, earthquakes]);

    return null;
}
