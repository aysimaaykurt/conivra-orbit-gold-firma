import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Explicitly disable pages directory to ensure App Router only
  experimental: {
    // Ensure we're using App Router
  },
};

export default withNextIntl(nextConfig);
