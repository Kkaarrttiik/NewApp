import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";

export const adminNavbarConfig = [
  // ─── USER MANAGEMENT ─────────────────────────────────────
  {
    type: "heading",
    label: "USER MANAGEMENT",
  },
  {
    name: "User",
    icon: <i data-feather="users"></i>,
    children: [
      { name: "Real", path: "/admin/user" },
      { name: "Fake", path: "/admin/fakeUser" },
    ],
  },
  {
    name: "Host",
    icon: <i data-feather="user-check"></i>,
    children: [
      { name: "Host", path: "/admin/host" },
      { name: "Host Request", path: "/admin/hostRequest" },
    ],
  },
  {
    name: "Agency",
    icon: <i data-feather="image"></i>,
    children: [
      { name: "Agency", path: "/admin/agency" },
      { name: "Agency History", path: "/admin/agencyHistory" },
      { name: "Agency Redeem", path: "/admin/agencyRedeemRequest" },
    ],
  },
  {
    name: "Coin Seller",
    icon: <i data-feather="dollar-sign"></i>,
    path: "/admin/coinSeller",
  },

  // ─── BD MANAGEMENT ────────────────────────────────
  {
    type: "heading",
    label: "BD MANAGEMENT",
  },

  {
    name: "BD Regions",
    icon: <i data-feather="globe"></i>,
    path: "/admin/region",
  },
  {
    name: "BD",
    icon: <i data-feather="server"></i>,
    children: [
      { name: "Bd", path: "/admin/bd" },
      { name: "Bd Redeem", path: "/admin/bdRedeem" },
      { name: "Bd Payment Method", path: "/admin/bdPaymentMethod" },
    ],
  },

  // ─── FINANCIAL MANAGEMENT ────────────────────────────────
  {
    type: "heading",
    label: "FINANCIAL MANAGEMENT",
  },
  {
    name: "Plan",
    icon: <i data-feather="layout"></i>,
    path: "/admin/mainPlan",
  },
  {
    name: "Plan History",
    icon: <i data-feather="clock"></i>,
    path: "/admin/planHistory",
  },
  {
    name: "User Redeem",
    icon: <i data-feather="key"></i>,
    path: "/admin/userRedeemRequest",
  },

  // ─── GAMING ──────────────────────────────────────────────
  {
    type: "heading",
    label: "GAMING",
  },
  {
    name: "Game",
    icon: <SportsEsportsOutlinedIcon style={{ fontSize: "28px" }} />,
    path: "/admin/game",
  },
  {
    name: "Game History",
    icon: <i data-feather="hash"></i>,
    path: "/admin/gameHistory",
  },

  // ─── ENGAGEMENT ──────────────────────────────────────────
  {
    type: "heading",
    label: "ENGAGEMENT",
  },
  {
    name: "Gift",
    icon: <i data-feather="gift"></i>,
    children: [
      {
        name: "Category",
        path: "/admin/giftCategory",
        onClick: () => sessionStorage.removeItem("GiftClick"),
      },
      {
        name: "Gift",
        path: "/admin/gift",
        onClick: () => sessionStorage.setItem("GiftClick", true),
      },
    ],
  },
  {
    name: "Reaction",
    icon: <i className="far fa-smile-wink" style={{ fontSize: "23px" }}></i>,
    path: "/admin/reaction",
  },
  // {
  //   name: "Fake Comment",
  //   icon: <i data-feather="message-circle"></i>,
  //   path: "/admin/comment",
  // },
  {
    name: "Suggested Message",
    icon: <i data-feather="message-square"></i>,
    path: "/admin/suggestMessage",
  },

  // ─── CONTENT MANAGEMENT ──────────────────────────────────
  {
    type: "heading",
    label: "CONTENT MANAGEMENT",
  },
  {
    name: "Banner",
    icon: <i data-feather="image"></i>,
    path: "/admin/banner",
  },
  {
    name: "Broadcast",
    icon: <i data-feather="radio"></i>,
    children: [
      { name: "Broadcast Gift", path: "/admin/broadcastgift" },
      { name: "Broadcast Game", path: "/admin/broadcastgame" },
    ],
  },
  {
    name: "Theme",
    icon: <i data-feather="image"></i>,
    path: "/admin/theme",
  },
  {
    name: "Song",
    icon: <i data-feather="music"></i>,
    path: "/admin/song",
  },
  {
    name: "Hashtag",
    icon: <i data-feather="hash"></i>,
    path: "/admin/hashtag",
  },
  {
    name: "Post",
    icon: <i data-feather="maximize"></i>,
    path: "/admin/mainPost",
  },
  {
    name: "Video",
    icon: <i data-feather="film"></i>,
    path: "/admin/mainVideo",
  },

  // ─── STORE & FEATURES ────────────────────────────────────
  {
    type: "heading",
    label: "STORE & FEATURES",
  },
  {
    name: "Store",
    icon: <i data-feather="loader"></i>,
    children: [
      { name: "Entry Effect", path: "/admin/entryEffect" },
      { name: "Avatar Frame", path: "/admin/avatarFrame" },
    ],
  },

  // ─── MODERATION ──────────────────────────────────────────
  {
    type: "heading",
    label: "MODERATION",
  },
  {
    name: "Reported User",
    icon: <i data-feather="flag"></i>,
    path: "/admin/reportedUser",
  },
  {
    name: "Complain Request",
    icon: <i data-feather="help-circle"></i>,
    path: "/admin/complainRequest",
  },

  // ─── LEVEL MANAGEMENT ────────────────────────────────────
  {
    type: "heading",
    label: "LEVEL MANAGEMENT",
  },
  {
    name: "Level",
    icon: <i data-feather="bar-chart"></i>,
    path: "/admin/level",
  },

  // ─── MARKETING ───────────────────────────────────────────
  {
    type: "heading",
    label: "MARKETING",
  },
  {
    name: "Google Ad",
    icon: <i data-feather="book"></i>,
    path: "/admin/advertisement",
  },

  // ─── Language Management ───────────────────────────────────────────
  {
    type: "heading",
    label: "Language Management",
  },
  {
    name: "Language",
    icon: <i data-feather="globe"></i>,
    path: "/admin/language",
  },

  // ─── ROLE MANAGEMENT ─────────────────────────────────────
  {
    type: "heading",
    label: "ROLE MANAGEMENT",
  },
  {
    name: "Access Roles",
    icon: <i data-feather="shield"></i>,
    path: "/admin/role",
  },
  {
    name: "Staff",
    icon: <i data-feather="users"></i>,
    path: "/admin/staff",
  },

  // ─── SYSTEM ──────────────────────────────────────────────
  {
    type: "heading",
    label: "SYSTEM",
  },
  {
    name: "Setting",
    icon: <i data-feather="settings"></i>,
    path: "/admin/Setting",
  },
];

