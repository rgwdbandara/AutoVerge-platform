function AIUpload(){

  return(

    <div className="p-6 bg-white rounded shadow">

      <h3 className="mb-2 text-lg font-semibold">
        AI-Powered Car Details Extraction
      </h3>

      <p className="mb-4 text-gray-500">
        Upload an image of a car and let AI extract its details
      </p>

      {/* Upload Box */}

      <div className="p-16 text-center border-2 border-dashed rounded">

        Drag & drop or click to upload car image

      </div>

      {/* How it works */}

      <div className="p-4 mt-6 rounded bg-gray-50">

        <h4 className="mb-2 font-semibold">
          How it works
        </h4>

        <ol className="space-y-1 text-sm text-gray-600">

          <li>1 Upload car image</li>
          <li>2 Extract details using AI</li>
          <li>3 Review extracted data</li>
          <li>4 Fill missing info</li>
          <li>5 Add car to inventory</li>

        </ol>

      </div>

    </div>

  )

}

export default AIUpload