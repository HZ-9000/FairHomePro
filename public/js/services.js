function create()
{
  //create div for entry
  var element = document.createElement("DIV");
  element.setAttribute("id", ("entry" + i));
  document.getElementById("JournalEntries").appendChild(element);
  var text = document.createElement("P");
  text.innerHTML = description;
  document.getElementById("entry" + i).appendChild(text);

  //create div for buttons
  var right = document.createElement("DIV");
  right.setAttribute("id", "right-side-button" + i);
  document.getElementById("entry" + i).appendChild(right);

  //create remove button
  var button_remove = document.createElement("BUTTON");
  button_remove.setAttribute("id", "remove");
  button_remove.setAttribute("onclick", "remove(" + i + ")");
  button_remove.innerHTML = "-";
  document.getElementById("right-side-button" + i).appendChild(button_remove);

  //create prioritize button
  var button_prioritize = document.createElement("BUTTON");
  button_prioritize.setAttribute("id", "prioritize");
  button_prioritize.setAttribute("onclick", "prioritize(" + i + ")");
  button_prioritize.innerHTML = "Prioritize";
  document.getElementById("right-side-button" + i).appendChild(button_prioritize);
  i++;
}
