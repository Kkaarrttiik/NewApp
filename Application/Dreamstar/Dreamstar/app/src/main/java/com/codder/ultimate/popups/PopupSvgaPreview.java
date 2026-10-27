package com.codder.ultimate.popups;

import android.app.Dialog;
import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;

import androidx.annotation.NonNull;
import androidx.databinding.DataBindingUtil;

import com.bumptech.glide.Glide;
import com.codder.ultimate.BuildConfig;
import com.codder.ultimate.R;
import com.codder.ultimate.SessionManager;
import com.codder.ultimate.databinding.PopupSvgaPreviewBinding;
import com.codder.ultimate.utils.SvgaCacheManager;
import com.opensource.svgaplayer.SVGADrawable;
import com.opensource.svgaplayer.SVGADynamicEntity;
import com.opensource.svgaplayer.SVGAImageView;
import com.opensource.svgaplayer.SVGAParser;
import com.opensource.svgaplayer.SVGAVideoEntity;

import java.net.URL;

public class PopupSvgaPreview {
    private static final String TAG = "PopupSvgaPreview";
    private static PopupSvgaPreview currentInstance;

    private final Context context;
    private final SessionManager sessionManager;
    private final Dialog dialog;
    private final Handler handler = new Handler(Looper.getMainLooper());
    private final Runnable autoDismissRunnable;
    private boolean isDismissed = false;
    private SVGAVideoEntity currentVideoEntity;
    private SVGAImageView imageView;

    public PopupSvgaPreview(Context context, String svgaImage, String avatarFrame, String userImage) {
        if (context == null) {
            Log.e(TAG, "Context is null.");
            this.context = null;
            sessionManager = null;
            dialog = null;
            autoDismissRunnable = null;
            return;
        }

        this.context = context;

        // Dismiss and cleanup any existing dialog and sound before opening a new one
        if (currentInstance != null) {
            currentInstance.cleanupAndDismiss();
            currentInstance = null;
        }
        currentInstance = this;

        SvgaCacheManager.clearSvgaAudioCache(context);

        sessionManager = new SessionManager(context);
        dialog = new Dialog(context, android.R.style.Theme_Translucent_NoTitleBar_Fullscreen);

        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        if (inflater == null) {
            Log.e(TAG, "Failed to get LayoutInflater.");
            autoDismissRunnable = null;
            return;
        }

        PopupSvgaPreviewBinding binding = DataBindingUtil.inflate(inflater, R.layout.popup_svga_preview, null, false);
        if (binding == null) {
            Log.e(TAG, "Failed to bind layout.");
            autoDismissRunnable = null;
            return;
        }

        dialog.setCancelable(true);
        dialog.setCanceledOnTouchOutside(true);
        dialog.setContentView(binding.getRoot());

        imageView = binding.svgImage;
        if (imageView == null) {
            Log.e(TAG, "SVG ImageView is null.");
            autoDismissRunnable = null;
            return;
        }

        autoDismissRunnable = this::cleanupAndDismiss;

        dialog.setOnDismissListener(dialogInterface -> {
            cleanup();
            if (currentInstance == this) {
                currentInstance = null;
            }
        });

        loadSvgaAnimation(context, svgaImage, imageView, binding);

        binding.userName.setText(sessionManager.getUser() != null ? sessionManager.getUser().getName() : context.getString(R.string.unknown_user));
        loadImages(context, userImage, avatarFrame, binding);

        setupAnimations(context, binding);

        dialog.show();
    }

