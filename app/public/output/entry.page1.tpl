<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/static/css/normalize.css">
    <link rel="icon" type="image/x-icon" href="/static/icon.png">
    <title>{{name}}？？</title>
    <style>
        body { padding: 24px; font-family: system-ui, sans-serif; }
        section { margin-bottom: 28px; }
        button { padding: 8px 16px; font-size: 14px; cursor: pointer; }
        .result-box {
            margin-top: 16px;
            padding: 12px;
            min-height: 40px;
            background: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 4px;
            white-space: pre-wrap;
            word-break: break-all;
        }
    </style>
</head>
<body>
    <h1>page1 test {{env}} {{options}}</h1>

    <section>
        <button id="btn-body-parser" type="button">测试 bodyParser</button>
        <pre id="body-parser-result" class="result-box">点击按钮发送 POST 请求，验证请求体是否被解析</pre>
    </section>

    <section>
        <button id="btn-params-verify" type="button">测试 api-params-verify</button>
        <pre id="params-verify-result" class="result-box">点击按钮依次发送「合法参数」和「非法参数」，验证 JSON Schema 校验是否生效</pre>
    </section>

    <script>
        (function () {
            var btn = document.getElementById('btn-body-parser');
            var resultEl = document.getElementById('body-parser-result');

            btn.addEventListener('click', async function () {
                var payload = {
                    name: 'elpis',
                    from: 'page1',
                    tags: ['koa', 'bodyparser'],
                    nested: { ok: true },
                    ts: Date.now()
                };

                resultEl.textContent = '请求中...';

                try {
                    var res = await fetch('/api/body-parser', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    var data = await res.json();

                    resultEl.textContent = 'HTTP ' + res.status + '\n' + JSON.stringify(data, null, 2);
                } catch (err) {
                    resultEl.textContent = '请求失败：' + err.message;
                }
            });
        })();

        (function () {
            var btn = document.getElementById('btn-params-verify');
            var resultEl = document.getElementById('params-verify-result');

            // schema 见 app/router-schema/demo.js
            var cases = [
                { label: '合法参数', payload: { name: 'elpis', age: 18 } },
                { label: '非法参数（name 只有 1 个字符、age 为负数）', payload: { name: 'e', age: -1 } },
                { label: '非法参数（缺少 age 字段）', payload: { name: 'elpis' } }
            ];

            btn.addEventListener('click', async function () {
                resultEl.textContent = '请求中...';

                var lines = [];
                for (var i = 0; i < cases.length; i++) {
                    var item = cases[i];

                    try {
                        var res = await fetch('/api/params-verify-demo', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(item.payload)
                        });
                        var data = await res.json();

                        lines.push(
                            '【' + item.label + '】HTTP ' + res.status + '\n' +
                            '请求体：' + JSON.stringify(item.payload) + '\n' +
                            '响应：' + JSON.stringify(data, null, 2)
                        );
                    } catch (err) {
                        lines.push('【' + item.label + '】请求失败：' + err.message);
                    }
                }

                resultEl.textContent = lines.join('\n\n');
            });
        })();
    </script>
</body>

<script src="https://cdn.jsdelivr.net/npm/js-md5@0.8.3/src/md5.min.js"></script>
</html>