/**
 * Derived from adminNavbarConfig for role permission matrix.
 * sections: section names in order; uniqueModules: { key, name, section, icon }.
 * key = path without leading slash (e.g. "admin/role").
 */
export const adminModulesConfigForRole = (() => {
  const sections = [];
  const uniqueModules = [];
  adminNavbarConfig.forEach((item) => {
    const section = item.name;
    if (!sections.includes(section)) sections.push(section);
    if (item.children) {
      (item.children || []).forEach((child) => {
        const path = child.path || "";
        const key = path.replace(/^\//, "");
        if (key && !["Access Roles", "Staff"].includes(child.name)) {
          uniqueModules.push({
            key,
            name: child.name,
            section,
            icon: item.icon,
          });
        }
      });
    } else {
      const path = item.path || "";
      const key = path.replace(/^\//, "");
      if (
        key &&
        !["Access Roles", "Staff", "heading"].includes(item.name || item.type)
      ) {
        uniqueModules.push({
          key,
          name: item.name,
          section,
          icon: item.icon,
        });
      }
    }
  });
  return { sections, uniqueModules };
})();

// export const adminModulesConfigForRole = (() => {
//   const sections = [];
//   const uniqueModules = [];
//   adminNavbarConfig.forEach((item) => {
//     const section = item.name;
//     if (!sections.includes(section)) sections.push(section);
//     if (item.children) {
//       (item.children || []).forEach((child) => {
//         const path = child.path || "";
//         const key = path.replace(/^\//, "");
//         if (key) {
//           uniqueModules.push({
//             key,
//             name: child.name,
//             section,
//             icon: item.icon,
//           });
//         }
//       });
//     } else {
//       const path = item.path || "";
//       const key = path.replace(/^\//, "");
//       if (key) {
//         uniqueModules.push({
//           key,
//           name: item.name,
//           section,
//           icon: item.icon,
//         });
//       }
//     }
//   });
//   return { sections, uniqueModules };
// })();
