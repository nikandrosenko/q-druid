const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", name: "home", component: () => import("pages/MainPage.vue") },
      {
        path: "/group",
        name: "group",
        component: () => import("pages/GroupPage.vue"),
      },
      {
        path: "/:id",
        name: "page",
        component: () => import("pages/Page.vue"),
      },
    ],
  },
  {
    path: "/auth",
    component: () => import("pages/AuthAndReg.vue"),
    children: [
      {
        path: "/authperson",
        component: () => import("components/Auth.vue"),
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
