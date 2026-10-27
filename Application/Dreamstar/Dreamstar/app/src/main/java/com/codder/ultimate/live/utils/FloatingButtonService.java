package com.codder.ultimate.live.utils;

import android.annotation.SuppressLint;
import android.app.ActivityManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.view.animation.Animation;
import android.view.animation.LinearInterpolator;
import android.view.animation.RotateAnimation;
import android.widget.ImageView;


import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.DefaultLifecycleObserver;
import androidx.lifecycle.Lifecycle;
import androidx.lifecycle.LifecycleOwner;
import androidx.lifecycle.ProcessLifecycleOwner;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.airbnb.lottie.LottieAnimationView;
import com.bumptech.glide.Glide;
import com.codder.ultimate.MainApplication;
import com.codder.ultimate.R;
import com.codder.ultimate.SessionManager;
import com.codder.ultimate.fake.activity.FakeAudioWatchActivity;
import com.codder.ultimate.live.activity.HostLiveAudioActivity;
import com.codder.ultimate.live.activity.WatchAudioLiveActivity;
import com.codder.ultimate.live.model.PkAudioLiveUserRoot;
import com.codder.ultimate.retrofit.Const;
import com.codder.ultimate.socket.AudioRoomHandler;
import com.codder.ultimate.socket.MySocketManager;
import com.codder.ultimate.socket.SocketConnectHandler;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import org.json.JSONException;
import org.json.JSONObject;

import io.agora.rtc2.Constants;
import io.agora.rtc2.RtcEngine;
import com.codder.ultimate.musicfunction.AudioMixingController;


public class FloatingButtonService extends Service {

    private static final String TAG = "FloatingButtonService";

    private AudioRoomHandler audioRoomHandler;
    private SocketConnectHandler socketConnectHandler;

    private static final String KEY_FLOAT_IMAGE_URL = "FLOAT_IMAGE_URL";

    private ViewGroup floatView;
    private ImageView btnMaximize;
    private ImageView ivUserImage;

    private SessionManager sessionManager;
    private HostAPICall hostAPICall;

    private WindowManager windowManager;
    private WindowManager.LayoutParams floatWindowLayoutParam;

    private boolean apiLoopStarted = false;

    private final DefaultLifecycleObserver appLifecycleObserver = new DefaultLifecycleObserver() {
        @Override
        public void onStart(@NonNull LifecycleOwner owner) {
            Log.d(TAG, "App foregrounded - showing floatView");
            if (floatView != null) {
                floatView.setVisibility(View.VISIBLE);
            }
        }

        @Override
        public void onStop(@NonNull LifecycleOwner owner) {
            Log.d(TAG, "App backgrounded - hiding floatView");
            if (floatView != null) {
                floatView.setVisibility(View.GONE);
            }
        }
    };

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();

        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        sessionManager = new SessionManager(this);
        hostAPICall = new HostAPICall(this, "audio");

        // Build the overlay UI (can be called again after locale/config changes)
        inflateAndAttachOverlay();

        // Listen for process-level foreground/background transitions
        ProcessLifecycleOwner.get().getLifecycle().addObserver(appLifecycleObserver);

