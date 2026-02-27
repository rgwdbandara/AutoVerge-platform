import useApi from "../useApi";

function TestVehicles() {
  const api = useApi();

  const loadVehicles = async () => {
    const res = await api("/api/vehicles");
    const data = await res.json();
    console.log(data);
  };

  return <button onClick={loadVehicles}>Load Vehicles</button>;
}

export default TestVehicles;