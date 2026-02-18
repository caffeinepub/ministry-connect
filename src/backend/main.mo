import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Iter "mo:core/Iter";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type PrayerId = Nat;

  type PrayerRequest = {
    text : Text;
    timestamp : Int;
  };

  type PrayerResponse = {
    text : Text;
    timestamp : Int;
  };

  public type PrayerEntry = {
    prayerId : PrayerId;
    request : PrayerRequest;
    response : PrayerResponse;
    user : Principal;
  };

  public type UserProfile = {
    name : Text;
  };

  var currentPrayerId : PrayerId = 0;
  let prayers = Map.empty<PrayerId, PrayerEntry>();
  let userPrayers = Map.empty<Principal, [PrayerId]>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func submitPrayer(requestText : Text) : async PrayerId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit prayers");
    };

    let prayerId = currentPrayerId;
    currentPrayerId += 1;

    let prayerRequest : PrayerRequest = {
      text = requestText;
      timestamp = Time.now();
    };

    let prayerResponse : PrayerResponse = {
      text = generatePrayerResponse(requestText);
      timestamp = Time.now();
    };

    let prayerEntry : PrayerEntry = {
      prayerId;
      request = prayerRequest;
      response = prayerResponse;
      user = caller;
    };

    prayers.add(prayerId, prayerEntry);

    let existingPrayers = switch (userPrayers.get(caller)) {
      case (null) { [] };
      case (?prayerIds) { prayerIds };
    };
    let updatedPrayers = existingPrayers.concat([prayerId]);
    userPrayers.add(caller, updatedPrayers);

    prayerId;
  };

  public query ({ caller }) func getPrayer(prayerId : PrayerId) : async PrayerEntry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view prayers");
    };

    switch (prayers.get(prayerId)) {
      case (null) { Runtime.trap("Prayer not found") };
      case (?prayerEntry) {
        // Verify ownership: caller must be the prayer owner or an admin
        if (caller != prayerEntry.user and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own prayers");
        };
        prayerEntry;
      };
    };
  };

  public query ({ caller }) func getPrayerHistory() : async [PrayerEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view prayer history");
    };

    let prayerIds = switch (userPrayers.get(caller)) {
      case (null) { return [] };
      case (?ids) { ids };
    };

    let entriesIter = prayerIds.values().map(
      func(id) {
        prayers.get(id);
      }
    ).filter(
      func(entry) {
        switch (entry) {
          case (null) { false };
          case (_) { true };
        };
      }
    ).map(
      func(entry) {
        switch (entry) {
          case (null) { Runtime.unreachable() };
          case (?prayerEntry) { prayerEntry };
        };
      }
    );

    entriesIter.toArray();
  };

  func generatePrayerResponse(prayerText : Text) : Text {
    let templates = [
      "Heavenly Father, we lift up this request to You...",
      "Lord, we ask for Your guidance and wisdom...",
      "God, we trust in Your plan and seek Your peace...",
      "Holy Spirit, bring comfort and clarity to this situation...",
    ];

    let keywords = [
      ("anxiety", "May God's peace calm any anxious thoughts."),
      ("healing", "We pray for physical and emotional healing."),
      ("guidance", "May the Lord provide clear direction and wisdom."),
      ("strength", "Asking for strength to face challenges ahead."),
      ("forgiveness", "Seeking forgiveness and restoration in relationships."),
      ("gratitude", "Praising God for the blessings in life."),
    ];

    let lowerText = prayerText.toLower();
    var matchedKeyword = "May God's peace be with you.";

    for ((key, response) in keywords.vals()) {
      if (lowerText.contains(#text key)) {
        matchedKeyword := response;
      };
    };

    let templateIndex = Int.abs(prayerText.size()) % templates.size();
    let selectedTemplate = templates[templateIndex];

    selectedTemplate # "\n\n" # matchedKeyword;
  };
};
