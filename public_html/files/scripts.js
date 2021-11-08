/*function openTab(tabName) {
  var i;
  const x = document.getElementsByClassName("tab");
  const y = document.getElementById(tabName);
  for (i = 0; i < x.length; i++) {
    if(x[i].id != tabName) { x[i].style.display = "none"; }
  }
  if (y.style.display == "none") { y.style.display = "block"; }
  else { y.style.display = "none"; }
}*/

/*function openTab(tabName)
{
    const select = document.getElementById(tabName);
    if(select.classList.contains('active'))
    {
        select.className = select.className.replace( /(?:^|\s)active(?!\S)/g , '' );       
    }
       else
    {
        select.className = "active";       
    }
}*/

function openTab(tabName) { 
  const x = document.getElementById(tabName);
  x.classList.toggle('open');
}

function toggleRuleDisplay(ruleName) {
  const x = document.getElementById(ruleName);
  if(x.className == "rulesListContainer.displayed") {
    x.className = "rulesListContainer";
  }
  else{
    x.className = x.className + ".displayed";
  }
}

function animateAuthAreaButton() {
  const x = document.getElementById("authAreaButton");
  const y = document.getElementById("authArea");
  x.classList.toggle('open');
  y.classList.toggle('open');
}

function slideMenu(){
  $('.navbar').toggleClass('open');
  /*animation for slide down menu*/
}