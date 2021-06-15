let [peerId, key, host] = arguments
peerId = peerId || 'nat'
key = key || ''
host = host || 'peerjspoc.caveon.com'

return `
<head>
<title>Peer Browser</title>
<link rel="stylesheet" href="https://unpkg.com/spectre.css/dist/spectre.min.css">
</head>
<style>
.columns {
  align-items: center;
  flex-direction: column;
}
</style>
<body>
<div class="container">
  <div class="columns">
    <div class="column col-6" id="view"></div>
  </div>
</div>
<script src="https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/markdown-it/12.0.6/markdown-it.min.js"></script>
<script>
window.onload = init
let me, conn, md
function init() {
  me = new Peer({
    host: '${host}',
    path: '/myapp',
    port: ''
  })
  me.on('open', (id) => {
    console.log('connected to peer server')
    conn = me.connect('${peerId}')
    conn.on('open', ()=> {
      conn.on('data', render)
      conn.send({key: '${key}'})
    })
  })
  md = window.markdownit()
}
function render(payload) {
  const html = md.render(payload.value)
  const view = document.getElementById('view')
  view.innerHTML = html
  const links = view.getElementsByTagName('a')
  for (const link of links) {
    if (!link.getAttribute('href').startsWith('http')) {
      link.onclick = requestKey
    } else {
      link.target = '_blank'
    }
  }
}
function requestKey(e) {
  e.preventDefault()
  conn.send({key: e.target.getAttribute('href')})
}
</script>
</body>
`
