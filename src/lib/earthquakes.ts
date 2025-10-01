// lib/earthquakes.ts
import type { Feature, FeatureCollection, Point } from 'geojson';

export interface Earthquake {
  id: number;
  origin_time: string;
  magnitude: number;
  depth: number;
  location: string; // stringified GeoJSON { type: "Point", coordinates: [lng, lat] }
}

/**
 * Convert earthquake array into a GeoJSON FeatureCollection<Point>
 */
export function earthquakesToGeoJSON(earthquakes: Earthquake[]): FeatureCollection<Point> {
  const features: Feature<Point>[] = earthquakes.map(eq => {
    const loc = JSON.parse(eq.location) as { type: 'Point'; coordinates: [number, number] };

    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: loc.coordinates,
      },
      properties: {
        id: eq.id,
        origin_time: eq.origin_time,
        magnitude: eq.magnitude,
        depth: eq.depth,
      },
    };
  });

  return {
    type: 'FeatureCollection',
    features,
  };
}
