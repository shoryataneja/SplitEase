import { useParams } from "react-router-dom";

function TripDetails() {
  const { tripId } = useParams();

  return (
    <div>
      <h2>Trip Details</h2>
      <p>Trip ID: {tripId}</p>
    </div>
  );
}

export default TripDetails;
