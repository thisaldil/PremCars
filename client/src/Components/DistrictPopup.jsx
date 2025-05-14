import React from "react";

const DistrictPopup = ({ district }) => {
  if (!district) return null;

  return (
    <div className="district-popup">
      <h4>{district.name}</h4>
      <img src={district.image} alt={district.name} style={{ width: "100%" }} />
      <p dangerouslySetInnerHTML={{ __html: district.description }} />
    </div>
  );
};

export default DistrictPopup;
