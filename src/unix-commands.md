find out gzipped bundle size
`gzip -c dist/bundle.min.js | wc -c | awk '{print $1/1024}'`
