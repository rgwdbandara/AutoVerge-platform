import SellerSidebar from "../../components/seller/SellerSidebar";
import SellerHeader from "../../components/seller/SellerHeader";
import StatCard from "../../components/seller/StatCard";

function SellerDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">

      <SellerSidebar />

      <div className="flex-1">

        <SellerHeader />

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-4">

          <StatCard title="Total Cars" value="10" />
          <StatCard title="Available Cars" value="7" />
          <StatCard title="Sold Cars" value="2" />
          <StatCard title="Featured Cars" value="1" />

        </div>

      </div>
    </div>
  );
}

export default SellerDashboard;