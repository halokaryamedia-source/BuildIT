import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import type { Server as NodeNetServer, Socket } from 'node:net'
import {
  registerToolsOnServer,
  registerResourcesOnServer,
  registerPromptsOnServer,
  invalidateToolRegistrationRuntimeCaches
} from '@/lib/factories'
import { createServer as createMcpServer } from '@/server/server'
import {
  DEFAULT_MCP_REGISTRATION_PROFILE,
  type McpRegistrationProfile
} from '@/lib/registrationProfile'
import { createProductIdentity } from '@/lib/productIdentity'
import {
  DEFAULT_MCP_AUTHORING_PHASE,
  getActiveMcpAuthoringPhase,
  type McpAuthoringPhase
} from '@/lib/authoringPhase'
import { getMcpSurfaceToolNames } from '@/server/tools'

const INSTANCE_ID = crypto.randomUUID()
const STARTUP_TIME = new Date().toISOString()

export function normalizeBuildIdentity (value: unknown): string {
  return typeof value === 'string' && /^sha256:[a-f0-9]{64}$/.test(value)
    ? value
    : 'source'
}

const BUILD_IDENTITY = normalizeBuildIdentity(
  (globalThis as { __BLOCKIT_BUILD_ID__?: unknown }).__BLOCKIT_BUILD_ID__
)

export interface NetServer extends NodeNetServer {
  closeActiveSockets(): void
}

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
    413: 'Payload Too Large',
    415: 'Unsupported Media Type',
    431: 'Request Header Fields Too Large',
    500: 'Internal Server Error'
  }
  return texts[status] || 'Unknown'
}

// Loopback MCP requests are small JSON documents. These caps exist so a hostile
// local client cannot grow the parser buffer without bound.
const MAX_REQUEST_HEADER_BYTES = 32 * 1024
const MAX_REQUEST_BODY_BYTES = 10 * 1024 * 1024

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

