const https = require('https');
const http = require('http');
const { Buffer } = require('buffer');

const url = require('url');

const id = new URLSearchParams(url.parse(process.argv[2] || '').search).get('id');

function antara(str, start, end) {
    const ini = str.indexOf(start);
    if (ini === -1) return '';
    const ini2 = ini + start.length;
    const len = str.indexOf(end, ini2) - ini2;
    return str.substr(ini2, len);
}

function curlget(urlx) {
    return new Promise((resolve, reject) => {
        const opts = url.parse(urlx);
        opts.headers = {
            'user-agent': 'tv-android/2.41.5 (700)',
            'x-client': '1747880044',
            'x-signature': 'c0ba69445b0466d763d23d779f480f4b16f75cb8fe34982342c0fc9d764dcbdc',
            'referer': 'androidtv-app://com.vidio.android.tv',
            'x-api-platform': 'tv-android',
            'x-api-auth': 'laZOmogezono5ogekaso5oz4Mezimew1',
            'x-api-app-info': 'tv-android/10/2.41.5-700',
            'accept-language': 'en',
            'x-user-email': 'hnysk359@gmail.com',
            'x-user-token': 'jPv_jcgme9Apc5iHnEZP',
            'x-visitor-id': 'fbf69847-043b-42ef-b2a1-7f78fed92232',
            'content-type': 'application/vnd.api+json'
        };
        https.get(opts, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

function curlget2(urlx) {
    return new Promise((resolve, reject) => {
        const opts = url.parse(urlx);
        opts.headers = {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
        };
        https.get(opts, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

function curlpostcdrm(pssh, lic) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify({
            "PSSH": pssh,
            "License URL": "https://license.vidio.com/ri/licenseManager.do",
            "Headers": "{\"pallycon-customdata-v2\":\"" + lic + "\",\"sec-ch-ua\":\"\\\"Not)A;Brand\\\";v=\\\"99\\\", \\\"Brave\\\";v=\\\"127\\\", \\\"Chromium\\\";v=\\\"127\\\"\",\"sec-ch-ua-mobile\":\"?0\",\"User-Agent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36\",\"sec-ch-ua-platform\":\"\\\"Windows\\\"\",\"Accept\":\"*/*\",\"Sec-GPC\":\"1\",\"Sec-Fetch-Site\":\"same-site\",\"Sec-Fetch-Mode\":\"cors\",\"Sec-Fetch-Dest\":\"empty\"}",
            "JSON": "CAQ=",
            "Scheme": "CommonWV",
            "Proxy": ""
        });

        const opts = url.parse('https://fellow-gill-tandatakon-753e88dc.koyeb.app/extension');
        opts.method = 'POST';
        opts.headers = {
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.9,ko;q=0.8,id;q=0.7',
            'Connection': 'keep-alive',
            'Content-Type': 'application/json',
            'Origin': 'chrome-extension://kgdjdofgpjfoegjmalkpmgccjfpmfcog',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'none',
            'Sec-GPC': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
            'sec-ch-ua': '"Not)A;Brand";v="99", "Brave";v="127", "Chromium";v="127"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"'
        };

        const req = https.request(opts, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        });

        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

(async () => {
    const data = await curlget(`https://api.vidio.com/livestreamings/${id}/stream?initialize=true`);
    const json = JSON.parse(data);
    let mpd = json.data.attributes.dash;
    mpd = mpd.replace(/geo-id-(tl-)?(gg-)?/, '');
    const m3u8 = antara(data, '"drm_stream_hls_url":"', '"');
    const lic = antara(data, '"widevine":"', '"');
    const wv = 'https://license.vidio.com/ri/licenseManager.do?pallycon-customdata-v2=' + lic;
    console.log("\n======================\n" + mpd);

    const data2 = await curlget2(mpd);
    const belah = data2.split('<cenc:pssh>');
    const pssh = 'AAA' + antara(belah[2], 'AAA', '</cenc:pssh>');
    console.log("\n======================\n" + pssh);
    console.log("\n======================\n" + wv);

    const datacdrm = await curlpostcdrm(pssh, lic);
    const jsoncdrm = JSON.parse(datacdrm);
    const ax = jsoncdrm["Message"];
    const barisx = ax.split("\n");

    let end = "{";
    let uns = "";
    for (let a = 0; a < barisx.length - 1; a++) {
        const belah = barisx[a].split(":");
        const keyid = belah[0];
        const key = belah[1];
        end += `"${keyid}":"${key}"`;
        uns += `${keyid}:${key}`;
        if (a !== barisx.length - 2) {
            end += ", ";
            uns += "|";
        }
    }
    end += "}";
    const b642 = Buffer.from(end).toString('base64');
    console.log(`<p>DARI CDRM-PROJECT:<br><a href='${mpd}&ck=${b642}' target=_blank>${mpd}&ck=${b642}</a><br>`);
    console.log(`<a href='https://popmi.my.id/tes.mpd?id=${id}&ck=${b642}' target=_blank>popmi</a><br>`);
    console.log(`<a href='${mpd}%7CdrmScheme=clearkey&drmLicense=${uns}'>link untuk NS Player</a><br>`);
    console.log(uns);
})();
