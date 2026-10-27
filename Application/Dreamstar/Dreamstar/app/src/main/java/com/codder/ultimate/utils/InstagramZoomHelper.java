package com.codder.ultimate.utils;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.ObjectAnimator;
import android.animation.PropertyValuesHolder;
import android.app.Activity;
import android.content.Context;
import android.content.ContextWrapper;
import android.graphics.Color;
import android.graphics.Rect;
import android.view.GestureDetector;
import android.view.MotionEvent;
import android.view.ScaleGestureDetector;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;

public class InstagramZoomHelper implements View.OnTouchListener {

    private static final String TAG = "InstagramZoomHelper";

    private final Activity activity;
    private final ImageView originalImageView;
    private final GestureDetector gestureDetector;
    private final ScaleGestureDetector scaleGestureDetector;

    private ImageView copyImageView;
    private FrameLayout overlayView;

    private float scaleFactor = 1.0f;
    private float focusX = 0f;
    private float focusY = 0f;
    private float translationX = 0f;
    private float translationY = 0f;

    private boolean isZooming = false;
    private final Rect originalRect = new Rect();

    public InstagramZoomHelper(Activity activity, ImageView originalImageView, GestureDetector gestureDetector) {
        this.activity = activity;
        this.originalImageView = originalImageView;
        this.gestureDetector = gestureDetector;
        this.scaleGestureDetector = new ScaleGestureDetector(activity, new ScaleListener());
    }

    public static Activity getActivity(Context context) {
        while (context instanceof ContextWrapper) {
            if (context instanceof Activity) {
                return (Activity) context;
            }
            context = ((ContextWrapper) context).getBaseContext();
        }
        if (context instanceof Activity) {
            return (Activity) context;
        }
        return null;
    }

    public static void attach(Context context, ImageView imageView, GestureDetector gestureDetector) {
        Activity activity = getActivity(context);
        if (activity != null) {
            InstagramZoomHelper helper = new InstagramZoomHelper(activity, imageView, gestureDetector);
            imageView.setOnTouchListener(helper);
        }
    }

    private class ScaleListener extends ScaleGestureDetector.SimpleOnScaleGestureListener {
        @Override
        public boolean onScale(ScaleGestureDetector detector) {
            scaleFactor *= detector.getScaleFactor();
            scaleFactor = Math.max(1.0f, Math.min(scaleFactor, 5.0f));

            if (copyImageView != null) {
                copyImageView.setScaleX(scaleFactor);
                copyImageView.setScaleY(scaleFactor);

                // Calculate focus shift translation
                float currentFocusX = detector.getFocusX();
                float currentFocusY = detector.getFocusY();

                translationX += currentFocusX - focusX;
                translationY += currentFocusY - focusY;

                copyImageView.setTranslationX(translationX);
                copyImageView.setTranslationY(translationY);

                focusX = currentFocusX;
                focusY = currentFocusY;

                // Dim background dynamically based on zoom scale
                updateDimBackground();
            }
            return true;
        }

        @Override
        public boolean onScaleBegin(ScaleGestureDetector detector) {
            focusX = detector.getFocusX();
            focusY = detector.getFocusY();
            return true;
        }
    }

    private void updateDimBackground() {
        if (overlayView != null) {
            float maxScale = 4.0f;
            float progress = (scaleFactor - 1.0f) / (maxScale - 1.0f);
            progress = Math.max(0f, Math.min(progress, 1.0f));
            int alpha = (int) (progress * 180); // max alpha 180 of 255
            overlayView.setBackgroundColor(Color.argb(alpha, 0, 0, 0));
        }
    }

    @Override
    public boolean onTouch(View v, MotionEvent event) {
        if (gestureDetector != null) {
            gestureDetector.onTouchEvent(event);
        }

        scaleGestureDetector.onTouchEvent(event);

        int action = event.getActionMasked();

        if (action == MotionEvent.ACTION_POINTER_DOWN) {
            if (event.getPointerCount() >= 2 && !isZooming) {
                startZoom();
            }
        } else if (action == MotionEvent.ACTION_UP || action == MotionEvent.ACTION_CANCEL || action == MotionEvent.ACTION_POINTER_UP) {
            if (isZooming) {
                if (action == MotionEvent.ACTION_UP || action == MotionEvent.ACTION_CANCEL || (action == MotionEvent.ACTION_POINTER_UP && event.getPointerCount() <= 2)) {
                    endZoom();
                }
            }
        }

        return isZooming;
    }

    private void startZoom() {
        if (originalImageView.getDrawable() == null) {
            return;
        }

        isZooming = true;
        originalImageView.setVisibility(View.INVISIBLE);

        // Get coordinates on screen
        int[] location = new int[2];
        originalImageView.getLocationInWindow(location);
        originalRect.set(location[0], location[1], location[0] + originalImageView.getWidth(), location[1] + originalImageView.getHeight());

        // Create full screen overlay FrameLayout
        ViewGroup decorView = (ViewGroup) activity.getWindow().getDecorView();
        overlayView = new FrameLayout(activity);
        overlayView.setLayoutParams(new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));
        overlayView.setBackgroundColor(Color.argb(0, 0, 0, 0)); // transparent start

        // Create ImageView copy
        copyImageView = new ImageView(activity);
        copyImageView.setImageDrawable(originalImageView.getDrawable());
        copyImageView.setScaleType(originalImageView.getScaleType());

        FrameLayout.LayoutParams layoutParams = new FrameLayout.LayoutParams(
                originalImageView.getWidth(),
                originalImageView.getHeight()
        );
        layoutParams.leftMargin = originalRect.left;
        layoutParams.topMargin = originalRect.top;
        copyImageView.setLayoutParams(layoutParams);

        overlayView.addView(copyImageView);
        decorView.addView(overlayView);

        // Prevent parents from intercepting touch gestures
        if (originalImageView.getParent() != null) {
            originalImageView.getParent().requestDisallowInterceptTouchEvent(true);
        }
    }

    private void endZoom() {
        isZooming = false;

        if (copyImageView != null) {
            // Animate copyImageView back to its original state (scale 1.0f, translation 0f)
            PropertyValuesHolder pvhScaleX = PropertyValuesHolder.ofFloat(View.SCALE_X, 1.0f);
            PropertyValuesHolder pvhScaleY = PropertyValuesHolder.ofFloat(View.SCALE_Y, 1.0f);
            PropertyValuesHolder pvhTranslationX = PropertyValuesHolder.ofFloat(View.TRANSLATION_X, 0f);
            PropertyValuesHolder pvhTranslationY = PropertyValuesHolder.ofFloat(View.TRANSLATION_Y, 0f);

            ObjectAnimator animator = ObjectAnimator.ofPropertyValuesHolder(
                    copyImageView,
                    pvhScaleX,
                    pvhScaleY,
                    pvhTranslationX,
                    pvhTranslationY
            );
            animator.setDuration(250);
            animator.addListener(new AnimatorListenerAdapter() {
                @Override
                public void onAnimationEnd(Animator animation) {
                    cleanup();
                }
            });
            animator.start();
        } else {
            cleanup();
        }
    }

    private void cleanup() {
        if (overlayView != null) {
            ViewGroup decorView = (ViewGroup) activity.getWindow().getDecorView();
            decorView.removeView(overlayView);
            overlayView = null;
        }
        copyImageView = null;
        originalImageView.setVisibility(View.VISIBLE);
        if (originalImageView.getParent() != null) {
            originalImageView.getParent().requestDisallowInterceptTouchEvent(false);
        }
        scaleFactor = 1.0f;
        translationX = 0f;
        translationY = 0f;
    }
}
