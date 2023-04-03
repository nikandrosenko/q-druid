const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "/User", component: () => import("pages/UserPage.vue") },
      {
        path: "/Auth",
        component: () => import("pages/AuthAndReg.vue"),
        children: [
          {
            path: "/AuthPerson",
            component: () => import("components/Auth.vue"),
          },
        ],
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
