import { notFound } from 'next/navigation'
import { getProductById } from '@/lib/store/actions'
import { ProductForm } from '../../product-form'

interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: 'Edit Product | Admin',
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Edit Product</h1>
        <p className="text-foreground-secondary mt-1">Update {product.name}</p>
      </div>

      <ProductForm product={product} />
    </div>
  )
}
