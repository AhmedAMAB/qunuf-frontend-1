import PropertySectionHeader from './PropertySectionHeader';

const PropertyDetailsSection: React.FC<{ details: { label: string; value: string }[], title: string }> = ({ details, title }) => (
  <div className="px-4">
    <PropertySectionHeader title={title} />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {details.map(({ label, value }, idx) => (
        <div 
          key={idx} 
          className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
        >
          <span className="text-sm md:text-base font-semibold text-gray-600">{label}:</span>
          <span className="text-base md:text-lg font-semibold text-secondary">{value}</span>
        </div>
      ))}
    </div>
  </div>
);
export default PropertyDetailsSection;