        if (audioRoomHandler == null) {
            audioRoomHandler = new AudioRoomHandler() {


                @Override public void onMuteSeat(Object[] args) {
                    handleMuteSeatInBg(args);
                }

                @Override
                public void onLockSeat(Object[] args) {

                }

                @Override public void onSeat(Object[] args) { handleSeatInBg(args); }

                @Override
                public void onBlock(Object[] args) {

                }

                @Override
                public void onGetUser(Object[] args) {

                }

                @Override
                public void onGetUser2(Object[] args) {

                }

                @Override
                public void onInvite(Object[] args) {

                }

                @Override
                public void onLiveEnd(Object[] args) {

                }

                @Override
                public void onReactionReceived(Object[] args1) {

                }

                @Override
                public void onRoomNameChange(Object[] args) {

                }

                @Override
                public void onRoomImageChange(Object[] args) {

                }

                @Override
                public void onUserCoinUpdate(Object[] args) {

                }

                @Override
                public void onBanned(Object[] args) {

                }

                @Override
                public void onBannedUserList(Object[] args) {

                }

                @Override
                public void onBlockUserAlert(Object[] args) {

                }

                @Override
                public void onHostEnter(Object[] args) {

                }

                @Override
                public void onAudioLiveHostRemove(Object[] args) {

                }

                @Override
                public void onTotalRoomCoins(Object[] args) {

                }

                @Override
                public void onGame(Object[] args) {

                }

                @Override
                public void onLiveEndByEnd(Object[] args) {

                }

                @Override
                public void onComment(Object[] args) {

                }

                @Override
                public void onGift(Object[] args) {

                }

                @Override
                public void onView(Object[] args) {

                }

                @Override
                public void onAddRequested(Object[] args) {

                }

                @Override public void onLessParticipants(Object[] args) {  }
                @Override public void onChangeTheme(Object[] args) {  }
                @Override public void onBroadcastNotification(Object[] args) {  }
                @Override public void onRoomWelcome(Object[] args) {  }

                @Override
                public void onGetLiveRoomViewerList(Object[] args) {

                }

                @Override
                public void onWillBlock(Object[] args) {
                    performClose();
                }
            };
            MySocketManager.getInstance().addAudioRoomHandler(audioRoomHandler);
        }

