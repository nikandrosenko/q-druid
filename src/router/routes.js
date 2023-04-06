const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", name: "home", component: () => import("pages/MainPage.vue") },
      {
        path: "page/:id",
        name: "page",
        component: () => import("pages/Page.vue"),
      },
      {
        path: "subject/:id",
        name: "subject",
        component: () => import("pages/SubjectPage.vue"),
      },
      {
        path: "group/:id",
        name: "group",
        component: () => import("pages/GroupPage.vue"),
      },
      {
        path: "modules",
        component: () => import("components/Modules.vue"),
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