// Defense-in-depth against DNS rebinding: a rebound browser page would carry a
// remote Host value even though its Origin gate may not fire on same-site forms.
function isAllowedLocalHost (hostHeader: string): boolean {
  try {
    const parsed = new URL(`http://${hostHeader.trim()}`)
    const hostname = parsed.hostname.toLowerCase()
    return (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '[::1]'
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
  webRequest: Request,
  phase: McpAuthoringPhase = getActiveMcpAuthoringPhase(),
  profile: McpRegistrationProfile = DEFAULT_MCP_REGISTRATION_PROFILE
): Promise<SerializedWebResponse> {
  // The active phase changes tool.enabled at runtime. Rebuild the request
  // snapshot after that mutation so every tool named in the phase contract is
  // also callable by the request-owned MCP server.
  invalidateToolRegistrationRuntimeCaches()
  const requestServer = createMcpServer(getActiveMcpAuthoringPhase(), profile)
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
  }: { createServer: (callback: (socket: Socket) => void) => NodeNetServer },
  {
    port,
    endpoint,
    host = '127.0.0.1',
    profile = DEFAULT_MCP_REGISTRATION_PROFILE,
    phase = DEFAULT_MCP_AUTHORING_PHASE
  }: {
    endpoint: string
    port: number
    host?: string
    profile?: McpRegistrationProfile
    phase?: McpAuthoringPhase
  }
): NetServer {
  const activeSockets = new Set<Socket>()
  const httpServer = createServer((socket: Socket) => {
    activeSockets.add(socket)
    let buffer = Buffer.alloc(0)
    let socketEnded = false
    let processing = false
    let awaitingDrain = false

    socket.on('data', (chunk: Buffer) => {
      if (socketEnded) return
      buffer = Buffer.concat([buffer, chunk])
      void processBufferedRequests()
    })

    socket.on('drain', () => {
      awaitingDrain = false
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
      activeSockets.delete(socket)
    })

    async function processBufferedRequests (): Promise<void> {
      if (processing || awaitingDrain) return
      processing = true

      try {
        while (true) {
          if (socketEnded || socket.destroyed || !socket.writable) return

          const headerEnd = buffer.indexOf('\r\n\r\n')
          if (headerEnd === -1) {
            if (buffer.length > MAX_REQUEST_HEADER_BYTES) {
              sendResponse(
                socket,
                431,
                { 'content-type': 'application/json' },
                JSON.stringify({
                  jsonrpc: '2.0',
                  error: { code: -32000, message: 'Bad Request: header section too large' },
                  id: null
                }),
                'close'
              )
              buffer = Buffer.alloc(0)
            }
            return
          }
          if (headerEnd > MAX_REQUEST_HEADER_BYTES) {
            sendResponse(
              socket,
              431,
              { 'content-type': 'application/json' },
              JSON.stringify({
                jsonrpc: '2.0',
                error: { code: -32000, message: 'Bad Request: header section too large' },
                id: null
              }),
              'close'
            )
            buffer = Buffer.alloc(0)
            return
          }

          const headerSection = buffer.subarray(0, headerEnd).toString()
          const lines = headerSection.split('\r\n')
          const requestLineParts = lines[0].split(' ')
          const [method, path, version] = requestLineParts

          if (
            requestLineParts.length !== 3 ||
            !method ||
            !path ||
            !version ||
            !/^HTTP\/1\.[01]$/.test(version)
          ) {
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
          const contentLengthValues: string[] = []
          for (let i = 1; i < lines.length; i++) {
            const colonIdx = lines[i].indexOf(':')
            if (colonIdx > 0) {
              const key = lines[i].substring(0, colonIdx).trim().toLowerCase()
              const value = lines[i].substring(colonIdx + 1).trim()
              if (key === 'content-length') {
                contentLengthValues.push(value)
              }
              headers[key] = value
            }
          }

          // Chunked framing is not implemented; accepting it would leave the
          // chunked bytes in the buffer and desync every later request.
          if (headers['transfer-encoding'] !== undefined) {
            sendResponse(
              socket,
              400,
              { 'content-type': 'application/json' },
              JSON.stringify({
                jsonrpc: '2.0',
                error: {
                  code: -32000,
                  message: 'Bad Request: Transfer-Encoding is not supported; send Content-Length.'
                },
                id: null
              }),
              'close'
            )
            buffer = Buffer.alloc(0)
            return
          }

          const rawContentLength = headers['content-length'] || '0'
          const distinctContentLengths = new Set(contentLengthValues)
          const contentLength = Number.parseInt(rawContentLength, 10)
          if (
            distinctContentLengths.size > 1 ||
            !/^\d+$/.test(rawContentLength) ||
            !Number.isFinite(contentLength) ||
            contentLength < 0
          ) {
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

          if (contentLength > MAX_REQUEST_BODY_BYTES) {
            sendResponse(
              socket,
              413,
              { 'content-type': 'application/json' },
              JSON.stringify({
                jsonrpc: '2.0',
                error: { code: -32000, message: 'Payload Too Large: request body exceeds limit' },
                id: null
              }),
              'close'
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

          const hostHeader = headers['host']
          if (hostHeader !== undefined && !isAllowedLocalHost(hostHeader)) {
            sendResponse(
              socket,
              403,
              { 'content-type': 'application/json' },
              JSON.stringify({
                jsonrpc: '2.0',
                error: {
                  code: -32000,
                  message: 'Forbidden: invalid Host header'
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
                product: createProductIdentity(profile, getActiveMcpAuthoringPhase()),
                build_identity: BUILD_IDENTITY,
                instance_id: INSTANCE_ID,
                startup_time: STARTUP_TIME,
                exposed_tool_count: getMcpSurfaceToolNames(
                  profile,
                  getActiveMcpAuthoringPhase()
                ).length,
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
            const response = await handleStatelessMcpRequest(
              webRequest,
              getActiveMcpAuthoringPhase(),
              profile
            )
            const sent = sendResponse(
              socket,
              response.status,
              response.headers,
              response.body,
              headers['connection']
            )
            if (!sent) {
              awaitingDrain = true
              return
            }
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
        if (
          buffer.length > 0 &&
          !awaitingDrain &&
          !socketEnded &&
          !socket.destroyed &&
          socket.writable
        ) {
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
        return true
      }

      // Backpressure: false means the kernel buffer is full. The caller pauses
      // pipelined dispatch and resumes on the socket drain event.
      return sock.write(response)
    }
  }) as NetServer

  httpServer.closeActiveSockets = () => {
    for (const socket of activeSockets) {
      socket.destroy()
    }
    activeSockets.clear()
  }

  httpServer.listen(port, host, () => {
    console.log(`[MCP] Server listening on http://${host}:${port}${endpoint}`)
  })

  httpServer.on('error', (err: Error) => {
    console.error('[MCP] Server error:', err)
    Blockbench.showQuickMessage(`MCP Server error: ${err.message}`, 3000)
  })

  return httpServer
}