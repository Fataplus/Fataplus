export default {
  logo: <span>FataPlus Documentation</span>,
  project: {
    link: 'https://github.com/Fataplus/Fataplus',
  },
  docsRepositoryBase: 'https://github.com/Fataplus/Fataplus/tree/main/apps/docs',
  footer: {
    text: `© ${new Date().getFullYear()} FataPlus. All rights reserved.`,
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – FataPlus Docs'
    }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="FataPlus: Documentation for the agricultural marketplace platform" />
      <meta name="og:title" content="FataPlus Documentation" />
    </>
  ),
};
