package com.codder.ultimate.musicfunction;

import android.app.AlertDialog;
import android.content.ContentUris;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.widget.ProgressBar;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.databinding.DataBindingUtil;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.codder.ultimate.R;
import com.codder.ultimate.databinding.ActivityAudioListBinding;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

public class AudioListActivity extends AppCompatActivity {

    ActivityAudioListBinding binding;
    private ArrayList<AudioDetails> audioDetailsList = new ArrayList<>();
    private ArrayList<String> rawAudioPaths;
    private AudioListAdapter adapter;
    private String folderPath;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = DataBindingUtil.setContentView(this, R.layout.activity_audio_list);
        getWindow().setStatusBarColor(Color.parseColor("#170D1F"));

        folderPath = getIntent().getStringExtra("folderPath");
        rawAudioPaths = getIntent().getStringArrayListExtra("audioFiles");

        binding.txtSongCount.setOnClickListener(v -> {
            ArrayList<AudioDetails> selectedSongs = new ArrayList<>(adapter.getSelectedFiles());
            ArrayList<String> selectedPaths = new ArrayList<>();
            for (AudioDetails song : selectedSongs) {
                selectedPaths.add(song.getSongPath());
            }
            int selectedCount = selectedPaths.size();

            // Create an Intent to pass data back with the selected song list
            Intent resultIntent = new Intent();
            resultIntent.putExtra("selectedCount", selectedCount);
            resultIntent.putExtra("folderPath", folderPath);
            resultIntent.putStringArrayListExtra("selectedSongs", selectedPaths);

            Log.d("AudioListActivity", "Selected Songs Count: " + selectedCount);

            setResult(RESULT_OK, resultIntent);
            finish();
        });

        binding.ivBack.setOnClickListener(view -> onBackPressed());

        loadAudioDetailsAsync();
    }

    private void loadAudioDetailsAsync() {
        AlertDialog loadingDialog = new AlertDialog.Builder(this)
                .setView(new ProgressBar(this))
                .setMessage("Loading songs...")
                .setCancelable(false)
                .show();

        new Thread(() -> {
            Map<String, AudioDetails> detailsMap = prefetchAudioDetails(folderPath);
            ArrayList<AudioDetails> detailsList = new ArrayList<>();

            if (rawAudioPaths != null) {
                for (String path : rawAudioPaths) {
                    AudioDetails details = detailsMap.get(path);
                    if (details == null) {
                        // Fallback in case MediaStore query didn't find the file
                        File file = new File(path);
                        details = new AudioDetails(file.getName(), "00:00", "", path);
                    }
                    detailsList.add(details);
                }
            }

            runOnUiThread(() -> {
                if (loadingDialog.isShowing()) {
                    loadingDialog.dismiss();
                }
                audioDetailsList = detailsList;
                setupRecyclerView();
                updateSelectedSongCount(0);
            });
        }).start();
    }

    private Map<String, AudioDetails> prefetchAudioDetails(String folderPath) {
        Map<String, AudioDetails> detailsMap = new HashMap<>();
        if (folderPath == null) return detailsMap;

        Uri uri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;
        String[] projection = {
                MediaStore.Audio.Media.DATA,
                MediaStore.Audio.Media.DISPLAY_NAME,
                MediaStore.Audio.Media.DURATION,
                MediaStore.Audio.Media.ALBUM_ID
        };

        String selection = MediaStore.Audio.Media.DATA + " LIKE ?" + " AND " + MediaStore.Audio.Media.IS_MUSIC + "!= 0";
        String[] selectionArgs = new String[]{folderPath + "/%"};

        try (Cursor cursor = getContentResolver().query(uri, projection, selection, selectionArgs, null)) {
            if (cursor != null && cursor.moveToFirst()) {
                int dataCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DATA);
                int nameCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DISPLAY_NAME);
                int durationCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DURATION);
                int albumIdCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ALBUM_ID);

                do {
                    String filePath = cursor.getString(dataCol);
                    String name = cursor.getString(nameCol);
                    long durationMs = cursor.getLong(durationCol);
                    long albumId = cursor.getLong(albumIdCol);

                    if (filePath != null) {
                        File file = new File(filePath);
                        // Make sure we match parent folder path exactly to avoid subfolder mismatch
                        if (file.getParent() != null && file.getParent().equals(folderPath)) {
                            String durationFormatted = formatDuration(durationMs);
                            Uri sArtworkUri = Uri.parse("content://media/external/audio/albumart");
                            Uri albumArtUri = ContentUris.withAppendedId(sArtworkUri, albumId);

                            if (name == null || name.isEmpty()) {
                                name = file.getName();
                            }

                            AudioDetails details = new AudioDetails(name, durationFormatted, albumArtUri.toString(), filePath);
                            detailsMap.put(filePath, details);
                        }
                    }
                } while (cursor.moveToNext());
            }
        } catch (Exception e) {
            Log.e("AudioListActivity", "Error prefetching audio details", e);
        }
        return detailsMap;
    }

    private String formatDuration(long durationMs) {
        int totalSeconds = (int) (durationMs / 1000);
        int minutes = totalSeconds / 60;
        int seconds = totalSeconds % 60;
        return String.format(Locale.getDefault(), "%02d:%02d", minutes, seconds);
    }

    private void setupRecyclerView() {
        binding.rvAudioList.setLayoutManager(new LinearLayoutManager(this));
        adapter = new AudioListAdapter(audioDetailsList, this::onSelectionChanged);
        binding.rvAudioList.setAdapter(adapter);

        binding.lytSelectAll.setOnClickListener(view -> toggleSelectAll());
    }

    private void toggleSelectAll() {
        if (adapter.getSelectedFiles().size() == audioDetailsList.size()) {
            adapter.clearSelectedFiles();
            updateSelectAllState(false);
        } else {
            adapter.selectAllFiles();
            updateSelectAllState(true);
        }
    }

    private void updateSelectAllState(boolean isSelected) {
        if (isSelected) {
            binding.ivSelectAll.setImageResource(R.drawable.music_selected);  // Change to selected icon
            binding.txtSelectAll.setText("Deselect all");
        } else {
            binding.ivSelectAll.setImageResource(R.drawable.music_unselected);  // Change to unselected icon
            binding.txtSelectAll.setText("Select all");
        }
    }

    public void onSelectionChanged(int selectedCount) {
        updateSelectedSongCount(selectedCount);
    }

    private void updateSelectedSongCount(int count) {
        if (count == 0) {
            binding.txtSongCount.setText("Add");
            binding.txtSongCount.setTextColor(ContextCompat.getColorStateList(this, R.color.white_60));
        } else {
            binding.txtSongCount.setText("Add(" + count + ")");
            binding.txtSongCount.setTextColor(ContextCompat.getColorStateList(this, R.color.white));
        }
    }
}