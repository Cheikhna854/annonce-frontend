import { useState } from 'react';
import { imageUrl } from '../api/imageUrl';

const PLACEHOLDER = '/images/annonce-placeholder.svg';

const AnnonceImage = ({ src, alt = '', loading = 'lazy', ...props }) => {
  const [failed, setFailed] = useState(false);
  return (
    <img
      {...props}
      src={failed ? PLACEHOLDER : imageUrl(src)}
      alt={alt}
      loading={loading}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
};

export default AnnonceImage;
