export const statusCode: {
  [key: number]: string
} = {
  403: 'Access denied',
  404: 'Error occured',
  408: 'Timeout',
  400: 'Error Occured',
}

export const regex400Code = /^[4]{1}[0]{1}[0-9]{1}$/g
export const regex500Code = /^[5]{1}[0]{1}[023]{1}$/g
