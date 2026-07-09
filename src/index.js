#!/usr/bin/env node
// fall-kqtt-bridge-mcp · MCP stdio server wrapping fall-kqtt-bridge-sdk · MIT · AI-Native Solutions
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server({ name: 'fall-kqtt-bridge-mcp', version: '1.0.0' }, { capabilities: { tools: {} } });

const TOOLS = [
  {
    name: 'fall-kqtt-bridge_clear_empty',
    description: 'clearEmpty · from fall-kqtt-bridge-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { clearEmpty } = await import('@ai-native-solutions/fall-kqtt-bridge-sdk');
      return typeof clearEmpty === 'function' ? await clearEmpty(args) : { error: 'clearEmpty not callable' };
    }
  },
  {
    name: 'fall-kqtt-bridge_fmt_ts',
    description: 'fmtTs · from fall-kqtt-bridge-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { fmtTs } = await import('@ai-native-solutions/fall-kqtt-bridge-sdk');
      return typeof fmtTs === 'function' ? await fmtTs(args) : { error: 'fmtTs not callable' };
    }
  },
  {
    name: 'fall-kqtt-bridge_log_row',
    description: 'logRow · from fall-kqtt-bridge-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { logRow } = await import('@ai-native-solutions/fall-kqtt-bridge-sdk');
      return typeof logRow === 'function' ? await logRow(args) : { error: 'logRow not callable' };
    }
  },
  {
    name: 'fall-kqtt-bridge_on_published_to_k_q_t_t',
    description: 'onPublishedToKQTT · from fall-kqtt-bridge-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { onPublishedToKQTT } = await import('@ai-native-solutions/fall-kqtt-bridge-sdk');
      return typeof onPublishedToKQTT === 'function' ? await onPublishedToKQTT(args) : { error: 'onPublishedToKQTT not callable' };
    }
  }
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(({ handler, ...rest }) => rest)
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const t = TOOLS.find(x => x.name === req.params.name);
  if (!t) throw new Error('unknown tool: ' + req.params.name);
  const result = await t.handler(req.params.arguments || {});
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

await server.connect(new StdioServerTransport());
console.error('fall-kqtt-bridge-mcp v1.0.0 · stdio ready');
