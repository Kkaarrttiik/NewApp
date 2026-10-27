package com.codder.ultimate.musicfunction;


import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.widget.Toast;

import java.util.ArrayList;

import io.agora.rtc2.IAudioEffectManager;
import io.agora.rtc2.RtcEngine;

public class AudioMixingController {

    private static final String TAG = "AudioMixingController";
    private final Handler progressHandler = new Handler(Looper.getMainLooper());
    boolean isPlaying = false;
    private int lastPausedPosition = 0;

    AudioMixingListner audioMixingListner;
    private Context context;
    private IAudioEffectManager audioEffectManager;

    private boolean isSeekedToEnd = false;
    private boolean isUserChangingSong = false;

    private RtcEngine rtcEngine;
    private String currentSongPath;
    private ArrayList<AudioDetails> selectedSongs = new ArrayList<>();
    private int currentIndex = 0;
    private Runnable progressRunnable;
    private boolean isTrackingProgress = false;
    private int lastPlayingIndex = -1;
    private int progress;
    private String currentPlayingPath = null;


    public AudioMixingController() {

    }

    public static AudioMixingController getInstance() {
        return Holder.INSTANCE;
    }

    public long getTotalDuration() {
        if (rtcEngine != null) {
            return rtcEngine.getAudioMixingDuration(); // Returns duration in milliseconds
        }
        return 0;
    }

    public void startTrackingProgress() {
        if (isTrackingProgress) return;

        isTrackingProgress = true;
        Log.d(TAG, "startTrackingProgress: ");
        progressRunnable = new Runnable() {
            @Override
            public void run() {
                if (rtcEngine != null && isPlaying) {
                    progress = rtcEngine.getAudioMixingCurrentPosition();

                    long totalDuration = getTotalDuration(); // Get total duration
                    Log.d(TAG, "run: totalDuration: " + totalDuration + " ms, progress: " + progress + " ms");
                    Log.d(TAG, "Progress: " + progress + " / " + totalDuration + " (index: " + currentIndex + ")");


                    // Notify the listener with progress and total duration
                    if (audioMixingListner != null) {
                        audioMixingListner.currentProgress(progress, totalDuration);
                    }
//                    long totalDuration = rtcEngine.getAudioMixingDuration();
//                    Log.d(TAG, "run: totalDuration: " + totalDuration + " ms, progress: " + progress + " ms");
//                    int progressSeconds = (int) (progress / 1000);
//                    int totalSeconds = (int) (totalDuration / 1000);
//                    int progressPercentage = (int) ((progress * 100) / totalDuration);
//
//                    // Notify the listener
//                    audioMixingListner.currentProgress(progress);
//                    Log.d(TAG, "run: progress: " + progressSeconds + "/" + totalSeconds + ", progressPercentage: " + progressPercentage + "%");
                    // Schedule the next update
                    progressHandler.postDelayed(this, 1000);
                }
            }
        };

        progressHandler.postDelayed(progressRunnable, 1000);
    }

