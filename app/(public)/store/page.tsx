import type { Metadata } from 'next'
import Link from 'next/link'
import { Button, ScrollReveal, Section } from '@/components/ui'
import { StoreHeroIllustration } from '@/components/illustrations/StoreIllustration'
import { getPublishedProducts } from '@/lib/store/actions'
import { formatPrice } from '@/lib/store/types'
import { getCategoryLabel } from '@/lib/store/validations'
import { ArrowRight, ExternalLink, ShoppingCart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Store',
  description: 'Browse ready-to-deploy web systems for creators and businesses. Subscription systems, payment systems, tracking systems, and more.',
  openGraph: {
    title: 'Store | Jambi Systems',
    description: 'Browse ready-to-deploy web systems for creators and businesses.',
  },
}

export const revalidate = 60

export default async function StorePage() {
  const products = await getPublishedProducts()

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        
        <div className="container-wide relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <ScrollReveal>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
                  Store
                </h1>
              </ScrollReveal>
              
              <ScrollReveal delay={0.1}>
                <p className="text-xl md:text-2xl text-foreground-secondary mb-6">
                  Ready-to-deploy systems for your business
                </p>
              </ScrollReveal>
              
              <ScrollReveal delay={0.2}>
                <p className="text-foreground-secondary text-lg max-w-xl mx-auto lg:mx-0 mb-8">
                  Browse our collection of professionally built web systems. Each product comes with source code, documentation, and optional deployment service.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="#products">
                    <Button size="lg" className="group w-full sm:w-auto">
                      Browse Products
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="/store/license">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      License Info
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.2}>
              <div className="mt-8 lg:mt-0">
                <StoreHeroIllustration />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <Section id="products" size="lg">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
              Available Systems
            </h2>
            <p className="text-foreground-secondary text-lg max-w-2xl mx-auto">
              Each system is production-ready and comes with everything you need to get started.
            </p>
          </div>
        </ScrollReveal>

        {products.length === 0 ? (
          <ScrollReveal>
            <div className="text-center py-16 bg-card rounded-2xl border border-border">
              <ShoppingCart className="w-12 h-12 text-foreground-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No products available yet</h3>
              <p className="text-foreground-secondary mb-6">Check back soon for new systems.</p>
              <Link href="/request">
                <Button>Request a Custom System</Button>
              </Link>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <ScrollReveal key={product.id} delay={index * 0.1}>
                <article className="group bg-card rounded-2xl border border-border hover:border-accent/50 hover:shadow-card-hover transition-all duration-300 overflow-hidden h-full flex flex-col">
                  {/* Cover Image */}
                  <div className="relative aspect-video bg-background-secondary overflow-hidden">
                    {product.cover_image_path ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/store-assets/${product.cover_image_path}`}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl">📦</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-background/90 backdrop-blur-sm text-foreground-secondary text-xs font-medium rounded-full">
                        {getCategoryLabel(product.category)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-foreground-secondary text-sm mb-4 line-clamp-2 flex-grow">
                      {product.summary}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-sm text-foreground-secondary">Starting from</span>
                      <span className="text-2xl font-bold text-accent">
                        {formatPrice(product.base_price_cents, product.currency)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      {product.demo_url && (
                        <a
                          href={product.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <Button variant="outline" size="sm" className="w-full">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Demo
                          </Button>
                        </a>
                      )}
                      <Link href={`/store/${product.slug}`} className="flex-1">
                        <Button size="sm" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        )}
      </Section>

      {/* CTA Section */}
      <Section variant="dark" size="lg">
        <div className="container-narrow text-center">
          <ScrollReveal>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground-on-dark mb-4">
              Need a custom system?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="text-foreground-on-dark-secondary text-lg mb-8 max-w-xl mx-auto">
              If you don't see what you need, we can build a custom system tailored to your business requirements.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <Link href="/request">
              <Button variant="secondary" size="lg" className="group">
                Request a Custom System
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </Section>
    </>
  )
}
