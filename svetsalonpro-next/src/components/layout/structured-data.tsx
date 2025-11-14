import { buildLocalBusinessSchema } from '@/lib/seo';

export function StructuredData() {
  const localBusiness = buildLocalBusinessSchema();

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
    </>
  );
}
