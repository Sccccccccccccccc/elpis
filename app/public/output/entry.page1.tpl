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
        button { padding: 8px 16px; font-size: 14px; cursor: pointer; }
        #body-parser-result {
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
        <pre id="body-parser-result">点击按钮发送 POST 请求，验证请求体是否被解析</pre>
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
    </script>
</body>
</html>
