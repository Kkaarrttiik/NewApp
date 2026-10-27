# ============================================================================
# ProGuard Rules for Universal Device Compatibility & Crash Prevention
# ============================================================================

# 1. Attributes & Debugging Information
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes Exceptions
-keepattributes InnerClasses
-keepattributes EnclosingMethod
-keepattributes JavascriptInterface

# 2. General Android System Components (Ensures App Installs on All Devices)
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Application
-keep public class * extends android.app.Service
-keep public class * extends android.content.BroadcastReceiver
-keep public class * extends android.content.ContentProvider
-keep public class * extends android.app.backup.BackupAgentHelper
-keep public class * extends android.preference.Preference

# 3. Custom Views & XML Layout Inflation (Prevents Inflation Crashes)
-keep public class * extends android.view.View {
    public <init>(android.content.Context);
    public <init>(android.content.Context, android.util.AttributeSet);
    public <init>(android.content.Context, android.util.AttributeSet, int);
    public void set*(...);
}
-keepclasseswithmembers class * {
    public <init>(android.content.Context, android.util.AttributeSet);
}
-keepclasseswithmembers class * {
    public <init>(android.content.Context, android.util.AttributeSet, int);
}
-keepclassmembers class * extends android.app.Activity {
    public void *(android.view.View);
}

# 4. Parcelable & Serializable
-keepclassmembers class * implements android.os.Parcelable {
    public static final ** CREATOR;
}
-keepnames class * implements android.os.Parcelable
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    !static !transient <fields>;
    !private <fields>;
    !private <methods>;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# 5. JNI Native Methods (Ensures C/C++ native .so library bindings stay intact)
-keepclasseswithmembernames class * {
    native <methods>;
}

# 6. AndroidX & Jetpack Components
-keep class androidx.** { *; }
-dontwarn androidx.**
-keep class androidx.multidex.** { *; }
-dontwarn androidx.multidex.**
-keep class com.google.android.material.** { *; }
-dontwarn com.google.android.material.**

# 7. DataBinding & ViewBinding
-keepclassmembers class * extends androidx.databinding.ViewDataBinding {
    public static *** inflate(...);
    public static *** bind(...);
}
-keep class androidx.databinding.** { *; }
-dontwarn androidx.databinding.**
-keep class * implements androidx.viewbinding.ViewBinding {
    public static *** inflate(...);
    public static *** bind(...);
}

# 8. Application Code & Models (Keeps all app models, viewmodels, sockets, adapters intact)
-keep class com.codder.ultimate.** { *; }
-keepclassmembers class com.codder.ultimate.** { *; }
-dontwarn com.codder.ultimate.**

# 9. GSON Serialization & JSON Parsing
-keep class com.google.gson.** { *; }
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer
-keepclassmembers,allowobfuscation class * {
    @com.google.gson.annotations.SerializedName <fields>;
}

# 10. Retrofit, OkHttp, Okio, Jackson
-keep class retrofit2.** { *; }
-dontwarn retrofit2.**
-keep class okhttp3.** { *; }
-dontwarn okhttp3.**
-keep class okio.** { *; }
-dontwarn okio.**
-keep class com.fasterxml.jackson.** { *; }
-dontwarn com.fasterxml.jackson.**

# 11. Agora RTC SDK (Real-time Audio/Video Streaming)
-keep class io.agora.** { *; }
-keep class io.agora.rtc.** { *; }
-keep class io.agora.base.** { *; }
-dontwarn io.agora.**

# 12. DeepAR SDK
-keep class ai.deepar.** { *; }
-keepclassmembers class ai.deepar.ar.DeepAR { *; }
-dontwarn ai.deepar.**

# 13. Payment Gateways
# Razorpay
-keep class com.razorpay.** { *; }
-dontwarn com.razorpay.**
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keepclasseswithmembers class * {
    public void onPayment*(...);
}

# PayPal SDK
-keep class com.paypal.** { *; }
-dontwarn com.paypal.**
-keep class com.paypal.checkout.** { *; }
-dontwarn com.paypal.checkout.**

# Stripe
-keep class com.stripe.android.** { *; }
-dontwarn com.stripe.android.**

# Cashfree
-keep class com.cashfree.** { *; }
-dontwarn com.cashfree.**

# Paystack
-keep class co.paystack.android.** { *; }
-dontwarn co.paystack.android.**

# Flutterwave
-keep class com.flutterwave.** { *; }
-dontwarn com.flutterwave.**

# Google Play Billing
-keep class com.android.billingclient.** { *; }
-dontwarn com.android.billingclient.**

# 14. Media, Animations & UI Libraries
# SVGA Player
-keep class com.opensource.svgaplayer.** { *; }
-dontwarn com.opensource.svgaplayer.**

# Glide
-keep public class * extends com.bumptech.glide.module.AppGlideModule
-keep class com.bumptech.glide.** { *; }
-dontwarn com.bumptech.glide.**

# Fresco
-keep class com.facebook.fresco.** { *; }
-keep class com.facebook.imagepipeline.** { *; }
-keep class com.facebook.drawee.** { *; }
-dontwarn com.facebook.**

# Lottie
-keep class com.airbnb.lottie.** { *; }
-dontwarn com.airbnb.lottie.**

# ExoPlayer
-keep class com.google.android.exoplayer2.** { *; }
-dontwarn com.google.android.exoplayer2.**

# CameraView & Transcoder
-keep class com.otaliastudios.cameraview.** { *; }
-dontwarn com.otaliastudios.**

# BlurView
-keep class eightbitlab.com.blurview.** { *; }
-dontwarn eightbitlab.com.blurview.**

# AndroidSVG
-keep class com.caverock.androidsvg.** { *; }
-dontwarn com.caverock.androidsvg.**

# SmartRefreshLayout
-keep class com.scwang.smart.** { *; }
-dontwarn com.scwang.smart.**

# UCrop
-keep class com.yalantis.ucrop.** { *; }
-dontwarn com.yalantis.ucrop.**

# GPUImage
-keep class jp.co.cyberagent.android.gpuimage.** { *; }
-dontwarn jp.co.cyberagent.android.gpuimage.**

# Socket.IO & Engine.IO
-keep class io.socket.** { *; }
-keep class io.engine.** { *; }
-dontwarn io.socket.**
-dontwarn io.engine.**

# 15. Firebase & Google Play Services
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.android.gms.**
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**
-keep public class * extends java.lang.Exception

# 16. Kotlin, Coroutines & Compose
-keepclassmembers class kotlin.Metadata { *; }
-dontwarn kotlin.**
-dontwarn kotlinx.coroutines.**
-keep class androidx.compose.** { *; }
-dontwarn androidx.compose.**

# 17. Room Database
-keep class androidx.room.** { *; }
-dontwarn androidx.room.**
-keep class * extends androidx.room.RoomDatabase

# 18. Third-party Dependency Warnings Suppression
-dontwarn com.cardinalcommerce.**
-dontwarn com.daimajia.easing.**
-dontwarn edu.umd.cs.findbugs.**
-dontwarn net.bytebuddy.**
-dontwarn org.bouncycastle.**
-dontwarn org.conscrypt.**
-dontwarn org.openjsse.**