package com.codder.ultimate.utils;

import android.annotation.SuppressLint;

import org.jetbrains.annotations.NotNull;

import java.util.Locale;
import java.util.concurrent.TimeUnit;

public class TextFormatUtil {

    @NotNull
    public static String toMMSS(long millis) {
        long mm = TimeUnit.MILLISECONDS.toMinutes(millis)
                - TimeUnit.HOURS.toMinutes(TimeUnit.MILLISECONDS.toHours(millis));
        long ss = TimeUnit.MILLISECONDS.toSeconds(millis)
                - TimeUnit.MINUTES.toSeconds(TimeUnit.MILLISECONDS.toMinutes(millis));
        return String.format(Locale.US, "%02d:%02d", mm, ss);
    }

    @NotNull
    @SuppressLint("DefaultLocale")
    public static String toShortNumber(long count) {
        if (count < 1000) {
            return count + "";
        }
        int exp = (int) (Math.log(count) / Math.log(1000));
        return String.format(
                "%.1f %c",
                count / Math.pow(1000, exp),
                "kMGTPE".charAt(exp - 1)
        );
    }

    @NotNull
    public static String getRelativeTime(String timeString) {
        if (timeString == null || timeString.trim().isEmpty()) {
            return "";
        }
        
        // Try parsing first format: "M/d/yyyy, h:mm:ss a" (e.g. 7/15/2026, 9:16:19 PM)
        java.text.SimpleDateFormat sdfUTC = new java.text.SimpleDateFormat("M/d/yyyy, h:mm:ss a", Locale.ENGLISH);
        sdfUTC.setTimeZone(java.util.TimeZone.getTimeZone("UTC"));
        
        try {
            java.util.Date date = sdfUTC.parse(timeString);
            if (date != null) {
                long time = date.getTime();
                long now = System.currentTimeMillis();
                long diff = now - time;
                if (diff < 60000) {
                    return "Just Now";
                }
                long minutes = diff / 60000;
                if (minutes < 60) {
                    return minutes + " m ago";
                }
                long hours = minutes / 60;
                if (hours < 24) {
                    return hours + " h ago";
                }
                long days = hours / 24;
                if (days < 30) {
                    return days + " d ago";
                }
                long months = days / 30;
                if (months < 12) {
                    return months + " mo ago";
                }
                long years = months / 12;
                return years + " y ago";
            }
        } catch (java.text.ParseException e) {
            // Try fallback format: ISO 8601 (yyyy-MM-dd'T'HH:mm:ss)
            java.text.SimpleDateFormat sdfISO = new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.ENGLISH);
            sdfISO.setTimeZone(java.util.TimeZone.getTimeZone("UTC"));
            try {
                java.util.Date date = sdfISO.parse(timeString);
                if (date != null) {
                    long time = date.getTime();
                    long now = System.currentTimeMillis();
                    long diff = now - time;
                    if (diff < 60000) {
                        return "Just Now";
                    }
                    long minutes = diff / 60000;
                    if (minutes < 60) {
                        return minutes + " m ago";
                    }
                    long hours = minutes / 60;
                    if (hours < 24) {
                        return hours + " h ago";
                    }
                    long days = hours / 24;
                    if (days < 30) {
                        return days + " d ago";
                    }
                    long months = days / 30;
                    if (months < 12) {
                        return months + " mo ago";
                    }
                    long years = months / 12;
                    return years + " y ago";
                }
            } catch (java.text.ParseException ex) {
                // Ignore and fall through to try parsing in local time
            }
        }
        
        // If UTC parsing failed, try local timezone as last resort
        java.text.SimpleDateFormat sdfLocal = new java.text.SimpleDateFormat("M/d/yyyy, h:mm:ss a", Locale.ENGLISH);
        try {
            java.util.Date date = sdfLocal.parse(timeString);
            if (date != null) {
                long time = date.getTime();
                long now = System.currentTimeMillis();
                long diff = now - time;
                if (diff < 60000) {
                    return "Just Now";
                }
                long minutes = diff / 60000;
                if (minutes < 60) {
                    return minutes + " m ago";
                }
                long hours = minutes / 60;
                if (hours < 24) {
                    return hours + " h ago";
                }
                long days = hours / 24;
                if (days < 30) {
                    return days + " d ago";
                }
                long months = days / 30;
                if (months < 12) {
                    return months + " mo ago";
                }
                long years = months / 12;
                return years + " y ago";
            }
        } catch (java.text.ParseException e) {
            e.printStackTrace();
        }

