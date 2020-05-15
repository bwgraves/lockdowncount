import Cookies from 'js-cookie'

const currentDate = new Date();
const lockdownStart = new Date('03/23/2020');
const nextReview = new Date('05/28/2020');

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

var initCustom = Cookies.get('customMessages');
if(initCustom != null){
  setCustomMessages(JSON.parse(initCustom));
}else{
  setDefaultMessages();
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
	console.log("clicked");
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
  console.log("you clicked " + $(this).attr("data-mode"))
  toggleMode($(this).attr("data-mode"), $(this));
})

$(".more-settings").click(function (){
  var defaultTxt = "more-settings";

  $("#settings-section").toggleClass("hide");
})

$("#set-messages").click(function (){
  // Please please clean first

  var customMessages =
  {
    "dayMessage": stripHtml($("#custom-day-message").val()),
    "govMessage": stripHtml($("#custom-gov-message").val())
  };

  // Set the messages cookie
  Cookies.set('customMessages', JSON.stringify(customMessages), { expires: 365 });

  console.log("the text is" + $("#custom-day-message").text())

  // Run the method to update the messages
  setCustomMessages(customMessages);
})

$("#reset-messages").click(function(){
  Cookies.remove('customMessages');
  setDefaultMessages()
});

function setDefaultMessages(){
  // Set the messages on the page
  $("#daysSinceText").html('Day ' + '<span id="daysSince" class="odometer">' + daysSinceStart + '</span>')
  $("#reviewDaysText").html('Next government review in ' + '<span id="daysSince" class="odometer">' + daysUntilReview + '</span> days')
}

function setCustomMessages(customMessages){
  var dayMessage = customMessages["dayMessage"];
  var govMessage = customMessages["govMessage"];

  // Set the inputs
  $("#custom-day-message").text(dayMessage);
  $("#custom-gov-message").text(govMessage);

  if (dayMessage.includes("$d")){
    dayMessage = dayMessage.replace('$d', '<span id="daysSince" class="odometer">' + daysSinceStart + '</span>')
    $("#daysSinceText").html(dayMessage);
    $("#day-message-validation").addClass("hide");
  }else{
    $("#day-message-validation").removeClass("hide");
  }

  if (govMessage.includes("$d")){
    govMessage = govMessage.replace('$d', '<span id="daysSince" class="odometer">' + daysUntilReview + '</span>')
    $("#reviewDaysText").html(govMessage);
    $("#gov-message-validation").addClass("hide");
  }else{
    $("#gov-message-validation").removeClass("hide");
  }
}

function stripHtml(htmlString){
  return htmlString.replace(/<[^>]+>/g, '');
}
