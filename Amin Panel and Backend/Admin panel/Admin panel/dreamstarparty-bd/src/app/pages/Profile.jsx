import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBdProfile } from "../store/profileSlice"; // adjust path as needed
import useTranslation from "../../util/useTranslation";

const fmtCompact = (val) => {
  const n = Number(val);
  if (isNaN(n)) return val ?? "0";
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 10_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  return n.toLocaleString();
};
import {
  User,
  Hash,
  Shield,
  Phone,
  ToggleLeft,
  Calendar,
  Coins,
  Gem,
  TrendingDown,
  Building,
  MapPin,
} from "lucide-react";
import rCoin from "../../images/rcoin.webp";

const iconMap = {
  user: User,
  hash: Hash,
  shield: Shield,
  phone: Phone,
  "toggle-left": ToggleLeft,
  calendar: Calendar,
};

const Profile = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { data, loading, error } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchBdProfile());
  }, [dispatch]);

  // Loading state
  if (loading) {
    return (
      <div className="bg-[#0f1117] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">{t("profile_loading")}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-[#0f1117] min-h-screen flex items-center justify-center">
        <div className="bg-[#1a1d27] border border-red-500/30 rounded-xl p-6 text-center max-w-sm">
          <p className="text-red-400 font-semibold mb-1">
            {t("profile_load_failed")}
          </p>
          <p className="text-gray-400 text-sm">{error}</p>
          <button
            onClick={() => dispatch(fetchBdProfile())}
            className="mt-4 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors"
          >
            {t("profile_retry")}
          </button>
        </div>
      </div>
    );
  }

  // No data yet
  if (!data) return null;

  const createdDate = new Date(data.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="text-white bg-[#0f1117] min-h-screen">
      <div
        className="h-[180px] sm:h-[200px] bg-cover bg-center relative overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1200&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1117] to-transparent" />
      </div>

      <div className="px-3 sm:px-4 md:px-6 -mt-14 relative pb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 mb-6">
          <img
            src={data.image}
            alt={data.name}
            className="w-[110px] h-[110px] rounded-full border-[3px] border-[#0f1117] object-cover shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
          />
          <div className="pb-1">
            <h1 className="text-xl font-bold text-white">{data.name}</h1>
            {/* user can be null per the API response */}
            {data.user && (
              <p className="text-sm text-gray-400 mb-1">{data.user.name}</p>
            )}
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                {data.bdCode}
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  data.isActive
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {data.isActive ? t("profile_active") : t("profile_inactive")}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#1a1d27] border border-white/10 rounded-xl p-4">
              <h5 className="font-semibold text-white text-base mb-3">
                {t("profile_about")}
              </h5>
              <InfoRow
                icon="user"
                label={t("profile_label_name")}
                value={data.name}
              />
              <InfoRow
                icon="hash"
                label={t("profile_label_unique_id")}
                value={data.uniqueId}
                highlight
              />
              <InfoRow
                icon="shield"
                label={t("profile_label_bd_code")}
                value={data.bdCode}
                highlight
              />
              <InfoRow
                icon="phone"
                label={t("profile_label_mobile")}
                value={data.mobile}
                highlight
              />
              <InfoRow
                icon="toggle-left"
                label={t("profile_label_status")}
                value={
                  data.isActive ? t("profile_active") : t("profile_inactive")
                }
              />
              <InfoRow
                icon="calendar"
                label={t("profile_label_created")}
                value={createdDate}
                highlight
                last
              />
            </div>

            <div className="bg-[#1a1d27] border border-white/10 rounded-xl p-4">
              <h5 className="font-semibold text-white text-base mb-3">
                {t("profile_regions")}
              </h5>
              <div className="flex flex-wrap gap-2">
                {data.regions?.length > 0 ? (
                  data.regions.map((region) => (
                    <span
                      key={region._id}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#252836] text-gray-300 text-sm"
                    >
                      <MapPin className="w-3 h-3 text-blue-400" />
                      {region.name}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">
                    {t("profile_no_regions")}
                  </p>
                )}
              </div>
            </div>

            {/* Linked User — safely handles null */}
            <div className="bg-[#1a1d27] border border-white/10 rounded-xl p-4">
              <h5 className="font-semibold text-white text-base mb-3">
                {t("profile_linked_user")}
              </h5>
              {data.user ? (
                <>
                  <div className="flex items-center gap-3">
                    <img
                      src={data.user.image}
                      alt={data.user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium text-white">
                        {data.user.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {t("profile_user_id", { id: data.user.uniqueId })}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-gray-400">
                    {t("profile_bank_details", {
                      value:
                        data.user.bankDetails || t("profile_bank_not_provided"),
                    })}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-400">
                  {t("profile_no_linked_user")}
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon="coins"
                label={t("profile_stat_rcoin")}
                value={fmtCompact(data.rCoin)}
              />
              <StatCard
                icon="gem"
                label={t("profile_stat_net_coin")}
                value={fmtCompact(data.netCoin)}
              />
              <StatCard
                icon="trending-down"
                label={t("profile_stat_withdrawn")}
                value={fmtCompact(data.totalWithdrawn)}
              />
              <StatCard
                icon="building"
                label={t("profile_stat_agencies")}
                value={data.totalAgencies}
              />
            </div>
            <div className="bg-[#1a1d27] border border-white/10 rounded-xl min-h-[200px] flex items-center justify-center">
              <p className="text-sm text-gray-400">
                {t("profile_nothing_to_show")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value, highlight = false, last = false }) => {
  const Icon = iconMap[icon];
  return (
    <div
      className={`flex items-center gap-3 py-2 ${last ? "" : "border-b border-white/10"}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 text-gray-400" />}
      <span className="text-sm text-gray-400">{label}</span>
      <span
        className={`ml-auto text-sm font-medium ${highlight ? "text-blue-400" : "text-white"}`}
      >
        {value}
      </span>
    </div>
  );
};

const statIconMap = {
  coins: { type: "image", value: rCoin },
  gem: { type: "image", value: rCoin },
  "trending-down": { type: "component", value: TrendingDown },
  building: { type: "component", value: Building },
};
const StatCard = ({ icon, label, value }) => {
  const entry = statIconMap[icon];
  return (
    <div className="text-center p-3 rounded-lg bg-[#252836]">
      {entry &&
        (entry.type === "image" ? (
          <img
            src={entry.value}
            alt={label}
            className="w-5 h-5 mx-auto mb-2 object-contain"
          />
        ) : (
          <entry.value className="w-5 h-5 text-blue-400 mx-auto mb-2" />
        ))}
      <p className="font-bold text-xl text-white mb-1">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
};

export default Profile;
