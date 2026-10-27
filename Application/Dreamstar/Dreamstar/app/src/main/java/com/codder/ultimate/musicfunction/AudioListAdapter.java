package com.codder.ultimate.musicfunction;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.codder.ultimate.R;
import com.codder.ultimate.databinding.ItemAudiolistBinding;

import java.util.ArrayList;
import java.util.List;

public class AudioListAdapter extends RecyclerView.Adapter<AudioListAdapter.MyViewHolder> {

    private final List<AudioDetails> audioFiles;
    private final List<AudioDetails> selectedFiles = new ArrayList<>();
    private final SelectionChangedListener selectionChangedListener;

    public interface SelectionChangedListener {
        void onSelectionChanged(int selectedCount);
    }

    public AudioListAdapter(List<AudioDetails> audioFiles, SelectionChangedListener listener) {
        this.audioFiles = audioFiles;
        this.selectionChangedListener = listener;
    }

    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_audiolist, parent, false);
        return new MyViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull MyViewHolder holder, int position) {
        AudioDetails audioDetails = audioFiles.get(position);

        holder.binding.audioTitle.setText(audioDetails.getName());
        holder.binding.audioInfo.setText(audioDetails.getDuration());

        Glide.with(holder.itemView.getContext())
                .load(audioDetails.getThumbnailPath())
                .placeholder(R.drawable.ic_music)
                .into(holder.binding.albumArt);

        if (selectedFiles.contains(audioDetails)) {
            holder.binding.ivSelectUnselect.setImageDrawable(ContextCompat.getDrawable(holder.itemView.getContext(), R.drawable.music_selected));
        } else {
            holder.binding.ivSelectUnselect.setImageDrawable(ContextCompat.getDrawable(holder.itemView.getContext(), R.drawable.music_unselected));
        }

        holder.itemView.setOnClickListener(v -> {
            if (selectedFiles.contains(audioDetails)) {
                // Deselect the item
                selectedFiles.remove(audioDetails);
            } else {
                // Select the item
                selectedFiles.add(audioDetails);
            }
            // Notify the adapter to update the UI
            notifyItemChanged(position);
            if (selectionChangedListener != null) {
                selectionChangedListener.onSelectionChanged(selectedFiles.size());
            }
        });
    }

    public void selectAllFiles() {
        selectedFiles.clear();
        selectedFiles.addAll(audioFiles);
        notifyDataSetChanged();
    }

    public void clearSelectedFiles() {
        selectedFiles.clear();
        notifyDataSetChanged();
    }

    @Override
    public int getItemCount() {
        return audioFiles.size();
    }

    public class MyViewHolder extends RecyclerView.ViewHolder {
        ItemAudiolistBinding binding;
        public MyViewHolder(@NonNull View itemView) {
            super(itemView);
            binding = ItemAudiolistBinding.bind(itemView);
        }
    }

    public List<AudioDetails> getSelectedFiles() {
        return new ArrayList<>(selectedFiles);
    }
}