    private void cleanup() {
        isDismissed = true;
        handler.removeCallbacksAndMessages(null);

        if (imageView != null) {
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

        if (currentVideoEntity != null) {
            try {
                currentVideoEntity.clear();
            } catch (Exception ignored) {}
            currentVideoEntity = null;
        }

        if (context != null) {
            SvgaCacheManager.clearSvgaAudioCache(context);
        }
    }

    private void cleanupAndDismiss() {
        cleanup();
        try {
            if (dialog != null && dialog.isShowing()) {
                dialog.dismiss();
            }
        } catch (Exception ignored) {}
    }

    private void loadSvgaAnimation(Context context, String svgaImage, SVGAImageView imageView, PopupSvgaPreviewBinding binding) {
        if (isDismissed || svgaImage == null || svgaImage.trim().isEmpty()) {
            return;
        }

        SvgaCacheManager.clearSvgaAudioCache(context);

        String fullUrl = (svgaImage.startsWith("http://") || svgaImage.startsWith("https://"))
                ? svgaImage
                : (BuildConfig.BASE_URL + svgaImage);

        // Try decoding from cache first via SvgaCacheManager, or fallback to URL
        SvgaCacheManager.decodeSvgaFromCache(context, fullUrl, new SVGAParser.ParseCompletion() {
            @Override
            public void onComplete(@NonNull SVGAVideoEntity svgaVideoEntity) {
                playSvga(context, svgaVideoEntity, svgaImage, imageView);
            }

            @Override
            public void onError() {
                if (isDismissed) return;
                try {
                    SvgaCacheManager.clearSvgaAudioCache(context);
                    SVGAParser parser = new SVGAParser(context);
                    URL url = new URL(fullUrl);
                    parser.decodeFromURL(url, new SVGAParser.ParseCompletion() {
                        @Override
                        public void onComplete(@NonNull SVGAVideoEntity svgaVideoEntity) {
                            playSvga(context, svgaVideoEntity, svgaImage, imageView);
                        }

                        @Override
                        public void onError() {
                            Log.e(TAG, "Error loading SVGA animation from URL: " + fullUrl);
                        }
                    }, null);
                } catch (Exception e) {
                    Log.e(TAG, "Error decoding SVGA from URL", e);
                }
            }
        });
    }

    private void playSvga(Context context, @NonNull SVGAVideoEntity svgaVideoEntity, String svgaImage, SVGAImageView imageView) {
        if (isDismissed || dialog == null || !dialog.isShowing()) {
            try {
                svgaVideoEntity.clear();
            } catch (Exception ignored) {}
            return;
        }

        handler.post(() -> {
            if (isDismissed || dialog == null || !dialog.isShowing()) {
                try {
                    svgaVideoEntity.clear();
                } catch (Exception ignored) {}
                return;
            }

            // Cleanup previous video entity before setting new one
            if (currentVideoEntity != null && currentVideoEntity != svgaVideoEntity) {
                try {
                    currentVideoEntity.clear();
                } catch (Exception ignored) {}
            }
            currentVideoEntity = svgaVideoEntity;

            SVGADynamicEntity dynamicEntity = new SVGADynamicEntity();
            String fullUrl = (svgaImage.startsWith("http://") || svgaImage.startsWith("https://"))
                    ? svgaImage
                    : (BuildConfig.BASE_URL + svgaImage);
            dynamicEntity.setDynamicImage(fullUrl, "99");

            SVGADrawable drawable = new SVGADrawable(svgaVideoEntity, dynamicEntity);
            imageView.setImageDrawable(drawable);
            imageView.startAnimation();

            long frames = svgaVideoEntity.getFrames();
            int fps = svgaVideoEntity.getFPS();
            long duration = fps > 0 ? (frames * 1000L / fps) : 3000L;

            handler.removeCallbacks(autoDismissRunnable);
            handler.postDelayed(autoDismissRunnable, duration);
        });
    }

    private void loadImages(Context context, String userImage, String avatarFrame, PopupSvgaPreviewBinding binding) {
        try {
            if (context != null) {
                Glide.with(context).load(userImage)
                        .circleCrop()
                        .into(binding.userImage);
                Glide.with(context).load(BuildConfig.BASE_URL + avatarFrame)
                        .into(binding.avatarFrameImage);
            }
        } catch (Exception e) {
            Log.e(TAG, "Error loading images into the views.", e);
        }
    }

    private void setupAnimations(Context context, PopupSvgaPreviewBinding binding) {
        if (context != null && binding != null) {
            Animation animation = AnimationUtils.loadAnimation(context, R.anim.slide_in_right);
            if (animation != null) {
                animation.setFillAfter(true);
                binding.nameLyt.startAnimation(animation);
            }
            binding.btnClose.setOnClickListener(v -> cleanupAndDismiss());
        } else {
            Log.e(TAG, "Context or binding is null during animation setup.");
        }
    }
}
