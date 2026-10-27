package com.codder.ultimate.live.viewModel;

import android.util.Log;

import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.codder.ultimate.live.adapter.LiveStramCommentAdapter;
import com.codder.ultimate.live.adapter.LiveViewAdapter;
import com.codder.ultimate.live.adapter.LiveViewUserAdapter;
import com.codder.ultimate.live.adapter.StickerAdapter;
import com.codder.ultimate.live.model.StickerRoot;
import com.codder.ultimate.modelclass.UserRoot;

import org.json.JSONObject;

public class HostLiveViewModel extends ViewModel {

    public static final String TAG = "HostLiveViewModel";

    public StickerAdapter stickerAdapter = new StickerAdapter();
    public LiveViewUserAdapter liveViewUserAdapter = new LiveViewUserAdapter();
    public LiveStramCommentAdapter liveStramCommentAdapter = new LiveStramCommentAdapter();

    // F4: Static in-memory cache that survives Activity finish() on background-minimize (`Keep`).
    // Populated just before finish() when isHostKeep=true; cleared on a real exit.
    @androidx.annotation.Nullable
    private static java.util.ArrayList<com.codder.ultimate.live.model.LiveStramComment> commentCache = null;

    /** Snapshot the adapter's current list into the static cache. */
    public static void saveCommentCache(@androidx.annotation.NonNull java.util.List<com.codder.ultimate.live.model.LiveStramComment> comments) {
        commentCache = new java.util.ArrayList<>(comments);
    }

    /** True when there is a saved cache to restore. */
    public static boolean hasCommentCache() {
        return commentCache != null && !commentCache.isEmpty();
    }

    /** Returns the cached list and clears it so it is only consumed once. */
    @androidx.annotation.NonNull
    public static java.util.ArrayList<com.codder.ultimate.live.model.LiveStramComment> popCommentCache() {
        java.util.ArrayList<com.codder.ultimate.live.model.LiveStramComment> copy =
                commentCache != null ? commentCache : new java.util.ArrayList<>();
        commentCache = null;
        return copy;
    }

    /** Discard any saved cache (called on a proper room exit). */
    public static void clearCommentCache() {
        commentCache = null;
    }
    public MutableLiveData<Boolean> isShowFilterSheet = new MutableLiveData<>(false);
    public MutableLiveData<StickerRoot.StickerItem> selectedSticker = new MutableLiveData<StickerRoot.StickerItem>();
    public MutableLiveData<UserRoot.User> clickedComment = new MutableLiveData<UserRoot.User>();
    public MutableLiveData<JSONObject> clickedUser = new MutableLiveData<>();
    public boolean isMuted = false;
    public LiveViewAdapter liveViewAdapter = new LiveViewAdapter();

    public void onClickSheetClose() {
        isShowFilterSheet.setValue(false);
    }

    public void initLister() {
        stickerAdapter.setOnStickerClickListener(filterRoot -> {
            Log.d(TAG + " viewmodel", "onBindViewHolder: ===========" + filterRoot.getSticker());
            selectedSticker.setValue(filterRoot);
        });
        liveStramCommentAdapter.setOnCommentClickListener((UserRoot.User userDummy) -> clickedComment.setValue(userDummy));
        liveViewUserAdapter.setOnLiveUserAdapterClickListener((JSONObject userDummy) -> clickedUser.setValue(userDummy));
        liveViewAdapter.setOnLiveUserAdapterClickListener(userDummy -> clickedUser.setValue(userDummy));
    }
}