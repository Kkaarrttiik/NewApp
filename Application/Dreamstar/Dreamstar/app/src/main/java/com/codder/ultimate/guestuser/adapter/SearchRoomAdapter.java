package com.codder.ultimate.guestuser.adapter;

import android.view.LayoutInflater;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.DiffUtil;
import androidx.recyclerview.widget.ListAdapter;
import androidx.recyclerview.widget.RecyclerView;
import com.bumptech.glide.Glide;
import com.bumptech.glide.load.resource.bitmap.CircleCrop;
import com.codder.ultimate.databinding.ItemSearchRoomBinding;
import com.codder.ultimate.live.model.PkAudioLiveUserRoot;

/**
 * F5B: Adapter for room search results in SearchActivity.
 */
public class SearchRoomAdapter extends ListAdapter<PkAudioLiveUserRoot.UsersItem, SearchRoomAdapter.RoomViewHolder> {

    public interface OnRoomClickListener {
        void onJoinClick(PkAudioLiveUserRoot.UsersItem room);
    }

    private OnRoomClickListener listener;

    public SearchRoomAdapter() {
        super(DIFF_CALLBACK);
    }

    public void setOnRoomClickListener(OnRoomClickListener l) {
        this.listener = l;
    }

    private static final DiffUtil.ItemCallback<PkAudioLiveUserRoot.UsersItem> DIFF_CALLBACK =
            new DiffUtil.ItemCallback<PkAudioLiveUserRoot.UsersItem>() {
                @Override
                public boolean areItemsTheSame(@NonNull PkAudioLiveUserRoot.UsersItem a,
                                               @NonNull PkAudioLiveUserRoot.UsersItem b) {
                    return a.getId() != null && a.getId().equals(b.getId());
                }
                @Override
                public boolean areContentsTheSame(@NonNull PkAudioLiveUserRoot.UsersItem a,
                                                  @NonNull PkAudioLiveUserRoot.UsersItem b) {
                    return a.getId() != null && a.getId().equals(b.getId());
                }
            };

    @NonNull
    @Override
    public RoomViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemSearchRoomBinding binding = ItemSearchRoomBinding.inflate(
                LayoutInflater.from(parent.getContext()), parent, false);
        return new RoomViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull RoomViewHolder holder, int position) {
        holder.bind(getItem(position));
    }

    public class RoomViewHolder extends RecyclerView.ViewHolder {
        private final ItemSearchRoomBinding binding;

        public RoomViewHolder(@NonNull ItemSearchRoomBinding b) {
            super(b.getRoot());
            this.binding = b;
        }

        public void bind(PkAudioLiveUserRoot.UsersItem room) {
            // Room name (fallback to owner name)
            String displayName = (room.getRoomName() != null && !room.getRoomName().isEmpty())
                    ? room.getRoomName() : room.getName();
            binding.tvRoomName.setText(displayName != null ? displayName : "");
            binding.tvOwnerName.setText(room.getName() != null ? "@" + room.getName() : "");
            binding.tvViewers.setText(String.valueOf(room.getViewCount()));

            // Room image (fallback to owner avatar)
            String img = (room.getRoomImage() != null && !room.getRoomImage().isEmpty())
                    ? room.getRoomImage() : room.getImage();
            if (img != null && !img.isEmpty()) {
                Glide.with(binding.getRoot().getContext())
                        .load(img)
                        .transform(new CircleCrop())
                        .placeholder(com.codder.ultimate.R.drawable.place_holder)
                        .into(binding.ivRoom);
            }

            binding.btnJoin.setOnClickListener(v -> {
                if (listener != null) listener.onJoinClick(room);
            });
            binding.getRoot().setOnClickListener(v -> {
                if (listener != null) listener.onJoinClick(room);
            });
        }
    }
}
