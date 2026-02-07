interface VehicleCardProps {
  type: string;
  image: string;
  capacity: string;
  features: string[];
  priceFrom?: number;
}

export default function VehicleCard({
  type,
  image,
  capacity,
  features,
  priceFrom
}: VehicleCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
      {/* Image Container */}
      <div className="relative h-40 md:h-48 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center overflow-hidden">
        <img
          src={image}
          alt={type}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Capacity Badge */}
        <div className="absolute top-3 right-3 bg-accent-orange text-white px-3 py-1 rounded-full text-sm font-semibold">
          👥 {capacity}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        <h3 className="font-semibold text-lg text-gray-900 mb-3 group-hover:text-accent-orange transition-colors">
          {type}
        </h3>

        {/* Features */}
        <ul className="space-y-1.5 mb-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-green-500">✓</span>
              {feature}
            </li>
          ))}
        </ul>

        {/* Price */}
        {priceFrom && (
          <div className="pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">From </span>
            <span className="text-lg font-bold text-accent-orange">${priceFrom}</span>
          </div>
        )}
      </div>
    </div>
  );
}
