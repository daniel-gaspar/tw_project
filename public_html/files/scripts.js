function openTab(tabName) {
  var i;
  const x = document.getElementsByClassName("tab");
  const y = document.getElementById(tabName);
  for (i = 0; i < x.length; i++) {
    if(x[i].id != tabName) { x[i].style.display = "none"; }
  }
  if (y.style.display == "none") { y.style.display = "block"; }
  else { y.style.display = "none"; }
}

function toggleRuleDisplay(ruleName) {
  const x = document.getElementById(ruleName)
  if (x.style.display == "none") {
    x.style.display = "block";
  }
  else { x.style.display = "none"; }
}