package com.codder.ultimate.fragments;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.databinding.DataBindingUtil;
import androidx.lifecycle.ViewModelProvider;

import com.codder.ultimate.MyLoader;
import com.codder.ultimate.R;
import com.codder.ultimate.activity.MainActivity;
import com.codder.ultimate.chat.activity.ChatActivity;
import com.codder.ultimate.chat.activity.FakeChatActivity;
import com.codder.ultimate.chat.adapter.ChatUserAdapter;
import com.codder.ultimate.chat.modelclass.ChatUserListRoot;
import com.codder.ultimate.chat.viewmodel.MessageViewModel;
import com.codder.ultimate.chat.viewmodel.MessageViewModelFactory;
import com.codder.ultimate.databinding.FragmentMessageBinding;
import com.codder.ultimate.live.model.BlockedUserResponse;
import com.codder.ultimate.popups.PopupBuilder;
import com.codder.ultimate.profile.activity.ProfileActivity;
import com.codder.ultimate.retrofit.Const;
import com.codder.ultimate.retrofit.RetrofitBuilder;
import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MessageFragment extends BaseFragment {

    private static final String TAG = "MessageFragment";
    private FragmentMessageBinding binding;
    private ChatUserAdapter chatUserAdapter;
    private MessageViewModel viewModel;
    private MyLoader myLoader;
    private boolean firstResumeDone = false;

    private boolean isCheckingBlock = false;

    private final Handler blockSyncHandler = new Handler(Looper.getMainLooper());
    private final Runnable blockSyncRunnable = new Runnable() {
        @Override
        public void run() {
            if (isAdded() && viewModel != null) {
                viewModel.syncBlockedUsers();
                blockSyncHandler.postDelayed(this, 10000);
            }
        }
    };

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        binding = DataBindingUtil.inflate(inflater, R.layout.fragment_message, container, false);
        myLoader = new MyLoader();
        binding.setMyLoder(myLoader);

        viewModel = new ViewModelProvider(this, new MessageViewModelFactory(requireContext())).get(MessageViewModel.class);
        chatUserAdapter = new ChatUserAdapter();

        setupUI();
        observeViewModel();

        viewModel.fetchChatUsers(false);
        return binding.getRoot();
    }

    private void setupUI() {
        binding.rvMessage.setAdapter(chatUserAdapter);

        binding.ivProfile.setOnClickListener(v -> {
            ((MainActivity) getActivity()).openProfileFragment();
        });

        chatUserAdapter.setOnClickListener((position, user) -> {
            if (user == null) return;

            if (user.isFake()) {
                Intent intent = new Intent(requireContext(), FakeChatActivity.class);
                intent.putExtra(Const.CHATROOM, new Gson().toJson(user));
                Log.d(TAG, "setupUI fake:  ---> " + new Gson().toJson(user));
                startActivity(intent);
                return;
            }

            if (isCheckingBlock) {
                return;
            }

            // Real-time verification with getUsersWhoBlockedMe without loader dialog
            checkBlockStatusAndOpenChat(user);
        });

        binding.swipeRefresh.setOnRefreshListener(refresh -> {
            viewModel.isRefreshing.setValue(true);
            viewModel.fetchChatUsers(false);
        });
        binding.swipeRefresh.setOnLoadMoreListener(refresh -> {
            viewModel.isRefreshing.setValue(false);
            viewModel.fetchChatUsers(true);
        });

        binding.layDeleteChat.setOnClickListener(v -> showDeleteDialog());

        myLoader.isFirstTimeLoading.set(true);
    }

    private void checkBlockStatusAndOpenChat(ChatUserListRoot.ChatUserItem user) {
        if (getActivity() == null || getActivity().isFinishing()) return;
        if (sessionManager == null || sessionManager.getUser() == null) return;

        isCheckingBlock = true;

        RetrofitBuilder.create().getUsersWhoBlockedMe(sessionManager.getUser().getId())
                .enqueue(new Callback<BlockedUserResponse>() {
                    @Override
                    public void onResponse(@NonNull Call<BlockedUserResponse> call, @NonNull Response<BlockedUserResponse> response) {
                        isCheckingBlock = false;
                        if (getActivity() == null || getActivity().isFinishing()) return;

                        if (response.isSuccessful() && response.body() != null) {
                            List<BlockedUserResponse.BlockedByUsersItem> blockedUsers = response.body().getBlockedByUsers();
                            List<String> tempBlockedIds = new ArrayList<>();
                            if (blockedUsers != null) {
                                for (BlockedUserResponse.BlockedByUsersItem item : blockedUsers) {
                                    if (item != null && item.getUserId() != null && item.getUserId().getId() != null) {
                                        tempBlockedIds.add(item.getUserId().getId());
                                    }
                                }
                            }
                            sessionManager.setBlockedUserIds(tempBlockedIds);
                            viewModel.filterOutBlockedUsers(tempBlockedIds);

                            if (tempBlockedIds.contains(user.getUserId())) {
                                Toast.makeText(requireContext(), R.string.the_user_has_blocked_you, Toast.LENGTH_SHORT).show();
                                viewModel.removeUserById(user.getUserId());
                                return;
                            }
                        }

                        Intent intent = new Intent(requireContext(), ChatActivity.class);
                        intent.putExtra(Const.CHATROOM, new Gson().toJson(user));
                        Log.d(TAG, "setupUI real:  ---> " + new Gson().toJson(user));
                        startActivity(intent);
                    }

                    @Override
                    public void onFailure(@NonNull Call<BlockedUserResponse> call, @NonNull Throwable t) {
                        isCheckingBlock = false;
                        if (getActivity() == null || getActivity().isFinishing()) return;

                        Intent intent = new Intent(requireContext(), ChatActivity.class);
                        intent.putExtra(Const.CHATROOM, new Gson().toJson(user));
                        startActivity(intent);
                    }
                });
    }

    private void observeViewModel() {
        viewModel.chatUsers.observe(getViewLifecycleOwner(), users -> {
            Log.d("MessageFragment", "User list size: " + (users != null ? users.size() : 0));

            if (users != null) {
                chatUserAdapter.submitList(new ArrayList<>(users));
                binding.layDeleteChat.setVisibility(!users.isEmpty() ? View.VISIBLE : View.GONE);
            }

            if (users != null && !users.isEmpty()) {
                myLoader.isFirstTimeLoading.set(false);
                myLoader.noData.set(false);
            } else {
                myLoader.noData.set(true);
            }
        });

        viewModel.isNoData.observe(getViewLifecycleOwner(), noData -> {
            myLoader.noData.set(noData);
            myLoader.isFirstTimeLoading.set(false);
        });

        viewModel.isLoading.observe(getViewLifecycleOwner(), loading -> {
            if (loading) {
                boolean shouldShowShimmer = chatUserAdapter.getItemCount() == 0;

                myLoader.isFirstTimeLoading.set(shouldShowShimmer);

            } else {
                binding.swipeRefresh.finishRefresh();
                binding.swipeRefresh.finishLoadMore();

                myLoader.isFirstTimeLoading.set(false);
            }
        });

        viewModel.messageToast.observe(getViewLifecycleOwner(), message -> {
            if (message != null && !message.isEmpty()) {
                Toast.makeText(requireContext(), message, Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void showDeleteDialog() {
        new PopupBuilder(requireContext()).showDeleteChatPopup(R.drawable.ic_delete_popup,"Confirm Deletion",getString(R.string.delete_confirmation_text),getString(R.string.delete), getString(R.string.cancel), new PopupBuilder.OnPopupClickListener(){

            @Override
            public void onClickContinue() {
                viewModel.deleteAllChats();
            }
        });
    }

    @Override
    public void onResume() {
        super.onResume();
        if (getActivity() != null && !getActivity().isFinishing()
                && sessionManager != null
                && sessionManager.getUser() != null) {
            binding.ivProfile.setHomeUserImage(
                    sessionManager.getUser().getImage(),
                    sessionManager.getUser().getAvatarFrameImage(),
                    20
            );
        }

        if (firstResumeDone && (viewModel.isLoading.getValue() == null || !viewModel.isLoading.getValue())) {
            viewModel.fetchChatUsers(false);
        }
        firstResumeDone = true;

        blockSyncHandler.removeCallbacks(blockSyncRunnable);
        blockSyncHandler.post(blockSyncRunnable);
    }

    @Override
    public void onPause() {
        super.onPause();
        isCheckingBlock = false;
        blockSyncHandler.removeCallbacks(blockSyncRunnable);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        isCheckingBlock = false;
        blockSyncHandler.removeCallbacks(blockSyncRunnable);
    }
}