import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/base',
    component: Layout,
    redirect: '/base/info',
    name: 'base',
    meta: { title: '基础信息管理', icon: 'example' },
    alwaysShow: true,
    children: [
      {
        path: 'info',
        name: 'info',
        component: () => import('@/views/base/baseInfoManage'),
        meta: { title: '车次信息维护', icon: 'table' }
      }
    ]
  },
  {
    path: '/plan',
    component: Layout,
    redirect: '/plan/design',
    name: 'plan',
    meta: { title: '阶段计划管理', icon: 'example' },
    children: [
      {
        path: 'design',
        name: 'planDesign',
        component: () => import('@/views/plan/planDesign'),
        meta: { title: '计划定制', icon: 'table' }
      },
      {
        path: 'query',
        name: 'historyQuery',
        component: () => import('@/views/plan/historyQuery'),
        meta: { title: '历史查看', icon: 'tree' }
      }
    ]

  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

