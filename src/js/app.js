import Cookies from 'js-cookie'

//Set the mode initally
var initMode = Cookies.get('mode');
if(initMode != null){
  $("body").addClass(initMode);

  // Set the correct link text
  var link = $("a[data-mode=" + initMode + "]")
  link.text(link.attr("data-off"));
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

const currentDate = new Date();
const lockdownStart = new Date('03/23/2020');
const nextReview = new Date('05/28/2020');
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
