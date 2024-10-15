import React, { FC } from 'react';
import ProductCarousel from '@/components/ui/product-carousel';

const Page: FC = () => {
  return (
    <div className="mr-10 ml-10 bg-white min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to the Product Page</h1>
      <ProductCarousel />
    </div>
  );
};

export default Page;
