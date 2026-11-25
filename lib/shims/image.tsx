import React from 'react';

export default function Image({
  src,
  alt = '',
  width,
  height,
  className = '',
  style,
  fill,
  priority,
  sizes,
  ...props
}: any) {
  const fillStyle: React.CSSProperties = fill
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        ...style,
      }
    : style;

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={fillStyle}
      loading={priority ? 'eager' : 'lazy'}
      {...props}
    />
  );
}
