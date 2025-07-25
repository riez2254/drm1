export default {
  async fetch(request, env, ctx) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return new Response("Missing id", { status: 400 });

    const headers = {
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

    const curlget = async (url) => {
      const res = await fetch(url, { headers });
      return res.text();
    };

    const antara = (str, start, end) => {
      const i = str.indexOf(start);
      if (i === -1) return "";
      const j = str.indexOf(end, i + start.length);
      return j === -1 ? "" : str.substring(i + start.length, j);
    };

    const curlget2 = async (url) => {
      const res = await fetch(url, {
        headers: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36'
        }
      });
      return res.text();
    };

    const curlpostcdrm = async (url, pssh, lic) => {
      const payload = JSON.stringify({
        PSSH: pssh,
        "License URL": "https://license.vidio.com/ri/licenseManager.do",
        Headers: JSON.stringify({
          "pallycon-customdata-v2": lic,
          "sec-ch-ua": '"Not)A;Brand";v="99", "Brave";v="127", "Chromium";v="127"',
          "sec-ch-ua-mobile": "?0",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
          "sec-ch-ua-platform": '"Windows"',
          Accept: "*/*",
          "Sec-GPC": "1",
          "Sec-Fetch-Site": "same-site",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Dest": "empty"
        }),
        JSON: "CAQ=",
        Scheme: "CommonWV",
        Proxy: ""
      });

      const res = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'chrome-extension://kgdjdofgpjfoegjmalkpmgccjfpmfcog',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
        },
        body: payload
      });

      return res.text();
    };

    const res1 = await curlget(`https://api.vidio.com/livestreamings/${id}/stream?initialize=true`);
    const json = JSON.parse(res1);
    let mpd = json.data.attributes.dash;
    mpd = mpd.replace(/geo-id-(tl-gg-|gg-|tl-|)/g, "");
    const m3u8 = antara(res1, '"drm_stream_hls_url":"', '"');
    const lic = antara(res1, '"widevine":"', '"');
    const wv = `https://license.vidio.com/ri/licenseManager.do?pallycon-customdata-v2=${lic}`;

    const res2 = await curlget2(mpd);
    const pssh = 'AAA' + antara(res2.split('<cenc:pssh>')[2] || '', 'AAA', '</cenc:pssh>');

    const res3 = await curlpostcdrm("https://fellow-gill-tandatakon-753e88dc.koyeb.app/extension", pssh, lic);
    const parsed = JSON.parse(res3);
    const lines = (parsed.Message || '').split("\n");
    const list = lines.map(x => x.split(":")).filter(x => x.length === 2);

    const obj = Object.fromEntries(list);
    const uns = list.map(x => `${x[0]}:${x[1]}`).join("|");
    const b64 = btoa(JSON.stringify(obj));

    const out = `
======================
${mpd}
======================
${pssh}
======================
${wv}
======================
DARI CDRM-PROJECT:
<a href='${mpd}&ck=${b64}' target=_blank>${mpd}&ck=${b64}</a><br>
<a href='https://popmi.my.id/tes.mpd?id=${id}&ck=${b64}' target=_blank>popmi</a><br>
<a href='${mpd}%7CdrmScheme=clearkey&drmLicense=${uns}'>link untuk NS Player</a><br>
${uns}`;

    return new Response(out, {
      headers: { 'content-type': 'text/html; charset=utf-8' }
    });
  }
};
        
