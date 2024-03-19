


export default function branchInit(header) {
  var init = false;
  function initBranch() {
      if (init) {
          return;
      }

      init = true;
      // var getPropertySafely = window.feds.utilities.getPropertySafely;
      (function(b,r,a,n,c,h,_,s,d,k){if(!b[n]||!b[n]._q){for(;s<_.length;)c(h,_[s++]);d=r.createElement(a);d.async=1;d.src="https://cdn.branch.io/branch-latest.min.js";k=r.getElementsByTagName(a)[0];k.parentNode.insertBefore(d,k);b[n]=h}})(window,document,"script","branch",function(b,r){b[r]=function(){b._q.push([r,arguments])}},{_q:[],_v:1},"addListener applyCode autoAppIndex banner closeBanner closeJourney creditHistory credits data deepview deepviewCta first getCode init link logout redeem referrals removeListener sendSMS setBranchViewData setIdentity track validateCode trackCommerceEvent logEvent disableTracking".split(" "), 0);
      var privacyConsent = !!window.adobePrivacy && window.adobePrivacy.hasUserProvidedConsent();
      branch.init("key_test_eaNdoH8nTxeZXfOsgkELrjgpFrhm4q2m", { 'tracking_disabled' : !privacyConsent });
      // header.style.position = 'relative';
      branch.addListener('didShowJourney', function(event) {
          header.style.position = 'relative';
          // if (getPropertySafely(window, 'feds.events.experience')) {
          // feds.components.NavBar.unsetSticky();
          // }
   });
      branch.addListener('didCloseJourney', function(event) {
        header.style.position = 'sticky';
      // feds.components.NavBar.setSticky(); 
  });
  // customJourneyData = 'inherit' == 'custom';
  //     if (customJourneyData) {
  //         branch.setBranchViewData({
  //             data:
  //             {
  //                 "$journeys_title": '',
  //                 "$journeys_description": '',
  //                 "$journeys_button_get_has_app": '',
  //                 "$journeys_button_get_no_app": '',
  //             }
  //         });
  //     }
  }
  ['adobePrivacy:PrivacyConsent', 'adobePrivacy:PrivacyReject', 'adobePrivacy:PrivacyCustom']
      .forEach(function (event) {
          window.addEventListener(event, initBranch);
      });
  // initBranch();
};
