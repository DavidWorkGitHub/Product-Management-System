import Image from 'next/image';

const photographedModels = new Set([
  'acer-aspire-5',
  'acer-swift-3',
  'dell-inspiron-15',
  'dell-latitude-7440',
  'dell-xps-13',
  'dell-xps-15',
  'lenovo-ideapad-5',
  'lenovo-legion-5',
  'lenovo-thinkpad-t14',
  'lenovo-thinkpad-x1-carbon',
]);

export default function ProductPhoto({ brand, model, imageUrl, large = false }) {
  const name = brand + ' ' + model;
  const slug = name.trim().toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={large ? 'product-photo product-photo-large' : 'product-photo'}>
      {imageUrl ? (
        <Image src={imageUrl} alt={name} fill unoptimized />
      ) : photographedModels.has(slug) ? (
        <Image src={'/laptops/' + slug + '.jpg'} alt={name} fill
          sizes={large ? '(max-width: 560px) 100vw, 520px' : '(max-width: 600px) 100vw, 280px'} />
      ) : <span>No photo available</span>}
    </div>
  );
}
