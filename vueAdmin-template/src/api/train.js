import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/getBaseInfo',
    method: 'get',
    params
  })
}