package com.codder.ultimate.live.bottomsheet;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.Toast;

import androidx.databinding.DataBindingUtil;

import com.bumptech.glide.Glide;
import com.codder.ultimate.R;
import com.codder.ultimate.SessionManager;
import com.codder.ultimate.databinding.BottomSheetAudioroomSettingsBinding;
import com.codder.ultimate.live.model.PkAudioLiveUserRoot;
import com.google.android.material.bottomsheet.BottomSheetBehavior;
import com.google.android.material.bottomsheet.BottomSheetDialog;

public class BottomSheetAudioRoomSetting {

    private final BottomSheetDialog bottomSheetDialog;
    SessionManager sessionManager;

    public BottomSheetAudioRoomSetting(Context context, PkAudioLiveUserRoot.UsersItem liveUser, RoomSettingListener roomSettingListener, boolean isOwner, boolean isAdmin) {
        bottomSheetDialog = new BottomSheetDialog(context, R.style.CustomBottomSheetDialogTheme);
        bottomSheetDialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        bottomSheetDialog.setOnShowListener(dialog -> {
            BottomSheetDialog d = (BottomSheetDialog) dialog;
            FrameLayout bottomSheet = d.findViewById(com.google.android.material.R.id.design_bottom_sheet);
            BottomSheetBehavior.from(bottomSheet).setState(BottomSheetBehavior.STATE_EXPANDED);
        });

        BottomSheetAudioroomSettingsBinding audioRoomSettingsBinding = DataBindingUtil.inflate(LayoutInflater.from(context), R.layout.bottom_sheet_audioroom_settings, null, false);
        bottomSheetDialog.setContentView(audioRoomSettingsBinding.getRoot());
        bottomSheetDialog.show();
        sessionManager = new SessionManager(context);

        if (liveUser.getPrivateCode() == 0) {
            audioRoomSettingsBinding.tvTitleRoomPasscode.setVisibility(View.GONE);
            audioRoomSettingsBinding.layPasscode.setVisibility(View.GONE);
        } else {
            audioRoomSettingsBinding.tvTitleRoomPasscode.setVisibility(View.VISIBLE);
            audioRoomSettingsBinding.layPasscode.setVisibility(View.VISIBLE);
        }

        Glide.with(context)
                .load(liveUser.getRoomImage())
                .into(audioRoomSettingsBinding.imgRoom);

        audioRoomSettingsBinding.tvSeatCount.setText(liveUser.getSeat().size() + context.getString(R.string.people));
        audioRoomSettingsBinding.tvName.setText(liveUser.getRoomName());
        audioRoomSettingsBinding.tvWelcomeMsg.setText(liveUser.getRoomWelcome());
        audioRoomSettingsBinding.tvPassCode.setText((liveUser.getPrivateCode() != 0) ? String.valueOf(liveUser.getPrivateCode()) : "");

        audioRoomSettingsBinding.tvName.setOnClickListener(view -> {
            roomSettingListener.onRoomNameChanged(audioRoomSettingsBinding);
        });

        audioRoomSettingsBinding.tvWelcomeMsg.setOnClickListener(view -> {
            roomSettingListener.onRoomWelcomeMessageChanged(audioRoomSettingsBinding);
        });

        audioRoomSettingsBinding.btnPencil.setOnClickListener(view -> {
            roomSettingListener.onRoomImageChanged(audioRoomSettingsBinding);
            bottomSheetDialog.dismiss();

        });

        audioRoomSettingsBinding.btnClose.setOnClickListener(v -> bottomSheetDialog.dismiss());

        audioRoomSettingsBinding.ivEdit.setOnClickListener(v -> {
            roomSettingListener.onRoomPasscodeChanged(audioRoomSettingsBinding);
        });


        audioRoomSettingsBinding.tvPassCode.setOnClickListener(view -> {
//            roomSettingListener.onRoomPasscodeChanged(audioroomSettingsBinding);

        });

        audioRoomSettingsBinding.ivCopy.setOnClickListener(view -> {
            ClipboardManager clipboard = (ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE);
            ClipData clip = ClipData.newPlainText("", audioRoomSettingsBinding.tvPassCode.getText().toString());
            clipboard.setPrimaryClip(clip);
            Toast.makeText(context, R.string.copied_to_clipboard, Toast.LENGTH_SHORT).show();
        });

        audioRoomSettingsBinding.layWheat.setOnClickListener(v -> {
            roomSettingListener.onSeatSizeChanged(audioRoomSettingsBinding);
            bottomSheetDialog.dismiss();
        });

        audioRoomSettingsBinding.layChangeBg.setOnClickListener(view -> {
            roomSettingListener.onRoomBackgroundChanged();
            bottomSheetDialog.dismiss();
        });

        audioRoomSettingsBinding.layBannedList.setOnClickListener(v -> {
            roomSettingListener.onBannedUser();
            bottomSheetDialog.dismiss();
        });

        // F7: Room Admin button — replaces "Room Close" for non-owner admins
        audioRoomSettingsBinding.layRoomClose.setOnClickListener(v -> {
            if (isOwner) {
                roomSettingListener.onRoomClose();
            } else if (isAdmin) {
                roomSettingListener.onRoomAdmin();
                bottomSheetDialog.dismiss();
            }
        });

        // F7: Restrict settings visibility for admins (non-owners)
        if (isAdmin && !isOwner) {
            // Admins cannot change room name, image, welcome message, or passcode
            audioRoomSettingsBinding.tvName.setEnabled(false);
            audioRoomSettingsBinding.tvName.setOnClickListener(null);
            audioRoomSettingsBinding.tvWelcomeMsg.setEnabled(false);
            audioRoomSettingsBinding.tvWelcomeMsg.setOnClickListener(null);
            audioRoomSettingsBinding.btnPencil.setVisibility(View.GONE);
            audioRoomSettingsBinding.ivEdit.setVisibility(View.GONE);
            audioRoomSettingsBinding.ivCopy.setVisibility(View.GONE);
            // Change "Room Close" text to "Room Admin"  
            // Note: the layout uses layRoomClose. We repurpose it.
        }

    }

    public interface RoomSettingListener {

        void onRoomNameChanged(BottomSheetAudioroomSettingsBinding audioRoomSettingsBinding);

        void onRoomImageChanged(BottomSheetAudioroomSettingsBinding audioRoomSettingsBinding);

        void onSeatSizeChanged(BottomSheetAudioroomSettingsBinding audioRoomSettingsBinding);

        void onRoomWelcomeMessageChanged(BottomSheetAudioroomSettingsBinding audioRoomSettings);

        void onRoomPasscodeChanged(BottomSheetAudioroomSettingsBinding audioRoomSettings);

        void onRoomBackgroundChanged();

        void onBannedUser();

        void onRoomClose();

        // F7: Room Admin management
        void onRoomAdmin();

    }
}
