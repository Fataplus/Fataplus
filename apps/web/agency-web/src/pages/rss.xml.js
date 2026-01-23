import rss, { pagesGlobToRssItems } from '@astrojs/rss';
export async function GET(context) {
  return rss({
    title: 'Fataplus Agency',
    description: 'Fataplus is a product design agency. We build digital products that help businesses grow.',
    site: context.site,
    items: await pagesGlobToRssItems(
      import.meta.glob('./blog/*.{md,mdx}'),
    ),
  });
}