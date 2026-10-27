package com.codder.ultimate.live.bottomsheet;

import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.databinding.DataBindingUtil;
import androidx.recyclerview.widget.DiffUtil;
import androidx.recyclerview.widget.ListAdapter;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.resource.bitmap.CircleCrop;
import com.codder.ultimate.R;
import com.codder.ultimate.SessionManager;
import com.codder.ultimate.databinding.BottomsheetInviteFriendsBinding;
import com.codder.ultimate.databinding.ItemInviteFriendBinding;
import com.codder.ultimate.live.model.PkAudioLiveUserRoot;
import com.codder.ultimate.modelclass.GuestProfileRoot;
import com.codder.ultimate.modelclass.GuestUsersListRoot;
import com.codder.ultimate.retrofit.Const;
import com.codder.ultimate.retrofit.RetrofitBuilder;
import com.codder.ultimate.socket.MySocketManager;
import com.google.android.material.bottomsheet.BottomSheetDialog;
import com.google.gson.JsonObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.HashSet;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * F9: Bottom sheet that shows mutual followers so the user can invite them to the room.
 */
public class InviteFriendsBottomSheet {

    private static final String TAG = "InviteFriendsBS";
    private final BottomSheetDialog dialog;

    public InviteFriendsBottomSheet(Context context,
                                    PkAudioLiveUserRoot.UsersItem host,
                                    SessionManager sessionManager) {
        dialog = new BottomSheetDialog(context, R.style.CustomBottomSheetDialogTheme);
        dialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);

        BottomsheetInviteFriendsBinding binding = DataBindingUtil.inflate(
                LayoutInflater.from(context),
                R.layout.bottomsheet_invite_friends,
                null, false);
        dialog.setContentView(binding.getRoot());
        dialog.show();

        // Track already-invited users in this session
        Set<String> invited = new HashSet<>();

        FriendAdapter adapter = new FriendAdapter(friend -> {
            String friendId = friend.getId() != null ? friend.getId() : "";
            if (invited.contains(friendId)) {
                Toast.makeText(context, "Already invited", Toast.LENGTH_SHORT).show();
                return;
            }
            invited.add(friendId);

            // Emit via globalRoom socket so the friend receives a notification
            JsonObject payload = new JsonObject();
            payload.addProperty("fromUserId", sessionManager.getUser().getId());
            payload.addProperty("fromUserName", sessionManager.getUser().getName());
            payload.addProperty("fromUserImage", sessionManager.getUser().getImage());
            payload.addProperty("toUserId", friendId);
            payload.addProperty("liveStreamingId", host.getLiveStreamingId());
            payload.addProperty("liveUserId", host.getLiveUserId());
            payload.addProperty("channel", host.getChannel());
            payload.addProperty("roomName", host.getRoomName() != null ? host.getRoomName() : host.getName());
            MySocketManager.getInstance().getSocket().emit("roomInviteToFriend", payload);

            Toast.makeText(context, "Invite sent to " + friend.getName(), Toast.LENGTH_SHORT).show();
        });

        binding.rvFriends.setAdapter(adapter);

        // Fetch mutual followers
        String myId = sessionManager.getUser() != null ? sessionManager.getUser().getId() : "";
        RetrofitBuilder.create().getMutualFollowers(myId, 0, 50)
                .enqueue(new Callback<GuestUsersListRoot>() {
                    @Override
                    public void onResponse(Call<GuestUsersListRoot> call, Response<GuestUsersListRoot> response) {
                        if (response.isSuccessful() && response.body() != null
                                && response.body().getUser() != null) {
                            List<GuestProfileRoot.User> list = response.body().getUser();
                            if (list.isEmpty()) {
                                binding.tvNoFriends.setVisibility(View.VISIBLE);
                            } else {
                                binding.tvNoFriends.setVisibility(View.GONE);
                                adapter.submitList(new ArrayList<>(list));
                            }
                        } else {
                            binding.tvNoFriends.setVisibility(View.VISIBLE);
                        }
                    }

                    @Override
                    public void onFailure(Call<GuestUsersListRoot> call, Throwable t) {
                        Log.e(TAG, "getMutualFollowers failed", t);
                        binding.tvNoFriends.setVisibility(View.VISIBLE);
                    }
                });
    }

    public void show() {
        if (!dialog.isShowing()) dialog.show();
    }

    // ── Inner adapter ─────────────────────────────────────────────────────────

    interface OnInviteClick {
        void onInvite(GuestProfileRoot.User friend);
    }

    static class FriendAdapter extends ListAdapter<GuestProfileRoot.User, FriendAdapter.VH> {

        private final OnInviteClick listener;

        FriendAdapter(OnInviteClick l) {
            super(new DiffUtil.ItemCallback<GuestProfileRoot.User>() {
                @Override
                public boolean areItemsTheSame(@NonNull GuestProfileRoot.User a, @NonNull GuestProfileRoot.User b) {
                    return a.getId() != null && a.getId().equals(b.getId());
                }
                @Override
                public boolean areContentsTheSame(@NonNull GuestProfileRoot.User a, @NonNull GuestProfileRoot.User b) {
                    return a.getId() != null && a.getId().equals(b.getId());
                }
            });
            this.listener = l;
        }

        @NonNull
        @Override
        public VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            ItemInviteFriendBinding b = ItemInviteFriendBinding.inflate(
                    LayoutInflater.from(parent.getContext()), parent, false);
            return new VH(b);
        }

        @Override
        public void onBindViewHolder(@NonNull VH holder, int position) {
            holder.bind(getItem(position));
        }

        class VH extends RecyclerView.ViewHolder {
            final ItemInviteFriendBinding binding;
            VH(ItemInviteFriendBinding b) { super(b.getRoot()); binding = b; }

            void bind(GuestProfileRoot.User friend) {
                binding.tvName.setText(friend.getName() != null ? friend.getName() : "");
                if (friend.getImage() != null && !friend.getImage().isEmpty()) {
                    Glide.with(binding.getRoot().getContext())
                            .load(friend.getImage())
                            .transform(new CircleCrop())
                            .placeholder(R.drawable.place_holder)
                            .into(binding.ivFriend);
                }
                binding.btnInvite.setOnClickListener(v -> listener.onInvite(friend));
            }
        }
    }
}
