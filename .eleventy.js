const fs = require('fs')

module.exports = function (config) {
  // Static assets to pass through
  // config.addPassthroughCopy('./src/fonts')
  config.addPassthroughCopy('./src/img')
  config.addPassthroughCopy('./src/favicon.ico')
  config.addPassthroughCopy('./src/icon.png')
  config.addPassthroughCopy('./src/tile.png')
  config.addPassthroughCopy('./src/tile-wide.png')
  config.addPassthroughCopy('./src/manifest.json')
  config.addPassthroughCopy('./src/robots.txt')
  config.addPassthroughCopy('./src/site.webmanifest')
  config.addPassthroughCopy('./src/browserconfig.xml')

  // 404
  config.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, browserSync) {
        const content_404 = fs.readFileSync('_site/404.html')

        browserSync.addMiddleware('*', (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404)
          res.end()
        })
      },
    },
  })

  return {
    dir: {
      input: 'src',
      data: `./_data/`,
      includes: `./_includes/`,
      layouts: `./_layouts/`,
    },
    passthroughFileCopy: true,
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  }
}
