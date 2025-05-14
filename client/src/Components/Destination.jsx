import React, { useState } from "react";
import districtData from "../data/districtData";
import DistrictPopup from "../DistrictPopup";
import SeasonInfo from "../SeasonInfo";

const Destination = () => {
  const [hoveredDistrict, setHoveredDistrict] = useState(null);

  return (
    <div className="container my-5">
      <SeasonInfo />
      <h2 className="text-center mt-5 mb-3">Explore Sri Lanka by District</h2>
      <div className="map-container d-flex flex-wrap justify-content-center gap-3">
        {Object.entries(districtData).map(([id, district]) => (
          <div
            key={id}
            className="district-tile"
            onMouseEnter={() => setHoveredDistrict(district)}
            onMouseLeave={() => setHoveredDistrict(null)}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              cursor: "pointer",
            }}
          >
            <h5>{district.name}</h5>
          </div>
        ))}
      </div>

      {hoveredDistrict && (
        <div className="popup-container mt-4">
          <DistrictPopup district={hoveredDistrict} />
        </div>
      )}
    </div>
  );
};

export default Destination;
