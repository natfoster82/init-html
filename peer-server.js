let [myId, host] = arguments
myId = myId || ''
host = host || 'peerjspoc.caveon.com'

return `
<head>
<title>Peer Server</title>
</head>
<body>
<div id="view"></div>
<script src="https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js"></script>
<script>
const APPS = {}

function getValue(key, args) {
  if (key.startsWith('_')) return '404'
  const appKey = '_' + key
  if (APPS.hasOwnProperty(appKey)) {
    return APPS[appKey](...args)
  }
  const code = localStorage.getItem(appKey)
  if (code) {
    const appFunc = new Function(code)
    APPS[appKey] = appFunc
    return appFunc(...args)
  }
  return localStorage.getItem(key) || '404'
}

const me = new Peer('${myId}', {
  host: '${host}',
  path: '/myapp',
  port: ''
})
me.on('open', (id) => {
  console.log('connected to peer server', id)
  me.on('connection', (conn) => {
    console.log('connection event', conn)
    conn.on('data', (payload) => {
      console.log('data event', payload, conn)
      let value = '404'
      const key = payload.key || 'home'
      if (!key.startsWith('_')) {
        value = getValue(key || 'home', payload.args || [])
      }
      conn.send({key: key, value: value})
    })
  })
})
</script>
</body>
`
