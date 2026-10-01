#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { COUNTRY_CODES } from "./countries.js";
import { generateAddress, generateCompany, generateCreditCard, generateCrypto, generateEmail, generateIban, generateIdentity, generateIp, generateMac, generateName, generatePassword, generatePhone, generateUserAgent, generateUsername, generateUuid, listCountries, toolUrl, } from "./generate.js";
const VERSION = "0.1.0";
const countrySchema = z
    .string()
    .default("us")
    .describe(`ISO country code used on fauxgen.com. One of: ${COUNTRY_CODES.join(", ")}`);
const genderSchema = z.enum(["male", "female", "random"]).default("random");
function json(data) {
    return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
}
function createServer() {
    const server = new McpServer({
        name: "fauxgen",
        version: VERSION,
    });
    server.registerTool("list_countries", {
        title: "List countries",
        description: "List all FauxGen country codes with dial codes and country page URLs.",
    }, async () => json(listCountries()));
    server.registerTool("generate_identity", {
        title: "Generate fake identity",
        description: "Generate a full fictional test identity (name, address, phone, email, job, test cards). For QA and demos only.",
        inputSchema: {
            country: countrySchema,
            gender: genderSchema,
        },
    }, async ({ country, gender }) => json(generateIdentity(country, gender)));
    server.registerTool("generate_name", {
        title: "Generate fake name",
        description: "Generate a locale-aware first/last name.",
        inputSchema: { country: countrySchema, gender: genderSchema },
    }, async ({ country, gender }) => json(generateName(country, gender)));
    server.registerTool("generate_address", {
        title: "Generate fake address",
        description: "Generate a street address for a country.",
        inputSchema: { country: countrySchema },
    }, async ({ country }) => json(generateAddress(country)));
    server.registerTool("generate_phone", {
        title: "Generate fake phone",
        description: "Generate a phone number for a country (national + international).",
        inputSchema: { country: countrySchema },
    }, async ({ country }) => json(generatePhone(country)));
    server.registerTool("generate_email", {
        title: "Generate fake emails",
        description: "Generate one or more fictional email addresses.",
        inputSchema: {
            count: z.number().int().min(1).max(50).default(1),
        },
    }, async ({ count }) => json(generateEmail(count)));
    server.registerTool("generate_username", {
        title: "Generate usernames",
        description: "Generate fictional usernames.",
        inputSchema: {
            count: z.number().int().min(1).max(50).default(1),
        },
    }, async ({ count }) => json(generateUsername(count)));
    server.registerTool("generate_password", {
        title: "Generate password",
        description: "Generate a random password with configurable character sets.",
        inputSchema: {
            length: z.number().int().min(6).max(128).default(16),
            upper: z.boolean().default(true),
            digits: z.boolean().default(true),
            symbols: z.boolean().default(true),
        },
    }, async (opts) => json(generatePassword(opts)));
    server.registerTool("generate_credit_card", {
        title: "Generate test credit card",
        description: "Generate a Luhn-valid TEST card number (Visa/Mastercard/Amex). Not a real account — never use for payments.",
        inputSchema: {
            brand: z.enum(["visa", "mastercard", "amex", "random"]).default("random"),
        },
    }, async ({ brand }) => json(generateCreditCard(brand)));
    server.registerTool("generate_iban", {
        title: "Generate test IBAN",
        description: "Generate a mod-97 valid TEST IBAN. Not a real bank account.",
        inputSchema: { country: countrySchema },
    }, async ({ country }) => json(generateIban(country)));
    server.registerTool("generate_company", {
        title: "Generate fake company",
        description: "Generate a fictional company name, domain and catchphrase.",
        inputSchema: { country: countrySchema },
    }, async ({ country }) => json(generateCompany(country)));
    server.registerTool("generate_uuid", {
        title: "Generate UUIDs",
        description: "Generate one or more UUID v4 values.",
        inputSchema: {
            count: z.number().int().min(1).max(50).default(1),
        },
    }, async ({ count }) => json(generateUuid(count)));
    server.registerTool("generate_user_agent", {
        title: "Generate user agents",
        description: "Generate realistic browser user-agent strings.",
        inputSchema: {
            count: z.number().int().min(1).max(20).default(1),
        },
    }, async ({ count }) => json(generateUserAgent(count)));
    server.registerTool("generate_ip", {
        title: "Generate IP addresses",
        description: "Generate random IPv4 / IPv6 addresses.",
        inputSchema: {
            version: z.enum(["v4", "v6", "both"]).default("v4"),
            count: z.number().int().min(1).max(50).default(1),
        },
    }, async ({ version, count }) => json(generateIp(version, count)));
    server.registerTool("generate_mac", {
        title: "Generate MAC addresses",
        description: "Generate random MAC addresses.",
        inputSchema: {
            count: z.number().int().min(1).max(50).default(1),
        },
    }, async ({ count }) => json(generateMac(count)));
    server.registerTool("generate_crypto_wallet", {
        title: "Generate crypto wallet addresses",
        description: "Generate random-looking Bitcoin / Ethereum addresses for UI tests.",
        inputSchema: {
            chain: z.enum(["bitcoin", "ethereum", "both"]).default("both"),
        },
    }, async ({ chain }) => json(generateCrypto(chain)));
    server.registerTool("fauxgen_tool_url", {
        title: "FauxGen web tool URL",
        description: "Return the fauxgen.com URL for a visual tool (chat mockups, plates, barcodes, etc.). Use when the user needs screenshots or the full UI.",
        inputSchema: {
            tool: z
                .enum([
                "fake-identity-generator",
                "fake-address-generator",
                "fake-phone-number-generator",
                "fake-name-generator",
                "fake-credit-card-generator",
                "fake-iban-generator",
                "fake-whatsapp-chat",
                "fake-telegram-chat",
                "fake-sms-chat",
                "fake-tweet-generator",
                "fake-instagram-post-generator",
                "fake-license-plate-generator",
                "fake-barcode-generator",
                "fake-qr-code-generator",
            ])
                .describe("Tool slug on fauxgen.com"),
            country: z.string().optional().describe("Optional country code for country-aware tools"),
        },
    }, async ({ tool, country }) => json({
        url: toolUrl(tool, country),
        tip: "Open in a browser for chat screenshots, plate images, barcodes and the full PRO toolkit.",
    }));
    server.registerPrompt("seed_test_user", {
        title: "Seed a test user",
        description: "Ask the model to create a realistic test user for a given country using FauxGen tools.",
        argsSchema: {
            country: z.string().default("us").describe("Country code, e.g. us, de, jp"),
            purpose: z
                .string()
                .optional()
                .describe("What the test user is for, e.g. checkout form, auth flow"),
        },
    }, async ({ country, purpose }) => ({
        messages: [
            {
                role: "user",
                content: {
                    type: "text",
                    text: [
                        `Create a fictional test user for country "${country}".`,
                        purpose ? `Purpose: ${purpose}.` : null,
                        "Call the FauxGen MCP tool generate_identity, then format the result as clean JSON suitable for fixtures.",
                        "Remind that data is fictional and must not be used to deceive people or services.",
                        `Visual / screenshot tools live at https://fauxgen.com — use fauxgen_tool_url if needed.`,
                    ]
                        .filter(Boolean)
                        .join(" "),
                },
            },
        ],
    }));
    server.registerResource("fauxgen-overview", "fauxgen://overview", {
        title: "FauxGen overview",
        description: "What FauxGen MCP can do and where the web UI lives.",
        mimeType: "text/markdown",
    }, async () => ({
        contents: [
            {
                uri: "fauxgen://overview",
                mimeType: "text/markdown",
                text: `# FauxGen MCP

Generate **fictional** test data for QA, demos and UI fixtures.

- Website: https://fauxgen.com
- MCP docs: https://fauxgen.com/mcp
- GitHub: https://github.com/LazyInvestor/fauxgen-mcp

## Tools
- \`generate_identity\` — full persona
- \`generate_address\` / \`generate_phone\` / \`generate_name\`
- \`generate_credit_card\` / \`generate_iban\` — checksum-valid **test** numbers
- \`generate_email\`, \`generate_username\`, \`generate_password\`
- \`generate_uuid\`, \`generate_ip\`, \`generate_mac\`, \`generate_user_agent\`
- \`generate_company\`, \`generate_crypto_wallet\`
- \`list_countries\`, \`fauxgen_tool_url\`

Chat screenshots, license-plate images and barcodes stay on the website (browser-only).
`,
            },
        ],
    }));
    return server;
}
async function main() {
    const server = createServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch((err) => {
    console.error("FauxGen MCP failed to start:", err);
    process.exit(1);
});
