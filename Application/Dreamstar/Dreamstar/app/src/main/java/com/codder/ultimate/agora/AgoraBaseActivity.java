package com.codder.ultimate.agora;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothHeadset;
import android.bluetooth.BluetoothProfile;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.content.res.AssetFileDescriptor;
import android.media.AudioDeviceCallback;
import android.media.AudioDeviceInfo;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.util.Log;
import android.view.SurfaceView;

import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;

import com.codder.ultimate.BuildConfig;
import com.codder.ultimate.MainApplication;
import com.codder.ultimate.R;
import com.codder.ultimate.SessionManager;
import com.codder.ultimate.activity.BaseActivity;
import com.codder.ultimate.agora.rtc.Constants;
import com.codder.ultimate.agora.rtc.EngineConfig;
import com.codder.ultimate.agora.rtc.EventHandler;
import com.codder.ultimate.agora.stats.StatsManager;
import com.codder.ultimate.popups.PopupBuilder;
import com.codder.ultimate.retrofit.Const;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.net.URI;

import io.agora.rtc2.RtcEngine;
import io.agora.rtc2.video.VideoCanvas;
import io.agora.rtc2.video.VideoEncoderConfiguration;
import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.client.SocketOptionBuilder;
import io.socket.engineio.client.transports.Polling;
import io.socket.engineio.client.transports.WebSocket;

public abstract class AgoraBaseActivity extends BaseActivity implements EventHandler {
    private static final String TAG = "AgoraBaseActivity";
    SessionManager sessionManager;

    private Socket socket;
    private MediaPlayer player2;
    public AudioManager audioManager;
    private AudioDeviceCallback audioDeviceCallback;

    public Socket getSocket() {
        return socket;
    }

    private BroadcastReceiver wiredHeadsetReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            if (action != null && action.equals(Intent.ACTION_HEADSET_PLUG)) {
                int state = intent.getIntExtra("state", -1);
                switch (state) {
                    case 0:
                        Log.d(TAG, "Wired headset disconnected");
                        configureAudioRouting(rtcEngine()); // Re-route audio
                        break;
                    case 1:
                        Log.d(TAG, "Wired headset connected");
                        configureAudioRouting(rtcEngine()); // Re-route audio
                        break;
                    default:
                        break;
                }
            }
        }
    };
    private BroadcastReceiver bluetoothReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            Log.d(TAG, "Bluetooth event received: " + action);
            
            // Re-route audio immediately
            configureAudioRouting(rtcEngine());
            
            // Re-route with delays to handle state transition latency
            new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                @Override
                public void run() {
                    configureAudioRouting(rtcEngine());
                }
            }, 500);
            
            new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                @Override
                public void run() {
                    configureAudioRouting(rtcEngine());
                }
            }, 1500);
        }
    };

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        sessionManager = new SessionManager(this);
        registerRtcEventHandler(this);
        audioManager = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
        if (audioManager != null) {
            audioManager.setMode(AudioManager.MODE_IN_COMMUNICATION);
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            registerAudioDeviceCallback();
        } else {
            IntentFilter filter = new IntentFilter(Intent.ACTION_HEADSET_PLUG);
            registerReceiver(wiredHeadsetReceiver, filter);
            IntentFilter filter2 = new IntentFilter(BluetoothDevice.ACTION_ACL_CONNECTED);
            filter2.addAction(BluetoothDevice.ACTION_ACL_DISCONNECTED);
            filter2.addAction(BluetoothHeadset.ACTION_CONNECTION_STATE_CHANGED);
            registerReceiver(bluetoothReceiver, filter2);
        }
    }

    private boolean isBluetoothConnected() {
        AudioManager am = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
        if (am == null) return false;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            for (AudioDeviceInfo dev : am.getDevices(AudioManager.GET_DEVICES_OUTPUTS)) {
                int t = dev.getType();
                if (t == AudioDeviceInfo.TYPE_BLUETOOTH_SCO
                        || t == AudioDeviceInfo.TYPE_BLUETOOTH_A2DP) {
                    return true;
                }
                if (android.os.Build.VERSION.SDK_INT >= 28) {
                    if (t == AudioDeviceInfo.TYPE_HEARING_AID) {
                        return true;
                    }
                }
                if (android.os.Build.VERSION.SDK_INT >= 31) {
                    if (t == AudioDeviceInfo.TYPE_BLE_HEADSET
                            || t == AudioDeviceInfo.TYPE_BLE_SPEAKER
                            || t == AudioDeviceInfo.TYPE_BLE_BROADCAST) {
                        return true;
                    }
                }
            }
            return false;
        } else {
            return am.isBluetoothScoOn() || am.isBluetoothA2dpOn();
        }
    }

    private boolean isWiredHeadsetConnected() {
        AudioManager am = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
        if (am == null) return false;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            for (AudioDeviceInfo dev : am.getDevices(AudioManager.GET_DEVICES_OUTPUTS)) {
                int t = dev.getType();
                if (t == AudioDeviceInfo.TYPE_WIRED_HEADSET
                        || t == AudioDeviceInfo.TYPE_WIRED_HEADPHONES) {
                    return true;
                }
                if (android.os.Build.VERSION.SDK_INT >= 26) {
                    if (t == AudioDeviceInfo.TYPE_USB_HEADSET) {
                        return true;
                    }
                }
            }
            return false;
        } else {
            return am.isWiredHeadsetOn();
        }
    }

    // Call this method after initializing the Agora engine
