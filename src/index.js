#!/usr/bin/env node
    import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
    import { server } from './server.js';
    import dotenv from 'dotenv';

    // Load environment variables
    dotenv.config();

    console.log('Starting Photoroom MCP server...');

    // Check for API key
    if (!process.env.PHOTOROOM_API_KEY) {
      console.warn('⚠️ PHOTOROOM_API_KEY not found in environment variables.');
      console.warn('Please create a .env file with your Photoroom API key.');
      console.warn('You can copy .env.example to .env and add your key.');
    }

    // Start receiving messages on stdin and sending messages on stdout
    const transport = new StdioServerTransport();
    await server.connect(transport);
