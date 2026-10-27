package com.codder.ultimate.modelclass;

import com.google.gson.annotations.SerializedName;

public class IpAddressRoot_e {

    @SerializedName(value = "zip", alternate = {"zipCode"})
    private String zip;

    @SerializedName(value = "country", alternate = {"countryName"})
    private String country;

    @SerializedName(value = "city", alternate = {"cityName"})
    private String city;

    @SerializedName("org")
    private String org;

    @SerializedName(value = "timezone", alternate = {"timeZone"})
    private String timezone;

    @SerializedName("regionName")
    private String regionName;

    @SerializedName("isp")
    private String isp;

    @SerializedName(value = "query", alternate = {"ipAddress", "ip"})
    private String query;

    @SerializedName(value = "lon", alternate = {"longitude"})
    private double lon;

    @SerializedName("as")
    private String as;

    @SerializedName(value = "countryCode", alternate = {"country_code"})
    private String countryCode;

    @SerializedName("region")
    private String region;

    @SerializedName(value = "lat", alternate = {"latitude"})
    private double lat;

    @SerializedName("status")
    private String status;

    public String getZip() {
        return zip;
    }

    public String getCountry() {
        return country;
    }

    public String getCity() {
        return city;
    }

    public String getOrg() {
        return org;
    }

    public String getTimezone() {
        return timezone;
    }

    public String getRegionName() {
        return regionName;
    }

    public String getIsp() {
        return isp;
    }

    public String getQuery() {
        return query;
    }

    public double getLon() {
        return lon;
    }

    public String getAs() {
        return as;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public String getRegion() {
        return region;
    }

    public double getLat() {
        return lat;
    }

    public String getStatus() {
        return status;
    }
}