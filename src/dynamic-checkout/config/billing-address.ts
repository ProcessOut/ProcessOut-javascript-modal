module ProcessOut {
  export const billingAddressUnitsData = (paymentConfig: DynamicCheckoutPublicConfig) => {
    return {
      street1: {
        unit: "street1",
        placeholder: Translations.getText("street1-label", paymentConfig.locale),
      },
      street2: {
        unit: "street2",
        placeholder: Translations.getText("street2-label", paymentConfig.locale),
      },
      city: {
        unit: "city",
        placeholder: Translations.getText("city-label", paymentConfig.locale),
      },
      postcode: {
        unit: "postcode",
        placeholder: Translations.getText("postcode-label", paymentConfig.locale),
      },
      state: {
        unit: "state",
        placeholder: Translations.getText("state-label", paymentConfig.locale),
      },
    }
  }

  export const billingAddressConfig = {
    AC: {
      name: "Ascension Island",
      units: ["street1", "street2", "city", "postcode"],
    },
    AD: {
      name: "Andorra",
      units: ["street1", "street2", "postcode", "city"],
    },
    AE: {
      name: "United Arab Emirates",
      stateUnit: "emirate",
      units: ["street1", "street2", "state"],
    },
    AF: {
      name: "Afghanistan",
      units: ["street1", "street2", "city", "postcode"],
    },
    AG: {
      name: "Antigua and Barbuda",
    },
    AI: {
      name: "Anguilla",
      units: ["street1", "street2", "city", "postcode"],
    },
    AL: {
      name: "Albania",
      units: ["street1", "street2", "postcode", "city"],
    },
    AM: {
      name: "Armenia",
      units: ["street1", "street2", "postcode", "city", "state"],
    },
    AO: {
      name: "Angola",
      units: ["street1", "street2", "city"],
    },
    AR: {
      name: "Argentina",
      units: ["street1", "street2", "postcode", "city", "state"],
    },
    AT: {
      name: "Austria",
      units: ["street1", "street2", "postcode", "city"],
    },
    AU: {
      name: "Australia",
      cityUnit: "suburb",
      stateUnit: "state",
    },
    AW: {
      name: "Aruba",
      units: ["street1", "street2", "city"],
    },
    AX: {
      name: "Åland Islands",
      units: ["postcode", "city", "street1", "street2"],
    },
    AZ: {
      name: "Azerbaijan",
      units: ["street1", "street2", "postcode", "city"],
    },
    BA: {
      name: "Bosnia and Herzegovina",
      units: ["street1", "street2", "postcode", "city"],
    },
    BB: {
      name: "Barbados",
      stateUnit: "parish",
    },
    BD: {
      name: "Bangladesh",
      units: ["street1", "street2", "city", "postcode"],
    },
    BE: {
      name: "Belgium",
      units: ["street1", "street2", "postcode", "city"],
    },
    BF: {
      name: "Burkina Faso",
      units: ["street1", "street2", "city"],
    },
    BG: {
      name: "Bulgaria",
      units: ["street1", "street2", "postcode", "city"],
    },
    BH: {
      name: "Bahrain",
      units: ["street1", "street2", "city", "postcode"],
    },
    BI: {
      name: "Burundi",
      units: ["street1", "street2", "city"],
    },
    BJ: {
      name: "Benin",
      units: ["street1", "street2", "city"],
    },
    BL: {
      name: "Saint Barthélemy",
      units: ["street1", "street2", "postcode", "city"],
    },
    BM: {
      name: "Bermuda",
      units: ["street1", "street2", "city", "postcode"],
    },
    BN: {
      name: "Brunei",
      units: ["street1", "street2", "city", "postcode"],
    },
    BO: {
      name: "Bolivia",
      units: ["street1", "street2", "city"],
    },
    BQ: {
      name: "Bonaire",
      units: ["street1", "street2", "city"],
    },
    BR: {
      name: "Brazil",
      stateUnit: "state",
    },
    BS: {
      name: "Bahamas",
      stateUnit: "island",
      units: ["street1", "street2", "city", "state"],
    },
    BT: {
      name: "Bhutan",
      units: ["street1", "street2", "city", "postcode"],
    },
    BV: {
      name: "Bouvet Island",
      units: ["street1", "street2", "city"],
    },
    BW: {
      name: "Botswana",
      units: ["street1", "street2", "city"],
    },
    BY: {
      name: "Belarus",
      units: ["state", "postcode", "city", "street1", "street2"],
    },
    BZ: {
      name: "Belize",
      units: ["street1", "street2", "city"],
    },
    CA: {
      name: "Canada",
      units: ["state"],
      states: [
        {
          abbreviation: "AB",
          name: "Alberta",
        },
        {
          abbreviation: "BC",
          name: "British Columbia",
        },
        {
          abbreviation: "MB",
          name: "Manitoba",
        },
        {
          abbreviation: "NB",
          name: "New Brunswick",
        },
        {
          abbreviation: "NL",
          name: "Newfoundland and Labrador",
        },
        {
          abbreviation: "NT",
          name: "Northwest Territories",
        },
        {
          abbreviation: "NS",
          name: "Nova Scotia",
        },
        {
          abbreviation: "NU",
          name: "Nunavut",
        },
        {
          abbreviation: "ON",
          name: "Ontario",
        },
        {
          abbreviation: "PE",
          name: "Prince Edward Island",
        },
        {
          abbreviation: "QC",
          name: "Quebec",
        },
        {
          abbreviation: "SK",
          name: "Saskatchewan",
        },
        {
          abbreviation: "YT",
          name: "Yukon",
        },
      ],
    },
    CD: {
      name: "Democratic Republic of the Congo",
      units: ["street1", "street2", "city"],
    },
    CF: {
      name: "Central African Republic",
      units: ["street1", "street2", "city"],
    },
    CG: {
      name: "Republic of the Congo",
      units: ["street1", "street2", "city"],
    },
    CH: {
      name: "Switzerland",
      units: ["street1", "street2", "postcode", "city"],
    },
    CI: {
      name: "Ivory Coast",
      units: ["street1", "street2", "city"],
    },
    CK: {
      name: "Cook Islands",
      units: ["street1", "street2", "city"],
    },
    CL: {
      name: "Chile",
      units: ["street1", "street2", "postcode", "city", "state"],
    },
    CM: {
      name: "Cameroon",
      units: ["street1", "street2", "city"],
    },
    CN: {
      name: "China",
      units: ["postcode", "state", "city", "street1", "street2"],
    },
    CO: {
      name: "Colombia",
      stateUnit: "department",
    },
    CR: {
      name: "Costa Rica",
      units: ["street1", "street2", "state", "city", "postcode"],
    },
    CV: {
      name: "Cape Verde",
      stateUnit: "island",
      units: ["street1", "street2", "postcode", "city", "state"],
    },
    CW: {
      name: "Curaçao",
      units: ["street1", "street2", "city"],
    },
    CY: {
      name: "Cyprus",
      units: ["street1", "street2", "postcode", "city"],
    },
    CZ: {
      name: "Czech Republic",
      units: ["street1", "street2", "postcode", "city"],
    },
    DE: {
      name: "Germany",
      units: ["street1", "street2", "postcode", "city"],
    },
    DJ: {
      name: "Djibouti",
      units: ["street1", "street2", "city"],
    },
    DK: {
      name: "Denmark",
      units: ["street1", "street2", "postcode", "city"],
    },
    DM: {
      name: "Dominica",
      units: ["street1", "street2", "city"],
    },
    DO: {
      name: "Dominican Republic",
      units: ["street1", "street2", "postcode", "city"],
    },
    DZ: {
      name: "Algeria",
      units: ["street1", "street2", "postcode", "city"],
    },
    EC: {
      name: "Ecuador",
      units: ["street1", "street2", "postcode", "city"],
    },
    EE: {
      name: "Estonia",
      units: ["street1", "street2", "postcode", "city"],
    },
    EG: {
      name: "Egypt",
    },
    EH: {
      name: "Western Sahara",
      units: ["street1", "street2", "postcode", "city"],
    },
    ER: {
      name: "Eritrea",
      units: ["street1", "street2", "city"],
    },
    ES: {
      name: "Spain",
      units: ["street1", "street2", "postcode", "city", "state"],
    },
    ET: {
      name: "Ethiopia",
      units: ["street1", "street2", "postcode", "city"],
    },
    FI: {
      name: "Finland",
      units: ["street1", "street2", "postcode", "city"],
    },
    FJ: {
      name: "Fiji",
      units: ["street1", "street2", "city"],
    },
    FK: {
      name: "Falkland Islands",
      units: ["street1", "street2", "city", "postcode"],
    },
    FO: {
      name: "Faroe Islands",
      units: ["street1", "street2", "postcode", "city"],
    },
    FR: {
      name: "France",
      units: ["street1", "street2", "postcode", "city"],
    },
    GA: {
      name: "Gabon",
      units: ["street1", "street2", "city"],
    },
    GB: {
      name: "United Kingdom",
      cityUnit: "postTown",
      units: ["street1", "street2", "city", "postcode"],
    },
    GD: {
      name: "Grenada",
      units: ["street1", "street2", "city"],
    },
    GE: {
      name: "Georgia",
      units: ["street1", "street2", "postcode", "city"],
    },
    GF: {
      name: "French Guiana",
      units: ["street1", "street2", "postcode", "city"],
    },
    GG: {
      name: "Guernsey",
    },
    GH: {
      name: "Ghana",
      units: ["street1", "street2", "city"],
    },
    GI: {
      name: "Gibraltar",
      units: ["street1", "street2", "postcode"],
    },
    GL: {
      name: "Greenland",
      units: ["street1", "street2", "postcode", "city"],
    },
    GM: {
      name: "Gambia",
      units: ["street1", "street2", "city"],
    },
    GN: {
      name: "Guinea",
      units: ["postcode", "street1", "street2", "city"],
    },
    GP: {
      name: "Guadeloupe",
      units: ["street1", "street2", "postcode", "city"],
    },
    GQ: {
      name: "Equatorial Guinea",
      units: ["street1", "street2", "city"],
    },
    GR: {
      name: "Greece",
      units: ["street1", "street2", "postcode", "city"],
    },
    GS: {
      name: "South Georgia and the South Sandwich Islands",
      units: ["street1", "street2", "city", "postcode"],
    },
    GT: {
      name: "Guatemala",
      units: ["street1", "street2", "postcode", "city"],
    },
    GU: {
      name: "Guam",
      postcodeUnit: "zip",
      units: ["street1", "street2", "city", "postcode"],
    },
    GW: {
      name: "Guinea-Bissau",
      units: ["street1", "street2", "postcode", "city"],
    },
    GY: {
      name: "Guyana",
      units: ["street1", "street2", "city"],
    },
    HK: {
      name: "Hong Kong",
      cityUnit: "district",
      stateUnit: "area",
      units: ["state", "city", "street1", "street2"],
    },
    HN: {
      name: "Honduras",
      stateUnit: "department",
    },
    HR: {
      name: "Croatia",
      units: ["street1", "street2", "postcode", "city"],
    },
    HT: {
      name: "Haiti",
      units: ["street1", "street2", "postcode", "city"],
    },
    HU: {
      name: "Hungary",
      units: ["city", "street1", "street2", "postcode"],
    },
    ID: {
      name: "Indonesia",
    },
    IE: {
      name: "Ireland",
      postcodeUnit: "eircode",
      stateUnit: "county",
    },
    IL: {
      name: "Israel",
      units: ["street1", "street2", "city", "postcode"],
    },
    IM: {
      name: "Isle of Man",
      units: ["street1", "street2", "city", "postcode"],
    },
    IN: {
      name: "India",
      postcodeUnit: "pin",
      stateUnit: "state",
      units: ["street1", "street2", "city", "postcode", "state"],
    },
    IO: {
      name: "British Indian Ocean Territory",
      units: ["street1", "street2", "city", "postcode"],
    },
    IQ: {
      name: "Iraq",
    },
    IS: {
      name: "Iceland",
      units: ["street1", "street2", "postcode", "city"],
    },
    IT: {
      name: "Italy",
      units: ["street1", "street2", "postcode", "city", "state"],
    },
    JE: {
      name: "Jersey",
    },
    JM: {
      name: "Jamaica",
      stateUnit: "parish",
      units: ["street1", "street2", "city", "state"],
    },
    JO: {
      name: "Jordan",
      units: ["street1", "street2", "city", "postcode"],
    },
    JP: {
      name: "Japan",
      stateUnit: "prefecture",
      units: ["postcode", "state", "street1", "street2"],
    },
    KE: {
      name: "Kenya",
      units: ["street1", "street2", "city", "postcode"],
    },
    KG: {
      name: "Kyrgyzstan",
      units: ["street1", "street2", "postcode", "city"],
    },
    KH: {
      name: "Cambodia",
      units: ["street1", "street2", "city", "postcode"],
    },
    KI: {
      name: "Kiribati",
      stateUnit: "island",
      units: ["street1", "street2", "state", "city"],
    },
    KM: {
      name: "Comoros",
      units: ["street1", "street2", "city"],
    },
    KN: {
      name: "Saint Kitts and Nevis",
      stateUnit: "island",
      units: ["street1", "street2", "city", "state"],
    },
    KR: {
      name: "South Korea",
      stateUnit: "doSi",
      units: ["state", "city", "street1", "street2", "postcode"],
    },
    KW: {
      name: "Kuwait",
      units: ["street1", "street2", "postcode", "city"],
    },
    KY: {
      name: "Cayman Islands",
      stateUnit: "island",
      units: ["street1", "street2", "state", "postcode"],
    },
    KZ: {
      name: "Kazakhstan",
      units: ["postcode", "state", "city", "street1", "street2"],
    },
    LA: {
      name: "Laos",
      units: ["street1", "street2", "postcode", "city"],
    },
    LB: {
      name: "Lebanon",
      units: ["street1", "street2", "city", "postcode"],
    },
    LC: {
      name: "Saint Lucia",
      units: ["street1", "street2", "city"],
    },
    LI: {
      name: "Liechtenstein",
      units: ["street1", "street2", "postcode", "city"],
    },
    LK: {
      name: "Sri Lanka",
      units: ["street1", "street2", "city", "postcode"],
    },
    LR: {
      name: "Liberia",
      units: ["street1", "street2", "postcode", "city"],
    },
    LS: {
      name: "Lesotho",
      units: ["street1", "street2", "city", "postcode"],
    },
    LT: {
      name: "Lithuania",
      units: ["street1", "street2", "postcode", "city"],
    },
    LU: {
      name: "Luxembourg",
      units: ["street1", "street2", "postcode", "city"],
    },
    LV: {
      name: "Latvia",
      units: ["street1", "street2", "city", "postcode"],
    },
    LY: {
      name: "Libya",
      units: ["street1", "street2", "city"],
    },
    MA: {
      name: "Morocco",
      units: ["street1", "street2", "postcode", "city"],
    },
    MC: {
      name: "Monaco",
      units: ["street1", "street2", "postcode", "city"],
    },
    MD: {
      name: "Moldova",
      units: ["street1", "street2", "postcode", "city"],
    },
    ME: {
      name: "Montenegro",
      units: ["street1", "street2", "postcode", "city"],
    },
    MF: {
      name: "Saint Martin",
      units: ["street1", "street2", "postcode", "city"],
    },
    MG: {
      name: "Madagascar",
      units: ["street1", "street2", "postcode", "city"],
    },
    MK: {
      name: "North Macedonia",
      units: ["street1", "street2", "postcode", "city"],
    },
    ML: {
      name: "Mali",
      units: ["street1", "street2", "city"],
    },
    MM: {
      name: "Myanmar",
      units: ["street1", "street2", "city", "postcode"],
    },
    MN: {
      name: "Mongolia",
    },
    MO: {
      name: "Macau",
      units: ["street1", "street2"],
    },
    MQ: {
      name: "Martinique",
      units: ["street1", "street2", "postcode", "city"],
    },
    MR: {
      name: "Mauritania",
      units: ["street1", "street2", "city"],
    },
    MS: {
      name: "Montserrat",
      units: ["street1", "street2", "city"],
    },
    MT: {
      name: "Malta",
      units: ["street1", "street2", "city", "postcode"],
    },
    MU: {
      name: "Mauritius",
      units: ["street1", "street2", "postcode", "city"],
    },
    MV: {
      name: "Maldives",
      units: ["street1", "street2", "city", "postcode"],
    },
    MW: {
      name: "Malawi",
      units: ["street1", "street2", "city"],
    },
    MX: {
      name: "Mexico",
      stateUnit: "state",
      units: ["street1", "street2", "postcode", "city", "state"],
    },
    MY: {
      name: "Malaysia",
      stateUnit: "state",
      units: ["street1", "street2", "postcode", "city", "state"],
    },
    MZ: {
      name: "Mozambique",
      units: ["street1", "street2", "postcode", "city", "state"],
    },
    NA: {
      name: "Namibia",
      units: ["street1", "street2", "city", "postcode"],
    },
    NC: {
      name: "New Caledonia",
      units: ["street1", "street2", "postcode", "city"],
    },
    NE: {
      name: "Niger",
      units: ["street1", "street2", "postcode", "city"],
    },
    NG: {
      name: "Nigeria",
      stateUnit: "state",
      units: ["street1", "street2", "city", "postcode", "state"],
    },
    NI: {
      name: "Nicaragua",
      stateUnit: "department",
      units: ["street1", "street2", "postcode", "city", "state"],
    },
    NL: {
      name: "Netherlands",
      units: ["street1", "street2", "postcode", "city"],
    },
    NO: {
      name: "Norway",
      cityUnit: "postTown",
      units: ["street1", "street2", "postcode", "city"],
    },
    NP: {
      name: "Nepal",
      units: ["street1", "street2", "city", "postcode"],
    },
    NR: {
      name: "Nauru",
      stateUnit: "prefecture",
      units: ["street1", "street2", "state"],
    },
    NU: {
      name: "Niue",
      units: ["street1", "street2", "city"],
    },
    NZ: {
      name: "New Zealand",
      units: ["street1", "street2", "city", "postcode"],
    },
    OM: {
      name: "Oman",
      units: ["street1", "street2", "postcode", "city"],
    },
    PA: {
      name: "Panama",
      units: ["street1", "street2", "city", "state"],
    },
    PE: {
      name: "Peru",
      cityUnit: "district",
      units: ["street1", "street2", "city", "postcode", "state"],
    },
    PF: {
      name: "French Polynesia",
      stateUnit: "island",
      units: ["street1", "street2", "postcode", "city", "state"],
    },
    PG: {
      name: "Papua New Guinea",
      units: ["street1", "street2", "city", "postcode", "state"],
    },
    PH: {
      name: "Philippines",
      units: ["street1", "street2", "city", "postcode", "state"],
    },
    PK: {
      name: "Pakistan",
      units: ["street1", "street2", "city", "postcode"],
    },
    PL: {
      name: "Poland",
      units: ["street1", "street2", "postcode", "city"],
    },
    PM: {
      name: "Saint Pierre and Miquelon",
      units: ["street1", "street2", "postcode", "city"],
    },
    PN: {
      name: "Pitcairn Islands",
      units: ["street1", "street2", "city", "postcode"],
    },
    PR: {
      name: "Puerto Rico",
      postcodeUnit: "zip",
      units: ["street1", "street2", "city", "postcode"],
    },
    PS: {
      name: "Palestine",
      units: ["street1", "street2", "city"],
    },
    PT: {
      name: "Portugal",
      units: ["street1", "street2", "postcode", "city"],
    },
    PY: {
      name: "Paraguay",
      units: ["street1", "street2", "postcode", "city"],
    },
    QA: {
      name: "Qatar",
      units: ["street1", "street2", "city"],
    },
    RE: {
      name: "Réunion",
      units: ["street1", "street2", "postcode", "city"],
    },
    RO: {
      name: "Romania",
      units: ["street1", "street2", "postcode", "city"],
    },
    RS: {
      name: "Serbia",
      units: ["street1", "street2", "postcode", "city"],
    },
    RU: {
      name: "Russia",
      stateUnit: "oblast",
    },
    RW: {
      name: "Rwanda",
      units: ["street1", "street2", "city"],
    },
    SA: {
      name: "Saudi Arabia",
      units: ["street1", "street2", "city", "postcode"],
    },
    SB: {
      name: "Solomon Islands",
      units: ["street1", "street2", "city"],
    },
    SC: {
      name: "Seychelles",
      stateUnit: "island",
      units: ["street1", "street2", "city", "state"],
    },
    SE: {
      name: "Sweden",
      cityUnit: "postTown",
      units: ["street1", "street2", "state", "postcode", "city"],
    },
    SG: {
      name: "Singapore",
      units: ["street1", "street2", "postcode"],
    },
    SH: {
      name: "Saint Helena",
      units: ["street1", "street2", "city", "postcode"],
    },
    SI: {
      name: "Slovenia",
      units: ["street1", "street2", "state", "postcode", "city"],
    },
    SJ: {
      name: "Svalbard and Jan Mayen",
      cityUnit: "postTown",
      units: ["street1", "street2", "postcode", "city"],
    },
    SK: {
      name: "Slovakia",
      units: ["street1", "street2", "postcode", "city"],
    },
    SL: {
      name: "Sierra Leone",
      units: ["street1", "street2", "city"],
    },
    SM: {
      name: "San Marino",
      units: ["street1", "street2", "postcode", "city"],
    },
    SN: {
      name: "Senegal",
      units: ["street1", "street2", "postcode", "city"],
    },
    SO: {
      name: "Somalia",
    },
    SR: {
      name: "Suriname",
      units: ["street1", "street2", "city", "state"],
    },
    SS: {
      name: "South Sudan",
      units: ["street1", "street2", "city"],
    },
    ST: {
      name: "São Tomé and Príncipe",
      units: ["street1", "street2", "city"],
    },
    SV: {
      name: "El Salvador",
      units: ["street1", "street2", "postcode", "city", "state"],
    },
    SX: {
      name: "Sint Maarten",
      units: ["street1", "street2", "city"],
    },
    SZ: {
      name: "Eswatini",
      units: ["street1", "street2", "city", "postcode"],
    },
    TA: {
      name: "Tristan da Cunha",
      units: ["street1", "street2", "city", "postcode"],
    },
    TC: {
      name: "Turks and Caicos Islands",
      units: ["street1", "street2", "city", "postcode"],
    },
    TD: {
      name: "Chad",
      units: ["street1", "street2", "city"],
    },
    TF: {
      name: "French Southern Territories",
      units: ["street1", "street2", "city"],
    },
    TG: {
      name: "Togo",
      units: ["street1", "street2", "city"],
    },
    TH: {
      name: "Thailand",
    },
    TJ: {
      name: "Tajikistan",
      units: ["street1", "street2", "postcode", "city"],
    },
    TK: {
      name: "Tokelau",
      units: ["street1", "street2", "city"],
    },
    TL: {
      name: "Timor-Leste",
      units: ["street1", "street2", "city"],
    },
    TM: {
      name: "Turkmenistan",
      units: ["street1", "street2", "postcode", "city"],
    },
    TN: {
      name: "Tunisia",
      units: ["street1", "street2", "postcode", "city"],
    },
    TO: {
      name: "Tonga",
      units: ["street1", "street2", "city"],
    },
    TR: {
      name: "Turkey",
      cityUnit: "district",
      units: ["street1", "street2", "postcode", "city", "state"],
    },
    TT: {
      name: "Trinidad and Tobago",
      units: ["street1", "street2", "city"],
    },
    TV: {
      name: "Tuvalu",
      stateUnit: "island",
      units: ["street1", "street2", "city", "state"],
    },
    TW: {
      name: "Taiwan",
      stateUnit: "county",
      units: ["postcode", "state", "city", "street1", "street2"],
    },
    TZ: {
      name: "Tanzania",
      units: ["street1", "street2", "postcode", "city"],
    },
    UA: {
      name: "Ukraine",
      stateUnit: "oblast",
    },
    UG: {
      name: "Uganda",
      units: ["street1", "street2", "city"],
    },
    US: {
      name: "United States",
      postcodeUnit: "zip",
      stateUnit: "state",
      units: ["state"],
      states: [
        {
          abbreviation: "AL",
          name: "Alabama",
        },
        {
          abbreviation: "AK",
          name: "Alaska",
        },
        {
          abbreviation: "AS",
          name: "American Samoa",
        },
        {
          abbreviation: "AZ",
          name: "Arizona",
        },
        {
          abbreviation: "AR",
          name: "Arkansas",
        },
        {
          abbreviation: "AA",
          name: "Armed Forces (AA)",
        },
        {
          abbreviation: "AE",
          name: "Armed Forces (AE)",
        },
        {
          abbreviation: "AP",
          name: "Armed Forces (AP)",
        },
        {
          abbreviation: "CA",
          name: "California",
        },
        {
          abbreviation: "CO",
          name: "Colorado",
        },
        {
          abbreviation: "CT",
          name: "Connecticut",
        },
        {
          abbreviation: "DE",
          name: "Delaware",
        },
        {
          abbreviation: "DC",
          name: "District of Columbia",
        },
        {
          abbreviation: "FL",
          name: "Florida",
        },
        {
          abbreviation: "GA",
          name: "Georgia",
        },
        {
          abbreviation: "GU",
          name: "Guam",
        },
        {
          abbreviation: "HI",
          name: "Hawaii",
        },
        {
          abbreviation: "ID",
          name: "Idaho",
        },
        {
          abbreviation: "IL",
          name: "Illinois",
        },
        {
          abbreviation: "IN",
          name: "Indiana",
        },
        {
          abbreviation: "IA",
          name: "Iowa",
        },
        {
          abbreviation: "KS",
          name: "Kansas",
        },
        {
          abbreviation: "KY",
          name: "Kentucky",
        },
        {
          abbreviation: "LA",
          name: "Louisiana",
        },
        {
          abbreviation: "ME",
          name: "Maine",
        },
        {
          abbreviation: "MH",
          name: "Marshall Islands",
        },
        {
          abbreviation: "MD",
          name: "Maryland",
        },
        {
          abbreviation: "MA",
          name: "Massachusetts",
        },
        {
          abbreviation: "MI",
          name: "Michigan",
        },
        {
          abbreviation: "FM",
          name: "Micronesia",
        },
        {
          abbreviation: "MN",
          name: "Minnesota",
        },
        {
          abbreviation: "MS",
          name: "Mississippi",
        },
        {
          abbreviation: "MO",
          name: "Missouri",
        },
        {
          abbreviation: "MT",
          name: "Montana",
        },
        {
          abbreviation: "NE",
          name: "Nebraska",
        },
        {
          abbreviation: "NV",
          name: "Nevada",
        },
        {
          abbreviation: "NH",
          name: "New Hampshire",
        },
        {
          abbreviation: "NJ",
          name: "New Jersey",
        },
        {
          abbreviation: "NM",
          name: "New Mexico",
        },
        {
          abbreviation: "NY",
          name: "New York",
        },
        {
          abbreviation: "NC",
          name: "North Carolina",
        },
        {
          abbreviation: "ND",
          name: "North Dakota",
        },
        {
          abbreviation: "MP",
          name: "Northern Mariana Islands",
        },
        {
          abbreviation: "OH",
          name: "Ohio",
        },
        {
          abbreviation: "OK",
          name: "Oklahoma",
        },
        {
          abbreviation: "OR",
          name: "Oregon",
        },
        {
          abbreviation: "PW",
          name: "Palau",
        },
        {
          abbreviation: "PA",
          name: "Pennsylvania",
        },
        {
          abbreviation: "PR",
          name: "Puerto Rico",
        },
        {
          abbreviation: "RI",
          name: "Rhode Island",
        },
        {
          abbreviation: "SC",
          name: "South Carolina",
        },
        {
          abbreviation: "SD",
          name: "South Dakota",
        },
        {
          abbreviation: "TN",
          name: "Tennessee",
        },
        {
          abbreviation: "TX",
          name: "Texas",
        },
        {
          abbreviation: "UT",
          name: "Utah",
        },
        {
          abbreviation: "VT",
          name: "Vermont",
        },
        {
          abbreviation: "VI",
          name: "Virgin Islands",
        },
        {
          abbreviation: "VA",
          name: "Virginia",
        },
        {
          abbreviation: "WA",
          name: "Washington",
        },
        {
          abbreviation: "WV",
          name: "West Virginia",
        },
        {
          abbreviation: "WI",
          name: "Wisconsin",
        },
        {
          abbreviation: "WY",
          name: "Wyoming",
        },
      ],
    },
    UY: {
      name: "Uruguay",
      units: ["street1", "street2", "postcode", "city", "state"],
    },
    UZ: {
      name: "Uzbekistan",
      units: ["street1", "street2", "postcode", "city", "state"],
    },
    VA: {
      name: "Vatican City",
      units: ["street1", "street2", "postcode", "city"],
    },
    VC: {
      name: "Saint Vincent and the Grenadines",
      units: ["street1", "street2", "city", "postcode"],
    },
    VE: {
      name: "Venezuela",
      stateUnit: "state",
      units: ["street1", "street2", "city", "postcode", "state"],
    },
    VG: {
      name: "British Virgin Islands",
      units: ["street1", "street2", "city", "postcode"],
    },
    VN: {
      name: "Vietnam",
    },
    VU: {
      name: "Vanuatu",
      units: ["street1", "street2", "city"],
    },
    WF: {
      name: "Wallis and Futuna",
      units: ["street1", "street2", "postcode", "city"],
    },
    WS: {
      name: "Samoa",
      units: ["street1", "street2", "city"],
    },
    XK: {
      name: "Kosovo",
      units: ["street1", "street2", "postcode", "city"],
    },
    YE: {
      name: "Yemen",
      units: ["street1", "street2", "city"],
    },
    YT: {
      name: "Mayotte",
      units: ["street1", "street2", "postcode", "city"],
    },
    ZA: {
      name: "South Africa",
      units: ["street1", "street2", "city", "postcode"],
    },
    ZM: {
      name: "Zambia",
      units: ["street1", "street2", "postcode", "city"],
    },
    ZW: {
      name: "Zimbabwe",
      units: ["street1", "street2", "city"],
    },
  }
}
