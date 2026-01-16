import PropertySectionHeader from './PropertySectionHeader';
import { BiCheckCircle } from 'react-icons/bi';

const PropertyFeaturesSection: React.FC<{ features: string[], title: string }> = ({ features, title }) => (
    <div className="px-4">
        <PropertySectionHeader title={title} />
        <div className="flex flex-wrap gap-3 mt-4">
            {features.map((feature, idx) => (
                <div
                    key={idx}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-full border border-secondary/20 hover:bg-secondary/20 transition-colors"
                >
                    <BiCheckCircle className="text-lg shrink-0" />
                    <span className="text-sm md:text-base font-medium">{feature}</span>
                </div>
            ))}
        </div>
    </div>
);

export default PropertyFeaturesSection;