//    public void configureAudioRouting(RtcEngine rtcEngine) {
//        if (isBluetoothConnected()) {
//            Log.d(TAG, "Bluetooth headset connected, routing audio to Bluetooth");
//            // Let Agora handle Bluetooth routing automatically
//            // No need to change audio route manually, Bluetooth takes precedence
//
//        } else if (isWiredHeadsetConnected()) {
//            Log.d(TAG, "Wired headset connected, routing audio to wired headset");
//            // Wired headsets automatically take precedence
//        } else {
//            // No external device connected, decide based on preference
//            Log.d(TAG, "No external device connected, routing to speaker");
//            // Route audio to speakerphone
//            if (rtcEngine() != null) {
//                rtcEngine().setDefaultAudioRoutetoSpeakerphone(true);
//                rtcEngine().setEnableSpeakerphone(true);
//            }
//        }
//    }

    public void configureAudioRouting(RtcEngine rtcEngine) {
        AudioManager am = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
        if (am == null) return;

        boolean isBT = isBluetoothConnected();
        boolean isWired = isWiredHeadsetConnected();

        Log.d(TAG, "configureAudioRouting: isBT=" + isBT + ", isWired=" + isWired);

        try {
            if (am.getMode() != AudioManager.MODE_IN_COMMUNICATION) {
                am.setMode(AudioManager.MODE_IN_COMMUNICATION);
            }
        } catch (Throwable e) {
            Log.e(TAG, "Error setting audio mode to MODE_IN_COMMUNICATION", e);
        }

        if (isBT) {
            Log.d(TAG, "configureAudioRouting: Bluetooth connected, letting Agora handle it automatically");
            if (Build.VERSION.SDK_INT >= 31) {
                am.clearCommunicationDevice();
            } else {
                try {
                    if (am.isBluetoothScoOn()) {
                        am.setBluetoothScoOn(false);
                        am.stopBluetoothSco();
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Error stopping Bluetooth SCO (Legacy)", e);
                }
                am.setSpeakerphoneOn(false);
            }

            if (rtcEngine != null) {
                rtcEngine.setEnableSpeakerphone(false);
            }
        } else if (isWired) {
            Log.d(TAG, "configureAudioRouting: Wired headset connected, letting Agora handle it automatically");
            if (Build.VERSION.SDK_INT >= 31) {
                am.clearCommunicationDevice();
            } else {
                try {
                    if (am.isBluetoothScoOn()) {
                        am.setBluetoothScoOn(false);
                        am.stopBluetoothSco();
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Error stopping Bluetooth SCO", e);
                }
                am.setSpeakerphoneOn(false);
            }

            if (rtcEngine != null) {
                rtcEngine.setEnableSpeakerphone(false);
            }
        } else {
            if (Build.VERSION.SDK_INT >= 31) {
                boolean speakerSet = false;
                AudioDeviceInfo speakerDevice = null;
                for (AudioDeviceInfo dev : am.getAvailableCommunicationDevices()) {
                    if (dev.getType() == AudioDeviceInfo.TYPE_BUILTIN_SPEAKER) {
                        speakerDevice = dev;
                        break;
                    }
                }
                if (speakerDevice != null) {
                    AudioDeviceInfo currentCommDevice = am.getCommunicationDevice();
                    if (currentCommDevice == null || currentCommDevice.getId() != speakerDevice.getId()) {
                        try {
                            speakerSet = am.setCommunicationDevice(speakerDevice);
                            Log.d(TAG, "configureAudioRouting: forced communication device to Speakerphone: " + speakerSet);
                        } catch (Exception e) {
                            Log.e(TAG, "Error setting communication device to Speakerphone", e);
                        }
                    } else {
                        speakerSet = true;
                    }
                }
                if (!speakerSet) {
                    am.setSpeakerphoneOn(true);
                }
            } else {
                try {
                    if (am.isBluetoothScoOn()) {
                        am.setBluetoothScoOn(false);
                        am.stopBluetoothSco();
                        Log.d(TAG, "configureAudioRouting: stopped Bluetooth SCO (Legacy) for speaker");
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Error stopping Bluetooth SCO", e);
                }
                am.setSpeakerphoneOn(true);
            }

            if (rtcEngine != null) {
                rtcEngine.setEnableSpeakerphone(true);
            }
        }
    }

    public void initSoketIo(String tkn, boolean ishost) {

        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("liveRoom", tkn);
            if (ishost) {
                jsonObject.put("liveHostRoom", sessionManager.getUser().getId());
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        Log.d(TAG, "initSoketIo: live rid " + tkn);
        SocketOptionBuilder optionsBuilder = IO.Options.builder()
                // IO factory options
                .setForceNew(false)
                .setMultiplex(true)

                // low-level engine options
                .setTransports(new String[]{Polling.NAME, WebSocket.NAME})
                .setUpgrade(true)
                .setRememberUpgrade(false)
                .setPath("/socket.io/")
                .setQuery("obj=" + jsonObject.toString() + "")
                .setExtraHeaders(null)
                // Manager options
                .setReconnection(true)
                .setReconnectionAttempts(Integer.MAX_VALUE)
                .setReconnectionDelay(1_000)
                .setReconnectionDelayMax(5_000)
                .setRandomizationFactor(0.5)
                .setTimeout(20_000)
                // Socket options
                .setAuth(null);

        Log.d(TAG, "initSoketIo: ");
       /* if (ishost) {
            optionsBuilder.setQuery("liveHostRoom=" + tkn + "");
        }*/
        //   optionsBuilder.setQuery("liveRoom=" + tkn + "");
        IO.Options options = optionsBuilder.build();

        URI uri = URI.create(BuildConfig.BASE_URL);
        socket = IO.socket(uri, options);
        Log.d("TAG", "onCreate: " + socket.id());
        socket.connect();
        Log.d("TAG", "soket: " + socket.connected());
        socket.on("connection", args -> {
            Log.d("TAG", "onCreate: socket ");
        });
        socket.on(Socket.EVENT_CONNECT, args -> {
            Log.d("TAG", "initSoketIo: connect ");
            socket.on(Const.EVENT_PK_END, args1 -> {
                Log.d(TAG, "initSoketIo: pk end listener");
            });
        });
    }

    public void makeSound() {
        if (player2 != null) {
            player2.release();
            player2 = null;
        }
        try {
            player2 = new MediaPlayer();
            try {
                AssetFileDescriptor afd2 = getAssets().openFd("pop.mp3");
                player2.setDataSource(afd2.getFileDescriptor(), afd2.getStartOffset(), afd2.getLength());
                player2.prepare();
                player2.start();
            } catch (IOException e) {
                Log.d(TAG, "initUI: " + e.getMessage());
                e.printStackTrace();
            }
        } catch (Exception e) {
            e.printStackTrace();
            Log.d(TAG, "initUI: errrr " + e.getMessage());
        }
    }


    protected MainApplication application() {
        return (MainApplication) getApplication();
    }

    protected StatsManager statsManager() {
        return application().statsManager();
    }

    protected RtcEngine rtcEngine() {
        return application().rtcEngine();
    }

    public void configVideo() {
        VideoEncoderConfiguration configuration = new VideoEncoderConfiguration(
                Constants.VIDEO_DIMENSIONS[config().getVideoDimenIndex()],
                VideoEncoderConfiguration.FRAME_RATE.FRAME_RATE_FPS_15,
                VideoEncoderConfiguration.STANDARD_BITRATE,
                VideoEncoderConfiguration.ORIENTATION_MODE.ORIENTATION_MODE_FIXED_PORTRAIT
        );
        configuration.mirrorMode = VideoEncoderConfiguration.MIRROR_MODE_TYPE.MIRROR_MODE_ENABLED;
        if (rtcEngine() != null) {
            rtcEngine().setVideoEncoderConfiguration(configuration);
        }
    }


    protected EngineConfig config() {
        return application().engineConfig();
    }

    protected void removeRtcVideo(int uid, boolean local) {
        if (rtcEngine() != null) {
            if (local) {
                rtcEngine().setupLocalVideo(null);
            } else {
                rtcEngine().setupRemoteVideo(new VideoCanvas(null, VideoCanvas.RENDER_MODE_HIDDEN, uid));
            }
        }

    }

    public boolean checkOverlayDisplayPermission() {
        return Settings.canDrawOverlays(this);
    }

    public void requestOverlayDisplayPermission() {

        new PopupBuilder(this).showReliteDiscardPopup(R.drawable.vector_info, getString(R.string.screen_overlay_permission_needed), getString(R.string.enable_display_over_other_apps_from_system_settings), "Open Settings", "cancel", new PopupBuilder.OnPopupClickListener() {
            @Override
            public void onClickContinue() {
                Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:" + getPackageName()));
                startActivityForResult(intent, RESULT_OK);

//                Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
//                intent.setData(Uri.parse("package:" + getPackageName()));
//                startActivity(intent);

//                Intent intent = new Intent(
//                        Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
//                        Uri.parse("package:" + getPackageName())
//                );
//                startActivity(intent);
            }
        });
    }


    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            unregisterAudioDeviceCallback();
        } else {
            try {
                unregisterReceiver(wiredHeadsetReceiver);
            } catch (Exception e) {
                Log.e(TAG, "Error unregistering wiredHeadsetReceiver", e);
            }
            try {
                unregisterReceiver(bluetoothReceiver);
            } catch (Exception e) {
                Log.e(TAG, "Error unregistering bluetoothReceiver", e);
            }
        }
        resetAudioRouting();

        removeRtcEventHandler(this);
    }

    private void resetAudioRouting() {
        if (sessionManager != null) {
            boolean isKeep = sessionManager.getBooleanValue("isUserKeep")
                    || sessionManager.getBooleanValue("isHostKeep");
            boolean isHeadsetConnected = isBluetoothConnected() || isWiredHeadsetConnected();
            if (isKeep && !isHeadsetConnected) {
                Log.d(TAG, "resetAudioRouting: skipped because of keep/minimize mode and no headset/BT connected");
                return;
            }
        }
        AudioManager am = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
        if (am != null) {
            try {
                if (Build.VERSION.SDK_INT < 31) {
                    if (am.isBluetoothScoOn()) {
                        am.setBluetoothScoOn(false);
                        am.stopBluetoothSco();
                    }
                }
            } catch (Exception e) {
                Log.e(TAG, "Error resetting Bluetooth SCO on destroy", e);
            }
            try {
                if (Build.VERSION.SDK_INT >= 31) {
                    am.clearCommunicationDevice();
                } else {
                    am.setSpeakerphoneOn(false);
                }
                am.setMode(AudioManager.MODE_NORMAL);
            } catch (Throwable e) {
                Log.e(TAG, "Error resetting audio mode on destroy", e);
            }
            Log.d(TAG, "resetAudioRouting: audio routing reset on destroy");
        }
    }

    private void registerAudioDeviceCallback() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            audioDeviceCallback = new AudioDeviceCallback() {
                @Override
                public void onAudioDevicesAdded(AudioDeviceInfo[] addedDevices) {
                    super.onAudioDevicesAdded(addedDevices);
                    Log.d(TAG, "Audio devices added, re-configuring routing");
                    try {
                        configureAudioRouting(rtcEngine());
                    } catch (Throwable t) {
                        Log.e(TAG, "Error configuring audio routing on devices added", t);
                    }
                }

                @Override
                public void onAudioDevicesRemoved(AudioDeviceInfo[] removedDevices) {
                    super.onAudioDevicesRemoved(removedDevices);
                    Log.d(TAG, "Audio devices removed, re-configuring routing");
                    try {
                        configureAudioRouting(rtcEngine());
                    } catch (Throwable t) {
                        Log.e(TAG, "Error configuring audio routing on devices removed", t);
                    }
                }
            };
            AudioManager am = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
            if (am != null) {
                am.registerAudioDeviceCallback(audioDeviceCallback, new Handler(Looper.getMainLooper()));
            }
        }
    }

    private void unregisterAudioDeviceCallback() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && audioDeviceCallback != null) {
            AudioManager am = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
            if (am != null) {
                am.unregisterAudioDeviceCallback(audioDeviceCallback);
            }
        }
    }

}
