'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCategories } from '../store/categorySlice';

export default function Navigation() {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">Veggie Quiz</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {categories?.length > 0 && categories.map((category: string) => (
              <Link
                key={`category-${category}`}
                href={`/category/${category.toLowerCase()}`}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}