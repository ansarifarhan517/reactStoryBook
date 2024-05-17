const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');
const fs = require('fs');

function convertJsonToCsv(jsonData, outputPath) {
    const csvWriter = createObjectCsvWriter({
        path: outputPath,
        header: [
            { id: 'key', title: 'Key' },
            { id: 'value', title: 'Value' },
            { id: 'type', title: 'Type' },
            { id: 'enabled', title: 'Enabled' }
        ]
    });

    const records = [];

    for (const clientKey in jsonData) {
        const clientData = jsonData[clientKey];
        for (const data of clientData) {
            records.push({
                key: data.key,
                value: data.value,
                type: data.type,
                enabled: data.enabled
            });
        }
    }

    return csvWriter.writeRecords(records);
}

// Example usage:
const jsonData = {
    "ChilleExpress": [
        {
            "key": "APIuserName",
            "value": "77317+care@loginextsolutions.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 2a522336-4958-47e7-a14e-62bb06da4c8f",
            "type": "default",
            "enabled": true
        }
    ],
    "client1": [
        {
            "key": "APIuserName",
            "value": "beta25@loginextsolutions.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC e1210a9c-240e-42ef-800b-89918d824f13",
            "type": "default",
            "enabled": true
        }
    ],
    "AllMile_20_Orders_Client": [
        {
            "key": "APIuserName",
            "value": "Ind_AllMile_Automation@loginextsolutions.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 131c1a37-edc7-4377-9431-b435d6d57ee0",
            "type": "default",
            "enabled": true
        }
    ],
    "FMLM_20_Orders_Client": [
        {
            "key": "APIuserName",
            "value": "Ind_FMLM_Planning_Automation@loginextsolutions.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 71875675-634a-432e-844c-b742590027ac",
            "type": "default",
            "enabled": true
        }
    ],
    "client2": [
        {
            "key": "APIuserName",
            "value": "Ind_FMLM_Planning_Automation@loginextsolutions.com",
            "type": "default",
            "enabled": true
        }
    ],
    "client3": [
        {
            "key": "APIuserNameAllmile",
            "value": "middlemile@mailinator.com",
            "type": "default",
            "enabled": true
        }
    ],
    "client4": [
        {
            "key": "APIuserName",
            "value": "Ind_AllMile_Automation@loginextsolutions.com",
            "type": "default",
            "enabled": true
        }
    ],
    "client5": [
        {
            "key": "APIuserName",
            "value": "DemoAdmin1@mailinator.com",
            "type": "default",
            "enabled": true
        }
    ],
    "client6": [
        {
            "key": "APIuserName",
            "value": "ritesh.j@loginextsolutions.com",
            "type": "default",
            "enabled": true
        }
    ],
    "client7FMLM": [
        {
            "key": "APIuserName",
            "value": "38722+care@loginextsolutions.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 1b2b6631-e029-401e-9d62-b45754cf0a99",
            "type": "default",
            "enabled": true
        }

    ],
    "client9FMLM": [
        {
            "key": "APIuserName",
            "value": "2971+care@loginextsolutions.com",
            "type": "default",
            "enabled": true
        }
    ],
    "client10FMLM": [
        {
            "key": "APIuserName",
            "value": "4717+care@loginextsolutions.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 282614c1-55d9-4ec8-89b3-79099f45f194",
            "type": "default",
            "enabled": true
        }
    ],
    "client11FMLM": [
        {
            "key": "APIuserName",
            "value": "2278+care@loginextsolutions.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC b42b5237-5d9c-4eed-babd-1cf8de8de448",
            "type": "default",
            "enabled": true
        }
    ],
    "client13FMLM": [
        {
            "key": "APIuserName",
            "value": "3474+care@loginextsolutions.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 30df7085-c4b1-426e-99ef-f92527b47acb",
            "type": "default",
            "enabled": true
        }
    ],
    "client14FMLM": [
        {
            "key": "APIuserName",
            "value": "1446+care@loginextsolutions.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 5885e05a-3964-4ea2-8482-3216201ffd47",
            "type": "default",
            "enabled": true
        }
    ],
    "client15FMLM": [
        {
            "key": "APIuserName",
            "value": "323252+care@loginextsolutions.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 3eacd555-8621-4be3-b348-016aeba4a00a",
            "type": "default",
            "enabled": true
        }
    ],
    "client16FMLM": [
        {
            "key": "APIuserName",
            "value": "70098+care@loginextsolutions.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 1c240249-5283-4f51-92bb-d6f3c9aa6a49",
            "type": "default",
            "enabled": true
        }
    ],
    "client17FMLM": [
        {
            "key": "APIuserName",
            "value": "2981+care@loginextsolutions.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 9bc51ca3-6778-48ef-a9bc-78bbb520e374",
            "type": "default",
            "enabled": true
        }
    ],
    "client20LM": [
        {
            "key": "APIuserName",
            "value": "2981+care@loginextsolutions.com",
            "type": "default",
            "enabled": true
        }
    ],
    "client8AllMile": [
        {
            "key": "APIuserName",
            "value": "4516+care@loginextsolutions.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 5f5e7e00-f02a-48a8-92f1-9a833e1fd912",
            "type": "default",
            "enabled": true
        }
    ],
    "client12AllMile": [
        {
            "key": "APIuserName",
            "value": "77317+care@loginextsolutions.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 28d329a0-6525-4bff-b9dc-2e01d2eb0c94",
            "type": "default",
            "enabled": true
        }
    ],

    "client18AllMile": [
        {
            "key": "APIuserName",
            "value": "3760+care@loginextsolutions.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC e8cb96bd-f5f4-482c-b963-60b5d5f3d4d1",
            "type": "default",
            "enabled": true
        }
    ],
    "client19AllMile": [
        {
            "key": "APIuserName",
            "value": "243690+care@loginextsolutions.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC b1d86e39-7429-4345-abfa-556f5f704de9",
            "type": "default",
            "enabled": true
        }
    ],
    "client21AllMile": [
        {
            "key": "APIuserName",
            "value": "310147+care@loginextsolutions.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 0f2baa17-af40-4289-80dc-a0aac579c0d5",
            "type": "default",
            "enabled": true
        }
    ],
    "client22AllMile": [
        {
            "key": "APIuserName",
            "value": "311988+care@loginextsolutions.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC ce55ae8c-852f-47c6-9f7a-76d89de0a838",
            "type": "default",
            "enabled": true
        }
    ],
    "client23AllMile": [
        {
            "key": "APIuserName",
            "value": "1703412115492Prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC d442639d-cce1-4ce2-9335-05e8831214c9",
            "type": "default",
            "enabled": true
        }
    ],
    "client24AllMile": [
        {
            "key": "APIuserName",
            "value": "1703412081769Prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC b40cb31f-9317-4e87-8ffd-f10b1a1ba90a",
            "type": "default",
            "enabled": true
        }
    ],
    "client25AllMile": [
        {
            "key": "APIuserName",
            "value": "1703411835770Prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC a7ed44c7-25a4-40a7-a33b-ba903c823946",
            "type": "default",
            "enabled": true
        }
    ],
    "client26AllMile": [
        {
            "key": "APIuserName",
            "value": "1703411811687Prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC ea42c9df-026d-40c3-873d-065aaef67363",
            "type": "default",
            "enabled": true
        }
    ],
    "client27AllMile": [
        {
            "key": "APIuserName",
            "value": "1703411787733Prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 5ebc0bfb-b36c-4688-a60d-16a375cafcb2",
            "type": "default",
            "enabled": true
        }
    ],
    "client28AllMile": [
        {
            "key": "APIuserName",
            "value": "1703411763848Prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 6c6dd3ab-6b45-4412-a0bb-d5a10e566223",
            "type": "default",
            "enabled": true
        }
    ],
    "client29AllMile": [
        {
            "key": "APIuserName",
            "value": "1703411739571Prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC ee9bfea8-de57-428d-8dfc-dbfa52869717",
            "type": "default",
            "enabled": true
        }
    ],
    "client30AllMile": [
        {
            "key": "APIuserName",
            "value": "1703411715539Prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC da86700c-2ce6-46bd-9307-44fd39798948",
            "type": "default",
            "enabled": true
        }
    ],
    "client31AllMile": [
        {
            "key": "APIuserName",
            "value": "1703411691381Prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC d93c7129-8676-4553-8310-db111daf182b",
            "type": "default",
            "enabled": true
        }
    ],
    "client32AllMile": [
        {
            "key": "APIuserName",
            "value": "1703411665208Prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 4eb98a48-9b8f-4991-b3d4-f2fb9c474d64",
            "type": "default",
            "enabled": true
        }
    ],
    "client33AllMile": [
        {
            "key": "APIuserName",
            "value": "1703410555342Prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 1181ee4e-27f4-4594-b17b-d4d6742c6874",
            "type": "default",
            "enabled": true
        }
    ],
    "client34AllMile": [
        {
            "key": "APIuserName",
            "value": "1703410529267Prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 8121ecda-5ab4-4fd7-a7d2-cde9051d89ff",
            "type": "default",
            "enabled": true
        }
    ],
    "client35AllMile": [
        {
            "key": "APIuserName",
            "value": "1703410502229Prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 66d1111c-9d1b-4094-b702-70d6397aba0d",
            "type": "default",
            "enabled": true
        }
    ],
    "client36AllMile": [
        {
            "key": "APIuserName",
            "value": "1703410475305Prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 28a41cf8-5fbd-4201-860d-b29aeed7f6c2",
            "type": "default",
            "enabled": true
        }
    ],
    "client37AllMile": [
        {
            "key": "APIuserName",
            "value": "1703410448586Prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 30aa90c1-fc13-4e54-8bc1-cacd36a71b3c",
            "type": "default",
            "enabled": true
        }
    ],
    "client38AllMile": [
        {
            "key": "APIuserName",
            "value": "1703410421698Prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 119343ad-7952-48be-9b54-1daac3b77059",
            "type": "default",
            "enabled": true
        }
    ],
    "client39AllMile": [
        {
            "key": "APIuserName",
            "value": "1703410395694Prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC dbf0e419-4149-4111-96d1-64f19412965b",
            "type": "default",
            "enabled": true
        }
    ],
    "client40AllMile": [
        {
            "key": "APIuserName",
            "value": "1703410366456Prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 25b2fe2e-18aa-4730-bd4c-545de7156e85",
            "type": "default",
            "enabled": true
        }
    ],
    "client41AllMile": [
        {
            "key": "APIuserName",
            "value": "1703410338328Prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC e70e56aa-531f-4dd4-83e6-a7dae076505f",
            "type": "default",
            "enabled": true
        }
    ],
    "client42AllMile": [
        {
            "key": "APIuserName",
            "value": "1703410308778Prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 1e21acc7-f89a-4b82-852e-9f5f0448b24e",
            "type": "default",
            "enabled": true
        }
    ],
    "client43AllMile": [
        {
            "key": "APIuserName",
            "value": "1703410279770Prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 713639ca-3046-45e5-9a8d-3cd51a568506",
            "type": "default",
            "enabled": true
        }
    ],
    "client44AllMile": [
        {
            "key": "APIuserName",
            "value": "1703409979143Prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 3d27e048-551d-418a-adab-c4c9dc758188",
            "type": "default",
            "enabled": true
        }
    ],
    "client45AllMile": [
        {
            "key": "APIuserName",
            "value": "1703409879657Prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC f4de1525-193b-4450-b825-5fb205ec0c38",
            "type": "default",
            "enabled": true
        }
    ],
    "client46AllMile": [
        {
            "key": "APIuserName",
            "value": "1703348445686Prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 418d37b3-967d-40e1-9008-758b26db73ba",
            "type": "default",
            "enabled": true
        }
    ],
    "client47FMLM": [
        {
            "key": "APIuserName",
            "value": "1703415539878Prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 8c95d689-9174-4710-8cbd-7e4c2c8a52d1",
            "type": "default",
            "enabled": true
        }
    ],
    "client48FMLM": [
        {
            "key": "APIuserName",
            "value": "1703414498261prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 2a92b96e-5c11-466c-8d65-2cf12475d96d",
            "type": "default",
            "enabled": true
        }
    ],
    "client49FMLM": [
        {
            "key": "APIuserName",
            "value": "1703412081769prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 66e191d0-df43-4627-9951-36dc9c704b80",
            "type": "default",
            "enabled": true
        }
    ],
    "client50FMLM": [
        {
            "key": "APIuserName",
            "value": "1703414021413prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 9eefda24-3055-4363-8c15-7ad88d5636ce",
            "type": "default",
            "enabled": true
        }
    ],
    "client51FMLM": [
        {
            "key": "APIuserName",
            "value": "1703414166023prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 1631d7a7-67bc-49dc-bd08-044d6d2a85db",
            "type": "default",
            "enabled": true
        }
    ],
    "client52FMLM": [
        {
            "key": "APIuserName",
            "value": "1703411014402prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 5722ccd3-c297-4652-bb8a-45e204108dd7",
            "type": "default",
            "enabled": true
        }
    ],
    "client53FMLM": [
        {
            "key": "APIuserName",
            "value": "1703408407960prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 8291a132-9db3-4388-bda5-f8eec8e0ee2f",
            "type": "default",
            "enabled": true
        }
    ],
    "client54FMLM": [
        {
            "key": "APIuserName",
            "value": "1703410502229prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 01c410af-bfa5-4246-a7f0-c1431d6870dd",
            "type": "default",
            "enabled": true
        }
    ],
    "client55FMLM": [
        {
            "key": "APIuserName",
            "value": "1703410395694prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 2bc36e77-3035-4187-a5c9-b121a54c81c8",
            "type": "default",
            "enabled": true
        }
    ],
    "client56FMLM": [
        {
            "key": "APIuserName",
            "value": "1703410475305prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC d47d9cf3-9dd2-4145-8604-6a6d08b692d2",
            "type": "default",
            "enabled": true
        }
    ],
    "client57FMLM": [
        {
            "key": "APIuserName",
            "value": "1703411462445prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC b89b7c7a-5750-4774-954d-329a8fa1a2c1",
            "type": "default",
            "enabled": true
        }
    ],
    "client58FMLM": [
        {
            "key": "APIuserName",
            "value": "1703414313212prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 895307d8-54c3-412c-b28e-9bcedf0521c8",
            "type": "default",
            "enabled": true
        }
    ],
    "client59FMLM": [
        {
            "key": "APIuserName",
            "value": "1703415142830prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 11186320-061e-4c46-8f4c-0b63f74207dc",
            "type": "default",
            "enabled": true
        }
    ],
    "client60FMLM": [
        {
            "key": "APIuserName",
            "value": "1703415179278prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC c3082150-ef27-4143-8594-5f571d1f3270",
            "type": "default",
            "enabled": true
        }
    ],
    "client61LM": [
        {
            "key": "APIuserName",
            "value": "1703415116267prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 37bb41a7-a155-4326-9418-c55acf42e51b",
            "type": "default",
            "enabled": true
        }
    ],
    "client62LM": [
        {
            "key": "APIuserName",
            "value": "1703414826412prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 4029b4b6-8874-4268-8045-e71059f53ac9",
            "type": "default",
            "enabled": true
        }
    ],
    "client63FMLM": [
        {
            "key": "APIuserName",
            "value": "1703414737673prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC a16b9c8b-b577-473c-97af-585c228c8711",
            "type": "default",
            "enabled": true
        }
    ],
    "client64FMLM": [
        {
            "key": "APIuserName",
            "value": "1703411835770prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 863e5b32-4509-4f90-b2d8-096aae36a9d9",
            "type": "default",
            "enabled": true
        }
    ],
    "client65LM": [
        {
            "key": "APIuserName",
            "value": "1703412244727prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC cf16c7b8-81a2-4f44-8003-3fc4a92a09d7",
            "type": "default",
            "enabled": true
        }
    ],
    "client66FMLM": [
        {
            "key": "APIuserName",
            "value": "1703409979143prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC eacc48c0-aa01-42be-be83-b3d4b53ddaa0",
            "type": "default",
            "enabled": true
        }
    ],
    "client67FMLM": [
        {
            "key": "APIuserName",
            "value": "1703411247766prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 2b8bbc3d-addb-4ab1-a9ce-c86b0478361a",
            "type": "default",
            "enabled": true
        }
    ],
    "client68FMLM": [
        {
            "key": "APIuserName",
            "value": "1703411665208prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 379547fc-4a42-4fed-a10e-54e70fa11842",
            "type": "default",
            "enabled": true
        }
    ],
    "client69LM": [
        {
            "key": "APIuserName",
            "value": "1703412225204prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC d09d625a-38b5-4a00-8c27-ae9bae176d19",
            "type": "default",
            "enabled": true
        }
    ],
    "client70LM": [
        {
            "key": "APIuserName",
            "value": "1703412284376prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 4dbd2db8-3990-46c6-bfe4-d61ad002d60e",
            "type": "default",
            "enabled": true
        }
    ],
    "client71FMLM": [
        {
            "key": "APIuserName",
            "value": "1703413539640prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 7a8d6c78-0e98-47c9-8be4-6c09e726f99f",
            "type": "default",
            "enabled": true
        }
    ],
    "client72FMLM": [
        {
            "key": "APIuserName",
            "value": "1703414371297prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 2026acbb-da18-4737-b3f2-ccf187eaced9",
            "type": "default",
            "enabled": true
        }
    ],
    "client73FMLM": [
        {
            "key": "APIuserName",
            "value": "1703411594390prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 7921a3c2-5fa5-4e19-b9e1-e20a1196ecc9",
            "type": "default",
            "enabled": true
        }
    ],
    "client74FMLM": [
        {
            "key": "APIuserName",
            "value": "1703411641282prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC dda13056-78be-4215-8fc4-735b0032d2ff",
            "type": "default",
            "enabled": true
        }
    ],
    "client75LM": [
        {
            "key": "APIuserName",
            "value": "1703414986809prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 057088c7-09f7-4cc2-a666-6ea4652c1398",
            "type": "default",
            "enabled": true
        }
    ],
    "client76FMLM": [
        {
            "key": "APIuserName",
            "value": "1703414666008prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 51b6936e-42bb-4e2e-986d-8791f175a149",
            "type": "default",
            "enabled": true
        }
    ],
    "client77FMLM": [
        {
            "key": "APIuserName",
            "value": "1703411435943prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 7513a035-e4c2-411a-a040-7f799265fcb2",
            "type": "default",
            "enabled": true
        }
    ],
    "client78LM": [
        {
            "key": "APIuserName",
            "value": "1703412165476prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 7a4ee721-eed2-4f47-a625-dd26383db5f1",
            "type": "default",
            "enabled": true
        }
    ],
    "client79FMLM": [
        {
            "key": "APIuserName",
            "value": "1703334262154prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 1c357a8b-8d96-41b0-84cc-55ac8ff073ab",
            "type": "default",
            "enabled": true
        }
    ],
    "client80FMLM": [
        {
            "key": "APIuserName",
            "value": "1703410366456prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 25b2fe2e-18aa-4730-bd4c-545de7156e85",
            "type": "default",
            "enabled": true
        }
    ],
    "client81FMLM": [
        {
            "key": "APIuserName",
            "value": "1703411691381prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 45208b8b-4e46-4fba-be74-254ad4a2e8e8",
            "type": "default",
            "enabled": true
        }
    ],
    "client82LM": [
        {
            "key": "APIuserName",
            "value": "1703412144269prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 26d92b7c-62ad-49a9-a9b2-c9c0763b707a",
            "type": "default",
            "enabled": true
        }
    ],
    "client83LM": [
        {
            "key": "APIuserName",
            "value": "1703409879657prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 26d92b7c-62ad-49a9-a9b2-c9c0763b707a",
            "type": "default",
            "enabled": true
        }
    ],
    "client84FMLM": [
        {
            "key": "APIuserName",
            "value": "1703413406311prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC b0852a99-8090-4815-baf5-2e9cf40e9902",
            "type": "default",
            "enabled": true
        }
    ],
    "client85FMLM": [
        {
            "key": "APIuserName",
            "value": "1703411297675prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 71f853fc-ce47-4240-bbe1-f40d1168cb4e",
            "type": "default",
            "enabled": true
        }
    ],
    "client86LM": [
        {
            "key": "APIuserName",
            "value": "1703412340103prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 935d9694-f541-4dc0-af44-0c01674f3a4c",
            "type": "default",
            "enabled": true
        }
    ],
    "client87FMLM": [
        {
            "key": "APIuserName",
            "value": "1703414786861prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 44244f79-1302-4d82-843c-bd948e96b24f",
            "type": "default",
            "enabled": true
        }
    ],
    "client88FMLM": [
        {
            "key": "APIuserName",
            "value": "1703415014728prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 44244f79-1302-4d82-843c-bd948e96b24f",
            "type": "default",
            "enabled": true
        }
    ],
    "client89FMLM": [
        {
            "key": "APIuserName",
            "value": "1703411516433prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 9eebb432-a93f-42c8-9985-38f7d946b4ab",
            "type": "default",
            "enabled": true
        }
    ],
    "client90LM": [
        {
            "key": "APIuserName",
            "value": "1703414895016prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC b92c7855-606e-4440-97cb-8a41021a8d13",
            "type": "default",
            "enabled": true
        }
    ],
    "client91FMLM": [
        {
            "key": "APIuserName",
            "value": "1703411715539prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 0f5127ea-08d7-4d56-928b-f2f658840299",
            "type": "default",
            "enabled": true
        }
    ],
    "client92FMLM": [
        {
            "key": "APIuserName",
            "value": "1703410308778prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 1e21acc7-f89a-4b82-852e-9f5f0448b24e",
            "type": "default",
            "enabled": true
        }
    ],
    "client93FMLM": [
        {
            "key": "APIuserName",
            "value": "1703411194447prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 5497b28c-cf1e-4b10-949e-602ac1c241d1",
            "type": "default",
            "enabled": true
        }
    ],
    "client94LM": [
        {
            "key": "APIuserName",
            "value": "1703412204683prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 31d9efb9-5c25-417b-96cf-4ebfc1ff9b43",
            "type": "default",
            "enabled": true
        }
    ],
    "client95FMLM": [
        {
            "key": "APIuserName",
            "value": "1703410279770prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 9f771b59-cd7a-4029-9573-596515ce00e3",
            "type": "default",
            "enabled": true
        }
    ],
    "client96FMLM": [
        {
            "key": "APIuserName",
            "value": "1703411386158prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 90e46d2b-fcd3-488c-8242-b99494ef3f38",
            "type": "default",
            "enabled": true
        }
    ],
    "client97LM": [
        {
            "key": "APIuserName",
            "value": "1703412305012prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 0239ca29-bb8a-4ac4-9e0a-35978d877172",
            "type": "default",
            "enabled": true
        }
    ],
    "client98FMLM": [
        {
            "key": "APIuserName",
            "value": "1703411142838prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC 14c0bcd9-26bd-4a90-9aa4-28ed6ed6211c",
            "type": "default",
            "enabled": true
        }
    ],
    "client99FMLM": [
        {
            "key": "APIuserName",
            "value": "1703413781951prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC eed9c396-45f9-4582-8212-7e9825bb9f50",
            "type": "default",
            "enabled": true
        }
    ],
    "client100FMLM": [
        {
            "key": "APIuserName",
            "value": "1703410448586prod@mailinator.com",
            "type": "default",
            "enabled": true
        },
        {
            "key": "ApiTokenClient",
            "value": "BASIC f4d9902a-a44c-44ce-9001-8cd66aae5058",
            "type": "default",
            "enabled": true
        }
    ]


}


const outputPath = path.resolve(__dirname, 'qa-automationClients.csv');

convertJsonToCsv(jsonData, outputPath)
    .then(() => console.log(`CSV file written to ${outputPath}`))
    .catch(error => console.error('Error writing CSV file:', error));
