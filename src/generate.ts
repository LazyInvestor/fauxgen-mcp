import { Faker, allLocales } from "@faker-js/faker";
import { COUNTRIES, countryOf, type CountryMeta } from "./countries.js";

const SITE = "https://fauxgen.com";

type LocaleKey = keyof typeof allLocales;

const cache = new Map<string, Faker>();

function fakerOf(c: CountryMeta): Faker {
  const hit = cache.get(c.code);
  if (hit) return hit;
  const primary = allLocales[c.locale as LocaleKey] ?? allLocales.en;
  // Fall through en → base so internet/userAgent etc. always resolve.
  const f = new Faker({ locale: [primary, allLocales.en, allLocales.base] });
  cache.set(c.code, f);
  return f;
}

function baseFaker(): Faker {
  return fakerOf(countryOf("us"));
}

function luhnCheckDigit(partial: string): number {
  let sum = 0;
  let alt = true;
  for (let i = partial.length - 1; i >= 0; i--) {
    let n = Number(partial[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return (10 - (sum % 10)) % 10;
}

function genLuhn(prefix: string, length: number): string {
  let body = prefix;
  while (body.length < length - 1) body += String(Math.floor(Math.random() * 10));
  body = body.slice(0, length - 1);
  return body + String(luhnCheckDigit(body));
}

function ibanCheck(raw: string): string {
  const rearranged = raw.slice(4) + raw.slice(0, 4);
  const expanded = rearranged.replace(/[A-Z]/g, (ch) => String(ch.charCodeAt(0) - 55));
  let rem = 0;
  for (const ch of expanded) rem = (rem * 10 + Number(ch)) % 97;
  const check = String(98 - rem).padStart(2, "0");
  return raw.slice(0, 2) + check + raw.slice(4);
}

const IBAN_SPECS: Record<string, { bankLen: number; accountLen: number }> = {
  de: { bankLen: 8, accountLen: 10 },
  fr: { bankLen: 10, accountLen: 11 },
  gb: { bankLen: 14, accountLen: 8 },
  es: { bankLen: 8, accountLen: 12 },
  it: { bankLen: 5, accountLen: 12 },
  nl: { bankLen: 4, accountLen: 10 },
  pl: { bankLen: 8, accountLen: 16 },
  at: { bankLen: 5, accountLen: 11 },
  be: { bankLen: 3, accountLen: 9 },
  ch: { bankLen: 5, accountLen: 12 },
  pt: { bankLen: 8, accountLen: 13 },
  ie: { bankLen: 10, accountLen: 8 },
};

function digits(n: number): string {
  return Array.from({ length: n }, () => String(Math.floor(Math.random() * 10))).join("");
}

function letters(n: number): string {
  const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return Array.from({ length: n }, () => A[Math.floor(Math.random() * 26)]).join("");
}

export function listCountries() {
  return COUNTRIES.map((c) => ({
    code: c.code,
    iso2: c.iso2,
    name: c.name,
    dial: c.dial,
    toolsUrl: `${SITE}/countries/${c.code}`,
  }));
}

export type Gender = "male" | "female" | "random";

export function generateName(country = "us", gender: Gender = "random") {
  const c = countryOf(country);
  const f = fakerOf(c);
  const sex = gender === "random" ? (Math.random() < 0.5 ? "male" : "female") : gender;
  const first = f.person.firstName(sex);
  const last = f.person.lastName(sex);
  return {
    first,
    last,
    full: `${first} ${last}`,
    gender: sex,
    country: c.name,
    countryCode: c.code,
    web: `${SITE}/tools/fake-name-generator/${c.code}`,
  };
}

export function generateAddress(country = "us") {
  const c = countryOf(country);
  const f = fakerOf(c);
  const street = f.location.streetAddress();
  const city = f.location.city();
  const state = f.location.state({ abbreviated: true });
  const postal = f.location.zipCode();
  return {
    street,
    city,
    state,
    postal,
    country: c.name,
    countryCode: c.code,
    countryFlag: c.iso2,
    full: [street, [city, state, postal].filter(Boolean).join(", "), c.name].join("\n"),
    web: `${SITE}/tools/fake-address-generator/${c.code}`,
  };
}

export function generatePhone(country = "us") {
  const c = countryOf(country);
  const f = fakerOf(c);
  const national = f.phone.number();
  return {
    national,
    international: `${c.dial} ${national.replace(/^0+/, "")}`,
    dial: c.dial,
    country: c.name,
    countryCode: c.code,
    web: `${SITE}/tools/fake-phone-number-generator/${c.code}`,
  };
}

export function generateEmail(count = 1) {
  const f = baseFaker();
  const n = Math.min(Math.max(count, 1), 50);
  const emails = Array.from({ length: n }, () => f.internet.email().toLowerCase());
  return { emails, web: `${SITE}/tools/fake-email-generator` };
}

export function generateUsername(count = 1) {
  const f = baseFaker();
  const n = Math.min(Math.max(count, 1), 50);
  const usernames = Array.from({ length: n }, () => f.internet.username().toLowerCase());
  return { usernames, web: `${SITE}/tools/fake-username-generator` };
}

export function generatePassword(opts: {
  length?: number;
  upper?: boolean;
  digits?: boolean;
  symbols?: boolean;
} = {}) {
  const length = Math.min(Math.max(opts.length ?? 16, 6), 128);
  let pool = "abcdefghijkmnopqrstuvwxyz";
  if (opts.upper !== false) pool += "ABCDEFGHJKLMNPQRSTUVWXYZ";
  if (opts.digits !== false) pool += "23456789";
  if (opts.symbols !== false) pool += "!@#$%^&*-_+=?";
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  const password = Array.from(bytes, (b) => pool[b % pool.length]).join("");
  return { password, length, web: `${SITE}/tools/fake-password-generator` };
}

export function generateUuid(count = 1) {
  const n = Math.min(Math.max(count, 1), 50);
  const uuids = Array.from({ length: n }, () => crypto.randomUUID());
  return { uuids, web: `${SITE}/tools/fake-uuid-generator` };
}

export function generateUserAgent(count = 1) {
  const f = baseFaker();
  const n = Math.min(Math.max(count, 1), 20);
  const userAgents = Array.from({ length: n }, () => f.internet.userAgent());
  return { userAgents, web: `${SITE}/tools/fake-user-agent-generator` };
}

export function generateIp(version: "v4" | "v6" | "both" = "v4", count = 1) {
  const f = baseFaker();
  const n = Math.min(Math.max(count, 1), 50);
  const ips = Array.from({ length: n }, () => {
    if (version === "v6") return f.internet.ipv6();
    if (version === "both") return { ipv4: f.internet.ipv4(), ipv6: f.internet.ipv6() };
    return f.internet.ipv4();
  });
  return { ips, web: `${SITE}/tools/fake-ip-generator` };
}

export function generateMac(count = 1) {
  const f = baseFaker();
  const n = Math.min(Math.max(count, 1), 50);
  const macs = Array.from({ length: n }, () => f.internet.mac());
  return { macs, web: `${SITE}/tools/fake-mac-address-generator` };
}

export function generateCreditCard(brand: "visa" | "mastercard" | "amex" | "random" = "random") {
  const prefixes: Record<string, { prefix: string; len: number }> = {
    visa: { prefix: "4", len: 16 },
    mastercard: { prefix: "51", len: 16 },
    amex: { prefix: "37", len: 15 },
  };
  const key =
    brand === "random"
      ? (["visa", "mastercard", "amex"] as const)[Math.floor(Math.random() * 3)]
      : brand;
  const spec = prefixes[key];
  const number = genLuhn(spec.prefix, spec.len);
  const now = new Date();
  const expMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  const expYear = String(now.getFullYear() + 1 + Math.floor(Math.random() * 4));
  const cvv = key === "amex" ? digits(4) : digits(3);
  return {
    brand: key,
    number,
    formatted: number.replace(/(\d{4})(?=\d)/g, "$1 "),
    expMonth,
    expYear,
    cvv,
    disclaimer: "Test card only — Luhn-valid, not a real account. Never use for real payments.",
    web: `${SITE}/tools/fake-credit-card-generator`,
  };
}

export function generateIban(country = "de") {
  const code = country.toLowerCase();
  const iso = countryOf(code).iso2;
  const spec = IBAN_SPECS[code] ?? IBAN_SPECS.de;
  const bank = code === "nl" || code === "gb" || code === "ie" ? letters(4) + digits(spec.bankLen - 4) : digits(spec.bankLen);
  const account = digits(spec.accountLen);
  const raw = `${iso}00${bank}${account}`;
  const iban = ibanCheck(raw);
  return {
    iban,
    country: countryOf(code).name,
    countryCode: code,
    disclaimer: "Test IBAN with valid mod-97 checksum — not a real bank account.",
    web: `${SITE}/tools/fake-iban-generator/${code}`,
  };
}

export function generateCompany(country = "us") {
  const c = countryOf(country);
  const f = fakerOf(c);
  const name = f.company.name();
  const domain = f.internet.domainName();
  return {
    name,
    catchPhrase: f.company.catchPhrase(),
    buzz: f.company.buzzPhrase(),
    domain,
    email: `info@${domain}`,
    country: c.name,
    countryCode: c.code,
    web: `${SITE}/tools/fake-company-generator/${c.code}`,
  };
}

export function generateCrypto(chain: "bitcoin" | "ethereum" | "both" = "both") {
  const f = baseFaker();
  const out: Record<string, string> = {};
  if (chain === "bitcoin" || chain === "both") {
    out.bitcoin = f.finance.bitcoinAddress();
  }
  if (chain === "ethereum" || chain === "both") {
    out.ethereum = f.finance.ethereumAddress();
  }
  return {
    ...out,
    disclaimer: "Random-looking addresses for UI/tests — not funded wallets.",
    web: `${SITE}/tools/fake-crypto-wallet-generator`,
  };
}

export function generateIdentity(country = "us", gender: Gender = "random") {
  const c = countryOf(country);
  const name = generateName(country, gender);
  const address = generateAddress(country);
  const phone = generatePhone(country);
  const f = fakerOf(c);
  const birth = f.date.birthdate({ min: 1955, max: 2005, mode: "year" });
  const username = f.internet.username({ firstName: name.first, lastName: name.last }).toLowerCase();
  const email = `${username.replace(/[^a-z0-9._-]/gi, "") || "user"}@${f.internet.domainName()}`;
  return {
    name,
    address,
    phone,
    birthday: birth.toISOString().slice(0, 10),
    online: {
      email,
      username,
      password: generatePassword({ length: 16 }).password,
      userAgent: f.internet.userAgent(),
      ipv4: f.internet.ipv4(),
      mac: f.internet.mac(),
      uuid: crypto.randomUUID(),
    },
    career: {
      company: f.company.name(),
      jobTitle: f.person.jobTitle(),
    },
    cards: [generateCreditCard("visa"), generateCreditCard("mastercard")],
    country: c.name,
    countryCode: c.code,
    disclaimer: "Fictional test identity. Do not use to deceive people or services.",
    web: `${SITE}/tools/fake-identity-generator/${c.code}`,
  };
}

export function toolUrl(slug: string, country?: string) {
  const base = `${SITE}/tools/${slug}`;
  return country ? `${base}/${country.toLowerCase()}` : base;
}
