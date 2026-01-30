'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createProduct, updateProduct, deleteProduct, uploadProductImage, deleteProductImage } from '@/lib/store/actions'
import { PRODUCT_CATEGORIES } from '@/lib/store/validations'
import type { StoreProduct } from '@/lib/store/types'
import { Loader2, Trash2, Plus, X, Upload, Image as ImageIcon } from 'lucide-react'

interface ProductFormProps {
  product?: StoreProduct
}

const MAX_SCREENSHOTS = 5
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(product?.name || '')
  const [slug, setSlug] = useState(product?.slug || '')
  const [summary, setSummary] = useState(product?.summary || '')
  const [description, setDescription] = useState(product?.description || '')
  const [category, setCategory] = useState(product?.category || '')
  const [basePriceCents, setBasePriceCents] = useState(product?.base_price_cents?.toString() || '')
  const [currency, setCurrency] = useState(product?.currency || 'USD')
  const [multiUsePriceCents, setMultiUsePriceCents] = useState(product?.multi_use_price_cents?.toString() || '0')
  const [deployAddonPriceCents, setDeployAddonPriceCents] = useState(product?.deploy_addon_price_cents?.toString() || '0')
  const [demoUrl, setDemoUrl] = useState(product?.demo_url || '')
  const [supportInfo, setSupportInfo] = useState(product?.support_info || '')
  const [isPublished, setIsPublished] = useState(product?.is_published || false)
  const [whatsIncluded, setWhatsIncluded] = useState<string[]>(product?.whats_included || [])
  const [requirements, setRequirements] = useState<string[]>(product?.requirements || [])
  const [newIncludedItem, setNewIncludedItem] = useState('')
  const [newRequirement, setNewRequirement] = useState('')
  const [screenshots, setScreenshots] = useState<string[]>(product?.gallery_image_paths || [])

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleNameChange = (value: string) => {
    setName(value)
    if (!product) {
      setSlug(generateSlug(value))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const data = {
      name,
      slug,
      summary,
      description,
      category,
      base_price_cents: parseInt(basePriceCents) || 0,
      currency,
      multi_use_price_cents: parseInt(multiUsePriceCents) || 0,
      deploy_addon_price_cents: parseInt(deployAddonPriceCents) || 0,
      demo_url: demoUrl || undefined,
      support_info: supportInfo || undefined,
      is_published: isPublished,
      whats_included: whatsIncluded.length > 0 ? whatsIncluded : undefined,
      requirements: requirements.length > 0 ? requirements : undefined,
      gallery_image_paths: screenshots.length > 0 ? screenshots : undefined,
    }

    startTransition(async () => {
      const result = product
        ? await updateProduct(product.id, data)
        : await createProduct(data)

      if (!result.success) {
        setError(result.error || 'An error occurred')
        return
      }

      router.push('/admin/store')
      router.refresh()
    })
  }

  const handleDelete = async () => {
    if (!product) return

    startTransition(async () => {
      const result = await deleteProduct(product.id)
      if (!result.success) {
        setError(result.error || 'Failed to delete product')
        return
      }
      router.push('/admin/store')
      router.refresh()
    })
  }

  const addIncludedItem = () => {
    if (newIncludedItem.trim()) {
      setWhatsIncluded([...whatsIncluded, newIncludedItem.trim()])
      setNewIncludedItem('')
    }
  }

  const removeIncludedItem = (index: number) => {
    setWhatsIncluded(whatsIncluded.filter((_, i) => i !== index))
  }

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setRequirements([...requirements, newRequirement.trim()])
      setNewRequirement('')
    }
  }

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (screenshots.length >= MAX_SCREENSHOTS) {
      setError(`Maximum ${MAX_SCREENSHOTS} screenshots allowed`)
      return
    }

    setUploadingImage(true)
    setError(null)

    try {
      const file = files[0]
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'screenshots')

      const result = await uploadProductImage(formData)
      
      if (!result.success) {
        setError(result.error || 'Failed to upload image')
        return
      }

      if (result.path) {
        setScreenshots([...screenshots, result.path])
      }
    } catch (err) {
      setError('Failed to upload image')
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveScreenshot = async (index: number) => {
    const path = screenshots[index]
    setScreenshots(screenshots.filter((_, i) => i !== index))
    
    // Optionally delete from storage
    if (path) {
      await deleteProductImage(path)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* Basic Info */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-semibold text-foreground mb-4">Basic Information</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
              Product Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-foreground mb-1">
              Slug *
            </label>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
            <p className="text-xs text-foreground-muted mt-1">URL: /store/{slug || 'your-slug'}</p>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-foreground mb-1">
              Category *
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              required
            >
              <option value="">Select a category</option>
              {PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-foreground mb-1">
              Summary *
            </label>
            <input
              id="summary"
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Brief one-line description"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
              Full Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-y"
              placeholder="Detailed description of the product..."
              required
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-semibold text-foreground mb-4">Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="base_price" className="block text-sm font-medium text-foreground mb-1">
              Base Price (cents) *
            </label>
            <input
              id="base_price"
              type="number"
              value={basePriceCents}
              onChange={(e) => setBasePriceCents(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="50000 = $500.00"
              required
            />
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-foreground mb-1">
              Currency
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="USD">USD</option>
              <option value="SSP">SSP</option>
            </select>
          </div>

          <div>
            <label htmlFor="multi_use_price" className="block text-sm font-medium text-foreground mb-1">
              Multi-Use License Extra (cents)
            </label>
            <input
              id="multi_use_price"
              type="number"
              value={multiUsePriceCents}
              onChange={(e) => setMultiUsePriceCents(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="25000 = $250.00"
            />
          </div>

          <div>
            <label htmlFor="deploy_addon_price" className="block text-sm font-medium text-foreground mb-1">
              Deploy Add-on Price (cents)
            </label>
            <input
              id="deploy_addon_price"
              type="number"
              value={deployAddonPriceCents}
              onChange={(e) => setDeployAddonPriceCents(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="10000 = $100.00"
            />
          </div>
        </div>
      </div>

      {/* What's Included */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-semibold text-foreground mb-4">What's Included</h2>
        <div className="space-y-3">
          {whatsIncluded.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="flex-grow px-3 py-2 bg-background-secondary rounded-lg text-foreground text-sm">
                {item}
              </span>
              <button
                type="button"
                onClick={() => removeIncludedItem(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              type="text"
              value={newIncludedItem}
              onChange={(e) => setNewIncludedItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIncludedItem())}
              className="flex-grow px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Add an item..."
            />
            <button
              type="button"
              onClick={addIncludedItem}
              className="px-4 py-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-semibold text-foreground mb-4">Requirements</h2>
        <div className="space-y-3">
          {requirements.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="flex-grow px-3 py-2 bg-background-secondary rounded-lg text-foreground text-sm">
                {item}
              </span>
              <button
                type="button"
                onClick={() => removeRequirement(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              type="text"
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
              className="flex-grow px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Add a requirement..."
            />
            <button
              type="button"
              onClick={addRequirement}
              className="px-4 py-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Screenshots */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-semibold text-foreground mb-4">
          Screenshots ({screenshots.length}/{MAX_SCREENSHOTS})
        </h2>
        <p className="text-sm text-foreground-secondary mb-4">
          Upload up to {MAX_SCREENSHOTS} screenshots of your product. Recommended size: 1280x720 or 1920x1080.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {screenshots.map((path, index) => (
            <div key={index} className="relative group aspect-video bg-background-secondary rounded-lg overflow-hidden border border-border">
              <img
                src={`${SUPABASE_URL}/storage/v1/object/public/store-assets/${path}`}
                alt={`Screenshot ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveScreenshot(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded">
                {index + 1}
              </div>
            </div>
          ))}
          
          {screenshots.length < MAX_SCREENSHOTS && (
            <label className="aspect-video bg-background-secondary rounded-lg border-2 border-dashed border-border hover:border-accent cursor-pointer flex flex-col items-center justify-center transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploadingImage}
              />
              {uploadingImage ? (
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-foreground-muted mb-2" />
                  <span className="text-sm text-foreground-muted">Add Screenshot</span>
                </>
              )}
            </label>
          )}
        </div>
      </div>

      {/* Links & Support */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-semibold text-foreground mb-4">Links & Support</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="demo_url" className="block text-sm font-medium text-foreground mb-1">
              Demo URL
            </label>
            <input
              id="demo_url"
              type="url"
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="https://demo.example.com"
            />
          </div>

          <div>
            <label htmlFor="support_info" className="block text-sm font-medium text-foreground mb-1">
              Support Information
            </label>
            <textarea
              id="support_info"
              value={supportInfo}
              onChange={(e) => setSupportInfo(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-y"
              placeholder="Describe the support included with this product..."
            />
          </div>
        </div>
      </div>

      {/* Publishing */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-semibold text-foreground mb-4">Publishing</h2>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="w-5 h-5 rounded border-border text-accent focus:ring-accent"
          />
          <div>
            <p className="font-medium text-foreground">Publish product</p>
            <p className="text-sm text-foreground-secondary">Make this product visible in the store</p>
          </div>
        </label>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div>
          {product && (
            <>
              {showDeleteConfirm ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-red-600">Delete this product?</span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isPending}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Yes, delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-1 bg-background-secondary text-foreground text-sm rounded-lg hover:bg-background transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-foreground-secondary hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {product ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </div>
    </form>
  )
}
