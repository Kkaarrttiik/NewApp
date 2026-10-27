package com.codder.ultimate.country;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.codder.ultimate.R;

import java.util.ArrayList;
import java.util.List;

public class CountryPickerAdapter extends RecyclerView.Adapter<CountryPickerAdapter.ViewHolder> {

    private final Context context;
    private final List<CountryModel> originalList;
    private final List<CountryModel> displayList;
    private String selectedCountryName = "";
    private OnCountrySelectedListener listener;

    public interface OnCountrySelectedListener {
        void onCountrySelected(CountryModel country);
    }

    public CountryPickerAdapter(Context context, List<CountryModel> countryList, String selectedCountryName, OnCountrySelectedListener listener) {
        this.context = context;
        this.originalList = new ArrayList<>(countryList);
        this.displayList = new ArrayList<>(countryList);
        this.selectedCountryName = selectedCountryName != null ? selectedCountryName : "";
        this.listener = listener;
    }

    public void filter(String query) {
        displayList.clear();
        if (query == null || query.trim().isEmpty()) {
            displayList.addAll(originalList);
        } else {
            String lower = query.trim().toLowerCase();
            for (CountryModel model : originalList) {
                if (model.getName() != null && model.getName().toLowerCase().contains(lower)) {
                    displayList.add(model);
                }
            }
        }
        notifyDataSetChanged();
    }

    public void setSelectedCountryName(String selectedCountryName) {
        this.selectedCountryName = selectedCountryName != null ? selectedCountryName : "";
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_country_picker, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        CountryModel country = displayList.get(position);
        holder.tvFlag.setText(country.getFlag());
        holder.tvCountryName.setText(country.getName());

        boolean isSelected = country.getName() != null && country.getName().equalsIgnoreCase(selectedCountryName);
        holder.ivCheck.setVisibility(isSelected ? View.VISIBLE : View.GONE);

        holder.itemView.setOnClickListener(v -> {
            if (listener != null) {
                listener.onCountrySelected(country);
            }
        });
    }

    @Override
    public int getItemCount() {
        return displayList.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView tvFlag;
        TextView tvCountryName;
        ImageView ivCheck;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            tvFlag = itemView.findViewById(R.id.tvFlag);
            tvCountryName = itemView.findViewById(R.id.tvCountryName);
            ivCheck = itemView.findViewById(R.id.ivCheck);
        }
    }
}
