export interface Project {
  slug: string
  name: string
  tagline: string
  description: string
  features: string[]
  useCase: {
    title: string
    description: string
    audiences: string[]
  }
  category: string
}

export const projects: Project[] = [
  {
    slug: 'creator-subscription-system',
    name: 'Creator Subscription System',
    tagline: 'Recurring revenue for digital creators',
    description: 'A complete subscription management system designed for content creators, educators, and digital product sellers. Manage subscriber tiers, automate billing cycles, and track recurring revenue — all integrated with local payment methods like mobile money and bank transfers.',
    features: [
      'Multiple subscription tiers with custom pricing',
      'Automated billing and payment reminders',
      'Mobile money and bank transfer integration',
      'Subscriber dashboard with usage analytics',
      'Automated access control for premium content',
      'Grace periods and failed payment handling',
      'Revenue reports and forecasting',
    ],
    useCase: {
      title: 'Who This Is For',
      description: 'Built for creators and educators who want to monetize their content with recurring subscriptions.',
      audiences: [
        'Online course creators',
        'Newsletter publishers',
        'Membership community owners',
        'Digital content creators',
        'Coaches and consultants',
      ],
    },
    category: 'Subscriptions',
  },
  {
    slug: 'payment-access-system',
    name: 'Payment & Access System',
    tagline: 'Secure payments with instant access control',
    description: 'A unified payment gateway that connects to mobile money providers and banks, with built-in access management. When a customer pays, their access is automatically granted. When payment fails or expires, access is revoked — no manual intervention required.',
    features: [
      'Multi-provider payment integration',
      'Real-time payment verification',
      'Automatic access grant/revoke',
      'Payment receipt generation',
      'Transaction history and audit logs',
      'Refund and dispute management',
      'Webhook notifications for payment events',
    ],
    useCase: {
      title: 'Who This Is For',
      description: 'Ideal for businesses that need to automate the connection between payments and product/service access.',
      audiences: [
        'SaaS product owners',
        'Event organizers selling tickets',
        'Service providers with paid access',
        'Digital product sellers',
        'Membership-based businesses',
      ],
    },
    category: 'Payments',
  },
  {
    slug: 'debt-tracking-system',
    name: 'Debt Tracking System',
    tagline: 'Never lose track of who owes what',
    description: 'A professional debt and receivables management system for businesses that extend credit to customers. Track outstanding balances, send automated reminders, log partial payments, and generate aging reports to stay on top of your cash flow.',
    features: [
      'Customer debt profiles with payment history',
      'Automated SMS and email reminders',
      'Partial payment tracking',
      'Aging reports (30/60/90 days)',
      'Payment plan management',
      'Interest and late fee calculation',
      'Export to accounting software',
    ],
    useCase: {
      title: 'Who This Is For',
      description: 'Designed for businesses that offer credit terms and need to manage receivables efficiently.',
      audiences: [
        'Wholesalers and distributors',
        'Retailers with credit customers',
        'Service businesses with invoicing',
        'Landlords and property managers',
        'Medical and professional practices',
      ],
    },
    category: 'Tracking',
  },
  {
    slug: 'internal-management-system',
    name: 'Internal Management System',
    tagline: 'Streamline your internal operations',
    description: 'A custom internal operations platform that brings together inventory, staff, tasks, and workflows in one place. Built specifically for your business processes, eliminating the need for spreadsheets and disconnected tools.',
    features: [
      'Inventory tracking with low-stock alerts',
      'Staff scheduling and attendance',
      'Task assignment and progress tracking',
      'Custom workflow automation',
      'Role-based access control',
      'Activity logs and audit trails',
      'Custom reports and dashboards',
    ],
    useCase: {
      title: 'Who This Is For',
      description: 'Perfect for growing businesses that have outgrown spreadsheets and need custom operational tools.',
      audiences: [
        'Retail stores and shops',
        'Restaurants and hospitality',
        'Manufacturing and production',
        'Service companies',
        'Non-profits and organizations',
      ],
    },
    category: 'Operations',
  },
  {
    slug: 'custom-business-dashboard',
    name: 'Custom Business Dashboard',
    tagline: 'All your business metrics in one view',
    description: 'A real-time business intelligence dashboard that pulls data from your existing systems and presents actionable insights. See sales, customers, inventory, and performance metrics at a glance — designed around the KPIs that matter to your business.',
    features: [
      'Real-time data synchronization',
      'Customizable widgets and layouts',
      'Sales and revenue tracking',
      'Customer analytics and segments',
      'Performance benchmarks and goals',
      'Automated daily/weekly reports',
      'Mobile-responsive design',
    ],
    useCase: {
      title: 'Who This Is For',
      description: 'Built for business owners and managers who need visibility into their operations without digging through multiple systems.',
      audiences: [
        'Business owners and CEOs',
        'Operations managers',
        'Sales and marketing teams',
        'Finance and accounting teams',
        'Multi-location businesses',
      ],
    },
    category: 'Analytics',
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}

export function getAllProjectSlugs(): string[] {
  return projects.map((project) => project.slug)
}
