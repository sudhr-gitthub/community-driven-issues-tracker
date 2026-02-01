import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="card h-100 border-0 shadow-sm overflow-hidden">
      {/* Image Skeleton */}
      <div className="position-relative bg-neutral-200 animate-pulse" style={{ height: '160px' }}>
        <div className="position-absolute top-0 end-0 m-2 px-3 py-2 rounded-pill bg-neutral-300 w-24"></div>
      </div>

      <div className="card-body p-4">
        {/* Category Skeleton */}
        <div className="w-20 h-4 bg-neutral-200 rounded animate-pulse mb-3"></div>
        
        {/* Title Skeleton */}
        <div className="w-full h-6 bg-neutral-300 rounded animate-pulse mb-2"></div>
        <div className="w-2/3 h-6 bg-neutral-300 rounded animate-pulse mb-4"></div>

        {/* Footer Skeleton */}
        <div className="d-flex align-items-center justify-content-between mt-auto pt-3 border-top border-light">
          <div className="d-flex align-items-center gap-2">
            <div className="w-4 h-4 bg-neutral-200 rounded-full animate-pulse"></div>
            <div className="w-16 h-3 bg-neutral-200 rounded animate-pulse"></div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className="w-4 h-4 bg-neutral-200 rounded-full animate-pulse"></div>
            <div className="w-12 h-3 bg-neutral-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
