import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/store/actions'
import { ScrollReveal, Section } from '@/components/ui'
import { CheckoutIllustration } from '@/components/illustrations/StoreIllustration'
import { CheckoutForm } from './checkout-form'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  
  if (!product) {
    return { title: 'Product Not Found' }
  }

  return {
    title: `Checkout - ${product.name}`,
    description: `Complete your purchase of ${product.name}`,
  }
}

export default async function CheckoutPage({ params }: PageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
      
      <div className="container-wide relative">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
                Checkout
              </h1>
              <p className="text-foreground-secondary text-lg">
                Complete your purchase of <span className="font-semibold text-foreground">{product.name}</span>
              </p>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-3">
              <ScrollReveal delay={0.1}>
                <CheckoutForm product={product} />
              </ScrollReveal>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-2">
              <ScrollReveal delay={0.2}>
                <div className="sticky top-24">
                  <div className="hidden lg:block mb-6">
                    <CheckoutIllustration />
                  </div>
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <h3 className="font-semibold text-foreground mb-4">Secure Checkout</h3>
                    <div className="space-y-3 text-sm text-foreground-secondary">
                      <div className="flex items-start gap-3">
                        <span className="text-accent">✓</span>
                        <span>Secure payment via PaySSD</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-accent">✓</span>
                        <span>Instant access after payment</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-accent">✓</span>
                        <span>License key delivered via email</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-accent">✓</span>
                        <span>Optional deployment service</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
