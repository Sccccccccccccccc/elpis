<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/static/css/normalize.css">
    <link rel="icon" type="image/x-icon" href="/static/icon.png">
    <title>{{name}}？</title>
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
    <div id="app"></div>
</body>

<script src="https://cdn.jsdelivr.net/npm/js-md5@0.8.3/src/md5.min.js"></script>
</html>
