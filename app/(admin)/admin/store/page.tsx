import Link from 'next/link'
import { getAllProducts } from '@/lib/store/actions'
import { formatPrice } from '@/lib/store/types'
import { getCategoryLabel } from '@/lib/store/validations'
import { Plus, Edit, Eye, ExternalLink } from 'lucide-react'

export const metadata = {
  title: 'Store Products | Admin',
}

export default async function AdminStorePage() {
  const products = await getAllProducts()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Store Products</h1>
          <p className="text-foreground-secondary mt-1">Manage your store products</p>
        </div>
        <Link
          href="/admin/store/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-foreground-secondary text-sm">Total Products</p>
          <p className="text-2xl font-bold text-foreground">{products.length}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-foreground-secondary text-sm">Published</p>
          <p className="text-2xl font-bold text-green-600">
            {products.filter((p) => p.is_published).length}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-foreground-secondary text-sm">Draft</p>
          <p className="text-2xl font-bold text-amber-600">
            {products.filter((p) => !p.is_published).length}
          </p>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {products.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-foreground-secondary mb-4">No products yet</p>
            <Link
              href="/admin/store/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create your first product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-background-secondary">
                  <th className="text-left p-4 font-medium text-foreground-secondary text-sm">Product</th>
                  <th className="text-left p-4 font-medium text-foreground-secondary text-sm">Category</th>
                  <th className="text-left p-4 font-medium text-foreground-secondary text-sm">Price</th>
                  <th className="text-left p-4 font-medium text-foreground-secondary text-sm">Status</th>
                  <th className="text-right p-4 font-medium text-foreground-secondary text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-border last:border-0 hover:bg-background-secondary/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-background-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                          {product.cover_image_path ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/store-assets/${product.cover_image_path}`}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <span className="text-xl">📦</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-xs text-foreground-muted font-mono">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-background-secondary text-foreground-secondary text-xs rounded-full">
                        {getCategoryLabel(product.category)}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-foreground">
                        {formatPrice(product.base_price_cents, product.currency)}
                      </p>
                    </td>
                    <td className="p-4">
                      {product.is_published ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          Published
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {product.is_published && (
                          <a
                            href={`/store/${product.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-foreground-secondary hover:text-foreground hover:bg-background-secondary rounded-lg transition-colors"
                            title="View public page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <Link
                          href={`/admin/store/${product.id}/edit`}
                          className="p-2 text-foreground-secondary hover:text-foreground hover:bg-background-secondary rounded-lg transition-colors"
                          title="Edit product"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
