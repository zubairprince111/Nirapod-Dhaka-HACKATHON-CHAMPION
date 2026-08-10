import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "bn" | "en";
export type TextScale = "base" | "lg" | "xl";

type Dict = Record<string, { bn: string; en: string }>;

export const strings: Dict = {
  appName: { bn: "নিরাপদ ঢাকা", en: "Nirapod Dhaka" },
  tagline: {
    bn: "নাগরিকদের রিপোর্টে গড়া নিরাপত্তা মানচিত্র",
    en: "A public safety map built from citizen reports",
  },
  heroLead: {
    bn: "খোলা ম্যানহোল, ভাঙা রাস্তা, ছিনতাই বা দুর্ঘটনা — অবস্থান ও ছবি দিয়ে জানান। রিপোর্ট সরাসরি সঠিক কর্তৃপক্ষের কাছে যায়।",
    en: "Open manholes, broken roads, snatching or accidents — report with location and photo. Reports go straight to the right authority.",
  },
  login: { bn: "লগ ইন", en: "Log in" },
  signup: { bn: "অ্যাকাউন্ট খুলুন", en: "Create account" },
  browseMap: { bn: "ম্যাপ দেখুন", en: "Browse the map" },
  logout: { bn: "লগ আউট", en: "Log out" },
  trustedBy: { bn: "তথ্য যায় যাদের কাছে", en: "Reports route to" },
  cityCorp: { bn: "সিটি কর্পোরেশন", en: "City Corporation" },
  dmb: { bn: "দুর্যোগ ব্যবস্থাপনা বোর্ড", en: "Disaster Management Board" },
  police: { bn: "পুলিশ", en: "Police" },
  loopView: { bn: "ঝুঁকি দেখুন", en: "View hazards" },
  loopViewSub: { bn: "আপনার এলাকার লাইভ ম্যাপ", en: "Live map of your area" },
  loopReport: { bn: "রিপোর্ট করুন", en: "Report one" },
  loopReportSub: { bn: "ছবি ও জিপিএস সহ", en: "With photo and GPS" },
  loopSos: { bn: "জরুরি এসওএস", en: "Emergency SOS" },
  loopSosSub: { bn: "নিকটতম থানায় খবর", en: "Alerts the nearest station" },
  findLostPhone: { bn: "হারানো ফোন খুঁজুন", en: "Find a lost phone" },
  noAccountNeeded: { bn: "লগ ইন ছাড়াই", en: "No login needed" },

  email: { bn: "ইমেইল", en: "Email" },
  password: { bn: "পাসওয়ার্ড", en: "Password" },
  fullName: { bn: "পূর্ণ নাম", en: "Full name" },
  phone: { bn: "মোবাইল নম্বর", en: "Mobile number" },
  emergencyContact: { bn: "জরুরি যোগাযোগ", en: "Emergency contact" },
  emergencyContactName: { bn: "জরুরি যোগাযোগের নাম", en: "Emergency contact name" },
  emergencyContactPhone: { bn: "জরুরি যোগাযোগের নম্বর", en: "Emergency contact number" },
  emergencyWhy: {
    bn: "এসওএস পাঠালে এই ব্যক্তিকে জানানো হবে।",
    en: "This person is alerted when you send an SOS.",
  },
  haveAccount: { bn: "অ্যাকাউন্ট আছে? লগ ইন করুন", en: "Already have an account? Log in" },
  needAccount: { bn: "নতুন? অ্যাকাউন্ট খুলুন", en: "New here? Create an account" },
  checkEmail: {
    bn: "ইমেইল দেখুন — নিশ্চিতকরণ লিঙ্ক পাঠানো হয়েছে।",
    en: "Check your email — we sent a confirmation link.",
  },

  all: { bn: "সব", en: "All" },
  crime: { bn: "অপরাধ", en: "Crime" },
  infrastructure: { bn: "অবকাঠামো", en: "Infrastructure" },
  accident: { bn: "দুর্ঘটনা", en: "Accident" },
  resolved: { bn: "সমাধান হয়েছে", en: "Resolved" },
  sent: { bn: "পাঠানো হয়েছে", en: "Sent" },
  received: { bn: "গৃহীত", en: "Received" },
  status: { bn: "অবস্থা", en: "Status" },
  confirm: { bn: "সত্য", en: "Confirm" },
  dispute: { bn: "ভুল", en: "Dispute" },
  reportHazard: { bn: "ঝুঁকি জানান", en: "Report a hazard" },
  newReport: { bn: "নতুন রিপোর্ট", en: "New report" },
  chooseType: { bn: "ধরন বাছুন", en: "Choose a type" },
  subtype: { bn: "কী ধরনের", en: "What kind" },
  description: { bn: "সংক্ষিপ্ত বিবরণ", en: "Short description" },
  addPhoto: { bn: "ছবি যোগ করুন", en: "Add a photo" },
  dragPin: { bn: "পিন সরিয়ে সঠিক জায়গা দিন", en: "Drag the pin to the exact spot" },
  submit: { bn: "পাঠান", en: "Send report" },
  sending: { bn: "পাঠানো হচ্ছে…", en: "Sending…" },
  reportSent: { bn: "রিপোর্ট পাঠানো হয়েছে", en: "Report sent" },
  cancel: { bn: "বাতিল", en: "Cancel" },
  loginToAct: { bn: "কাজ করতে লগ ইন করুন", en: "Log in to take action" },

  sos: { bn: "এসওএস", en: "SOS" },
  sosConfirmTitle: {
    bn: "লাইভ লোকেশনসহ এসওএস পাঠাবেন?",
    en: "Send SOS with your live location?",
  },
  sosConfirmBody: {
    bn: "নিকটতম থানা ও আপনার জরুরি যোগাযোগকে সঙ্গে সঙ্গে জানানো হবে।",
    en: "The nearest police station and your emergency contact will be alerted immediately.",
  },
  sendSos: { bn: "এসওএস পাঠান", en: "Send SOS" },
  sosLive: { bn: "এসওএস সক্রিয়", en: "SOS active" },
  sosNotified: {
    bn: "থানায় খবর দেওয়া হয়েছে · আপনার যোগাযোগকে জানানো হয়েছে",
    en: "Police station notified · your contact has been alerted",
  },
  nearestStation: { bn: "নিকটতম থানা", en: "Nearest police station" },
  liveLocation: { bn: "লাইভ অবস্থান", en: "Live location" },
  endSos: { bn: "এসওএস বন্ধ করুন", en: "End SOS" },

  callAmbulance: { bn: "নিকটতম অ্যাম্বুলেন্স ডাকুন", en: "Call nearest ambulance" },
  nearbyHospitals: { bn: "কাছের হাসপাতাল", en: "Nearby hospitals" },
  beds: { bn: "শয্যা", en: "Beds" },
  icu: { bn: "আইসিইউ", en: "ICU" },
  available: { bn: "খালি আছে", en: "Available" },
  full: { bn: "খালি নেই", en: "Full" },
  done: { bn: "ঠিক আছে", en: "Done" },

  lostPhoneTitle: { bn: "হারানো ফোন খুঁজুন", en: "Find a lost phone" },
  lostPhoneBody: {
    bn: "হারানো ফোনের নম্বর দিন। একটি লিঙ্ক তৈরি হবে — সেটি ফোনটির কাছে থাকা কাউকে পাঠান।",
    en: "Enter the number tied to the lost device. We generate a link you can share with whoever has the phone.",
  },
  phoneNumber: { bn: "ফোন নম্বর", en: "Phone number" },
  generateLink: { bn: "লিঙ্ক তৈরি করুন", en: "Generate link" },
  copyLink: { bn: "লিঙ্ক কপি করুন", en: "Copy link" },
  copied: { bn: "কপি হয়েছে", en: "Copied" },
  shareHint: {
    bn: "এসএমএস বা হোয়াটসঅ্যাপে পাঠান। লিঙ্ক খুললে ডিভাইসের সর্বশেষ অবস্থান দেখা যাবে।",
    en: "Send it over SMS or WhatsApp. Opening the link shows the device's last known location.",
  },
  locating: { bn: "অবস্থান নেওয়া হচ্ছে…", en: "Getting location…" },
  lastKnown: { bn: "সর্বশেষ জানা অবস্থান", en: "Last known location" },
  shareThisLocation: { bn: "এই অবস্থান শেয়ার করুন", en: "Share this location" },

  myReports: { bn: "আমার রিপোর্ট", en: "My reports" },
  profile: { bn: "প্রোফাইল", en: "Profile" },
  settings: { bn: "সেটিংস", en: "Settings" },
  save: { bn: "সংরক্ষণ", en: "Save" },
  saved: { bn: "সংরক্ষিত হয়েছে", en: "Saved" },
  noReports: { bn: "এখনও কোনো রিপোর্ট নেই", en: "No reports yet" },
  textSize: { bn: "লেখার আকার", en: "Text size" },
  highContrast: { bn: "উচ্চ কনট্রাস্ট", en: "High contrast" },
  normal: { bn: "স্বাভাবিক", en: "Normal" },
  large: { bn: "বড়", en: "Large" },
  xlarge: { bn: "অতি বড়", en: "Extra large" },
  language: { bn: "ভাষা", en: "Language" },

  dashboard: { bn: "ড্যাশবোর্ড", en: "Dashboard" },
  activeSos: { bn: "সক্রিয় এসওএস", en: "Active SOS alerts" },
  crimeFeed: { bn: "অপরাধ রিপোর্ট", en: "Crime reports" },
  hotspots: { bn: "চিহ্নিত হটস্পট", en: "Flagged hotspots" },
  markReceived: { bn: "গৃহীত চিহ্নিত করুন", en: "Mark received" },
  markResolved: { bn: "সমাধান হয়েছে", en: "Resolve" },
  viewOnMap: { bn: "ম্যাপে দেখুন", en: "View on map" },
  totalOpen: { bn: "মোট চলমান", en: "Total open" },
  resolvedThisMonth: { bn: "এ মাসে সমাধান", en: "Resolved this month" },
  overrideStatus: { bn: "অবস্থা পরিবর্তন", en: "Override status" },
  allStreams: { bn: "সব রিপোর্ট", en: "All streams" },
  infraOnly: { bn: "অবকাঠামো রিপোর্ট", en: "Infrastructure reports" },
  upvotes: { bn: "সমর্থন", en: "Confirmations" },
  noItems: { bn: "কিছু নেই", en: "Nothing here" },
  back: { bn: "ফিরে যান", en: "Back" },
  map: { bn: "ম্যাপ", en: "Map" },
  hotzone: { bn: "ঝুঁকিপূর্ণ এলাকা", en: "Hotzone" },

  /* ── Authority dashboard strings ── */
  dbSideLiveMap: { bn: "লাইভ ম্যাপ", en: "Live Map" },
  dbSideReports: { bn: "রিপোর্ট", en: "Reports" },
  dbSideTasks: { bn: "টাস্ক", en: "Tasks" },
  dbSideAnalytics: { bn: "বিশ্লেষণ", en: "Analytics" },
  dbSideNotifications: { bn: "বিজ্ঞপ্তি", en: "Notifications" },
  dbSideSettings: { bn: "সেটিংস", en: "Settings" },

  kpiOpenReports: { bn: "চলমান রিপোর্ট", en: "Open Reports" },
  kpiPending: { bn: "অপেক্ষমাণ", en: "Pending" },
  kpiResolvedToday: { bn: "আজ সমাধান", en: "Resolved Today" },
  kpiAvgResponse: { bn: "গড় প্রতিক্রিয়া", en: "Avg Response" },
  kpiNewToday: { bn: "আজ নতুন", en: "New Today" },
  kpiHighPriority: { bn: "উচ্চ অগ্রাধিকার", en: "High Priority" },
  kpiSosAlerts: { bn: "এসওএস সতর্কতা", en: "SOS Alerts" },
  kpiTotalReports: { bn: "মোট রিপোর্ট", en: "Total Reports" },

  actionReceive: { bn: "গ্রহণ করুন", en: "Receive" },
  actionAssign: { bn: "বরাদ্দ করুন", en: "Assign" },
  actionResolve: { bn: "সমাধান", en: "Resolve" },
  actionReject: { bn: "বাতিল", en: "Reject" },
  actionEscalate: { bn: "উচ্চতর পর্যায়ে পাঠান", en: "Escalate" },
  actionNavigate: { bn: "নেভিগেট", en: "Navigate" },
  actionContactReporter: { bn: "রিপোর্টারের সাথে যোগাযোগ", en: "Contact Reporter" },
  actionViewEvidence: { bn: "প্রমাণ দেখুন", en: "View Evidence" },
  actionAssignTeam: { bn: "দল বরাদ্দ", en: "Assign Team" },
  actionDeployResponse: { bn: "প্রতিক্রিয়া পাঠান", en: "Deploy Response" },
  actionRequestBackup: { bn: "ব্যাকআপ অনুরোধ", en: "Request Backup" },
  actionTransfer: { bn: "স্থানান্তর", en: "Transfer" },
  actionInProgress: { bn: "চলমান", en: "In Progress" },
  actionOpen: { bn: "খুলুন", en: "Open" },

  notifNewReport: { bn: "নতুন রিপোর্ট পাওয়া গেছে", en: "New report received" },
  notifSosActive: { bn: "এসওএস সক্রিয়", en: "SOS activated" },
  notifOfficerAssigned: { bn: "কর্মকর্তা বরাদ্দ হয়েছে", en: "Officer assigned" },
  notifReportVerified: { bn: "রিপোর্ট যাচাই হয়েছে", en: "Report verified" },
  notifHighPriority: { bn: "উচ্চ অগ্রাধিকার সতর্কতা", en: "High priority alert" },
  notifInfraEscalation: { bn: "অবকাঠামো উচ্চতর পর্যায়ে", en: "Infrastructure escalation" },
  notifToday: { bn: "আজ", en: "Today" },
  notifYesterday: { bn: "গতকাল", en: "Yesterday" },
  notifThisWeek: { bn: "এই সপ্তাহে", en: "This week" },

  chartWeeklyReports: { bn: "সাপ্তাহিক রিপোর্ট", en: "Weekly Reports" },
  chartMonthlyTrends: { bn: "মাসিক প্রবণতা", en: "Monthly Trends" },
  chartCategoryDist: { bn: "ক্যাটাগরি বিন্যাস", en: "Category Distribution" },
  chartResolutionRate: { bn: "সমাধানের হার", en: "Resolution Rate" },
  chartAvgResponseTime: { bn: "গড় প্রতিক্রিয়া সময়", en: "Avg Response Time" },
  chartDistrictPerf: { bn: "জেলা পারফরম্যান্স", en: "District Performance" },
  chartPeriod7d: { bn: "৭ দিন", en: "7 days" },
  chartPeriod30d: { bn: "৩০ দিন", en: "30 days" },
  chartPeriod90d: { bn: "৯০ দিন", en: "90 days" },

  searchGlobal: { bn: "রিপোর্ট, এলাকা, ক্যাটাগরি খুঁজুন…", en: "Search reports, areas, categories…" },
  searchNoResults: { bn: "কিছু পাওয়া যায়নি", en: "No results found" },

  rolePolice: { bn: "বাংলাদেশ পুলিশ", en: "Bangladesh Police" },
  roleDmb: { bn: "দুর্যোগ ব্যবস্থাপনা ব্যুরো", en: "Disaster Management Bureau" },
  roleCityCorp: { bn: "সিটি কর্পোরেশন", en: "City Corporation" },
  roleCitizen: { bn: "নাগরিক", en: "Citizen" },

  policeActiveSos: { bn: "সক্রিয় এসওএস", en: "Active SOS" },
  policeCrimeMap: { bn: "অপরাধ মানচিত্র", en: "Crime Map" },
  policeNearbyPatrols: { bn: "নিকটবর্তী টহল", en: "Nearby Patrols" },
  policeHighRisk: { bn: "উচ্চ ঝুঁকি হটস্পট", en: "High Risk Hotspots" },
  policeOfficerAssignment: { bn: "কর্মকর্তা বরাদ্দ", en: "Officer Assignments" },
  policeResponseTimeline: { bn: "প্রতিক্রিয়া টাইমলাইন", en: "Response Timeline" },

  dmbFloodReports: { bn: "বন্যা রিপোর্ট", en: "Flood Reports" },
  dmbFireReports: { bn: "অগ্নিকাণ্ড রিপোর্ট", en: "Fire Reports" },
  dmbCollapseReports: { bn: "ভবন ধস রিপোর্ট", en: "Collapse Reports" },
  dmbEmergencyReq: { bn: "জরুরি অনুরোধ", en: "Emergency Requests" },
  dmbHazardZones: { bn: "ঝুঁকিপূর্ণ এলাকা", en: "Hazard Zones" },
  dmbCoordination: { bn: "সমন্বয় কার্যক্রম", en: "Coordination Tasks" },

  ccExecOverview: { bn: "নির্বাহী সারসংক্ষেপ", en: "Executive Overview" },
  ccDeptPerformance: { bn: "বিভাগীয় পারফরম্যান্স", en: "Department Performance" },
  ccInfraIssues: { bn: "অবকাঠামো সমস্যা", en: "Infrastructure Issues" },
  ccRoadDamage: { bn: "রাস্তার ক্ষতি", en: "Road Damage" },
  ccDrainage: { bn: "ড্রেনেজ", en: "Drainage" },
  ccGarbage: { bn: "বর্জ্য", en: "Garbage" },
  ccStreetLights: { bn: "সড়কবাতি", en: "Street Lights" },
  ccPendingWorkOrders: { bn: "অপেক্ষমাণ কাজ", en: "Pending Work Orders" },
  ccMonthlyPerformance: { bn: "মাসিক পারফরম্যান্স", en: "Monthly Performance" },
  ccTopHotspots: { bn: "শীর্ষ হটস্পট", en: "Top Hotspots" },

  tlSubmitted: { bn: "রিপোর্ট জমা", en: "Report Submitted" },
  tlVerified: { bn: "সম্প্রদায় যাচাই", en: "Community Verified" },
  tlReceived: { bn: "কর্তৃপক্ষ গ্রহণ", en: "Authority Received" },
  tlAssigned: { bn: "কর্মকর্তা বরাদ্দ", en: "Officer Assigned" },
  tlInProgress: { bn: "কাজ চলছে", en: "Work In Progress" },
  tlResolved: { bn: "সমাধান হয়েছে", en: "Resolved" },
  tlClosed: { bn: "বন্ধ", en: "Closed" },

  verificationScore: { bn: "যাচাই স্কোর", en: "Verification Score" },
  internalNotes: { bn: "অভ্যন্তরীণ নোট", en: "Internal Notes" },
  addNote: { bn: "নোট যোগ করুন", en: "Add Note" },
  reportDetails: { bn: "রিপোর্টের বিবরণ", en: "Report Details" },
  evidence: { bn: "প্রমাণ", en: "Evidence" },
  nearbyReports: { bn: "নিকটবর্তী রিপোর্ট", en: "Nearby Reports" },
  assignedDepartment: { bn: "দায়িত্বপ্রাপ্ত বিভাগ", en: "Assigned Department" },
  bulkSelect: { bn: "একাধিক নির্বাচন", en: "Bulk Select" },
  filterBy: { bn: "ফিল্টার", en: "Filter by" },
  sortBy: { bn: "সাজান", en: "Sort by" },
  newest: { bn: "নতুন", en: "Newest" },
  oldest: { bn: "পুরাতন", en: "Oldest" },
  priority: { bn: "অগ্রাধিকার", en: "Priority" },
  minutes: { bn: "মিনিট", en: "min" },
  hours: { bn: "ঘণ্টা", en: "hrs" },

  searchPlaceholder: {
    bn: "বিপদ, রাস্তা, স্থান খুঁজুন...",
    en: "Search hazards, roads, places...",
  },
  dhaka: { bn: "ঢাকা", en: "Dhaka" },
  alerts: { bn: "অ্যালার্ট", en: "Alerts" },
  nearby: { bn: "আশপাশে", en: "Nearby" },
  reportCategories: { bn: "রিপোর্টের ক্যাটাগরি", en: "Report Categories" },
  mapLayers: { bn: "ম্যাপ লেয়ার", en: "Map Layers" },
  mapLabels: { bn: "ম্যাপ লেবেল", en: "Map Labels" },
  heatmap: { bn: "হিটম্যাপ", en: "Heatmap" },
  reportClusters: { bn: "রিপোর্ট ক্লাস্টার", en: "Report Clusters" },
  communityVerification: { bn: "কমিউনিটি যাচাইকরণ", en: "Community Verification" },
  verifiedByPrefix: { bn: "যাচাই করেছেন", en: "Verified by" },
  verifiedBySuffix: { bn: "জন", en: "people" },
  assignedTo: { bn: "দায়িত্বপ্রাপ্ত", en: "Assigned To" },
  cityCorpName: { bn: "সিটি কর্পোরেশন, ঢাকা", en: "City Corporation, Dhaka" },
  workInProgress: { bn: "কাজ চলছে", en: "Work in progress" },
  actions: { bn: "পদক্ষেপ", en: "Actions" },
  share: { bn: "শেয়ার", en: "Share" },
  navigateAction: { bn: "নেভিগেট", en: "Navigate" },
  activityTimeline: { bn: "কাজের টাইমলাইন", en: "Activity Timeline" },
  reportSubmitted: { bn: "রিপোর্ট জমা দেওয়া হয়েছে", en: "Report submitted" },
  verifiedByCommunity: { bn: "কমিউনিটি দ্বারা যাচাইকৃত", en: "Verified by community" },
  justNow: { bn: "এইমাত্র", en: "Just now" },
  assignedToAuthority: { bn: "কর্তৃপক্ষের কাছে হস্তান্তরিত", en: "Assigned to authority" },
  whatToReport: { bn: "আপনি কী রিপোর্ট করতে চান?", en: "What do you want to report?" },
  selectCategory: {
    bn: "সমস্যার সাথে সবচেয়ে ভালো মেলে এমন ক্যাটাগরি বেছে নিন",
    en: "Select the category that best matches the issue",
  },
  takeClearPhoto: { bn: "একটি পরিষ্কার ছবি তুলুন", en: "Take a clear photo" },
  makeSureVisible: {
    bn: "নিশ্চিত করুন সমস্যাটি স্পষ্টভাবে দেখা যাচ্ছে",
    en: "Make sure the issue is clearly visible",
  },
  addDetails: { bn: "বিস্তারিত যোগ করুন", en: "Add details" },
  whereIsHappening: { bn: "কোথায় এবং কী ঘটছে?", en: "Where and what is happening?" },
  skipStep: { bn: "এই ধাপ এড়িয়ে যান", en: "Skip this step" },
  next: { bn: "পরবর্তী", en: "Next" },
  inProgress: { bn: "চলমান", en: "In Progress" },
  rejected: { bn: "বাতিল", en: "Rejected" },
  verified: { bn: "যাচাইকৃত", en: "verified" },
  descriptionRequired: { bn: "সংক্ষিপ্ত বিবরণ লিখুন", en: "Add a short description" },
  locationUpdating: { bn: "অবস্থান হালনাগাদ হচ্ছে", en: "Location still updating" },

  howItWorks: { bn: "কিভাবে কাজ করে", en: "How it works" },
  features: { bn: "সুবিধাসমূহ", en: "Features" },
  stats: { bn: "পরিসংখ্যান", en: "Statistics" },
  helpCenter: { bn: "সাহায্য কেন্দ্র", en: "Help Center" },
  heroTitle1: { bn: "প্রতিটি রিপোর্ট", en: "Every report" },
  heroTitle2: { bn: "কারও না কারও", en: "saves" },
  heroTitle3: { bn: "জীবন রক্ষা করে", en: "someone's life" },
  heroDesc: {
    bn: "অপরাধ, দুর্ঘটনা ও অবকাঠামোগত সমস্যা রিপোর্ট করুন।\nআপনার রিপোর্ট কর্তৃপক্ষকে দ্রুত ব্যবস্থা নিতে সাহায্য করে।",
    en: "Report crimes, accidents and infrastructure issues.\nYour report helps authorities take rapid action.",
  },
  reportNow: { bn: "রিপোর্ট করুন", en: "Report Now" },
  viewLiveMap: { bn: "লাইভ ম্যাপ দেখুন", en: "View Live Map" },
  emergencySos: { bn: "জরুরি SOS", en: "Emergency SOS" },
  safe: { bn: "নিরাপদ", en: "Safe" },
  reliable: { bn: "নির্ভরযোগ্য", en: "Reliable" },
  forEveryone: { bn: "সবার জন্য", en: "For Everyone" },
  workingTogether: { bn: "একসাথে কাজ করছে", en: "Working Together" },
  bdPolice: { bn: "বাংলাদেশ পুলিশ", en: "Bangladesh Police" },
  healthEmergency: { bn: "স্বাস্থ্য ও জরুরি সেবা", en: "Health & Emergency Services" },
  totalReports: { bn: "মোট রিপোর্ট", en: "Total Reports" },
  resolvedCount: { bn: "সমাধান হয়েছে", en: "Resolved" },
  communityConfirmation: { bn: "সম্প্রদায়ের নিশ্চিতকরণ", en: "Community Confirmations" },
  activeCitizens: { bn: "সক্রিয় নাগরিক", en: "Active Citizens" },
  step1Title: { bn: "রিপোর্ট করুন", en: "Report" },
  step1Desc: { bn: "সমস্যার ছবি তুলে রিপোর্ট পাঠান", en: "Take a photo and send a report" },
  step2Title: { bn: "সম্প্রদায় নিশ্চিত করে", en: "Community Verifies" },
  step2Desc: {
    bn: "আপনার রিপোর্ট দেখে নাগরিকরা নিশ্চিত বা বিরোধিতা করে",
    en: "Citizens confirm or dispute based on your report",
  },
  step3Title: { bn: "কর্তৃপক্ষ ব্যবস্থা নেয়", en: "Authority Acts" },
  step3Desc: {
    bn: "সঠিক বিভাগে রিপোর্ট পাঠানো হয় ও তারা ব্যবস্থা গ্রহণ করে",
    en: "Report is routed to the right department for action",
  },
  step4Title: { bn: "সমস্যা সমাধান", en: "Problem Resolved" },
  step4Desc: {
    bn: "সমাধান হলে আপনি নোটিফিকেশন পাবেন",
    en: "You get notified when the issue is resolved",
  },
  recentActivity: { bn: "সাম্প্রতিক কার্যক্রম", en: "Recent Activity" },
  seeAll: { bn: "সব দেখুন", en: "See All" },
  openManhole: { bn: "খোলা ম্যানহোল", en: "Open Manhole" },
  dhanmondiDhaka: { bn: "ধানমন্ডি, ঢাকা", en: "Dhanmondi, Dhaka" },
  twoMinsAgo: { bn: "২ মিনিট আগে", en: "2 mins ago" },
  statusConfirmed: { bn: "নিশ্চিত হয়েছে", en: "Confirmed" },
  eighteenConfirmed: { bn: "১৮ জন নিশ্চিত করেছেন", en: "18 people confirmed" },
  roadAccidentLabel: { bn: "সড়ক দুর্ঘটনা", en: "Road Accident" },
  farmgateDhaka: { bn: "ফার্মগেট, ঢাকা", en: "Farmgate, Dhaka" },
  sixMinsAgo: { bn: "৬ মিনিট আগে", en: "6 mins ago" },
  policeNotified: { bn: "পুলিশকে জানানো হয়েছে", en: "Police Notified" },
  policeActionTaken: { bn: "পুলিশ ব্যবস্থা নিয়েছে", en: "Police took action" },
  brokenDrain: { bn: "ড্রেন ভাঙা", en: "Broken Drain" },
  mirpur10Dhaka: { bn: "মিরপুর ১০, ঢাকা", en: "Mirpur 10, Dhaka" },
  twentyMinsAgo: { bn: "২০ মিনিট আগে", en: "20 mins ago" },
  underAuthorityReview: { bn: "কর্তৃপক্ষের রিভিউতে", en: "Under Authority Review" },
  cityCorpLooking: { bn: "সিটি কর্পোরেশন দেখছে", en: "City Corporation is looking" },
  snatchingAttempt: { bn: "ছিনতাইয়ের চেষ্টা", en: "Snatching Attempt" },
  gulshan1Dhaka: { bn: "গুলশান ১, ঢাকা", en: "Gulshan 1, Dhaka" },
  thirtyFiveMinsAgo: { bn: "৩৫ মিনিট আগে", en: "35 mins ago" },
  thirtyTwoConfirmed: { bn: "৩২ জন নিশ্চিত করেছেন", en: "32 people confirmed" },
  easyFastForAll: { bn: "সহজ, দ্রুত, সবার জন্য", en: "Easy, Fast, For Everyone" },
  reportInFewSteps: { bn: "মাত্র কয়েকটি ধাপে রিপোর্ট করুন", en: "Report in just a few steps" },
  liveMapLabel: { bn: "লাইভ ম্যাপ", en: "Live Map" },
  createReportLabel: { bn: "রিপোর্ট তৈরি করুন", en: "Create Report" },
  locationDhanmondi: { bn: "স্থান: ধানমন্ডি, ঢাকা", en: "Location: Dhanmondi, Dhaka" },
  addPhotoLabel: { bn: "ছবি যোগ করুন", en: "Add a Photo" },
  sendReportLabel: { bn: "রিপোর্ট পাঠান", en: "Send Report" },
  reportSentTitle: { bn: "রিপোর্ট পাঠানো হয়েছে", en: "Report Sent" },
  reportSentDesc: {
    bn: "আপনার রিপোর্ট কর্তৃপক্ষের কাছে পাঠানো হয়েছে। ধন্যবাদ!",
    en: "Your report has been sent to the authorities. Thank you!",
  },
  okButton: { bn: "ঠিক আছে", en: "Okay" },
  alertPoliceOneTap: { bn: "এক চাপে পুলিশকে জানান", en: "Alert police with one tap" },
  shareRealTimeLocation: { bn: "বাস্তব সময়ে অবস্থান শেয়ার", en: "Share location in real-time" },
  findByPhoneNumber: { bn: "ফোন নম্বর দিয়ে খুঁজে পান", en: "Find using phone number" },
  safePrivate: { bn: "নিরাপদ ও গোপনীয়", en: "Safe & Private" },
  yourDataSecure: { bn: "আপনার তথ্য সুরক্ষিত", en: "Your data is secure" },
  citizensVoice: { bn: "নাগরিকদের কথা", en: "Citizens' Voice" },
  citizensVoiceDesc: {
    bn: "যারা প্রতিদিন এই প্ল্যাটফর্ম ব্যবহার করে শহরকে নিরাপদ করছেন তাদের অভিজ্ঞতা শুনুন।",
    en: "Hear from those who make the city safer every day using this platform.",
  },
  testimonial1: {
    bn: "আমাদের স্কুলের সামনে খোলা ম্যানহোলটি দুইদিনের মধ্যে সমাধান করা হয়েছে। প্ল্যাটফর্মটি সত্যিই কাজ করে।",
    en: "The open manhole in front of our school was fixed in two days. This platform really works.",
  },
  name1: { bn: "রাফিয়া তাসনিম", en: "Rafia Tasnim" },
  role1: { bn: "বাসিন্দা, ধানমন্ডি", en: "Resident, Dhanmondi" },
  testimonial2: {
    bn: "আমরা লোকেশন পাওয়ার সাথে সাথেই ঘটনাস্থলে পৌঁছে যেতে পারি। এই প্ল্যাটফর্মটি আমাদের কাজকে দ্রুততর করেছে।",
    en: "We can reach the spot immediately upon receiving the location. This platform has sped up our work.",
  },
  name2: { bn: "ইন্সপেক্টর মাহমুদ হাসান", en: "Inspector Mahmud Hasan" },
  testimonial3: {
    bn: "নাগরিকদের রিপোর্ট আমাদের কাজ অনেক সহজ করে দেয়। আমরা এখন সঠিক জায়গায় ফোকাস করতে পারি।",
    en: "Citizen reports make our job much easier. We can now focus on the right places.",
  },
  name3: { bn: "মেহেদী হাসান", en: "Mehedi Hasan" },
  footerDesc: {
    bn: "একসাথে গড়ি নিরাপদ বাংলাদেশ। অপরাধ, দুর্ঘটনা ও অবকাঠামোগত সমস্যা রিপোর্ট করুন। আপনার একটি সতর্কবার্তা বাঁচাতে পারে একটি প্রাণ।",
    en: "Let's build a safer Bangladesh together. Report crimes, accidents and infrastructure issues. Your one alert can save a life.",
  },
  platform: { bn: "প্ল্যাটফর্ম", en: "Platform" },
  authoritiesTitle: { bn: "কর্তৃপক্ষ", en: "Authorities" },
  helpAndInfo: { bn: "সাহায্য ও তথ্য", en: "Help & Info" },
  legal: { bn: "আইনি", en: "Legal" },
  emergencyNumbers: { bn: "জরুরি নাম্বারসমূহ", en: "Emergency Numbers" },
  contact: { bn: "যোগাযোগ", en: "Contact" },
  accessibility: { bn: "অ্যাক্সেসিবিলিটি", en: "Accessibility" },
  termsOfUse: { bn: "ব্যবহারের শর্তাবলী", en: "Terms of Use" },
  privacyPolicy: { bn: "গোপনীয়তা নীতি", en: "Privacy Policy" },
  cookiePolicy: { bn: "কুকি নীতি", en: "Cookie Policy" },
  copyright: {
    bn: "© ২০২৪ নিরাপদ শহর. সর্বস্বত্ব সংরক্ষিত।",
    en: "© 2024 Nirapod Dhaka. All rights reserved.",
  },
  aboutUs: { bn: "আমাদের সম্পর্কে", en: "About Us" },
  terms: { bn: "শর্তাবলী", en: "Terms" },
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof strings | string) => string;
  textScale: TextScale;
  setTextScale: (s: TextScale) => void;
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
};

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("bn");
  const [textScale, setScaleState] = useState<TextScale>("base");
  const [highContrast, setContrastState] = useState(false);

  useEffect(() => {
    const l = localStorage.getItem("nd_lang") as Lang | null;
    if (l === "bn" || l === "en") setLangState(l);
    const s = localStorage.getItem("nd_scale") as TextScale | null;
    if (s === "base" || s === "lg" || s === "xl") setScaleState(s);
    setContrastState(localStorage.getItem("nd_contrast") === "1");
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.classList.toggle("text-scale-lg", textScale === "lg");
    root.classList.toggle("text-scale-xl", textScale === "xl");
    root.classList.toggle("contrast-boost", highContrast);
  }, [lang, textScale, highContrast]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("nd_lang", l);
  }, []);
  const setTextScale = useCallback((s: TextScale) => {
    setScaleState(s);
    localStorage.setItem("nd_scale", s);
  }, []);
  const setHighContrast = useCallback((v: boolean) => {
    setContrastState(v);
    localStorage.setItem("nd_contrast", v ? "1" : "0");
  }, []);

  const t = useCallback(
    (key: string) => {
      const entry = strings[key];
      if (!entry) return key;
      return entry[lang];
    },
    [lang],
  );

  const value = useMemo(
    () => ({ lang, setLang, t, textScale, setTextScale, highContrast, setHighContrast }),
    [lang, setLang, t, textScale, setTextScale, highContrast, setHighContrast],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
