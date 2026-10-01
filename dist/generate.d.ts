export declare function listCountries(): {
    code: string;
    iso2: string;
    name: string;
    dial: string;
    toolsUrl: string;
}[];
export type Gender = "male" | "female" | "random";
export declare function generateName(country?: string, gender?: Gender): {
    first: string;
    last: string;
    full: string;
    gender: "male" | "female";
    country: string;
    countryCode: string;
    web: string;
};
export declare function generateAddress(country?: string): {
    street: string;
    city: string;
    state: string;
    postal: string;
    country: string;
    countryCode: string;
    countryFlag: string;
    full: string;
    web: string;
};
export declare function generatePhone(country?: string): {
    national: string;
    international: string;
    dial: string;
    country: string;
    countryCode: string;
    web: string;
};
export declare function generateEmail(count?: number): {
    emails: string[];
    web: string;
};
export declare function generateUsername(count?: number): {
    usernames: string[];
    web: string;
};
export declare function generatePassword(opts?: {
    length?: number;
    upper?: boolean;
    digits?: boolean;
    symbols?: boolean;
}): {
    password: string;
    length: number;
    web: string;
};
export declare function generateUuid(count?: number): {
    uuids: `${string}-${string}-${string}-${string}-${string}`[];
    web: string;
};
export declare function generateUserAgent(count?: number): {
    userAgents: string[];
    web: string;
};
export declare function generateIp(version?: "v4" | "v6" | "both", count?: number): {
    ips: (string | {
        ipv4: string;
        ipv6: string;
    })[];
    web: string;
};
export declare function generateMac(count?: number): {
    macs: string[];
    web: string;
};
export declare function generateCreditCard(brand?: "visa" | "mastercard" | "amex" | "random"): {
    brand: "visa" | "mastercard" | "amex";
    number: string;
    formatted: string;
    expMonth: string;
    expYear: string;
    cvv: string;
    disclaimer: string;
    web: string;
};
export declare function generateIban(country?: string): {
    iban: string;
    country: string;
    countryCode: string;
    disclaimer: string;
    web: string;
};
export declare function generateCompany(country?: string): {
    name: string;
    catchPhrase: string;
    buzz: string;
    domain: string;
    email: string;
    country: string;
    countryCode: string;
    web: string;
};
export declare function generateCrypto(chain?: "bitcoin" | "ethereum" | "both"): {
    disclaimer: string;
    web: string;
};
export declare function generateIdentity(country?: string, gender?: Gender): {
    name: {
        first: string;
        last: string;
        full: string;
        gender: "male" | "female";
        country: string;
        countryCode: string;
        web: string;
    };
    address: {
        street: string;
        city: string;
        state: string;
        postal: string;
        country: string;
        countryCode: string;
        countryFlag: string;
        full: string;
        web: string;
    };
    phone: {
        national: string;
        international: string;
        dial: string;
        country: string;
        countryCode: string;
        web: string;
    };
    birthday: string;
    online: {
        email: string;
        username: string;
        password: string;
        userAgent: string;
        ipv4: string;
        mac: string;
        uuid: `${string}-${string}-${string}-${string}-${string}`;
    };
    career: {
        company: string;
        jobTitle: string;
    };
    cards: {
        brand: "visa" | "mastercard" | "amex";
        number: string;
        formatted: string;
        expMonth: string;
        expYear: string;
        cvv: string;
        disclaimer: string;
        web: string;
    }[];
    country: string;
    countryCode: string;
    disclaimer: string;
    web: string;
};
export declare function toolUrl(slug: string, country?: string): string;
