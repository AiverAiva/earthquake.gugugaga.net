import React from "react";

interface DatabaseStatusProps {
    latest: string;
    earliest: string;
    total: number;
}

interface EarthquakePanelProps {
    databaseStatus: DatabaseStatusProps;
    count: number; // the "number of earthquakes" you pass in
}

const EarthquakePanel: React.FC<EarthquakePanelProps> = ({ databaseStatus, count }) => {
    const percent = databaseStatus.total
        ? ((count / databaseStatus.total) * 100).toFixed(2)
        : "0";

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
            <div className="backdrop-blur-md bg-background/10 border border-white/20 shadow-lg rounded-2xl px-4 py-2 text-center">
                <p className="text-white font-semibold text-md whitespace-nowrap">
                    顯示 {count}/{databaseStatus.total} 個地震{" "}
                    <span className="text-sm text-gray-200">({percent}%)</span>
                </p>
            </div>
        </div>
    );
};

export default EarthquakePanel;
