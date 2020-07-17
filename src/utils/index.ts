import isURL from 'validator/lib/isURL'

export const isValidURL = (v: string, protocols: Array<'http'|'https'|'rtmp'|'rtmps'>) =>
  isURL(v, {
    protocols,
    require_valid_protocol: true,
    require_protocol: true
  })

export const isSecureURL = (v: string) => isValidURL(v, [ 'https' ])
export const isPlainURL = (v: string) => isValidURL(v, [ 'http', 'https' ])

