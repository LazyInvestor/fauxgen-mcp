# fauxgen-mcp

<p align="center">
  <img src="https://fauxgen.com/logo.png" width="72" height="72" alt="FauxGen" />
</p>

<p align="center">
  <strong>Fake data for agents.</strong><br/>
  MCP server that gives Cursor, Claude, Windsurf &amp; friends instant fictional identities,<br/>
  addresses, phones, Luhn test cards and more — powered by the same idea as
  <a href="https://fauxgen.com">fauxgen.com</a>.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/fauxgen-mcp"><img alt="npm" src="https://img.shields.io/npm/v/fauxgen-mcp?color=22d3ee&label=npm" /></a>
  <a href="https://fauxgen.com/mcp"><img alt="docs" src="https://img.shields.io/badge/docs-fauxgen.com%2Fmcp-22d3ee" /></a>
  <a href="LICENSE"><img alt="license" src="https://img.shields.io/badge/license-MIT-blue" /></a>
  <a href="https://modelcontextprotocol.io"><img alt="mcp" src="https://img.shields.io/badge/MCP-stdio-111827" /></a>
</p>

---

## Why

Agents write forms, seeds and Playwright fixtures all day. They shouldn't invent SSNs from thin air or paste the same `John Doe` forever.

```
You:  seed a German checkout user
Agent: → generate_identity({ country: "de" })
       → valid-looking DE address, phone, IBAN-ready country, test Visa…
```

## Install (30 seconds)

### Cursor

Add to `.cursor/mcp.json` (project) or `~/.cursor/mcp.json` (global):

```json
{
  "mcpServers": {
    "fauxgen": {
      "command": "npx",
      "args": ["-y", "fauxgen-mcp"]
    }
  }
}
```

### Claude Desktop

`~/Library/Application Support/Claude/claude_desktop_config.json` (macOS):

```json
{
  "mcpServers": {
    "fauxgen": {
      "command": "npx",
      "args": ["-y", "fauxgen-mcp"]
    }
  }
}
```

### CLI

```bash
npx -y fauxgen-mcp
```

## Tools

| Tool | What you get |
|------|----------------|
| `generate_identity` | Full persona: name, address, phone, email, job, test cards |
| `generate_name` / `generate_address` / `generate_phone` | Locale-aware building blocks |
| `generate_email` / `generate_username` / `generate_password` | Auth-fixture staples |
| `generate_credit_card` | Luhn-valid **test** Visa / MC / Amex |
| `generate_iban` | mod-97 **test** IBAN |
| `generate_company` | Company + domain + buzzphrase |
| `generate_uuid` / `generate_ip` / `generate_mac` / `generate_user_agent` | Device & network junk food |
| `generate_crypto_wallet` | Random-looking BTC / ETH strings |
| `list_countries` | All supported country codes |
| `fauxgen_tool_url` | Deep-link into the visual web tools (WhatsApp chats, plates, QR…) |

Also ships a `seed_test_user` prompt and a `fauxgen://overview` resource.

**66 countries** — same coverage as the website.

## Safety

All output is **fictional test data**. Do not use it to deceive people, open real accounts, or commit fraud. Test cards and IBANs pass checksums so your validators work — they are not real payment instruments.

## Develop

```bash
npm install
npm run build
npm start
npm run typecheck
```

## License

MIT © FauxGen — [fauxgen.com](https://fauxgen.com)
