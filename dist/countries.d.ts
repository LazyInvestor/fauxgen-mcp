/** Lightweight country catalog for MCP (mirrors fauxgen.com coverage). */
export type CountryMeta = {
    code: string;
    iso2: string;
    name: string;
    /** @faker-js/faker locale key */
    locale: string;
    dial: string;
};
export declare const COUNTRIES: CountryMeta[];
export declare function countryOf(code: string): CountryMeta;
export declare const COUNTRY_CODES: string[];