        if (socketConnectHandler == null) {
            socketConnectHandler = new SocketConnectHandler() {
                @Override public void onConnect() {}
                @Override public void onDisconnect() {}
                @Override public void onReconnecting() {}
                @Override public void onReconnected(Object[] args) {
                    try {
                        PkAudioLiveUserRoot.UsersItem bg = sessionManager.getUserAudioBgModel();
                        if (bg != null) {
                            JSONObject j = new JSONObject();
                            j.put("liveStreamingId", bg.getLiveStreamingId());
                            j.put("userId", sessionManager.getUser().getId());
                            MySocketManager.getInstance().getSocket().emit(Const.LIVE_REJOIN, j);
                        }
                    } catch (Exception e) {
                        Log.e(TAG, "rejoin failed", e);
                    }
                }
            };
            MySocketManager.getInstance().addSocketConnectHandler(socketConnectHandler);
        }

    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null && intent.getBooleanExtra("close", false)) {
            performClose();
            return START_NOT_STICKY;
        }

        // start/continue your loop safely
        if (sessionManager != null && sessionManager.getUser() != null
                && sessionManager.getUser().isHost()
                && sessionManager.getIsAudioRoomBackground()
                && !apiLoopStarted) {
            hostAPICall.startApiCallLoop();
            apiLoopStarted = true;
        }

        try { sessionManager.saveBooleanValue("isMuteByHost", false); } catch (Exception ignored) {}

        // Safely read image extra (intent can be null after locale/process death)
        String imageUrl = null;
        if (intent != null) {
            imageUrl = intent.getStringExtra("image");
            Log.d("FloatingButtonService", "onStartCommand image extra: " + imageUrl);
            if (imageUrl != null) {
                sessionManager.saveStringValue(KEY_FLOAT_IMAGE_URL, imageUrl);
            }
        } else {
            Log.d("FloatingButtonService", "onStartCommand: null Intent (likely after locale change)");
        }

        // If we received a new image in this start, load it now
        String cached = sessionManager.getStringValue(KEY_FLOAT_IMAGE_URL);
        if (cached != null && ivUserImage != null) {
            Glide.with(this)
                    .load(cached)
                    .placeholder(R.drawable.profile_placeholder)
                    .error(R.drawable.profile_placeholder)
                    .circleCrop()
                    .into(ivUserImage);
        } else if (ivUserImage != null) {
            ivUserImage.setImageResource(R.drawable.profile_placeholder);
        }

        // Ensure rotation is running after possible reinflate
        startRotateAnimation(ivUserImage);

        // Make the service resilient across restarts
        return START_REDELIVER_INTENT; // or START_STICKY if you prefer cached-only
    }

    private void performClose() {
        try {
            Intent refreshIntent = new Intent("com.codder.ultimate.ACTION_REFRESH_LIVE_FRAGMENT");
            LocalBroadcastManager.getInstance(this).sendBroadcast(refreshIntent);
        } catch (Exception e) {
            Log.e(TAG, "Error sending refresh broadcast", e);
        }

        stopSelf();
        try {
            AudioMixingController.getInstance().stop();
        } catch (Exception ignored) {}

        HostLiveAudioActivity.isChannelJoined = false;

        RtcEngine engine = rtc();

        PkAudioLiveUserRoot.UsersItem hostBgUser = sessionManager.getLiveUserForBackground();
        boolean isHost = sessionManager.getIsAudioRoomBackground() || hostBgUser != null;

        if (isHost) {
            sessionManager.setIsAudioRoomBackground(true);
            sessionManager.saveBooleanValue("isHostKeep", true);
            sessionManager.setIsAudioRoomExit(true);
            if (hostBgUser != null) {
                sessionManager.saveLiveUserForBackground(hostBgUser);
            }
            if (engine != null) {
                engine.setClientRole(Constants.CLIENT_ROLE_AUDIENCE);
            } else {
                Log.w("FloatingButtonService", "RtcEngine is null: skip setClientRole");
            }
            Log.d(TAG, "performClose: Host room preserved in background, not removing room");
        }

        if (engine != null) {
            engine.leaveChannel();
        } else {
            Log.w("FloatingButtonService", "RtcEngine is null: skip leaveChannel");
        }

        if (sessionManager.getIsUserBackgroundLive()) {
            sessionManager.setIsUserBackgroundLive(false);
            sessionManager.setIsAudioRoomExit(true);
            PkAudioLiveUserRoot.UsersItem bgUser = sessionManager.getUserAudioBgModel();
            if (bgUser != null && sessionManager.getUser() != null) {
                JsonObject jsonObject = new JsonObject();
                jsonObject.addProperty("userId", sessionManager.getUser().getId());
                jsonObject.addProperty("liveUserMongoId", bgUser.getId());
                jsonObject.addProperty("liveStreamingId", bgUser.getLiveStreamingId());
                if (MySocketManager.getInstance().getSocket() != null) {
                    MySocketManager.getInstance().getSocket().emit(Const.EVENT_LESS_PARTICIPATED, jsonObject);
                }
                sessionManager.saveBooleanValue("isUserKeep", false);

                JSONObject jsonObject1 = new JSONObject();
                try {
                    jsonObject1.put("liveStreamingId", bgUser.getLiveStreamingId());
                    jsonObject1.put("liveUserMongoId", bgUser.getId());
                    jsonObject1.put("userId", sessionManager.getUser().getId());
                    jsonObject1.put("isVIP", sessionManager.getUser().isIsVIP());
                    jsonObject1.put("image", sessionManager.getUser().getImage());
                    jsonObject1.put("name", sessionManager.getUser().getName());
                    jsonObject1.put("gender", sessionManager.getUser().getGender());
                    jsonObject1.put("country", sessionManager.getUser().getCountry());
                    jsonObject1.put("userName", sessionManager.getUser().getName());
                    jsonObject1.put("avatarFrame", sessionManager.getUser().getAvatarFrameImage());
                    jsonObject1.put("entrySvga", sessionManager.getUser().getSvgaImage());
                    if (MySocketManager.getInstance().getSocket() != null) {
                        MySocketManager.getInstance().getSocket().emit(Const.EVENT_LESS_VIEW, jsonObject1);
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }

        if (isHost) {
            sessionManager.setIsAudioRoomBackground(true);
            sessionManager.saveBooleanValue("isHostKeep", true);
            sessionManager.setIsAudioRoomExit(true);
            if (hostBgUser != null) {
                sessionManager.saveLiveUserForBackground(hostBgUser);
            }
        } else {
            sessionManager.setIsAudioRoomBackground(false);
            sessionManager.saveBooleanValue("isHostKeep", false);
            sessionManager.saveLiveUserForBackground(null);
        }

        sessionManager.setIsUserBackgroundLive(false);
        sessionManager.saveBooleanValue("isUserKeep", false);
        sessionManager.saveUserAudioBgModel(null);

        if (floatView != null) {
            try {
                windowManager.removeView(floatView);
            } catch (Exception ignored) {}
            floatView = null;
        }
        stopSelf();
    }

    @SuppressLint("ClickableViewAccessibility")
    private void wireOverlayInteractions() {
        btnMaximize.setOnClickListener(v -> {
            performClose();
        });

        ivUserImage.setOnTouchListener(new View.OnTouchListener() {
            private final WindowManager.LayoutParams updatedParameters = floatWindowLayoutParam;
            private int x, y;
            private float touchX, touchY;
            private long touchStartTime;

            @Override
            public boolean onTouch(View v, MotionEvent event) {
                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        x = updatedParameters.x;
                        y = updatedParameters.y;
                        touchX = event.getRawX();
                        touchY = event.getRawY();
                        touchStartTime = System.currentTimeMillis();
                        return true;
                    case MotionEvent.ACTION_MOVE:
                        if (floatView != null) {
                            updatedParameters.x = (int) (x + (event.getRawX() - touchX));
                            updatedParameters.y = (int) (y + (event.getRawY() - touchY));
                            try {
                                windowManager.updateViewLayout(floatView, updatedParameters);
                            } catch (Exception e) {
                                Log.e(TAG, "Error updating floatView layout", e);
                            }
                        }
                        return true;
                    case MotionEvent.ACTION_UP:
                        long touchDuration = System.currentTimeMillis() - touchStartTime;
                        if (touchDuration < 200 &&
                                Math.abs(event.getRawX() - touchX) < 10 &&
                                Math.abs(event.getRawY() - touchY) < 10) {
                            v.performClick();
                        }
                        return true;
                }
                return false;
            }
        });

        ivUserImage.setOnClickListener(view -> {
            if (sessionManager.getIsUserBackgroundLive()) {

                String json = new Gson().toJson(sessionManager.getUserAudioBgModel());
                PkAudioLiveUserRoot.UsersItem model =
                        new Gson().fromJson(json, PkAudioLiveUserRoot.UsersItem.class);
                if (model.isIsFake()){
                    startActivity(new Intent(FloatingButtonService.this, FakeAudioWatchActivity.class)
                            .setFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                            .putExtra(Const.DATA, new Gson().toJson(sessionManager.getUserAudioBgModel())));
                }else {
                    startActivity(new Intent(FloatingButtonService.this, WatchAudioLiveActivity.class)
                            .setFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                            .putExtra(Const.DATA, new Gson().toJson(sessionManager.getUserAudioBgModel())));
                }

            } else {
                Intent intent = new Intent(FloatingButtonService.this, HostLiveAudioActivity.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                intent.putExtra(Const.DATA, new Gson().toJson(sessionManager.getLiveUserForBackground()));
                intent.putExtra(Const.PRIVACY, "Public");
                startActivity(intent);
            }
        });
    }

    @SuppressLint("ClickableViewAccessibility")
    private void inflateAndAttachOverlay() {
        // Remove any existing view to avoid "View already has a parent"
        if (floatView != null) {
            try { windowManager.removeView(floatView); } catch (Exception ignored) {}
            floatView = null;
        }

        // Inflate fresh layout
        LayoutInflater inflater = (LayoutInflater) getSystemService(LAYOUT_INFLATER_SERVICE);
        floatView = (ViewGroup) inflater.inflate(R.layout.floating_button_layout, null);

        // Resolve overlay type
        int layoutType = (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
                : WindowManager.LayoutParams.TYPE_PHONE;

        // Create/restore LayoutParams
        if (floatWindowLayoutParam == null) {
            floatWindowLayoutParam = new WindowManager.LayoutParams(
                    WindowManager.LayoutParams.WRAP_CONTENT,
                    WindowManager.LayoutParams.WRAP_CONTENT,
                    layoutType,
                    WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
                    PixelFormat.TRANSLUCENT
            );
            floatWindowLayoutParam.gravity = Gravity.TOP | Gravity.START;
            floatWindowLayoutParam.x = 0;
            floatWindowLayoutParam.y = 0;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                floatWindowLayoutParam.layoutInDisplayCutoutMode =
                        WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            }
        } else {
            floatWindowLayoutParam.type = layoutType;
        }

        // Add to window
        windowManager.addView(floatView, floatWindowLayoutParam);

        // Set initial visibility based on whether the app is in the foreground
        boolean isAppInForeground = ProcessLifecycleOwner.get().getLifecycle().getCurrentState().isAtLeast(Lifecycle.State.STARTED);
        floatView.setVisibility(isAppInForeground ? View.VISIBLE : View.GONE);

        // Bind views
        btnMaximize = floatView.findViewById(R.id.ivClose);
        ivUserImage = floatView.findViewById(R.id.ivUserImage);
        LottieAnimationView ringAnim = floatView.findViewById(R.id.animation_view);

        // Ensure ring doesn't intercept touches
        if (ringAnim != null) {
            ringAnim.setClickable(false);
            ringAnim.setFocusable(false);
            ringAnim.setFocusableInTouchMode(false);
            ringAnim.setOnTouchListener((v, e) -> false);
            // Optional: keep image on top for touch hit-testing
            ivUserImage.bringToFront();
        }

        // Wire listeners
        wireOverlayInteractions();

        // Load cached image if available
        String cachedImage = sessionManager.getStringValue(KEY_FLOAT_IMAGE_URL);
        if (cachedImage != null) {
            Glide.with(this)
                    .load(cachedImage)
                    .placeholder(R.drawable.profile_placeholder)
                    .error(R.drawable.profile_placeholder)
                    .circleCrop()
                    .into(ivUserImage);
        } else {
            ivUserImage.setImageResource(R.drawable.profile_placeholder);
        }

        // Start rotation animation
        startRotateAnimation(ivUserImage);
    }

    private void startRotateAnimation(View v) {
        if (v == null) return;
        v.clearAnimation();
        RotateAnimation rotate = new RotateAnimation(
                0, 180,
                Animation.RELATIVE_TO_SELF, 0.5f,
                Animation.RELATIVE_TO_SELF, 0.5f
        );
        rotate.setDuration(5000);
        rotate.setInterpolator(new LinearInterpolator());
        rotate.setRepeatMode(Animation.RESTART);
        rotate.setRepeatCount(Animation.INFINITE);
        v.startAnimation(rotate);
    }

    public boolean isMyServiceRunning() {
        ActivityManager manager = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
        for (ActivityManager.RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
            if (FloatingButtonService.class.getName().equals(service.service.getClassName())) {
                return true;
            }
        }
        return false;
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        inflateAndAttachOverlay();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();

        try {
            ProcessLifecycleOwner.get().getLifecycle().removeObserver(appLifecycleObserver);
        } catch (Exception ignored) {}

        if (floatView != null) {
            try { windowManager.removeView(floatView); } catch (Exception ignored) {}
            floatView = null;
        }
        try {
            if (sessionManager != null && sessionManager.getUser() != null && sessionManager.getUser().isHost() && sessionManager.getIsAudioRoomBackground()) {
                hostAPICall.stopApiCallLoop();
            }
        } catch (Exception ignored) {}
        apiLoopStarted = false;

        try { sessionManager.saveBooleanValue("isMuteByHost", false); } catch (Exception ignored) {}

        try {
            if (audioRoomHandler != null) {
                MySocketManager.getInstance().removeAudioRoomHandler(audioRoomHandler);
                audioRoomHandler = null;
            }
            if (socketConnectHandler != null) {
                MySocketManager.getInstance().removeSocketConnectHandler(socketConnectHandler);
                socketConnectHandler = null;
            }
        } catch (Exception ignored) {}

    }

    @Override
    public void onTaskRemoved(Intent rootIntent) {
        Log.d(TAG, "onTaskRemoved: App is swiped away from recent apps. Performing cleanup...");
        performClose();
        super.onTaskRemoved(rootIntent);
    }

    private RtcEngine rtc() {
        try {
            return ((MainApplication) getApplication()).rtcEngine();
        } catch (Exception e) {
            return null;
        }
    }

    private void handleMuteSeatInBg(Object[] args) {
        if (args == null || args.length == 0 || args[0] == null) return;

        try {
            JSONObject json = new JSONObject(args[0].toString());
            int mute        = json.optInt("mute", 0);         // 0=unmute, 1=self-mute, 2=host-forced mute
            int position    = json.optInt("position", -2);    // -1 = host, >=0 = seat
            String targetId = json.optString("mutedUserId", null);
            int agoraId     = json.optInt("agoraId", -1);

            Log.d(TAG, "handleMuteSeatInBg: ==> " +json.toString());

            // am I the target?
            boolean iAmTarget = false;
            String myId = (sessionManager != null && sessionManager.getUser() != null) ? sessionManager.getUser().getId() : "";

            if (targetId != null && targetId.equals(myId)) {
                iAmTarget = true;
            } else {
                // fallback via Agora UID
                int myUid = getMyAgoraUidFromBg();
                if (myUid > 0 && myUid == agoraId) iAmTarget = true;
            }

            if (!iAmTarget) return;

            boolean shouldMute = (mute == 1 || mute == 2);
            boolean forcedByHost = (mute == 2);

            if (rtc() != null) {
                rtc().muteLocalAudioStream(shouldMute);
            }

            // persist so Watch screen can reflect when brought back
            sessionManager.saveBooleanValue("isMuteByHost", forcedByHost);

            // (optional) tweak bubble UI if you like—e.g., dim avatar when muted

            Log.d(TAG, "Applied background mute. shouldMute=" + shouldMute + " forced=" + forcedByHost);
        } catch (Exception e) {
            Log.e(TAG, "handleMuteSeatInBg error", e);
        }
    }

    private void handleSeatInBg(Object[] args) {
        if (args == null || args.length == 0 || args[0] == null) return;
        try {
            String data = args[0].toString();
            com.google.gson.JsonParser parser = new com.google.gson.JsonParser();
            com.google.gson.JsonElement mJson = parser.parse(data);
            com.google.gson.Gson gson = new com.google.gson.Gson();
            PkAudioLiveUserRoot.UsersItem liveUser = gson.fromJson(mJson, PkAudioLiveUserRoot.UsersItem.class);
            if (liveUser != null) {
                if (sessionManager.getIsAudioRoomBackground()) {
                    sessionManager.saveLiveUserForBackground(liveUser);
                }
                if (sessionManager.getUser() != null) {
                    boolean isOnSeat = false;
                    boolean isMuted = false;
                    if (liveUser.getSeat() != null) {
                        for (PkAudioLiveUserRoot.UsersItem.SeatItem seatItem : liveUser.getSeat()) {
                            if (seatItem != null && seatItem.isReserved() && seatItem.getUserId() != null && seatItem.getUserId().equals(sessionManager.getUser().getId())) {
                                isOnSeat = true;
                                if (seatItem.isMute() != 0) {
                                    isMuted = true;
                                }
                                break;
                            }
                        }
                    }
                    if (rtc() != null) {
                        rtc().adjustRecordingSignalVolume(isOnSeat && !isMuted ? 100 : 0);
                    }
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "handleSeatInBg error", e);
        }
    }

    private int getMyAgoraUidFromBg() {
        try {
            PkAudioLiveUserRoot.UsersItem bg = sessionManager.getUserAudioBgModel();
            if (bg == null || bg.getSeat() == null || sessionManager.getUser() == null) return -1;
            String myId = sessionManager.getUser().getId();
            for (PkAudioLiveUserRoot.UsersItem.SeatItem s : bg.getSeat()) {
                if (s != null && myId.equals(s.getUserId())) {
                    return s.getAgoraUid();
                }
            }
        } catch (Exception ignored) {}
        return -1;
    }
}