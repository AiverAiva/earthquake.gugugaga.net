'use client';

import Map from "@/components/Map";
import FilterDrawer from "@/components/FilterDrawer";
import './App.css';
import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/theme/mode-toggle";
import Loading from "@/components/Loading";
import InfoDialog from "@/components/InfoDialog";
import { toast } from "sonner";
import EarthquakePanel from "@/components/EarthquakePanel";

interface FilterData {
  startDate?: Date;
  endDate?: Date;
  magnitude: [number, number];
  depth: [number, number];
}


interface databaseStatus {
  latest: string;
  earliest: string;
  total: number;
}

export default function Home() {
  const [filters, setFilters] = useState<FilterData>({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    endDate: new Date(),
    magnitude: [3, 8],
    depth: [0, 300],
  });
  const [earthquakeData, setEarthquakeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [databaseStatus, setDatabaseStatus] = useState<databaseStatus | null>(null);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch("/api/status")
        if (!res.ok) throw new Error("Failed to fetch status")
        const data = await res.json()
        setDatabaseStatus(data)
        toast.info("資料庫資訊", {
          description: (
            <div>
              <p>最新資料: {data.latest ? new Date(data.latest).toLocaleString() : "N/A"}</p>
              <p>最早資料: {data.earliest ? new Date(data.earliest).toLocaleString() : "N/A"}</p>
              <p>總計: {data.total ?? 0}</p>
            </div>
          )
        })
      } catch (err) {
        toast.error("無法取得資料庫狀態")
        console.error(err)
      }
    }

    fetchStatus()
  }, [])
  useEffect(() => {
    const fetchEarthquakes = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/earthquakes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filters),
        });

        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }

        const data = await res.json();
        setEarthquakeData(data);
      } catch (err) {
        console.error("Error fetching earthquake data:", err);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if filters is not empty
    if (Object.keys(filters).length > 0) {
      fetchEarthquakes();
    }
  }, [filters]);

  useEffect(() => {
    const handleFilters = (event: CustomEvent<FilterData>) => {
      const newFilters = event.detail;
      setFilters(newFilters);
    };

    const listener = (e: Event) => handleFilters(e as CustomEvent<FilterData>);
    window.addEventListener("earthquake:apply-filters", listener);
    return () => window.removeEventListener("earthquake:apply-filters", listener);
  }, []);

  return (
    <div className="app-content">
      <div className="app-container">
        {loading && <Loading />}
        {earthquakeData.length != 0 && !loading && databaseStatus && <EarthquakePanel count={earthquakeData.length} databaseStatus={databaseStatus} />}
        <FilterDrawer />
        <ModeToggle />
        <InfoDialog databaseStatus={databaseStatus} />

        <div className="map-section">
          <Map earthquakes={earthquakeData} />
        </div>
      </div>
    </div>

  );
}
