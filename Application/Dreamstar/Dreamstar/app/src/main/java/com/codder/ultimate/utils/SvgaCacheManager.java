package com.codder.ultimate.utils;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;

import com.opensource.svgaplayer.SVGADrawable;
import com.opensource.svgaplayer.SVGAImageView;
import com.opensource.svgaplayer.SVGAParser;
import com.opensource.svgaplayer.SVGAVideoEntity;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class SvgaCacheManager {

    private static final String TAG = "SvgaCacheManager";
    private static final ExecutorService executor = Executors.newCachedThreadPool();
    private static SVGAParser sharedParser;

    public static synchronized SVGAParser getParser(Context context) {
        if (sharedParser == null && context != null) {
            sharedParser = new SVGAParser(context.getApplicationContext());
        }
        return sharedParser != null ? sharedParser : new SVGAParser(context);
    }

    public static File getSvgaCacheDir(Context context) {
        File svgaCacheDir = new File(context.getCacheDir(), "svga_cache");
        if (!svgaCacheDir.exists()) {
            boolean created = svgaCacheDir.mkdirs();
            if (!created) {
                Log.w(TAG, "Failed to create svga_cache directory.");
            }
        }
        return svgaCacheDir;
    }

    /**
     * Downloads and caches the SVGA file asynchronously.
     * Will always run in background thread automatically.
     */
    public static void downloadAndCacheSvga(String url, Context context) {
        if (url == null || url.isEmpty() || context == null) return;
        executor.execute(() -> {
            File svgaCacheDir = getSvgaCacheDir(context);
            File cachedFile = new File(svgaCacheDir, String.valueOf(url.hashCode()));

            if (cachedFile.exists() && cachedFile.length() > 100) {
                return;
            }

            InputStream inputStream = null;
            FileOutputStream outputStream = null;
            try {
                URL urlObj = new URL(url);
                URLConnection urlConnection = urlObj.openConnection();
                if (urlConnection instanceof HttpURLConnection) {
                    HttpURLConnection httpConn = (HttpURLConnection) urlConnection;
                    httpConn.setConnectTimeout(10000);
                    httpConn.setReadTimeout(15000);
                    httpConn.connect();
                    if (httpConn.getResponseCode() != HttpURLConnection.HTTP_OK) {
                        if (cachedFile.exists()) cachedFile.delete();
                        return;
                    }
                    inputStream = httpConn.getInputStream();
                } else {
                    urlConnection.connect();
                    inputStream = urlConnection.getInputStream();
                }

                outputStream = new FileOutputStream(cachedFile);

                byte[] buffer = new byte[8192];
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                }
                outputStream.flush();

            } catch (Exception e) {
                Log.e("svga", "❌ SVGA download failed from: " + url + " | Reason: " + e.getMessage(), e);
                if (cachedFile.exists()) {
                    cachedFile.delete();
                }
            } finally {
                try {
                    if (inputStream != null) inputStream.close();
                    if (outputStream != null) outputStream.close();
                } catch (Exception ignore) {
                }
            }
        });
    }

    public static void decodeSvgaFromCache(
            @NonNull Context context,
            @NonNull String url,
            @NonNull SVGAParser.ParseCompletion parseCompletion
    ) {
        clearSvgaAudioCache(context);
        File cachedFile = new File(getSvgaCacheDir(context), String.valueOf(url.hashCode()));

        if (!cachedFile.exists() || cachedFile.length() < 100) {
            Log.w(TAG, "No valid cache file found for: " + url);
            if (cachedFile.exists()) {
                cachedFile.delete();
            }
            parseCompletion.onError();
            return;
        }

        try {
            SVGAParser parser = getParser(context);

            parser.decodeFromInputStream(
                    new BufferedInputStream(new FileInputStream(cachedFile)),
                    url,
                    new SVGAParser.ParseCompletion() {
                        @Override
                        public void onComplete(@NonNull SVGAVideoEntity svgaVideoEntity) {
                            parseCompletion.onComplete(svgaVideoEntity);
                        }

                        @Override
                        public void onError() {
                            if (cachedFile.exists()) {
                                cachedFile.delete();
                            }
                            parseCompletion.onError();
                        }
                    },
                    true,
                    null,
                    null
            );
        } catch (Throwable t) {
            Log.e(TAG, "Failed to decode from cache: " + t.getMessage(), t);
            if (cachedFile.exists()) {
                cachedFile.delete();
            }
            parseCompletion.onError();
        }
    }

    /**
     * Completely cleans an SVGAImageView by stopping animation, clearing its SVGAVideoEntity,
     * releasing its bitmaps from native and JVM heap, and clearing the view.
     */
    public static void cleanSvgaImageView(SVGAImageView imageView) {
        if (imageView == null) return;
        try {
            imageView.stopAnimation(true);
        } catch (Exception ignored) {
            try {
                imageView.stopAnimation();
            } catch (Exception ignored2) {}
        }
        try {
            if (imageView.getDrawable() instanceof SVGADrawable) {
                SVGADrawable drawable = (SVGADrawable) imageView.getDrawable();
                if (drawable.getVideoItem() != null) {
                    drawable.getVideoItem().clear();
                }
                drawable.clear();
            }
        } catch (Exception ignored) {}
        try {
            imageView.setImageDrawable(null);
            imageView.clear();
        } catch (Exception ignored) {}
    }

    /**
     * Clears temporary audio files (.mp3, .wav, etc.) extracted by SVGAPlayer in cache directory.
     * This prevents SVGAPlayer from reusing the same generic sound file (e.g. audio_0.mp3)
     * across different SVGA files.
     */
    public static void clearSvgaAudioCache(Context context) {
        if (context == null) return;
        try {
            deleteAudioFilesFromDir(context.getCacheDir());
            if (context.getExternalCacheDir() != null) {
                deleteAudioFilesFromDir(context.getExternalCacheDir());
            }
        } catch (Exception e) {
            Log.e(TAG, "Error clearing SVGA audio cache", e);
        }
    }

    private static void deleteAudioFilesFromDir(File dir) {
        if (dir == null || !dir.exists()) return;
        File[] files = dir.listFiles();
        if (files == null) return;
        for (File file : files) {
            if (file.isDirectory()) {
                String dirName = file.getName().toLowerCase();
                if (dirName.equals("svga") || dirName.equals("sound") || dirName.equals("audio")) {
                    deleteAudioFilesFromDir(file);
                }
            } else if (file.isFile()) {
                String name = file.getName().toLowerCase();
                if (name.endsWith(".mp3") || name.endsWith(".wav") || name.endsWith(".aac") || name.endsWith(".m4a") || name.endsWith(".ogg") || name.startsWith("svga_audio") || name.startsWith("audio_")) {
                    file.delete();
                }
            }
        }
    }
}