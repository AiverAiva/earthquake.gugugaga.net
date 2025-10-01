'use client';

import { useEffect } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { Feature, Point } from 'geojson';
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

export default function EarthquakeLayer({ map, earthquakes }: EarthquakeLayerProps) {
    useEffect(() => {
        if (!map) return;

        const sourceId = 'earthquakes';
        const featureCollection = earthquakesToGeoJSON(earthquakes);

        if (!map.getSource(sourceId)) {
            map.addSource(sourceId, {
                type: 'geojson',
                data: featureCollection,
            });

            // Earthquake circles
            map.addLayer({
                id: 'earthquake-points',
                type: 'circle',
                source: sourceId,
                paint: {
                    'circle-radius': [
                        '/',
                        ['*', ['get', 'magnitude'], ['get', 'magnitude']],
                        2
                    ],
                    // color gradient by magnitude
                    'circle-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'magnitude'],
                        3, '#4ade80',
                        4.5, '#facc15',
                        6, '#ef4444',
                    ],
                    // opacity by depth
                    'circle-opacity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7, 0,
                        9, [
                            'interpolate',
                            ['linear'],
                            ['get', 'depth'],
                            10, 1.0,
                            50, 0.5,
                            100, 0.25,
                            200, 0.12
                        ]
                    ]
                },
            });

            map.on('click', 'earthquake-points', (e) => {
                const feature = e.features?.[0] as Feature<Point> | undefined;
                if (!feature) return;

                const coords = feature.geometry.coordinates;
                const props = feature.properties as Earthquake;
                const [lng, lat] = coords;

                // Render shadcn card into popup
                const container = document.createElement('div');
                container.className = 'max-w-xs';
                container.innerHTML = `
                    <div class="rounded-xl shadow-lg border bg-background text-foreground">
                        <div class="p-4">
                            <h3 class="font-semibold text-lg mb-2">芮氏規模 M ${props.magnitude}</h3>
                            <p class="text-sm text-muted-foreground">深度: ${props.depth} km</p>
                            <p class="text-sm text-muted-foreground">時間: ${new Date(props.origin_time).toLocaleString('zh-TW')}</p>
                            <p class="text-sm text-muted-foreground">經度: ${lng.toFixed(4)}°</p>
                            <p class="text-sm text-muted-foreground">緯度: ${lat.toFixed(4)}°</p>
                        </div>
                    </div>
                    `;

                new maplibregl.Popup({ offset: 12 })
                    .setLngLat(coords as [number, number])
                    .setDOMContent(container)
                    .addTo(map);
            });

            map.on('mouseenter', 'earthquake-points', () => {
                map.getCanvas().style.cursor = 'pointer';
            });
            map.on('mouseleave', 'earthquake-points', () => {
                map.getCanvas().style.cursor = '';
            });
        } else {
            const src = map.getSource(sourceId) as maplibregl.GeoJSONSource;
            src.setData(featureCollection);
        }
    }, [map, earthquakes]);

    return null;
}
