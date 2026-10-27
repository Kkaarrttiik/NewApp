package com.codder.ultimate.live.bottomsheet;

import android.content.Context;
import android.view.LayoutInflater;

import android.view.View;

import androidx.databinding.DataBindingUtil;

import com.codder.ultimate.R;
import com.codder.ultimate.databinding.BottomSheetViewersOnlineBinding;
import com.codder.ultimate.live.adapter.AudioUsersAdapter;
import com.google.android.material.bottomsheet.BottomSheetDialog;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class BottomSheetViewersUsers {

    public AudioUsersAdapter liveViewUserAdapter = new AudioUsersAdapter();
    BottomSheetDialog bottomSheetDialog;
    Context context;

    public BottomSheetViewersUsers(Context context, JSONArray list, OnClickListener onClickListener) {
        bottomSheetDialog = new BottomSheetDialog(context, R.style.CustomBottomSheetDialogTheme);
        this.context = context;

        bottomSheetDialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);

        BottomSheetViewersOnlineBinding sheetDialogBinding = DataBindingUtil.inflate(LayoutInflater.from(context), R.layout.bottom_sheet_viewers_online, null, false);

        bottomSheetDialog.setContentView(sheetDialogBinding.getRoot());
        bottomSheetDialog.show();

        sheetDialogBinding.rvViewUsers.setAdapter(liveViewUserAdapter);

        liveViewUserAdapter.setOnLiveUserAdapterClickListener(userDummy -> {
            onClickListener.OnItemClick(userDummy);
            bottomSheetDialog.dismiss();
        });

        List<JSONObject> userList = new ArrayList<>();
        if (list != null) {
            for (int i = 0; i < list.length(); i++) {
                try {
                    userList.add(list.getJSONObject(i));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }
        liveViewUserAdapter.submitList(userList);

        if (userList.isEmpty()) {
            sheetDialogBinding.lytNoData.getRoot().setVisibility(View.VISIBLE);
            sheetDialogBinding.rvViewUsers.setVisibility(View.GONE);
        } else {
            sheetDialogBinding.lytNoData.getRoot().setVisibility(View.GONE);
            sheetDialogBinding.rvViewUsers.setVisibility(View.VISIBLE);
        }
    }

    public interface OnClickListener {
        void OnItemClick(JSONObject userDummy);
    }

}
