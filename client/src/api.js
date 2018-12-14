export const post = async (url, body) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  if (res.ok) {
    return data
  } else {
    throw new Error(data.error || res.statusText)
  }
}

export const get = async (url, queryParams = {}) => {
  const esc = encodeURIComponent
  const queryString = Object
    .keys(queryParams)
    .filter(key => queryParams[key] !== undefined)
    .map(k => esc(k) + '=' + esc(queryParams[k]))
    .join('&')

  if (queryString) {
    if (!url.endsWith('/')) {
      url += '/'
    }

    url += `?${queryString}`
  }

  const res = await fetch(url)

  const data = await res.json()

  if (res.ok) {
    return data
  } else {
    throw new Error(data.error || res.statusText)
  }
}
