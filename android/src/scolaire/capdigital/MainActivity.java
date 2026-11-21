package scolaire.capdigital;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Base64;
import android.graphics.Color;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.Toast;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;

public class MainActivity extends Activity {
    private static final String HOST = "appassets.androidplatform.net";
    private static final int CHOOSE_FILE = 1;
    private static final int SAVE_PDF = 2;
    private ValueCallback<Uri[]> fileCallback;
    private byte[] pendingPdf;
    private WebView web;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        FrameLayout container = new FrameLayout(this);
        container.setBackgroundColor(Color.rgb(17, 31, 60));
        if (android.os.Build.VERSION.SDK_INT >= 30) {
            container.setOnApplyWindowInsetsListener((view, insets) -> {
                android.graphics.Insets bars = insets.getInsets(android.view.WindowInsets.Type.systemBars()
                    | android.view.WindowInsets.Type.displayCutout() | android.view.WindowInsets.Type.ime());
                view.setPadding(bars.left, bars.top, bars.right, bars.bottom);
                return insets;
            });
        }
        setContentView(container);
        web = new WebView(this);
        container.addView(web, new FrameLayout.LayoutParams(-1, -1));
        web.getSettings().setJavaScriptEnabled(true);
        web.getSettings().setDomStorageEnabled(true);
        web.getSettings().setAllowFileAccess(false);
        web.getSettings().setAllowContentAccess(false);
        web.getSettings().setBlockNetworkLoads(true);
        web.addJavascriptInterface(new PdfBridge(), "CapAndroid");
        web.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return !isLocal(request.getUrl());
            }
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return isLocal(request.getUrl()) ? openAsset(request) : null;
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (fileCallback != null) fileCallback.onReceiveValue(null);
                fileCallback = callback;
                try {
                    startActivityForResult(params.createIntent(), CHOOSE_FILE);
                } catch (android.content.ActivityNotFoundException error) {
                    fileCallback = null;
                    callback.onReceiveValue(null);
                }
                return true;
            }
        });
        web.loadUrl("https://" + HOST + "/");
    }

    @Override public void onBackPressed() {
        web.evaluateJavascript("window.capMobileBack ? window.capMobileBack() : false", handled -> {
            if (!"true".equals(handled)) super.onBackPressed();
        });
    }

    private static boolean isLocal(Uri uri) {
        return "https".equals(uri.getScheme()) && HOST.equals(uri.getHost());
    }

    private WebResourceResponse openAsset(WebResourceRequest request) {
        String path = request.getUrl().getPath();
        if (path == null || path.equals("/")) path = "/index.html";
        if (path.contains("..")) return missing();
        try {
            InputStream stream = getAssets().open("web" + path);
            String mime = mimeType(path);
            if ("video/mp4".equals(mime)) return videoResponse(stream, request.getRequestHeaders().get("Range"));
            String charset = mime.startsWith("text/") ? "UTF-8" : null;
            return new WebResourceResponse(mime, charset, stream);
        } catch (IOException error) {
            return missing();
        }
    }

    private static WebResourceResponse videoResponse(InputStream stream, String range) throws IOException {
        byte[] video;
        try (InputStream input = stream; java.io.ByteArrayOutputStream bytes = new java.io.ByteArrayOutputStream()) {
            byte[] buffer = new byte[8192];
            int count;
            while ((count = input.read(buffer)) != -1) bytes.write(buffer, 0, count);
            video = bytes.toByteArray();
        }
        Map<String,String> headers = new HashMap<>();
        headers.put("Accept-Ranges", "bytes");
        if (range != null && range.matches("bytes=[0-9]+-[0-9]*")) {
            String[] limits = range.substring(6).split("-", -1);
            try {
                int start = Integer.parseInt(limits[0]);
                int end = limits[1].isEmpty() ? video.length - 1 : Math.min(Integer.parseInt(limits[1]), video.length - 1);
                if (start <= end) {
                    int length = end - start + 1;
                    headers.put("Content-Range", "bytes " + start + "-" + end + "/" + video.length);
                    headers.put("Content-Length", Integer.toString(length));
                    return new WebResourceResponse("video/mp4", null, 206, "Partial Content", headers,
                        new ByteArrayInputStream(video, start, length));
                }
            } catch (NumberFormatException ignored) {
                // Serve the entire file when the range cannot be represented.
            }
        }
        headers.put("Content-Length", Integer.toString(video.length));
        return new WebResourceResponse("video/mp4", null, 200, "OK", headers, new ByteArrayInputStream(video));
    }

    private static WebResourceResponse missing() {
        return new WebResourceResponse("text/plain", "UTF-8", 404, "Not Found",
            new HashMap<>(), new ByteArrayInputStream(new byte[0]));
    }

    private static String mimeType(String path) {
        if (path.endsWith(".html")) return "text/html";
        if (path.endsWith(".js")) return "text/javascript";
        if (path.endsWith(".css")) return "text/css";
        if (path.endsWith(".webp")) return "image/webp";
        if (path.endsWith(".mp4")) return "video/mp4";
        return "application/octet-stream";
    }

    public final class PdfBridge {
        @JavascriptInterface public void savePdf(String filename, String encoded) {
            if (encoded == null || encoded.length() > 2_700_000) return;
            byte[] payload;
            try {
                payload = Base64.decode(encoded, Base64.DEFAULT);
            } catch (IllegalArgumentException error) {
                return;
            }
            runOnUiThread(() -> {
                if (pendingPdf != null) return;
                Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("application/pdf");
                intent.putExtra(Intent.EXTRA_TITLE, filename);
                try {
                    pendingPdf = payload;
                    startActivityForResult(intent, SAVE_PDF);
                } catch (android.content.ActivityNotFoundException error) {
                    pendingPdf = null;
                    showSaveError();
                }
            });
        }
    }

    @Override protected void onActivityResult(int request, int result, Intent data) {
        super.onActivityResult(request, result, data);
        if (request == CHOOSE_FILE && fileCallback != null) {
            fileCallback.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(result, data));
            fileCallback = null;
        }
        if (request == SAVE_PDF && pendingPdf != null) {
            byte[] payload = pendingPdf;
            pendingPdf = null;
            if (result != RESULT_OK || data == null || data.getData() == null) return;
            try (OutputStream output = getContentResolver().openOutputStream(data.getData())) {
                if (output == null) throw new IOException();
                output.write(payload);
            } catch (IOException | SecurityException error) {
                showSaveError();
            }
        }
    }

    private void showSaveError() {
        Toast.makeText(this, "Impossible d’enregistrer le PDF.", Toast.LENGTH_LONG).show();
    }
}
