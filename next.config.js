const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  reloadOnOnline: true,
});

module.exports = withPWA({
  // Your Next.js config
});
