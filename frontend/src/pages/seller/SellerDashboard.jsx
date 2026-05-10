import SellerSidebar from "../../components/seller/SellerSidebar";
import SellerHeader from "../../components/seller/SellerHeader";
import StatCard from "../../components/seller/StatCard";
import { useTranslation } from "react-i18next";

function SellerDashboard() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white lg:flex-row">

      <SellerSidebar />

      <div className="flex-1">

        <SellerHeader />

        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 lg:p-6">

          <StatCard title={t("seller.dashboard.totalCars", { defaultValue: "Total Cars" })} value="10" />
          <StatCard title={t("seller.dashboard.availableCars", { defaultValue: "Available Cars" })} value="7" />
          <StatCard title={t("seller.dashboard.soldCars", { defaultValue: "Sold Cars" })} value="2" />
          <StatCard title={t("seller.dashboard.featuredCars", { defaultValue: "Featured Cars" })} value="1" />

        </div>

      </div>
    </div>
  );
}

export default SellerDashboard;