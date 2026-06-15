import { Link } from 'react-router-dom'

function StarRating({ rating }) {
  return (
    <span className="flex items-center gap-1 text-sm">
      <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <span className="font-medium text-gray-800">{rating}</span>
    </span>
  )
}

export default function HomestayCard({ homestay }) {
  const {
    _id,
    name,
    village,
    district,
    pricePerNight,
    averageRating,
    totalReviews,
    imageUrls = [],
    propertyType,
  } = homestay

  const coverImage = imageUrls[0] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80'

  return (
    <Link
      to={`/homestays/${_id}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm
                 hover:shadow-md transition-shadow duration-200 border border-gray-100"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={coverImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {propertyType && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-forest-800
                           text-xs font-medium px-2 py-1 rounded-full">
            {propertyType}
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 leading-snug group-hover:text-forest-800 transition-colors">
            {name}
          </h3>
          {averageRating > 0 && <StarRating rating={averageRating.toFixed(1)} />}
        </div>

        <p className="text-sm text-gray-500 mb-3">
          {village}, {district}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-forest-900 text-lg">
              ₹{pricePerNight?.toLocaleString('en-IN')}
            </span>
            <span className="text-gray-400 text-sm"> / night</span>
          </div>
          {totalReviews > 0 && (
            <span className="text-xs text-gray-400">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</span>
          )}
        </div>
      </div>
    </Link>
  )
}