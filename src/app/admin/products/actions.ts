'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const priceStr = formData.get('price') as string;
  const image = formData.get('image') as string;
  const imagesStr = formData.get('images') as string;
  const colorsStr = formData.get('colors') as string;
  const stockStr = formData.get('stock') as string;
  const category = formData.get('category') as string;

  console.log('Form data received:', { name, description, priceStr, image, imagesStr, colorsStr, stockStr, category });

  // Basic validation
  if (!name?.trim() || !description?.trim() || !priceStr?.trim() || !image?.trim() || !stockStr?.trim()) {
    throw new Error('All fields are required and cannot be empty');
  }

  const price = parseFloat(priceStr);
  const stock = parseInt(stockStr);
  const images = imagesStr ? JSON.parse(imagesStr) : [];
  const colors = colorsStr ? JSON.parse(colorsStr) : [];

  if (isNaN(price) || price <= 0) {
    throw new Error('Price must be a valid positive number');
  }

  if (isNaN(stock) || stock < 0) {
    throw new Error('Stock must be a valid non-negative number');
  }

  try {
    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        price,
        image: image.trim(),
        images,
        colors,
        stock,
        category: category?.trim() || 'Uncategorized',
      },
    });

    console.log('Product created successfully:', product);
    redirect('/admin/products');
  } catch (error) {
    // Don't treat NEXT_REDIRECT as an error - it's the expected redirect behavior
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error; // Re-throw the redirect
    }
    console.error('Product creation error:', error);
    throw new Error(`Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const priceStr = formData.get('price') as string;
  const image = formData.get('image') as string;
  const imagesStr = formData.get('images') as string;
  const colorsStr = formData.get('colors') as string;
  const stockStr = formData.get('stock') as string;
  const category = formData.get('category') as string;

  console.log('Update form data received:', { id, name, description, priceStr, image, imagesStr, colorsStr, stockStr, category });

  // Basic validation
  if (!name?.trim() || !description?.trim() || !priceStr?.trim() || !image?.trim() || !stockStr?.trim()) {
    throw new Error('All fields are required and cannot be empty');
  }

  const price = parseFloat(priceStr);
  const stock = parseInt(stockStr);
  const images = imagesStr ? JSON.parse(imagesStr) : [];
  const colors = colorsStr ? JSON.parse(colorsStr) : [];

  if (isNaN(price) || price <= 0) {
    throw new Error('Price must be a valid positive number');
  }

  if (isNaN(stock) || stock < 0) {
    throw new Error('Stock must be a valid non-negative number');
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description.trim(),
        price,
        image: image.trim(),
        images,
        colors,
        stock,
        category: category?.trim() || 'Uncategorized',
      },
    });

    console.log('Product updated successfully:', product);
    redirect('/admin/products');
  } catch (error) {
    // Don't treat NEXT_REDIRECT as an error - it's the expected redirect behavior
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error; // Re-throw the redirect
    }
    console.error('Product update error:', error);
    throw new Error(`Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });

    redirect('/admin/products');
  } catch (error) {
    // Don't treat NEXT_REDIRECT as an error - it's the expected redirect behavior
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error; // Re-throw the redirect
    }
    console.error('Product deletion error:', error);
    throw new Error(`Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}