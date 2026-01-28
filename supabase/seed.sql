-- Seed file for testing (optional)
-- This inserts sample data for development/testing purposes

-- Sample submission 1
INSERT INTO system_requests (
  full_name,
  business_name,
  phone,
  email,
  business_type,
  system_category,
  problem,
  goals,
  payments,
  requires_login,
  timeline,
  budget_range,
  additional_info,
  consent,
  status
) VALUES (
  'John Doe',
  'JD Media',
  '+211 912 345 678',
  'john@jdmedia.com',
  'creator_influencer',
  'creator_subscription',
  'I currently share my content for free on social media but want to monetize my premium tutorials.',
  'Accept payments from my audience and control who can access my premium content.',
  ARRAY['mobile_money', 'bank'],
  'yes',
  '2_4_weeks',
  '800_1500',
  'I have about 5000 followers on Facebook.',
  true,
  'new'
);

-- Sample submission 2
INSERT INTO system_requests (
  full_name,
  business_name,
  phone,
  email,
  business_type,
  system_category,
  problem,
  goals,
  payments,
  requires_login,
  timeline,
  budget_range,
  additional_info,
  consent,
  status
) VALUES (
  'Mary Smith',
  'Smith Hardware Store',
  '+211 923 456 789',
  NULL,
  'shop_landlord',
  'debt_tracking',
  'We sell on credit to many customers but tracking who owes what is very difficult with our paper records.',
  'Know exactly who owes us money and when they should pay.',
  ARRAY['mobile_money', 'cash_only'],
  'not_sure',
  '1_2_months',
  '1500_3000',
  NULL,
  true,
  'in_review'
);

-- Sample submission 3
INSERT INTO system_requests (
  full_name,
  business_name,
  phone,
  email,
  business_type,
  system_category,
  problem,
  goals,
  payments,
  requires_login,
  timeline,
  budget_range,
  additional_info,
  consent,
  status,
  internal_notes
) VALUES (
  'Peter Johnson',
  'Hope NGO',
  '+211 934 567 890',
  'peter@hopengo.org',
  'school_ngo',
  'internal_management',
  'We need a system to manage our staff, their roles, and internal workflows.',
  'Streamline our operations and have proper access controls.',
  ARRAY['none'],
  'yes',
  'flexible',
  '3000_plus',
  'We have about 50 staff members across 3 locations.',
  true,
  'contacted',
  'Called on Jan 15. Interested in a phased approach. Follow up next week with proposal.'
);
