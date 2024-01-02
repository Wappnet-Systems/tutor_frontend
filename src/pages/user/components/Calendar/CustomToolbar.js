import React from "react";

const CustomToolbar = (props) => {
  return (
    <>
      <div className="rbc-toolbar text-gray-800 fw-bold">
        <div className="rbc-btn-group appointments-btn-group">
          <button
            className="text-gray-700 fw-bold btn"
            onClick={() => props.onViewChange("PREV")}
            type="button"
          >
            «
          </button>
          <button
            className="text-gray-700 fw-bold btn "
            onClick={() => props.onViewChange("NEXT_MONTH")}
            type="button"
          >
            »
          </button>
          <button
            className="text-gray-700 fw-bold btn"
            onClick={() => props.onViewChange("TODAY")}
            type="button"
          >
            Today
          </button>
        </div>
        <div className="rbc-toolbar-label">{props.label}</div>
        <div className="rbc-btn-group appointments-btn-group">
          <button
            className="text-gray-700 btn fw-bold"
            onClick={() => props.onViewChange("month")}
            type="button"
          >
            Month
          </button>
          <button
            className="text-gray-700 btn fw-bold"
            onClick={() => props.onViewChange("day")}
            type="button"
          >
            Day
          </button>

          <button
            className="text-gray-700 fw-bold btn"
            onClick={() => props.onViewChange("week")}
            type="button"
          >
            Week
          </button>
          <button
            className="text-gray-700 fw-bold btn"
            onClick={() => props.onViewChange("agenda")}
            type="button"
          >
            Bookings
          </button>
        </div>
      </div>
    </>
  );
};

export { CustomToolbar };
