import { ProductForm } from '../product-form'

export const metadata = {
  title: 'New Product | Admin',
}

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Create Product</h1>
        <p className="text-foreground-secondary mt-1">Add a new product to your store</p>
      </div>

      <ProductForm />
    </div>
  )
}
