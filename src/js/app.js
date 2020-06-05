import Cookies from 'js-cookie'

const currentDate = new Date();
const lockdownStart = new Date('03/23/2020');
const nextReview = new Date('06/18/2020');

const DEFAULT_DAY_MESSAGE = "Day $d";
const DEFAULT_GOV_MESSAGE = "Next government review in $d days";

var daysSinceStart = Math.ceil(Math.abs(currentDate - lockdownStart) / (1000 * 60 * 60 * 24));
var daysUntilReview = Math.ceil(Math.abs(nextReview - currentDate) / (1000 * 60 * 60 * 24));

//Set the mode initally
var initMode = Cookies.get('mode');
if(initMode != null){
  $("body").addClass(initMode);

  // Set the correct link text
  var link = $("a[data-mode=" + initMode + "]")
  link.text(link.attr("data-off"));
}

// If the share url is set, get that object, otherwise get the cookie object.

var initCustom;

var params = new URLSearchParams(window.location.search);
if (params.has('v')){
  initCustom = GetSharedView(params.get('v'));
}

if(initCustom == null){
  var cookieValue = Cookies.get('customMessages');
  if(cookieValue != null){
    initCustom = JSON.parse(cookieValue);
  }
}

if (initCustom != null){
  setCustomMessages(initCustom);
}else{
  setCustomMessages({});
}


// Atticbay page view
$.ajax({
  method: 'get',
  url: 'https://atticbay.co.uk/ab/resources/aba/pages2.php',
  data: {
	'abaid': "e7bbda6ebb7464ea5f142a25997f3aa2",
	'page': window.location.pathname,
	'from': document.referrer,
	'ajax': true
  },
});

$("#darkLink").click(function () {
	toggleDarkMode();
});

setTimeout(function(){
	$('#daysSince').text(Math.ceil(Math.abs(currentDate - lockdownStart) / (1000 * 60 * 60 * 24)));
	$('#govReview').text(Math.ceil(Math.abs(nextReview - currentDate) / (1000 * 60 * 60 * 24)));
}, 1);

function toggleMode(cssClass, modeLink){
  var body = $("body");
  if(body.hasClass(cssClass)){
    // Turn off the selected mode
    body.removeClass(cssClass);
    Cookies.remove('mode');
    modeLink.text(modeLink.attr("data-on"));
  }else{
    // Switch the other link back to its off value
    var oldLink = $("a[data-mode='" + body.attr("class") + "']");
    oldLink.text(oldLink.attr("data-on"));

    body.removeClass();

    // Turn on the selected mode
    $("body").addClass(cssClass);
    Cookies.set('mode', cssClass, { expires: 365 });
    modeLink.text(modeLink.attr("data-off"));
  }
}

$("a[data-mode]").click(function () {
  toggleMode($(this).attr("data-mode"), $(this));
})

$(".more-settings").click(function (){
  var defaultTxt = "more-settings";

  $("#settings-section").toggleClass("hide");
})

$("#set-messages").click(function (){
  var dayMessage = stripHtml($("#custom-day-message").val());
  var govMessage = stripHtml($("#custom-gov-message").val());

  if (dayMessage.includes("$d")  || dayMessage == null){
    $("#day-message-validation").addClass("hide");
  }else if (dayMessage.length == 0){
    dayMessage = null;
    $("#gov-message-validation").addClass("hide");
  }else{
    $("#day-message-validation").removeClass("hide");
    dayMessage = null;
  }

  if (govMessage.includes("$d")){
    $("#gov-message-validation").addClass("hide");
  }else if (govMessage.length == 0){
    govMessage = null;
    $("#gov-message-validation").addClass("hide");
  }else{
    $("#gov-message-validation").removeClass("hide");
    govMessage = null;
  }

  var customMessages =
  {
    "dayMessage": dayMessage,
    "govMessage": govMessage
  };

  // Set the messages cookie
  Cookies.set('customMessages', JSON.stringify(customMessages), { expires: 365 });

  // Run the method to update the messages
  setCustomMessages(customMessages);
})

$("#reset-messages").click(function(){
  Cookies.remove('customMessages');
  setCustomMessages({})
});

function setCustomMessages(customMessages){
  var dayMessage = customMessages["dayMessage"];
  var govMessage = customMessages["govMessage"];

  if (dayMessage == null){
    dayMessage = "Day $d";
  }

  if (govMessage == null){
    govMessage = "Next government review in $d days"
  }

  // Set the inputs
  $("#custom-day-message").val(dayMessage);
  $("#custom-gov-message").val(govMessage);

  dayMessage = dayMessage.replace('$d', '<span id="daysSince" class="odometer">' + daysSinceStart + '</span>')
  govMessage = govMessage.replace('$d', '<span id="daysSince" class="odometer">' + daysUntilReview + '</span>')

  $("#daysSinceText").html(dayMessage);
  $("#reviewDaysText").html(govMessage);
}

// Share button handler
$("#share-button").click(function (){
  $("#share-url").removeClass("hide");

  var dayMessage = stripHtml($("#custom-day-message").val());
  var govMessage = stripHtml($("#custom-gov-message").val());

  var customMessages =
  {
    "dayMessage" : stripHtml($("#custom-day-message").val()),
    "govMessage" : stripHtml($("#custom-gov-message").val())
  };

  if (dayMessage == DEFAULT_DAY_MESSAGE && govMessage == DEFAULT_GOV_MESSAGE){
    $("#share-url").val("https://lockdowncount.co.uk");
  }else{
    var viewId = InsertSharedView(dayMessage, govMessage);
    $("#share-url").val("https://lockdowncount.co.uk?v=" + viewId);
  }

  // Highlight the text when you click on it
  $("#share-url").select();
})

function GetSharedView(viewId){
  var result = null;
  var scriptUrl = "https://atticbay.co.uk/ab/api/lockdown.php?key=key&action=getview&viewid=" + viewId;
  $.ajax({
    url: scriptUrl,
    type: 'get',
    dataType: 'json',
    async: false,
    success: function(data) {
        result = data;
    }
  });
  return result;
}

function InsertSharedView(day, gov){
  var result = null;
  var scriptUrl = "https://atticbay.co.uk/ab/api/lockdown.php?action=insertview&key=key&day=" + day + "&gov=" + gov;
  $.ajax({
    url: scriptUrl,
    type: 'get',
    dataType: 'json',
    async: false,
    success: function(data) {
        result = data;
    }
  });
  return result["viewid"];
}

function stripHtml(htmlString){
  return htmlString.replace(/<[^>]+>/g, '');
}

function SmoothScroll(anchorId){
  var aTag = $("a[name='"+ anchorId +"']");
  $('html,body').animate({scrollTop: aTag.offset().top},'slow');
}

$(".smooth").click(function () {
  SmoothScroll($(this).attr("href").substr(1));
})
