import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import type { Server as NetServer, Socket } from 'node:net'
import {
  registerToolsOnServer,
  registerResourcesOnServer,
  registerPromptsOnServer
} from '@/lib/factories'
import { createServer as createMcpServer } from '@/server/server'
import {
  DEFAULT_MCP_REGISTRATION_PROFILE,
  type McpRegistrationProfile
} from '@/lib/registrationProfile'
import { createProductIdentity } from '@/lib/productIdentity'

export type { NetServer }

function getStatusText (status: number): string {
  const texts: Record<number, string> = {
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    204: 'No Content',
    400: 'Bad Request',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    409: 'Conflict',
    415: 'Unsupported Media Type',
    500: 'Internal Server Error'
  }
  return texts[status] || 'Unknown'
}

function isAllowedLocalOrigin (origin: string): boolean {
  try {
    const parsed = new URL(origin)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false

    const hostname = parsed.hostname.toLowerCase()
    return (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '[::1]' ||
      hostname === '::1'
    )
  } catch {
    return false
  }
}

interface SerializedWebResponse {
  status: number
  headers: Record<string, string>
  body: string
}

/**
 * Handle one MCP HTTP request with request-owned server/transport state.
 *
 * The transport deliberately omits a session ID generator, so the SDK does not
 * create or require Mcp-Session-Id. JSON response mode keeps the normal BlockIT
 * path request/response-only; standalone GET/SSE is rejected by the outer HTTP
 * route before this helper is called.
 */
async function handleStatelessMcpRequest (
  webRequest: Request
): Promise<SerializedWebResponse> {
  const requestServer = createMcpServer()
  registerToolsOnServer(requestServer)
  registerResourcesOnServer(requestServer)
  registerPromptsOnServer(requestServer)

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true
  })

  await requestServer.connect(transport)

  try {
    const webResponse = await transport.handleRequest(webRequest)
    const responseHeaders: Record<string, string> = {}
    webResponse.headers.forEach((value: string, key: string) => {
      responseHeaders[key] = value
    })

    const contentType = webResponse.headers.get('content-type') || ''
    if (contentType.includes('text/event-stream')) {
      throw new Error(
        'Unexpected SSE response in the default stateless JSON transport path.'
      )
    }

    if (!contentType && webResponse.status !== 204 && webResponse.status !== 202) {
      responseHeaders['content-type'] = 'application/json'
    }

    return {
      status: webResponse.status,
      headers: responseHeaders,
      body: await webResponse.text()
    }
  } finally {
    await requestServer.close()
  }
}

