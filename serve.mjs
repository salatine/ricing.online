#!/usr/bin/env node
import fs from 'node:fs'
import http2 from 'node:http2'
import handler from 'serve-handler'

const PORT = 8080

const server = http2.createSecureServer({
    key: fs.readFileSync('localhost-privkey.pem'),
    cert: fs.readFileSync('localhost-cert.pem'),
    allowHTTP1: true,
}, handler)

server.listen(PORT, () => {
    console.log(`Listening on https://localhost:${PORT}/`)
})
