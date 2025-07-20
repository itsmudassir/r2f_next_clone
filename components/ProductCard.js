import Image from 'next/image'

export default function ProductCard({
  id,
  title,
  brand,
  price,
  inStock,
  rating,
  reviews,
  store,
  categories = [],
  imageUrl = '/placeholder.png'
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-48 h-48 relative bg-gray-100 rounded-lg overflow-hidden">
          <div className="flex items-center justify-center h-full">
            <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm">Product Image</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="mb-2">
            <h3 className="font-bold text-lg">{id}</h3>
            <p className="font-semibold text-gray-700">{brand}</p>
          </div>
          
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Title: </span>
              <span className="text-gray-800">{title}</span>
            </div>
            
            {categories.length > 0 && (
              <div>
                <span className="text-gray-600">Categories: </span>
                <span className="text-gray-800">{categories.join(' > ')}</span>
              </div>
            )}
            
            <div>
              <span className="text-gray-600">Stores: </span>
              <span className="text-gray-800">{store}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-semibold">{rating.toFixed(1)}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600">({reviews} reviews)</span>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div>
                <span className={`font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {inStock ? 'In stock' : 'Out of stock'}
                </span>
                <p className="text-2xl font-bold text-red-600">${price}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}