    private void delayedPlayNextTrack() {
        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            if (currentIndex < selectedSongs.size()) {
                play();
                if (audioMixingListner != null) {
                    audioMixingListner.isPlaying(isPlaying);
                }
            } else {
                Log.d(TAG, "delayedPlayNextTrack: Index out of bounds. Not playing.");
            }
        }, 800);
    }



    public void stopTrackingProgress() {
        isTrackingProgress = false;
        progressHandler.removeCallbacks(progressRunnable);
    }

    public AudioMixingListner getAudioMixingListner() {
        return audioMixingListner;
    }

    public void setAudioMixingListner(AudioMixingListner audioMixingListner) {
        this.audioMixingListner = audioMixingListner;
    }

    public void init(Context context, RtcEngine mRtcEngine) {

        if (mRtcEngine == null) {
            Log.e("AudioMixingController", "init: rtcEngine is null, skipping init");
            return; // ← safe exit
        }
        this.context = context;
        this.rtcEngine = mRtcEngine;
        audioEffectManager = mRtcEngine.getAudioEffectManager();
    }

    public void stop() {
        isUserChangingSong = true;
        if (rtcEngine != null) {
            rtcEngine.stopAudioMixing();
        }
        isPlaying = false;
        stopTrackingProgress();
        long totalDuration = getTotalDuration();
        if (audioMixingListner != null) {
            audioMixingListner.isPlaying(false);
            audioMixingListner.currentProgress(0, totalDuration);
        }
        Log.d(TAG, "stop: Audio playback stopped");
        lastPausedPosition = 0;
    }

    public void play() {
        isUserChangingSong = true;

        if (lastPlayingIndex == currentIndex && isPlaying && !isSeekedToEnd) {
            Log.d(TAG, "play: Already playing current index, ignoring play call");
            return;
        }


        if (currentIndex < 0 || currentIndex >= selectedSongs.size()) {
            Log.e(TAG, "Invalid currentIndex: " + currentIndex);
            return;
        }


        Log.d(TAG, "Selected songs size: " + selectedSongs.size());

        if (selectedSongs.isEmpty()) {
            Toast.makeText(context, "Playlist is empty", Toast.LENGTH_SHORT).show();
            return;
        }

        // If the same song is being requested again, skip to the next or loop to start
        // Do not forcefully change index here; let the caller control it
        if (lastPlayingIndex == currentIndex && isPlaying && !isSeekedToEnd) {
            Log.d(TAG, "play: Already playing current index, ignoring play call");
            return;
        }


        rtcEngine.enableAudio();
        rtcEngine.stopAudioMixing();
        stopTrackingProgress();
        isPlaying = false;
        progress = 0;

        currentSongPath = selectedSongs.get(currentIndex).getSongPath();
        currentPlayingPath = currentSongPath;
        String currentSongTitle = selectedSongs.get(currentIndex).getName();

        if (audioMixingListner != null) {
            audioMixingListner.onAudioTitleUpdated(currentSongTitle);
            audioMixingListner.currentProgress(0, getTotalDuration());
        }

        int success = rtcEngine.startAudioMixing(currentSongPath, false, 1, 0);
        Log.d(TAG, "Playing song at index " + currentIndex + ": " + currentSongTitle + " (startAudioMixing success: " + success + ")");

        if (success == 0) {
            isPlaying = true;
            lastPlayingIndex = currentIndex;
            isSeekedToEnd = false;
            startTrackingProgress();
        } else {
            Toast.makeText(context, "Failed to start audio mixing", Toast.LENGTH_SHORT).show();
            isPlaying = false;
        }

        lastPausedPosition = 0;
    }



    public void seekTo(int positionMs) {
        if (rtcEngine != null && isPlaying) {
            long totalDuration = getTotalDuration();

            // Consider it a seek-to-end if within 1 second of total
            isSeekedToEnd = (totalDuration - positionMs) <= 1000;

            rtcEngine.setAudioMixingPosition(positionMs);
            progress = positionMs;

            Log.d(TAG, "seekTo: Moved to position " + positionMs + " ms (SeekedToEnd: " + isSeekedToEnd + ")");
        } else {
            Log.d(TAG, "seekTo: Cannot seek. Audio is not playing or RtcEngine is null");
        }


        if (isSeekedToEnd) {
            stopTrackingProgress();

            if (currentIndex < selectedSongs.size() - 1) {
                currentIndex++;
                isSeekedToEnd = false;  // ✅ Reset before play()
                play();
                if (audioMixingListner != null) {
                    audioMixingListner.isPlaying(isPlaying);
                }
            } else {
                // Last song, stop and show toast
                stop();
                Toast.makeText(context, "No more songs to play", Toast.LENGTH_SHORT).show();  // ✅ Add here too
            }
        }


    }



    public int getCurrentIndex() {
        return currentIndex;
    }

    public boolean isLoaded() {
        return selectedSongs != null && !selectedSongs.isEmpty();
    }

    public boolean isPlaying() {
        return isPlaying;
    }

    public void togglePlayPause() {
        if (isPlaying) {
            lastPausedPosition = progress; // ✅ Store current progress
            rtcEngine.pauseAudioMixing();
            isPlaying = false;
            stopTrackingProgress();
        } else {
            // ✅ Resume from where it left off
            int success = rtcEngine.resumeAudioMixing();
            if (success == 0) {
                isPlaying = true;
                startTrackingProgress();
            } else {
                // If resume fails (e.g., stopped completely), try full play + seek
                play();  // fallback
                if (lastPausedPosition > 0) {
                    seekTo(lastPausedPosition);
                }
            }
        }

        if (audioMixingListner != null) {
            audioMixingListner.isPlaying(isPlaying);
        }
    }


    public void next() {
        if (currentIndex >= selectedSongs.size() - 1) {
            Toast.makeText(context, "No Next Song", Toast.LENGTH_SHORT).show();
        } else {
            currentIndex++;
            play();

            if (audioMixingListner != null) {
                audioMixingListner.isPlaying(isPlaying);
            }
        }
    }


    public void previous() {
        if (currentIndex > 0) {
            currentIndex--;
            play();

            if (audioMixingListner != null) {
                audioMixingListner.isPlaying(isPlaying);
            }
        } else {
            Toast.makeText(context, "No Previous Song", Toast.LENGTH_SHORT).show();
        }
    }

    private void handleSongCompletion(String source) {
        if (isUserChangingSong) {
            isUserChangingSong = false;
            Log.d(TAG, "handleSongCompletion: Ignored because user is changing song (source: " + source + ")");
            return;
        }
        if (selectedSongs == null || selectedSongs.isEmpty()) return;

        AudioDetails currentSong = selectedSongs.get(currentIndex);
        if (currentSong == null) return;

        if (currentPlayingPath != null && currentPlayingPath.equals(currentSong.getSongPath())) {
            currentPlayingPath = null; // Clear to prevent duplicate triggering
            Log.d(TAG, "handleSongCompletion: Song finished from " + source + ". currentIndex: " + currentIndex);

            if (currentIndex < selectedSongs.size() - 1) {
                currentIndex++;
                Log.d(TAG, "handleSongCompletion: Autoplaying song at index: " + currentIndex);
                delayedPlayNextTrack();
            } else {
                stop();
                if (context != null) {
                    Toast.makeText(context, "No more songs to play", Toast.LENGTH_SHORT).show();
                }
            }
        } else {
            Log.d(TAG, "handleSongCompletion: Ignored duplicate/stale call from " + source);
        }
    }

    public void onAudioMixingStateChanged(int state, int reason) {
        Log.d(TAG, "onAudioMixingStateChanged: state = " + state + ", reason = " + reason);
        if (state == 710) { // Playing state reached
            isUserChangingSong = false;
        }
        // Agora state: Stopped = 712, Failed = 714
        if (state == 712 || state == 714) {
            // Only trigger completion if it finished naturally (721 = ended, 724 = all loops completed)
            if (reason == 721 || reason == 724) {
                new Handler(Looper.getMainLooper()).post(() -> {
                    handleSongCompletion("onAudioMixingStateChanged");
                });
            }
        }
    }

    public void onAudioMixingFinished() {
        Log.d(TAG, "onAudioMixingFinished called");
        new Handler(Looper.getMainLooper()).post(() -> {
            handleSongCompletion("onAudioMixingFinished");
        });
    }


    public void load(ArrayList<AudioDetails> newSongs) {
        Log.d(TAG, "load() called, currentIndex: " + currentIndex);
        if (newSongs == null || newSongs.isEmpty()) {
            this.selectedSongs.clear();
            stop();
            return;
        }

        // Find the index of the currently playing song in the new list
        int newPlayingIndex = -1;
        if (currentSongPath != null) {
            for (int i = 0; i < newSongs.size(); i++) {
                if (currentSongPath.equals(newSongs.get(i).getSongPath())) {
                    newPlayingIndex = i;
                    break;
                }
            }
        }

        this.selectedSongs.clear();
        this.selectedSongs.addAll(newSongs);

        if (newPlayingIndex != -1) {
            // The currently playing song is in the new list, just update currentIndex and keep playing!
            currentIndex = newPlayingIndex;
            lastPlayingIndex = newPlayingIndex;
            Log.d(TAG, "load(): Currently playing song found at index " + currentIndex + ", keeping playback.");
            
            // Update title to the UI just in case
            if (audioMixingListner != null) {
                audioMixingListner.onAudioTitleUpdated(this.selectedSongs.get(currentIndex).getName());
            }
        } else {
            // The currently playing song is not in the new list (or nothing was playing)
            Log.d(TAG, "load(): Currently playing song not found in new list, resetting index to 0.");
            if (isPlaying) {
                stop();
            }
            currentIndex = 0;
            lastPlayingIndex = -1;
            currentSongPath = this.selectedSongs.get(currentIndex).getSongPath();
            String currentSongTitle = this.selectedSongs.get(currentIndex).getName();

            if (audioMixingListner != null) {
                audioMixingListner.onAudioTitleUpdated(currentSongTitle);
                audioMixingListner.currentProgress(0, getTotalDuration());
            }
        }
    }



    public void setVolume(int volume) {
        rtcEngine.adjustAudioMixingVolume(volume);
    }

    public int getVolume() {
        return rtcEngine.getAudioMixingPlayoutVolume();
    }

    public interface AudioMixingListner {
        void isPlaying(boolean isPlaying);

        void currentProgress(long progress, long totalDuration);

        void onAudioTitleUpdated(String title);
    }

    private static final class Holder {
        private static final AudioMixingController INSTANCE = new AudioMixingController();
    }


}
