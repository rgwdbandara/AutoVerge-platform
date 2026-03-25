function Hero() {
  return (
    <section className="pb-20 text-white pt-28 bg-gradient-to-r from-blue-900 to-blue-700 dotted-background">
      <div className="max-w-6xl px-6 mx-auto text-center">
        <span className="inline-block px-4 py-1 mb-6 text-sm bg-blue-600 rounded-full">
          AI-Powered Smart Platform
        </span>
        <h1 className="mb-4 text-5xl font-bold leading-tight">
          Find Your Perfect Car with
          <span className="block text-green-400">AutoVerge AI</span>
        </h1>
        <p className="mb-10 text-lg text-gray-200">
          Explore your ideal car with AI-powered matching and quick results.
        </p>
        <div className="flex justify-center">
          <div className="flex w-full max-w-2xl overflow-hidden bg-white rounded-full shadow-lg">
            <input
              type="text"
              placeholder="Enter make, model, or use our AI Image Search..."
              className="flex-1 px-6 py-4 text-black outline-none"
            />
            <button className="px-8 text-white bg-black hover:bg-gray-800">
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;