        return timeString; // Fallback to raw response time string
    }

    public static class ExpiryInfo {
        public boolean isExpired;
        public String displayText;
        public String detailedDateText;
    }

    @NotNull
    public static ExpiryInfo getExpiryInfo(String expiresAtString, String fallbackValidationTag) {
        ExpiryInfo info = new ExpiryInfo();
        if (expiresAtString == null || expiresAtString.trim().isEmpty() || expiresAtString.equalsIgnoreCase("null")) {
            if (fallbackValidationTag != null && !fallbackValidationTag.trim().isEmpty()) {
                info.displayText = fallbackValidationTag;
            } else {
                info.displayText = "Permanent";
            }
            info.isExpired = false;
            return info;
        }

        java.util.Date expireDate = parseDate(expiresAtString);
        if (expireDate == null) {
            info.displayText = expiresAtString;
            info.isExpired = false;
            return info;
        }

        java.text.SimpleDateFormat dateFmt = new java.text.SimpleDateFormat("dd MMM yyyy", Locale.getDefault());
        info.detailedDateText = dateFmt.format(expireDate);

        long diff = expireDate.getTime() - System.currentTimeMillis();
        if (diff <= 0) {
            info.isExpired = true;
            info.displayText = "Expired";
            return info;
        }

        info.isExpired = false;
        long seconds = diff / 1000;
        long minutes = seconds / 60;
        long hours = minutes / 60;
        long days = hours / 24;

        if (days >= 30) {
            info.displayText = "Valid till " + dateFmt.format(expireDate);
        } else if (days >= 1) {
            long remainingHours = hours % 24;
            if (days < 3 && remainingHours > 0) {
                info.displayText = days + "d " + remainingHours + "h left";
            } else {
                info.displayText = days + (days == 1 ? " day left" : " days left");
            }
        } else if (hours >= 1) {
            long remainingMinutes = minutes % 60;
            if (remainingMinutes > 0) {
                info.displayText = hours + "h " + remainingMinutes + "m left";
            } else {
                info.displayText = hours + (hours == 1 ? " hour left" : " hours left");
            }
        } else if (minutes >= 1) {
            info.displayText = minutes + " min left";
        } else {
            info.displayText = "Expires soon";
        }

        return info;
    }

    private static java.util.Date parseDate(String dateString) {
        if (dateString == null || dateString.trim().isEmpty()) return null;

        // Try parsing as timestamp millis
        try {
            long millis = Long.parseLong(dateString.trim());
            return new java.util.Date(millis);
        } catch (NumberFormatException ignored) {
        }

        String[] patterns = new String[]{
                "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
                "yyyy-MM-dd'T'HH:mm:ss.SSSZ",
                "yyyy-MM-dd'T'HH:mm:ss.SSS",
                "yyyy-MM-dd'T'HH:mm:ss'Z'",
                "yyyy-MM-dd'T'HH:mm:ssZ",
                "yyyy-MM-dd'T'HH:mm:ss",
                "yyyy-MM-dd HH:mm:ss",
                "yyyy-MM-dd",
                "M/d/yyyy, h:mm:ss a"
        };

        for (String pattern : patterns) {
            try {
                java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat(pattern, Locale.ENGLISH);
                if (pattern.contains("Z") || pattern.contains("'Z'") || pattern.contains("'T'")) {
                    sdf.setTimeZone(java.util.TimeZone.getTimeZone("UTC"));
                }
                return sdf.parse(dateString);
            } catch (Exception ignored) {
            }
        }
        return null;
    }

}

