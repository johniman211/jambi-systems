import { Card, CardContent } from '@/components/ui'
import { Settings, CreditCard, Mail, Globe, Shield } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-900">Settings</h1>
        <p className="text-primary-600 mt-1">Configure your store and integrations</p>
      </div>

      <div className="grid gap-6">
        {/* PaySSD Integration */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-primary-900">PaySSD Payment Gateway</h2>
                <p className="text-primary-600 mt-1 text-sm">
                  Connect your PaySSD account to accept payments via mobile money and bank transfers.
                </p>
                
                <div className="mt-4 p-4 bg-primary-50 rounded-lg">
                  <h3 className="font-medium text-primary-900 mb-3">Configuration Steps:</h3>
                  <ol className="space-y-3 text-sm text-primary-700">
                    <li className="flex gap-2">
                      <span className="w-6 h-6 bg-primary-200 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                      <div>
                        <p className="font-medium">Get your API Key</p>
                        <p className="text-primary-500">Go to <a href="https://www.payssd.com/dashboard/api-keys" target="_blank" rel="noopener" className="text-blue-600 hover:underline">PaySSD Dashboard → API Keys</a></p>
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <span className="w-6 h-6 bg-primary-200 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                      <div>
                        <p className="font-medium">Add Environment Variables</p>
                        <p className="text-primary-500">In Vercel, add <code className="bg-primary-200 px-1 rounded">PAYSSD_SECRET_KEY</code> and <code className="bg-primary-200 px-1 rounded">PAYSSD_WEBHOOK_SECRET</code></p>
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <span className="w-6 h-6 bg-primary-200 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                      <div>
                        <p className="font-medium">Configure Webhook</p>
                        <p className="text-primary-500">In PaySSD Dashboard → Webhooks, add:</p>
                        <code className="block mt-1 bg-primary-200 px-2 py-1 rounded text-xs break-all">
                          https://www.jambisystems.com/api/webhooks/payssd
                        </code>
                      </div>
                    </li>
                  </ol>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${process.env.PAYSSD_SECRET_KEY ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span className="text-sm text-primary-600">
                    {process.env.PAYSSD_SECRET_KEY ? 'Connected' : 'Not configured'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-primary-900">Email Notifications</h2>
                <p className="text-primary-600 mt-1 text-sm">
                  Configure email notifications for orders and customer communications.
                </p>
                
                <div className="mt-4 grid gap-3">
                  <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                    <div>
                      <p className="font-medium text-primary-900 text-sm">Admin Email</p>
                      <p className="text-xs text-primary-500">Receives order and deployment notifications</p>
                    </div>
                    <code className="text-sm bg-primary-200 px-2 py-1 rounded">
                      {process.env.ADMIN_EMAIL || 'Not set'}
                    </code>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                    <div>
                      <p className="font-medium text-primary-900 text-sm">SMTP Provider</p>
                      <p className="text-xs text-primary-500">Gmail SMTP for sending emails</p>
                    </div>
                    <span className={`text-sm px-2 py-1 rounded ${process.env.GMAIL_SMTP_USER ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {process.env.GMAIL_SMTP_USER ? 'Configured' : 'Not set'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Site Settings */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-primary-900">Site Configuration</h2>
                <p className="text-primary-600 mt-1 text-sm">
                  General settings for your website.
                </p>
                
                <div className="mt-4 grid gap-3">
                  <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                    <div>
                      <p className="font-medium text-primary-900 text-sm">Site URL</p>
                      <p className="text-xs text-primary-500">Your website's public URL</p>
                    </div>
                    <code className="text-sm bg-primary-200 px-2 py-1 rounded">
                      {process.env.NEXT_PUBLIC_SITE_URL || 'https://jambisystems.com'}
                    </code>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                    <div>
                      <p className="font-medium text-primary-900 text-sm">Supabase</p>
                      <p className="text-xs text-primary-500">Database and storage provider</p>
                    </div>
                    <span className={`text-sm px-2 py-1 rounded ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Connected' : 'Not configured'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-primary-900">Security</h2>
                <p className="text-primary-600 mt-1 text-sm">
                  Security settings and environment variable management.
                </p>
                
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> Environment variables should be managed through your hosting provider (Vercel). 
                    Never expose secret keys in client-side code.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
