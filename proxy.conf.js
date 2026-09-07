const staging = "https://digitalservices-test.mondino.it";

const target = staging;

const proxyRoutes = [
  "/api",
  "/uaa",
  "/sso",
  "/profile-manager",
  "/enumeration",
  "/news",
  "/medical-booking",
  "/payment",
  "/checkin",
  "/management-privacy-consent",
  "/cbim-idp-token-exchange",
];

module.exports = Object.fromEntries(
  proxyRoutes.map((route) => [
    route,
    {
      target,
      secure: false,
      changeOrigin: true,
    },
  ])
);
