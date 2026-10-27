package com.codder.ultimate.activity;

import android.content.Intent;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.PickVisualMediaRequest;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;
import androidx.databinding.DataBindingUtil;

import com.bumptech.glide.Glide;
import com.codder.ultimate.R;
import com.codder.ultimate.country.CountryArray;
import com.codder.ultimate.country.CountryModel;
import com.codder.ultimate.country.CountryPickerAdapter;
import com.codder.ultimate.databinding.ActivityEditProfileBinding;
import com.codder.ultimate.modelclass.IpAddressRoot_e;
import com.codder.ultimate.modelclass.UserRoot;
import com.codder.ultimate.retrofit.Const;
import com.codder.ultimate.retrofit.RetrofitBuilder;
import com.google.android.material.bottomsheet.BottomSheetBehavior;
import com.google.android.material.bottomsheet.BottomSheetDialog;

import android.view.LayoutInflater;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageView;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;

import com.google.gson.Gson;
import androidx.annotation.NonNull;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class EditProfileActivity extends BaseActivity {

    private static final String TAG = "EditProfileActivity";
    ActivityEditProfileBinding binding;
    private static final int GALLERY_CODE_PROFILE = 1001;
    private static final int GALLERY_CODE_COVER = 1002;
    private UserRoot.User user;
    private String gender = Const.MALE;
    private String picturePath = "";
    private String coverPhotoPath = "";
    String name;
    private String selectedCountry = "";
    private boolean isUserManuallyChangedCountry = false;

    private boolean isFirstTime = false;

    private ActivityResultLauncher<PickVisualMediaRequest> pickProfileImageLauncher;
    private ActivityResultLauncher<PickVisualMediaRequest> pickCoverImageLauncher;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = DataBindingUtil.setContentView(this, R.layout.activity_edit_profile);

        user = sessionManager.getUser();
        if (user == null) {
            Toast.makeText(this, getString(R.string.user_data_not_found_please_login_again), Toast.LENGTH_SHORT).show();
            finishAffinity();
            return;
        }

        isFirstTime = getIntent().getBooleanExtra("is_new_user", !sessionManager.getBooleanValue(Const.IS_LOGIN));

        setupUI();
        setupListeners();

    }

    private void setupUI() {
        binding.pd1.setVisibility(View.GONE);

        binding.imgUser.setUserImage(user.getImage(),"",5);

        binding.etName.setText(capitalize(safe(user.getName())));
        binding.etBio.setText(capitalize(safe(user.getBio())));

        binding.etUserName.setText(safe(user.getUniqueId()));
        binding.etAge.setText(String.valueOf(user.getAge()));

        initCountry();

        if (isFirstTime) {
            binding.ivCountryDropdown.setVisibility(View.VISIBLE);
            binding.lytCountry.setAlpha(1.0f);
        } else {
            binding.ivCountryDropdown.setVisibility(View.GONE);
            binding.lytCountry.setAlpha(0.75f);
        }

        binding.etName.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                name = s.toString();
            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        });

        if (Const.FEMALE.equalsIgnoreCase(user.getGender())) {
            selectFemale();
        } else {
            selectMale();
        }

        pickProfileImageLauncher = registerForActivityResult(
                new ActivityResultContracts.PickVisualMedia(),
                uri -> {
                    if (uri != null) {
                        picturePath = copyUriToInternalStorage(uri, ".jpg");
                        binding.imgUser.setUserImage(String.valueOf(uri),"",5);
                    }
                }
        );

        pickCoverImageLauncher = registerForActivityResult(
                new ActivityResultContracts.PickVisualMedia(),
                uri -> {
                    if (uri != null) {
                        coverPhotoPath = copyUriToInternalStorage(uri, ".jpg");
                    }
                }
        );

    }

    private void initCountry() {
        String currentCountry = "";
        String currentCode = "";

        if (isFirstTime) {
            // First priority when creating profile: country from IP API
            currentCountry = sessionManager.getStringValue(Const.IP_COUNTRY);
            currentCode = sessionManager.getStringValue(Const.IP_COUNTRY_CODE);
            if (currentCountry == null || currentCountry.trim().isEmpty()) {
                currentCountry = sessionManager.getStringValue(Const.COUNTRY);
                currentCode = sessionManager.getStringValue(Const.COUNTRY_CODE);
            }
            if (currentCountry == null || currentCountry.trim().isEmpty()) {
                if (user != null && user.getCountry() != null && !user.getCountry().trim().isEmpty()) {
                    currentCountry = user.getCountry().trim();
                }
            }
        } else {
            // Existing user profile edit: load saved country previously chosen by user
            String userSelectedCountry = sessionManager.getStringValue(Const.USER_SELECTED_COUNTRY);
            String userSelectedCode = sessionManager.getStringValue(Const.USER_SELECTED_COUNTRY_CODE);
            if (userSelectedCountry != null && !userSelectedCountry.trim().isEmpty()) {
                currentCountry = userSelectedCountry.trim();
                currentCode = userSelectedCode != null ? userSelectedCode.trim() : "";
            } else if (user != null && user.getCountryFlagImage() != null && !user.getCountryFlagImage().trim().isEmpty()) {
                CountryModel model = CountryArray.findCountryModel(user.getCountryFlagImage());
                if (model != null && !model.getName().isEmpty()) {
                    currentCountry = model.getName();
                    currentCode = CountryArray.getCountryCodeFromFlag(model.getFlag());
                }
            }

            if (currentCountry.isEmpty() && user != null && user.getCountry() != null && !user.getCountry().trim().isEmpty()) {
                currentCountry = user.getCountry().trim();
            }

            if (currentCountry.isEmpty() && sessionManager.getStringValue(Const.COUNTRY) != null && !sessionManager.getStringValue(Const.COUNTRY).trim().isEmpty()) {
                currentCountry = sessionManager.getStringValue(Const.COUNTRY).trim();
                currentCode = sessionManager.getStringValue(Const.COUNTRY_CODE);
            }
        }

        if (currentCountry != null && !currentCountry.trim().isEmpty()) {
            setSelectedCountry(currentCountry.trim(), currentCode);
        } else if (isFirstTime) {
            fallbackToDeviceCountry();
            fetchCountryFromIp();
        } else {
            fallbackToDeviceCountry();
        }
    }

    private void fallbackToDeviceCountry() {
        if (selectedCountry.isEmpty()) {
            try {
                String deviceCountryCode = Locale.getDefault().getCountry();
                String deviceCountryName = Locale.getDefault().getDisplayCountry(Locale.ENGLISH);
                if (deviceCountryName != null && !deviceCountryName.trim().isEmpty()) {
                    setSelectedCountry(deviceCountryName.trim(), deviceCountryCode != null ? deviceCountryCode.trim() : "");
                } else if (deviceCountryCode != null && !deviceCountryCode.trim().isEmpty()) {
                    setSelectedCountry("", deviceCountryCode.trim());
                }
            } catch (Exception e) {
                Log.e(TAG, "fallbackToDeviceCountry error: " + e.getMessage());
            }
        }
    }

    private void fetchCountryFromIp() {
        RetrofitBuilder.getIp().getIp().enqueue(new Callback<IpAddressRoot_e>() {
            @Override
            public void onResponse(Call<IpAddressRoot_e> call, Response<IpAddressRoot_e> response) {
                if (response.isSuccessful() && response.body() != null && response.body().getCountry() != null && !response.body().getCountry().trim().isEmpty()) {
                    handleIpData(response.body());
                } else {
                    fetchCountryFromIpFallback();
                }
            }

            @Override
            public void onFailure(Call<IpAddressRoot_e> call, Throwable t) {
                Log.e(TAG, "fetchCountryFromIp primary failed: " + t.getMessage());
                fetchCountryFromIpFallback();
            }
        });
    }

    private void fetchCountryFromIpFallback() {
        OkHttpClient client = new OkHttpClient.Builder()
                .connectTimeout(5, java.util.concurrent.TimeUnit.SECONDS)
                .readTimeout(5, java.util.concurrent.TimeUnit.SECONDS)
                .build();

        Request request = new Request.Builder()
                .url("https://ipwho.is/")
                .header("User-Agent", "Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36")
                .build();

        client.newCall(request).enqueue(new okhttp3.Callback() {
            @Override
            public void onResponse(@NonNull okhttp3.Call call, @NonNull okhttp3.Response response) throws IOException {
                if (response.isSuccessful() && response.body() != null) {
                    try {
                        String json = response.body().string();
                        Gson gson = new Gson();
                        IpAddressRoot_e ipData = gson.fromJson(json, IpAddressRoot_e.class);
                        if (ipData != null && ipData.getCountry() != null && !ipData.getCountry().trim().isEmpty()) {
                            runOnUiThread(() -> handleIpData(ipData));
                            return;
                        }
                    } catch (Exception e) {
                        Log.e(TAG, "fallback json parse error: " + e.getMessage());
                    }
                }
                if (isFirstTime && selectedCountry.isEmpty()) {
                    runOnUiThread(() -> fallbackToDeviceCountry());
                }
            }

            @Override
            public void onFailure(@NonNull okhttp3.Call call, @NonNull IOException e) {
                Log.e(TAG, "fallback ip call failed: " + e.getMessage());
                if (isFirstTime && selectedCountry.isEmpty()) {
                    runOnUiThread(() -> fallbackToDeviceCountry());
                }
            }
        });
    }

    private void handleIpData(IpAddressRoot_e ipData) {
        if (ipData == null || ipData.getCountry() == null || ipData.getCountry().trim().isEmpty()) {
            if (isFirstTime && selectedCountry.isEmpty()) {
                fallbackToDeviceCountry();
            }
            return;
        }
        String ipCountry = ipData.getCountry().trim();
        String ipCountryCode = ipData.getCountryCode() != null ? ipData.getCountryCode().trim() : "";
        sessionManager.saveStringValue(Const.IP_COUNTRY, ipCountry);
        if (!ipCountryCode.isEmpty()) {
            sessionManager.saveStringValue(Const.IP_COUNTRY_CODE, ipCountryCode);
        }
        if (ipData.getCity() != null) {
            sessionManager.saveStringValue(Const.CURRENT_CITY, ipData.getCity());
        }
        if (isFirstTime && !isUserManuallyChangedCountry) {
            sessionManager.saveStringValue(Const.COUNTRY, ipCountry);
            if (!ipCountryCode.isEmpty()) {
                sessionManager.saveStringValue(Const.COUNTRY_CODE, ipCountryCode);
            }
            setSelectedCountry(ipCountry, ipCountryCode);
        }
    }

    private void setSelectedCountry(String countryName) {
        String code = sessionManager.getStringValue(Const.COUNTRY_CODE);
        setSelectedCountry(countryName, code);
    }

    private void setSelectedCountry(String countryName, String countryCode) {
        if ((countryName == null || countryName.trim().isEmpty()) && (countryCode == null || countryCode.trim().isEmpty())) {
            return;
        }

        CountryModel model = null;
        if (countryName != null && !countryName.trim().isEmpty()) {
            model = CountryArray.findCountryModel(countryName);
        }
        if (model == null && countryCode != null && !countryCode.trim().isEmpty()) {
            model = CountryArray.findCountryModel(countryCode);
        }

        if (model != null) {
            selectedCountry = model.getName(); // Always full country name e.g. "India"
            binding.tvCountryFlag.setText(model.getFlag());
            binding.tvCountryFlag.setVisibility(View.VISIBLE);
            binding.tvCountryName.setText(model.getName());
        } else {
            String nameToDisplay = countryName != null && !countryName.trim().isEmpty() ? countryName.trim() : countryCode;
            try {
                if (countryCode != null && !countryCode.trim().isEmpty()) {
                    String localeName = new Locale("", countryCode.trim()).getDisplayCountry(Locale.ENGLISH);
                    if (localeName != null && !localeName.isEmpty()) {
                        nameToDisplay = localeName;
                    }
                }
            } catch (Exception ignored) {}
            selectedCountry = nameToDisplay;
            binding.tvCountryFlag.setVisibility(View.GONE);
            binding.tvCountryName.setText(selectedCountry);
        }
    }

    private CountryModel findCountryModel(String nameOrCode) {
        return CountryArray.findCountryModel(nameOrCode);
    }

    private String getCountryCodeFromFlag(String flag) {
        return CountryArray.getCountryCodeFromFlag(flag);
    }

    private void openCountryPickerBottomSheet() {
        if (!isFirstTime) {
            Toast.makeText(this, R.string.country_cannot_be_changed, Toast.LENGTH_SHORT).show();
            return;
        }

        BottomSheetDialog dialog = new BottomSheetDialog(this, R.style.CustomBottomSheetDialogTheme);
        View sheetView = LayoutInflater.from(this).inflate(R.layout.bottomsheet_country_picker, null);
        dialog.setContentView(sheetView);

        dialog.setOnShowListener(dialogInterface -> {
            BottomSheetDialog d = (BottomSheetDialog) dialogInterface;
            FrameLayout bottomSheet = d.findViewById(com.google.android.material.R.id.design_bottom_sheet);
            if (bottomSheet != null) {
                BottomSheetBehavior<FrameLayout> behavior = BottomSheetBehavior.from(bottomSheet);
                behavior.setState(BottomSheetBehavior.STATE_EXPANDED);
                behavior.setSkipCollapsed(true);
            }
        });

        List<CountryModel> countryList = new ArrayList<>();
        for (CountryModel model : CountryArray.getCountryList()) {
            if (!"All".equalsIgnoreCase(model.getName())) {
                countryList.add(model);
            }
        }

        CountryPickerAdapter adapter = new CountryPickerAdapter(this, countryList, selectedCountry, country -> {
            isUserManuallyChangedCountry = true;
            setSelectedCountry(country.getName());
            dialog.dismiss();
        });

        RecyclerView rvCountries = sheetView.findViewById(R.id.rvCountries);
        rvCountries.setLayoutManager(new LinearLayoutManager(this));
        rvCountries.setAdapter(adapter);

        ImageView btnClose = sheetView.findViewById(R.id.btnClose);
        btnClose.setOnClickListener(v -> dialog.dismiss());

        EditText etSearchCountry = sheetView.findViewById(R.id.etSearchCountry);
        etSearchCountry.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                adapter.filter(s != null ? s.toString() : "");
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });

        dialog.show();
    }

    private void setupListeners() {
        binding.lytMale.setOnClickListener(v -> selectMale());
        binding.lytFemale.setOnClickListener(v -> selectFemale());

        binding.imgUser.setOnClickListener(v -> choosePhoto(GALLERY_CODE_PROFILE));
        binding.btnPencil.setOnClickListener(v -> choosePhoto(GALLERY_CODE_PROFILE));

        if (isFirstTime) {
            binding.lytCountry.setOnClickListener(v -> openCountryPickerBottomSheet());
        } else {
            binding.lytCountry.setOnClickListener(v -> 
                Toast.makeText(this, R.string.country_cannot_be_changed, Toast.LENGTH_SHORT).show()
            );
        }

        binding.ivBack.setOnClickListener(v -> onBackPressed());

        binding.tvSubmit.setOnClickListener(v -> validateAndSubmit());
    }

    private void validateAndSubmit() {
        String name = binding.etName.getText().toString().trim();
        String username = binding.etUserName.getText().toString().trim();
        String bio = binding.etBio.getText().toString().trim();
        int age = Integer.parseInt(binding.etAge.getText().toString().trim());

        if (name.isEmpty()) {
            Toast.makeText(this, R.string.enter_your_name, Toast.LENGTH_SHORT).show();
            return;
        }

        if (username.isEmpty()) {
            Toast.makeText(this, R.string.enter_username_first, Toast.LENGTH_SHORT).show();
            return;
        }

        if (gender.isEmpty()) {
            Toast.makeText(this, R.string.select_your_gender, Toast.LENGTH_SHORT).show();
            return;
        }

        if (age < 18) {
            Toast.makeText(this, R.string.minimum_age_must_be_18_years, Toast.LENGTH_SHORT).show();
            return;
        }

        if (selectedCountry.isEmpty()) {
            Toast.makeText(this, R.string.please_select_country, Toast.LENGTH_SHORT).show();
            return;
        }

        updateProfile(name, username, bio, age, selectedCountry);
    }

    private void updateProfile(String name, String username, String bio, int age, String country) {
        if (customDialogClass != null && !customDialogClass.isShowing()) {
            customDialogClass.show();
        }

        CountryModel model = CountryArray.findCountryModel(country);
        String countryCode = "";
        String countryFlagImage = "";
        if (model != null) {
            countryCode = CountryArray.getCountryCodeFromFlag(model.getFlag());
            if (!countryCode.isEmpty()) {
                countryFlagImage = "https://flagcdn.com/w160/" + countryCode + ".png";
            }
        }
        if (countryCode.isEmpty()) {
            countryCode = sessionManager.getStringValue(Const.USER_SELECTED_COUNTRY_CODE);
            if (countryCode == null || countryCode.isEmpty()) {
                countryCode = sessionManager.getStringValue(Const.COUNTRY_CODE);
            }
            if (countryCode != null && !countryCode.isEmpty()) {
                countryFlagImage = "https://flagcdn.com/w160/" + countryCode.toLowerCase() + ".png";
            }
        }

        final String finalCountryCode = countryCode;
        final String finalCountryFlagImage = countryFlagImage;

        HashMap<String, RequestBody> map = new HashMap<>();
        map.put("name", RequestBody.create(MediaType.parse("text/plain"), name));
        map.put("username", RequestBody.create(MediaType.parse("text/plain"), username));
        map.put("bio", RequestBody.create(MediaType.parse("text/plain"), bio));
        map.put("userId", RequestBody.create(MediaType.parse("text/plain"), sessionManager.getUser().getId()));
        map.put("gender", RequestBody.create(MediaType.parse("text/plain"), gender));
        map.put("age", RequestBody.create(MediaType.parse("text/plain"), String.valueOf(age)));
        map.put("country", RequestBody.create(MediaType.parse("text/plain"), country));
        map.put("countryName", RequestBody.create(MediaType.parse("text/plain"), country));
        map.put("country_name", RequestBody.create(MediaType.parse("text/plain"), country));
        if (!finalCountryFlagImage.isEmpty()) {
            map.put("countryFlagImage", RequestBody.create(MediaType.parse("text/plain"), finalCountryFlagImage));
            map.put("country_flag_image", RequestBody.create(MediaType.parse("text/plain"), finalCountryFlagImage));
        }
        if (!finalCountryCode.isEmpty()) {
            map.put("countryCode", RequestBody.create(MediaType.parse("text/plain"), finalCountryCode));
            map.put("country_code", RequestBody.create(MediaType.parse("text/plain"), finalCountryCode));
        }

        MultipartBody.Part profileImage = prepareFilePart("image", picturePath);
        MultipartBody.Part coverImage = prepareFilePart("coverImage", coverPhotoPath);

        Log.d(TAG, "POST Data:");
        Log.d(TAG, "Name: " + name);
        Log.d(TAG, "Username: " + username);
        Log.d(TAG, "Bio: " + bio);
        Log.d(TAG, "UserID: " + sessionManager.getUser().getId());
        Log.d(TAG, "Gender: " + gender);
        Log.d(TAG, "Age: " + age);
        Log.d(TAG, "Country: " + country);
        Log.d(TAG, "CountryFlagImage: " + finalCountryFlagImage);
        Log.d(TAG, "CountryCode: " + finalCountryCode);

        RetrofitBuilder.create().updateUser(map, profileImage, coverImage).enqueue(new Callback<>() {
            @Override
            public void onResponse(Call<UserRoot> call, Response<UserRoot> response) {
                if (customDialogClass != null) customDialogClass.dismiss();

                if (response.isSuccessful() && response.body() != null) {
                    UserRoot userRoot = response.body();
                    if (userRoot.isStatus()) {
                        sessionManager.saveStringValue(Const.USER_SELECTED_COUNTRY, country);
                        if (!finalCountryCode.isEmpty()) {
                            sessionManager.saveStringValue(Const.USER_SELECTED_COUNTRY_CODE, finalCountryCode);
                        }
                        if (!finalCountryFlagImage.isEmpty()) {
                            sessionManager.saveStringValue(Const.USER_SELECTED_FLAG_IMAGE, finalCountryFlagImage);
                        }
                        if (model != null && model.getFlag() != null) {
                            sessionManager.saveStringValue(Const.USER_SELECTED_FLAG_EMOJI, model.getFlag());
                        }
                        sessionManager.saveStringValue(Const.COUNTRY, country);
                        if (!finalCountryCode.isEmpty()) {
                            sessionManager.saveStringValue(Const.COUNTRY_CODE, finalCountryCode);
                        }

                        if (userRoot.getUser() != null) {
                            userRoot.getUser().setCountry(country);
                            if (!finalCountryFlagImage.isEmpty()) {
                                userRoot.getUser().setCountryFlagImage(finalCountryFlagImage);
                            }
                            sessionManager.saveUser(userRoot.getUser());
                        } else if (sessionManager.getUser() != null) {
                            UserRoot.User localUser = sessionManager.getUser();
                            localUser.setCountry(country);
                            if (!finalCountryFlagImage.isEmpty()) {
                                localUser.setCountryFlagImage(finalCountryFlagImage);
                            }
                            sessionManager.saveUser(localUser);
                        }
                        sessionManager.saveBooleanValue(Const.IS_LOGIN, true);
                        if (isFirstTime) {
                            startActivity(new Intent(EditProfileActivity.this, MainActivity.class));
                            finishAffinity();
                        } else {
                            finish();
                        }
                    } else {
                        Log.w(TAG, getString(R.string.update_failed_) + userRoot.getMessage());
                        Toast.makeText(EditProfileActivity.this,
                                getString(R.string.update_failed_) + (userRoot.getMessage() != null ? userRoot.getMessage() : getString(R.string.unknown_error)),
                                Toast.LENGTH_SHORT).show();

                    }
                } else {
                    Log.e(TAG, "Update failed: HTTP " + response.code() + " - " + response.message());
                    try {
                        if (response.errorBody() != null) {
                            Log.e(TAG, "Error body: " + response.errorBody().string());
                        }
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    Toast.makeText(EditProfileActivity.this, getString(R.string.update_failed_) + response.message(), Toast.LENGTH_SHORT).show();

                }
            }


            @Override
            public void onFailure(Call<UserRoot> call, Throwable t) {
                if (customDialogClass != null) customDialogClass.dismiss();
                Log.e(TAG, "Update API failed: " + t.getLocalizedMessage(), t);
                Toast.makeText(EditProfileActivity.this, getString(R.string.something_went_wrong_text), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private MultipartBody.Part prepareFilePart(String partName, String filePath) {
        if (filePath == null || filePath.isEmpty()) return null;

        File file = new File(filePath);
        RequestBody requestFile = RequestBody.create(MediaType.parse("multipart/form-data"), file);
        return MultipartBody.Part.createFormData(partName, file.getName(), requestFile);
    }

    private void choosePhoto(int code) {
        PickVisualMediaRequest request = new PickVisualMediaRequest.Builder()
                .setMediaType(ActivityResultContracts.PickVisualMedia.ImageOnly.INSTANCE)
                .build();

        if (code == GALLERY_CODE_PROFILE) {
            pickProfileImageLauncher.launch(request);
        } else if (code == GALLERY_CODE_COVER) {
            pickCoverImageLauncher.launch(request);
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode != RESULT_OK || data == null || data.getData() == null) return;

        Uri selectedImage = data.getData();
        String realPath = getRealPathFromURI(selectedImage);

        if (realPath != null) {
            if (requestCode == GALLERY_CODE_PROFILE) {
                picturePath = realPath;
                binding.imgUser.setUserImage(String.valueOf(selectedImage),"",5);
            } else if (requestCode == GALLERY_CODE_COVER) {
                coverPhotoPath = realPath;
            }
        }
    }

    private void selectMale() {
        gender = Const.MALE;

        Glide.with(this).load(R.drawable.radio_selected).into(binding.rbMale);
        Glide.with(this).load(R.drawable.radio_unselected).into(binding.rbFemale);
    }

    private void selectFemale() {
        gender = Const.FEMALE;

        Glide.with(this).load(R.drawable.radio_selected).into(binding.rbFemale);
        Glide.with(this).load(R.drawable.radio_unselected).into(binding.rbMale);

    }

    private String safe(String value) {
        return value != null ? value : "";
    }

    private String capitalize(String str) {
        if (str == null || str.isEmpty()) return "";
        return Character.toUpperCase(str.charAt(0)) + str.substring(1);
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        finish();
    }

    private String copyUriToInternalStorage(Uri uri, String extension) {
        try {
            File outFile = new File(getCacheDir(), "image_" + System.currentTimeMillis() + extension);
            try (InputStream in = getContentResolver().openInputStream(uri);
                 OutputStream out = new FileOutputStream(outFile)) {
                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = in.read(buffer)) != -1) {
                    out.write(buffer, 0, bytesRead);
                }
            }
            return outFile.getAbsolutePath();
        } catch (Exception e) {
            Log.e(TAG, "File copy failed", e);
            return null;
        }
    }

}