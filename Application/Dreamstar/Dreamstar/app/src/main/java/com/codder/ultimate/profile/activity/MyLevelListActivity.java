package com.codder.ultimate.profile.activity;

import static android.view.View.GONE;
import static android.view.View.VISIBLE;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.databinding.DataBindingUtil;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.bumptech.glide.Glide;
import com.codder.ultimate.BuildConfig;
import com.codder.ultimate.R;
import com.codder.ultimate.RayziUtils;
import com.codder.ultimate.activity.BaseActivity;
import com.codder.ultimate.profile.adapter.LevelsAdapter;
import com.codder.ultimate.databinding.ActivityMyLevelListBinding;
import com.codder.ultimate.profile.modelclass.LevelRoot;
import com.codder.ultimate.modelclass.UserRoot;
import com.codder.ultimate.retrofit.Const;
import com.codder.ultimate.retrofit.RetrofitBuilder;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MyLevelListActivity extends BaseActivity {

    public static final String TAG = "MyLevelListActivity";
    private ActivityMyLevelListBinding binding;

    private int start = 1;

    private boolean isLoading = false;
    private boolean isLastPage = false;

    LevelsAdapter adapter;

    public List<LevelRoot.LevelItem> levelList = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = DataBindingUtil.setContentView(this, R.layout.activity_my_level_list);

        setupUI();

        adapter = new LevelsAdapter(levelList);
        binding.rvFeed.setLayoutManager(new LinearLayoutManager(this));
        binding.rvFeed.setAdapter(adapter);

        binding.swipeRefresh.setOnRefreshListener(refreshLayout -> {
            fetchLevels(false);
        });
        binding.swipeRefresh.setOnLoadMoreListener(refreshLayout -> {
            fetchLevels(true);
        });

        fetchLevels(false);
    }

    private void setupUI() {
        UserRoot.User currentUser = sessionManager.getUser();
        if (currentUser != null && currentUser.getLevel() != null) {
            Glide.with(this)
                    .load(BuildConfig.BASE_URL + currentUser.getLevel().getImage())
                    .placeholder(R.drawable.placeholder)  // optional fallback
                    .into(binding.myLevelImage);

            binding.tvMyLevel.setText(String.valueOf(currentUser.getLevel().getName()));

            Log.d(TAG, "setupUI: ====" + currentUser.getSpentCoin());

            String formattedCoins = RayziUtils.formatCoin(currentUser.getSpentCoin());
            String coinsText;
            try {
                coinsText = getString(R.string.you_ve_spent_s, formattedCoins + " " + Const.DIAMOND);
            } catch (Exception e) {
                coinsText = formattedCoins + " " + Const.DIAMOND;
            }
            binding.tvSpentCoin.setText(coinsText);

        } else {
            binding.tvMyLevel.setText(getString(R.string.no_level_available));
            binding.tvSpentCoin.setText("");
        }

        binding.rvFeed.setLayoutManager(new LinearLayoutManager(this));
    }

    private void fetchLevels(boolean isLoadMore) {

        if (isLoading) return;
        isLoading = true;
        if (isLoadMore) {
//            start += Const.LIMIT;
            start++;
        } else {
            start = 1;
            isLastPage = false;
            levelList.clear();
            adapter.notifyDataSetChanged();
        }
        if (!isLoadMore) binding.shimmer.setVisibility(VISIBLE);


//        showLoading(true);

        RetrofitBuilder.create().getLevels(start,Const.LIMIT).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<LevelRoot> call, @NonNull Response<LevelRoot> response) {
                isLoading = false;
                binding.swipeRefresh.finishRefresh();
                binding.swipeRefresh.finishLoadMore();
                if (response.isSuccessful() && response.body() != null) {
                    binding.shimmer.setVisibility(GONE);
                    LevelRoot levelRoot = response.body();

                    if (levelRoot.isStatus() && levelRoot.getLevel() != null && !levelRoot.getLevel().isEmpty()) {
                        List<LevelRoot.LevelItem> newData = levelRoot.getLevel();
                        if (newData == null) newData = new ArrayList<>();

                        if (isLoadMore) {
                            // Append data
                            levelList.addAll(newData);
                        } else {
                            levelList.clear();
                            levelList.addAll(newData);
                        }

                        adapter.notifyDataSetChanged();
                        binding.rvFeed.setVisibility(View.VISIBLE);

//                        if (levelList.isEmpty()) {
//                            binding.layoutNoData.setVisibility(VISIBLE);
//                        } else {
//                            binding.layoutNoData.setVisibility(GONE);
//                        }

                        if (newData.size() < Const.LIMIT) {
                            isLastPage = true;
                        }

                    } else {
                        // Empty list case
                        if (isLoadMore) {
                            // Just mark as last page, don’t clear existing data
                            isLastPage = true;
                        } else {
                            // First page and empty
                            levelList.clear();
                            adapter.notifyDataSetChanged();
                            showErrorState("No levels available");
                        }
                    }
                } else {
                    isLastPage = true;
                    showErrorState("Failed to load data");
                }
            }

            @Override
            public void onFailure(@NonNull Call<LevelRoot> call, @NonNull Throwable t) {
                isLastPage = true;
                Log.e(TAG, "Error fetching levels", t);
                showErrorState("Something went wrong: " + t.getLocalizedMessage());
            }
        });
    }

    private void showLoading(boolean loading) {
        if (loading) {
            binding.shimmer.setVisibility(View.VISIBLE);
            binding.shimmer.startShimmer();

            binding.rvFeed.setVisibility(View.GONE);
        } else {
            binding.shimmer.stopShimmer();
            binding.shimmer.setVisibility(View.GONE);

            binding.rvFeed.setVisibility(View.VISIBLE);
        }
    }

    private void showErrorState(String message) {
        binding.shimmer.stopShimmer();
        binding.shimmer.setVisibility(View.GONE);
        binding.rvFeed.setVisibility(View.GONE);
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }

}
