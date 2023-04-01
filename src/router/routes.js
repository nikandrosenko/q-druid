
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    name: 'home',
    children: [
      { path: '/Auth', component: () => import('pages/AuthAndReg.vue'), meta: { guest: true }},
      { path: '/Profile', component: () => import('pages/ProfileUser.vue'), meta: { guest: false }}
      ]
     },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
