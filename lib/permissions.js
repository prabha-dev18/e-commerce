// Role matrix. Admin can do everything. 'settings' and 'users' are admin-only.
export const ROLE_PERMS = {
  manager: ['dashboard', 'products', 'categories', 'brands', 'orders', 'customers', 'reviews', 'coupons', 'banners', 'blog', 'newsletter', 'returns', 'pages', 'messages'],
  support: ['dashboard', 'orders', 'customers', 'reviews', 'returns', 'messages'],
};
export const can = (role, perm) => role === 'admin' || (ROLE_PERMS[role] || []).includes(perm);
export const ADMIN_NAV = [
  ['dashboard', 'Dashboard', '/admin'], ['orders', 'Orders', '/admin/orders'], ['products', 'Products', '/admin/products'], ['categories', 'Categories', '/admin/categories'], ['brands', 'Brands', '/admin/brands'],
  ['customers', 'Customers', '/admin/customers'], ['reviews', 'Reviews', '/admin/reviews'], ['returns', 'Returns', '/admin/returns'], ['coupons', 'Coupons', '/admin/coupons'], ['banners', 'Banners & home', '/admin/banners'],
  ['blog', 'Blog', '/admin/blog'], ['pages', 'Pages', '/admin/pages'], ['newsletter', 'Newsletter', '/admin/newsletter'], ['messages', 'Messages', '/admin/messages'], ['settings', 'Settings', '/admin/settings'],
];
