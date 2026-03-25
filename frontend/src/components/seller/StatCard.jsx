function StatCard({ title, value }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow">

      <h3 className="text-gray-500">
        {title}
      </h3>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>

    </div>
  );
}

export default StatCard;