function SellerHeader() {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white shadow">

      <h1 className="text-xl font-bold">
        Seller Dashboard
      </h1>

      <button className="px-4 py-2 text-white bg-blue-600 rounded">
        Add New Car
      </button>

    </div>
  );
}

export default SellerHeader;