export default function createNetServer (
  {
    createServer
  }: { createServer: (callback: (socket: Socket) => void) => NetServer },
  {
    port,
    endpoint,
    host = '127.0.0.1',
    profile = DEFAULT_MCP_REGISTRATION_PROFILE
  }: {
    endpoint: string
    port: number
    host?: string
    profile?: McpRegistrationProfile
  }
): NetServer {
  const httpServer = createServer((socket: Socket) => {
    let buffer = Buffer.alloc(0)
    let socketEnded = false
    let processing = false

    socket.on('data', (chunk: Buffer) => {
      if (socketEnded) return
      buffer = Buffer.concat([buffer, chunk])
      void processBufferedRequests()
    })

    socket.on('error', (err: Error) => {
      if (err.message !== 'read ECONNRESET') {
        console.error('[MCP] Socket error:', err.message)
      }
      socket.destroy()
    })

    socket.on('close', () => {
      buffer = Buffer.alloc(0)
    })

    async function processBufferedRequests (): Promise<void> {
      if (processing) return
      processing = true

      try {
        while (true) {
          if (socketEnded || socket.destroyed || !socket.writable) return

          const headerEnd = buffer.indexOf('\r\n\r\n')
          if (headerEnd === -1) return

          const headerSection = buffer.subarray(0, headerEnd).toString()
          const lines = headerSection.split('\r\n')
          const [method, path] = lines[0].split(' ')

          if (!method || !path) {
            sendResponse(
              socket,
              400,
              { 'content-type': 'application/json' },
              JSON.stringify({
                jsonrpc: '2.0',
                error: { code: -32000, message: 'Bad Request: malformed request line' },
                id: null
              }),
              undefined
            )
            buffer = Buffer.alloc(0)
            return
          }

          const headers: Record<string, string> = {}
          for (let i = 1; i < lines.length; i++) {
            const colonIdx = lines[i].indexOf(':')
            if (colonIdx > 0) {
              const key = lines[i].substring(0, colonIdx).trim().toLowerCase()
              const value = lines[i].substring(colonIdx + 1).trim()
              headers[key] = value
            }
          }

          const rawContentLength = headers['content-length'] || '0'
          const contentLength = Number.parseInt(rawContentLength, 10)
          if (!Number.isFinite(contentLength) || contentLength < 0) {
            sendResponse(
              socket,
              400,
              { 'content-type': 'application/json' },
              JSON.stringify({
                jsonrpc: '2.0',
                error: { code: -32000, message: 'Bad Request: invalid Content-Length' },
                id: null
              }),
              headers['connection']
            )
            buffer = Buffer.alloc(0)
            return
          }

          const bodyStart = headerEnd + 4
          const requestEnd = bodyStart + contentLength
          if (buffer.length < requestEnd) return

          const body = buffer.subarray(bodyStart, requestEnd).toString()
          buffer = buffer.subarray(requestEnd)

          const origin = headers['origin']
          if (origin !== undefined && !isAllowedLocalOrigin(origin)) {
            sendResponse(
              socket,
              403,
              { 'content-type': 'application/json' },
              JSON.stringify({
                jsonrpc: '2.0',
                error: {
                  code: -32000,
                  message: 'Forbidden: invalid Origin header'
                },
                id: null
              }),
              headers['connection']
            )
            continue
          }

          const pathWithoutQuery = path.split('?')[0]

          if (
            pathWithoutQuery === '/health' ||
            pathWithoutQuery === endpoint + '/health'
          ) {
            sendResponse(
              socket,
              200,
              { 'content-type': 'application/json' },
              JSON.stringify({
                status: 'ok',
                timestamp: new Date().toISOString(),
                product: createProductIdentity(profile),
                transport: {
                  mode: 'stateless',
                  response_mode: 'json'
                }
              }),
              headers['connection']
            )
            continue
          }

          if (
            pathWithoutQuery === '/ready' ||
            pathWithoutQuery === endpoint + '/ready'
          ) {
            sendResponse(
              socket,
              200,
              { 'content-type': 'application/json' },
              JSON.stringify({ ready: true }),
              headers['connection']
            )
            continue
          }

          if (
            pathWithoutQuery !== endpoint &&
            !path.startsWith(endpoint + '/') &&
            !path.startsWith(endpoint + '?')
          ) {
            sendResponse(
              socket,
              404,
              { 'content-type': 'text/plain' },
              'Not Found',
              headers['connection']
            )
            continue
          }

          // BlockIT does not offer a standalone server-to-client SSE stream in
          // the default stateless path. MCP 2025-11-25 explicitly permits 405
          // for GET when that stream is not offered. DELETE is also session-only
          // and therefore not meaningful when the server does not issue sessions.
          if (method !== 'POST') {
            sendResponse(
              socket,
              405,
              {
                'content-type': 'application/json',
                allow: 'POST'
              },
              JSON.stringify({
                jsonrpc: '2.0',
                error: {
                  code: -32000,
                  message: 'Method not allowed in stateless MCP mode.'
                },
                id: null
              }),
              headers['connection']
            )
            continue
          }

          const url = `http://${host}:${port}${path}`
          const webHeaders = new Headers()
          for (const [key, value] of Object.entries(headers)) {
            webHeaders.set(key, value)
          }

          const requestInit: RequestInit = {
            method,
            headers: webHeaders
          }
          if (body) {
            requestInit.body = body
          }
          const webRequest = new Request(url, requestInit)

          try {
            const response = await handleStatelessMcpRequest(webRequest)
            sendResponse(
              socket,
              response.status,
              response.headers,
              response.body,
              headers['connection']
            )
          } catch (error) {
            console.error('[MCP] Request handler error:', error)
            sendResponse(
              socket,
              500,
              { 'content-type': 'application/json' },
              JSON.stringify({
                jsonrpc: '2.0',
                error: { code: -32603, message: 'Internal server error' },
                id: null
              }),
              headers['connection']
            )
          }
        }
      } catch (error) {
        console.error('[MCP] Unhandled error in processBufferedRequests:', error)
        if (!socket.destroyed && socket.writable) {
          sendResponse(
            socket,
            500,
            { 'content-type': 'application/json' },
            JSON.stringify({
              jsonrpc: '2.0',
              error: { code: -32603, message: 'Internal server error' },
              id: null
            }),
            undefined
          )
        }
      } finally {
        processing = false
        if (buffer.length > 0 && !socketEnded && !socket.destroyed && socket.writable) {
          void processBufferedRequests()
        }
      }
    }

    function sendResponse (
      sock: Socket,
      status: number,
      headers: Record<string, string>,
      body: string,
      connection?: string
    ): boolean {
      if (socketEnded || sock.destroyed || !sock.writable) {
        return false
      }

      let response = `HTTP/1.1 ${status} ${getStatusText(status)}\r\n`
      headers['content-length'] = Buffer.byteLength(body).toString()

      // HTTP/1.1 connection reuse is independent from MCP protocol sessions.
      // Keep the socket reusable unless the client explicitly requests close.
      const keepAlive = connection?.toLowerCase() !== 'close'
      headers['connection'] = keepAlive ? 'keep-alive' : 'close'

      if (!headers['date']) {
        headers['date'] = new Date().toUTCString()
      }

      for (const [key, value] of Object.entries(headers)) {
        response += `${key}: ${value}\r\n`
      }
      response += '\r\n'
      response += body

      if (!keepAlive) {
        socketEnded = true
        sock.write(response, () => {
          sock.end()
        })
      } else {
        sock.write(response)
      }

      return true
    }
  })

  httpServer.listen(port, host, () => {
    console.log(`[MCP] Server listening on http://${host}:${port}${endpoint}`)
  })

  httpServer.on('error', (err: Error) => {
    console.error('[MCP] Server error:', err)
    Blockbench.showQuickMessage(`MCP Server error: ${err.message}`, 3000)
  })

  return httpServer
}
