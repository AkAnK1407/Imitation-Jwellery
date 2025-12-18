import { formatINR, discountPercent } from '@/lib/utils';

interface PriceProps {
  price: number;
  discountedPrice?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function Price({ price, discountedPrice, size = 'md' }: PriceProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl',
  };

  const strikeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
  };

  if (discountedPrice) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`font-bold text-gray-900 ${sizeClasses[size]}`}>
          {formatINR(discountedPrice)}
        </span>
        <span className={`text-gray-400 line-through ${strikeClasses[size]}`}>
          {formatINR(price)}
        </span>
        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
          {discountPercent(price, discountedPrice)}% OFF
        </span>
      </div>
    );
  }

  return (
    <span className={`font-bold text-gray-900 ${sizeClasses[size]}`}>
      {formatINR(price)}
    </span>
  );
}
