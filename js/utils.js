export const setDebug = () => {
  const urlParams = window.location.search.slice(1).split('&')
  debug = urlParams.reduce((acc, elem) => acc || elem === 'debug=true', false)
  if (debug) {
    document.getElementById('debug').innerHTML = 'Quit debug mode'
    document.getElementById('debug').classList.remove('enabled')
  }
}

export const isRotation = (curr, rotation, offset = 0.01) => {
  const pi = 3.14
  const full = pi * 2
  const lower = (full * rotation) % full
  const upper = lower + offset 
  return curr % full > lower && curr % full < upper
}
