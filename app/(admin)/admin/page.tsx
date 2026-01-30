import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, Badge, Button } from '@/components/ui'
import Link from 'next/link'
import {
  Package,
  ShoppingCart,
  Rocket,
  FileText,
  DollarSign,
  ArrowRight,
  Plus,
  Eye,
} from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch store statistics
  const [productsRes, ordersRes, deploymentsRes, submissionsRes] = await Promise.all([
    supabase.from('store_products').select('*', { count: 'exact' }),
    supabase.from('store_orders').select('*', { count: 'exact' }),
    supabase.from('store_deploy_requests').select('*', { count: 'exact' }).eq('status', 'new'),
    supabase.from('system_requests').select('*', { count: 'exact' }).eq('status', 'new'),
  ])

  const totalProducts = productsRes.count || 0
  const publishedProducts = productsRes.data?.filter(p => p.is_published).length || 0
  const totalOrders = ordersRes.count || 0
  const paidOrders = ordersRes.data?.filter(o => o.status === 'paid').length || 0
  const pendingDeployments = deploymentsRes.count || 0
  const newSubmissions = submissionsRes.count || 0

  // Calculate revenue
  const revenue = ordersRes.data
    ?.filter(o => o.status === 'paid')
    .reduce((sum, o) => sum + (o.amount_cents || 0), 0) || 0

  // Recent orders
  const { data: recentOrders } = await supabase
    .from('store_orders')
    .select('*, product:store_products(name)')
    .order('created_at', { ascending: false })
    .limit(5)

  // Recent products
  const { data: recentProducts } = await supabase
    .from('store_products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  const formatCurrency = (cents: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(cents / 100)
  }

  const statusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'success'
      case 'pending': return 'warning'
      case 'failed': return 'destructive'
      default: return 'default'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-900">Dashboard</h1>
          <p className="text-primary-600 mt-1">Welcome back! Here's what's happening with your store.</p>
        </div>
        <Link href="/admin/store/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold mt-1">{formatCurrency(revenue)}</p>
                <p className="text-blue-100 text-sm mt-1">{paidOrders} paid orders</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Products</p>
                <p className="text-3xl font-bold mt-1">{totalProducts}</p>
                <p className="text-purple-100 text-sm mt-1">{publishedProducts} published</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Orders</p>
                <p className="text-3xl font-bold mt-1">{totalOrders}</p>
                <p className="text-orange-100 text-sm mt-1">All time</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold mt-1">{pendingDeployments + newSubmissions}</p>
                <p className="text-green-100 text-sm mt-1">{pendingDeployments} deploys, {newSubmissions} requests</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/store/new" className="group">
          <Card className="hover:border-primary-300 transition-colors cursor-pointer h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <Plus className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-primary-900">Add New Product</h3>
                <p className="text-sm text-primary-500">List a new item in your store</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/store/orders" className="group">
          <Card className="hover:border-primary-300 transition-colors cursor-pointer h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <ShoppingCart className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-primary-900">View Orders</h3>
                <p className="text-sm text-primary-500">Manage customer orders</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/store/deployments" className="group">
          <Card className="hover:border-primary-300 transition-colors cursor-pointer h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <Rocket className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-primary-900">Deployments</h3>
                <p className="text-sm text-primary-500">Handle deployment requests</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-6 border-b border-primary-100">
              <h2 className="text-lg font-semibold text-primary-900">Recent Orders</h2>
              <Link href="/admin/store/orders" className="text-sm text-primary-600 hover:text-primary-900 flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-primary-100">
              {recentOrders && recentOrders.length > 0 ? (
                recentOrders.map((order: any) => (
                  <div key={order.id} className="p-4 flex items-center justify-between hover:bg-primary-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-primary-900 text-sm">{order.product?.name || 'Product'}</p>
                        <p className="text-xs text-primary-500">{order.buyer_name || order.buyer_phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={statusBadgeVariant(order.status) as any} className="mb-1">
                        {order.status}
                      </Badge>
                      <p className="text-xs text-primary-500">{formatCurrency(order.amount_cents, order.currency)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-primary-500">
                  <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No orders yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Products */}
        <Card>
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-6 border-b border-primary-100">
              <h2 className="text-lg font-semibold text-primary-900">Your Products</h2>
              <Link href="/admin/store" className="text-sm text-primary-600 hover:text-primary-900 flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-primary-100">
              {recentProducts && recentProducts.length > 0 ? (
                recentProducts.map((product: any) => (
                  <div key={product.id} className="p-4 flex items-center justify-between hover:bg-primary-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {product.cover_image_path ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/store-assets/${product.cover_image_path}`}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-5 h-5 text-primary-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-primary-900 text-sm">{product.name}</p>
                        <p className="text-xs text-primary-500">{product.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={product.is_published ? 'success' : 'default'}>
                        {product.is_published ? 'Published' : 'Draft'}
                      </Badge>
                      <Link href={`/admin/store/${product.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-primary-500">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No products yet</p>
                  <Link href="/admin/store/new">
                    <Button variant="outline" size="sm" className="mt-2">
                      Add your first product
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
