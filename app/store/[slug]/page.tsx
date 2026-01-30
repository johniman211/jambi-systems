import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button, ScrollReveal, Section } from '@/components/ui'
import { ProductHeroIllustration } from '@/components/illustrations/StoreIllustration'
import { getProductBySlug, getPublishedProducts } from '@/lib/store/actions'
import { formatPrice } from '@/lib/store/types'
import { getCategoryLabel } from '@/lib/store/validations'
import { ArrowRight, Check, ExternalLink, Shield, Headphones, Package } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const products = await getPublishedProducts()
  return products.map((product) => ({
    slug: product.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  
  if (!product) {
    return { title: 'Product Not Found' }
  }

  return {
    title: product.name,
    description: product.summary,
    openGraph: {
      title: `${product.name} | Jambi Systems Store`,
      description: product.summary,
    },
  }
}

export const revalidate = 60

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.summary,
    offers: {
      '@type': 'Offer',
      price: product.base_price_cents / 100,
      priceCurrency: product.currency,
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        
        <div className="container-wide relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <ScrollReveal>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full mb-6">
                  {getCategoryLabel(product.category)}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4">
                  {product.name}
                </h1>
              </ScrollReveal>
              
              <ScrollReveal delay={0.2}>
                <p className="text-xl text-foreground-secondary mb-6">
                  {product.summary}
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-sm text-foreground-secondary">Starting from</span>
                  <span className="text-3xl md:text-4xl font-bold text-accent">
                    {formatPrice(product.base_price_cents, product.currency)}
                  </span>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.4}>
                <div className="flex items-center gap-2 text-sm text-foreground-secondary mb-8">
                  <Shield className="w-4 h-4 text-accent" />
                  <span>Single-organization license included</span>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.5}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href={`/store/checkout/${product.slug}`}>
                    <Button size="lg" className="group w-full sm:w-auto">
                      Buy Now
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  {product.demo_url && (
                    <a href={product.demo_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="lg" className="w-full sm:w-auto">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Demo
                      </Button>
                    </a>
                  )}
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.2}>
              <div className="mt-8 lg:mt-0">
                <ProductHeroIllustration category={product.category} />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Screenshots Gallery */}
      {product.gallery_image_paths && product.gallery_image_paths.length > 0 && (
        <Section>
          <ScrollReveal>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-8 text-center">
              Screenshots
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.gallery_image_paths.map((path, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="aspect-video bg-background-secondary rounded-xl overflow-hidden border border-border">
                  <img
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/store-assets/${path}`}
                    alt={`${product.name} screenshot ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Section>
      )}

      {/* Description & Details */}
      <Section className="bg-background-secondary">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Description */}
          <div className="lg:col-span-2">
            <ScrollReveal>
              <h2 className="text-2xl font-bold text-foreground mb-6">Overview</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-foreground-secondary whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            </ScrollReveal>

            {/* What's Included */}
            {product.whats_included && product.whats_included.length > 0 && (
              <ScrollReveal delay={0.1}>
                <div className="mt-10">
                  <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-accent" />
                    What's Included
                  </h3>
                  <ul className="space-y-3">
                    {product.whats_included.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                          <Check className="w-3 h-3 text-accent" />
                        </div>
                        <span className="text-foreground-secondary">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            )}

            {/* Requirements */}
            {product.requirements && product.requirements.length > 0 && (
              <ScrollReveal delay={0.2}>
                <div className="mt-10">
                  <h3 className="text-xl font-bold text-foreground mb-4">Requirements</h3>
                  <ul className="space-y-2">
                    {product.requirements.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-foreground-secondary">
                        <span className="text-accent">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ScrollReveal delay={0.2}>
              <div className="sticky top-24 space-y-6">
                {/* Price Card */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="text-center mb-6">
                    <p className="text-sm text-foreground-secondary mb-2">Starting from</p>
                    <p className="text-3xl font-bold text-accent">
                      {formatPrice(product.base_price_cents, product.currency)}
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                      <Check className="w-4 h-4 text-accent" />
                      <span>Single-organization license</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                      <Check className="w-4 h-4 text-accent" />
                      <span>Source code access</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                      <Check className="w-4 h-4 text-accent" />
                      <span>Documentation</span>
                    </div>
                  </div>

                  {product.multi_use_price_cents > 0 && (
                    <p className="text-xs text-foreground-muted text-center mb-4">
                      Multi-use license: +{formatPrice(product.multi_use_price_cents, product.currency)}
                    </p>
                  )}

                  {product.deploy_addon_price_cents > 0 && (
                    <p className="text-xs text-foreground-muted text-center mb-4">
                      Deploy for you: +{formatPrice(product.deploy_addon_price_cents, product.currency)}
                    </p>
                  )}

                  <Link href={`/store/checkout/${product.slug}`} className="block">
                    <Button size="lg" className="w-full group">
                      Buy Now
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>

                {/* Support Info */}
                {product.support_info && (
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Headphones className="w-5 h-5 text-accent" />
                      Support
                    </h3>
                    <p className="text-sm text-foreground-secondary">
                      {product.support_info}
                    </p>
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section variant="dark" size="lg">
        <div className="container-narrow text-center">
          <ScrollReveal>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground-on-dark mb-4">
              Ready to get started?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="text-foreground-on-dark-secondary text-lg mb-8 max-w-xl mx-auto">
              Purchase {product.name} today and have it running in your business within hours.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/store/checkout/${product.slug}`}>
                <Button variant="secondary" size="lg" className="group">
                  Buy Now
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/request">
                <Button variant="outline" size="lg" className="border-white/20 text-foreground-on-dark hover:bg-white/10">
                  Request Custom System
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </Section>
    </>
  )
}
